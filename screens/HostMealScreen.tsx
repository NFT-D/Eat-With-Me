import {Image, SafeAreaView, View, TouchableOpacity, Text, TextInput, StyleSheet, ScrollView, Button, Alert, Modal } from 'react-native';
import colors from '../config/colors';
import MyField from '../components/MyField';
import React, { useState } from 'react';
import { hostEvent } from '../services/firebase';
import {Overlay } from 'react-native-elements';
import MyButton from '../components/MyButton';
import DateTimePicker from '@react-native-community/datetimepicker';

// Your web app's Firebase configuration

type ScreenProps = {
    navigation: any,
    route: any
}



export default function HostMealScreen({ navigation, route }: ScreenProps) {
    const [visible, setVisible] = useState(false);
    const { firstName,firestore } = route.params;
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
    const [fee, setFee] = useState(0);

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
        await setEventID(await hostEvent(event, appetizers, entree, dessert, location, guest, allergens, notes, duration, date, firstName, fee))
        toggleOverlay();
    };

    const viewMealE = () => {
        setVisible(false);
        navigation.navigate("ViewMeal", {eventID, firestore })
    };

    return (
        <SafeAreaView style={styles.mainContainer}>

                    <MyField title="Event Name" showText= "Test's Meal" type="text" secure={false} onChangeFn={setEvent}></MyField>
                    <Text>Select the DATE and TIME for your event</Text>
                    <View style={{ flexDirection: 'row', alignContent:'center' }}>
                        <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 10, padding: 10, alignContent: 'center', alignItems: 'center' }} onPress={() => showMode('date')}>
                            <Text style={{ color: 'white' }}>Select Date</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 10, padding: 10, alignContent: 'center', alignItems: 'center' }} onPress={() => showMode('time')}>
                            <Text style={{ color: 'white' }}>Select Time</Text>
                        </TouchableOpacity>

                    </View>
                    <Text>Date Selected:  {date.toLocaleString()}</Text>
                    
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            display="default"
                            onChange={onChange}
                        />
                    )}

                    <MyField title="Duration in hours" type="text" showText= "2.5" secure={false} onChangeFn={setDuration} ></MyField>

                    <MyField title="Address" type="text" secure={false} showText= "123 abc St. Hoboken" onChangeFn={enterLoc} ></MyField>

                    <MyField title="How many people are you serving?" type="number" showText= "2" secure={false} onChangeFn={enterGuest} ></MyField>

                    <MyField title="Fee in $" type="text" secure={false} showText= "3.50"  onChangeFn={setFee} ></MyField>

                    <MyField title="Appetizers (separated by ',')" type="text" showText= "app1,app2, app3" secure={false} onChangeFn={enterAppetizersDish} ></MyField>

                    <MyField title="Entrees (separated by ',')" type="text" showText= "ent1,ent2, ent3" secure={false} onChangeFn={enterEntreesDish} ></MyField>

                    <MyField title="Desserts (separated by ',')" type="text" showText= "des1, des2" secure={false} onChangeFn={enterDessertsDish} ></MyField>

                    <MyField title="Allergens?" type="text" secure={false} showText= "Dairy" onChangeFn={enterAllergens} ></MyField>

                    <MyField title="Other Notes....." type="text" secure={false} showText= "I have a cat" onChangeFn={enterNotes} ></MyField>

                    <MyButton text="Create Meal" type="primary" size="large" onPressFn={async () => { hostEv() }} />
                    
                    <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>

                        <Text>Meal Created!</Text>
                        <MyButton text="View Meal" type="primary" size="large" onPressFn={ () => {viewMealE()  }} />
                        <MyButton text="Ok" type="primary" size="large" onPressFn={async () => {  navigation.navigate("Home", { firstName })}} />
                    </Overlay>
                    


            
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: colors.secondary,
        alignContent: "center",
        alignItems:"center"
    },
    
    
}
);