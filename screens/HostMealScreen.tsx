import { SafeAreaView, View, TouchableOpacity, Text, TextInput, StyleSheet, ScrollView, Button } from 'react-native';
import colors from '../config/colors';
import MyField from '../components/MyField';
import React, { useState } from 'react';
import { hostEvent } from '../services/firebase';
import MyButton from '../components/MyButton';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';




type ScreenProps = {
    navigation: any
}


export default function LogInScreen({ navigation }: ScreenProps) {
    const [event, setEvent] = useState("");
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

    const [eventName, setEventName] = useState("");

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
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



                    <View style={{ flexDirection: 'row' }}><MyButton text="submit" type="primary" size="large" onPressFn={async () => { hostEvent(event, appetizers, entree, dessert, location, guest, allergens, notes, duration, date) }} /></View>
                    <View style={{ flexDirection: 'row' }}><MyButton text="view Meal" type="primary" size="large" onPressFn={async () => { navigation.navigate("ViewMeal") }} /></View>



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
}
);