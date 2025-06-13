import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons";
import { RootStackParamList } from "../Common/StackNavigator";
import { getAssignments } from "../../../utils/assignmentApi";

// Debug the imports
console.log("🔍 Checking imports:");
console.log("getAssignments type:", typeof getAssignments);

type AddAssignmentNavigationProp = StackNavigationProp<RootStackParamList, "AddAssignment">;
type EditAssignmentNavigationProp = StackNavigationProp<RootStackParamList, "EditAssignment">;

const ITEMS_PER_PAGE = 10;

export default function AllAssignments() {
  const navigationAdd = useNavigation<AddAssignmentNavigationProp>();
  const navigationEdit = useNavigation<EditAssignmentNavigationProp>();
  const [assignments, setAssignments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      console.log("Fetching assignments...");
      const data = await getAssignments();
      console.log("Fetched assignments:", data);
      setAssignments(data);
    } catch (error) {
      console.error("Fetch assignments error:", error);
      Alert.alert("Error", error.message || "Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  };

  // Refresh assignments when screen is focused (e.g., after editing or deleting)
  useFocusEffect(
    React.useCallback(() => {
      fetchAssignments();
    }, [])
  );

  const totalPages = Math.ceil(assignments.length / ITEMS_PER_PAGE);
  const currentAssignments = assignments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (id) => {
    console.log("Navigating to EditAssignment with ID:", id);
    navigationEdit.navigate("EditAssignment", { id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>All Assignments</Text>
        <TouchableOpacity
          style={styles.pulseButton}
          onPress={() => navigationAdd.navigate("AddAssignment")}
        >
          <FontAwesome name="plus" size={16} color="black" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading assignments...</Text>
        </View>
      ) : assignments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No assignments found</Text>
        </View>
      ) : (
        <>
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>Assignment Name</Text>
            <Text style={styles.headerText}>Actions</Text>
          </View>
          <FlatList
            data={currentAssignments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.assignmentText}>{item.title}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => handleEdit(item._id)}
                  >
                    <FontAwesome name="pencil" size={20} color="green" style={styles.icon} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <View style={styles.pagination}>
            <TouchableOpacity
              disabled={currentPage === 1}
              onPress={() => setCurrentPage((prev) => prev - 1)}
            >
              <Text style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}>{"<"}</Text>
            </TouchableOpacity>
            <Text style={styles.pageNumber}>{`${currentPage} / ${totalPages || 1}`}</Text>
            <TouchableOpacity
              disabled={currentPage === totalPages || totalPages === 0}
              onPress={() => setCurrentPage((prev) => prev + 1)}
            >
              <Text style={[styles.pageButton, (currentPage === totalPages || totalPages === 0) && styles.disabledButton]}>{">"}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 30,
    backgroundColor: "#f1f1f1",
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 15,
  },
  pulseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#999",
    marginBottom: 10,
  },
  headerText: {
    fontWeight: "bold",
    width: "48%",
    textAlign: "center",
    color: "#6CBEB6",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  assignmentText: {
    width: "48%",
    textAlign: "center",
  },
  actions: {
    width: "48%",
    flexDirection: "row",
    justifyContent: "flex-start", // Adjusted to center the single action
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 10,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    alignItems: "center",
  },
  pageButton: {
    fontSize: 20,
    paddingHorizontal: 20,
    color: "#6CBEB6",
  },
  pageNumber: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  disabledButton: {
    color: "#ccc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});