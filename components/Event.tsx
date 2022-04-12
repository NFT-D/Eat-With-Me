import { Timestamp } from "firebase/firestore";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "react-native-elements/dist/image/Image";
import colors from "../config/colors";

// make this simpler using https://reactnative.dev/docs/stylesheet 

export type Props = {
    time?: Timestamp,
    meal?: string,
    maxGuests?: string,
    eventImage?: Image,
    onPressFn?: Function
}

const Event = (props: any) => {
    let primaryContainer = {};
    let pictureContainer = {};
    let imageStyle = {};
    let infoText = {};
    let infoTextContainer ={};
    let linkText = {};
    
    return (
        <TouchableOpacity style={primaryContainer} onPress={props.onPressFn}>
        <View style={styles.pictureContainer}>
            <Image style={styles.imageStyle} source = {props.eventImage}/>
        </View>
        <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}> Value:{props.meal}</Text>
            <Text style={styles.infoText}> Value:{props.maxGuests}</Text>
            <Text style={styles.infoText}> Value:{props.time}</Text>
            <Text style={styles.linkText}> View Event </Text>
        </View>
        </TouchableOpacity>
    )
}

export default Event;

const styles = StyleSheet.create({
    primaryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width:'100%',
        borderColor: colors.primary,
        borderWidth:.5,
        borderRadius: 20,
    },
    pictureContainer: {
        flex:.5
    },
    imageStyle:{
        height:'100%',
        width:'100%',
        borderTopLeftRadius:20,
        borderBottomLeftRadius:20,

    },
    infoTextContainer:{
        flexDirection:'column',
        padding:10,
    },
    infoText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'left',
        fontSize: 12,
    },
    linkText:{
        color:colors.primary,
        fontWeight:'bold',
        textAlign:'center',
        fontSize:12

    }
});
