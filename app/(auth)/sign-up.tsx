import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [userName, setUsername] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    const { error } = await signUp.create({
      username: userName,
      emailAddress,
      password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (!error) await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });
    if (signUp.status === "complete") {
      await signUp.finalize({
        // Redirect the user to the home page after signing up
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/(setup)/onboarding");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.replace(url as Href);
          }
        },
      });
    } else {
      // Check why the sign-up is not complete
      console.error("Sign-up attempt not complete:", signUp);
    }
  };

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <ThemedView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.form}>
              <ThemedText style={styles.eyebrow}>COCUMBER / ACCOUNT</ThemedText>
              <ThemedText type="title" style={styles.title}>
                Verify your email
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Enter the verification code we sent to your email address.
              </ThemedText>
              <ThemedText style={styles.label}>Verification code</ThemedText>
              <TextInput
                style={styles.input}
                value={code}
                placeholder="Enter your code"
                placeholderTextColor="#718096"
                onChangeText={setCode}
                keyboardType="number-pad"
                autoComplete="one-time-code"
                accessibilityLabel="Email verification code"
              />
              {errors.fields.code && (
                <ThemedText style={styles.error}>
                  {errors.fields.code.message}
                </ThemedText>
              )}
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  fetchStatus === "fetching" && styles.buttonDisabled,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleVerify}
                disabled={fetchStatus === "fetching" || !code.trim()}
              >
                {fetchStatus === "fetching" ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <ThemedText style={styles.buttonText}>
                    Verify email
                  </ThemedText>
                )}
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => signUp.verifications.sendEmailCode()}
                disabled={fetchStatus === "fetching"}
              >
                <ThemedText style={styles.secondaryButtonText}>
                  Resend code
                </ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <ThemedText style={styles.eyebrow}>COCUMBER / ACCOUNT</ThemedText>
            <ThemedText type="title" style={styles.title}>
              Create your account
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Start with a few details. You can build your profile next.
            </ThemedText>

            <ThemedText style={styles.label}>Username</ThemedText>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              autoComplete="username-new"
              value={userName}
              placeholder="Choose a username"
              placeholderTextColor="#718096"
              onChangeText={setUsername}
              accessibilityLabel="Username"
            />
            {errors.fields.username && (
              <ThemedText style={styles.error}>
                {errors.fields.username.message}
              </ThemedText>
            )}

            <ThemedText style={styles.label}>Email address</ThemedText>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              autoComplete="email"
              value={emailAddress}
              placeholder="you@example.com"
              placeholderTextColor="#718096"
              onChangeText={setEmailAddress}
              keyboardType="email-address"
              accessibilityLabel="Email address"
            />
            {errors.fields.emailAddress && (
              <ThemedText style={styles.error}>
                {errors.fields.emailAddress.message}
              </ThemedText>
            )}

            <ThemedText style={styles.label}>Password</ThemedText>
            <TextInput
              style={styles.input}
              value={password}
              placeholder="Create a password"
              placeholderTextColor="#718096"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
              onChangeText={setPassword}
              accessibilityLabel="Password"
            />
            {errors.fields.password && (
              <ThemedText style={styles.error}>
                {errors.fields.password.message}
              </ThemedText>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.button,
                fetchStatus === "fetching" && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSubmit}
              disabled={
                !userName.trim() ||
                !emailAddress.trim() ||
                !password ||
                fetchStatus === "fetching"
              }
            >
              {fetchStatus === "fetching" ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <ThemedText style={styles.buttonText}>
                  Create account
                </ThemedText>
              )}
            </Pressable>

            <View style={styles.linkContainer}>
              <ThemedText style={styles.footerText}>
                Already have an account?
              </ThemedText>
              <Link href="/sign-in" asChild>
                <Pressable accessibilityRole="link">
                  <ThemedText style={styles.linkText}>Sign in</ThemedText>
                </Pressable>
              </Link>
            </View>

            <View nativeID="clerk-captcha" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7ff",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  form: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 24,
  },
  eyebrow: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
  },
  title: {
    color: "#1e3a8a",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#64748b",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 22,
  },
  label: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    backgroundColor: "#f8fafc",
    color: "#1e293b",
    marginBottom: 16,
  },
  button: {
    minHeight: 50,
    backgroundColor: "#2563eb",
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  secondaryButtonText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 6,
    rowGap: 4,
    marginTop: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: "#64748b",
    fontSize: 14,
  },
  linkText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "700",
  },
  error: {
    color: "#b42318",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});
