import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Page() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    if (!signIn) return;
    try {
      const { error } = await signIn.password({
        identifier: emailAddress,
        password,
      });

      if (error) {
        console.error(JSON.stringify(error, null, 2));
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) return;
            const url = decorateUrl("/(tabs)");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.replace(url as any);
            }
          },
        });
      } else if (
        signIn.status === "needs_second_factor" ||
        signIn.status === "needs_client_trust"
      ) {
        await signIn.mfa.sendEmailCode();
      }
    } catch (err) {
      console.error("Errore durante il login:", err);
    }
  };

  const handleVerify = async () => {
    if (!signIn) return;
    try {
      await signIn.mfa.verifyEmailCode({ code });

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) return;
            const url = decorateUrl("/(tabs)");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.replace(url as any);
            }
          },
        });
      }
    } catch (err) {
      console.error("Codice errato o scaduto:", err);
    }
  };

  if (
    signIn?.status === "needs_second_factor" ||
    signIn?.status === "needs_client_trust"
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <View style={styles.headerContainer}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText as any}>🔒</Text>
            </View>
            <Text style={styles.title as any}>Verifica Account</Text>
            <Text style={styles.subtitle as any}>
              Inserisci il codice inviato via email
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label as any}>Codice di sicurezza</Text>
              <TextInput
                style={styles.input as any}
                value={code}
                placeholder="Es. 123456"
                placeholderTextColor="#94a3b8"
                onChangeText={setCode}
                keyboardType="numeric"
                maxLength={6}
              />
              {errors?.fields?.code && (
                <Text style={styles.error as any}>
                  {errors.fields.code.message}
                </Text>
              )}
            </View>

            <Pressable
              style={({ pressed }) =>
                [
                  styles.button,
                  (!code || fetchStatus === "fetching") &&
                    styles.buttonDisabled,
                  pressed && styles.buttonPressed,
                ] as any
              }
              onPress={handleVerify}
              disabled={!code || fetchStatus === "fetching"}
            >
              <Text style={styles.buttonText as any}>Verifica</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) =>
                [styles.secondaryButton, pressed && styles.buttonPressed] as any
              }
              onPress={() => signIn.mfa.sendEmailCode()}
            >
              <Text style={styles.secondaryButtonText as any}>
                Invia un nuovo codice
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) =>
                [
                  styles.secondaryButton,
                  pressed && styles.buttonPressed,
                  { marginTop: 10, borderColor: "transparent" },
                ] as any
              }
              onPress={() => signIn.reset()}
            >
              <Text
                style={
                  [styles.secondaryButtonText, { color: "#64748b" }] as any
                }
              >
                Torna all&apos;accesso
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText as any}>🥒</Text>
            </View>
            <Text style={styles.title as any}>Bentornato</Text>
            <Text style={styles.subtitle as any}>Accedi per continuare.</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label as any}>Email</Text>
              <TextInput
                style={styles.input as any}
                autoCapitalize="none"
                value={emailAddress}
                placeholder="tu@email.com"
                placeholderTextColor="#94a3b8"
                onChangeText={setEmailAddress}
                keyboardType="email-address"
              />
              {errors?.fields?.identifier && (
                <Text style={styles.error as any}>
                  {errors.fields.identifier.message}
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label as any}>Password</Text>
              <TextInput
                style={styles.input as any}
                value={password}
                placeholder="Inserisci password"
                placeholderTextColor="#94a3b8"
                secureTextEntry={true}
                onChangeText={setPassword}
              />
              {errors?.fields?.password && (
                <Text style={styles.error as any}>
                  {errors.fields.password.message}
                </Text>
              )}
            </View>

            <Pressable
              style={({ pressed }) =>
                [
                  styles.button,
                  (!emailAddress || !password || fetchStatus === "fetching") &&
                    styles.buttonDisabled,
                  pressed && styles.buttonPressed,
                ] as any
              }
              onPress={handleSubmit}
              disabled={
                !emailAddress || !password || fetchStatus === "fetching"
              }
            >
              <Text style={styles.buttonText as any}>Accedi</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText as any}>
              Non hai ancora un account?
            </Text>
            <Link href="/sign-up" asChild>
              <TouchableOpacity style={{ paddingHorizontal: 5 }}>
                <Text style={styles.signUpText as any}>Registrati</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: "#f4f7ff" },
  inner: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerContainer: { marginBottom: 35, alignItems: "center" },
  logoBox: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#10b981",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  logoText: { color: "#fff", fontSize: 32, fontWeight: "700" },
  title: { fontSize: 30, fontWeight: "800", color: "#293d32", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#64748b" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#293d32",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "700", color: "#293d32", marginBottom: 8 },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    color: "#0f172a",
  },
  button: {
    backgroundColor: "#293d32",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#293d32",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: { color: "#ffffff", fontWeight: "700", fontSize: 16 },
  buttonDisabled: { opacity: 0.5 },
  buttonPressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 15,
  },
  secondaryButtonText: { color: "#334155", fontWeight: "700", fontSize: 16 },
  error: { color: "#ef4444", marginTop: 8, fontSize: 13, fontWeight: "500" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
    marginBottom: 20,
  },
  footerText: { fontSize: 15, color: "#64748b" },
  signUpText: { fontSize: 15, fontWeight: "700", color: "#293d32" },
});
