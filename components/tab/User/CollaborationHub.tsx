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
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList } from "../Common/StackNavigator";
import { createGroupChat, joinGroupChat } from "../../../utils/groupChatApi";

type CollaborationHubNavigationProp = StackNavigationProp<RootStackParamList, "CollaborationHub">;
type GroupChatScreenNavigationProp = StackNavigationProp<RootStackParamList, "GroupChatScreen">;

export default function CollaborationHub() {
  const navigation = useNavigation<CollaborationHubNavigationProp & GroupChatScreenNavigationProp>();
  const [groupChats, setGroupChats] = useState([]); // Mocked for now
  const [groupName, setGroupName] = useState("");
  const [assignmentId, setAssignmentId] = useState("67f02df8020c2886cd44c047"); // Hardcoded for demo

  useEffect(() => {
    // Fetch group chats for assignment (you might need a GET /api/group-chats endpoint)
    setGroupChats([
      { _id: "67f02fa4d9ccbcd395e73ef6", name: "HDSE Group", members: ["user1"] },
    ]); // Mock data
  }, []);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Error", "Please enter a group name");
      return;
    }
    try {
      const newGroup = await createGroupChat(assignmentId, groupName);
      setGroupChats((prev) => [...prev, newGroup]);
      setGroupName("");
      Alert.alert("Success", "Group chat created!");
    } catch (error) {
      Alert.alert("Error", error.message);
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
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Collaboration Hub</Text>

      <View style={styles.createContainer}>
        <TextInput
          style={styles.input}
          placeholder="Group Name (e.g., HDSE Group)"
          value={groupName}
          onChangeText={setGroupName}
        />
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
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
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