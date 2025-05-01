
export interface UserLocation {
    id: string;
    region: {
      latitude: number;
      longitude: number;
      latitudeDelta: number;
      longitudeDelta: number;
    };
    isFavorite: boolean;
    name: string;
    message: string;
    timeNotification: number;
    createdAt: number;
}