import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, ImageBackground, Alert, Modal, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MyButton from '../components/MyButton';
import MyField from '../components/MyField';
import food from '../assets/food.png';
import { logInWithEmail, getFirstName } from '../services/firebase';


type ScreenProps = {
  navigation: any
}

export default function LogInScreen({ navigation }: ScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      {/* login error modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {Alert.alert("Modal has been closed."); setModalVisible(!modalVisible);}}>
        <View style={[styles.container, {padding:40, justifyContent:"space-evenly",alignSelf:"center"}]}  >
            <Text>Incorrect Username or Password!</Text>
            <MyButton text="Try Again" type="primary" onPressFn={() => setModalVisible(!modalVisible)}/>
        </View>
      </Modal>
      
      <StatusBar style="light" />
      <ImageBackground source={food} style={{ width: '100%', height: '110%', justifyContent: 'center', alignItems: 'center' }}>
      
        <View style={styles.container}>
          <MyField title='Email' showText= "test@gmail.com" type='text' onChangeFn={setEmail} />
          <MyField title='Password' type='text' showText= "Password" secure={true} onChangeFn={setPassword} />
          <MyButton text="Log In" type="primary" size="large" onPressFn={async () => {
            let result = await logInWithEmail(email, password);
            if (result === 'success') {
              let firstName = await getFirstName();
              navigation.navigate("Home", { firstName: firstName, email: email });
            }
            else{
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
    justifyContent: 'center',
    backgroundColor: 'white',
    alignSelf: 'center',
    position: 'absolute',
    borderRadius: 20,
  },
  
});