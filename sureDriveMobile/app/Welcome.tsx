// Requires: react-native-svg, moti, react-native-reanimated
import { SafeAreaView, View, Text, StyleSheet, Image, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[colorScheme].background }] }>
    <View style={styles.container}>
        <Image source={require('../assets/images/icon.png')} style={{ width: 120, height: 80, marginBottom: 16 }} />
      <View style={styles.titleRow}>
          <Text style={[styles.title, { color: Colors[colorScheme].secondary }]}>Sure Drive</Text>
        </View>
        <Text style={[styles.subtitle, { color: Colors[colorScheme].secondary }]}>Welcome to Sure Drive!</Text>
        <View style={styles.buttonGroup}>
          <Button title="Register" onPress={() => router.push('/auth/register')} color={Colors[colorScheme].secondary} />
          <Button title="Login" onPress={() => router.push('/auth/login')} color={Colors[colorScheme].secondary} />
      </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    marginRight: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 24,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
  },
  buttonGroup: {
    marginTop: 32,
    width: '100%',
    gap: 12,
  },
}); 