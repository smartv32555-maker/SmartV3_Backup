import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import Sound from 'react-native-sound';

const MainScreen = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [song, setSong] = useState(null);

  // Load the sound file
  useEffect(() => {
    Sound.setCategory('Playback');
    const soundObject = new Sound(require('../../audio/songa.mp3'), (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // Sound is loaded, play it automatically and loop
      soundObject.setNumberOfLoops(-1);
      soundObject.play((success) => {
        if (!success) {
          console.log('playback failed due to audio decoding errors');
        }
      });
      setSong(soundObject);
    });

    // Cleanup function to release the sound when the component unmounts
    return () => {
      if (song) {
        song.release();
      }
    };
  }, []);

  const handleMuteToggle = () => {
    if (song) {
      if (isMuted) {
        song.play();
      } else {
        song.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../images/hometv.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>ชุมชนหมู่บ้านอัมรินทร์นิเวศน์ 2</Text>
        <Text style={styles.subtitle}>เขตคันนายาว</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.viewButton]}>
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.newProjectButton]}>
            <Text style={styles.buttonText}>New Project</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.muteButton]} onPress={handleMuteToggle}>
            <Text style={styles.buttonText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.exitButton]}>
            <Text style={styles.buttonText}>Exit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>ผู้พัฒนา นายตรี วชิรัคคเมธี</Text>
          <Text style={styles.infoText}>ติดต่อ 086 848 0888</Text>
          <Text style={styles.infoText}>สร้างงานวันที่ 2 สิงหาคม 2568</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 280,
    height: 280,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 5,
    width: '45%',
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#1E90FF',
  },
  newProjectButton: {
    backgroundColor: '#32CD32',
  },
  muteButton: {
    backgroundColor: '#FFA500',
  },
  exitButton: {
    backgroundColor: '#DC143C',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
});

export default MainScreen;