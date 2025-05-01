import AsyncStorage from '@react-native-async-storage/async-storage';
import { Region } from 'react-native-maps';

type UserLocation = {
    id: string;
    region: Region;
    isFavorite: boolean;
    name: string;
    message: string;
    timeNotification: number;
    createdAt: number;
}

const LOCATIONS_KEY = 'saved_locations';

export const saveLocation = async (location: Omit<UserLocation, 'id' | 'createdAt'>) => {
    try {
        const saved = await AsyncStorage.getItem(LOCATIONS_KEY);
        const locations: UserLocation[] = saved ? JSON.parse(saved) : []

        const newLocation: UserLocation = {
            ...location,
            id: Date.now().toString(),
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

export const updateLocation = async (id: string, updates: Partial<UserLocation>) => {
    try {
        const saved = await AsyncStorage.getItem(LOCATIONS_KEY);
        if (!saved) return null;

        const locations: UserLocation[] = JSON.parse(saved);
        const updated = locations.map(loc =>
            loc.id == id? {...locations, ...updates} : loc
        );

        await AsyncStorage.setItem(LOCATIONS_KEY, JSON.stringify(updated));
        return updated.find( loc => loc.id === id);
    } catch (error) {
        console.log('Failed to load locations', error);
        return [];
    }
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