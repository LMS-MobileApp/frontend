import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { RootStackParamList } from "../Common/StackNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { loginUser } from "../utils/auth"; // Import from utils/auth.js

type RegistrationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Registration"
>;
type UserDashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UserDashboard"
>;
type AdminDashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AdminDashboard"
>;

export default function Login() {
  const navigation = useNavigation<RegistrationScreenNavigationProp>();
  const navigationUser = useNavigation<UserDashboardScreenNavigationProp>();
  const navigationAdmin = useNavigation<AdminDashboardScreenNavigationProp>();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    setLoading(true);
    const payload = { email: form.email, password: form.password };
    console.log("Logging in with payload:", payload);

    try {
      const { token, role } = await loginUser(payload); // Use the utility function
      console.log("Login Response:", { token, role });

      await AsyncStorage.setItem("token", token);

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: `Welcome back, ${role}!`,
        position: "top",
      });

      if (role === "admin") {
        navigationAdmin.navigate("AdminDashboard");
      } else if (role === "student") {
        navigationUser.navigate("UserDashboard");
      } else {
        Alert.alert("Error", "Unknown user role");
      }
    } catch (error) {
      const message = error.message || "Login failed";
      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/icon.png")} style={styles.image} />
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
        placeholder="Enter Password"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>
      <Text style={styles.signInText}>
        {"Don’t have an Account? "}
        <Text style={styles.signInLink} onPress={() => navigation.navigate("Registration")}>
          Sign Up
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
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: "contain",
  },
  input: {
    width: "90%",
    height: 45,
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 10,
    elevation: 2,
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
  signInLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});