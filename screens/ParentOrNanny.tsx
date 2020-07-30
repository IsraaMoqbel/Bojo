import * as React from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ParentOrNanny({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("SignUp", {
            params: {
              role: "parent",
            },
          })
        }
      >
        <View>
          <Text style={styles.title}>Parent</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("SignUp", {
              role: "nanny",
          })
        }
      >
        <View>
          <Text style={styles.title}>Babysitter</Text>
        </View>
      </TouchableOpacity>
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
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
