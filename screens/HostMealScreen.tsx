import { SafeAreaView, View, TouchableOpacity, Text, TextInput, StyleSheet, ScrollView, Button } from 'react-native';
import colors from '../config/colors';
import MyField from '../components/MyField';
import React, { useState } from 'react';
import { hostEvent } from '../services/firebase';
import MyButton from '../components/myButton';
type ScreenProps = {
    navigation: any
}


export default function LogInScreen({ navigation }: ScreenProps) {
    const [dish,enterDish] = useState("");
    const [date,enterDate] = useState("");
    const [startTime,enterSTime] = useState("");
    const [endTime,enterETime] = useState("");
    const [location,enterLoc] = useState("");
    const [guest,enterGuest] = useState(0);
    const [allergens,enterAllergens] = useState("");
    const [notes,enterNotes] = useState("");

    return (
        <SafeAreaView>
           
            <View>
                <ScrollView>
                   
                    <View style={{ flexDirection: 'row' }}>
                        <MyField title="Enter Dish" type="text" secure={false} onChangeFn={enterDish} ></MyField>

                    </View>
                    
                    <View style={{flexDirection:'row'}}>
                        {/* area for setting date */}
                      
                        <MyField title="What time is the food being served?" type="text" secure={false} onChangeFn={enterDate} ></MyField>
                        <MyButton text="Enter" type="primary" ></MyButton>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        {/* area for setting time */}
                        <MyField title="What Time will it end?" type="text" secure={false} onChangeFn={enterSTime} ></MyField>
                        <MyButton text="Enter" type="primary" ></MyButton>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        {/* area for setting location */}
                        <MyField title="Where's the Event?" type="text" secure={false} onChangeFn={enterLoc} ></MyField>
                        <MyButton text="Enter" type="primary" ></MyButton>

                    </View>
                    <View style={{flexDirection:'row'}}>
                        {/* area for setting number of people */}
                        <MyField title="How many people are you serving" type="text" secure={false} onChangeFn={enterGuest} ></MyField>

                        

                        <MyButton text="Enter" type="primary" ></MyButton>

                    </View>
                    <View style={{flexDirection:'row'}}>
                        {/* area for declaring allergens */}
                        <MyField title="Are you cooking with any allergens?" type="text" secure={false} onChangeFn={enterAllergens} ></MyField>

                        <MyButton text="Enter" type="primary" ></MyButton>

                    </View>
                    <View>
                        {/* area for notes */}
                        <MyField title="Other Notes" type="text" secure={false} onChangeFn={enterNotes} ></MyField>
                    </View>


                    <View style={{flexDirection:'row'}}><MyButton text="submit" type="primary" size="large" onPressFn={async () => { hostEvent(dish, date, startTime, endTime, location, guest, allergens, notes) }} /></View>
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
    }

});