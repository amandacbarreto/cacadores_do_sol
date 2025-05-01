import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useFonts, Lexend_400Regular } from '@expo-google-fonts/lexend';
import { GradientBackground } from '@/components/GradientBackground';

export default function Home() {
  
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
  });

  const [sunset, setSunset] = useState<string | null>(null);
  const [civilTwilightEnd, setCivilTwilightEnd] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSunsetTime = async () => {
      try {
        const latitude = 36.7201600;
        const longitude = -4.4203400;
        const response = await fetch(
          `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`
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
      <View style={{ }}>
        <Text style={{ 
          fontFamily: 'Lexend_400Regular',
          fontSize: 50,
         }}>Olá, </Text>
        <Text style={{ 
          fontFamily: 'Lexend_400Regular',
          fontSize: 30,
         }}>A previsão para o pôr do sol em Casa hoje é às {sunset}</Text>
      </View>
      <View style={{}}>
        <Text>Conquistas</Text>
        <Text>Esse mês: 15 ☀️</Text>
        <Text>Essa semana: 2 ☀️</Text>
      </View>
    </GradientBackground>
  );
}
