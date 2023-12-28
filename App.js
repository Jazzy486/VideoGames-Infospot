import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, SafeAreaView, Button, Modal, TouchableOpacity } from 'react-native';
import { getDoc, doc, updateDoc, onSnapshot, collection, getFirestore } from 'firebase/firestore';
import ModalSelector from 'react-native-modal-selector';
import MyTableComponent from './MyTable';
import {db, app} from './Firebase';


export default function App() {
  const [isTableView, setIsTableView] = useState(true);
  const [flagValue, setFlagValue] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [isCityModalVisible, setIsCityModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);


  const flagDocRef = doc(db, 'Flag', 'Flag');

  const fetchDataFromJson = async () => {
    try {
      const data = require('./ShortRankings.json'); // Adjust the path to your JSON file
      console.log('Data from JSON: ', data);
      
      // Assuming the JSON data structure is an array of objects
    const mappedData = data.Rankings.map((item) => [
      item["Institute Id"],
      item["Institute Name"],
      item.City,
    ]);

    // Set the first record in tableData as the header and the rest as mappedData
    setTableData([["Institute Id", "Institute Name", "City"], ...mappedData]);
    } catch (error) {
      console.error('Error fetching data from JSON: ', error);
    }
  };



  const fetchData = async () => {
    try {
      const docSnap = await getDoc(flagDocRef);
      if (docSnap.exists()) {
        setFlagValue(docSnap.data().Table);
        setIsTableView(docSnap.data().Table);
      }
    } catch (error) {
      console.error('Error fetching data from Firestore: ', error);
    }
  };

  useEffect(() => {
    fetchDataFromJson();
    fetchData();

    // Set up real-time listener for changes in Firestore
    const unsubscribe = onSnapshot(flagDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setFlagValue(docSnap.data().Table);
        setIsTableView(docSnap.data().Table);
      }
    });

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  const toggleView = async () => {
    try {
      await updateDoc(flagDocRef, { Table: !flagValue });
    } catch (error) {
      console.error('Error updating data in Firestore: ', error);
    }
  };



  const filterDataByCity = () => {
    if (selectedCity === 'All') {
      return tableData;
    } else {
      return tableData.filter((rowData, index) => index === 0 || rowData[2] === selectedCity);
    }
  };

  const data = [
    { key: 0, label: 'All' },
    { key: 1, label: 'New Delhi' },
    { key: 2, label: 'Kolkata' },
    { key: 3, label: 'Mumbai' },
  ];













  return (
    <SafeAreaView style={{ flex: 1 , backgroundColor: '#176B87'}}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.2, marginBottom: 20 }}>
          <Text style={styles.header}>University Rankings</Text>
          <Button title={isTableView ? "Switch to FlatList" : "Switch to Table"} onPress={toggleView} />
          
          <Text style={{ textAlign:'center', position: 'absolute', left:'35%', top:'43%', color: 'white'}}>Filter Data By City</Text>
          <ModalSelector
        data={data}
        initValue={selectedCity}
        onChange={(option) => setSelectedCity(option.label)}
        style={{
          width: 300,
          marginTop: 20,
          borderRadius: 20,
          marginLeft: 38.5,
          backgroundColor: 'white',
          padding: 20,
          borderColor: 'gray',
          borderWidth: 1,
        }}
        selectStyle={{
          borderRadius: 20,
          padding: 20,
          borderColor: 'gray',
          borderWidth: 10,
        }}
        selectTextStyle={{ color: 'black' }}
        cancelText="Cancel"
        animationType="slide" // or "slide" or "none"
        transparent
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>{selectedCity}</Text>
          <Text>▼</Text>
        </View>
      </ModalSelector>
          
        </View>
        
        <View style={{ flex: 0.8 }}>
          {isTableView ? (
            <MyTableComponent data={filterDataByCity()} />
          ) : (
            <FlatList
              data={filterDataByCity().slice(1)} // Remove header from FlatList data
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  {item.map((cell, index) => (
                    <View key={index} style={styles.flatListItem}>
                      <Text style={{color:'white', fontWeight:'bold'}}>{cell}</Text>
                    </View>
                  ))}
                </View>
              )}
            />
          )}
        </View>
      </View>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  flatListItem: {
    marginBottom: 8,
  },
  header: {
    fontSize: 20,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  filterButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  filterButtonText: {
    fontSize: 16,
  },
  filterModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});
