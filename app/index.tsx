import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts, Lexend_400Regular } from '@expo-google-fonts/lexend';
import { GradientBackground } from '@/components/GradientBackground';
import { getLocations } from '@/utils/locationStorage';
import * as Location from 'expo-location';

export default function Home() {
  
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
  });

  const [sunset, setSunset] = useState<string | null>(null);
  const [civilTwilightEnd, setCivilTwilightEnd] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationInfo, setLocationInfo] = useState({
    name: 'Estácio',
    latitude: 37.78825,
    longitude: -122.4324
  });

  useEffect(() => {
    const fetchSunsetTime = async () => {
      try {
        
        const savedLocations = await getLocations();
        let targetLocation = savedLocations.find(loc => loc.isFavorite);
        if (!targetLocation && savedLocations.length > 0) {
          targetLocation = savedLocations[0];
          setLocationInfo({
            name: targetLocation.name,
            latitude: targetLocation.region.latitude,
            longitude: targetLocation.region.longitude
          });
        }

        if (!targetLocation) {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const position = await Location.getCurrentPositionAsync({});
            setLocationInfo({
              name: 'sua localização',
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          }
        }

        if (targetLocation) {

        }

        const response = await fetch(
          `https://api.sunrise-sunset.org/json?lat=${locationInfo.latitude}&lng=${locationInfo.longitude}&formatted=0`
        );
        const data = await response.json();
        const sunsetUTC = data.results.sunset;
        const civilTwilightEndUTC = data.results.civil_twilight_end;

        const sunsetDate = new Date(sunsetUTC);
        const localSunset = sunsetDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        setSunset(localSunset);

        const civilTwilightDate = new Date(sunsetUTC);
        const localCivilTwilight = civilTwilightDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        setCivilTwilightEnd(localCivilTwilight);
      } catch (error) {
        console.error('Error fetching sunset time:', error);
        setSunset('erro');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSunsetTime();
  }, []);

  if (!fontsLoaded || isLoading) return null;

  return (
    <GradientBackground style={{ 
      flex: 1,
      padding: 20
    }}>
      <View style={styles.content}>
        <View style={{ }}>
          <Text style={{ 
            fontFamily: 'Lexend_400Regular',
            fontSize: 50,
          }}>Olá, </Text>
          <Text style={{ 
            fontFamily: 'Lexend_400Regular',
            fontSize: 30,
          }}>A previsão para o pôr do sol em {locationInfo.name} hoje é às {sunset}</Text>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 40
  }
});
