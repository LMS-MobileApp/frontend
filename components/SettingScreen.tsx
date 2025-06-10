import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { StackNavigationProp } from "@react-navigation/stack";
//@ts-ignore
import { RootStackParamList } from "../Common/StackNavigator";
import { useNavigation } from '@react-navigation/native';


//Logout
type LogoutNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

export default function SettingScreen() {
  const navigationLogin = useNavigation<LogoutNavigationProp>();

  // const [isEnabled, setIsEnabled] = useState(false);
  const [aboutUsVisible, setAboutUsVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Settings</Text>

      {/* Settings Block */}
      <View style={styles.settingsBlock}>
        {/* Notification Toggle */}
        {/* <View style={styles.optionRow}>
          <Text style={styles.optionText}>Notifications</Text>
          <Switch value={isEnabled} onValueChange={() => setIsEnabled(!isEnabled)} />
        </View> */}

        {/* Divider */}
        {/* <View style={styles.divider} /> */}

        {/* About Us - Opens Modal */}
        <TouchableOpacity onPress={() => setAboutUsVisible(true)}>
          <Text style={styles.optionText}>About Us</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Privacy Policies - Opens Modal */}
        <TouchableOpacity onPress={() => setPrivacyVisible(true)}>
          <Text style={styles.optionText}>Privacy Policies</Text>
        </TouchableOpacity>

        <View style={styles.divider} />
        <TouchableOpacity onPress={() => navigationLogin.navigate("Login")}>
          <Text style={styles.optionText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* About Us Modal */}
      <Modal transparent={true} visible={aboutUsVisible} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>ABOUT US</Text>
            <Text style={styles.modalTopic}>Your Smart Assignment Companion</Text>
            <Text style={styles.modalSubHeader}>The Assignment Tracker App</Text>
            <Text style={styles.modalText}>
              A dedicated platform designed for BA IT students and Social Statistics scholars 
              to efficiently manage assignments, deadlines, and group projects. Our goal is to 
              simplify academic task management, enhance collaboration, and reduce stress, 
              ensuring students achieve their highest potential.
            </Text>
            <Pressable style={styles.closeButton} onPress={() => setAboutUsVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Privacy Policies Modal */}
      <Modal transparent={true} visible={privacyVisible} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Privacy Policies</Text>
            <Text style={styles.modalText}>
              1. **Data Collection:** We collect only necessary user data for app functionality.
              {"\n\n"}2. **Data Usage:** Your data is used to improve user experience and manage academic tasks.
              {"\n\n"}3. **Third-Party Services:** We do not share user data with external entities.
              {"\n\n"}4. **Security:** We implement strict security measures to protect your information.
              {"\n\n"}5. **User Rights:** You can request data deletion at any time.
            </Text>
            <Pressable style={styles.closeButton} onPress={() => setPrivacyVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 50,
    marginTop: 30,
  },
  settingsBlock: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalTopic: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6CBEB6',
    marginBottom: 10,
  },
  modalSubHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#555',
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'justify',
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#6CBEB6',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
