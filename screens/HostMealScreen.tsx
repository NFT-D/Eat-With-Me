import {Image, SafeAreaView, View, TouchableOpacity, Text, TextInput, StyleSheet, ScrollView, Button, Alert, Modal } from 'react-native';
import colors from '../config/colors';
import MyField from '../components/MyField';
import React, { useState } from 'react';
import { hostEvent } from '../services/firebase';
import {Overlay } from 'react-native-elements';
import MyButton from '../components/MyButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { async } from '@firebase/util';
import food from '../assets/burger.jpeg';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "uuid";

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
// Create a root reference
const storage = getStorage(app);
const storageRef = ref(storage, food);

// AUTHENTICATION // ---------------------------------------------------------
let user = auth.currentUser;


type ScreenProps = {
    navigation: any,
    route: any
}



export default function HostMealScreen({ navigation, route }: ScreenProps) {
    const [visible, setVisible] = useState(false);
    const { firstName } = route.params;
    const [event, setEvent] = useState("");
    const [eventID, setEventID] = useState("");
    const [location, enterLoc] = useState("");
    const [guest, enterGuest] = useState(0);
    const [allergens, enterAllergens] = useState("");
    const [notes, enterNotes] = useState("");

    const [appetizers, enterAppetizersDish] = useState("");
    const [entree, enterEntreesDish] = useState("");
    const [dessert, enterDessertsDish] = useState("");

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState(null);
    const [show, setShow] = useState(false);

    const [duration, setDuration] = useState(null);

  

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const toggleOverlay = () => {
        setVisible(true);
      };
    
    const hostEv = async () => {
        const image = await pickImage();
        await setEventID(await hostEvent(event, appetizers, entree, dessert, location, guest, allergens, notes, duration, date, firstName, image));
        toggleOverlay();
    };

    const viewMealE = () => {
        setVisible(false);
        navigation.navigate("ViewMeal", {eventID, firestore })
    };

    const pickImage = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        console.log(pickerResult);
        return handleImpagePicked(pickerResult);
    };

    const handleImpagePicked = async (pickerResult) => {
        var state = null;
        try {
            state = { uploading: true };

            if (!pickerResult.cancelled) {
                const uploadUrl = await uploadImageAsync(pickerResult.uri);
                state = { image: uploadUrl };
                return uploadUrl;
            }
        } catch (e) {
            console.log(e);
            alert("Upload failed, sorry :(");
        } finally {
            state = { uploading: false };
        }
    };

    const uploadImageAsync = async (uri) => {
        const blob: Blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        const fileRef = ref(getStorage(), 'events/' + uuid.v4());
        const result = await uploadBytes(fileRef, blob);

        // We're done with the blob, close and release it
        // blob.close();

        return await getDownloadURL(fileRef);
    };

    return (
        <SafeAreaView style={{ alignContent: 'center', alignItems: 'center', backgroundColor: colors.secondary }}>

            <View>
                <ScrollView>
                    <MyField title="Event Name" type="text" secure={false} onChangeFn={setEvent}></MyField>
                    <Text>Select Date and Time for your event</Text>
                    <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 20, height: 35, padding: 10, alignContent: 'center', alignItems: 'center' }} onPress={() => showMode('date')}>
                            <Text style={{ color: 'white' }}>Select Date</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 20, height: 35, padding: 10, alignContent: 'center', alignItems: 'center' }} onPress={() => showMode('time')}>
                            <Text style={{ color: 'white' }}>Select Time</Text>
                        </TouchableOpacity>

                    </View>
                    <Text>selected: {date.toLocaleString()}</Text>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            display="default"
                            onChange={onChange}
                        />
                    )}
                    <View>


                    </View>


                    <MyField title="Duration" type="text" secure={false} onChangeFn={setDuration} ></MyField>

                    <MyField title="Address" type="text" secure={false} onChangeFn={enterLoc} ></MyField>

                    <MyField title="How many people are you serving?" type="number" secure={false} onChangeFn={enterGuest} ></MyField>

                    <MyField title="Appetizers (separated by ',')" type="text" secure={false} onChangeFn={enterAppetizersDish} ></MyField>

                    <MyField title="Entrees (separated by ',')" type="text" secure={false} onChangeFn={enterEntreesDish} ></MyField>

                    <MyField title="Desserts (separated by ',')" type="text" secure={false} onChangeFn={enterDessertsDish} ></MyField>

                    <MyField title="Allergens?" type="text" secure={false} onChangeFn={enterAllergens} ></MyField>

                    <MyField title="Other Notes....." type="text" secure={false} onChangeFn={enterNotes} ></MyField>

                  
                    <View style={{ flexDirection: 'row' }}><MyButton text="submit" type="primary" size="large" onPressFn={async () => { hostEv() }} /></View>

                    <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>

                        <Text>Meal Created!</Text>
                        <MyButton text="view Meal" type="primary" size="large" onPressFn={ () => {viewMealE()  }} />
                        <MyButton text="Ok" type="primary" size="large" onPressFn={async () => {  navigation.navigate("Home", { firstName })}} />
                    </Overlay>
                    


                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({

    screenContainer: {
        flex: 1,
        padding: 16,
        width: '300px'
    },
    topPanelView: {
        backgroundColor: colors.secondary,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        width: '100%',
        flex: 1,
    },

    container: {
        flex: 1,

        justifyContent: 'center',
    },
    slideContainer: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    primaryContainer: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        width:'70%',
        borderColor: colors.primary,
        borderWidth:.5,
        borderRadius: 20,
        alignContent:'center',
        alignItems:'center',
    },
    imageStyle:{
        height:'100%',
        width:'100%',
        borderTopLeftRadius:20,
        borderBottomLeftRadius:20,

    },
    
    infoText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'left',
        fontSize: 12,
    },
}
);