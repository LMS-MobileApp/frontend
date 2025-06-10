import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://localhost:5001"; // Adjust as needed (e.g., IP, ngrok)

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const createAssignment = async (formData) => {
  try {
    console.log("Sending POST /api/assignments with FormData:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    const response = await api.post("/api/assignments", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("createAssignment error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create assignment" };
  }
};

// Other functions remain unchanged for brevity
export const getAssignments = async (filters = {}) => {
  try {
    const response = await api.get("/api/assignments", { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch assignments" };
  }
};

export const updateAssignment = async (id, assignmentData) => {
  try {
    const response = await api.put(`/api/assignments/${id}`, assignmentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update assignment" };
  }
};

export const deleteAssignment = async (id) => {
  try {
    const response = await api.delete(`/api/assignments/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete assignment" };
  }
};

export const submitAssignment = async (id, submissionData) => {
  try {
    const response = await api.post(`/api/assignments/${id}/submit`, submissionData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to submit assignment" };
  }
};

export const getSubmittedAssignments = async (filters = {}) => {
  try {
    const response = await api.get("/api/assignments/submissions", { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch submissions" };
  }
};