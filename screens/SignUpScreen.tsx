import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, ImageBackground, Alert, Modal,Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MyButton from '../components/MyButton';
import MyField from '../components/MyField';
import { getFirstName, signUpWithEmail } from '../services/firebase';
import food from '../assets/food.png';
import { pickImage } from '../helpers/upload-image';

import { BottomSheet } from 'react-native-elements';
import { color } from 'react-native-elements/dist/helpers';
import colors from "../config/colors";

type ScreenProps = {
  navigation: any
}

export default function SignUpScreen({ navigation }: ScreenProps) {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      {/* sign up error modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {Alert.alert("Modal has been closed."); setModalVisible(!modalVisible);}}>
        <View style={styles.container} >
            <Text>Account Not Created</Text>
            <Text>Invalid Submission(s)</Text>
            <MyButton text="try again" type="primary" onPressFn={() => setModalVisible(!modalVisible)}/>
        </View>
      </Modal>
      <StatusBar style="light" />
      <ImageBackground source={food} style={{ width: '100%', height: '110%', justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.container}>

          <MyField title='First Name' showText= "George" type='text' onChangeFn={setFName} />
          <MyField title='Last Name' type='text' showText= "Washington" onChangeFn={setLName} />
          <Text style={{color: colors.primary}}>____________________________</Text>
          <MyField title='Email' type='text' showText= "abc123@gmail.com" onChangeFn={setEmail} />
          <MyField title='Password' type='text' showText= "Password" secure={true} onChangeFn={setPassword} />
          {/* <MyButton text='Upload Picture' type='primary' onPressFn={ async() => {
            let image = await pickImage('avatars');
            setAvatarURL(image);
          }} /> */}
          <MyButton text="Sign Up" type="primary" size="large" onPressFn={async () => {
              let result = await signUpWithEmail(fName, lName, email, password, avatarURL);
              if (result === 'success') {
                let firstName = await getFirstName();
                navigation.navigate("Home", { firstName: firstName, email: email });
              }
              else {
                setModalVisible(true);
              }
            }} />
          <View style={{ height: Dimensions.get('screen').width * 0.02 }}></View>
          
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    //justifyContent: 'center',
    backgroundColor: 'white',
    alignSelf: 'center',
    position: 'absolute',
    borderRadius: 20,
    width: 338,
    height:577,
    justifyContent: 'space-around',
  },
});