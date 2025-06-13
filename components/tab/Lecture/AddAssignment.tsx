import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
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
    batch: "",
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
            setFormData({ ...formData, selectedFile: { assets: [{ uri: URL.createObjectURL(file), name: file.name, type: file.type, file }] } });
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

  const handleSubmit = async () => {
    const { title, course, batch, subject, dueDate, dueTime, selectedFile } = formData;
    if (!title || !course || !batch || !subject || !dueDate || !dueTime || !selectedFile?.assets?.[0]) {
      Alert.alert("Error", "Please fill all fields and select a PDF file");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("title", title);
    data.append("course", course);
    data.append("batch", batch);
    data.append("subject", subject);
    data.append("dueDate", dueDate.toISOString().split("T")[0]);
    data.append("dueTime", dueTime.toTimeString().split(" ")[0].slice(0, 5));
    data.append("priority", formData.priority);

    if (selectedFile && selectedFile.assets) {
      const file = selectedFile.assets[0];
      if (Platform.OS === "web") {
        data.append("pdf", file.file, file.name);
      } else {
        data.append("pdf", { uri: file.uri, name: file.name, type: file.type });
      }
    } else {
      Alert.alert("Error", "No valid PDF file selected");
      setLoading(false);
      return;
    }

    // Log FormData entries for debugging
    console.log("FormData entries:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
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
          <FontAwesome name="file-pdf-o" size={16} color="red" /> {formData.selectedFile.assets[0].name}
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
        <Picker.Item label="Business statistics" value="Business statistics" />
      </Picker>

      <Picker
        style={styles.input}
        selectedValue={formData.batch}
        onValueChange={(itemValue) => setFormData({ ...formData, batch: itemValue })}
      >
        <Picker.Item label="Select a batch" value="" />
        <Picker.Item label="2025" value="2025" />
        <Picker.Item label="2026" value="2026" />
        <Picker.Item label="2027" value="2027" />
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
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Save"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setFormData({ dueDate: new Date(), dueTime: new Date(), title: "", course: "", batch: "", subject: "", priority: "medium", selectedFile: null })}
        >
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
    marginTop: 10,
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