import { SafeAreaView, View, TouchableOpacity, Text, TextInput, Image, StyleSheet, ScrollView, ImageBackground, FlatList } from 'react-native';
import MyButton from '../components/MyButton';
import React, { useEffect, useState } from 'react';
import food from '../assets/pizza.png';
import location from '../assets/location.png';
import {  doc,  getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import moment from 'moment';
import { Overlay } from 'react-native-elements';
import pizza from '../assets/pizza.png'
import { async } from '@firebase/util';
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

  const [date, setDate] = useState(moment());
  const [duration, setDuration] = useState(0);

  const [attending, setAttending] = useState([]);

  const [eventName, setEventName] = useState("");
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("");

  const [appData,setAppData] = useState([]);
  const [entData,setEntData] = useState([]);
  const [desData,setDesData] = useState([]);
  const [refeshing, setRefresh] = useState(false);


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
      let a = meal["appetizer"];
      let b = meal["entree"];
      let c = meal["dessert"];
      let ary = [];
      let cnt = 1;
      a.forEach((item) => {
          ary.push({id: cnt,name: item.name, image: item.image, ingredient: item.ingredient});
          cnt +=1;
      })
      setAppData(ary);

      let ary2 = [];
      let cnt2 = 1;
      b.forEach((item) => {
          ary2.push({id: cnt2,name: item.name, image: item.image, ingredient: item.ingredient});
          cnt2 +=1;
      })
      setEntData(ary2);

      let ary3 = [];
      let cnt3 = 1;
      c.forEach((item) => {
          ary3.push({id: cnt3,name: item.name, image: item.image, ingredient: item.ingredient});
          cnt3 +=1;
      })
      setDesData(ary3);
      
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

  const handleRefresh = async () =>{
    start();
    setRefresh(false);
  }
  const start = async () =>{
    await getEventInfo(eventID)
    await getMealInfo(ml)
    setRefresh(true);
  }
  useEffect(() => {
    start();
    console.log(appData)
  }, []);

  return (
    <View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ImageBackground source={food} style={[styles.columnContainer, { width: "100%", height: "50%", top: -200 }]}>
          <View style={{ top: 150, alignItems: "center", padding: 15 }}>
            <Text style={styles.whiteTextBold}>{eventName}</Text>
            <Text style={styles.whiteTextBold}> Hosted by {host}</Text>
            <View style={[styles.rowContainer, { top: -25 }]}>


              <Text style={styles.whiteTextReg}>{date.format('hh:mm A')} </Text>

              <Text> </Text>
              <Text style={styles.whiteTextReg}> {attending.length}/{capacity} </Text>
              <Text>            </Text>
              <Text style={styles.whiteTextReg}> $0 </Text>
            </View>
          </View>

          <View style={[styles.rowContainer, { top: -40 }]}>
            <Text style={styles.white_smallTextReg}> {date.format('M/DD/YYYY')} </Text>
            <Text>          </Text>
            <Text style={styles.white_smallTextReg}> Seats Taken </Text>
            <Text>          </Text>
            <Text style={styles.white_smallTextReg}> Fee </Text>
          </View>

        </ImageBackground>

        <View style={{ padding: 20, top: -200 }}>
          <View style={{ alignItems: "center", justifyContent: "space-evenly", padding: 20, flex: 1, flexDirection: "row", backgroundColor: "white" }}>
            <MyButton type="primary" size="medium" text="Reserve" onPressFn={() =>{reserve()}}/>

          </View>

          <View style={{ alignItems: "center", justifyContent: "space-evenly", padding: 20, flex: 1, flexDirection: "column", backgroundColor: "white" }}>

          <Text>Duration: {duration}</Text>


            <Text style={styles.blackTextBold}>Menu</Text>
            <Text style={styles.gray_whiteTextBold}>_________________________________</Text>
            {/* <Text style={styles.black_smallTextBold}>Appetizers:</Text>
            <Text style={styles.gray_whiteTextBold}>{appetizers.toString()}</Text>
            <Text style={styles.black_smallTextBold}>Entrees:</Text>
            <Text style={styles.gray_whiteTextBold}>{entree.toString()}</Text>
            <Text style={styles.black_smallTextBold}>Desserts:</Text>
            <Text style={styles.gray_whiteTextBold}>{dessert.toString()}</Text>*/}
            

            
          </View>
          <Text style={styles.black_smallTextBold}>Appetizers:</Text>
            <FlatList
                keyExtractor={(item)=> item.id}
                data={appData}
                refreshing = {refeshing}
                onRefresh = {handleRefresh}
                renderItem={({item}) =>(
                    <ScrollView style={{ width: '85%', padding: 20 }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: "100%", borderColor: 'black', borderWidth: 1, borderRadius: 20 }}>
                            <View style={{ flex: .5 }}>
                                <Image source={pizza} style={{ height: '100%', width: '100%', borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }} />
                            </View>
                            <View style={{ flexDirection: 'column', padding: 10 }}>
                                {/*dish info */}
                                <Text>Dish: {item.name}</Text>
                                <Text>{item.image}</Text>
                                <Text>Ingredients: {item.ingredient}</Text>
                            </View>
                        </View>
                    </ScrollView>
                )}
            />

            <Text style={styles.black_smallTextBold}>Entree:</Text>
            <FlatList
                keyExtractor={(item)=> item.id}
                data={entData}
                refreshing = {refeshing}
                onRefresh = {handleRefresh}
                renderItem={({item}) =>(
                    <ScrollView style={{ width: '85%', padding: 20 }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: "100%", borderColor: 'black', borderWidth: 1, borderRadius: 20 }}>
                            <View style={{ flex: .5 }}>
                                <Image source={pizza} style={{ height: '100%', width: '100%', borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }} />
                            </View>
                            <View style={{ flexDirection: 'column', padding: 10 }}>
                                {/*dish info */}
                                <Text>Dish: {item.name}</Text>
                                <Text>{item.image}</Text>
                                <Text>Ingredients: {item.ingredient}</Text>
                            </View>
                        </View>
                    </ScrollView>
                )}
            />

            <Text style={styles.black_smallTextBold}>Dessert:</Text>
            <FlatList
                keyExtractor={(item)=> item.id}
                data={desData}
                refreshing = {refeshing}
                onRefresh = {handleRefresh}
                renderItem={({item}) =>(
                    <ScrollView style={{ width: '85%', padding: 20 }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: "100%", borderColor: 'black', borderWidth: 1, borderRadius: 20 }}>
                            <View style={{ flex: .5 }}>
                                <Image source={pizza} style={{ height: '100%', width: '100%', borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }} />
                            </View>
                            <View style={{ flexDirection: 'column', padding: 10 }}>
                                {/*dish info */}
                                <Text>Dish: {item.name}</Text>
                                <Text>{item.image}</Text>
                                <Text>Ingredients: {item.ingredient}</Text>
                            </View>
                        </View>
                    </ScrollView>
                )}
            />

          <Text style={styles.black_smallTextBold}>Allergens:</Text>
            <Text style={styles.gray_whiteTextBold}>{allergens.toString()}</Text> 
          <View style={{ flexDirection: "row", flexWrap: "wrap", width: "100%", padding: 15, backgroundColor: "white", }}>
            <View style={{ flex: 0.5 }}>
              <Image source={location} style={{ height: "20%", width: "20%" }} />
            </View>

            <View style={{ flexDirection: "column", padding: 10 }}>
              {/*location info*/}
              <Text style={styles.black_smallTextBold}>location: </Text>
              <Text>{address}</Text>

              <Text style={styles.black_smallTextBold}>Additional Notes:</Text>
              <Text> {notes} </Text>

            </View>

          </View>
        </View>
        <Overlay isVisible={visible}>
          <Text>{status}</Text>
          <MyButton text="Ok" type="primary" size="large" onPressFn={ () => { setVisible(false)}} />
      </Overlay>
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