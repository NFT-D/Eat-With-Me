import React, { useEffect, useState } from 'react';
import { FlatList,View, Text, StyleSheet, ImageBackground, Image, Alert, SafeAreaView, TextInput, Button, TouchableOpacity, ScrollView } from "react-native";
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
            setRefresh(true);
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
            setRefresh(true);
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
        <ScrollView>

            <MyButton type="primary" text="Host" size="medium" onPressFn={() => navigation.navigate("HostMeal", {firstName, firestore})}></MyButton>
            <MyButton type="primary" text="myMeal" size="medium" onPressFn={() => navigation.navigate("MyMeal", {firstName, email,firestore})}></MyButton>
            {
            <View style={styles.topPanelView}>
                <View style={styles.container}>
                <Text>Event Name</Text>
                <TextInput 
                    autoCapitalize={"none"}
                    onChangeText={(value) => enterSearch(value)}
                    value = {searchText}
                    placeholder="Event Name"/>
                    
            </View>
                {/* <TextInput 
                autoCapitalize={"none"} 
                onChangeText={enterSearch} 
                placeholder="search for a meal...."
                style={{height: 50,
                    width: 300,
                    fontSize: 16,
                    borderColor: colors.primary,
                    borderWidth: 1,
                    borderRadius: 15,
                    marginTop: 5,
                    padding: 10,
                    justifyContent:'flex-start',
                    flex:3
                    }}>

                    </TextInput> */}
                {/* <TouchableOpacity style={{}}>

                    <Text>🔎</Text>
                </TouchableOpacity>  */}
                <MyButton type="primary" text="🔎" size="medium" onPressFn={async () => {handleSearch()}}></MyButton>
                <MyButton type="primary" text="⟳" size="medium" onPressFn={async () => {handleRefresh()}}></MyButton>
            </View>
}
            <FlatList
                keyExtractor={(item)=> item.id}
                data={DATA}
                refreshing = {refeshing}
                onRefresh = {handleRefresh}
                renderItem={({item}) =>(
                    <ScrollView style={{ width: '85%', padding: 20 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', flexWrap: 'wrap', width: "100%", borderColor: 'black', borderWidth: 1, borderRadius: 20 }} onPress={() => navigation.navigate("ViewMeal", { firstName, eventID: item.id, firestore,email })}>
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
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.secondary,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20,
        flex: 1,
        flexDirection: 'column',
        alignContent:'center'


    },
    mealfeed: {
        backgroundColor: colors.secondary,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 6,
        width: "100%",
        padding: 10
    },
    topPanelView: {
        backgroundColor: colors.secondary,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15



    },
    mealComponent: {
        backgroundColor: colors.secondary
    },
    primaryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width:'100%',
        borderColor: colors.primary,
        borderWidth:.5,
        borderRadius: 20,
    },
    pictureContainer: {
        flex:.5
    },
    imageStyle:{
        height:'100%',
        width:'100%',
        borderTopLeftRadius:20,
        borderBottomLeftRadius:20,

    },
    infoTextContainer:{
        flexDirection:'column',
        padding:10,
    },
    infoText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'left',
        fontSize: 12,
    },
    linkText:{
        color:colors.primary,
        fontWeight:'bold',
        textAlign:'center',
        fontSize:12

    }
});

