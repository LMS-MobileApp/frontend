// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const BASE_URL = "http://localhost:5001"; // Adjust as needed (e.g., IP, ngrok)

// const api = axios.create({
//   baseURL: BASE_URL,
// });

// api.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export const createAssignment = async (formData) => {
//   try {
//     console.log("Sending POST /api/assignments with FormData:");
//     for (let [key, value] of formData.entries()) {
//       console.log(`${key}:`, value);
//     }
//     const response = await api.post("/api/assignments", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     console.log("Response:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("createAssignment error:", error.response?.data || error.message);
//     throw error.response?.data || { message: "Failed to create assignment" };
//   }
// };

// // Other functions remain unchanged for brevity
// export const getAssignments = async (filters = {}) => {
//   try {
//     const response = await api.get("/api/assignments", { params: filters });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Failed to fetch assignments" };
//   }
// };

// export const updateAssignment = async (id, assignmentData) => {
//   try {
//     const response = await api.put(`/api/assignments/${id}`, assignmentData);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Failed to update assignment" };
//   }
// };

// export const deleteAssignment = async (id) => {
//   try {
//     const response = await api.delete(`/api/assignments/${id}`);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Failed to delete assignment" };
//   }
// };

// export const submitAssignment = async (id, submissionData) => {
//   try {
//     const response = await api.post(`/api/assignments/${id}/submit`, submissionData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Failed to submit assignment" };
//   }
// };

// export const getSubmittedAssignments = async (filters = {}) => {
//   try {
//     const response = await api.get("/api/assignments/submissions", { params: filters });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Failed to fetch submissions" };
//   }
// };



// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const BASE_URL = "http://localhost:5001"; // Adjust as needed (e.g., IP, ngrok)

// const api = axios.create({
//   baseURL: BASE_URL,
// });

// api.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export const createAssignment = async (formData) => {
//   try {
//     console.log("Sending POST /api/assignments with FormData:");
//     const entries = [];
//     for (let [key, value] of formData.entries()) {
//       entries.push(`${key}: ${value instanceof File ? value.name : value}`);
//     }
//     console.log(entries.join('\n'));
//     const response = await api.post("/api/assignments", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     console.log("Response:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("createAssignment error:", error.response?.data || error.message);
//     throw error.response?.data || { message: "Failed to create assignment" };
//   }
// };

// // Other functions remain unchanged
// export const getAssignments = async (filters = {}) => {
//   try {
//     const response = await api.get("/api/assignments", { params: filters });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Failed to fetch assignments" };
//   }
// };

// export const updateAssignment = async (id, assignmentData) => {
//   try {
//     const response = await api.put(`/api/assignments/${id}`, assignmentData);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Failed to update assignment" };
//   }
// };

// export const deleteAssignment = async (id) => {
//   try {
//     console.log(`Sending DELETE /api/assignments/${id}`);
//     const response = await api.delete(`/api/assignments/${id}`);
//     console.log("Delete response:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Delete assignment error:", error.response?.data || error.message);
//     throw error.response?.data || { message: "Failed to delete assignment" };
//   }
// };


// export const submitAssignment = async (id, submissionData) => {
//   try {
//     const response = await api.post(`/api/assignments/${id}/submit`, submissionData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Failed to submit assignment" };
//   }
// };

// export const getSubmittedAssignments = async (filters = {}) => {
//   try {
//     const response = await api.get("/api/assignments/submissions", { params: filters });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Failed to fetch submissions" };
//   }
// };




import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://localhost:5001"; // Adjust as needed (e.g., IP, ngrok)

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Auth token added to request");
      } else {
        console.warn("No auth token found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error getting token from AsyncStorage:", error);
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    const { config, response, message } = error;
    console.error(`❌ ${config?.method?.toUpperCase()} ${config?.url} - Error:`, {
      status: response?.status,
      statusText: response?.statusText,
      data: response?.data,
      message
    });
    return Promise.reject(error);
  }
);

