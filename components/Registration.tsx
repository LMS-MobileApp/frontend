import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { RootStackParamList } from "../Common/StackNavigator";
import { Dropdown } from "react-native-element-dropdown";
import Toast from "react-native-toast-message";
import { registerUser } from "../utils/auth"; // Import from utils/auth.js

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Registration"
>;

export default function Registration() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [form, setForm] = useState({
    name: "",
    email: "",
    regNo: "",
    course: null,
    batch: null,
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const courseOptions = [
     { label: "BA IT degree", value: "BA IT degree" },
    { label: "Social statistics", value: "Social statistics" },
       { label: "Bussiness statistics", value: "Bussiness statistics" },
  ];

  const batchOptions = [
   { label: "2025", value: "2025" },
    { label: "2026", value: "2026" },
    { label: "2027", value: "2027" },
  ];

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.regNo || !form.course || !form.batch || !form.password) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    const payload = {
      name: form.name,
      email: form.email,
      regNo: form.regNo,
      course: form.course,
      batch: form.batch,
      password: form.password,
      role: "student",
    };
    console.log("Registering with payload:", payload);

    try {
      const { token, role } = await registerUser(payload); // Use the utility function
      console.log("Registration Response:", { token, role });

      Toast.show({
        type: "success",
        text1: "Registration Successful",
        text2: `Account created as ${role}. Please log in.`,
        position: "top",
      });

      navigation.navigate("Login");
    } catch (error) {
      const errorMessage = error.message || "Registration failed";
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Stay Organized, Stay Ahead</Text>
      <Text style={styles.subtitle}>
        {"Let's Empower Your Learning,\nMaster Your Deadlines"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Registration Number"
        value={form.regNo}
        onChangeText={(text) => setForm({ ...form, regNo: text })}
      />
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={courseOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Course"
        search
        searchPlaceholder="Search..."
        value={form.course}
        onChange={(item) => setForm({ ...form, course: item.value })}
      />
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={batchOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Batch"
        search
        searchPlaceholder="Search..."
        value={form.batch}
        onChange={(item) => setForm({ ...form, batch: item.value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={form.confirmPassword}
        onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Registering..." : "Register"}</Text>
      </TouchableOpacity>
      <Text style={styles.signInText}>
        {"Already have an Account? "}
        <Text style={styles.logInLink} onPress={() => navigation.navigate("Login")}>
          Log In
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    height: 45,
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingLeft: 18,
    marginBottom: 10,
    elevation: 2,
  },
  dropdown: {
    width: "90%",
    height: 45,
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  placeholderStyle: {
    color: "#999",
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#333",
  },
  button: {
    backgroundColor: "#6FC3B2",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#A9A9A9",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  signInText: {
    fontSize: 14,
    marginTop: 15,
    color: "#666",
  },
  logInLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});