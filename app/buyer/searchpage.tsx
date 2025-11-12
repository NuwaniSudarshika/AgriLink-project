// app/buyer/searchpage.tsx
import { useRouter } from 'expo-router';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebaseconfig';

type Product = any;

export default function BuyerSearchPage(){
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    const qref = query(collection(db, 'products'), orderBy('createdAt','desc'));
    const unsub = onSnapshot(qref, snap => {
      const arr = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      setProducts(arr);
    });
    return unsub;
  },[]);

  const filtered = products.filter(p =>
    p.title?.toLowerCase().includes(q.toLowerCase()) || p.vendorName?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <View style={s.container}>
      <Text style={s.h1}>Search Products</Text>
      <TextInput value={q} onChangeText={setQ} placeholder="Search by name or vendor" style={s.search} />
      <FlatList
        data={filtered}
        keyExtractor={i=>i.id}
        renderItem={({item})=>(
          <TouchableOpacity style={s.card} onPress={()=>router.push({ pathname:'./buyer/productdetails', params: { id: item.id }})}>
            {item.imageUrl ? <Image source={{uri:item.imageUrl}} style={s.img} /> : null}
            <View style={{flex:1}}>
              <Text style={s.title}>{item.title} {item.isSurplus? ' (Surplus)':''}</Text>
              <Text style={s.vendor}>{item.vendorName}</Text>
              <Text style={s.price}>Rs {item.price} • {item.quantity} kg</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container:{flex:1,padding:16,backgroundColor:'#fff'},
  h1:{fontSize:20,fontWeight:'700',color:'#2E7D32',marginBottom:8},
  search:{borderWidth:1,borderColor:'#ddd',padding:10,borderRadius:8,marginBottom:12},
  card:{flexDirection:'row',padding:10,marginBottom:10,backgroundColor:'#F7F7F7',borderRadius:8},
  img:{width:80,height:80,borderRadius:8,marginRight:10},
  title:{fontWeight:'700'},
  vendor:{color:'#666'},
  price:{marginTop:6,fontWeight:'600'}
});
