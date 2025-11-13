// app/buyerhome.tsx
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseconfig';

export default function BuyerHome() {
  const router = useRouter();
  const logout = async () => { await signOut(auth); router.replace('/login'); };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Buyer Home</Text>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('./buyer/searchpage')}>
        <Text style={styles.btnText}>Search Products</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('./buyer/BuyerProfile')}>
        <Text style={styles.btnText}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.danger]} onPress={logout}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,alignItems:'center',justifyContent:'center',padding:20, backgroundColor:'#E8F5E9'},
  h1:{fontSize:22,fontWeight:'700',color:'#2E7D32',marginBottom:20},
  btn:{width:'80%',padding:14,backgroundColor:'#4CAF50',borderRadius:10,marginVertical:8,alignItems:'center'},
  btnText:{color:'#fff',fontWeight:'600'},
  danger:{backgroundColor:'#C62828'}
});
