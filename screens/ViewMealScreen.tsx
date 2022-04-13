import { SafeAreaView, View, TouchableOpacity, Text, TextInput, Image, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import MyButton from '../components/MyButton';
import colors from '../config/colors';
import MyField from '../components/MyField';
import React, { useEffect, useState } from 'react';
import food from '../assets/pizza.png';
import location from '../assets/location.png';
import { getEvent } from '../services/firebase';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, addDoc, collection, query, where, getDocs, getDoc, Timestamp, DocumentReference } from 'firebase/firestore';
import Constants from "expo-constants";
import Moment from 'moment';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Constants.manifest?.extra?.firebaseApiKey,
  authDomain: Constants.manifest?.extra?.firebaseAuthDomain,
  projectId: Constants.manifest?.extra?.firebaseProjectId,
  storageBucket: Constants.manifest?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.manifest?.extra?.firebaseMessagingSenderId,
  appId: Constants.manifest?.extra?.firebaseAppId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// AUTHENTICATION // ---------------------------------------------------------
let user = auth.currentUser;
type ScreenProps = {
  navigation: any,
  route: any
}




export default function ViewMealScreen({ navigation }: ScreenProps) {
  var dateFormat = require('dateformat');
  // const [eventName, enterEvent] = useState("");
  // const [event, setEvent] = useState("");
  const [address, setAddress] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [allergens, setAllergens] = useState([]);
  const [notes, setNotes] = useState("");

  const [mealID, setMealID] = useState(null);

  const [appetizers, setAppetizersDish] = useState([]);
  const [entree, setEntreesDish] = useState([]);
  const [dessert, setDessertsDish] = useState([]);

  const [absoluteDateTime, setAbsoluteDateTime] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  const [duration, setDuration] = useState(null);

  const [eventName, setEventName] = useState("");

  const [hostFirstName, setHostFirstName] = useState("");
  const [hostLastName, setHostLastName] = useState("");


  const getEventInfo = async (id: string) => {
    try {
      const eventRef = doc(firestore, 'events', id);
      const querySnapshot = await getDoc(eventRef);

      //console.log(`${querySnapshot.id} => ${querySnapshot.data()["location"]}`);
      const event = querySnapshot.data();
      setAddress(querySnapshot.data()["location"]);
      setEventName(querySnapshot.data()["event"]);
      setCapacity(event["capacity"]);
      setNotes(event["note"]);
      setMealID(event["meal"]);

      setAbsoluteDateTime(new Date(event["date"]));
      setDate(querySnapshot.data()["date"]);
      //setTime(dateFormat(absoluteDateTime, "h:MM TT"));
      setDuration(event["duration"]);

    } catch (e) {
      console.log(e);
    }
  }

  const getMealInfo = async (mealRef: DocumentReference) => {
    try {
      const querySnapshot = await getDoc(mealRef);
      const meal = querySnapshot.data();

      setAppetizersDish(meal["appetizer"]);
      setEntreesDish(meal["entree"]);
      setDessertsDish(meal["dessert"]);
      setAllergens(meal["allergens"]);

      // console.log('appetizers:', appetizers.toString());
      // console.log('entrees:', entree.toString());
      // console.log('desserts:', dessert.toString());
      // console.log('allergens:', allergens.toString());
    }
    catch (e) {
      console.log(e);
    }
  }

  const getFirstName = async () => {
    try {
      let firstName = "Temp";
      const q = query(
        collection(firestore, "users"),
        where("email", "==", user?.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log('first name from getFirstName', doc.data()['first_name'])
        firstName = doc.data()["first_name"];
      });
      setHostFirstName(firstName);
    } catch (e) {
      console.log(e);
    }
  };





  useEffect(() => {
    getEventInfo("feq8LkV6DZ2NyPDJDoEw");
    // console.log(user?.email);
    // getFirstName();
    // console.log("host first name", hostFirstName);
    // console.log("mealID", mealID);
    getMealInfo(mealID);
  }, []);

  return (
    <SafeAreaView style={{ alignContent: 'center', alignItems: 'center', backgroundColor: colors.secondary }}>
          <View>
                <ScrollView>
                      <ImageBackground source={food} style={[styles.columnContainer, { width: "100%", height: "80%", top: -20 }]}>
                            <View style={{ top: 150, alignItems: "center", padding: 15 }}>
                                  <Text style={styles.eventTitle}>{eventName}</Text>
                                  {/* <Text style={styles.gray_whiteTextBold}>
                                    Hosted by {hostFirstName}fdsfsd{" "}
                                  </Text> 
                                  
                                  */}
                                  <View style={[styles.rowContainer, { top: -25 }]}>
                                        {/* <Text style={styles.whiteTextReg}>{(moment(absoluteDateTime)).format("HH:MM:SS XM")}</Text> */}

                                        <Text style={styles.whiteTextReg}>{Moment(absoluteDateTime).format("yyyy-MM-dd – kk:mm")} </Text>
                                        {/* <Text>{dateFormat(absoluteDateTime, "h:MM:ss TT")} </Text> */}
                                        <Text style={styles.whiteTextReg}> 0/{capacity} </Text>
                                        <Text> </Text>
                                        <Text style={styles.whiteTextReg}> $0 </Text>
                                  </View>
                            </View>
                            <View style={styles.rowContainer}>
                                <Text style={styles.white_smallTextReg}> Wed 2/16 </Text>
                                <Text> </Text>
                                <Text style={styles.white_smallTextReg}> Seats Taken </Text>
                                <Text> </Text>
                                <Text style={styles.white_smallTextReg}> Fee </Text>
                            </View>
                      </ImageBackground>

                      <View style={{ padding: 20 }}>
                          <View style={{ alignItems: "center", justifyContent: "space-evenly", padding: 20, flex: 1, flexDirection: "row", backgroundColor: "white"}}>
                            <MyButton type="primary" size="large" text="Reserve" />
                            <MyButton type="icon" text="♥" />
                            <MyButton type="icon" text="✉" />
                          </View>
                        <View style={{ alignItems: "center", justifyContent: "space-evenly", padding: 20, flex: 1, flexDirection: "column", backgroundColor: "white"}}>
                            <Text style={styles.blackTextBold}>About Meal:</Text>
                            <Text> {notes} </Text>

                            <Text style={styles.blackTextBold}>Appetizers:</Text>
                            <Text>{appetizers.toString()}</Text>
                            <Text style={styles.blackTextBold}>Entrees:</Text>
                            <Text>{entree.toString()}</Text>
                            <Text style={styles.blackTextBold}>Desserts:</Text>
                            <Text>{dessert.toString()}</Text>
                            <Text style={styles.blackTextBold}>Allergens:</Text>
                            <Text>{allergens.toString()}</Text>
                        </View>
                        <TouchableOpacity
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            width: "100%",
                            padding: 15,
                            backgroundColor: "white",
                          }}
                          onPress={() => navigation.navigate("ViewMeal")}
                        >
                          <View style={{ flex: 0.5 }}>
                            <Image source={location} style={{ height: "20%", width: "20%" }} />
                          </View>
                          <View style={{ flexDirection: "column", padding: 10 }}>
                            {/*location info*/}
                            <Text>{address}</Text>
                            <Text style={{ color: colors.primary }}>Get Directions</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                </ScrollView>
          </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  rowContainer: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 10,
    flex: 1,
    flexDirection: 'row'

  },
  columnContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 20,
    flexDirection: 'column',

  },
  whiteTextBold: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold'
  },
  whiteTextReg: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold'
  },
  gray_whiteTextBold: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: "italic"

  },
  grayTextReg: {
    color: 'gray',
    fontSize: 18,
    fontStyle: "italic"
  },
  blackTextBold: {
    color: 'black',
    fontSize: 27,
    fontWeight: 'bold'
  },
  white_smallTextReg: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold'
  },

  eventTitle: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold'
  }

});