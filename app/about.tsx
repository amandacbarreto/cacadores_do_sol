import { View, Text, StyleSheet, Linking, Pressable  } from 'react-native';
import { useFonts, Lexend_400Regular } from '@expo-google-fonts/lexend';
import { GradientBackground } from '@/components/GradientBackground';

export default function About() {
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
        <View>
          <Text style={{ 
            fontFamily: 'Lexend_400Regular',
            fontSize: 40,
          }}>
            Olá,
          </Text>

          <Text style={{ 
            fontFamily: 'Lexend_400Regular',
            fontSize: 20,
            marginBottom: 10,
          }}>
            Este aplicativo foi desenvolvido por Amanda Barreto, na disciplina de Programação Para Dispositivos Móveis em Android, na Graduação de Ciência da Computação, da faculdade Estácio de Sá.
          </Text>

          <Pressable onPress={() => Linking.openURL('https://sunrise-sunset.org/api')}>
            <Text style={{ 
              fontFamily: 'Lexend_400Regular',
              fontSize: 16,
              color: '#007AFF',
              textDecorationLine: 'underline'
            }}>
              Dados fornecidos pela API pública Sunrise Sunset
            </Text>
          </Pressable>
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