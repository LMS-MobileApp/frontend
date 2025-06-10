import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform, Picker } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { createAssignment } from "../../../utils/assignmentApi";

export default function AddAssignment() {
  const [formData, setFormData] = useState({
    dueDate: new Date(),
    dueTime: new Date(),
    title: "",
    course: "",
    subject: "",
    priority: "medium",
    selectedFile: null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickFile = async () => {
    try {
      if (Platform.OS === "web") {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/pdf";
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            setFormData({ ...formData, selectedFile: { assets: [{ uri: file, name: file.name, type: file.type }] } });
          } else {
            Alert.alert("Error", "No file selected");
          }
        };
        input.click();
      } else {
        const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
        if (!result.canceled && result.assets && result.assets.length > 0) {
          setFormData({ ...formData, selectedFile: result });
        } else {
          Alert.alert("Error", "No PDF selected or selection canceled");
        }
      }
    } catch (error) {
      console.error("File picker error:", error);
      Alert.alert("Error", "Failed to pick file");
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, dueDate: selectedDate });
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFormData({ ...formData, dueTime: selectedTime });
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.course || !formData.subject || !formData.selectedFile) {
      Alert.alert("Error", "All fields and a PDF file are required");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("course", formData.course);
    data.append("subject", formData.subject);
    data.append("dueDate", formData.dueDate.toISOString().split("T")[0]);
    data.append("dueTime", formData.dueTime.toTimeString().split(" ")[0].slice(0, 5));
    data.append("priority", formData.priority);

    if (formData.selectedFile && formData.selectedFile.assets) {
      const file = formData.selectedFile.assets[0];
      data.append("pdf", Platform.OS === "web" ? file.uri : { uri: file.uri, name: file.name, type: file.type });
    } else {
      Alert.alert("Error", "No valid PDF file selected");
      setLoading(false);
      return;
    }

    try {
      const assignment = await createAssignment(data);
      Toast.show({
        type: "success",
        text1: "Assignment Created",
        text2: `${assignment.title} added successfully!`,
      });
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", error.message || "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Assignment</Text>

      <TouchableOpacity style={styles.addButton} onPress={pickFile}>
        <FontAwesome name="file" size={18} color="white" />
        <Text style={styles.addButtonText}>Add PDF</Text>
      </TouchableOpacity>

      {formData.selectedFile && formData.selectedFile.assets && (
        <Text style={styles.fileName}>
          <FontAwesome name="file-pdf-o" size={16} color="red" />{" "}
          {formData.selectedFile.assets[0].name}
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Assignment Title"
        value={formData.title}
        onChangeText={(text) => setFormData({ ...formData, title: text })}
      />

      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>{formData.dueDate.toDateString()}</Text>
        <FontAwesome name="calendar" size={18} color="gray" style={styles.icon} />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={formData.dueDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
        <Text>{formData.dueTime.toTimeString().split(" ")[0].slice(0, 5)}</Text>
        <FontAwesome name="clock-o" size={18} color="gray" style={styles.icon} />
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={formData.dueTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <Picker
        style={styles.input}
        selectedValue={formData.course}
        onValueChange={(itemValue) => setFormData({ ...formData, course: itemValue })}
      >
        <Picker.Item label="Select a course" value="" />
        <Picker.Item label="BA IT degree" value="BA IT degree" />
        <Picker.Item label="Social statistics" value="Social statistics" />
        <Picker.Item label="Bussiness statistics" value="Bussiness statistics" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={formData.subject}
        onChangeText={(text) => setFormData({ ...formData, subject: text })}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Save"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E5E5E5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7FCAC3",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
  },
  fileName: {
    fontSize: 14,
    color: "black",
    marginBottom: 30,
    marginLeft: 7,
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    marginBottom: 20,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    position: "absolute",
    right: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#7FCAC3",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#A9A9A9",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});