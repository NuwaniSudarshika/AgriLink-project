// app/index.tsx
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.replace("/splash"), 80);
    return () => clearTimeout(t);
  }, []);
  return (
    <View style={s.container}>
      <ActivityIndicator size="large" color="#4CAF50" />
    </View>
  );
}
const s = StyleSheet.create({ container: { flex:1, alignItems:'center', justifyContent:'center' }});

