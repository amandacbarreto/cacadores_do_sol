import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export const AchievementCalendar = ({ children, style }: Props) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#9381FFCC', '#FCCA467F']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.3]}
      >
        <View style={styles.content}>
          {children}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  text: {
    fontSize: 20,
    color: '#fff',
  },
  content: {
    padding: 40
  }
});