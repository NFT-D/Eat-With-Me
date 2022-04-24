import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, SafeAreaView, ImageBackground, Alert, Modal,Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MyButton from '../components/MyButton';
import MyField from '../components/MyField';
import { getFirstName, signUpWithEmail } from '../services/firebase';
import colors from '../config/colors';
import food from '../assets/food.png';
import { pickImage } from '../helpers/upload-image';


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

          <MyField title='First Name' type='text' onChangeFn={setFName} />
          <MyField title='Last Name' type='text' onChangeFn={setLName} />
          <MyField title='Email' type='text' onChangeFn={setEmail} />
          <MyField title='Password' type='text' secure={true} onChangeFn={setPassword} />
          <MyButton text='Upload Picture' type='primary' onPressFn={ async() => {
            let image = await pickImage('avatars');
            setAvatarURL(image);
          }} />
          <MyButton text="Sign Up" type="primary" size="large" onPressFn={async () => {
            let result = await signUpWithEmail(fName, lName, email, password, avatarURL);
            if (result === 'success') {
              let firstName = await getFirstName();
              navigation.navigate("Home", { firstName: firstName });
            }
            else {
              setModalVisible(true);
            }
          }} />
          <View style={{ height: Dimensions.get('screen').width * 0.05 }}></View>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: 338,
    height: 500,
    alignSelf: 'center',
    position: 'absolute',
    borderRadius: 20,
  },
});