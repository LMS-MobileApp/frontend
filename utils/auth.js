import axios from "axios";

// Base URL for your backend API
const BASE_URL = "http://localhost:5001"; // Adjust this based on your environment (e.g., IP, ngrok)

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    return response.data; // Returns { token, role }
  } catch (error) {
    console.error("Register API Error:", {
      message: error.message,
      config: error.config,
      response: error.response?.data,
    });
    throw error.response?.data || { message: "Network Error - Check server connection" };
  }
};

// Login an existing user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, credentials);
    return response.data; // Returns { token, role }
  } catch (error) {
    console.error("Login API Error:", {
      message: error.message,
      config: error.config,
      response: error.response?.data,
    });
    throw error.response?.data || { message: "Network Error - Check server connection" };
  }
};



