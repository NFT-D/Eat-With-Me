import { Foundation } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from "react";
import { View, Dimensions, StyleSheet, Text, SafeAreaView, ImageBackground } from "react-native";
import MyButton from '../components/MyButton';
import food from '../assets/food.png';
import { useFonts, CinzelDecorative_400Regular, CinzelDecorative_700Bold, } from '@expo-google-fonts/cinzel-decorative';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat'
import AppLoading from "expo-app-loading";
import { color } from 'react-native-elements/dist/helpers';


type ScreenProps = {
    navigation: any
}

export default function StartUpScreen({ navigation }: ScreenProps) {

    let [isLoaded] = useFonts({
        CinzelDecorative_400Regular,
        CinzelDecorative_700Bold,
        Montserrat_700Bold
    });

    if (!isLoaded) {
        return <AppLoading />
    }
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={food} style={{ width: '100%', height: '110%', justifyContent: 'flex-end', alignItems: 'center' }}>

                <Text style={styles.fixToText2}>EWM</Text>
                <Text style={styles.fixToText}>EWM</Text>
                <Text style={styles.text1}>EAT WITH ME</Text>
                <Text style={styles.text2}>EAT WITH ME</Text>
                <MyButton type="primary" text="Login" size="large" onPressFn={() => navigation.navigate("LogIn")} />
                <View style={{ height: 20 }} />
                <MyButton type="secondary" text="Sign Up" size="large" onPressFn={() => navigation.navigate("SignUp")} />
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        //backgroundColor: colors.primary,
        //alignContent: 'center',
        justifyContent: 'flex-end',
        padding: 20,
        flex: 1,
        flexDirection: 'column'

    },
    fixToText: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'CinzelDecorative_700Bold',
        fontWeight: '700',
        fontSize: 126,
        fontStyle: 'normal',
        lineHeight: 168,
        display: 'flex',
        textAlign: 'center',
        top: 241,
        left: 29,
        height: 172,
        width: 331,
        position: 'absolute',
        color: '#F96332',
        alignSelf: 'center'

    },
    fixToText2: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'CinzelDecorative_700Bold',
        fontWeight: '700',
        fontSize: 131,
        fontStyle: 'normal',
        lineHeight: 175,
        display: 'flex',
        textAlign: 'center',
        top: 241,
        left: 27,
        height: 172,
        width: 331,
        position: 'absolute',
        color: 'white',
        alignSelf: 'center'

    },

    text1: {
        fontFamily: 'Montserrat_700Bold',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: '700',
        fontSize: 40,
        fontStyle: 'normal',
        lineHeight: 175,
        display: 'flex',
        textAlign: 'center',
        top: 325,
        left: 27,
        height: 172,
        width: 331,
        position: 'absolute',
        color: 'white',
        alignSelf: 'center'
    },
    text2: {
        fontFamily: 'Montserrat_700Bold',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: '700',
        fontSize: 39,
        fontStyle: 'normal',
        lineHeight: 175,
        display: 'flex',
        textAlign: 'center',
        top: 325,
        left: 27,
        height: 172,
        width: 331,
        position: 'absolute',
        color: '#F96332',
        alignSelf: 'center'
    }
});