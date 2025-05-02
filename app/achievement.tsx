import { View, Text, StyleSheet } from 'react-native';
import { useFonts, Lexend_400Regular } from '@expo-google-fonts/lexend';
import { GradientBackground } from '@/components/GradientBackground';

export default function Achievement() {
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
  });
  
  if (!fontsLoaded)
    return;
  
  return (
    <GradientBackground style={{ 
      flex: 1,
      padding: 20
    }}>
      <View style={styles.content}>
        <View style={{ }}>
          <Text style={{ 
            fontFamily: 'Lexend_400Regular',
            fontSize: 40,
          }}>Olá, </Text>
          <Text style={{ 
            fontFamily: 'Lexend_400Regular',
            fontSize: 20,
          }}>a previsão para o pôr do sol em Casa hoje é às 17:58</Text>
        </View>
        <View style={{}}>
          <Text style={{ 
            fontFamily: 'Lexend_400Regular',
            fontSize: 40
          }}>Esse mês: 15 ☀️</Text>
          <Text>Essa semana: 2 ☀️</Text>
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