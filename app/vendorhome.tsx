// app/vendorhome.tsx
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseconfig';

export default function VendorHome() {
  const router = useRouter();
  const logout = async () => { await signOut(auth); router.replace('/login'); };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Vendor Dashboard</Text>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('./vendor/searchpage')}>
        <Text style={styles.btnText}>Browse Products</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('./vendor/addnewproduct')}>
        <Text style={styles.btnText}>Add New Product</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('./vendor/profile')}>
        <Text style={styles.btnText}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn,styles.danger]} onPress={logout}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,alignItems:'center',justifyContent:'center',padding:20, backgroundColor:'#FFF3E0'},
  h1:{fontSize:22,fontWeight:'700',color:'#E65100',marginBottom:20},
  btn:{width:'80%',padding:14,backgroundColor:'#E65100',borderRadius:10,marginVertical:8,alignItems:'center'},
  btnText:{color:'#fff',fontWeight:'600'},
  danger:{backgroundColor:'#C62828'}
});
