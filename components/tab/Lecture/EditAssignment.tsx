import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { getAssignments, updateAssignment } from "../../../utils/assignmentApi";

export default function EditAssignment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    subject: "",
    dueDate: new Date(),
    dueTime: new Date(),
    priority: "medium",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // Search for assignments by title
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter an assignment title to search");
      return;
    }

    setLoading(true);
    try {
      const data = await getAssignments({ title: searchQuery });
      const filteredAssignments = Array.isArray(data) ? data : data.data || [];
      setAssignments(filteredAssignments);
      if (filteredAssignments.length === 0) {
        Alert.alert("No Results", "No assignments found with that title");
      }
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", error.message || "Failed to search assignments");
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  // Load selected assignment into form
  const loadAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      title: assignment.title,
      course: assignment.course,
      subject: assignment.subject,
      dueDate: new Date(assignment.dueDate),
      dueTime: new Date(`1970-01-01T${assignment.dueTime}:00`),
      priority: assignment.priority,
    });
    setAssignments([]); // Clear search results
    setSearchQuery(""); // Clear search field
  };

  // Handle date change
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, dueDate: selectedDate });
    }
  };

  // Handle time change
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFormData({ ...formData, dueTime: selectedTime });
    }
  };

  // Save updated assignment
  const handleSave = async () => {
    if (!selectedAssignment) {
      Alert.alert("Error", "Please select an assignment to edit");
      return;
    }
    if (!formData.title || !formData.course || !formData.subject) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    setLoading(true);
    try {
      const updatedData = {
        title: formData.title,
        course: formData.course,
        subject: formData.subject,
        dueDate: formData.dueDate.toISOString().split("T")[0], // YYYY-MM-DD
        dueTime: formData.dueTime.toTimeString().split(" ")[0].slice(0, 5), // HH:MM
        priority: formData.priority,
      };
      const updatedAssignment = await updateAssignment(selectedAssignment._id, updatedData);
      Toast.show({
        type: "success",
        text1: "Assignment Updated",
        text2: `${updatedAssignment.title} updated successfully!`,
      });
      setSelectedAssignment(updatedAssignment); // Update local state
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", error.message || "Failed to update assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Assignment</Text>

      {/* Search Field */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Assignment Title"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={loading}>
          <FontAwesome name="search" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      {assignments.length > 0 && (
        <FlatList
          data={assignments}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.assignmentItem} onPress={() => loadAssignment(item)}>
              <Text style={styles.assignmentTitle}>{item.title}</Text>
              <Text style={styles.assignmentDetails}>
                {item.course} - {item.subject}
              </Text>
            </TouchableOpacity>
          )}
          style={styles.searchResults}
        />
      )}

      {/* Edit Form */}
      {selectedAssignment && (
        <>
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

          <TextInput
            style={styles.input}
            placeholder="Course"
            value={formData.course}
            onChangeText={(text) => setFormData({ ...formData, course: text })}
          />
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
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setSelectedAssignment(null)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    marginBottom: 20,
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "#7FCAC3",
    padding: 12,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  searchResults: {
    maxHeight: 150,
    marginBottom: 20,
  },
  assignmentItem: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#00796B",
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  assignmentDetails: {
    fontSize: 14,
    color: "#555",
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