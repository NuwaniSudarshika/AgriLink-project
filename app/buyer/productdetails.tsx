// app/buyer/productdetails.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebaseconfig';

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [p, setP] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, 'products', id)).then(snap => {
      if (snap.exists()) setP(snap.data());
      else Alert.alert('Not found');
    });
  }, [id]);

  if (!p) return <View style={styles.center}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      {p.imageUrl ? <Image source={{ uri: p.imageUrl }} style={styles.img} /> : null}
      <Text style={styles.title}>{p.title}</Text>
      <Text style={styles.vendor}>By {p.vendorName}</Text>
      <Text style={styles.price}>Rs {p.price}</Text>
      <Text style={styles.desc}>{p.description}</Text>

      <TouchableOpacity
        style={styles.chatBtn}
        onPress={() =>
          router.push({
            pathname: './chat/insidechat',
            params: { vendorId: p.vendorId },
          })
        }>
        <Text style={styles.chatText}>Chat with vendor</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  img: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  vendor: { color: '#666', marginBottom: 6 },
  price: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  desc: { color: '#333' },
  chatBtn: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  chatText: { color: '#fff', fontWeight: '700' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
