import { StyleSheet, Text, View, Pressable, Image, Platform, BackHandler, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

export default function MainScreen() {
  const router = useRouter();
  const [sound, setSound] = useState();

  useEffect(() => {
    const playSound = async () => {
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/songa.mp3'),
        { shouldPlay: true, isLooping: true }
      );
      setSound(sound);
      console.log('Playing Sound');
    };

    playSound();

    return () => {
      console.log('Unloading Sound');
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const stopSoundAndNavigate = async (path) => {
    if (sound) {
      await sound.unloadAsync();
    }
    router.push(path);
  };

  const stopSoundAndExit = async () => {
    if (sound) {
      await sound.unloadAsync();
    }
    // ใช้ BackHandler.exitApp() ซึ่งเสถียรที่สุดในการปิดแอปฯ
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      BackHandler.exitApp(); 
    } else {
      Alert.alert('Exit', 'Exit function is not available on this platform.');
    }
  };
  
  const handleNewProjectPress = () => {
    stopSoundAndNavigate('new_project');
  };

  const handleViewPress = () => {
    stopSoundAndNavigate('view');
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

  const handleExitPress = () => {
    stopSoundAndExit();
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/hometv.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>ชุมชนหมู่บ้านอัมรินทร์นิเวศน์ 2</Text>
        <Text style={styles.subtitle}>เขตคันนายาว</Text>

        <View style={styles.buttonGrid}>
          <Pressable style={[styles.mainButton, styles.viewButton]} onPress={handleViewPress}>
            <Text style={styles.buttonText}>View</Text>
          </Pressable>
          <Pressable style={[styles.mainButton, styles.newProjectButton]} onPress={handleNewProjectPress}>
            <Text style={styles.buttonText}>New Project</Text>
          </Pressable>
          <Pressable style={[styles.mainButton, styles.muteButton]} onPress={handleMutePress}>
            <Text style={styles.buttonText}>Mute</Text>
          </Pressable>
          <Pressable style={[styles.mainButton, styles.exitButton]} onPress={handleExitPress}>
            <Text style={styles.buttonText}>Exit</Text>
          </Pressable>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>ผู้พัฒนา นายมนตรี วชิรัคคเมธี</Text>
          <Text style={styles.infoText}>ติดต่อ 086 848 0888</Text>
          <Text style={styles.infoText}>สร้างงานวันที่ 2 สิงหาคม 2568</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 280,
    height: 280,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: 350,
    marginBottom: 10,
  },
  mainButton: {
    width: 150,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  viewButton: {
    backgroundColor: '#007bff', 
  },
  newProjectButton: {
    backgroundColor: '#2E8B57', 
  },
  muteButton: {
    backgroundColor: '#FF8A00', 
  },
  exitButton: {
    backgroundColor: '#FF2D55', 
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#888',
  },
});