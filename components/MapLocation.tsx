import React, { useState, useEffect, useRef } from 'react';
import MapView, { Region, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';


export const MapLocation = () => {

  const CLOSE_ZOOM = {
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const DEFAULT_REGION = {
    latitude: 37.78825,
    longitude: -122.4324,
    ...CLOSE_ZOOM 
  };

  const Theme = {
    maps: {
      lightMode: [
        {
          "elementType": "geometry",
          "stylers": [
            { "color": "#f5f5f5" }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            { "visibility": "off" }
          ]
        }
      ]
    }
  };
  
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const mapRef = useRef<MapView>(null);
  
  
  const onRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setIsLoading(false);
        setRegion(DEFAULT_REGION);
        mapRef.current?.animateToRegion(DEFAULT_REGION, 1000);
        return;
      }
      try {
        let location = await Location.getCurrentPositionAsync({
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
        setErrorMsg('Could not fetch location');
        setRegion(DEFAULT_REGION);
        mapRef.current?.animateToRegion(DEFAULT_REGION, 1000);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <MapView 
        ref={mapRef}
        //provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
        zoomEnabled={true}
        mapType={'standard'}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
        showsPointsOfInterest={false}
        showsIndoorLevelPicker={false}
        customMapStyle={Theme.maps.lightMode}
      >
        <Marker
            anchor={{ x: 0.5, y: 0.5 }}
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            title="Your Location"
            description="This is your current position"
          >
            <View style={styles.marker}>
              <View style={styles.markerInner} />
            </View>
          </Marker>
      </MapView>
  );

};


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  }
});