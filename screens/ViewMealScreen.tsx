import { SafeAreaView, View, TouchableOpacity, Text, TextInput, Image, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import MyButton from '../components/MyButton';
import colors from '../config/colors';
import React, { useEffect, useState } from 'react';
import food from '../assets/pizza.png';
import location from '../assets/location.png';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, addDoc, collection, query, where, getDocs, getDoc, Timestamp, DocumentReference } from 'firebase/firestore';
import Constants from "expo-constants";
import Moment from 'moment';


// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: Constants.manifest?.extra?.firebaseApiKey,
//   authDomain: Constants.manifest?.extra?.firebaseAuthDomain,
//   projectId: Constants.manifest?.extra?.firebaseProjectId,
//   storageBucket: Constants.manifest?.extra?.firebaseStorageBucket,
//   messagingSenderId: Constants.manifest?.extra?.firebaseMessagingSenderId,
//   appId: Constants.manifest?.extra?.firebaseAppId,
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const firestore = getFirestore(app);

// // AUTHENTICATION // ---------------------------------------------------------
// let user = auth.currentUser;
type ScreenProps = {
  navigation: any,
  route: any
}




export default function ViewMealScreen({ route,navigation }: ScreenProps) {
  const{firstName,eventID,user,firestore}=route.params;

  const [address, setAddress] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [allergens, setAllergens] = useState([]);
  const [notes, setNotes] = useState("");

  const [appetizers, setAppetizersDish] = useState([]);
  const [entree, setEntreesDish] = useState([]);
  const [dessert, setDessertsDish] = useState([]);

  const [date, setDate] = useState(new Date());

  const [duration, setDuration] = useState(0);

  const [eventName, setEventName] = useState("");

  const [hostFirstName, setHostFirstName] = useState("");
  const [hostLastName, setHostLastName] = useState("");

  let time, apz;
  var ml;
  const getEventInfo = async (id: string) => {
    try {
      const eventRef = doc(firestore, 'events', id);
      const querySnapshot = await getDoc(eventRef);
      
      const event = querySnapshot.data();
      setAddress(event["location"]);
      setEventName(event["event"]);
      setCapacity(event["capacity"]);
      setNotes(event["note"]);
      ml=event["meal"]["id"].toString();
      setDuration(event["duration"]);
      time = new Date(querySnapshot.data()["date"]["seconds"]*1000);
      setDate(time);

    } catch (e) {
      console.log(e);
    }
  }

  const getMealInfo = async (mealRef: string) => {
    try {
      const q = doc(firestore, "meals",mealRef);
      const querySnapshot = await getDoc(q);
      const meal = querySnapshot.data();
      setAppetizersDish(meal["appetizer"]);
      setEntreesDish(meal["entree"]);
      setDessertsDish(meal["dessert"]);
      setAllergens(meal["allergens"]);

      //console.log('appetizers:', appetizers.toString());
      // console.log('entrees:', entree.toString());
      // console.log('desserts:', dessert.toString());
      // console.log('allergens:', allergens.toString());
    }
    catch (e) {
      console.log(e);
    }
  }



  useEffect(() => {
    async function fetchMyAPI() {
      //await getFirstName()
      await getEventInfo(eventID)
      await getMealInfo(ml)}
      fetchMyAPI()
    
  }, []);

  return (
    <View>
      <ScrollView contentContainerStyle = {styles.contentContainer}>
          <ImageBackground source={food} style={[styles.columnContainer, { width: "100%", height: "50%", top: -200 }]}>
              <View style={{ top: 150, alignItems: "center", padding: 15 }}>
                    <Text style={styles.whiteTextBold}>{eventName}</Text>
                       <Text style={styles.whiteTextBold}> Hosted by {firstName}</Text> 
                    <View style={[styles.rowContainer, { top: -25 }]}>
                                          

                                          <Text style={styles.whiteTextReg}>{(Moment(date)).format('hh:hh a')} </Text>
                                          
                      <Text> </Text>
                      <Text style={styles.whiteTextReg}> 0/{capacity} </Text>
                      <Text>            </Text>
                      <Text style={styles.whiteTextReg}> $0 </Text>
                    </View>
              </View>

              <View style={[styles.rowContainer,{top:-40}]}>
                  <Text style={styles.white_smallTextReg}> {(Moment(date)).format('M/DD/YYYY')} </Text>
                  <Text>          </Text>
                  <Text style={styles.white_smallTextReg}> Seats Taken </Text>
                  <Text>          </Text>
                  <Text style={styles.white_smallTextReg}> Fee </Text>
              </View>
              
          </ImageBackground>

          <View style={{ padding: 20, top: -200 }}>
              <View style={{ alignItems: "center", justifyContent: "space-evenly", padding: 20, flex: 1, flexDirection: "row", backgroundColor: "white"}}>
                  <MyButton type="primary" size="medium" text="Reserve" />
                  <MyButton type="icon" text="♥" />
                  <MyButton type="icon" text="✉" />
              </View>

              <View style={{ alignItems: "center", justifyContent: "space-evenly", padding: 20, flex: 1, flexDirection: "column", backgroundColor: "white"}}>
                  
                <Text style={styles.blackTextBold}>About Meal:</Text>
                <Text style={styles.gray_whiteTextBold}> {notes} </Text>   
                <Text style={styles.gray_whiteTextBold}>_________________________________</Text>
                <Text style={styles.black_smallTextBold}>Appetizers:</Text>
                <Text style={styles.gray_whiteTextBold}>{appetizers.toString()}</Text>
                <Text style={styles.black_smallTextBold}>Entrees:</Text>
                <Text style={styles.gray_whiteTextBold}>{entree.toString()}</Text>
                <Text style={styles.black_smallTextBold}>Desserts:</Text>
                <Text style={styles.gray_whiteTextBold}>{dessert.toString()}</Text>
                <Text style={styles.black_smallTextBold}>Allergens:</Text>
                <Text style={styles.gray_whiteTextBold}>{allergens.toString()}</Text>
              </View>
                          
              <TouchableOpacity style={{ flexDirection: "row", flexWrap: "wrap", width: "100%", padding: 15, backgroundColor: "white",}} onPress={() => navigation.navigate("ViewMeal")}>
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
    color: 'grey',
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: "italic",
    padding: 20,

  },
  grayTextReg: {
    color: 'gray',
    fontSize: 18,
    fontStyle: "italic",
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
  },

  black_smallTextBold: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold'
  },

  contentContainer: {
    paddingVertical: 200,
  },
});