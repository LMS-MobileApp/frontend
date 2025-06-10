import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Common/StackNavigator";
import { getSubmittedAssignments } from "../../../utils/assignmentApi";

type AddAssignmentNavigationProp = StackNavigationProp<RootStackParamList, "AddAssignment">;
type AllAssignmentsNavigationProp = StackNavigationProp<RootStackParamList, "AllAssignments">;
type EditAssignmentNavigationProp = StackNavigationProp<RootStackParamList, "EditAssignment">; // Added
type SettingScreenNavigationProp = StackNavigationProp<RootStackParamList, "Setting">;

export default function AdminDashboard() {
  const navigationAddAssignment = useNavigation<AddAssignmentNavigationProp>();
  const navigationAllAssignments = useNavigation<AllAssignmentsNavigationProp>();
  const navigationEditAssignment = useNavigation<EditAssignmentNavigationProp>(); // Added
  const navigationSetting = useNavigation<SettingScreenNavigationProp>();

  const [course, setCourse] = useState(null);
  const [batch, setBatch] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const courses = [
    { label: "Computer Science", value: "Computer Science" },
    { label: "Business Management", value: "Business Management" },
  ];

  const batches = [
    { label: "2023", value: "2023" },
    { label: "2024", value: "2024" },
  ];

  useEffect(() => {
    searchSubmissions();
  }, [course, batch]);

  const searchSubmissions = async () => {
    try {
      const filters = {};
      if (course) filters.course = course;
      if (batch) filters.batch = batch;
      const data = await getSubmittedAssignments(filters);
      setSubmissions(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error(error.message);
      setSubmissions([]);
    }
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
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText} onPress={() => navigationAddAssignment.navigate("AddAssignment")}>
              Add Assignment
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText} onPress={() => navigationAllAssignments.navigate("AllAssignments")}>
              All Assignments
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText} onPress={() => navigationEditAssignment.navigate("EditAssignment")}>
              Edit Assignment
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText} onPress={() => navigationSetting.navigate("Setting")}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.greeting}>Hello, Klera Ogasthine</Text>

      <View style={styles.dropdownContainer}>
        <Dropdown
          data={courses}
          labelField="label"
          valueField="value"
          placeholder="Course"
          value={course}
          search
          searchPlaceholder="Search Course..."
          onChange={(item) => setCourse(item.value)}
          style={styles.dropdown}
        />
        <Dropdown
          data={batches}
          labelField="label"
          valueField="value"
          placeholder="Batch"
          value={batch}
          search
          searchPlaceholder="Search Batch..."
          onChange={(item) => setBatch(item.value)}
          style={styles.dropdown}
        />
      </View>

      {submissions.length > 0 ? (
        <FlatList
          data={submissions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.studentItem}>
              <Text style={styles.studentName}>{item.title}</Text>
              <Text style={styles.status}>
                {item.submissions.length} submission{item.submissions.length !== 1 ? "s" : ""}
              </Text>
            </View>
          )}
        />
      ) : (
        course &&
        batch && <Text style={styles.noResults}>No submissions found.</Text>
      )}
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
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
  },
  dropdown: {
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
});