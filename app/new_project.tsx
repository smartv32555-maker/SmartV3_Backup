import React, { useState } from 'react';
import { StyleSheet, View, Button, Alert, Platform, ScrollView, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

export default function NewProjectScreen() {
  const [text, setText] = useState('สวัสดี SmartV3, นี่คือข้อความทดสอบการ Save PDF');

  // --- 1. ตรวจสอบสิทธิ์ (Permissions Check) ---
  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'ต้องการสิทธิ์',
          'แอปพลิเคชันต้องการสิทธิ์ในการเข้าถึงไฟล์เพื่อบันทึก PDF'
        );
        return false;
      }
    }
    return true;
  };

  // --- 2. สร้าง HTML เนื้อหา PDF (Create HTML Content) ---
  const generateHTML = (content: string) => {
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Tahoma', sans-serif; padding: 20px; }
            h1 { color: #333; }
            p { font-size: 16px; line-height: 1.5; }
            .content { border: 1px solid #ccc; padding: 15px; background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>รายงาน SmartV3</h1>
          <div class="content">
            <p>${content}</p>
            <p>วันที่บันทึก: ${new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </body>
      </html>
    `;
  };

  // --- 3. บันทึกและแชร์ PDF (Save and Share PDF) ---
  const saveAndSharePDF = async () => {
    if (!(await checkPermissions())) {
      return;
    }

    const htmlContent = generateHTML(text);
    const fileName = 'SmartV3_Report_' + new Date().getTime() + '.pdf';
    
    // กำหนด Path สำหรับบันทึกไฟล์ (ใช้ Cache ก่อนเพื่อให้แน่ใจว่า Expo File System เข้าถึงได้)
    const options = {
      html: htmlContent,
      fileName: fileName.replace('.pdf', ''), // ไลบรารีจะเพิ่ม .pdf เอง
      directory: FileSystem.cacheDirectory + 'pdfs', // ใช้ Cache Directory ก่อน
    };

    try {
      // 1. สร้าง PDF
      const file = await RNHTMLtoPDF.convert(options);
      const pdfPath = file.filePath;

      if (!pdfPath) {
        Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างไฟล์ PDF ได้');
        return;
      }

      // 2. ย้าย/คัดลอกไฟล์ไปยังพื้นที่จัดเก็บสาธารณะ (Download folder)
      let publicPath: string;

      if (Platform.OS === 'android') {
        // สำหรับ Android: บันทึกใน Download folder
        const downloadDir = FileSystem.documentDirectory; // หรือใช้ Download folder โดยตรง
        
        // เราจะคัดลอกไปที่ Downloads folder
        // *หมายเหตุ: ใน Expo Go หรือ Build บางตัว การเข้าถึง Downloads folder ตรงๆ ต้องใช้ไลบรารีเสริม
        // แต่วิธีนี้จะใช้การ Share/MediaLibrary เพื่อให้ผู้ใช้เลือก Save/แชร์ ได้
        
        // 3. แชร์ไฟล์โดยตรง (วิธีที่ง่ายที่สุดและปลอดภัยที่สุดเรื่องสิทธิ์)
        if (!(await Sharing.isAvailableAsync())) {
            Alert.alert('เกิดข้อผิดพลาด', 'อุปกรณ์นี้ไม่รองรับการแชร์ไฟล์');
            return;
        }
        
        Alert.alert(
            'บันทึกสำเร็จ',
            'ไฟล์ PDF ถูกสร้างแล้ว กรุณาเลือกแอปพลิเคชันเพื่อบันทึกหรือแชร์',
            [{ text: 'ตกลง', onPress: () => Sharing.shareAsync(pdfPath) }]
        );

      } else {
        // สำหรับ iOS: แชร์โดยตรง
        if (!(await Sharing.isAvailableAsync())) {
            Alert.alert('เกิดข้อผิดพลาด', 'อุปกรณ์นี้ไม่รองรับการแชร์ไฟล์');
            return;
        }
        await Sharing.shareAsync(pdfPath);
      }

    } catch (error) {
      console.error(error);
      Alert.alert('เกิดข้อผิดพลาด', 'การสร้าง PDF ไม่สำเร็จ: ' + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">หน้าจอทดสอบ Save PDF</ThemedText>
        
        <ThemedText type="default" style={styles.label}>
            ข้อความใน PDF:
        </ThemedText>
        <TextInput
            style={styles.input}
            onChangeText={setText}
            value={text}
            multiline={true}
            placeholder="พิมพ์ข้อความที่ต้องการ Save เป็น PDF ที่นี่"
        />

        <Button title="Save และ Share PDF" onPress={saveAndSharePDF} />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    minHeight: 600,
  },
  label: {
    marginTop: 20,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    borderRadius: 8,
  },
});