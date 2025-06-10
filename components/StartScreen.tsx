import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { RootStackParamList } from "../Common/StackNavigator"; // Ensure this path is correct

type RegistrationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Registration"
>;

export default function StartScreen() {
  const navigation = useNavigation<RegistrationScreenNavigationProp>();

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        source={require("../assets/images/icon.png")} // Adjust path if needed
        style={styles.image}
        onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
      />

      {/* Title */}
      <Text style={styles.title}>Let's Track Assignments</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Track your assignments, meet deadlines, and boost productivity all in one place
      </Text>

      {/* Get Started Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Registration")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      {/* Login Link (optional, added for UX) */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Log In</Text>
        </Text>
      </TouchableOpacity>
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
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#6FC3B2",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});