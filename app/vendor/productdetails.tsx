import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebaseconfig';

export default function VendorProductDetails() {
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

  if (!p) return (
    <View style={styles.center}>
      <Text>Loading product...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {p.imageUrl ? <Image source={{ uri: p.imageUrl }} style={styles.img} /> : null}
      <Text style={styles.title}>{p.title}</Text>
      <Text style={styles.price}>Rs {p.price}</Text>
      <Text style={styles.desc}>{p.description}</Text>
      <Text style={styles.qty}>Available: {p.quantity} kg</Text>
      <Text style={styles.info}>Marked as {p.isSurplus ? 'Surplus' : 'Normal'} product</Text>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  img: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#E65100', marginBottom: 4 },
  price: { fontSize: 18, fontWeight: '700', color: '#2E7D32', marginBottom: 8 },
  desc: { fontSize: 16, color: '#555', marginBottom: 8 },
  qty: { fontSize: 14, color: '#333', marginBottom: 4 },
  info: { fontSize: 14, color: '#666' },
  backBtn: {
    backgroundColor: '#E65100',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  backText: { color: '#fff', fontWeight: '700' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
