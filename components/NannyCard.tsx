import * as React from "react";

import { Text } from "./Themed";
import { View, StyleSheet, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NannyCard(props) {
  const {
    email,
    ID,
    name,
    age,
    pricePerHour,
    address,
    endTime,
    startTime,
    certificates,
    location,
    rating,
    userId,
    experience,
    childrenNumber,
    street,
    building,
    cardNumber,
  } = props.data;
  const { writeInvitieData } = props;

  return (
    <View style={styles.card}>
      {!name && <Text style={styles.bold}>{email.split("@")[0]}</Text>}
      {name && <Text style={styles.bold}>{name}</Text>}
      <View style={styles.row}>
        {!!address && (
          <>
            <Ionicons
              size={30}
              style={{
                marginBottom: -3,
                marginRight: 5,
                color: "grey",
                fontSize: 14,
              }}
              name="ios-globe"
            />
            <Text style={styles.price}>{address}</Text>
          </>
        )}
      </View>
      {!!age && <Text>age: {age}</Text>}
      {!!certificates && <Text>certificates: {certificates.length}</Text>}
      {!!experience && <Text>{experience} years experience</Text>}

      {!!pricePerHour && <Text style={styles.price}>${pricePerHour}/hr</Text>}
      {!!rating && <Text>{rating}</Text>}
      {props.role === "parent" && (
        <View style={styles.button}>
          <Button
            title="invite"
            onPress={() =>
              writeInvitieData(
                userId,
                startTime,
                endTime,
                name,
                pricePerHour,
                childrenNumber,
                street,
                building,
                cardNumber
              )
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
    borderColor: "grey",
    borderRadius: 10,
    width: "90%",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    color: "grey",
    backgroundColor: "yellow",
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
});
