import React, { useState, useEffect, useRef } from 'react';
import MapView, { Region, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator, Modal, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { saveLocation, getLocations } from '../utils/locationStorage';
import { LocationForm } from './LocationForm';
import { UserLocation } from '@/utils/types'; 


export const PlaceInfo = () => {

  const CLOSE_ZOOM = {
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const DEFAULT_REGION = {
    latitude: 37.78825,
    longitude: -122.4324,
    ...CLOSE_ZOOM 
  };

  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [savedLocations, setSavedLocations] = useState<UserLocation[]>([]);

  // Load saved locations on mount
  useEffect(() => {
  
    const init = async () => {
      try {
        const locations = await getLocations();
        setSavedLocations(locations);
        
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        
        const location = await Location.getCurrentPositionAsync({ 
          accuracy: Location.Accuracy.High 
        });
        
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          ...CLOSE_ZOOM
        };
        
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
      } catch (error) {
        console.warn('Location error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const handleSaveLocation = async (formData: {
    name: string;
    message: string;
    timeNotification: number;
    isFavorite: boolean;
  }) => {
    try {
      const newLocation = await saveLocation({
        region,
        ...formData
      });
      
      setSavedLocations(prev => [...prev, newLocation]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save location', error);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        // ... other map props
      >
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title="Current Position"
          pinColor="blue"
        />
        
        {savedLocations.map(location => (
          <Marker
            key={location.id}
            coordinate={location.region}
            title={location.name}
            description={location.message}
            pinColor={location.isFavorite ? 'gold' : 'red'}
          />
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => setShowForm(true)}
      >
        <Text style={styles.saveButtonText}>Save This Location</Text>
      </TouchableOpacity>

      <Modal visible={showForm} animationType="slide">
        <LocationForm
          onSubmit={handleSaveLocation}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: 300,
  },
  marker: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    borderWidth: 3,
    borderColor: 'white',
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 30,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});