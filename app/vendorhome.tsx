import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseconfig';

export default function VendorHome() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login'); // after logout, go back to login page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to AgriLink Vendor Home! 🌾</Text>
      <Text style={styles.subText}>Here you can manage your products and orders.</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 20,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#5D4037',
    marginBottom: 30,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#C62828',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
