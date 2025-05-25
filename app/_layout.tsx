import { Drawer } from 'expo-router/drawer';
import { useFonts, Lexend_400Regular } from '@expo-google-fonts/lexend';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
  });
  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{ drawerLabel: 'Início',
          title: 'Caçadores do sol' , 
          headerStyle: {
            backgroundColor: '#9381FFCC'
          }
         }}
      />
      <Drawer.Screen
        name="place"
        options={{ drawerLabel: 'Locais',
          title: 'Locais' , 
          headerStyle: {
            backgroundColor: '#9381FFCC'
          }
         }}
      />
      <Drawer.Screen
        name="about"
        options={{ 
          drawerLabel: 'Sobre',
          title: 'Sobre', 
          headerStyle: {
            backgroundColor: '#9381FFCC'
          }
         }}
      />
    </Drawer>
  );
}
