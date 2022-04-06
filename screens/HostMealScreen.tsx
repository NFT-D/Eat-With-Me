import { SafeAreaView, View, TouchableOpacity, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import MyButton from '../components/MyButton';
import colors from '../config/colors';
import MyField from '../components/MyField';
import React, { useState } from 'react';



type ScreenProps = {
    navigation: any
}

export default function LogInScreen({ navigation }: ScreenProps) {
    const [dish,enterDish] = useState("");

    return (
        <SafeAreaView>
           
            <View>
                <ScrollView>
                   
                    <View style={{ flexDirection: 'row' }}>
                        <MyField title="Enter Dish" type="text" secure={false} onChangeFn={enterDish} ></MyField>
                        <MyButton text="Enter" type="primary" ></MyButton>

                    </View>
                    
                    <View style={{flexDirection:'row'}}>
                        {/* area for setting date */}
                        <MyField title="What time is the food being served?" type="text" secure={false} onChangeFn={enterDish} ></MyField>
                        <MyButton text="Enter" type="primary" ></MyButton>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        {/* area for setting time */}
                        <MyField title="What Time?" type="text" secure={false} onChangeFn={enterDish} ></MyField>
                        <MyButton text="Enter" type="primary" ></MyButton>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        {/* area for setting location */}
                        <MyField title="Where's the Event?" type="text" secure={false} onChangeFn={enterDish} ></MyField>
                        <MyButton text="Enter" type="primary" ></MyButton>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        {/* area for setting number of people */}
                        <MyField title="How many people are you serving" type="text" secure={false} onChangeFn={enterDish} ></MyField>
                        <MyButton text="Enter" type="primary" ></MyButton>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        {/* area for declaring allergens */}
                        <MyField title="Are you cooking with any allergens?" type="text" secure={false} onChangeFn={enterDish} ></MyField>
                        <MyButton text="Enter" type="primary" ></MyButton>
                    </View>
                    <View>
                        {/* area for notes */}
                    </View>

                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({

    topPanelView: {
        backgroundColor: colors.secondary,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent:'center',
        width: '100%',
        flex: 1,
    }

});