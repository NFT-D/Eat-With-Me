import { SafeAreaView, View, TouchableOpacity, Text, TextInput, Image, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import MyButton from '../components/MyButton';
import React, { useEffect, useState } from 'react';
import pizza from '../assets/pizza.png';
import location from '../assets/location.png';
import {  doc,  getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import moment from 'moment';
import { Overlay } from 'react-native-elements';
import colors from '../config/colors';

type ScreenProps = {
  navigation: any,
  route: any
}




export default function ViewMealScreen({ navigation,route }: ScreenProps) {
  const {firstName, eventID, firestore, email } = route.params;
  const [address, setAddress] = useState("");
  const [host, setHost] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [allergens, setAllergens] = useState([]);
  const [notes, setNotes] = useState("");

  const [appetizers, setAppetizersDish] = useState([]);
  const [entree, setEntreesDish] = useState([]);
  const [dessert, setDessertsDish] = useState([]);

  const [date, setDate] = useState(moment());
  const [duration, setDuration] = useState(0);

  const [attending, setAttending] = useState([]);

  const [eventName, setEventName] = useState("");
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("");
  let time;
  var ml;
  const getEventInfo = async (id: string) => {
    try {
      const eventRef = doc(firestore, 'events', id);
      const querySnapshot = await getDoc(eventRef);

      const event = querySnapshot.data();
      setAttending(event["attendees"]);
      setHost(event["host"]);
      setAddress(event["location"]);
      setEventName(event["event"]);
      setCapacity(event["capacity"]);
      setNotes(event["note"]);
      ml = event["meal"];
      setDuration(event["duration"]);
      time = querySnapshot.data()["date"];
      time = moment.unix(time.seconds).utc().local();
      setDate(time);
    } catch (e) {
      console.log(e);
    }
  }

  const getMealInfo = async (mealRef: string) => {
    try {
      const q = doc(firestore, "meals", mealRef);
      const querySnapshot = await getDoc(q);
      const meal = querySnapshot.data();
      setAppetizersDish(meal["appetizer"]);
      setEntreesDish(meal["entree"]);
      setDessertsDish(meal["dessert"]);
      setAllergens(meal["allergens"]);

    }
    catch (e) {
      console.log(e);
    }
  }

  const reserve = async() =>{
    
    if (attending.length < capacity){
      setStatus("Reserved");
      const eventRef = doc(firestore, 'events', eventID);
      await updateDoc(eventRef,{pending: arrayUnion(email)});
    }
    else{
      setStatus("Reservation declined capacity is full");
    }
    
    setVisible(true);
  }


  useEffect(() => {
    async function fetchMyAPI() {
      await getEventInfo(eventID)
      await getMealInfo(ml)
    }
    fetchMyAPI()

  }, []);

  return (
    <SafeAreaView style={styles.contentContainer}>
        <ImageBackground source={pizza} style={{ width: "100%", }}>
          <View style={{ alignItems: "center", padding: 15 }}>
            <Text style={styles.whiteTextBold}>{eventName}</Text>
            <Text style={styles.hostedByText}> Hosted by {host}</Text>
            <View style={{flexDirection:'row',justifyContent:'space-evenly' }}>
              <Text style={styles.whiteTextReg}>{date.format('hh:mm A')} </Text>
              {/* <Text> </Text> */}
              <Text style={styles.whiteTextReg}> {attending.length}/{capacity} </Text>
              {/* <Text>            </Text> */}
              <Text style={styles.whiteTextReg}> $0 </Text>
            </View>
            <View style={{ flexDirection:'row', justifyContent:'space-evenly' }}>
              <Text style={styles.white_smallTextReg}> {date.format('M/DD/YYYY')} </Text>
              <Text>          </Text>
              <Text style={styles.white_smallTextReg}> Seats Taken </Text>
              <Text>          </Text>
              <Text style={styles.white_smallTextReg}> Fee </Text>
            </View>
          </View>
        </ImageBackground>
        <MyButton type="primary" size="medium" text="Reserve" onPressFn={() =>{reserve()}}/>
          <View style={styles.menu}>
            <Text style={styles.menuTitle}>Menu</Text>
            <Text style={styles.black_smallTextBold}>Appetizers:</Text>
            <Text style={styles.gray_whiteTextBold}>{appetizers.toString()}</Text>
            <Text style={styles.black_smallTextBold}>Entrees:</Text>
            <Text style={styles.gray_whiteTextBold}>{entree.toString()}</Text>
            <Text style={styles.black_smallTextBold}>Desserts:</Text>
            <Text style={styles.gray_whiteTextBold}>{dessert.toString()}</Text>
            <Text style={styles.black_smallTextBold}>Allergens:</Text>
            <Text style={styles.gray_whiteTextBold}>{allergens.toString()}</Text>
          </View>

          <View style={styles.locationBox}>
            <View style={{ flex: 0.5 }}>
              <Image source={location} style={{ height: "100%", width: "100%",borderBottomLeftRadius:15,borderTopLeftRadius:15 }} />
            </View>
            <View style={{ flexDirection: "column", padding: 10,flex:.5 }}>
              {/*location info*/}
              <Text style={styles.black_smallTextBold}>Location: </Text>
              <Text>{address}</Text>
              <Text style={styles.black_smallTextBold}>Additional Notes:</Text>
              <Text> {notes} </Text>
            </View>
          </View>
        <Overlay isVisible={visible} style={{borderRadius:10, padding:10}}>
          <Text style={{textAlign:'center'}}>{status}</Text>
          <MyButton text="Ok" type="primary" size="large" onPressFn={ () => { setVisible(false)}} />
      </Overlay> 
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  contentContainer: {
    alignItems:'center',
    backgroundColor:colors.secondary,
    padding:25
  },
  hostedByText:{
    color: 'white',
    fontSize: 25,
  },
  whiteTextBold: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold'
  },
  whiteTextReg: {
    color: 'white',
    fontSize: 20,
    
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
    
  },
  black_smallTextBold: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold'
  },
  menu:{
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "column", 
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: colors.primary,
    width:"80%",
    borderRadius:15
  },
  menuTitle:{
    color: 'black',
    fontSize: 27,
    fontWeight: 'bold',
    textDecorationLine:'underline'
  },
  locationBox:{
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: colors.primary,
    width:"80%",
    borderRadius:15
  }

  
});