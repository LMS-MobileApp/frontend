import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import { ScrollView } from "react-native-gesture-handler";
import { StackNavigationProp } from "@react-navigation/stack";
//@ts-ignore
import { RootStackParamList } from "../Common/StackNavigator";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';

type AssignmentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Assignments"
>;

export default function AssignmentView() {
  const [selectedSubject, setSelectedSubject] = useState("Math");
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [progressMessage, setProgressMessage] = useState(
    "No completed assignment yet"
  );
  const navigation = useNavigation<AssignmentScreenNavigationProp>();

  // Due Assignments (Not Completed)
  const dueAssignments = [
    { id: "1", title: "Assignment 1" },
    { id: "2", title: "Assignment 2" },
    { id: "3", title: "Assignment 3" },
    { id: "4", title: "Assignment 4" },
    { id: "5", title: "Assignment 5" },
  ];

  // Completed Assignments
  const completedAssignments = [
    { id: "6", title: "Assignment 1", correctAnswers: 6, totalQuestions: 10 },
    { id: "7", title: "Assignment 2", correctAnswers: 8, totalQuestions: 10 },
    { id: "8", title: "Assignment 3", correctAnswers: 7, totalQuestions: 10 },
    { id: "9", title: "Assignment 4", correctAnswers: 2, totalQuestions: 10 },
    { id: "10", title: "Assignment 5", correctAnswers: 2, totalQuestions: 10 },
  ];

  const handleCompletedAssignmentClick = (assignment: any, isDue: boolean) => {
    if (isDue) {
      navigation.navigate("Assignments", { assignmentId: assignment.id }); // Pass the assignment ID
    }
    if (assignment.correctAnswers !== undefined) {
      const percentage =
        (assignment.correctAnswers / assignment.totalQuestions) * 100;
      setProgress(percentage);
      setProgressMessage(`${percentage.toFixed(0)}%`);
      setShowProgress(true);
    }
  };

  const renderAssignmentItem = ({ item }: any, isDue: boolean) => (
    <TouchableOpacity
      style={styles.assignmentBox}
      onPress={() => handleCompletedAssignmentClick(item, isDue)}
    >
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Assignment</Text>
        <Image
          source={{
            uri: "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg?semt=ais_hybrid",
          }}
          style={styles.profileImage}
        />
      </View>

      {/* Subject Picker */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedSubject}
          onValueChange={(itemValue) => setSelectedSubject(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Math" value="Math" />
          <Picker.Item label="Science" value="Science" />
          <Picker.Item label="English" value="English" />
        </Picker>
      </View>

      {/* Due Assignments */}
      <Text style={styles.sectionTitle}>Due Assignments</Text>
      <FlatList
        data={dueAssignments}
        renderItem={({ item }) => renderAssignmentItem({ item }, true)}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled={dueAssignments.length > 3}
        showsHorizontalScrollIndicator={false}
      />

      {/* Completed Assignments */}
      <Text style={styles.sectionTitle}>Completed Assignments</Text>
      <FlatList
        data={completedAssignments}
        renderItem={({ item }) => renderAssignmentItem({ item }, false)}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled={completedAssignments.length > 3}
        showsHorizontalScrollIndicator={false}
      />

      {/* Completed Assignment Progress */}
      {/* <Text style={styles.progressTitle}>Completed Assignment Progress</Text>
      <View style={styles.progressContainer}>
        {showProgress ? (
          <>
            <Slider
              style={{ width: "80%" }}
              minimumValue={0}
              maximumValue={100}
              value={progress}
              minimumTrackTintColor="#FA171B"
              maximumTrackTintColor="#D3D3D3"
              thumbTintColor="#FA171B"
            />
            <Text style={styles.progressText}>{progressMessage}</Text>
          </>
        ) : (
          <Text style={styles.noProgressText}>{progressMessage}</Text>
        )}
      </View> */}

      {/* Buttons */}
      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Attached Notes</Text>
          <FontAwesome
            name="paperclip"
            size={18}
            color="#6CBEB6"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  pickerContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    elevation: 3,
    marginBottom: 15,
  },
  picker: {
    height: 60,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 20,
  },
  assignmentBox: {
    width: 150,
    height: 100,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 10,
    borderBlockColor: "#6CBEB6",
    borderWidth: 1,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 20,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  progressText: {
    fontSize: 16,
    textAlign: "center",
  },
  noProgressText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: "#6CBEB6",
    borderWidth: 1,
  },
  icon: {
    marginLeft: 8,
    color: "black",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "semibold",
    textAlign: "center",
  },
});
