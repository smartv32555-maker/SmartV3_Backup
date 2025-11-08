import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// ให้ Splash Screen แสดงอยู่ตลอดจนกว่าทุกอย่างจะพร้อม
SplashScreen.preventAutoHideAsync();

export default function TabStackLayout() {
  return (
    // Stack คือ Navigator หลักของเราสำหรับกลุ่มเส้นทาง (tab) นี้
    <Stack>
      {/* 1. index (Welcome Screen) เป็นหน้าแรก (เริ่มต้น) */}
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false, // ซ่อน Header Bar ที่หน้า Welcome
          title: "Welcome Screen" 
        }} 
      />
      
      {/* 2. main (Main Menu) เป็นหน้าถัดไป */}
      <Stack.Screen 
        name="main" 
        options={{ 
          title: "SmartV3 Main Menu",
          headerShown: true // แสดง Header Bar ที่หน้า Main Menu 
        }} 
      />
      
      {/* โค้ดที่เพิ่มเข้ามาใหม่ (ถ้ามีไฟล์อื่นในอนาคต): 
      <Stack.Screen name="view" options={{ title: "View File" }} />
      <Stack.Screen name="create" options={{ title: "Create New" }} />
      */}
    </Stack>
  );
}
