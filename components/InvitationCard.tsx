import * as React from "react";

import { Text } from "./Themed";
import { View, StyleSheet, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NannyCard(props) {
  const invitationData = props.invitationData;

  return (
    <View
      style={
        invitationData.status === "pending"
          ? styles.card
          : invitationData.status === "confirmed"
          ? styles.confirmedCard
          : styles.endedCard
      }
    >
      <View style={styles.row}>
        <Text style={invitationData.status !== "pending" && styles.text}>
          you've got an invitation to {invitationData.street}
          {"\n"}
          in {invitationData.building}
          {"\n"}
          at{" "}
          {/* {new Date(invitationData.startTime.seconds * 1000).toLocaleString()} */}
        </Text>
      </View>
      <View style={styles.button}>
        {props.role === "babysitter" && invitationData.status === "pending" ? (
          <Button
            title="Accept invitation"
            onPress={() => props.acceptInvitation()}
          />
        ) : (
          invitationData.status === "confirmed" &&
          props.role === "parent" && (
            <Button title="Done" onPress={() => props.markInvitationDone()} />
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: "center",
    borderColor: "grey",
    borderRadius: 10,
    width: "90%",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#e5e500",
    padding: 10,
  },
  confirmedCard: {
    flex: 1,
    justifyContent: "center",
    borderColor: "white",
    borderRadius: 10,
    width: "90%",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#659D32",
    padding: 10,
  },
  endedCard: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
    borderColor: "grey",
    borderRadius: 10,
    width: "90%",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "lightgrey",
    padding: 10,
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
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    marginTop: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  price: {
    color: "grey",
  },
  text: {
    color: "white",
  },
});
