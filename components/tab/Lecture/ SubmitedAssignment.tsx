// import React, { useState, useEffect } from "react";
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { FontAwesome } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import Toast from "react-native-toast-message";
// import { RootStackParamList } from "../Common/StackNavigator";
// import { getSubmittedAssignments } from "../../../utils/assignmentApi";

// type NavigationProp = StackNavigationProp<RootStackParamList>;

// const ITEMS_PER_PAGE = 10;

// export default function SubmittedAssignment() {
//   const navigation = useNavigation<NavigationProp>();
//   const [submissions, setSubmissions] = useState([]);
//   const [course, setCourse] = useState<string | null>(null);
//   const [batch, setBatch] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const courses = [
//     { label: "Select a course", value: "" },
//     { label: "BA IT degree", value: "BA IT degree" },
//     { label: "Social statistics", value: "Social statistics" },
//     { label: "Business statistics", value: "Business statistics" },
//   ];

//   const batches = [
//     { label: "Select a batch", value: "" },
//     { label: "2025", value: "2025" },
//     { label: "2026", value: "2026" },
//     { label: "2027", value: "2027" },
//   ];

//   useEffect(() => {
//     fetchSubmissions();
//   }, [course, batch]);

//   const fetchSubmissions = async () => {
//     setLoading(true);
//     try {
//       const filters: { course?: string; batch?: string } = {};
//       if (course) filters.course = course;
//       if (batch) filters.batch = batch;
//       const data = await getSubmittedAssignments(filters);
//       setSubmissions(Array.isArray(data) ? data : data.data || []);
//     } catch (error) {
//       Alert.alert("Error", error.message || "Failed to fetch submissions");
//       setSubmissions([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalPages = Math.ceil(submissions.length / ITEMS_PER_PAGE);
//   const currentSubmissions = submissions.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   const handleViewDetails = (submission: { _id: string; studentName: string; title: string }) => {
//     Alert.alert(
//       "Submission Details",
//       `Assignment: ${submission.title}\nStudent: ${submission.studentName}\nSubmitted: ${new Date().toLocaleString()}`,
//       [{ text: "OK" }]
//     );
//   };

//   const renderSubmissionItem = ({ item }: { item: { _id: string; studentName: string; title: string } }) => (
//     <View style={styles.row}>
//       <Text style={styles.submissionText}>{item.title}</Text>
//       <Text style={styles.studentText}>{item.studentName}</Text>
//       <TouchableOpacity onPress={() => handleViewDetails(item)}>
//         <FontAwesome name="eye" size={20} color="#00796B" style={styles.icon} />
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.titleRow}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <FontAwesome name="arrow-left" size={20} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Submitted Assignments</Text>
//         <View style={{ width: 20 }} />
//       </View>

//       <View style={styles.pickerContainer}>
//         <Picker
//           style={styles.picker}
//           selectedValue={course}
//           onValueChange={(itemValue) => setCourse(itemValue || null)}
//         >
//           {courses.map((option) => (
//             <Picker.Item key={option.value} label={option.label} value={option.value} />
//           ))}
//         </Picker>
//         <Picker
//           style={styles.picker}
//           selectedValue={batch}
//           onValueChange={(itemValue) => setBatch(itemValue || null)}
//         >
//           {batches.map((option) => (
//             <Picker.Item key={option.value} label={option.label} value={option.value} />
//           ))}
//         </Picker>
//       </View>

