import { Timestamp } from "firebase/firestore"
import React, { useState } from "react";
import { Modal, Alert, View, StyleSheet, Text } from "react-native";
import { Image } from "react-native-elements/dist/image/Image";
import colors from "../config/colors";

export type Props = {
    time?: Timestamp,
    meal?: string,
    maxGuests?: string,
    eventImage?: Image,
    onPressFn?: Function
}

const Confirmation = (props: any) => {
    let primaryContainer = {};
   
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
        style={styles.primaryContainer}
      >
            <Image style={styles.imageStyle} source = {props.eventImage}/>
            <Text style={styles.infoText}> Value:{props.meal}</Text>
            <Text style={styles.infoText}> Value:{props.maxGuests}</Text>
            <Text style={styles.infoText}> Value:{props.time}</Text>
        
        </Modal>
    )
}
export default Confirmation;

const styles = StyleSheet.create({
    primaryContainer: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        width:'70%',
        borderColor: colors.primary,
        borderWidth:.5,
        borderRadius: 20,
        alignContent:'center',
        alignItems:'center',
    },
    imageStyle:{
        height:'100%',
        width:'100%',
        borderTopLeftRadius:20,
        borderBottomLeftRadius:20,

    },
    
    infoText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'left',
        fontSize: 12,
    },
   
});
