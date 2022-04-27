import React, { useEffect, useState } from 'react';
import { FlatList,View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, ScrollView} from "react-native";
import colors from "../config/colors";
import MyButton from '../components/MyButton';
// import pizza from '../assets/pizza.png'
// Import the functions you need from the SDKs you need
import { doc, collection, query, where, getDocs, arrayRemove, arrayUnion, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import moment from 'moment';
import { Overlay } from 'react-native-elements';

type ScreenProps = {
    navigation: any,
    route: any
  }

export default function MyMealScreen({ navigation,route }: ScreenProps) {
    const {firstName, email, firestore} = route.params;
    const [DATA,setDATA] = useState([]);
    const [AttenDATA,setAttenDATA] = useState([]);
    const [Attending,setAttending] = useState([]);
    const [pendList,setPendList] = useState([]);
    const [refeshing, setRefresh] = useState(false);
    const [pendRefeshing, setpendRefresh] = useState(false);
    const [visible, setVisible] = useState(false);
    const [pend, setPend] = useState([]);
    const [evId, setId] = useState("");
    const [AttenVisible, setAttenVisible] = useState(false);
    const [AttenRefeshing, setAttenRefeshing] = useState(false);
    // const [imageURL, setImageURL] = useState("");

    
    let pendData, attendingData = [];

    async function start() {
        try {
            const q = query(collection(firestore, "events"), where("HostEmail","==",email));
            const querySnapshot = await getDocs(q);
            let arys = [];
            querySnapshot.forEach((doc) => {
                let docData = doc.data();
                var time = docData["date"];
                time = moment.unix(time.seconds).utc().local();
                let temp = docData["pending"];
                let image = docData["image"];
                if (!Array.isArray(temp)){
                    temp = [];
                };
                arys.push({id: doc.id, name: docData["event"],capacity: docData["capacity"],date: time.format('M/DD/YYYY hh:mm A'), pending: temp, atten: docData["attendees"], imageURL: image});
            });
            arys=arys.sort((a, b) => {return moment(a.date).diff(b.date)});
            
            setDATA(arys);
        } catch (e) {
            console.log(e);
        }
        
    }

    async function attending() {
        try {
            const q = query(collection(firestore, "events"), where("attendees","array-contains",email));
            const querySnapshot = await getDocs(q);
            let arys = [];
            querySnapshot.forEach((doc) => {
                let docData = doc.data();
                var time = docData["date"];
                time = moment.unix(time.seconds).utc().local();
                arys.push({id: doc.id, name: docData["event"],capacity: docData["capacity"],date: time.format('M/DD/YYYY hh:mm A'), imageURL: docData["image"]});
            });
            arys=arys.sort((a, b) => {return moment(a.date).diff(b.date)});
            
            setAttenDATA(arys);
        } catch (e) {
            console.log(e);
        }
        
    }


    async function pendingList() {
        try {
            const q = query(collection(firestore, "events"), where("pending","array-contains",email));
            const querySnapshot = await getDocs(q);
            let arys = [];
            querySnapshot.forEach((doc) => {
                let docData = doc.data();
                var time = docData["date"];
                time = moment.unix(time.seconds).utc().local();
                arys.push({id: doc.id, name: docData["event"],capacity: docData["capacity"],date: time.format('M/DD/YYYY hh:mm A'), imageURL: docData["image"]});
            });
            arys=arys.sort((a, b) => {return moment(a.date).diff(b.date)});
            
            setPendList(arys);
            
        } catch (e) {
            console.log(e);
        }
        
    }

    useEffect( () => {
        
        start();
        attending();
        pendingList();
        
      }, []);
    
    

    const handleRefresh = async () =>{
        await start();
        await attending();
        await pendingList();
        setRefresh(false);
    }

    const handlePendRefresh = async () =>{
        let ary = [];
        let cnt = 1;
        pendData.forEach((item) => {
            ary.push({id: cnt,name: item});
            cnt +=1;
        })
        setPend(ary);
        setpendRefresh(false);
    }

    const handleAttenRefresh = async () =>{
        let ary = [];
        let cnt = 1;
        attendingData.forEach((item) => {
            ary.push({id: cnt,name: item});
            cnt +=1;
        })
        setAttending(ary);
        setAttenRefeshing(false);
    }


    const accept = async ( mail) =>{
        setVisible(false)
        const eventRef = doc(firestore, 'events', evId);
        await updateDoc(eventRef,{attendees: arrayUnion(mail)});
        await updateDoc(eventRef,{pending: arrayRemove(mail)});
       
    }

    const decline = async (mail) =>{
        setVisible(false)
        const eventRef = doc(firestore, 'events', evId);
        await updateDoc(eventRef,{pending: arrayRemove(mail)});
        
    }


    const cancelPending = async (id) =>{
        const eventRef = doc(firestore, 'events', id);
        await updateDoc(eventRef,{pending: arrayRemove(email)});
        handleRefresh();
    }

    const cancelAttending = async (id) =>{
        const eventRef = doc(firestore, 'events', id);
        await updateDoc(eventRef,{attendees: arrayRemove(email)});
        handleRefresh();
    }

    const cancelHost = async (id) =>{
        const eventRef = doc(firestore, 'events', id);
        const querySnapshot = await getDoc(eventRef);
        const mealRef = querySnapshot.data()["meal"];
        await deleteDoc(doc(firestore,"meals",mealRef));
        await deleteDoc(doc(firestore,"events",id));
        handleRefresh();
    }

    return(

        <SafeAreaView style={styles.primaryContainer}>
            <ScrollView style={styles.primaryContainer}>
                {/* top bar 
                <TouchableOpacity onPress={async () => {handleRefresh()}}>
                    <Text style={{fontSize: 50}}>⟳</Text>
                </TouchableOpacity>
                    */}

            
                {/* top bar */}

                <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                   
                    <TouchableOpacity onPress={async () => {  navigation.navigate("Home",{firstName, email})}}>
                        <Text style={{fontSize:35, color:colors.primary}}> ⌂ </Text>
                    </TouchableOpacity>
                    <Text>      </Text>
                    <Text style={[styles.logoText, {top:10}]}>EWM</Text>
                    <Text>      </Text>
                    <TouchableOpacity onPress={async () => {handleRefresh()}}>
                        <Text style={{fontSize: 35, color:colors.primary}}>⟳ </Text>
                    </TouchableOpacity>
                </View>

                <Text></Text>
                <Text></Text>

                <Text style={styles.headerText}>   Events Hosting: </Text>

                <Text></Text>
                {/* <Text></Text> */}

                <FlatList
                keyExtractor={(item)=> item.id}
                data={DATA}
                refreshing = {refeshing}
                onRefresh = {handleRefresh}
                renderItem={({item}) =>(
                        
                    <ScrollView style={{ width: '100%', padding: 10}}>
                            <TouchableOpacity style={styles.eventView} onPress={() => navigation.navigate("ViewMeal", { eventID: item.id, firestore })}>
                            
                                    <View style={{flex: 2}}>
                                        <Image source={{uri: item.imageURL}} style={styles.imageStyle} />
                                    </View>
                                    
                                    <View style={{ flexDirection: 'column', padding: 10, alignItems:'center'}}>
                                        {/*meal info */}
                                        <Text style={styles.mealTitle}>{item.name}</Text>
                                        <Text></Text>
                                        <Text style={styles.mealInfoText}>Max Guests: {item.capacity}</Text>
                                        <Text style={styles.mealInfoText}>{item.date}</Text>
                                        <Text></Text>
                                        {/* <Text style={{ color: colors.primary }}>View Event</Text> */}
                                
                
                                        <MyButton text="Invitation Requests" type="primary" size="small" onPressFn={ () => { setId(item.id); setVisible(true);pendData = item.pending ; handlePendRefresh();}} />
                                        <Text></Text>
                                        <MyButton text="   Attendees              " type="primary" size="small" onPressFn={ () => {setAttenVisible(true);attendingData = item.atten;setAttenRefeshing(true); handleAttenRefresh(); }} />
                                        <Text></Text>
                                        <MyButton text="   Cancel Meal          " type="primary" size="small" onPressFn={ async () => {await cancelHost(item.id)}} />
                                    </View>  
                                
                            </TouchableOpacity>
                        </ScrollView>  
                )} />

                <Text></Text>
                <Text style={{color: colors.primary}}>____________________________________________________</Text>
                <Text></Text>
                
                <Text style={styles.headerText}>   Upcoming Events: </Text>

                <Text></Text>
                
                {/* <Text></Text> */}

                <FlatList
                keyExtractor={(item)=> item.id}
                data={AttenDATA}
                refreshing = {refeshing}
                onRefresh = {handleRefresh}
                renderItem={({item}) =>(

                    <ScrollView style={{ width: '100%', padding: 10}}>

                        <TouchableOpacity style={styles.eventView} onPress={() => navigation.navigate("ViewMeal", { eventID: item.id, firestore })}>
                            <View style={{ flex: 2 }}>
                                <Image source={{ uri: item.imageURL }} style={styles.imageStyle} />
                            </View>

                            <View style={{ flexDirection: 'column', padding: 10, alignItems:'center'}}>
                                {/*meal info */}
                                <Text style={styles.mealTitle}>{item.name}</Text>
                                <Text style={styles.mealInfoText}>Max Guests: {item.capacity}</Text>
                                <Text style={styles.mealInfoText}>{item.date}</Text>
                                <Text style={{ color: colors.primary }}>View Event</Text>

                                <MyButton text="Unreserve" type="primary" size="small" onPressFn={ async () => {await cancelAttending(item.id)}} />
                            </View>

                        </TouchableOpacity>
                    </ScrollView>

                )}
            />

                <Text></Text>
                <Text style={{color: colors.primary}}>____________________________________________________</Text>
                <Text></Text>


                <Text style={styles.headerText}>   Pending Requests: </Text>

                <FlatList

                keyExtractor={(item)=> item.id}
                data={pendList}
                refreshing = {refeshing}
                onRefresh = {handleRefresh}
                renderItem={({item}) =>(

                    <ScrollView style={{ width: '100%', padding: 10}}>

                        <TouchableOpacity style={styles.eventView} onPress={() => navigation.navigate("ViewMeal", { eventID: item.id, firestore })}>

                            <View style={{flex:2}}>
                                <Image source={{uri: item.imageURL}} style={styles.imageStyle} />
                            </View>

                            <View style={{ flexDirection: 'column', padding: 10, alignItems:'center'}}>
                                {/*meal info */}
                                <Text style={styles.mealTitle}>{item.name}</Text>
                                <Text style={styles.mealInfoText}>Max Guests: {item.capacity}</Text>
                                <Text style={styles.mealInfoText}>{item.date}</Text>
                                <Text style={{ color: colors.primary }}>View Event</Text>

                                <MyButton text="Cancel Request" type="primary" size="small" onPressFn={ async () => {await cancelPending(item.id)}} />
                            </View>

                        </TouchableOpacity>

                    </ScrollView>
                )}/>
           
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
           
           </ScrollView>

        <Overlay isVisible={visible} overlayStyle={styles.overlayBox}>
          <Text></Text>
          <Text></Text>
          <Text></Text>
          <Text style={styles.actionText}>Pending requests:</Text>
          <Text></Text>
          <Text></Text>
          <Text></Text>
          <FlatList
                keyExtractor={(item)=> item.id}
                data={pend}
                refreshing = {pendRefeshing}
                onRefresh = {handlePendRefresh}
                renderItem={({item}) =>(
                    
                    <View style={{flexDirection: 'row', justifyContent:'space-around'}}>
                        <Text style={styles.nameText}>{item.name}</Text>
                        <MyButton text="accept" type="primary" size="small" onPressFn={ async () => {await accept(item.name)}} />
                        <MyButton text="decline" type="primary" size="small" onPressFn={  async () => {await decline(item.name)}} />
                    </View>
                    
                )}
            />


          <MyButton text="Ok" type="primary" size="large" onPressFn={ () => { setVisible(false); handleRefresh();}} />
        </Overlay>

        <Overlay isVisible={AttenVisible} overlayStyle={styles.overlayBox}>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text style={styles.actionText}>Attendees:</Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>

                <FlatList
                    keyExtractor={(item)=> item.id}
                    data={Attending}
                    refreshing = {AttenRefeshing}
                    onRefresh = {handleAttenRefresh}
                    renderItem={({item}) =>(
                        <View style={{alignItems:'center'}}>
                            <Text style={styles.nameText}>{item.name}</Text>
                        </View>
                        
                    )}
                />
                <MyButton text="Ok" type="primary" size="large" onPressFn={ () => { setAttenVisible(false); handleRefresh();}} />
        </Overlay>
        
        </SafeAreaView>

    );
}
const styles = StyleSheet.create({
    primaryContainer: {
      backgroundColor: colors.secondary,
      height:"100%",
      width: "100%"
  
    },
    eventView:{
        flexDirection: 'row', 
        flexWrap: 'wrap',
        width: "100%", 
        height: '100%',
        borderColor: colors.primary, 
        borderWidth: 1, 
        borderRadius: 20,

    },
    headerText: {
        color: colors.primary,
        fontSize: 25,
        textAlign: 'left',
        //textDecorationLine:'underline',
        fontFamily: 'CinzelDecorative_700Bold',
        textDecorationColor: colors.primary
  
    },
    logoText:{
        fontFamily: 'CinzelDecorative_700Bold',
        fontWeight: '700',
        fontSize: 25,
        color: colors.primary,
        textShadowColor: colors.primary,
        textShadowOffset:{width:1.5,height:1.5},
        textAlign:'center'

  },
  actionText:{
    color: 'black',
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'CinzelDecorative_700Bold',
  },
  nameText:{
    color: 'grey',
    fontSize: 18,
    
  },
  imageStyle:{
     height: '100%', 
     width: '100%', 
     borderTopLeftRadius: 19, 
     borderBottomLeftRadius: 19 
  },
  mealTitle:{
      fontWeight:"bold",
      color: colors.primary,
      fontSize: 14
  },
  mealInfoText:{
    color: 'gray',
    fontSize: 12
  },
  overlayBox:{
    height:'80%',
    width:'90%',
    borderRadius:10, 
    
    //padding:50,

  }
});