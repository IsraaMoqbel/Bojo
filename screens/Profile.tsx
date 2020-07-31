import * as React from "react";
import { StyleSheet, TextInput, ScrollView, CheckBox } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

import { Text, View } from "../components/Themed";

export default function Profile() {
  let paymentOptions = [
    { label: "Cash", value: "item1" },
    { label: "Credit-dept Card", value: "item2" },
  ];
  return (
    <View>
      <Text style={styles.title}>Profile</Text>
      <ScrollView>
        <Text style={styles.subTitle}>Personal Info</Text>
        <View style={styles.container}>
          <TextInput placeholder={"name"} style={styles.input} />
          <TextInput placeholder={"age"} style={styles.input} />
          <TextInput placeholder={"ID number"} style={styles.input} />
        </View>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />

        <Text style={styles.subTitle}>Address Info</Text>
        <View style={styles.container}>
          <TextInput placeholder={"street name"} style={styles.input} />
          <TextInput
            placeholder={"building, floor no., apartment"}
            style={styles.input}
          />
          <TextInput placeholder={"city"} style={styles.input} />
          <TextInput placeholder={"location"} style={styles.input} />
        </View>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />

        <Text style={styles.subTitle}>Family Info</Text>
        <View style={styles.container}>
          <TextInput placeholder={"Number of children"} style={styles.input} />
          <TextInput placeholder={"Child's name"} style={styles.input} />
          <TextInput placeholder={"Child's age"} style={styles.input} />
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={false}
            onValueChange={() => null}
            style={styles.checkbox}
          />
          <Text style={styles.label}>Special needs kid?</Text>
        </View>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />

        <Text style={styles.subTitle}>Payment Info</Text>
        <View style={styles.container}>
          <DropDownPicker
            items={paymentOptions}
            defaultIndex={0}
            defaultValue="item1"
            containerStyle={{ height: 40, width: "90%", marginBottom: 70 }}
            dropDownStyle={{ backgroundColor: "lightgrey" }}
            onChangeItem={item => console.log(item.label, item.value)}
          />
        </View>

        <Text style={styles.subTitle}>Card Details</Text>

        <View style={styles.container}>
          <TextInput placeholder={"Card number"} style={styles.input} />
          <TextInput placeholder={"Date"} style={styles.input} />
          <TextInput placeholder={"Name on card"} style={styles.input} />
          <TextInput placeholder={"CVV"} style={styles.input} />
        </View>
        <View style={styles.bottom} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    margin: "auto",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 40,
    marginLeft: 10,
    paddingBottom: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
    marginLeft: "10%",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    borderColor: "grey",
    width: "90%",
    padding: 10,
    borderRadius: 5,
  },
  subTitle: {
    fontSize: 16,
    paddingBottom: 20,
    paddingLeft: 10,
    color: "grey",
    textAlign: "left",
    marginLeft: "2.5%",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "flex-start",
    marginLeft: "2.5%",
  },
  label: {
    margin: 8,
  },
  bottom: {
    marginBottom: 170,
  },
});
