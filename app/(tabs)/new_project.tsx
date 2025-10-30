import { StyleSheet, Text, View, Pressable, ScrollView, Image, TextInput, Platform, Dimensions, Alert, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

// !!! แก้ไข: RichTextEditor ถูกแทนที่ด้วย TextInput ที่เสถียร 100% บน Native App !!!
let RichTextEditor;
if (Platform.OS === 'web') {
  RichTextEditor = (props) => {
    const { onContentChange, editorRef } = props;
    const handleInput = (event) => {
      if (onContentChange) {
        onContentChange(event.target.innerHTML);
      }
    };
    const handleClick = () => {
      if (editorRef.current) {
        editorRef.current.focus(); // แก้ไข editor.current.focus() เป็น editorRef.current.focus()
      }
    };
    return (
      <View style={styles.richTextEditorContainer}>
        <div
          ref={editorRef}
          contentEditable={true}
          onInput={handleInput}
          onClick={handleClick}
          style={{
            minHeight: '100%',
            boxSizing: 'border-box',
            outline: 'none',
            overflowY: 'auto',
          }}
        />
      </View>
    );
  };
} else {
  // สำหรับ iOS/Android: ใช้ TextInput แทน Pell-Rich-Editor ที่ทำให้ Build ล้มเหลว
  RichTextEditor = (props) => {
    const { onContentChange, content } = props;
    return (
        <TextInput
            multiline
            style={styles.richTextEditorPlaceholder}
            onChangeText={onContentChange}
            value={content}
            placeholder="กรอกรายละเอียดโครงการที่นี่..."
            placeholderTextColor="#888"
            textAlignVertical="top"
        />
    );
  };
}
// !!! จบการแก้ไข RichTextEditor !!!

const windowHeight = Dimensions.get('window').height;
const headerHeight = 150; 
const bottomSectionHeight = 120; 
const fixedContentHeight = windowHeight - headerHeight - bottomSectionHeight - 20;

export default function NewProjectScreen() {
  const [date, setDate] = useState('');
  const [projectName, setProjectName] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [description, setDescription] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();
  const editorRef = useRef(null);

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear() + 543;
    setDate(`${day}${month}${year}`);
  }, []);

  const storageLocation = `Amarin2/${projectName} ${date}`;

  const handleBackPress = () => {
    if (isSaved) {
      router.back();
    } else {
      setShowPopup(true);
    }
  };

  const handleSavePress = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('แจ้งเตือน', 'ฟังก์ชันการบันทึกไฟล์ไม่รองรับบนแพลตฟอร์มเว็บ');
      return;
    }
    
    // ตรวจสอบข้อมูลเบื้องต้น
    if (!projectName || !creatorName || !description) {
      Alert.alert('ผิดพลาด', 'กรุณากรอก ชื่อโครงการ, ชื่อผู้สร้าง และรายละเอียดโครงการ');
      return;
    }

    const directoryUri = FileSystem.documentDirectory + 'Amarin2/';
    const fileUri = directoryUri + `${projectName} ${date}.json`;

    try {
      // 1. ตรวจสอบและสร้าง Directory (ใช้ FileSystem)
      const directoryInfo = await FileSystem.getInfoAsync(directoryUri);
      if (!directoryInfo.exists) {
        await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
        console.log('Amarin2 folder created.');
      }

      const projectData = {
        projectName,
        creatorName,
        description,
        images: images.map(img => ({ id: img.id, uri: img.uri, width: img.width, height: img.height })),
        date,
        storageLocation,
      };

      // 2. เขียนไฟล์ JSON (ใช้ FileSystem)
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(projectData));
      console.log('Project saved to:', fileUri);
      Alert.alert('สำเร็จ', 'บันทึกงานเรียบร้อยแล้ว');
      setIsSaved(true);
    } catch (e) {
      console.error('Failed to save project:', e);
      Alert.alert('ผิดพลาด', 'บันทึกงานไม่สำเร็จ');
      setIsSaved(false);
    }
  };

  const handleBrowsePress = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('แจ้งเตือน', 'ฟังก์ชันการเลือกไฟล์ไม่รองรับบนแพลตฟอร์มเว็บ');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      });

      if (!result.canceled && result.assets) {
        const fileUri = result.assets[0].uri;
        // ใช้ FileSystem ในการอ่านไฟล์
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        const projectData = JSON.parse(fileContent);

        setProjectName(projectData.projectName);
        setCreatorName(projectData.creatorName);
        setDescription(projectData.description);
        setImages(projectData.images);
        setIsSaved(true);

        Alert.alert('สำเร็จ', `โหลดงาน "${projectData.projectName}" เรียบร้อยแล้ว`);
      }
    } catch (e) {
      console.error('Failed to browse and load project:', e);
      Alert.alert('ผิดพลาด', 'ไม่สามารถโหลดไฟล์งานได้');
    }
  };

  const handleExitPress = () => {
    if (isSaved) {
      // ใช้ router.back() แทนการ exitApp() ชั่วคราวเพื่อความปลอดภัยในการ Build
      router.back(); 
      console.log('Exiting the application...');
    } else {
      setShowExitPopup(true);
    }
  };

  const handleAddImagePress = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const newImage = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        width: result.assets[0].width,
        height: result.assets[0].height
      };
      setImages(prevImages => [...prevImages, newImage]);
      setIsSaved(false);
    }
  };

  const handleDeletePress = () => {
    if (selectedImageId) {
      setImages(prevImages => prevImages.filter(img => img.id !== selectedImageId));
      setSelectedImageId(null);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImageId(image.id);
    setSelectedImage(image);
    setModalVisible(true);
  };

  const onTextFormat = (command) => {
    // ปิดการใช้งาน Rich Text Formatting บน Native App เพื่อป้องกัน Crash
    if (Platform.OS === 'web') {
      document.execCommand(command, false, null);
    } else {
      // ไม่ทำอะไรบน Native App (ป้องกัน Crash)
      console.log('Rich Text formatting is disabled on Native App for stability.');
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.mainContainer}>

        {/* ส่วนบน: ช่องกรอกข้อมูล */}
        <View style={styles.inputGrid}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>วันที่สร้างงาน</Text>
            <TextInput
              style={styles.textInput}
              value={date}
              editable={false}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ตำแหน่งที่จัดเก็บงาน</Text>
            <TextInput
              style={styles.textInput}
              value={storageLocation}
              editable={false}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ชื่อโครงการ</Text>
            <TextInput
              style={styles.textInput}
              placeholder="กรอกชื่อโครงการ"
              onChangeText={setProjectName}
              value={projectName}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ชื่อผู้สร้างโครงการ</Text>
            <TextInput
              style={styles.textInput}
              placeholder="กรอกชื่อผู้สร้างโครงการ"
              onChangeText={setCreatorName}
              value={creatorName}
            />
          </View>
        </View>

        {/* ส่วนกลาง: กรอบคำบรรยายและกรอบรูปภาพ */}
        <View style={styles.contentArea}>
          {/* กรอบคำบรรยาย */}
          <View style={[styles.sectionContainer, styles.descriptionSection]}>
            <Text style={styles.sectionTitle}>กรอบคำบรรยาย</Text>
            <View style={styles.textSection}>
              <ScrollView>
                {/* ใช้ RichTextEditor (ที่เป็น TextInput) */}
                <RichTextEditor
                  editorRef={editorRef}
                  style={styles.richTextEditor}
                  onContentChange={setDescription}
                  content={description} // ส่ง content ไปให้ RichTextEditor (ที่เป็น TextInput)
                />
              </ScrollView>
            </View>
          </View>

          {/* กรอบรูปภาพ */}
          <View style={[styles.sectionContainer, styles.imageContainerSection]}>
            <Text style={styles.sectionTitle}>กรอบรูปภาพ</Text>
            <View style={styles.imageScrollContainer}>
              <ScrollView contentContainerStyle={styles.imageGrid}>
                {images.map((image) => (
                  <Pressable
                    key={image.id}
                    onPress={() => handleImageClick(image)}
                    style={[
                      styles.imageWrapper,
                      selectedImageId === image.id && styles.imageSelected,
                    ]}
                  >
                    <Image
                      source={{ uri: image.uri }}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </View>

      {/* ส่วนล่าง: กรอบครอบปุ่ม (ถูก Fix ตำแหน่ง) */}
      <View style={styles.bottomSection}>
        {/* ปุ่มลอง (Tool Buttons) */}
        <View style={styles.toolGrid}>
          {/* ปุ่ม Bold/Italic ถูกปิดการใช้งานบน Native App แล้ว */}
          <Pressable style={styles.toolButtonWrapper} onPress={() => onTextFormat('bold')}>
            <View style={[styles.toolButton, { backgroundColor: '#FF8A00' }]}>
              <Icon name="bold" size={24} color="#fff" />
            </View>
            <Text style={styles.toolButtonText}>Bold</Text>
          </Pressable>
          <Pressable style={styles.toolButtonWrapper} onPress={() => onTextFormat('italic')}>
            <View style={[styles.toolButton, { backgroundColor: '#4CD964' }]}>
              <Icon name="italic" size={24} color="#fff" />
            </View>
            <Text style={styles.toolButtonText}>Italic</Text>
          </Pressable>
          <Pressable style={styles.toolButtonWrapper} onPress={handleAddImagePress}>
            <View style={[styles.toolButton, { backgroundColor: '#007AFF' }]}>
              <Icon name="image" size={24} color="#fff" />
            </View>
            <Text style={styles.toolButtonText}>เพิ่มรูปภาพ</Text>
          </Pressable>
          <Pressable style={styles.toolButtonWrapper} onPress={handleDeletePress}>
            <View style={[styles.toolButton, { backgroundColor: '#FF2D55' }]}>
              <Icon name="trash" size={24} color="#fff" />
            </View>
            <Text style={styles.toolButtonText}>ลบรูปภาพ</Text>
          </Pressable>
        </View>
        {/* ปุ่มหลัก (Main Buttons) */}
        <View style={styles.mainButtonGrid}>
          <Pressable style={[styles.mainButton, styles.saveButton]} onPress={handleSavePress}>
            <Text style={styles.mainButtonText}>Save</Text>
          </Pressable>
          <Pressable style={[styles.mainButton, styles.backButton]} onPress={handleBackPress}>
            <Text style={styles.mainButtonText}>Back</Text>
          </Pressable>
          <Pressable style={[styles.mainButton, styles.browseButton]} onPress={handleBrowsePress}>
            <Text style={styles.mainButtonText}>Browse</Text>
          </Pressable>
          <Pressable style={[styles.mainButton, styles.exitButton]} onPress={handleExitPress}>
            <Text style={styles.mainButtonText}>Exit</Text>
          </Pressable>
        </View>
      </View>

      {/* The popup components */}
      {showPopup && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Pressable style={styles.closeButton} onPress={() => setShowPopup(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </Pressable>
            <Text style={styles.popupText}>
              {`ต้อง Save งานก่อน\n`}
            </Text>
            <Text style={styles.popupSubText}>จากระบบ</Text>
          </View>
        </View>
      )}

      {showExitPopup && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Pressable style={styles.closeButton} onPress={() => setShowExitPopup(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </Pressable>
            <Text style={styles.popupText}>
              {`ต้อง Save งานก่อน\n`}
            </Text>
            <Text style={styles.popupSubText}>จากระบบ</Text>
          </View>
        </View>
      )}

      {/* Modal สำหรับแสดงรูปภาพแบบเต็มจอ */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setSelectedImageId(null);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              source={{ uri: selectedImage?.uri }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.modalCloseButtonText}>X</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'flex-start',
  },
  inputGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: -10,
    height: 150,
  },
  inputGroup: {
    width: '48%',
    marginBottom: -5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 0,
  },
  textInput: {
    flex: 1,
    padding: 0,
    fontSize: 16,
  },
  contentArea: {
    flex: 1,
    flexDirection: 'column',
  },
  sectionContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginBottom: 2,
    width: '100%',
  },
  descriptionSection: {
    height: Dimensions.get('window').height * 0.2,
    marginBottom: 5,
  },
  imageContainerSection: {
    height: Dimensions.get('window').height * 0.2,
  },
  imageScrollContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
  },
  sectionTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  textSection: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    height: '100%',
    padding: 10,
  },
  richTextEditorContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Style สำหรับ TextInput ที่แทน RichTextEditor
  richTextEditorPlaceholder: {
    flex: 1,
    backgroundColor: '#fff',
    minHeight: 100, // กำหนดความสูง
    padding: 5,
    textAlignVertical: 'top',
  },
  richTextEditor: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 5,
  },
  imageWrapper: {
    width: '48%',
    aspectRatio: 1.3,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageSelected: {
    borderColor: 'blue',
  },
  bottomSection: {
    width: '100%',
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  toolGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  toolButtonWrapper: {
    alignItems: 'center',
  },
  toolButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  toolButtonText: {
    fontSize: 12,
    color: '#555',
  },
  mainButtonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  mainButton: {
    width: '23%',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  mainButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: 'orange',
  },
  backButton: {
    backgroundColor: 'blue',
  },
  browseButton: {
    backgroundColor: 'saddlebrown',
  },
  exitButton: {
    backgroundColor: 'red',
  },
  popupOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: '60%',
    height: 100,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#888',
  },
  popupText: {
    fontSize: 16,
    textAlign: 'center',
  },
  popupSubText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    height: '80%',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});