import AsyncStorage from '@react-native-async-storage/async-storage';
import { Region } from 'react-native-maps';

export interface UserLocation {
    id: string;
    region: Region;
    isFavorite: boolean;
    name: string;
    message: string;
    timeNotification: number;
    createdAt: number;
}

export type NewLocationData = Omit<UserLocation, 'id' | 'createdAt'>;
export type LocationUpdates = Partial<Omit<UserLocation, 'id' | 'createdAt'>>;
export type LocationFormData = (NewLocationData & { id?: never }) | (LocationUpdates & { id: string });

const LOCATIONS_KEY = 'saved_locations';

export const saveLocation = async (location: NewLocationData): Promise<UserLocation> => {
    try {
      const saved = await AsyncStorage.getItem(LOCATIONS_KEY);
      const locations: UserLocation[] = saved ? JSON.parse(saved) : [];
  
      const newLocation: UserLocation = {
        ...location,
        region: {
          latitude: location.region.latitude,
          longitude: location.region.longitude,
          latitudeDelta: location.region.latitudeDelta || 0.005,
          longitudeDelta: location.region.longitudeDelta || 0.005,
        },
        id: generateId(),
        createdAt: Date.now()
      };
  
      await AsyncStorage.setItem(
        LOCATIONS_KEY,
        JSON.stringify([...locations, newLocation])
      );
      return newLocation;
    } catch (error) {
      console.error('Failed to save location', error);
      throw error;
    }
  };

  export const generateId = () => {
    return (
      Date.now().toString(36) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  export const updateLocation = async (
            id: string, 
            updates: LocationUpdates
        ): Promise<UserLocation | null> => {
    const saved = await AsyncStorage.getItem(LOCATIONS_KEY);
    if (!saved) {
        throw new Error('No locations found to update');
    }
    const locations: UserLocation[] = JSON.parse(saved);
    const updated = locations.map(loc =>
        loc.id === id ? { ...loc, ...updates } : loc
    );
    await AsyncStorage.setItem(LOCATIONS_KEY, JSON.stringify(updated));
    const updatedLocation = updated.find(loc => loc.id === id);
    if (!updatedLocation) {
        throw new Error('Updated location not found');
    }
    return updatedLocation;
  };

export const getLocations = async (): Promise<UserLocation[]> => {
  try {
    const saved = await AsyncStorage.getItem(LOCATIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load locations', error);
    return [];
  }
};

export const deleteLocation = async (id: string) => {
    try {
        const saved = await AsyncStorage.getItem(LOCATIONS_KEY);
        if (!saved) return;

        const locations: UserLocation[] = JSON.parse(saved);
        const filtered = locations.filter(loc => loc.id !== id);

        await AsyncStorage.setItem(LOCATIONS_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Failed to delete location', error);
        throw error;
    }
};