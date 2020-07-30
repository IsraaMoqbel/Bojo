import * as React from "react";
import { StyleSheet, Button } from "react-native";

import { Text, View } from "../components/Themed";

export default function Onboarding({ navigation, route }) {
  const role = route.params.params.role;

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Welcome to Bojo</Text>
        {role === "parent" ? (
          <Text style={styles.text}>Your trust worthy babysitter app!</Text>
        ) : (
          <Text style={styles.text}>
            Bojo will help you find trust worthy parents to work with.
          </Text>
        )}
      </View>
      <Button
        onPress={() =>
          navigation.navigate("Root", {
            params: {
              role,
            },
          })
        }
        title="Next"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20, 
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  text: {
    textAlign: "center",
    marginBottom: 20,
  },
});
