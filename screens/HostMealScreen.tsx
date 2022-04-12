import { SafeAreaView, View, TouchableOpacity, Text, TextInput, StyleSheet, ScrollView, Button } from 'react-native';
import colors from '../config/colors';
import MyField from '../components/MyField';
import React, { useState } from 'react';
import { hostEvent } from '../services/firebase';
import MyButton from '../components/MyButton';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker  from '@react-native-community/datetimepicker';
import {Slider} from '@miblanchard/react-native-slider';


import MultiSlider from '@ptomasroos/react-native-multi-slider';




type ScreenProps = {
    navigation: any
}


export default function LogInScreen({ navigation }: ScreenProps) {
    const [location,enterLoc] = useState("");
    const [guest,enterGuest] = useState(0);
    const [allergens,enterAllergens] = useState("");
    const [notes,enterNotes] = useState("");

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState(null);
    const [show, setShow] = useState(false);

    const [duration,setDuration] = useState(null);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate||date;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };


 

    return (
        <SafeAreaView>
           
            <View>
                <ScrollView>
                  <Text>Select Date and start date for the event</Text>
                    <View style={{flexDirection:'row'}}>
                        {/* area for setting date */}
                        
                        <View style={styles.container}>
                            {/* area for setting time */}
                            <View>
                                <Button onPress={() => showMode('date')} title="Show date picker!" />
                            </View>
                            <View>
                                <Button onPress={() =>showMode("time")} title="Show time picker!" />
                            </View>
                            <Text>selected: {date.toLocaleString()}</Text>
                            {show && (
                            <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            display= "default"
                            onChange={onChange}
                            />
                        )}
                            
                           
                            <StatusBar style="auto"/>
                            </View>
                        </View>
                        
                    
                    <View>
                        
                        
                    </View>
                   
                        <Text>Duration of event(1-24):</Text>
                        <MyField title="ex.2" type="text" secure={false} onChangeFn={setDuration} ></MyField>
                        
                        
                        
                   
                    
                        <Text>Location(Adress):</Text>
                        <MyField title="123 Main St. Hoboken" type="text" secure={false} onChangeFn={enterLoc} ></MyField>
                        

                    
                    
                        <Text>Number of people invitable:</Text>
                        <MyField title="5" type="text" secure={false} onChangeFn={enterGuest} ></MyField>

                        

                        
                        <Text>Appetizers(Please enter dishes seperated by ","):</Text>
                        <MyField title="chips, fries" type="text" secure={false} onChangeFn={enterAppetizersDish} ></MyField>

                        <Text>Entree(Please enter dishes seperated by ","):</Text>
                        <MyField title="pizza, pasta, burger" type="text" secure={false} onChangeFn={enterEntreeDish} ></MyField>

                        <Text>Dessert(Please enter dishes seperated by ","):</Text>
                        <MyField title="ice cream, gelato" type="text" secure={false} onChangeFn={enterDessertDish} ></MyField>
                    
                  
                        <Text>Aany allergens:</Text>
                        <MyField title="dairy" type="text" secure={false} onChangeFn={enterAllergens} ></MyField>

                        

                  
                  
                        <Text>Other Notes:</Text>
                        <MyField title="I have a dog" type="text" secure={false} onChangeFn={enterNotes} ></MyField>
                   


                    <View style={{ flexDirection: 'row' }}><MyButton text="submit" type="primary" size="large" onPressFn={async () => { hostEvent(Appetizers,entree,dessert,location,guest,allergens,notes,duration,date) }} /></View>
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
        width:'300px'
      },
    topPanelView: {
        backgroundColor: colors.secondary,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent:'center',
        width: '100%',
        flex: 1,
    },

    container:{
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