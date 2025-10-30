import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// นี่คือจุดเริ่มต้นของแอปพลิเคชันที่สะอาดที่สุด
// ใช้เป็น Entry Point เพื่อให้ EAS Build ผ่านได้ 100%
const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Build สำเร็จแล้ว! ยินดีด้วยค่ะ!</Text>
      <Text style={styles.subText}>ตอนนี้พี่มิ้งสามารถเริ่มพัฒนาโค้ดได้เลย</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F2937' // สีเทาเข้ม
  },
  subText: {
    fontSize: 14,
    color: '#6B7280' // สีเทา
  }
});

export default App;