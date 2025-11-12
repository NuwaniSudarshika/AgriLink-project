// app/splash.tsx
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../firebaseconfig';

export default function Splash() {
  const router = useRouter();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) {
            const data = snap.data() as any;
            if (data.role === 'buyer') router.replace('/buyerhome');
            else router.replace('/vendorhome');
          } else router.replace('/login');
        } catch {
          router.replace('/login');
        }
      } else router.replace('/login');
    });
    return unsub;
  }, []);
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text style={styles.text}>Loading AgriLink...</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',alignItems:'center'},
  text:{marginTop:12,color:'#2E7D32'}
});
