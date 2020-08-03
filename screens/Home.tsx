import * as React from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";

import NannyCard from "../components/NannyCard";
import { Text, View } from "../components/Themed";
import firebase from "firebase";
import AsyncStorage from "@react-native-community/async-storage";
import uniqid from 'react-id-generator';

export default function TabOneScreen() {
  const realTimeDB = firebase.database();
  const db = firebase.firestore();
  const [babysittersArray, setBabysittersArray] = React.useState([]);
  const [invitationsArray, setInvitationsArray] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(true);
  const babysittersDocRef = db.collection("babysitters");
  const [userId, setUserId] = React.useState("");
  const [role, setRole] = React.useState("");

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

  React.useEffect(() => {
    bootstrapAsync();
  }, [role]);
  // Fetch the token from storage then navigate to our appropriate place
  const bootstrapAsync = async () => {
    let userIdInStorage;
    let roleInStorage;
    try {
      userIdInStorage = await AsyncStorage.getItem("userId");
      roleInStorage = await AsyncStorage.getItem("role");
      setUserId(userIdInStorage);
      setRole(roleInStorage);
    } catch (e) {
      Alert.alert("oops!");
    }
  };

  const writeInvitieData = async (
    nannyId,
    startTime,
    endTime,
    name,
    pricePerHour
  ) => {
    const docRef = await db.collection(`${role}s`).doc(userId);
    docRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          const userData = doc.data();
          const {
            childrenNumber,
            street,
            building,
            city,
            paymentData,
          } = userData;
          console.log(childrenNumber, street);

          if (
            childrenNumber &&
            street &&
            paymentData.length !== 0 &&
            userId &&
            nannyId &&
            city &&
            building
          ) {
            const uniqueId =  uniqid()
            firebase
              .database()
              .ref("invitations/" + uniqueId)
              .set(
                {
                  parentId: userId,
                  nannyId: nannyId,
                  startTime,
                  uniqueId,
                  endTime,
                  name,
                  pricePerHour,
                  street,
                  building,
                  city,
                  status: "pending",
                },
                function (error) {
                  if (error) {
                    // The write failed...
                    console.log("error saving to db");
                  } else {
                    // Data saved successfully!
                    Alert.alert("Invitation sent successfully!");
                  }
                }
              );
          } else {
            Alert.alert("", "please fill your information first!");
          }
        }
      }).then(()=> Alert.alert("Invitation sent successfully!"))
      .catch(err => {
        Alert.alert("oops error sending invitation!");
        console.log(err, "errrrrrrrr");
      });

    console.log("inside write data");
  };

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.title}>Home</Text>
      <ScrollView>
        <Text style={styles.subTitle}>Babysitters available now</Text>
        <View style={styles.container}>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : babysittersArray.length > 0 ? (
            babysittersArray.map((e, i) => {
              return (
                <NannyCard
                  data={e}
                  key={`${e.email}_${i}`}
                  writeInvitieData={writeInvitieData}
                  role={role}
                />
              );
            })
          ) : (
            <Text>Oh, no! No babysitters yet!</Text>
          )}
        </View>
        <View style={styles.bottomSpace} />
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
  outerContainer: {
    flex: 1,
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
  bottomSpace: {
    marginBottom: 120,
  },
  //modal styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
