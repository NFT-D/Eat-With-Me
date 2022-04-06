import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, Alert, SafeAreaView, TextInput, Button, TouchableOpacity, ScrollView } from "react-native";
import colors from "../config/colors";
import MyButton from '../components/MyButton';
import MyField from '../components/MyField';
import pizza from '../assets/pizza.png'


type ScreenProps = {
    navigation: any,
    route: any
}



export default function HomeScreen({ navigation, route }: ScreenProps) {
    const [searchText, enterSearch] = useState("");
    return (
        <SafeAreaView style={styles.container}>
            
            <MyButton type="primary" text="Host" size="medium" onPressFn={() => navigation.navigate("HostMeal")}></MyButton>
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

            <ScrollView style={{width:'85%', padding:20}}>
                <TouchableOpacity style={{flexDirection:'row', flexWrap:'wrap', width:"100%", borderColor:'black', borderWidth:1, borderRadius: 20}} onPress={() => navigation.navigate("ViewMeal")}>
                    <View style={{flex:.5}}>
                    <Image source={pizza} style={{height:'100%', width:'100%', borderTopLeftRadius: 20, borderBottomLeftRadius: 20}}/>
                    </View>
                    <View style={{flexDirection:'column', padding:10}}>
                        {/*meal info */}
                        <Text>Homemade Pizza</Text>
                        <Text>Max Guests: 6</Text>
                        <Text>7:30 PM</Text>
                        <Text style={{color:colors.primary}}>View Event</Text>
                    </View>
                </TouchableOpacity>
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
        padding:15
        
        
    
    },
    mealComponent:{
        backgroundColor: colors.secondary
    }

});