import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import io from "socket.io-client";
import { useRoute } from "@react-navigation/native";
import { getGroupChatMessages, sendGroupChatMessage, leaveGroupChat } from "../../../utils/groupChatApi"; // Adjust the import path as necessary

export default function GroupChatScreen() {
  const route = useRoute();
  const { groupChatId } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const socket = io("http://localhost:5001"); 
  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getGroupChatMessages(groupChatId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Fetch Messages Error:", error);
      }
    };
    fetchMessages();

    // Join Socket.IO room
    socket.emit("joinRoom", groupChatId);

    // Listen for real-time messages
    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup
    return () => {
      socket.off("message");
      socket.disconnect();
    };
  }, [groupChatId]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    try {
      const newMessage = await sendGroupChatMessage(groupChatId, messageInput);
      setMessageInput("");
      // Socket.IO will handle real-time update
    } catch (error) {
      console.error("Send Message Error:", error);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroupChat(groupChatId);
      navigation.goBack();
    } catch (error) {
      console.error("Leave Group Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Group Chat</Text>
        <TouchableOpacity onPress={handleLeaveGroup}>
          <FontAwesome5 name="sign-out-alt" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender._id === "currentUser" ? styles.userMessage : styles.otherMessage, // Replace "currentUser" with actual user ID check
            ]}
          >
            <Text style={styles.messageSender}>{item.sender.name}</Text>
            <Text style={styles.messageText}>{item.content || item.text}</Text>
            <Text style={styles.messageTime}>
              {new Date(item.sentAt || item.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        )}
        style={styles.chatHistory}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.chatInput}
          value={messageInput}
          onChangeText={setMessageInput}
          placeholder="Type a message..."
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <FontAwesome5 name="paper-plane" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#34a0a4",
    padding: 15,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  chatHistory: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "#34a0a4",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
  },
  messageSender: {
    fontWeight: "bold",
    fontSize: 14,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  chatInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#34a0a4",
    padding: 10,
    borderRadius: 20,
  },
});