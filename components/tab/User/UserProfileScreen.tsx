import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function UserProfileScreen() {
  const defaultProfilePic =
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [password] = useState('********'); // Display as hidden by default
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
      }
    })();
  }, []);

  const selectProfilePicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfilePic(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={selectProfilePicture} style={styles.imageContainer}>
          <Image
            source={{ uri: profilePic || defaultProfilePic }}
            style={styles.profileImage}
          />
          <View style={styles.cameraIcon}>
            <Icon name="photo-camera" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Welcome, Klera Ogasthine</Text>
      </View>

      {/* User Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Registration Number</Text>
          <Text style={styles.infoValue}>AR 1024098</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Name</Text>
          <Text style={styles.infoValue}>Klera Ogasthine</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Degree</Text>
          <Text style={styles.infoValue}>BA in IT Degree (HONS)</Text>
        </View>

        {/* Password Field */}
        <View style={styles.passwordBox}>
          <Text style={styles.infoText}>Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              secureTextEntry={!showPassword}
              value={showPassword ? 'MySecret123' : password} // Masked password
              editable={false} // Make it read-only
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#555" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    paddingVertical: 20,
  },
  header: {
    width: '100%',
    backgroundColor: '#6FC3B2',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
    elevation: 5,
    paddingBottom: 50,
    paddingTop: 50,
    shadowColor: '#000',
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6FC3B2',
    borderRadius: 15,
    padding: 5,
  },
  welcomeText: {
    marginTop: 10,
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  infoBox: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  passwordBox: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

