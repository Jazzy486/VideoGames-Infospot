import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';

const MyTableComponent = ({ data }) => {
  return (
    <ScrollView style={styles.scrollContainer}>
    <View style={styles.container}>
      
      <Table borderStyle={{ borderWidth: 1, borderColor: '#B4D4FF' }}>
        {data.map((rowData, index) => (
          <Row
            key={index}
            data={rowData}
            style={[
              styles.row,
              index % 2 && { backgroundColor: '#86B6F6' },
            ]}
            textStyle={styles.text}
          />
        ))}
      </Table>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { height: 300 },
  container: { flex: 0.8,backgroundColor: '#EEF5FF', borderRadius: 20, padding: 20, borderColor: 'gray', borderWidth: 1, },
  row: { height: 30, flexDirection: 'row', backgroundColor: '#B4D4FF' },
  text: { textAlign: 'center', fontWeight: '300', color: 'black' },
});

export default MyTableComponent;
