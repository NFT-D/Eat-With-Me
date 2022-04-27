import React, { useEffect, useState } from 'react';
import { FlatList,View, Text, StyleSheet, Image, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from "react-native";
import colors from "../config/colors";
import MyButton from '../components/MyButton';
import pizza from '../assets/pizza.png'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, addDoc, collection, query, where, getDocs, getDoc, Timestamp, arrayRemove } from 'firebase/firestore';
import Constants from "expo-constants";
import moment from 'moment';

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


export default function HomeScreen({ navigation, route }: ScreenProps) {
    const { firstName, email} = route.params;
    const [searchText, enterSearch] = useState("");


    //Data format = {id: element,id2:element2}
    const [DATA,setDATA] = useState([]);
    const [refeshing, setRefresh] = useState(false);

    

    async function start() {
        try {
            
            const q = query(collection(firestore, "events"), where("event",">=",""));
            const querySnapshot = await getDocs(q);
            let arys = [];
            querySnapshot.forEach((doc) => {
                let docData = doc.data();
                var time = docData["date"];
                time = moment.unix(time.seconds).utc().local();
                arys.push({id: doc.id, name: docData["event"],capacity: docData["capacity"],date: time.format('M/DD/YYYY hh:mm A')});
            });
            arys=arys.sort((a, b) => {return moment(a.date).diff(b.date)});
            setDATA(arys);
            
        } catch (e) {
            console.log(e);
        }
        
    }
    useEffect(() => {
        start();
        
      }, []);
    
    const search = async () => {
        try {
            
            const q = query(collection(firestore, "events"), where("event",">=",searchText),where("event","<=",searchText+"~"));
            const querySnapshot = await getDocs(q);
            let ary = [];
            querySnapshot.forEach((doc) => {
                let docData = doc.data();
                var time = docData["date"];
                time = moment.unix(time.seconds).utc().local();
                ary.push({id: doc.id, name: docData["event"],capacity: docData["capacity"],date: time.format('M/DD/YYYY hh:mm A')});
            });
            ary=ary.sort((a, b) => {return moment(a.date).diff(b.date)});
            setDATA(ary);
            
        } catch (e) {
            console.log(e);
        }
    }

    const handleSearch = async () =>{
        await search();
        setRefresh(false);
    }

    const handleRefresh = async () =>{
        enterSearch("")
        await start();
        setRefresh(false);
    }
    return (
        
        <SafeAreaView style={styles.homePage}>
            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                <MyButton type="primary" text="Create Meal" size="medium" onPressFn={() => navigation.navigate("HostMeal", {email, firstName, firestore})}></MyButton>
                <MyButton type="primary" text="My Meals" size="medium" onPressFn={() => navigation.navigate("MyMeal", {firstName, email,firestore})}></MyButton>
            </View>
            
            
            <View style={{padding:10}}>
                
                <Text>Search for a Meal...</Text>
                
                    <View style={{flexDirection:'row'}}>
                        <TextInput 
                        autoCapitalize={"none"}
                        onChangeText={(value) => enterSearch(value)}
                        value = {searchText}
                        placeholder="Search"
                        style={styles.searchBar}/>   
                        <TouchableOpacity style={styles.searchBarButton} onPress={async () => {handleSearch()}}>
                            <Text style={[styles.searchBarButtonText,{alignSelf:'flex-end'}]}>→</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.searchBarButton} onPress={async () => {handleRefresh()}}>
                            <Text style={styles.searchBarButtonText}>⟳</Text>
                        </TouchableOpacity>
                    </View>
                
            </View>

            <FlatList
                keyExtractor={(item)=> item.id}
                data={DATA}
                refreshing = {refeshing}
                onRefresh = {handleRefresh}
                renderItem={({item}) =>(
                    <ScrollView style={{ width: '100%', padding: 10}}>
                    
                        <TouchableOpacity style={{ flexDirection: 'row', flexWrap: 'wrap', width: "100%", height:'100%', borderColor: colors.primary, borderWidth: 1, borderRadius: 8 }} onPress={() => navigation.navigate("ViewMeal", { firstName, eventID: item.id, firestore,email })}>
                            <View style={{ flex: .5 }}>
                                <Image source={pizza} style={styles.imageStyle} />
                            </View>
                            <View style={{ flexDirection: 'column', padding: 10 }}>
                                {/*meal info */}
                                <Text style={styles.infoTextTitle}>{item.name}</Text>
                                <Text style={styles.infoText}>Max Guests: {item.capacity}</Text>
                                <Text style={styles.infoText}>{item.date}</Text>
                                <Text style={styles.linkText}>View Event</Text>
                            </View>
                        </TouchableOpacity>
                    
                </ScrollView>
                )}
            />


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        backgroundColor: colors.secondary,
        padding: 8,
        borderWidth:.5,
        borderColor:colors.primary,
        borderRadius:8,
        width:"80%",
        flexDirection:'row'


    },
    searchBarButton:{
        width:'10%',
        backgroundColor: colors.secondary,
        

    },
    searchBarButtonText:{
        color: colors.primary,
        fontSize: 30,
        textAlign:'right'
    },
    homePage:{
        backgroundColor: colors.secondary,
        height:'100%'
        

    },
    imageStyle:{
        height: '100%',
        width: '100%',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8

    },
    infoTextTitle:{
        color:colors.primary,
        fontSize:14,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    infoText: {
        color: 'gray',
        textAlign: 'left',
        fontSize: 12,
    },
    linkText:{
        color:colors.primary,
        textAlign:'left',
        fontSize:12

    }
});

