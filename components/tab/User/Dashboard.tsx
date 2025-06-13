import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Common/StackNavigator"; // Adjust path as needed
import { Picker } from "@react-native-picker/picker";

const screenWidth = Dimensions.get("window").width;

type DashboardNavigationProp = StackNavigationProp<RootStackParamList>;

const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("JWT decode error:", error);
    return {};
  }
};

const Dashboard = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [groupChatModal, setGroupChatModal] = useState(false);
  const [groupChats, setGroupChats] = useState([]);
  const [allGroupChats, setAllGroupChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroupChat, setSelectedGroupChat] = useState(null);
  const [groupMessages, setGroupMessages] = useState([]);
  const [groupMessageInput, setGroupMessageInput] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCourse, setEditCourse] = useState("");
  const [editBatch, setEditBatch] = useState("");
  const [editRegNo, setEditRegNo] = useState("");
  const [assignmentModal, setAssignmentModal] = useState(false);
  const [submissionLink, setSubmissionLink] = useState("");
  const [submissionFile, setSubmissionFile] = useState(null);
  const [notesModal, setNotesModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteType, setNewNoteType] = useState("note");
  const [editNoteId, setEditNoteId] = useState(null);
  const [editNoteContent, setEditNoteContent] = useState("");
  const [editNoteType, setEditNoteType] = useState("note");
  const [editNoteCompleted, setEditNoteCompleted] = useState(false);
  const socket = io("http://localhost:5001");

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const decoded = decodeJWT(token);
          setUserId(decoded.id);

          const profileResponse = await axios.get("http://localhost:5001/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfile(profileResponse.data);
          setEditName(profileResponse.data.name);
          setEditEmail(profileResponse.data.email);
          setEditCourse(profileResponse.data.course || "");
          setEditBatch(profileResponse.data.batch || "");
          setEditRegNo(profileResponse.data.regNo || "");

          const userChatsResponse = await axios.get("http://localhost:5001/api/group-chats", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setGroupChats(userChatsResponse.data);

          const allChatsResponse = await axios.get("http://localhost:5001/api/group-chats/all", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAllGroupChats(allChatsResponse.data);

          setLoadingAssignments(true);
          const assignmentsResponse = await axios.get("http://localhost:5001/api/assignments/minimal", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAssignments(assignmentsResponse.data || []);
          setAssignmentTitle(assignmentsResponse.data.length > 0 ? assignmentsResponse.data[0].title : "");

          setLoadingAssignments(false);
        }
      } catch (error) {
        console.error("Init error:", error);
        Alert.alert("Error", "Failed to initialize dashboard. Check server connection or token.");
        setLoadingAssignments(false);
        setAssignments([]);
        setGroupChats([]);
        setAllGroupChats([]);
      }

      socket.on("message", (message) => {
        if (selectedGroupChat && message.groupChat === selectedGroupChat._id) {
          setGroupMessages((prev) => [...prev, message]);
        }
      });

      return () => socket.disconnect();
    };
    initialize();
  }, [selectedGroupChat]);

  const sendMessage = async () => {
    if (!messageInput.trim()) return;
    const userMessage = { sender: "user", text: messageInput, timestamp: new Date() };
    setChatMessages((prev) => [...prev, userMessage]);
    setMessageInput("");
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5001/api/chat",
        { message: messageInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const botMessage = { sender: "bot", text: response.data.message, timestamp: new Date() };
      setChatMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = { sender: "bot", text: "Sorry, something went wrong!", timestamp: new Date() };
      setChatMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleCreateGroupChat = async () => {
    if (!newGroupName || !assignmentTitle) {
      Alert.alert("Error", "Please provide both group name and assignment title");
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5001/api/group-chats",
        { name: newGroupName, assignmentTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroupChats((prev) => [...prev, response.data]);
      setAllGroupChats((prev) => [...prev, response.data]);
      setNewGroupName("");
      setAssignmentTitle(assignments.length > 0 ? assignments[0].title : "");
      Alert.alert("Success", "Group chat created!");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to create group chat");
    }
  };

  const handleJoinGroupChat = async (groupChatId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5001/api/group-chats/${groupChatId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroupChats((prev) => [...prev, response.data]);
      setAllGroupChats((prev) =>
        prev.map((gc) => (gc._id === groupChatId ? response.data : gc))
      );
      openGroupChat(response.data);
      Alert.alert("Success", "Joined group chat!");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to join group chat");
    }
  };

  const openGroupChat = async (groupChat) => {
    setSelectedGroupChat(groupChat);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5001/api/group-chats/${groupChat._id}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroupMessages(response.data);
      socket.emit("join", groupChat._id);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to fetch messages");
    }
  };

  const sendGroupMessage = async () => {
    if (!groupMessageInput.trim() || !selectedGroupChat) return;
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5001/api/group-chats/${selectedGroupChat._id}/messages`,
        { content: groupMessageInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroupMessages((prev) => [...prev, response.data]);
      setGroupMessageInput("");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to send message");
    }
  };

  const handleLeaveGroupChat = async () => {
    if (!selectedGroupChat) return;
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `http://localhost:5001/api/group-chats/${selectedGroupChat._id}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroupChats((prev) => prev.filter((gc) => gc._id !== selectedGroupChat._id));
      setAllGroupChats((prev) =>
        prev.map((gc) =>
          gc._id === selectedGroupChat._id
            ? { ...gc, members: gc.members.filter((m) => m !== userId) }
            : gc
        )
      );
      setSelectedGroupChat(null);
      setGroupMessages([]);
      Alert.alert("Success", "Left group chat!");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to leave group chat");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const updatedProfile = {
        name: editName,
        email: editEmail,
        course: editCourse,
        batch: editBatch,
        regNo: editRegNo,
      };
      const response = await axios.put(
        "http://localhost:5001/api/auth/profile",
        updatedProfile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(response.data);
      setEditProfileModal(false);
      Alert.alert("Success", "Profile updated!");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to update profile");
    }
  };

  const pickSubmissionFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      });
      if (result.type === "success") {
        console.log("Picked file:", result);
        setSubmissionFile(result);
        setSubmissionLink(""); // Clear link when file is selected
      } else {
        Alert.alert("Error", "No file selected or cancelled by user");
      }
    } catch (error) {
      console.error("File pick error:", error);
      Alert.alert("Error", "Failed to pick file");
    }
  };

  const handleSubmitAssignment = async () => {
    console.log("Submit button pressed");
    if (!assignmentTitle) {
      Alert.alert("Error", "Please select an assignment title");
      return;
    }
    if (!submissionFile && !submissionLink) {
      Alert.alert("Error", "Please provide a file or a link");
      return;
    }
    if (submissionFile && submissionLink) {
      Alert.alert("Error", "Please submit either a file or a link, not both");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const assignment = assignments.find((a) => a.title === assignmentTitle);
      if (!assignment) {
        Alert.alert("Error", "Selected assignment not found");
        return;
      }

      const formData = new FormData();
      if (submissionFile) {
        formData.append("submission", {
          uri: submissionFile.uri,
          name: submissionFile.name || `submission_${Date.now()}.${submissionFile.name?.split(".").pop() || "pdf"}`,
          type: submissionFile.mimeType || "application/pdf",
          size: submissionFile.size || 0,
        } as any);
        console.log("File submission data:", {
          uri: submissionFile.uri,
          name: submissionFile.name,
          type: submissionFile.mimeType,
          size: submissionFile.size,
        });
      } else if (submissionLink) {
        formData.append("link", submissionLink);
      }

      console.log("Submitting formData to:", `http://localhost:5001/api/assignments/${assignment._id}/submit`);
      const response = await axios.post(
        `http://localhost:5001/api/assignments/${assignment._id}/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Alert.alert("Success", response.data.message || "Assignment submitted successfully!");
      setAssignmentModal(false);
      setAssignmentTitle(assignments.length > 0 ? assignments[0].title : "");
      setSubmissionLink("");
      setSubmissionFile(null);
    } catch (error) {
      console.error("Submit assignment error:", error.response?.data || error);
      Alert.alert("Error", error.response?.data?.message || "Failed to submit assignment");
    }
  };

  const handleCreateNote = async () => {
    if (!assignmentTitle || !newNoteContent) {
      Alert.alert("Error", "Please enter an assignment title and note content");
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5001/api/notes",
        {
          assignmentTitle,
          content: newNoteContent,
          type: newNoteType,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes((prev) => [{ ...response.data, assignment: { title: assignmentTitle } }, ...prev]);
      setNewNoteContent("");
      setNewNoteType("note");
      setAssignmentTitle(assignments.length > 0 ? assignments[0].title : "");
      Alert.alert("Success", "Note created!");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to create note");
    }
  };

  const handleUpdateNote = async () => {
    if (!editNoteId || !editNoteContent) {
      Alert.alert("Error", "Please provide note content");
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5001/api/notes/${editNoteId}`,
        {
          content: editNoteContent,
          type: editNoteType,
          completed: editNoteCompleted,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes((prev) =>
        prev.map((note) =>
          note._id === editNoteId ? { ...response.data, assignment: note.assignment } : note
        )
      );
      setEditNoteId(null);
      setEditNoteContent("");
      setEditNoteType("note");
      setEditNoteCompleted(false);
      Alert.alert("Success", "Note updated!");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`http://localhost:5001/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      Alert.alert("Success", "Note deleted!");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to delete note");
    }
  };

  const filteredGroupChats = allGroupChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {menuOpen && (
        <View style={styles.sidebar}>
          <TouchableOpacity onPress={() => setMenuOpen(false)} style={styles.closeIcon}>
            <FontAwesome5 name="times" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.sidebarTitle}>Menu</Text>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setMenuOpen(false);
              setAssignmentModal(true);
            }}
          >
            <Text style={styles.menuText}>Assignments</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setMenuOpen(false);
              setEditProfileModal(true);
            }}
          >
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setMenuOpen(false);
              navigation.navigate("CalenderView");
            }}
          >
            <Text style={styles.menuText}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setMenuOpen(false);
              setGroupChatModal(true);
            }}
          >
            <Text style={styles.menuText}>Collaboration Hub</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setMenuOpen(false);
              setNotesModal(true);
            }}
          >
            <Text style={styles.menuText}>Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setMenuOpen(false);
              navigation.navigate("Setting");
            }}
          >
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={() => setMenuOpen(true)} style={styles.hamburgerIcon}>
        <FontAwesome5 name="bars" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setChatOpen(true)} style={styles.chatbotIcon}>
        <FontAwesome5 name="robot" size={30} color="#34a0a4" />
      </TouchableOpacity>

      <Modal visible={chatOpen} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.chatContainer}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>LMS Chatbot</Text>
              <TouchableOpacity onPress={() => setChatOpen(false)}>
                <FontAwesome5 name="times" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={chatMessages}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageBubble,
                    item.sender === "user" ? styles.userMessage : styles.botMessage,
                  ]}
                >
                  <Text style={styles.messageText}>{item.text}</Text>
                  <Text style={styles.messageTime}>{item.timestamp.toLocaleTimeString()}</Text>
                </View>
              )}
              style={styles.chatHistory}
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.chatInput}
                value={messageInput}
                onChangeText={setMessageInput}
                placeholder="Ask me anything..."
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                <FontAwesome5 name="paper-plane" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={groupChatModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.chatContainer}>
            {selectedGroupChat ? (
              <>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatTitle}>{selectedGroupChat.name}</Text>
                  <TouchableOpacity onPress={() => setSelectedGroupChat(null)}>
                    <FontAwesome5 name="arrow-left" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={groupMessages}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <View
                      style={[
                        styles.messageBubble,
                        item.sender._id === userId ? styles.userMessage : styles.groupMessage,
                      ]}
                    >
                      <Text style={styles.messageText}>{item.sender.name}: {item.content}</Text>
                      <Text style={styles.messageTime}>{new Date(item.sentAt).toLocaleTimeString()}</Text>
                    </View>
                  )}
                  style={styles.chatHistory}
                />
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.chatInput}
                    value={groupMessageInput}
                    onChangeText={setGroupMessageInput}
                    placeholder="Type a message..."
                    onSubmitEditing={sendGroupMessage}
                  />
                  <TouchableOpacity onPress={sendGroupMessage} style={styles.sendButton}>
                    <FontAwesome5 name="paper-plane" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveGroupChat}>
                  <Text style={styles.buttonText}>Leave Group</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatTitle}>Collaboration Hub</Text>
                  <TouchableOpacity onPress={() => setGroupChatModal(false)}>
                    <FontAwesome5 name="times" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Search group chats..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Group Name"
                  value={newGroupName}
                  onChangeText={setNewGroupName}
                />
                {loadingAssignments ? (
                  <Text style={styles.loadingText}>Loading assignments...</Text>
                ) : (
                  <Picker
                    selectedValue={assignmentTitle}
                    onValueChange={setAssignmentTitle}
                    style={styles.picker}
                    enabled={!loadingAssignments}
                  >
                    <Picker.Item label="Select an assignment" value="" />
                    {assignments.map((assignment) => (
                      <Picker.Item
                        key={assignment._id}
                        label={assignment.title || "Untitled"}
                        value={assignment.title}
                      />
                    ))}
                  </Picker>
                )}
                <TouchableOpacity style={styles.createButton} onPress={handleCreateGroupChat}>
                  <Text style={styles.buttonText}>Create Group</Text>
                </TouchableOpacity>
                <FlatList
                  data={filteredGroupChats}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <View style={styles.groupChatItem}>
                      <Text style={styles.groupChatName}>{item.name}</Text>
                      <TouchableOpacity
                        style={styles.joinButton}
                        onPress={() =>
                          item.members.includes(userId)
                            ? openGroupChat(item)
                            : handleJoinGroupChat(item._id)
                        }
                      >
                        <Text style={styles.buttonText}>
                          {item.members.includes(userId) ? "Open" : "Join"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={editProfileModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.chatContainer}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditProfileModal(false)}>
                <FontAwesome5 name="times" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editName}
              onChangeText={setEditName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={editEmail}
              onChangeText={setEditEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Course"
              value={editCourse}
              onChangeText={setEditCourse}
            />
            <TextInput
              style={styles.input}
              placeholder="Batch"
              value={editBatch}
              onChangeText={setEditBatch}
            />
            <TextInput
              style={styles.input}
              placeholder="Registration Number"
              value={editRegNo}
              onChangeText={setEditRegNo}
            />
            <TouchableOpacity style={styles.createButton} onPress={handleUpdateProfile}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={assignmentModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.chatContainer}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>Submit Assignment</Text>
              <TouchableOpacity onPress={() => setAssignmentModal(false)}>
                <FontAwesome5 name="times" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            {loadingAssignments ? (
              <Text style={styles.loadingText}>Loading assignments...</Text>
            ) : (
              <Picker
                selectedValue={assignmentTitle}
                onValueChange={setAssignmentTitle}
                style={styles.picker}
                enabled={!loadingAssignments}
              >
                <Picker.Item label="Select an assignment" value="" />
                {assignments.map((assignment) => (
                  <Picker.Item
                    key={assignment._id}
                    label={assignment.title || "Untitled"}
                    value={assignment.title}
                  />
                ))}
              </Picker>
            )}
            <TextInput
              style={styles.input}
              placeholder="Submission Link (e.g., https://drive.google.com/...)"
              value={submissionLink}
              onChangeText={(text) => {
                setSubmissionLink(text);
                setSubmissionFile(null); // Clear file when link is entered
              }}
            />
            <TouchableOpacity style={styles.uploadButton} onPress={pickSubmissionFile}>
              <Text style={styles.buttonText}>
                {submissionFile ? submissionFile.name : "Choose File (PDF, DOC, DOCX)"}
              </Text>
            </TouchableOpacity>
            {submissionFile && (
              <Text style={styles.fileInfo}>
                Selected: {submissionFile.name} ({(submissionFile.size / 1024).toFixed(2)} KB)
              </Text>
            )}
            <TouchableOpacity style={styles.createButton} onPress={handleSubmitAssignment}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={notesModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.chatContainer}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>Assignment Notes</Text>
              <TouchableOpacity onPress={() => setNotesModal(false)}>
                <FontAwesome5 name="times" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={assignmentTitle}
              onValueChange={setAssignmentTitle}
              style={styles.picker}
            >
              <Picker.Item label="Select an assignment" value="" />
              {assignments.map((assignment) => (
                <Picker.Item
                  key={assignment._id}
                  label={assignment.title || "Untitled"}
                  value={assignment.title}
                />
              ))}
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Note Content"
              value={newNoteContent}
              onChangeText={setNewNoteContent}
            />
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[styles.typeButton, newNoteType === "note" && styles.typeButtonSelected]}
                onPress={() => setNewNoteType("note")}
              >
                <Text style={styles.buttonText}>Note</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, newNoteType === "todo" && styles.typeButtonSelected]}
                onPress={() => setNewNoteType("todo")}
              >
                <Text style={styles.buttonText}>To-Do</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateNote}>
              <Text style={styles.buttonText}>Add Note</Text>
            </TouchableOpacity>
            <FlatList
              data={notes}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.noteItem}>
                  <Text style={styles.noteText}>
                    {item.assignment?.title || "Assignment Not Found"}: {item.content}
                  </Text>
                  <Text style={styles.noteType}>
                    {item.type === "todo" ? (item.completed ? "✔ Done" : "⬜ To-Do") : "Note"}
                  </Text>
                  <View style={styles.noteActions}>
                    <TouchableOpacity
                      onPress={() => {
                        setEditNoteId(item._id);
                        setEditNoteContent(item.content);
                        setEditNoteType(item.type);
                        setEditNoteCompleted(item.completed || false);
                      }}
                    >
                      <FontAwesome5 name="edit" size={20} color="#34a0a4" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteNote(item._id)}>
                      <FontAwesome5 name="trash" size={20} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              style={styles.notesList}
            />
            {editNoteId && (
              <View style={styles.editNoteContainer}>
                <TextInput
                  style={styles.input}
                  value={editNoteContent}
                  onChangeText={setEditNoteContent}
                  placeholder="Edit Note Content"
                />
                <View style={styles.typeContainer}>
                  <TouchableOpacity
                    style={[styles.typeButton, editNoteType === "note" && styles.typeButtonSelected]}
                    onPress={() => setEditNoteType("note")}
                  >
                    <Text style={styles.buttonText}>Note</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.typeButton, editNoteType === "todo" && styles.typeButtonSelected]}
                    onPress={() => setEditNoteType("todo")}
                  >
                    <Text style={styles.buttonText}>To-Do</Text>
                  </TouchableOpacity>
                </View>
                {editNoteType === "todo" && (
                  <TouchableOpacity
                    style={styles.completedButton}
                    onPress={() => setEditNoteCompleted(!editNoteCompleted)}
                  >
                    <Text style={styles.buttonText}>
                      {editNoteCompleted ? "Mark Incomplete" : "Mark Complete"}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.createButton} onPress={handleUpdateNote}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setEditNoteId(null)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.profileContainer}>
          <Text style={styles.greeting}>Hello, {profile?.name || "User"}</Text>
          <Text style={styles.subText}>Reg No: {profile?.regNo || "N/A"}</Text>
          <Text style={styles.subText}>Course: {profile?.course || "N/A"} - Batch: {profile?.batch || "N/A"}</Text>
        </View>

        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setAssignmentModal(true)}>
            <Text style={styles.buttonTextBlack}>Submit Assignment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setNotesModal(true)}>
            <Text style={styles.buttonTextBlack}>View Notes</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.chartTitle}>Monthly Completed Assignments</Text>
        <View style={styles.chartContainer}>
          <BarChart
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              datasets: [{ data: [5, 10, 15, 12, 8, 20, 18, 15, 10, 12, 9, 14], colors: [(opacity = 1) => `rgba(34, 128, 176, ${opacity})`] }],
            }}
            width={screenWidth * 0.9}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
              labelColor: () => "#000",
              barPercentage: 0.5,
            }}
            fromZero
            withInnerLines={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  contentContainer: { padding: 20, alignItems: "center" },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#222",
    paddingTop: 50,
    paddingLeft: 20,
    zIndex: 10,
  },
  closeIcon: { position: "absolute", top: 10, right: 10, padding: 10 },
  sidebarTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  menuButton: { paddingVertical: 15 },
  menuText: { color: "#fff", fontSize: 16 },
  hamburgerIcon: { position: "absolute", top: 20, left: 20, zIndex: 5, padding: 10 },
  chatbotIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 5,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  modalOverlay: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  chatContainer: { height: "70%", backgroundColor: "#fff", borderRadius: 20, padding: 10, marginHorizontal: 20 },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#34a0a4",
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  chatTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  chatHistory: { flex: 1, paddingVertical: 10 },
  messageBubble: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: "80%" },
  userMessage: { backgroundColor: "#34a0a4", alignSelf: "flex-end" },
  botMessage: { backgroundColor: "#e0e0e0", alignSelf: "flex-start" },
  groupMessage: { backgroundColor: "#d1e7dd", alignSelf: "flex-start" },
  messageText: { color: "#000", fontSize: 16 },
  messageTime: { fontSize: 12, color: "#555", marginTop: 5 },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 10, borderTopWidth: 1, borderColor: "#ccc" },
  chatInput: { flex: 1, backgroundColor: "#f0f0f0", padding: 10, borderRadius: 20, marginRight: 10 },
  sendButton: { backgroundColor: "#34a0a4", padding: 10, borderRadius: 20 },
  profileContainer: { alignItems: "center", marginBottom: 20 },
  greeting: { fontSize: 18, fontWeight: "bold" },
  subText: { fontSize: 14, color: "#555", marginTop: 4 },
  statsContainer: { width: "100%", alignItems: "center" },
  chartTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  chartContainer: { backgroundColor: "#fff", borderRadius: 10, elevation: 3, padding: 10 },
  actionButton: {
    width: "90%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#34a0a4",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  buttonTextBlack: { color: "#000", fontSize: 16, fontWeight: "bold" },
  createButton: {
    backgroundColor: "#34a0a4",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  uploadButton: {
    backgroundColor: "#34a0a4",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
  },
  joinButton: { backgroundColor: "#34a0a4", padding: 5, borderRadius: 5 },
  leaveButton: { backgroundColor: "#ff4444", padding: 10, borderRadius: 10, alignItems: "center", marginTop: 10 },
  groupChatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#34a0a4",
  },
  groupChatName: { fontSize: 16, fontWeight: "bold" },
  input: { backgroundColor: "#f0f0f0", padding: 10, borderRadius: 5, marginVertical: 5, fontSize: 16 },
  picker: { backgroundColor: "#f0f0f0", borderRadius: 5, marginVertical: 5, height: 50 },
  loadingText: { textAlign: "center", padding: 10, color: "#555" },
  typeContainer: { flexDirection: "row", justifyContent: "space-between", marginVertical: 5 },
  typeButton: { backgroundColor: "#ccc", padding: 10, borderRadius: 5, flex: 1, alignItems: "center", marginHorizontal: 5 },
  typeButtonSelected: { backgroundColor: "#34a0a4" },
  noteItem: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#34a0a4",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteText: { fontSize: 16, flex: 1 },
  noteType: { fontSize: 14, color: "#555", marginLeft: 10 },
  noteActions: { flexDirection: "row", width: 60, justifyContent: "space-between" },
  editNoteContainer: { padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5, marginTop: 10 },
  completedButton: {
    backgroundColor: "#34a0a4",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  cancelButton: {
    backgroundColor: "#ff4444",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
  },
  fileInfo: { fontSize: 14, color: "#555", marginVertical: 5, textAlign: "center" },
});

export default Dashboard;