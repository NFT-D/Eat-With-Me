import React, { useEffect, useState } from 'react';
import { FlatList,View, Text, StyleSheet, ImageBackground, Image, Alert, SafeAreaView, TextInput, Button, TouchableOpacity, ScrollView } from "react-native";
import colors from "../config/colors";
import MyButton from '../components/MyButton';
// import pizza from '../assets/pizza.png'
// Import the functions you need from the SDKs you need
import { doc, collection, query, where, getDocs, arrayRemove, arrayUnion, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import moment from 'moment';
import { Overlay } from 'react-native-elements';

type ScreenProps = {
    navigation: any,
    route: any
  }

export default function MyProfileScreen({ navigation,route }: ScreenProps) {
    const { firstName,email, firestore} = route.params;

    const [name, setName] = useState("");


    return(


        <Text></Text>
    );

}