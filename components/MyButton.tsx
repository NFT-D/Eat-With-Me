import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../config/colors";

// make this simpler using https://reactnative.dev/docs/stylesheet 

export type Props = {
    text: string,
    type?: string,
    size?: string,
    onPressFn?: Function
}

const MyButton = (props: any) => {
    let buttonContainer = {};
    let buttonText = {};
    let sizeContainer = {};
    let sizeText = {};

    if (props.type == 'primary') {
        buttonContainer = styles.primaryContainer;
        buttonText = styles.primaryText;
    }
    else if (props.type == 'secondary') {
        buttonContainer = styles.secondaryContainer;
        buttonText = styles.secondaryText;
    }
    else if (props.type == 'orangeIcon'){
        buttonContainer = styles.orangeiconContainer;
        buttonText=styles.smallText;
    }
    else if (props.type == 'grayIcon'){
        buttonContainer = styles.grayiconContainer;
        buttonText=styles.smallText;
    }
    else if (props.type == 'icon'){
        buttonContainer = styles.iconContainer;
        
    }

    if (props.size == 'small') {
        sizeContainer = styles.smallContainer;
        sizeText = styles.smallText;
    }
    else if (props.size == 'medium') {
        sizeContainer = styles.mediumContainer;
        sizeText = styles.mediumText;
    }
    else if (props.size == 'large') {
        sizeContainer = styles.largeContainer;
        sizeText = styles.largeText;
    }

    return (
        <TouchableOpacity style={[buttonContainer, sizeContainer]} onPress={props.onPressFn}>
        <Text style={[buttonText, sizeText]}>{props.text}</Text>
        </TouchableOpacity>
    )
}

export default MyButton;

const styles = StyleSheet.create({
    primaryContainer: {
        backgroundColor: '#F96332',
        paddingHorizontal: 12,
        paddingVertical: 12,
        //width: 30,
        borderRadius: 11,
    },
    primaryText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 12,
    },
    secondaryContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 32,
        paddingVertical: 12,
        //width: 150,
        borderRadius: 11,
    },
    secondaryText: {
        color: '#F96332',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16
    },
    smallContainer: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        //width: 75,
        borderRadius: 16,
        
    },
    smallText: {
        fontSize: 12
    },
    mediumContainer: {
        paddingHorizontal: 32,
        paddingVertical: 8,
        //width: 150,
        borderRadius: 11,
       
    },
    mediumText: {
        fontSize: 16
    },
    largeContainer: {
        paddingHorizontal: 48,
        paddingVertical: 12,
        //width: 300,
        borderRadius: 11,
    },
    largeText: {
        fontSize: 24
    },
    grayiconContainer: {
        backgroundColor: 'gray',
        padding:10,
        borderRadius: 100,
    },
    orangeiconContainer: {
        backgroundColor: colors.primary,
        borderRadius: 100,
    },
    iconContainer:{
        fontSize:50,
    }
    
});