import { useUser } from "@clerk/expo";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async () => {
    const parsedAge = Number(age);
    const parsedWeight = Number(weight);

    if (!Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      setSubmitError("Enter an age between 1 and 120.");
      return;
    }
    if (
      !Number.isFinite(parsedWeight) ||
      parsedWeight <= 0 ||
      parsedWeight > 500
    ) {
      setSubmitError("Enter a weight greater than 0 and no more than 500 kg.");
      return;
    }
    if (!user || isSubmitting) return;

    setSubmitError("");
    setIsSubmitting(true);
    try {
      await createUser({
        name:
          user.username ||
          user.fullName ||
          user.primaryEmailAddress?.emailAddress ||
          "New User",
        email: user.primaryEmailAddress?.emailAddress || "",
        picture: user.imageUrl,
        age: parsedAge,
        weight: parsedWeight,
        activityLevel: activity,
      });
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error creating user:", error);
      setSubmitError("We couldn't save your profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Tell us about yourself, CocumBro! 🥒</Text>
        <Text style={styles.subtitle}>
          Set your starting point so your recommendations fit your routine.
        </Text>

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="For example, 28"
          placeholderTextColor="#7c8580"
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
          accessibilityLabel="Age"
        />
        <Text style={styles.label}>Weight</Text>
        <View style={styles.weightInput}>
          <TextInput
            style={styles.weightField}
            placeholder="For example, 68.5"
            placeholderTextColor="#7c8580"
            keyboardType="decimal-pad"
            value={weight}
            onChangeText={setWeight}
            accessibilityLabel="Weight in kilograms"
          />
          <Text style={styles.unit}>kg</Text>
        </View>

        <Text style={styles.label}>Typical activity</Text>
        <View style={styles.activityContainer}>
          {(
            [
              ["sedentary", "Low"],
              ["moderate", "Moderate"],
              ["active", "High"],
            ] as const
          ).map(([level, label]) => (
            <Pressable
              key={level}
              accessibilityRole="radio"
              accessibilityState={{ selected: activity === level }}
              style={[
                styles.activityBtn,
                activity === level && styles.activityBtnActive,
              ]}
              onPress={() => setActivity(level)}
            >
              <Text
                style={[
                  styles.activityText,
                  activity === level && styles.activityTextActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        {!!submitError && <Text style={styles.error}>{submitError}</Text>}

        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            pressed && !isSubmitting && styles.submitBtnPressed,
            isSubmitting && styles.submitBtnDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitBtnText}>Create profile</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7f2",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    maxWidth: 560,
    width: "100%",
    alignSelf: "center",
  },
  eyebrow: {
    color: "#39765b",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 12,
  },
  title: {
    color: "#183c2b",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 10,
  },
  subtitle: {
    color: "#59695f",
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 28,
  },
  label: { color: "#293d32", fontSize: 14, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5cb",
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    color: "#183c2b",
  },
  weightInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5cb",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  weightField: { flex: 1, paddingVertical: 14, fontSize: 16, color: "#183c2b" },
  unit: { color: "#59695f", fontSize: 15, marginLeft: 8 },
  activityContainer: { flexDirection: "row", gap: 8, marginBottom: 24 },
  activityBtn: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#cbd5cb",
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  activityBtnActive: { backgroundColor: "#dcebe0", borderColor: "#39765b" },
  activityText: { color: "#59695f", fontSize: 14, fontWeight: "500" },
  activityTextActive: { color: "#183c2b", fontWeight: "700" },
  error: { color: "#b42318", fontSize: 14, marginBottom: 12 },
  submitBtn: {
    minHeight: 52,
    backgroundColor: "#286247",
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnPressed: { opacity: 0.8 },
  submitBtnDisabled: { opacity: 0.65 },
  submitBtnText: { color: "#ffffff", fontWeight: "700", fontSize: 16 },
});