export const createAssignment = async (formData) => {
  try {
    console.log("Sending POST /api/assignments with FormData:");
    const entries = [];
    for (let [key, value] of formData.entries()) {
      entries.push(`${key}: ${value instanceof File ? value.name : value}`);
    }
    console.log(entries.join('\n'));
    
    const response = await api.post("/api/assignments", formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
      },
    });
    
    console.log("Create assignment response:", response.data);
    return response.data;
  } catch (error) {
    console.error("createAssignment error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create assignment" };
  }
};

export const getAssignments = async (filters = {}) => {
  try {
    console.log("Fetching assignments with filters:", filters);
    const response = await api.get("/api/assignments", { params: filters });
    console.log(`Fetched ${response.data.length} assignments`);
    return response.data;
  } catch (error) {
    console.error("getAssignments error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch assignments" };
  }
};

export const updateAssignment = async (id, assignmentData) => {
  try {
    console.log(`Updating assignment ${id} with data:`, assignmentData);
    const response = await api.put(`/api/assignments/${id}`, assignmentData);
    console.log("Update assignment response:", response.data);
    return response.data;
  } catch (error) {
    console.error("updateAssignment error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update assignment" };
  }
};

export const deleteAssignment = async (id) => {
  try {
    console.log(`🗑️  Attempting to delete assignment with ID: ${id}`);
    
    // Check if we have a token
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }
    
    console.log("Making DELETE request to:", `/api/assignments/${id}`);
    const response = await api.delete(`/api/assignments/${id}`);
    
    console.log("✅ Delete assignment successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Delete assignment failed:", error);
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`Server error ${status}:`, data);
      
      switch (status) {
        case 401:
          throw { message: "Authentication failed. Please log in again." };
        case 403:
          throw { message: "Access denied. Only admins can delete assignments." };
        case 404:
          throw { message: "Assignment not found. It may have already been deleted." };
        case 500:
          throw { message: "Server error. Please try again later." };
        default:
          throw data || { message: `Server error (${status})` };
      }
    } else if (error.request) {
      // Network error
      console.error("Network error:", error.request);
      throw { message: "Network error. Please check your internet connection and server status." };
    } else {
      // Other error
      console.error("Unexpected error:", error.message);
      throw { message: error.message || "Failed to delete assignment" };
    }
  }
};

export const submitAssignment = async (id, submissionData) => {
  try {
    console.log(`Submitting assignment ${id} with data:`, submissionData);
    const response = await api.post(`/api/assignments/${id}/submit`, submissionData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Submit assignment response:", response.data);
    return response.data;
  } catch (error) {
    console.error("submitAssignment error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to submit assignment" };
  }
};

export const getSubmittedAssignments = async (filters = {}) => {
  try {
    console.log("Fetching submitted assignments with filters:", filters);
    const response = await api.get("/api/assignments/submissions", { params: filters });
    console.log(`Fetched ${response.data.length} submissions`);
    return response.data;
  } catch (error) {
    console.error("getSubmittedAssignments error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch submissions" };
  }
};



//calalner related function
export const getUserAssignmentCalendar = async () => {
  try {
    console.log('Fetching user assignment calendar');
    const response = await api.get('/api/assignments/user-calendar');
    console.log(`Fetched ${response.data.length} calendar events`, response.data);
    return response.data;
  } catch (error) {
    console.error('getUserAssignmentCalendar error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error.response?.data || { message: 'Failed to fetch calendar events' };
  }
};

export const getAllAssignmentCalendar = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch('http://localhost:5001/api/assignments/all-calendar', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch');
    return data;
  } catch (error) {
    throw error;
  }
};




export const getUserSubmittedAssignments = async (filters = {}) => {
  try {
    console.log("Fetching user submitted assignments with filters:", filters);
    const response = await api.get("/api/submissions", { params: filters });
    console.log(`Fetched ${response.data.length} submissions`);
    return response.data;
  } catch (error) {
    console.error("getUserSubmittedAssignments error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch submissions" };
  }
};

// Keep other existing API calls (e.g., getUserAssignmentCalendar) if needed