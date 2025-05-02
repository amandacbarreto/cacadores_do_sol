import { View, Text, StyleSheet } from 'react-native';
import { useFonts, Lexend_400Regular } from '@expo-google-fonts/lexend';
import { GradientBackground } from '@/components/GradientBackground';


export default function DailyInfo() { 
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
        <Text style={{ 
          fontFamily: 'Lexend_400Regular',
          fontSize: 40,
         }}>Olá, </Text>
        <Text style={{ 
          fontFamily: 'Lexend_400Regular',
          fontSize: 20,
         }}>Informações diárias</Text>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 40
  }
});