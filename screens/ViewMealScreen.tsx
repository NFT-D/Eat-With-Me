import { SafeAreaView, View, Text, Image, StyleSheet, ImageBackground, FlatList, ScrollView } from 'react-native';
import MyButton from '../components/MyButton';
import React, { useEffect, useState } from 'react';
// import pizza from '../assets/pizza.png';
import location from '../assets/location.png';
import {  doc,  getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import moment from 'moment';
import { Overlay } from 'react-native-elements';
import colors from '../config/colors';


type ScreenProps = {
  navigation: any,
  route: any
}

let imgs = [
  'https://firebasestorage.googleapis.com/v0/b/eat-with-me-53105.appspot.com/o/dishes%2Ffrenchtoast.jpeg?alt=media&token=60179fe2-dd58-44b4-8c93-404cb31e5a94'
]


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
  const [imageURL, setImageURL] = useState("");
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
      setImageURL(event["image"]);
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
    // setRefresh(false);
  }
  const start = async () =>{
    await getEventInfo(eventID)
    await getMealInfo(ml)
    // setRefresh(true);
  }
  useEffect(() => {
    start();
    console.log(appData)
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      
        <ImageBackground source={{ uri: imageURL}} style={[styles.contentContainer, { width: "100%", height: "50%", top:-35}]}>
          
          <View style={{ top: 150, alignItems: "center", padding: 15 }}>
            
            <Text style={[styles.whiteTextBold, {top:-50}]}>{eventName}</Text>
            <Text style={[styles.hostedByText, {top:-50}]}> Hosted by {host}</Text>
            
            <View style={{flexDirection:'row',justifyContent:'space-evenly' }}>
              <Text style={styles.whiteTextReg}>{date.format('hh:mm A')} </Text>
              <Text>               </Text>
              <Text style={styles.whiteTextReg}> {attending.length}/{capacity} </Text>
              <Text>                 </Text>
              <Text style={styles.whiteTextReg}> $0 </Text>
            </View>
            <View style={{ flexDirection:'row', justifyContent:'space-evenly' }}>
              <Text style={styles.white_smallTextReg}> {date.format('M/DD/YYYY')} </Text>
              <Text>          </Text>
              <Text style={styles.white_smallTextReg}> Seats Taken </Text>
              <Text>          </Text>
              <Text style={styles.white_smallTextReg}>  Fee </Text>
            </View>
            <Text>          </Text>
            
            <MyButton type="primary" size="large" text="Reserve" onPressFn={() =>{reserve()}}/> 
          </View>
          
        </ImageBackground>
 
        <ScrollView style={{width:'100%', padding:10}}>
          <Text style={styles.black_smallTextBold}>Appetizers:</Text>
            <FlatList
                keyExtractor={(item)=> item.id}
                data={appData}
                refreshing = {refeshing}
                onRefresh = {handleRefresh}
                renderItem={({item}) =>(
                    <View style={{ width: '85%', padding: 20 }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: "110%", borderColor: colors.primary, borderWidth: 2, borderRadius: 20 }}>
                            {/* <View style={{ flex: .5 }}>
                                <Image source={item.imageURL} style={{ height: '100%', width: '100%', borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }} />
                            </View> */}
                            <View style={{ flexDirection: 'column', padding: 10 }}>
                                {/*dish info */}
                                <View style={{flexDirection:'row'}}>
                                    <Text>Dish:</Text>
                                    <Text style={{fontStyle:'italic'}}> {item.name}</Text>
                                </View>
                                <View>
                                    {/* <Text style={{fontStyle:'italic'}}>Dish: {item.name}</Text> */}
                                    <Text>{item.image}</Text>
                                    <View style={{flexDirection:'row'}}>
                                        <Text>Ingredients: </Text>
                                        <Text style={{fontStyle:'italic'}}>{item.ingredient}</Text>
                                      </View>
                                  </View>

                            </View>
                          </View>
                      </View>
                )}
            />

            <Text style={styles.black_smallTextBold}>Entree:</Text>
            <FlatList
                keyExtractor={(item)=> item.id}
                data={entData}
                refreshing = {refeshing}
                onRefresh = {handleRefresh}
                renderItem={({item}) =>(
                  <View style={{ width: '85%', padding: 20 }}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: "110%", borderColor: colors.primary, borderWidth: 2, borderRadius: 20 }}>
                      {/* <View style={{ flex: .5 }}>
                          <Image source={item.imageURL} style={{ height: '100%', width: '100%', borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }} />
                      </View> */}
                      <View style={{ flexDirection: 'column', padding: 10 }}>
                          {/*dish info */}
                          <View style={{flexDirection:'row'}}>
                              <Text>Dish:</Text>
                              <Text style={{fontStyle:'italic'}}> {item.name}</Text>
                          </View>
                          <View>
                              {/* <Text style={{fontStyle:'italic'}}>Dish: {item.name}</Text> */}
                              <Text>{item.image}</Text>
                              <View style={{flexDirection:'row'}}>
                                  <Text>Ingredients: </Text>
                                  <Text style={{fontStyle:'italic'}}>{item.ingredient}</Text>
                                </View>
                            </View>

                      </View>
                    </View>
                </View>
                )}
            />

            <Text style={styles.black_smallTextBold}>Dessert:</Text>
            <FlatList
                keyExtractor={(item)=> item.id}
                data={desData}
                refreshing = {refeshing}
                onRefresh = {handleRefresh}
                renderItem={({item}) =>(
                  <View style={{ width: '85%', padding: 20 }}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: "110%", borderColor: colors.primary, borderWidth: 2, borderRadius: 20 }}>
                      {/* <View style={{ flex: .5 }}>
                          <Image source={item.imageURL} style={{ height: '100%', width: '100%', borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }} />
                      </View> */}
                      <View style={{ flexDirection: 'column', padding: 10 }}>
                          {/*dish info */}
                          <View style={{flexDirection:'row'}}>
                              <Text>Dish:</Text>
                              <Text style={{fontStyle:'italic'}}> {item.name}</Text>
                          </View>
                          <View>
                              {/* <Text style={{fontStyle:'italic'}}>Dish: {item.name}</Text> */}
                              <Text>{item.image}</Text>
                              <View style={{flexDirection:'row'}}>
                                  <Text>Ingredients: </Text>
                                  <Text style={{fontStyle:'italic'}}>{item.ingredient}</Text>
                                </View>
                            </View>

                      </View>
                    </View>
                </View>
                )}
            />

          <View style={{flexDirection:'column'}}>
            <Text style={styles.black_smallTextBold}>Allergens:</Text>
            <Text style={styles.gray_whiteTextBold}>{allergens.toString()}</Text> 
          </View>


          <Text style={styles.black_smallTextBold}>Additional Notes:</Text>
          <Text style={styles.gray_whiteTextBold}> {notes} </Text>
          <Text></Text>

          <View style={{flexDirection:'row'}}>
              <Text style={{fontSize:30}}> 🏠 </Text>
              <Text style={[styles.black_smallTextBold, {fontSize:20, top:5}]}>{address}</Text>
              

          </View>
          <Text></Text>
          <Text></Text>
          {/* <View style={styles.locationBox}>
            // {/* <View style={{ flex: 0.5}}>
            //   <Image source={location} style={{ width: "100%",borderBottomLeftRadius:15,borderTopLeftRadius:15 }} />
            // </View> 
            <View style={{ flexDirection: "column", padding: 10, flex:0.5}}>
              location info
              <Text style={styles.black_smallTextBold}>Location: </Text>
              <Text>{address}</Text>
            </View>
          </View> */}


        <Overlay isVisible={visible} style={{borderRadius:10, padding:10}}>
          <Text style={{textAlign:'center'}}>{status}</Text>
          <MyButton text="Ok" type="primary" size="large" onPressFn={ () => { setVisible(false)}} />
        </Overlay> 
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  contentContainer: {
    alignItems:'center',
    backgroundColor:colors.secondary,
    padding:25
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colors.secondary,
    alignContent: 'center',
    alignItems:"center",
    padding:10,
    width: '100%',
},
  hostedByText:{
    color: 'white',
    fontSize: 25,
    textShadowOffset:{width:6, height:6},
    textShadowColor: 'black',
    textShadowRadius: 5
  },
  whiteTextBold: {
    color: 'white',
    fontSize: 40,
    fontFamily: 'CinzelDecorative_700Bold',
    textShadowOffset:{width:6, height:6},
    textShadowColor: 'black',
    textShadowRadius: 5
  },
  whiteTextReg: {
    color: 'white',
    fontSize: 20,
    textShadowOffset:{width:6, height:6},
    textShadowColor: 'black',
    textShadowRadius: 5
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
    fontWeight: 'bold',
    fontFamily: 'CinzelDecorative_700Bold',
  },
  white_smallTextReg: {
    color: 'white',
    fontSize: 15,
    textShadowOffset:{width:6, height:6},
    textShadowColor: 'black',
    textShadowRadius: 5
  },
  black_smallTextBold: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'CinzelDecorative_700Bold',
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
    width:"100%",
    
    borderRadius:15
  }

  
});