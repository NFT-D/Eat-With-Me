import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, Alert, SafeAreaView, TextInput, Button, TouchableOpacity, ScrollView } from "react-native";
import colors from "../config/colors";
import MyButton from '../components/MyButton';


type ScreenProps = {
    navigation: any,
    route: any
}



export default function HomeScreen({ navigation, route }: ScreenProps) {
    const [searchText, enterSearch] = useState("");
    return (
        <SafeAreaView style={styles.container}>
            
            <MyButton type="primary" text="Host" size="medium" onPressFn={() => navigation.navigate("HostMeal")}></MyButton>
            <View style={styles.searchBar}>
                <TextInput autoCapitalize={"none"} onChangeText={enterSearch} value= "search" placeholder="search for a meal...." style = {styles.searchBarText}/>   
                <TouchableOpacity style={{flex:1}}>
                    <Text>🔎</Text>
                </TouchableOpacity> 
            </View>

            <ScrollView style={styles.mealfeed}>
                {/* event components can go here - intended to auto update */}
               
            </ScrollView>
        </SafeAreaView>
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
        width:'85%',
        padding:20
    },
    searchBar: {
        backgroundColor: colors.secondary,
        flexDirection: 'row',
        alignItems: 'center',
        padding:15
    },
    searchBarText:{
        height: 50,
            width: 300,
            fontSize: 16,
            borderColor: colors.primary,
            borderWidth: 1,
            borderRadius: 15,
            marginTop: 5,
            padding: 10,
            justifyContent:'flex-start',
            flex:3
            
    },
    

});