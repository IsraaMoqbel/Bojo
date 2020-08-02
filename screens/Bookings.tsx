import * as React from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";

import InvitationCard from "../components/InvitationCard";
import { Text, View } from "../components/Themed";
import firebase from "firebase";
import AsyncStorage from "@react-native-community/async-storage";

export default function BookingsScreen() {
  const realTimeDB = firebase.database();
  const db = firebase.firestore();
  const [babysittersArray, setBabysittersArray] = React.useState([]);
  const [invitationsArray, setInvitationsArray] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(false);
  const [userId, setUserId] = React.useState("");
  const [role, setRole] = React.useState("");

  React.useEffect(() => {
    bootstrapAsync();
  }, [role]);
  const bootstrapAsync = async () => {
    setIsLoading(true);
    let userIdInStorage;
    let roleInStorage;
    try {
      userIdInStorage = await AsyncStorage.getItem("userId");
      roleInStorage = await AsyncStorage.getItem("role");
      setUserId(userIdInStorage);
      setRole(roleInStorage);
      console.log(1);

      if (role === "babysitter") {
        const invitations = invitationsArray;
        await firebase
          .database()
          .ref("/invitations/" + userId)
          .once("value")
          .then(async snapshot => {
            invitations.push(snapshot.val());
            await setInvitationsArray(invitations);
            setIsLoading(false);
          });
      } else {
        console.log(2);
        return firebase
          .database()
          .ref("/invitations")
          .once("value")
          .then(function (snapshot) {
            console.log(3);
            return snapshot.val();
            // ...
          })
          .then(result => {
            const invitations = invitationsArray;
            setInvitationsArray(() => {
              for (let e in result) {
                if (result[e].parentId === userId) {
                  invitations.push(result);

                  console.log(invitationsArray, "iiiiiiiii");
                }
              }
              return invitations;
            });
            setIsLoading(false);
          });
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const acceptInvitation = () => {
    firebase
      .database()
      .ref("invitations/" + userId)
      .update(
        {
          status: "confirmed",
        },
        function (error) {
          if (error) {
            console.log(error, "errorrrrrr");

            // The write failed...
          } else {
            Alert.alert("Invitation accepted successfully!");
            // Data saved successfully!
          }
        }
      );
    bootstrapAsync();
  };

  const markInvitationDone = () => {
    firebase
      .database()
      .ref("invitations/" + userId)
      .update(
        {
          status: "done",
        },
        function (error) {
          if (error) {
            console.log(error, "errorrrrrr");

            // The write failed...
          } else {
            Alert.alert("Invitation ended successfully!");
            // Data saved successfully!
          }
        }
      );
    bootstrapAsync();
  };
  console.log(invitationsArray, "iiiiiiiiiiiiiixxxxxxxxxxx");
  return (
    <View style={styles.outerContainer}>
      <Text style={styles.title}>Bookings</Text>
      <ScrollView>
        <Text style={styles.subTitle}>Invitations list for {role}</Text>

        <View style={styles.container}>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            invitationsArray &&
            invitationsArray.map((e, i) => {
              // console.log(e[Object.keys(e)],'ooooooooooooooooooo');
              return (
                <InvitationCard
                  role={role}
                  invitationData={e[Object.keys(e)]}
                  key={`${i}_${e.street}`}
                  acceptInvitation={acceptInvitation}
                  markInvitationDone={markInvitationDone}
                />
              );
            })
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
  outerContainer: {
    flex: 1,
  },
});
