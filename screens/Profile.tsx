import * as React from "react";
import {
  StyleSheet,
  TextInput,
  ScrollView,
  CheckBox,
  Button,
  Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { Text, View } from "../components/Themed";
import firebase from "firebase";
import AsyncStorage from "@react-native-community/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Profile({ navigation }) {
  let paymentOptions = [
    { label: "Cash", value: "cash" },
    { label: "Credit-debit Card", value: "credit-debit" },
  ];
  const [paymentMethod, setPaymentMethod] = React.useState("credit-debit");
  const [isSpecialNeedsKid, setIsSpecialNeedsKid] = React.useState(false);
  const [name, setName] = React.useState("");
  const [age, setAge] = React.useState("");
  const [ID, setID] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [building, setBuilding] = React.useState("");
  const [city, setCity] = React.useState("");
  const [country, setCountry] = React.useState("");
  // TODO add ability to get current location or from map
  const [location, setLocation] = React.useState("");
  const [childrenNumber, setChildrenNumber] = React.useState("");
  const [childrenName, setChildrenName] = React.useState("");
  const [childrenAge, setChildrenAge] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardDate, setCardDate] = React.useState("");
  const [cardName, setCardName] = React.useState("");
  const [CVV, setCVV] = React.useState("");
  const [loading, setIsLoading] = React.useState(false);
  const [userId, setUserId] = React.useState("");
  const [role, setRole] = React.useState("");
  const [pricePerHour, setPricePerHour] = React.useState("");
  const [email, setEmail] = React.useState("");

  const db = firebase.firestore();
  React.useEffect(() => {
    setIsLoading(true);
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userIdInStorage;
      let roleInStorage;
      try {
        userIdInStorage = await AsyncStorage.getItem("userId");
        roleInStorage = await AsyncStorage.getItem("role");
        setUserId(userIdInStorage);
        setRole(roleInStorage);

        const docRef = await db.collection(`${roleInStorage}s`).doc(userId);

        docRef
          .get()
          .then(function (doc) {
            if (doc.exists) {
              console.log("Document data:", doc.data());
              const userData = doc.data();
              setName(userData.name ? userData.name : "");
              setEmail(userData.email ? userData.email : "");
              setAge(userData.age ? userData.age : "");
              setStreet(userData.street ? userData.street : "");
              setBuilding(userData.building ? userData.building : "");
              setCity(userData.city ? userData.city : "");
              setCountry(userData.country ? userData.country : "");
              setID(userData.ID ? userData.ID : "");
              // get related data to role
              if (roleInStorage === "parent") {
                setCVV(userData.CVV ? userData.CVV : "");
                setChildrenNumber(
                  userData.childrenNumber ? userData.childrenNumber : ""
                );
                setChildrenName(
                  userData.childrenName ? userData.childrenName : ""
                );
                setChildrenAge(
                  userData.childrenAge ? userData.childrenAge : ""
                );
                setIsSpecialNeedsKid(
                  userData.isSpecialNeedsKid
                    ? userData.isSpecialNeedsKid
                    : false
                );
                setCardDate(
                  userData.paymentData.cardDate
                    ? userData.paymentData.cardDate
                    : ""
                );
                setCardNumber(
                  userData.paymentData.cardNumber
                    ? userData.paymentData.cardNumber
                    : ""
                );
                setCVV(
                  userData.paymentData.CVV ? userData.paymentData.CVV : ""
                );

                setCardName(
                  userData.paymentData.cardName
                    ? userData.paymentData.cardName
                    : ""
                );
                setPaymentMethod(
                  userData.paymentMethod ? userData.paymentMethod : ""
                );
              } else if (roleInStorage === "babysitter") {
                setStartDate(userData.startDate ? userData.startDate : "");
                setEndDate(userData.endDate ? userData.endDate : "");
                setEndTime(userData.endTime ? userData.endTime : "");
                setStartTime(userData.startTime ? userData.startTime : "");
                setPricePerHour(
                  userData.pricePerHour ? userData.pricePerHour : ""
                );
              }
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          })
          .catch(function (error) {
            console.log("Error getting document:", error);
          });

        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        // Restoring token failed
      }
    };
    bootstrapAsync();
  }, [role]);

  const updateParentData = async () => {
    const docRef = db.collection(`${role}s`).doc(userId);

    await docRef.set({
      name,
      email,
      age,
      country,
      building,
      childrenName,
      childrenAge,
      street,
      city,
      ID,
      paymentData: { cardNumber, cardName, cardDate, CVV },
      userId,
      role,
      childrenNumber,
    });
    Alert.alert('data updated successfully!')
  };

  const updateBabysitterData = async () => {
    const docRef = db.collection(`${role}s`).doc(userId);

    await docRef.set({
      name,
      email,
      age,
      country,
      building,
      street,
      ID,
      city,
      userId,
      role,
      startDate,
      startTime,
      endDate,
      endTime,
      pricePerHour,
    })
    Alert.alert('data updated successfully!')
  };

  // control date pickers
  const [
    isStartDatePickerVisible,
    setStartDatePickerVisibility,
  ] = React.useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = React.useState(
    false
  );

  // control time pickers
  const [
    isStartTimePickerVisible,
    setStartTimePickerVisibility,
  ] = React.useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = React.useState(
    false
  );

  const [startTime, setStartTime] = React.useState(null);
  const [endTime, setEndTime] = React.useState(null);

  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

  const handleStartDate = date => {
    setStartDatePickerVisibility(false);
    setStartDate(date);
  };

  const handleStartTime = time => {
    setStartTimePickerVisibility(false);
    setStartTime(time);
  };

  const handleEndDate = date => {
    setEndDatePickerVisibility(false);
    setEndDate(date);
  };

  const handleEndTime = time => {
    setEndTimePickerVisibility(false);
    setEndTime(time);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("isLoggedIn");
    await AsyncStorage.removeItem("role");
    await AsyncStorage.removeItem("userId");
    navigation.navigate("ParentOrNanny");
  };
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Profile</Text>
      <ScrollView>
        <Text style={styles.subTitle}>Personal Info</Text>
        <View style={styles.container}>
          <TextInput
            placeholder={"name"}
            style={styles.input}
            value={name}
            onChangeText={t => setName(t)}
          />
          <TextInput
            placeholder={"age"}
            style={styles.input}
            value={age}
            onChangeText={t => setAge(t)}
            keyboardType="number-pad"
          />
          <TextInput
            placeholder={"ID number"}
            style={styles.input}
            value={ID}
            onChangeText={t => setID(t)}
            keyboardType="number-pad"
          />
        </View>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />

        <Text style={styles.subTitle}>Address Info</Text>
        <View style={styles.container}>
          <TextInput
            placeholder={"street name"}
            style={styles.input}
            value={street}
            onChangeText={t => setStreet(t)}
          />
          <TextInput
            placeholder={"building, floor no., apartment"}
            style={styles.input}
            value={building}
            onChangeText={t => setBuilding(t)}
          />
          <TextInput
            placeholder={"city"}
            style={styles.input}
            value={city}
            onChangeText={t => setCity(t)}
          />
          <TextInput
            placeholder={"country"}
            style={styles.input}
            value={country}
            onChangeText={t => setCountry(t)}
          />
        </View>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />

        {role === "parent" && (
          <>
            <Text style={styles.subTitle}>Family Info</Text>
            <View style={styles.container}>
              <TextInput
                placeholder={"Number of children"}
                style={styles.input}
                value={childrenNumber}
                onChangeText={t => setChildrenNumber(t)}
                keyboardType="number-pad"
              />
              <TextInput
                placeholder={"Child's name"}
                style={styles.input}
                value={childrenName}
                onChangeText={t => setChildrenName(t)}
              />
              <TextInput
                placeholder={"Child's age"}
                style={styles.input}
                value={childrenAge}
                onChangeText={t => setChildrenAge(t)}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={isSpecialNeedsKid}
                onValueChange={value => setIsSpecialNeedsKid(value)}
                style={styles.checkbox}
              />
              <Text style={styles.label}>Special needs kid?</Text>
            </View>
            <View
              style={styles.separator}
              lightColor="#eee"
              darkColor="rgba(255,255,255,0.1)"
            />
            {/* <Text style={styles.subTitle}>Payment Info</Text>
            <View style={styles.container}>
              <DropDownPicker
                items={paymentOptions}
                defaultIndex={0}
                defaultValue={paymentMethod}
                containerStyle={{ height: 40, width: "90%", marginBottom: 70 }}
                dropDownStyle={{ backgroundColor: "lightgrey" }}
                onChangeItem={item => setPaymentMethod(item.value)}
              />
            </View> */}
          </>
        )}
        {paymentMethod !== "cash" && role === "parent" && (
          <>
            <Text style={styles.subTitle}>Card Details</Text>

            <View style={styles.container}>
              <TextInput
                placeholder={"Card number"}
                style={styles.input}
                value={cardNumber}
                keyboardType="number-pad"
                onChangeText={t => setCardNumber(t)}
              />
              <TextInput
                placeholder={"Date"}
                style={styles.input}
                value={cardDate}
                onChangeText={t => setCardDate(t)}
              />
              <TextInput
                placeholder={"Name on card"}
                style={styles.input}
                value={cardName}
                onChangeText={t => setCardName(t)}
              />
              <TextInput
                placeholder={"CVV"}
                style={styles.input}
                value={CVV}
                keyboardType="number-pad"
                onChangeText={t => setCVV(t)}
              />
            </View>
          </>
        )}
        {role === "parent" && (
          <View style={styles.buttonWrapper}>
            <Button title="save" onPress={() => updateParentData()} />
          </View>
        )}

        {role === "babysitter" && (
          <View>
            <Text style={styles.subTitle}>Price per hour</Text>

            <TextInput
              placeholder={"price per hour"}
              style={styles.input}
              value={pricePerHour}
              keyboardType="number-pad"
              onChangeText={t => setPricePerHour(t)}
            />
            <Text style={styles.subTitle}>Availability Hours</Text>

            {/* start date */}
            <TouchableOpacity
              onPress={() => setStartDatePickerVisibility(true)}
              style={styles.input}
            >
              <Text style={styles.timeInputText}>
                availability date starts from{" "}
                {startDate &&
                  typeof startDate === "object" &&
                  // JSON.stringify(startDate).split('"')[1].split("T")[0]
                  new Date(startDate * 1000).toLocaleString("en-US", {
                    timeZoneName: "short",
                  })}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isStartDatePickerVisible}
              mode={"date"}
              onConfirm={handleStartDate}
              onCancel={() => setStartDatePickerVisibility(false)}
            />

            <TouchableOpacity
              onPress={() => setStartTimePickerVisibility(true)}
              style={styles.input}
            >
              <Text style={styles.timeInputText}>
                availability time starts from{" "}
                {
                  startTime &&
                    typeof startTime === "object" &&
                    new Date(startTime).toLocaleString("en-US", {
                      timeZoneName: "short",
                    })

                  // JSON.stringify(startTime)
                  //   .split('"')[1]
                  //   .split("T")[1]
                  //   .split(".")[0]
                }
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isStartTimePickerVisible}
              mode={"time"}
              onConfirm={handleStartTime}
              onCancel={() => setStartTimePickerVisibility(false)}
            />

            {/* end date  */}
            <TouchableOpacity
              onPress={() => setEndDatePickerVisibility(true)}
              style={styles.input}
            >
              <Text style={styles.timeInputText}>
                availability date ends at{" "}
                {endDate &&
                  typeof endDate === "object" &&
                  //  JSON.stringify(endDate).split('"')[1].split("T")[0]
                  new Date(endDate).toLocaleString()}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isEndDatePickerVisible}
              mode={"date"}
              onConfirm={handleEndDate}
              onCancel={() => setEndDatePickerVisibility(false)}
            />

            <TouchableOpacity
              onPress={() => setEndTimePickerVisibility(true)}
              style={styles.input}
            >
              <Text style={styles.timeInputText}>
                availability time ends at{" "}
                {
                  !!endTime &&
                    typeof endTime === "object" &&
                    new Date(endTime * 1000).toLocaleString()
                  // JSON.stringify(endTime)
                  //   .split('"')[1]
                  //   .split("T")[1]
                  //   .split(".")[0]
                }
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isEndTimePickerVisible}
              mode={"time"}
              onConfirm={handleEndTime}
              onCancel={() => setEndTimePickerVisibility(false)}
            />
            <View style={styles.buttonWrapper}>
              <Button title="save" onPress={() => updateBabysitterData()} />
            </View>
          </View>
        )}
        <View style={styles.buttonWrapper}>
          <Button title="Log out" onPress={() => signOut()} />
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
    width: "90%",
    marginLeft: "5%",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    borderColor: "grey",
    width: "90%",
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
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
  buttonWrapper: {
    width: "50%",
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
  timeInputText: {
    color: "grey",
  },
});
