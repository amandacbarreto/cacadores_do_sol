
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, Modal, Button, StyleSheet } from 'react-native';
import MapView, { Region, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useFonts, Lexend_400Regular } from '@expo-google-fonts/lexend';
import { GradientBackground } from '@/components/GradientBackground';
import { MapLocation } from '@/components/MapLocation';
import { getLocations, deleteLocation } from '../utils/locationStorage';
import { UserLocation } from '@/utils/types'; 
import { LocationForm } from '@/components/LocationForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlaceInfo } from '@/components/PlaceInfo';

export default function Place() {  
  const [locations, setLocations] = useState<UserLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Load saved locations
  useEffect(() => {
    const loadLocations = async () => {
      const savedLocations = await getLocations();
      setLocations(savedLocations);
    };
    loadLocations();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteLocation(id);
    setLocations(prev => prev.filter(loc => loc.id !== id));
  };

  const handleSaveNewLocation = async (data: {
    name: string;
    message: string;
    timeNotification: number;
    isFavorite: boolean;
  }) => {
    if (!selectedLocation) return;
    
    const newLocation = {
      ...selectedLocation,
      ...data
    };
    
    // Save logic would go here (you'll need to implement this)
    // Then refresh the list
    const updatedLocations = await getLocations();
    setLocations(updatedLocations);
    setShowForm(false);
    setShowMap(false);
  };

  return (
    <View style={styles.container}>
      {/* Locations List */}
      <FlatList
        data={locations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.coordinates}>
                {item.region.latitude.toFixed(4)}, {item.region.longitude.toFixed(4)}
              </Text>
              {item.isFavorite && <Text style={styles.favorite}>⭐ Favorite</Text>}
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedLocation(item);
                  setShowMap(true);
                }}
                style={styles.viewButton}
              >
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No saved locations yet</Text>
          </View>
        }
      />

      {/* Add New Location Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setSelectedLocation(null);
          setShowMap(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Add New Location</Text>
      </TouchableOpacity>

      {/* Map Modal for Viewing/Adding Locations */}
      <Modal visible={showMap} animationType="slide">
        <View style={styles.modalContainer}>
          {selectedLocation ? (
            <>
              <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={selectedLocation.region}
              >
                <Marker
                  coordinate={selectedLocation.region}
                  title={selectedLocation.name}
                  description={selectedLocation.message}
                />
              </MapView>
              <View style={styles.modalButtons}>
                <Button title="Close" onPress={() => setShowMap(false)} />
              </View>
            </>
          ) : (
            <>
              <SafeAreaView style={styles.editMapContainer}>
                <PlaceInfo></PlaceInfo>
                <View style={styles.modalButtons}>
                  <Button title="Cancel" onPress={() => setShowMap(false)} />
                  <Button 
                    title="Save This Location" 
                    onPress={() => setShowForm(true)} 
                    disabled={!selectedLocation}
                  />
                </View>
              </SafeAreaView>
            </>
          )}
        </View>
      </Modal>

      {/* Location Form Modal */}
      <Modal visible={showForm} animationType="slide">
        <LocationForm
          onSubmit={handleSaveNewLocation}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  item: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemActions: {
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    color: '#666',
    marginBottom: 4,
  },
  coordinates: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  favorite: {
    color: 'goldenrod',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  viewButton: {
    backgroundColor: '#6200ee',
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
  addButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  editMapContainer: {
    flex: 1
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
  },
});