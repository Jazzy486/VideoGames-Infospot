import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { ref, query, orderByKey, limitToFirst, startAfter, get } from 'firebase/database';
import { db } from './Firebase.js';

const PAGE_SIZE = 10;

export default function App() {
  const [games, setGames] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const gamesRef = ref(db, 'Games');
  
      let queryRef = gamesRef;
  
      if (lastVisible) {
        queryRef = query(gamesRef, orderByKey(), startAfter(lastVisible.GameName), limitToFirst(PAGE_SIZE));
      } else {
        queryRef = query(gamesRef, orderByKey(), limitToFirst(PAGE_SIZE));
      }
  
      const snapshot = await get(queryRef);
  
      if (snapshot.exists()) {
        const newGames = [];
        snapshot.forEach((childSnapshot) => {
          newGames.push(childSnapshot.val());
        });
  
        setGames((prevGames) => [...prevGames, ...newGames]);
  
         // Update the last visible document for the next page
         const lastChildKey = Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1];
         setLastVisible({ GameName: lastChildKey });
      } else {
        console.log('No more data available.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const renderGameItem = ({ item, index }) => (
    <View style={styles.item} key={index}>
      <Text>{item.GameName}</Text>
      <Text>Console: {item.Console}</Text>
      <Text>Score: {item.Score}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text>Welcome to Games Library</Text>
      </View>
      <FlatList
        data={games}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.GameName}
        onEndReached={fetchData}
        onEndReachedThreshold={0.1}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  header:{
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});
