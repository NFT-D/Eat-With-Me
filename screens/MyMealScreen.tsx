import React, { useEffect, useState } from 'react';
import { FlatList,View, Text, StyleSheet, ImageBackground, Image, Alert, SafeAreaView, TextInput, Button, TouchableOpacity, ScrollView } from "react-native";
import colors from "../config/colors";
import MyButton from '../components/MyButton';
import pizza from '../assets/pizza.png'
// Import the functions you need from the SDKs you need
import { doc, collection, query, where, getDocs, arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import { Overlay } from 'react-native-elements';

type ScreenProps = {
    navigation: any,
    route: any
  }

export default function MyMealScreen({ navigation,route }: ScreenProps) {
    const { firstName,email, firestore} = route.params;
    const [DATA,setDATA] = useState([]);
    const [AttenDATA,setAttenDATA] = useState([]);
    const [pendList,setPendList] = useState([]);
    const [refeshing, setRefresh] = useState(false);
    const [pendRefeshing, setpendRefresh] = useState(false);
    const [visible, setVisible] = useState(false);
    const [pend, setPend] = useState([]);
    const [evId, setId] = useState("");
    

    let pendData = [];

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
              
                arys.push({id: doc.id, name: docData["event"],capacity: docData["capacity"],date: time.format('M/DD/YYYY hh:mm A'), pending: temp});
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

    return(
        <View>
            <ScrollView>
                <Text>My Meals</Text>


                <Text>hosted Meals</Text>
                <FlatList
                keyExtractor={(item)=> item.id}
                data={DATA}
                refreshing = {refeshing}
                onRefresh = {handleRefresh}
                renderItem={({item}) =>(
                    <ScrollView style={{ width: '85%', padding: 20 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', flexWrap: 'wrap', width: "100%", borderColor: 'black', borderWidth: 1, borderRadius: 20 }} onPress={() => navigation.navigate("ViewMeal", { eventID: item.id, firestore })}>
                            <View style={{ flex: .5 }}>
                                <Image source={pizza} style={{ height: '100%', width: '100%', borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }} />
                            </View>
                            <MyButton text="invitation requests" type="primary" size="large" onPressFn={ () => { setId(item.id); setVisible(true);pendData = item.pending ; handlePendRefresh();}} />
                            <View style={{ flexDirection: 'column', padding: 10 }}>
                                {/*meal info */}
                                <Text>{item.name}</Text>
                                <Text>Max Guests: {item.capacity}</Text>
                                <Text>{item.date}</Text>
                                <Text style={{ color: colors.primary }}>View Event</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            />

                
                <Text>Attending Meals</Text>
                <FlatList
                keyExtractor={(item)=> item.id}
                data={AttenDATA}
                refreshing = {refeshing}
                onRefresh = {handleRefresh}
                renderItem={({item}) =>(
                    <ScrollView style={{ width: '85%', padding: 20 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', flexWrap: 'wrap', width: "100%", borderColor: 'black', borderWidth: 1, borderRadius: 20 }} onPress={() => navigation.navigate("ViewMeal", { eventID: item.id, firestore })}>
                            <View style={{ flex: .5 }}>
                                <Image source={pizza} style={{ height: '100%', width: '100%', borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }} />
                            </View>
                            <View style={{ flexDirection: 'column', padding: 10 }}>
                                {/*meal info */}
                                <Text>{item.name}</Text>
                                <Text>Max Guests: {item.capacity}</Text>
                                <Text>{item.date}</Text>
                                <Text style={{ color: colors.primary }}>View Event</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            />



                <Text>Pending Meals</Text>
                <FlatList
                keyExtractor={(item)=> item.id}
                data={pendList}
                refreshing = {refeshing}
                onRefresh = {handleRefresh}
                renderItem={({item}) =>(
                    <ScrollView style={{ width: '85%', padding: 20 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', flexWrap: 'wrap', width: "100%", borderColor: 'black', borderWidth: 1, borderRadius: 20 }} onPress={() => navigation.navigate("ViewMeal", { eventID: item.id, firestore })}>
                            <View style={{ flex: .5 }}>
                                <Image source={pizza} style={{ height: '100%', width: '100%', borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }} />
                            </View>
                            <View style={{ flexDirection: 'column', padding: 10 }}>
                                {/*meal info */}
                                <Text>{item.name}</Text>
                                <Text>Max Guests: {item.capacity}</Text>
                                <Text>{item.date}</Text>
                                <Text style={{ color: colors.primary }}>View Event</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            />
            </ScrollView>

        <Overlay isVisible={visible}>
          <Text>Pending requests:</Text>

          <FlatList
                keyExtractor={(item)=> item.id}
                data={pend}
                refreshing = {pendRefeshing}
                onRefresh = {handlePendRefresh}
                renderItem={({item}) =>(
                    <View>
                        <Text>{item.name}</Text>
                        <MyButton text="accept" type="primary" size="large" onPressFn={ async () => {await accept(item.name)}} />
                        <MyButton text="decline" type="primary" size="large" onPressFn={  async () => {await decline(item.name)}} />
                    </View>
                    
                )}
            />


          <MyButton text="Ok" type="primary" size="large" onPressFn={ () => { setVisible(false); handleRefresh();}} />
        </Overlay>

        </View>

    );
}