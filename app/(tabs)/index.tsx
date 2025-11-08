import React from 'react';
import { StyleSheet, View, Text, Pressable, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

// เก็บ Splash Screen ไว้จนกว่าทุกอย่างจะพร้อม
SplashScreen.preventAutoHideAsync();

export default function WelcomeScreen() {
  const router = useRouter();

  React.useEffect(() => {
    // 1. **ไม่มีการนำทางอัตโนมัติที่นี่**
    //    โค้ดนี้มีไว้เพื่อจัดการการซ่อน Splash Screen เท่านั้น
    SplashScreen.hideAsync();
    
    // **สำคัญมาก:** ถ้าไม่มีโค้ดอื่นมาแทรก, หน้าจอนี้จะไม่เปลี่ยนไปไหนเอง
    
  }, []);

  const handlePress = () => {
    // 2. **การนำทางจะเกิดขึ้นก็ต่อเมื่อฟังก์ชันนี้ถูกเรียก**
    //    ซึ่งถูกเรียกจากการกดปุ่ม Pressable เท่านั้น!
    console.log("START button pressed! Navigating to /main...");
    router.push('/main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* โลโก้ SmartV3 */}
        <Image 
          style={styles.logo}
          // Make sure 1smartv3.png is in assets/images/
          source={require('../../assets/images/1smartv3.png')} 
        />
        
        {/* ปุ่ม START ที่เรียก handlePress */}
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.8 : 1.0 }
          ]} 
          onPress={handlePress} // <-- นี่คือจุดที่เชื่อมต่อกับการนำทาง
        >
          <Text style={styles.buttonText}>START</Text>
        </Pressable>
        
        <Text style={styles.statusText}>Welcome Screen (app/index.tsx) - Press START to continue</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: height * 0.1,
  },
  logo: {
    width: width * 0.65,
    height: width * 0.65, 
    resizeMode: 'contain',
    marginBottom: 70,
  },
  button: {
    width: width * 0.7, 
    height: 60,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22, 
    letterSpacing: 1,
  },
  statusText: {
    marginTop: 20,
    color: '#aaa',
    fontSize: 12,
  }
});
