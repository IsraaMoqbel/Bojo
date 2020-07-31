import * as React from "react";
import { StyleSheet, Button, ScrollView } from "react-native";

import NannyCard from "../components/NannyCard";
import { Text, View } from "../components/Themed";
import firebase from "firebase";

export default function TabOneScreen() {
  const db = firebase.firestore();
  const [babysittersArray, setBabysittersArray] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const babysittersDocRef = db.collection("babysitters");
  React.useEffect(() => {
    babysittersDocRef
      .get()
      .then(querySnapshot => {
        const babysittersClone = babysittersArray.slice();
        querySnapshot.forEach(doc => {
          console.log(doc.id, " => ", doc.data());
          babysittersClone.push(doc.data());
        });
        setBabysittersArray(babysittersClone);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  }, []);
  return (
    <View>
      <Text style={styles.title}>Home</Text>
      <ScrollView>
        <Text style={styles.subTitle}>Babysitters available now</Text>
        <View style={styles.container}>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : babysittersArray.length > 0 ? (
            babysittersArray.map(e => {
              return <NannyCard data={e} key={e.email} />;
            })
          ) : (
            <Text>Oh, no! No babysitters yet!</Text>
          )}
        </View>
      </ScrollView>
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
    marginTop: 40,
    paddingBottom: 20,
    paddingLeft: 10,
  },
  subTitle: {
    fontSize: 16,
    paddingBottom: 20,
    paddingLeft: 10,
    color: "grey",
    textAlign: "left",
    marginLeft: "2.5%",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
