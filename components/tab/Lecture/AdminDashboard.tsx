import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, Modal, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Common/StackNavigator";
import { getSubmittedAssignments } from "../../../utils/assignmentApi";
import { Alert } from "react-native";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function AdminDashboard() {
  const navigation = useNavigation<NavigationProp>();
  const [course, setCourse] = useState<string | null>(null);
  const [batch, setBatch] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewSubmittedOpen, setViewSubmittedOpen] = useState(false);
  const [viewSubmittedData, setViewSubmittedData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  const courses = [
    { label: "Select a course", value: "" },
    { label: "BA IT degree", value: "BA IT degree" },
    { label: "Social statistics", value: "Social statistics" },
    { label: "Business statistics", value: "Business statistics" },
  ];

  const batches = [
    { label: "Select a batch", value: "" },
    { label: "2025", value: "2025" },
    { label: "2026", value: "2026" },
    { label: "2027", value: "2027" },
  ];

  useEffect(() => {
    searchSubmissions();
  }, [course, batch]);

  const searchSubmissions = async () => {
    try {
      const filters: { course?: string; batch?: string } = {};
      if (course) filters.course = course;
      if (batch) filters.batch = batch;
      const data = await getSubmittedAssignments(filters);
      setSubmissions(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setSubmissions([]);
    }
  };

  const fetchViewSubmitted = async () => {
    try {
      const filters: { course?: string; batch?: string } = {};
      if (selectedCourse) filters.course = selectedCourse;
      if (selectedBatch) filters.batch = selectedBatch;
      const data = await getSubmittedAssignments(filters);
      setViewSubmittedData(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error fetching view submitted data:", error);
      setViewSubmittedData([]);
    }
  };

  const handleDownload = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Unable to open the download link");
    }
  };

  const renderSubmissionItem = ({ item }: { item: { _id: string; title: string; submissions: any[] } }) => (
    <View style={styles.studentItem}>
      <Text style={styles.studentName}>{item.title}</Text>
      <Text style={styles.status}>
        {item.submissions.length} submission{item.submissions.length !== 1 ? "s" : ""}
      </Text>
    </View>
  );

  const renderViewSubmittedItem = ({ item }: { item: any }) => {
    const submission = item.submissions[0] || {};
    const student = item.submissions[0]?.student || {};
    const studentName = student.name || "Unknown Student";
    const submissionType = submission.submissionType || "None";

    return (
      <View style={styles.viewSubmittedItem}>
        <Text style={styles.studentName}>{studentName}</Text>
        <Text style={styles.details}>
          Course: {item.course || "N/A"}, Batch: {item.batch || "N/A"}
        </Text>
        <Text style={styles.details}>
          Assignment: {item.title}, Submitted: {new Date(item.submittedAt).toLocaleDateString()}
        </Text>
        {submissionType === "link" && submission.submissionUrl && (
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL(submission.submissionUrl)}
          >
            <Text style={styles.buttonText}>Open Link</Text>
          </TouchableOpacity>
        )}
        {submissionType === "file" && submission.submissionUrl && (
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => handleDownload(submission.submissionUrl)}
          >
            <Text style={styles.buttonText}>Download PDF</Text>
          </TouchableOpacity>
        )}
        {submissionType === "None" && <Text style={styles.noSubmission}>No submission</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.hamburger} onPress={() => setMenuOpen(true)}>
        <FontAwesome name="bars" size={24} color="#000" />
      </TouchableOpacity>

      {menuOpen && (
        <View style={styles.sidebar}>
          <TouchableOpacity style={styles.closeSidebar} onPress={() => setMenuOpen(false)}>
            <FontAwesome name="times" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.sidebarTitle}>Menu</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("AddAssignment")}>
            <Text style={styles.menuText}>Add Assignment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("AllAssignments")}>
            <Text style={styles.menuText}>All Assignments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("EditAssignment")}>
            <Text style={styles.menuText}>Edit Assignment</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("SubmittedAssignment")}>
            <Text style={styles.menuText}>Submitted Assignment</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.menuItem} onPress={() => setViewSubmittedOpen(true)}>
            <Text style={styles.menuText}>View Submitted</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Setting")}>
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.greeting}>Admin Dashboard</Text>

      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          selectedValue={course}
          onValueChange={(itemValue) => setCourse(itemValue || null)}
        >
          {courses.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
        <Picker
          style={styles.picker}
          selectedValue={batch}
          onValueChange={(itemValue) => setBatch(itemValue || null)}
        >
          {batches.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>

      {submissions.length > 0 ? (
        <FlatList
          data={submissions}
          keyExtractor={(item) => item._id}
          renderItem={renderSubmissionItem}
        />
      ) : (
        course &&
        batch && <Text style={styles.noResults}>No submissions found.</Text>
      )}

      <Modal
        visible={viewSubmittedOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setViewSubmittedOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>View Submitted Assignments</Text>
              <TouchableOpacity onPress={() => setViewSubmittedOpen(false)}>
                <FontAwesome name="times" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalPickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={selectedCourse}
                onValueChange={(itemValue) => setSelectedCourse(itemValue || null)}
              >
                {courses.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
              <Picker
                style={styles.picker}
                selectedValue={selectedBatch}
                onValueChange={(itemValue) => setSelectedBatch(itemValue || null)}
              >
                {batches.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => fetchViewSubmitted()}
            >
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
            {viewSubmittedData.length > 0 ? (
              <FlatList
                data={viewSubmittedData}
                keyExtractor={(item) => item._id}
                renderItem={renderViewSubmittedItem}
              />
            ) : (
              selectedCourse &&
              selectedBatch && <Text style={styles.noResults}>No submissions found.</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E5E5",
    padding: 20,
    paddingTop: 60,
  },
  hamburger: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#222",
    opacity: 0.9,
    paddingTop: 50,
    paddingLeft: 20,
    zIndex: 10,
  },
  closeSidebar: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
  },
  sidebarTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 15,
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
  },
  picker: {
    width: "48%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  studentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderWidth: 1,
    borderColor: "#00796B",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  studentName: {
    fontSize: 16,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
  },
  noResults: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 10,
    padding: 20,
    height: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#34a0a4",
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalPickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 10,
  },
  searchButton: {
    backgroundColor: "#34a0a4",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  viewSubmittedItem: {
    flexDirection: "column",
    padding: 15,
    borderWidth: 1,
    borderColor: "#00796B",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginVertical: 2,
  },
  linkButton: {
    backgroundColor: "#34a0a4",
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    alignItems: "center",
  },
  downloadButton: {
    backgroundColor: "#34a0a4",
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  noSubmission: {
    fontSize: 14,
    color: "#ff4444",
    marginTop: 5,
  },
});