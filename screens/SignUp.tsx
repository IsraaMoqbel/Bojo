import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import * as firebase from "firebase";
import AsyncStorage from "@react-native-community/async-storage";

import { RootStackParamList } from "../types";

export default function NotFoundScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "SignUp">) {
  const db = firebase.firestore();
  const role = route.params.params.role;
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleLogIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async result => {
        await AsyncStorage.setItem("isLoggedIn", "true");
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("role", role);
        // search for user to get their id
        db.collection(`${role}s`)
          .where("email", "==", email)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(async doc => {
              // doc.data() is never undefined for query doc snapshots
              await AsyncStorage.setItem("userId", doc.id);
            });
            navigation.navigate("Root", {
              screen: "Home",
              params: {
                role,
              },
            });
          })
          .catch(function (error) {
            setError(error.message);
          });
      })
      .catch(function (error) {
        setError(error.message);
      });
  };

  const handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async result => {
        await AsyncStorage.setItem("isLoggedIn", "true");
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("role", role);
        const collection = role + "s";
        console.log(collection);
        // save user to firestore
        db.collection(collection)
          .add({
            email,
          })
          .then(async docRef => {
            await AsyncStorage.setItem("userId", docRef.id);

            navigation.navigate("Onboarding", { params: { role } });
          })
          .catch(function (error) {
            setError(error.message);
          });
      })
      .catch(err => {
        if (err.code === "auth/email-already-in-use") {
          handleLogIn();
        } else {
          setError(err.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up / Log in</Text>
      <Text style={styles.error}>{error}</Text>
      <TextInput
        style={styles.input}
        placeholder="email"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="password"
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <Button title="Sign up" onPress={() => handleSignUp()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  inputView: {},
  input: {
    borderStyle: "solid",
    width: "90%",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "grey",
    margin: 10,
  },
  error: {
    color: "red",
  },
});
