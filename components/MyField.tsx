import React, { useState } from "react";
import { TextInput, Text, StyleSheet, View } from "react-native";

// https://www.npmjs.com/package/react-native-floating-label-input

export type Props = {
    title: string,
    type: string,
    secure?: boolean,
    onChangeFn: Function,
    showText: string
}

const MyField: React.FC<Props> = ({ title, type, secure, onChangeFn, showText}) => {
    const [focus, setFocus] = useState(false);
    return ( 
        <View style={styles.container}>
            <Text>{title}</Text>
            <TextInput 
                style={focus ? styles.focus : styles.input} 
                autoCapitalize={"none"}
                secureTextEntry={secure}
                onFocus={() => setFocus(true)} 
                onBlur={() => setFocus(false)} 
                onChangeText={(value) => onChangeFn(value)}
                placeholder={showText}/>
                
        </View>
    ); 
}

const styles = StyleSheet.create({
    focus: {
        //height: "40%",
        //width: "100%",
        fontSize: 18,
        borderColor: '#007AFF',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 5,
        padding: 10
    },
    input: {
        //height: "30%",
        //width: "100%",
        fontSize: 18,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 5,
        padding: 10,
    },
    container: {
        width: "100%",
        //height: "40%",
        //marginBottom: -40,
        padding: "7%",
    },
    text: {
        fontSize: 18
    }
});

export default MyField;