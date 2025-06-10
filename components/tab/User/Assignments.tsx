import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
//@ts-ignore
import { RootStackParamList } from "../Common/StackNavigator";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";

type AssignmentScreenProps = {
  route: RouteProp<RootStackParamList, "Assignments">;
  navigation: StackNavigationProp<RootStackParamList, "Assignments">;
};

const AssignmentScreen: React.FC<AssignmentScreenProps> = ({ route }) => {
  const { assignmentId } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState<
    { text: string; type: "ToDo" | "Task" }[]
  >([]);
  const [selectedType, setSelectedType] = useState<"ToDo" | "Task">("ToDo");
  const [fileName, setFileName] = useState<string | null>(null);
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [uploadedLink, setUploadedLink] = useState<string | null>(null);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  const handleSaveNote = () => {
    if (note.trim()) {
      setSavedNotes([...savedNotes, { text: note.trim(), type: selectedType }]);
      setNote("");
      setSelectedType("ToDo");
      setModalVisible(false);
    }
  };

  const handleDeleteNote = (index: number) => {
    const updatedNotes = [...savedNotes];
    updatedNotes.splice(index, 1);
    setSavedNotes(updatedNotes);
  };

  const handleFileUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled && result.assets?.[0]?.name) {
      setFileName(result.assets[0].name);
      setUploadModalVisible(false);
    }
  };

  const handleLinkUpload = () => {
    if (linkInput.trim()) {
      setUploadedLink(linkInput.trim());
      setLinkInput("");
      setUploadModalVisible(false);
    } else {
      Alert.alert("Please enter a valid link.");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Assignment {assignmentId}</Text>
        <Text style={styles.subtitle}>Course Name - Subject</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Due Date</Text>
          <Text style={styles.label}>Time</Text>
        </View>

        <TouchableOpacity style={styles.pdfButton}>
          <Text style={styles.pdfText}>Assignment 01.pdf</Text>
        </TouchableOpacity>

        <Text style={styles.yourWorkLabel}>Your Work</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setUploadModalVisible(true)}
        >
          <Text style={styles.addText}>Add Or Create</Text>
        </TouchableOpacity>

        {/* Show uploaded file/link */}
        {fileName && (
          <Text style={styles.uploadedText}>📄 Uploaded File: {fileName}</Text>
        )}
        {uploadedLink && (
          <Text style={styles.uploadedText}>🔗 Uploaded Link: {uploadedLink}</Text>
        )}

        <TouchableOpacity style={styles.doneButton}>
          <Text style={styles.doneText}>Make As Done</Text>
        </TouchableOpacity>

        {savedNotes.map((noteObj, idx) => (
          <View
            key={idx}
            style={[
              styles.noteCard,
              {
                backgroundColor: noteObj.type === "Task" ? "red" : "green",
              },
            ]}
          >
            <View style={styles.noteRow}>
              <Text style={{ color: "#fff", flex: 1 }}>{noteObj.text}</Text>
              <TouchableOpacity onPress={() => handleDeleteNote(idx)}>
                <FontAwesome name="trash" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.pulseButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.plusText}>＋</Text>
      </TouchableOpacity>

      {/* Add Note Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Note</Text>
            <View style={styles.dropdownContainer}>
              <Picker
                selectedValue={selectedType}
                onValueChange={(itemValue) => setSelectedType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="ToDo" value="ToDo" />
                <Picker.Item label="Task" value="Task" />
              </Picker>
            </View>

            <TextInput
              style={styles.noteInput}
              placeholder="Enter your note..."
              multiline
              value={note}
              onChangeText={setNote}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveNote}
            >
              <Text style={styles.saveText}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Upload Modal */}
      <Modal
        visible={uploadModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setUploadModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Upload Work</Text>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleFileUpload}
            >
              <Text style={styles.saveText}>Upload File</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.noteInput}
              placeholder="Paste link here..."
              value={linkInput}
              onChangeText={setLinkInput}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleLinkUpload}
            >
              <Text style={styles.saveText}>Upload Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: "#ccc" }]}
              onPress={() => setUploadModalVisible(false)}
            >
              <Text style={[styles.saveText, { color: "#333" }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
  },
  pdfButton: {
    borderWidth: 1,
    borderColor: "#6CBEB6",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  pdfText: {
    fontSize: 16,
    color: "#333",
  },
  yourWorkLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#fff",
    borderColor: "#6CBEB6",
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  addText: {
    fontSize: 16,
  },
  uploadedText: {
    fontSize: 14,
    marginBottom: 20,
    color: "#444",
  },
  doneButton: {
    backgroundColor: "#6CBEB6",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  doneText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  noteCard: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
  },
  noteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pulseButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#6CBEB6",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  plusText: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  picker: {
    height: 60,
    width: "100%",
  },
  dropdownContainer: {
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    overflow: "hidden",
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    height: 100,
    textAlignVertical: "top",
    borderRadius: 5,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#6CBEB6",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AssignmentScreen;
