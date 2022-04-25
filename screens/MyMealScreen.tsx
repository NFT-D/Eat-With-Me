import React, { useEffect, useState } from 'react';
import { FlatList,View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity} from "react-native";
import colors from "../config/colors";
import MyButton from '../components/MyButton';
import pizza from '../assets/pizza.png'
// Import the functions you need from the SDKs you need
import { doc, collection, query, where, getDocs, arrayRemove, arrayUnion, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import moment from 'moment';
import { Overlay } from 'react-native-elements';

type ScreenProps = {
    navigation: any,
    route: any
  }

export default function MyMealScreen({ navigation,route }: ScreenProps) {
    const {email, firestore} = route.params;
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
                if (!Array.isArray(temp)){
                    temp = [];
                };
                arys.push({id: doc.id, name: docData["event"],capacity: docData["capacity"],date: time.format('M/DD/YYYY hh:mm A'), pending: temp, atten: docData["attendees"]});
            });
            arys=arys.sort((a, b) => {return moment(a.date).diff(b.date)});
            
            setDATA(arys);
            setRefresh(true);
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
                arys.push({id: doc.id, name: docData["event"],capacity: docData["capacity"],date: time.format('M/DD/YYYY hh:mm A')});
            });
            arys=arys.sort((a, b) => {return moment(a.date).diff(b.date)});
            
            setAttenDATA(arys);
            setRefresh(true);
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
                arys.push({id: doc.id, name: docData["event"],capacity: docData["capacity"],date: time.format('M/DD/YYYY hh:mm A')});
            });
            arys=arys.sort((a, b) => {return moment(a.date).diff(b.date)});
            
            setPendList(arys);
            setRefresh(true);
        } catch (e) {
            console.log(e);
        }
        
    }

    useEffect( () => {
        
        start();
        attending();
        pendingList();
        setRefresh(false);
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
                <View style={{backgroundColor:colors.secondary}}>
                {/* top bar */}
                <View style={{flexDirection:'row', backgroundColor:colors.primary, justifyContent:'space-evenly'}}>
                    <TouchableOpacity onPress={async () => {  navigation.navigate("Home",)}}>
                        <Text style={{fontSize:100, color:colors.secondary}}> ⌂ </Text>
                    </TouchableOpacity>
                    <Text style={styles.logoText}>EWM</Text>
                    <Text style={{fontSize:100}}>   </Text>
                </View>

                <Text style={styles.headerText}>My Meals</Text>
                <FlatList
                keyExtractor={(item)=> item.id}
                data={DATA}
                refreshing = {refeshing}
                onRefresh = {handleRefresh}
                renderItem={({item}) =>(
                    <View style={{ width: '85%', padding: 10 }}>
                        <TouchableOpacity style={styles.eventView} onPress={() => navigation.navigate("ViewMeal", { eventID: item.id, firestore })}>
                            <View style={{ flex: .5 }}>
                                <Image source={pizza} style={styles.imageStyle} />
                            </View>
                            <View style={{ flexDirection: 'column', padding: 10 }}>
                                {/*meal info */}
                                <Text style={styles.mealTitle}>{item.name}</Text>
                                <Text style={styles.mealInfoText}>Max Guests: {item.capacity}</Text>
                                <Text style={styles.mealInfoText}>{item.date}</Text>
                                <Text style={{ color: colors.primary }}>View Event</Text>
                            </View>
                            <View style={{flexDirection:'column'}}>
                                <MyButton text="Invitation Requests" type="primary" size="large" onPressFn={ () => { setId(item.id); setVisible(true);pendData = item.pending ; handlePendRefresh();}} />
                                <MyButton text="Attendees" type="primary" size="large" onPressFn={ () => {setAttenVisible(true);attendingData = item.atten;setAttenRefeshing(true); handleAttenRefresh(); }} />
                                <MyButton text="Cancel Meal" type="primary" size="large" onPressFn={ async () => {await cancelHost(item.id)}} />
                            </View>
                        </TouchableOpacity>
                    </View>
                )} />

                
                <Text style={styles.headerText}>Upcoming Meals</Text>
                <FlatList
                keyExtractor={(item)=> item.id}
                data={AttenDATA}
                refreshing = {refeshing}
                onRefresh = {handleRefresh}
                renderItem={({item}) =>(
                    <View style={{ width: '85%', padding: 10 }}>
                        <TouchableOpacity style={styles.eventView} onPress={() => navigation.navigate("ViewMeal", { eventID: item.id, firestore })}>
                            <View style={{ flex: .5 }}>
                                <Image source={pizza} style={styles.imageStyle} />
                            </View>
                            <View style={{ flexDirection: 'column', padding: 10 }}>
                                {/*meal info */}
                                <Text style={styles.mealTitle}>{item.name}</Text>
                                <Text style={styles.mealInfoText}>Max Guests: {item.capacity}</Text>
                                <Text style={styles.mealInfoText}>{item.date}</Text>
                                <Text style={{ color: colors.primary }}>View Event</Text>
                            </View>
                            <MyButton text="Unreserve" type="primary" size="large" onPressFn={ async () => {await cancelAttending(item.id)}} />
                            
                        </TouchableOpacity>
                    </View>
                )}
            />



                <Text style={styles.headerText}>Waiting for Host Approval</Text>
                <FlatList
                keyExtractor={(item)=> item.id}
                data={pendList}
                refreshing = {refeshing}
                onRefresh = {handleRefresh}
                renderItem={({item}) =>(
                    <View style={{ padding:10}}>
                        <TouchableOpacity style={styles.eventView} onPress={() => navigation.navigate("ViewMeal", { eventID: item.id, firestore })}>
                            <View style={{flex:.5}}>
                                <Image source={pizza} style={styles.imageStyle} />
                            </View>
                            <View style={{ flexDirection: 'column', padding: 10 }}>
                                {/*meal info */}
                                <Text style={styles.mealTitle}>{item.name}</Text>
                                <Text style={styles.mealInfoText}>Max Guests: {item.capacity}</Text>
                                <Text style={styles.mealInfoText}>{item.date}</Text>
                                <Text style={{ color: colors.primary }}>View Event</Text>
                            </View>
                            <View>
                            <MyButton text="Cancel Request" type="primary" size="large" onPressFn={ async () => {await cancelPending(item.id)}} />
                            </View>
                        </TouchableOpacity>
                    </View>
                )}/>
           
           

        <Overlay isVisible={visible} style={styles.overlayBox}>
          <Text style={styles.actionText}>Pending requests:</Text>

          <FlatList
                keyExtractor={(item)=> item.id}
                data={pend}
                refreshing = {pendRefeshing}
                onRefresh = {handlePendRefresh}
                renderItem={({item}) =>(
                    <View>
                        <Text style={styles.actionText}>{item.name}</Text>
                        <MyButton text="accept" type="primary" size="large" onPressFn={ async () => {await accept(item.name)}} />
                        <MyButton text="decline" type="primary" size="large" onPressFn={  async () => {await decline(item.name)}} />
                    </View>
                    
                )}
            />


          <MyButton text="Ok" type="primary" size="large" onPressFn={ () => { setVisible(false); handleRefresh();}} />
        </Overlay>

        <Overlay isVisible={AttenVisible} style={styles.overlayBox}>
            <FlatList
                keyExtractor={(item)=> item.id}
                data={Attending}
                refreshing = {AttenRefeshing}
                onRefresh = {handleAttenRefresh}
                renderItem={({item}) =>(
                    <View>
                        <Text style={styles.actionText}>{item.name}</Text>
                    </View>
                    
                )}
            />
            <MyButton text="Ok" type="primary" size="large" onPressFn={ () => { setAttenVisible(false); handleRefresh();}} />
        </Overlay>
        </View>  
        </SafeAreaView>

    );
}
const styles = StyleSheet.create({
    primaryContainer: {
      backgroundColor: colors.secondary,
  
    },
    eventView:{
        flexDirection: 'row', 
        width: "100%", 
        borderColor: colors.primary, 
        borderWidth: 1, 
        borderRadius: 10
    },
    headerText: {
        color: colors.primary,
        fontSize: 40,
        textAlign: 'center',
        textDecorationLine:"underline",
        textDecorationColor: colors.primary
  
    },
    logoText:{
        fontFamily: 'CinzelDecorative_700Bold',
        fontWeight: '700',
        fontSize: 100,
        color: 'white',
        textShadowColor: colors.primary,
        textShadowOffset:{width:1.5,height:1.5},
        textAlign:'center'

  },
  actionText:{
    color: 'black',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageStyle:{
     height: '100%', 
     width: '100%', 
     borderTopLeftRadius: 10, 
     borderBottomLeftRadius: 10 
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
    borderRadius:10, 
    padding:10
  }
});