// app/vendor/searchpage.tsx
import { useRouter } from 'expo-router';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebaseconfig';

export default function VendorSearch(){
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db,'products'), orderBy('createdAt','desc'));
    const unsub = onSnapshot(q, snap => setProducts(snap.docs.map(d=> ({id:d.id, ...(d.data() as any)}))));
    return unsub;
  },[]);

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Products</Text>
      <FlatList data={products} keyExtractor={i=>i.id} renderItem={({item})=>(
        <TouchableOpacity style={styles.card} onPress={()=>router.push({ pathname:'./vendor/productdetails', params:{ id:item.id } })}>
          {item.imageUrl ? <Image source={{uri:item.imageUrl}} style={styles.img} /> : null}
          <View style={{flex:1}}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>Rs {item.price}</Text>
          </View>
        </TouchableOpacity>
      )} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:16,backgroundColor:'#fff'},
  h1:{fontSize:20,fontWeight:'700',color:'#E65100',marginBottom:8},
  card:{flexDirection:'row',padding:10,backgroundColor:'#F9F4EE',borderRadius:8,marginBottom:10},
  img:{width:70,height:70,borderRadius:6,marginRight:10},
  title:{fontWeight:'700'},
  price:{marginTop:6,fontWeight:'600'}
});
