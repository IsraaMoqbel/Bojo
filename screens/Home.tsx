import * as React from "react";
import {
  StyleSheet,
  Button,
  ScrollView,
  Modal,
  TouchableHighlight,
  Alert,
} from "react-native";

import NannyCard from "../components/NannyCard";
import { Text, View } from "../components/Themed";
import firebase from "firebase";
import AsyncStorage from "@react-native-community/async-storage";
// Get a reference to the database service

export default function TabOneScreen() {
  const realTimeDB = firebase.database();
  const db = firebase.firestore();
  const [babysittersArray, setBabysittersArray] = React.useState([]);
  const [invitationsArray, setInvitationsArray] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(true);
  const babysittersDocRef = db.collection("babysitters");
  const [userId, setUserId] = React.useState("");
  const [role, setRole] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);

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
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userIdInStorage;
      let roleInStorage;
      try {
        userIdInStorage = await AsyncStorage.getItem("userId");
        roleInStorage = await AsyncStorage.getItem("role");
        setUserId(userIdInStorage);
        setRole(roleInStorage);
        // get nanny's invitation
        // var userId = firebase.auth().currentUser.uid;
        console.log(userId, "uuuu");
        if (role === "babysitter") {
          return firebase
            .database()
            .ref("/invitations/" + userId)
            .once("value")
            .then(function (snapshot) {
              // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
              console.log(snapshot.val());

              // ...
            });
        }

        // const docRef = await db.collection(`${roleInStorage}s`).doc(userId);
      } catch (e) {
        setIsLoading(false);
        // Restoring token failed
      }
    };
    bootstrapAsync();
  }, [role]);

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
            cardNumber,
            paymentData,
          } = userData;
          console.log(childrenNumber, street, cardNumber);

          if (
            childrenNumber &&
            street &&
            paymentData.length !== 0 &&
            userId &&
            nannyId &&
            city &&
            building
          ) {
            firebase
              .database()
              .ref("invitations/" + nannyId)
              .set(
                {
                  parentId: userId,
                  nannyId: nannyId,
                  startTime,
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
      })
      .catch(err => {
        Alert.alert("oops error sending invitation!");
        console.log(err, "errrrrrrrr");
      });

    console.log("inside write data");
  };

  return (
    <View>
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
                />
              );
            })
          ) : (
            <Text>Oh, no! No babysitters yet!</Text>
          )}
        </View>
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* modal section  */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!</Text>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
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
