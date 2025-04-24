import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{ drawerLabel: 'Home 🏠' }}
      />
      <Drawer.Screen
        name="screens/achievement"
        options={{ drawerLabel: 'Conquistas' }}
      />
      <Drawer.Screen
        name="screens/place"
        options={{ drawerLabel: 'Locais' }}
      />
      <Drawer.Screen
        name="screens/daily_info"
        options={{ drawerLabel: 'Informações diárias' }}
      />
      <Drawer.Screen
        name="screens/about"
        options={{ drawerLabel: 'Sobre' }}
      />
    </Drawer>
  );
}