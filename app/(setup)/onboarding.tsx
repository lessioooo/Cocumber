import { useUser } from "@clerk/expo";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../../convex/_generated/api";

export default function OnboardScreen() {
  const { user } = useUser();
  const router = useRouter();
  const createUser = useMutation(api.users.createUser);

  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<"sedentary" | "moderate" | "active">(
    "sedentary",
  );

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await createUser({
        name: user.username || "New User",
        email: user.primaryEmailAddress?.emailAddress || "",
        picture: user.imageUrl,

        age: parseInt(age),
        weight: parseFloat(weight),
        activityLevel: activity,
      });
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Cocumber! 🥒</Text>
      <Text style={styles.subtitle}>
        Let&apos;s set up your profile CocumBro!
      </Text>

      {/* CAMPO ETÀ */}
      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      {/* CAMPO PESO */}
      <TextInput
        style={styles.input}
        placeholder="Enter your weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      {/* CAMPO LIVELLO DI ATTIVITÀ */}
      <Text style={{ marginTop: 20, marginBottom: 10 }}>Activity Level:</Text>
      <View style={styles.activityContainer}>
        <TouchableOpacity
          style={[
            styles.activityBtn,
            activity === "sedentary" && styles.activityBtnActive,
          ]}
          onPress={() => setActivity("sedentary")}
        >
          <Text>Sedentary</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.activityBtn,
            activity === "moderate" && styles.activityBtnActive,
          ]}
          onPress={() => setActivity("moderate")}
        >
          <Text>Moderate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.activityBtn,
            activity === "active" && styles.activityBtnActive,
          ]}
          onPress={() => setActivity("active")}
        >
          <Text>Active</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Create Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "gray", marginBottom: 30 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  activityContainer: { flexDirection: "row", gap: 10, marginBottom: 40 },
  activityBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  activityBtnActive: { backgroundColor: "#d1fae5", borderColor: "#10b981" },
  submitBtn: {
    backgroundColor: "#10b981",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitBtnText: { color: "white", fontWeight: "bold", fontSize: 18 },
});
