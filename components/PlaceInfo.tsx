import React, { useState, useEffect, useRef } from 'react';
import MapView, { Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, SafeAreaView, ActivityIndicator, Modal, Button } from 'react-native';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { saveLocation, getLocations } from '../utils/locationStorage';
import { LocationForm } from './LocationForm';
import { UserLocation } from '@/utils/types'; 

interface PlaceInfoProps {
  onClose: () => void;
  selectedLocation: UserLocation | null;
}

export const PlaceInfo = ({ onClose, selectedLocation }: PlaceInfoProps) => {

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

        if (selectedLocation) {
          setRegion({
            latitude: selectedLocation.region.latitude,
            longitude: selectedLocation.region.longitude,
            ...CLOSE_ZOOM
          });
          mapRef.current?.animateToRegion({
            latitude: selectedLocation.region.latitude,
            longitude: selectedLocation.region.longitude,
            ...CLOSE_ZOOM
          }, 1000);
          setIsLoading(false);
          return;
        }
        
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
        initialRegion={region}
        onRegionChangeComplete={(newRegion) => {
          setRegion(newRegion);
        }}
      >
        <View style={styles.centerMarker}>
          <MaterialIcons name="place" size={48} color="red" />
        </View>
      </MapView>

      <View style={styles.modalButtons}>
        <Button title="Cancel" onPress={onClose}  />
        <Button 
          title="Save This Location" 
          onPress={() => setShowForm(true)} 
        />
      </View>
      <Modal visible={showForm} animationType="slide">
        <SafeAreaView style={styles.saveForm}>
          <LocationForm
            onSubmit={handleSaveLocation}
            onCancel={() => setShowForm(false)}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  saveForm: {
    flex: 1
  },
  container: {
    flex: 1,
    position: 'relative'
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  centerMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    zIndex: 1,
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
  modalButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white'
  }
});