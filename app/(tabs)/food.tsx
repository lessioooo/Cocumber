import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function FoodScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#f4f4f4",
  },
  dashboard: {
    backgroundColor: "#3498db",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    color: "Black",
    fontSize: 18,
    fontWeight: "bold",
  },
  calorieCount: {
    color: "white",
    fontSize: 36,
    fontWeight: "900",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
