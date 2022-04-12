import { SafeAreaView, View, TouchableOpacity, Text, TextInput, StyleSheet, ScrollView, Button } from 'react-native';
import colors from '../config/colors';
import MyField from '../components/MyField';
import React, { useState } from 'react';
import { hostEvent } from '../services/firebase';
import DatePicker from 'react-native-date-picker';
import MyButton from '../components/MyButton';
type ScreenProps = {
    navigation: any
}


export default function LogInScreen({ navigation }: ScreenProps) {
    const [dish,enterDish] = useState("");
    const [date,setDate] = useState(new Date());
    const [startTime,enterSTime] = useState(new Date());
    const [endTime,enterETime] = useState(new Date());
    const [location,enterLoc] = useState("");
    const [guest,enterGuest] = useState(0);
    const [allergens,enterAllergens] = useState("");
    const [notes,enterNotes] = useState("");

    return (
        <SafeAreaView>
           
            <View>
                <ScrollView>
                   
                    {/* area for entering dishes */}
                    <MyField title="Enter Dish" type="text" secure={false} onChangeFn={enterDish} ></MyField>

                    {/* area for setting date and time*/} 
                    <DatePicker date={date} onDateChange={(date) => { this.props.onDateChange && this.props.onDateChange(date);this.setState({ date }); }} />
                    <Text>Pick the start and end time of your event</Text>
                    <View style={{flexDirection:"row"}}>   
                        {/* area for setting start time */}
                        <DatePicker mode= "time" date={date} onDateChange={(date) => { this.props.onDateChange && this.props.onDateChange(date);this.setState({ date }); }} />
                        {/* area for setting start time */}
                        <DatePicker mode= "time" date={date} onDateChange={(date) => { this.props.onDateChange && this.props.onDateChange(date);this.setState({ date }); }} />   
                    </View>
                    {/* area for setting location */}
                    <Text>Where are you hosting your event?</Text>
                        <MyField title="Where's the Event?"  type="text" secure={false} onChangeFn={enterLoc} ></MyField>
    
                    {/* area for setting number of people */}
                    <Text>How many people are you serving?</Text>
                        <MyField title="How many people are you serving" type="number" secure={false} onChangeFn={enterGuest} ></MyField>

                    {/* area for declaring allergens */}
                    <Text>Are there any allergens?</Text>
                        <MyField title="Are you cooking with any allergens?" type="text" secure={false} onChangeFn={enterAllergens} ></MyField>
                    <Text>Anything else to add?</Text>
                    {/* area for notes */}
                        <MyField title="Other Notes" type="text" secure={false} onChangeFn={enterNotes} ></MyField>
                   


                    <MyButton text="submit" type="primary" size="large" onPressFn={async () => { hostEvent(dish, date, startTime, endTime, location, guest, allergens, notes) }} />
                    <MyButton text="view Meal" type="primary" size="large" onPressFn={async () => { navigation.navigate("ViewMeal") }} />


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