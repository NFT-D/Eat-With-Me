import React, { useEffect, useState } from 'react';
import { FlatList,View, Text, StyleSheet, ImageBackground, Image, Alert, SafeAreaView, TextInput, Button, TouchableOpacity, ScrollView } from "react-native";
import colors from "../config/colors";
import MyButton from '../components/MyButton';
import MyField from '../components/MyField';
import pizza from '../assets/pizza.png'
import { getEvent } from '../services/firebase';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, addDoc, collection, query, where, getDocs, getDoc, Timestamp } from 'firebase/firestore';
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
    const { firstName } = route.params;
    const [searchText, enterSearch] = useState("");
    const [DATA,setDATA] = useState([]);

    useEffect(() => {
        async function fetchMyAPI() {
            try {
                const querySnapshot = await getDocs(collection(firestore, "events"));
                let ary = [];
                querySnapshot.forEach((doc) => {
                    let docData = doc.data();
                    var time = docData["date"];
                    time = moment.unix(time.seconds).utc().local();
                    ary.push({id: doc.id, name: docData["event"],capacity: docData["capacity"],date: time.format('M/DD/YYYY hh:mm A')});
                });
                setDATA(ary);
            } catch (e) {
                console.log(e);
            }
        }
        fetchMyAPI()
    
      }, []);
    


    return (
        <ScrollView>

            <MyButton type="primary" text="Host" size="medium" onPressFn={() => navigation.navigate("HostMeal", {firstName})}></MyButton>
            {/* 
            <View style={styles.topPanelView}>
                <TextInput 
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

                    </TextInput>
                <TouchableOpacity style={{}}>
                    <Text>🔎</Text>
                </TouchableOpacity> 
            </View>
*/}
            <FlatList
                keyExtractor={(item)=> item.id}
                data={DATA}
                renderItem={({item}) =>(
                    <ScrollView style={{ width: '85%', padding: 20 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', flexWrap: 'wrap', width: "100%", borderColor: 'black', borderWidth: 1, borderRadius: 20 }} onPress={() => navigation.navigate("ViewMeal", { firstName, eventID: item.id, firestore })}>
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
    }

});