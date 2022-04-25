
import React from "react";
import { View, StyleSheet, Text, SafeAreaView, ImageBackground } from "react-native";
import MyButton from '../components/MyButton';
import food from '../assets/food.png';
import { useFonts, CinzelDecorative_400Regular, CinzelDecorative_700Bold, } from '@expo-google-fonts/cinzel-decorative';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat'
import AppLoading from "expo-app-loading";
import colors from '../config/colors';


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
                <View style={{justifyContent:'space-between', padding:40}}>
                    <Text style={styles.fixToText}>EWM</Text>
                    <Text style={styles.text1}>EAT WITH ME</Text>
                </View>
                <MyButton type="primary" text="Login" size="large" onPressFn={() => navigation.navigate("LogIn")} />
                <View style={{ height: 20 }} />
                <MyButton type="secondary" text="Sign Up" size="large" onPressFn={() => navigation.navigate("SignUp")} />
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        padding: 40,
        flex: 1,
        flexDirection: 'column'

    },
    
    fixToText: {
        fontFamily: 'CinzelDecorative_700Bold',
        fontWeight: '700',
        fontSize: 121,
        color: 'white',
        textShadowColor: colors.primary,
        textShadowOffset:{width:1.5,height:1.5},
        textAlign:'center'
    },
    text1: {
        fontFamily: 'Montserrat_700Bold',
        fontWeight: '700',
        fontSize: 40,
        textAlign: 'center',
        color: colors.primary,
        textShadowColor: 'white',
        textShadowOffset:{width:1.5,height:1.5}
        
    },
    
});