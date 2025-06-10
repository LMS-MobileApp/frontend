import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://localhost:5001/api/group-chats";

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const createGroupChat = async (assignmentId, name) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(BASE_URL, { assignmentId, name }, { headers });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create group chat" };
  }
};

export const joinGroupChat = async (groupChatId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(`${BASE_URL}/${groupChatId}/join`, {}, { headers });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to join group chat" };
  }
};

export const getGroupChatMessages = async (groupChatId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(`${BASE_URL}/${groupChatId}/messages`, { headers });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch messages" };
  }
};

export const sendGroupChatMessage = async (groupChatId, content) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(`${BASE_URL}/${groupChatId}/messages`, { content }, { headers });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to send message" };
  }
};

export const leaveGroupChat = async (groupChatId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(`${BASE_URL}/${groupChatId}/leave`, {}, { headers });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to leave group chat" };
  }
};

export const getAllGroupChats = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(BASE_URL, { headers });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch group chats" };
  }
};