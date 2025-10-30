import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ViewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>นี่คือหน้า View</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
});
