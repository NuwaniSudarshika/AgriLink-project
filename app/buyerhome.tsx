// app/buyerhome.tsx
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseconfig';

export default function BuyerHome() {
  const router = useRouter();
  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to AgriLink Buyer Home! 🥦</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}><Text style={styles.logoutText}>Logout</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#E8F5E9' },
  text: { fontSize:20, fontWeight:'bold', color:'#2E7D32', marginBottom:20 },
  logoutButton: { backgroundColor:'#C62828', padding:10, borderRadius:8 },
  logoutText: { color:'#fff', fontWeight:'bold' },
});
