import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Common/StackNavigator";
import { createGroupChat, fetchGroupChats, fetchAssignments } from "../../../utils/groupChatApi";

type CollaborationHubNavigationProp = StackNavigationProp<RootStackParamList, "CollaborationHub">;
type GroupChatScreenNavigationProp = StackNavigationProp<RootStackParamList, "GroupChatScreen">;

export default function CollaborationHub() {
  const navigation = useNavigation<CollaborationHubNavigationProp & GroupChatScreenNavigationProp>();
  const [groupChats, setGroupChats] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Fetching assignments...");
        const assignmentsData = await fetchAssignments();
        console.log("Fetched assignments:", assignmentsData);
        setAssignments(assignmentsData);
        if (assignmentsData.length > 0) {
          setAssignmentTitle(assignmentsData[0].title); // Default to first assignment title
        } else {
          console.log("No assignments found");
          setAssignmentTitle(""); // Clear if no data
        }
      } catch (error) {
        console.log("Error fetching assignments:", error.message);
        Alert.alert("Error", "Failed to load assignments: " + error.message);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (assignmentTitle) {
      const loadGroupChats = async () => {
        try {
          console.log("Fetching group chats for title:", assignmentTitle);
          const groupChatsData = await fetchGroupChats(assignmentTitle);
          console.log("Fetched group chats:", groupChatsData);
          setGroupChats(groupChatsData);
        } catch (error) {
          console.log("Error fetching group chats:", error.message);
          Alert.alert("Error", "Failed to load group chats: " + error.message);
        }
      };
      loadGroupChats();
    } else {
      setGroupChats([]);
    }
  }, [assignmentTitle]);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Error", "Please enter a group name");
      return;
    }
    if (!assignmentTitle) {
      Alert.alert("Error", "Please select an assignment");
      return;
    }
    try {
      console.log("Creating group with title:", assignmentTitle, "name:", groupName);
      const newGroup = await createGroupChat(assignmentTitle, groupName);
      console.log("Group created:", newGroup);
      setGroupChats((prev) => [...prev, newGroup]);
      setGroupName("");
      Alert.alert("Success", "Group chat created!");
    } catch (error) {
      console.log("Error creating group:", error.message);
      Alert.alert("Error", "Failed to create group chat: " + error.message);
    }
  };

  const handleJoinGroup = async (groupChatId) => {
    try {
      const updatedGroup = await joinGroupChat(groupChatId);
      setGroupChats((prev) =>
        prev.map((g) => (g._id === groupChatId ? updatedGroup : g))
      );
      Alert.alert("Success", "Joined group chat!");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to join group chat");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Collaboration Hub</Text>

      <View style={styles.createContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search group chats..."
          value=""
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Group Name (e.g., xxx Group)"
          value={groupName}
          onChangeText={setGroupName}
        />
        <Picker
          selectedValue={assignmentTitle}
          onValueChange={(itemValue) => setAssignmentTitle(itemValue)}
          style={styles.picker}
          enabled={true}
        >
          <Picker.Item label="Select an assignment" value="" />
          {assignments.map((assignment) => (
            <Picker.Item
              key={assignment._id}
              label={assignment.title || "Untitled"}
              value={assignment.title || ""}
            />
          ))}
        </Picker>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
          <Text style={styles.createButtonText}>Create Group</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={groupChats}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.groupItem}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupMembers}>{item.members.length} Members</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => handleJoinGroup(item._id)}
              >
                <Text style={styles.buttonText}>Join</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => navigation.navigate("GroupChatScreen", { groupChatId: item._id })}
              >
                <Text style={styles.buttonText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  createContainer: {
    marginBottom: 20,
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    height: 50,
    width: "100%",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    height: 40,
  },
  createButton: {
    backgroundColor: "#34a0a4",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  groupItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#34a0a4",
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  groupMembers: {
    fontSize: 14,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  joinButton: {
    backgroundColor: "#34a0a4",
    padding: 8,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  chatButton: {
    backgroundColor: "#7FCAC3",
    padding: 8,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});