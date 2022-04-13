import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MyButton from '../components/MyButton';
import MyField from '../components/MyField';
import food from '../assets/food.png';
import { logInWithEmail, getFirstName } from '../services/firebase';
// import { getFirstName, logInWithEmail } from '../services/firebase';

type ScreenProps = {
  navigation: any
}

export default function LogInScreen({ navigation }: ScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <StatusBar style="light" />
      <ImageBackground source={food} style={{ width: '100%', height: '110%', justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.container}>

          <MyField title='Email' type='text' onChangeFn={setEmail} />
          <MyField title='Password' type='text' secure={true} onChangeFn={setPassword} />
          <MyButton text="Log In" type="primary" size="large" onPressFn={async () => {
            let result = await logInWithEmail(email, password);
            if (result === 'success') {
              let firstName = await getFirstName();
              navigation.navigate("Home", { firstName: firstName });
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
    //flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: 338,
    height: 300,
    alignSelf: 'center',
    position: 'absolute',
    borderRadius: 20,
    padding: 20
  },
});