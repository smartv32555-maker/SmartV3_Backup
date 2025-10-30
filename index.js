import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// นี่คือโค้ดมาตรฐานของ React Native CLI
// มันจะใช้ชื่อแอปฯ ที่กำหนดไว้ในไฟล์ app.json (SmartV3) เพื่อลงทะเบียนคอมโพเนนต์หลัก (App)
AppRegistry.registerComponent(appName, () => App);