//       {loading ? (
//         <Text style={styles.loadingText}>Loading...</Text>
//       ) : (
//         <>
//           <View style={styles.tableHeader}>
//             <Text style={styles.headerText}>Assignment</Text>
//             {/* <Text style={styles.headerText}>Student</Text> */}
//             <Text style={styles.headerText}>Actions</Text>
//           </View>
//           <FlatList
//             data={currentSubmissions}
//             keyExtractor={(item) => item._id}
//             renderItem={renderSubmissionItem}
//             ListEmptyComponent={course && batch && <Text style={styles.noResults}>No submissions found.</Text>}
//           />
//           <View style={styles.pagination}>
//             <TouchableOpacity
//               disabled={currentPage === 1}
//               onPress={() => setCurrentPage((prev) => prev - 1)}
//             >
//               <Text style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}>{"<"}</Text>
//             </TouchableOpacity>
//             <Text style={styles.pageNumber}>{`${currentPage} / ${totalPages}`}</Text>
//             <TouchableOpacity
//               disabled={currentPage === totalPages}
//               onPress={() => setCurrentPage((prev) => prev + 1)}
//             >
//               <Text style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}>{">"}</Text>
//             </TouchableOpacity>
//           </View>
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     marginTop: 30,
//     backgroundColor: "#f1f1f1",
//   },
//   titleRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "600",
//     textAlign: "center",
//     marginVertical: 15,
//   },
//   pickerContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//     marginTop: 10,
//   },
//   picker: {
//     width: "48%",
//     height: 50,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     borderWidth: 1,
//     borderColor: "#ccc",
//   },
//   tableHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 6,
//     borderBottomWidth: 1,
//     borderColor: "#999",
//     marginBottom: 10,
//   },
//   headerText: {
//     fontWeight: "bold",
//     width: "33%",
//     textAlign: "center",
//     color: "#6CBEB6",
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 8,
//     borderBottomWidth: 0.5,
//     borderColor: "#ccc",
//     alignItems: "center",
//   },
//   submissionText: {
//     width: "33%",
//     textAlign: "center",
//     fontSize: 16,
//   },
//   studentText: {
//     width: "33%",
//     textAlign: "center",
//     fontSize: 16,
//   },
//   icon: {
//     width: "33%",
//     textAlign: "center",
//   },
//   pagination: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 16,
//     alignItems: "center",
//   },
//   pageButton: {
//     fontSize: 20,
//     paddingHorizontal: 20,
//     color: "#6CBEB6",
//   },
//   disabledButton: {
//     color: "#ccc",
//   },
//   pageNumber: {
//     fontSize: 16,
//     marginHorizontal: 10,
//   },
//   loadingText: {
//     textAlign: "center",
//     fontSize: 16,
//     marginTop: 20,
//   },
//   noResults: {
//     textAlign: "center",
//     fontSize: 16,
//     color: "#888",
//     marginTop: 10,
//   },
// });


import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Toast from "react-native-toast-message";
import { RootStackParamList } from "../Common/StackNavigator";
import { getSubmittedAssignments } from "../../../utils/assignmentApi";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ITEMS_PER_PAGE = 10;

export default function SubmittedAssignment() {
  const navigation = useNavigation<NavigationProp>();
  const [submissions, setSubmissions] = useState([]);
  const [course, setCourse] = useState<string | null>(null);
  const [batch, setBatch] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

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
    fetchSubmissions();
  }, [course, batch]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const filters: { course?: string; batch?: string } = {};
      if (course) filters.course = course;
      if (batch) filters.batch = batch;
      const data = await getSubmittedAssignments(filters);
      setSubmissions(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to fetch submissions");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(submissions.length / ITEMS_PER_PAGE);
  const currentSubmissions = submissions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleViewDetails = (submission: { _id: string; studentName: string; title: string }) => {
    navigation.navigate("ViewSubmitted", { 
      assignmentId: submission._id, 
      title: submission.title, 
      studentName: submission.studentName 
    });
  };

  const renderSubmissionItem = ({ item }: { item: { _id: string; studentName: string; title: string } }) => (
    <View style={styles.row}>
      <Text style={styles.submissionText}>{item.title}</Text>
      <Text style={styles.studentText}>{item.studentName}</Text>
      <TouchableOpacity onPress={() => handleViewDetails(item)}>
        <FontAwesome name="eye" size={20} color="#00796B" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Submitted Assignments</Text>
        <View style={{ width: 20 }} />
      </View>

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

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <>
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>Assignment</Text>
            <Text style={styles.headerText}>Student</Text>
            <Text style={styles.headerText}>Actions</Text>
          </View>
          <FlatList
            data={currentSubmissions}
            keyExtractor={(item) => item._id}
            renderItem={renderSubmissionItem}
            ListEmptyComponent={course && batch && <Text style={styles.noResults}>No submissions found.</Text>}
          />
          <View style={styles.pagination}>
            <TouchableOpacity
              disabled={currentPage === 1}
              onPress={() => setCurrentPage((prev) => prev - 1)}
            >
              <Text style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}>{"<"}</Text>
            </TouchableOpacity>
            <Text style={styles.pageNumber}>{`${currentPage} / ${totalPages}`}</Text>
            <TouchableOpacity
              disabled={currentPage === totalPages}
              onPress={() => setCurrentPage((prev) => prev + 1)}
            >
              <Text style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}>{">"}</Text>
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
    padding: 16,
    marginTop: 30,
    backgroundColor: "#f1f1f1",
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
    width: "33%",
    textAlign: "center",
    color: "#6CBEB6",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    alignItems: "center",
  },
  submissionText: {
    width: "33%",
    textAlign: "center",
    fontSize: 16,
  },
  studentText: {
    width: "33%",
    textAlign: "center",
    fontSize: 16,
  },
  icon: {
    width: "33%",
    textAlign: "center",
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
  disabledButton: {
    color: "#ccc",
  },
  pageNumber: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  noResults: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 10,
  },
});