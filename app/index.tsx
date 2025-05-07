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
    latitude: -22.9969729,
    longitude: -43.3549309
  });

  useEffect(() => {
    const fetchSunsetTime = async () => {
      try {
        const savedLocations = await getLocations();
        let targetLocation = savedLocations.find(loc => loc.isFavorite);

        let finalLocation = {
          name: 'Estácio',
          latitude: -22.9969729,
          longitude: -43.3549309
        };
        
        if (targetLocation) {
          finalLocation = {
            name: targetLocation.name,
            latitude: targetLocation.region.latitude,
            longitude: targetLocation.region.longitude
          };
        } else if (savedLocations.length > 0) {
          finalLocation = {
            name: savedLocations[0].name,
            latitude: savedLocations[0].region.latitude,
            longitude: savedLocations[0].region.longitude
          };
        } else {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const position = await Location.getCurrentPositionAsync({});
            finalLocation = {
              name: 'sua localização',
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
          }
        }
        
        setLocationInfo(finalLocation);

        const response = await fetch(
          `https://api.sunrise-sunset.org/json?lat=${finalLocation.latitude}&lng=${finalLocation.longitude}&formatted=0`
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
