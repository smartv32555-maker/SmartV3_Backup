import { StyleSheet, Text, View, Pressable, ScrollView, Dimensions, Alert, Platform, Image, Modal, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

// *** บรรทัดนี้ถูกลบทิ้งไปแล้ว (เพื่อไม่ให้ความสูงถูกจำกัด) ***
// const viewerHeight = Dimensions.get('window').height * 0.65; 

export default function ViewScreen() {
  const router = useRouter();
  const [sound, setSound] = useState(null);
  const [fileUri, setFileUri] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]); 
  let currentSound = null;

  const scale = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets(); 

  const onPinchGestureEvent = Animated.event([{
    nativeEvent: { scale: scale }
  }], {
    useNativeDriver: true
  });

  const onPinchHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true
      }).start();
    }
  };

  useEffect(() => {
    
    const playRandomSong = async () => {
      const songs = [
        require('../../assets/audio/songb.mp3'),
        require('../../assets/audio/songc.mp3'),
      ];
      const randomSong = songs[Math.floor(Math.random() * songs.length)];
      
      try {
        const { sound } = await Audio.Sound.createAsync(
          randomSong,
          { shouldPlay: true, isLooping: true }
        );
        currentSound = sound; 
        setSound(sound);
      } catch (e) {
        console.error('Failed to play sound in view.tsx:', e);
      }
    };

    playRandomSong();

    return () => {
      if (currentSound) {
        currentSound.unloadAsync();
      }
    };
  }, []); 

  const handleBackPress = async () => {
    if (sound) {
      await sound.unloadAsync();
    }
    router.back();
  };

  const handleMutePress = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isMuted) {
        await sound.setIsMutedAsync(false);
      } else {
        await sound.setIsMutedAsync(true);
      }
    }
  };

  const handleBrowsePress = async () => {
    try {
      // DocumentPicker ใน Native App จะสามารถเข้าถึงไฟล์ได้
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const mimeType = result.assets[0].mimeType;

        if (mimeType.includes('image')) {
          setFileType('image');
          setFileUri(uri);
          setImages([
            { id: Date.now().toString(), uri: uri }
          ]);
        } else if (mimeType === 'application/pdf') {
          setFileUri(uri);
          setFileType('pdf');
          setImages([]);
        } else {
          Alert.alert('ผิดพลาด', 'ไฟล์ที่เลือกไม่ใช่ไฟล์ PDF หรือรูปภาพ');
        }
      }
    } catch (e) {
      console.error('Failed to browse and load document:', e);
      Alert.alert('ผิดพลาด', 'ไม่สามารถโหลดไฟล์ได้');
    }
  };
  
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };
  
  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const renderContent = () => {
    if (!fileUri) {
      return (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            กรุณาเลือกไฟล์ PDF หรือรูปภาพ เพื่อดู
          </Text>
        </View>
      );
    }
    
    if (fileType === 'image') {
      return (
        <ScrollView contentContainerStyle={styles.imageGridContainer}>
          {images.map((image) => (
            <Pressable key={image.id} style={styles.imageWrapper} onPress={() => handleImageClick(image)}>
              <Image
                source={{ uri: image.uri }}
                style={styles.image}
                resizeMode="contain"
              />
            </Pressable>
          ))}
        </ScrollView>
      );
    }

    if (fileType === 'pdf') {
      if (Platform.OS === 'web') {
        // บน Web จะไม่รองรับการแสดงผลไฟล์ PDF ที่ Browse มาจากเครื่อง (File URI Access)
        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              การแสดงไฟล์ PDF ไม่รองรับบนเว็บ (Web File URI Access)
            </Text>
          </View>
        );
      }
      
      // บน Native App ใช้ WebView แทน Pdf เพื่อความเสถียร
      // ต้องมั่นใจว่าได้รัน npm install react-native-webview
      return (
        <WebView
          source={{ uri: fileUri }}
          style={styles.pdf}
          originWhitelist={['*']}
          allowFileAccess={true}
          scalesPageToFit={true}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.mainContainer}>
        {/* *** ลบ { height: viewerHeight } ออกไปแล้ว *** */}
        <View style={styles.viewerContainer}> 
          {renderContent()}
        </View>
      </View>
      
      <View style={[styles.bottomButtonContainer, { paddingBottom: insets.bottom || 10 }]}> 
        <Pressable style={[styles.mainButton, styles.muteButton]} onPress={handleMutePress}>
          <Text style={styles.buttonText}>Mute</Text>
        </Pressable>
        <Pressable style={[styles.mainButton, styles.browseButton]} onPress={handleBrowsePress}>
          <Text style={styles.buttonText}>Browse</Text>
        </Pressable>
        <Pressable style={[styles.mainButton, styles.backButton]} onPress={handleBackPress}>
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
      </View>

      {selectedImage && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => handleModalClose()}
        >
          <View style={styles.centeredView}>
            <PinchGestureHandler
              onGestureEvent={onPinchGestureEvent}
              onHandlerStateChange={onPinchHandlerStateChange}
            >
              <Animated.Image
                source={{ uri: selectedImage?.uri }}
                style={[styles.fullScreenImage, { transform: [{ scale: scale }] }]}
                resizeMode="contain"
              />
            </PinchGestureHandler>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => handleModalClose()}
            >
              <Text style={styles.modalCloseButtonText}>X</Text>
            </Pressable>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1, // ทำให้ส่วนนี้กินพื้นที่ทั้งหมดที่เหลือ
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  viewerContainer: {
    flex: 1, // *** เพิ่ม flex: 1 เพื่อให้ขยายเต็มพื้นที่ที่เหลือ ***
    width: '100%',
    borderWidth: 2,
    borderColor: '#808080',
    padding: 10,
    marginBottom: 0, // *** เปลี่ยน marginBottom เป็น 0 เพื่อให้ชิดปุ่ม ***
    overflow: 'hidden', 
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20, 
    paddingTop: 10, 
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    // !!! การแก้ไขให้ปุ่มเลื่อนขึ้นมาเหนือขอบ Android Nav Bar !!!
    marginBottom: 30, // ดันปุ่มให้สูงขึ้น 30px (การแก้ไขเดิมที่ถูกต้อง)
  },
  mainButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '30%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  muteButton: {
    backgroundColor: '#FF8C00',
  },
  browseButton: {
    backgroundColor: '#8B4513',
  },
  backButton: {
    backgroundColor: '#007bff',
  },
  imageGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 5,
  },
  imageWrapper: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  pdf: {
    flex: 1,
    width: '100%', 
    height: '100%', 
  },
});