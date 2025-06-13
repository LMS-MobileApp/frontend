// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const BASE_URL = "http://localhost:5001/api/group-chats";

// const getAuthHeader = async () => {
//   const token = await AsyncStorage.getItem("token");
//   return { Authorization: `Bearer ${token}` };
// };

// export const createGroupChat = async (assignmentId, name) => {
//   try {
//     const headers = await getAuthHeader();
//     const response = await axios.post(BASE_URL, { assignmentId, name }, { headers });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Failed to create group chat" };
//   }
// };

// export const joinGroupChat = async (groupChatId) => {
//   try {
//     const headers = await getAuthHeader();
//     const response = await axios.post(`${BASE_URL}/${groupChatId}/join`, {}, { headers });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Failed to join group chat" };
//   }
// };

// export const getGroupChatMessages = async (groupChatId) => {
//   try {
//     const headers = await getAuthHeader();
//     const response = await axios.get(`${BASE_URL}/${groupChatId}/messages`, { headers });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Failed to fetch messages" };
//   }
// };

// export const sendGroupChatMessage = async (groupChatId, content) => {
//   try {
//     const headers = await getAuthHeader();
//     const response = await axios.post(`${BASE_URL}/${groupChatId}/messages`, { content }, { headers });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Failed to send message" };
//   }
// };

// export const leaveGroupChat = async (groupChatId) => {
//   try {
//     const headers = await getAuthHeader();
//     const response = await axios.post(`${BASE_URL}/${groupChatId}/leave`, {}, { headers });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Failed to leave group chat" };
//   }
// };

// export const getAllGroupChats = async () => {
//   try {
//     const headers = await getAuthHeader();
//     const response = await axios.get(BASE_URL, { headers });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Failed to fetch group chats" };
//   }
// };



// Replace with your backend URL (e.g., ngrok)



import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://localhost:5001/api";

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");
  return { Authorization: `Bearer ${token}` };
};

export const createGroupChat = async (assignmentTitle, name) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(`${BASE_URL}/group-chats`, { assignmentTitle, name }, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create group chat");
  }
};

export const fetchGroupChats = async (assignmentTitle) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(`${BASE_URL}/group-chats?assignmentTitle=${assignmentTitle}`, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch group chats");
  }
};

export const fetchAssignments = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(`${BASE_URL}/assignments?minimal=true`, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch assignments");
  }
};

export const joinGroupChat = async (groupChatId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(`${BASE_URL}/group-chats/${groupChatId}/join`, {}, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to join group chat");
  }
};