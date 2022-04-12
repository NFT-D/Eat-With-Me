import { SafeAreaView, View, TouchableOpacity, Text, TextInput, Image, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import MyButton from '../components/MyButton';
import colors from '../config/colors';
import MyField from '../components/MyField';
import React, { useState } from 'react';
import food from '../assets/pizza.png';
import location from '../assets/location.png';
import { getEvent } from '../services/firebase';

type ScreenProps = {
  navigation: any
}

export default function ViewMealScreen({ navigation }: ScreenProps) {
  const [eventName, enterEvent] = useState("");
    return (
      <ScrollView style={{backgroundColor: 'white'}}>
            <ImageBackground source={food} style={[styles.columnContainer, {width: '100%', height: '80%', top: -20}]}> 

          <View style={{ top: 150, alignItems: 'center', padding: 15 }}>
              <Text style={styles.whiteTextBold}>Homemade Pizza</Text>
              <Text style={styles.gray_whiteTextBold}>Hosted by User </Text>
              <View style={[styles.rowContainer, {top:-25}]}>
                <Text style={styles.whiteTextReg}>   7:30 </Text>
                <Text>                     </Text>
                <Text style={styles.whiteTextReg}> 5/6 </Text>
                <Text>                     </Text>
                <Text style={styles.whiteTextReg}> $0 </Text>
              </View>
              <View style={styles.rowContainer}>
                <Text style={styles.white_smallTextReg}> Wed 2/16 </Text>
                <Text>             </Text>
                <Text style={styles.white_smallTextReg}> Seats Available </Text>
                <Text>             </Text>
                <Text style={styles.white_smallTextReg}> Fee </Text>
          </View>
            </View>
            </ImageBackground>
          <View style={{padding:20}}>
          <View style={{alignItems: 'center', justifyContent: 'space-evenly', padding: 20, flex:1, flexDirection: 'row', backgroundColor:'white'}} >
              <MyButton type="primary" size="large" text="Reserve" />
              <MyButton type="icon" text="♥"/>
              <MyButton type="icon" text="✉" />
          </View>
          <View style={{alignItems: 'center', justifyContent: 'space-evenly', padding: 20, flex:1, flexDirection: 'column', backgroundColor:'white'}}>
            <Text style={styles.blackTextBold}>About Meal:</Text>
            <Text style={styles.grayTextReg}>Just a casual get together to meet some new people</Text>
          </View>
          <TouchableOpacity style={{flexDirection:'row', flexWrap:'wrap', width:"100%", padding:15, backgroundColor:'white'}} onPress={() => navigation.navigate("ViewMeal")}>
                    <View style={{flex:.5}} >
                    <Image source={location} style={{height:'20%', width:'20%'}}/>
                    </View>
                    <View style={{flexDirection:'column', padding:10}}>
                        {/*location info*/}
                        <Text>604 River Terrace</Text>
                        <Text>Suite 4</Text>
                        <Text style={{color:colors.primary}}>Get Directions</Text>
                    </View>
            
                </TouchableOpacity>
                </View>
      </ScrollView>
    );
}
const styles = StyleSheet.create({
  rowContainer: {
      alignItems: 'center',
      justifyContent: 'space-evenly',
      padding: 10,
      flex:1,
      flexDirection: 'row'

  },
  columnContainer: {
    backgroundColor:'white',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 20,
    flexDirection: 'column',
    
  },
  whiteTextBold:{
    color:'white',
    fontSize: 40,
    fontWeight:'bold'
  },
  whiteTextReg:{
    color:'white',
    fontSize: 25,
    fontWeight: 'bold'
  },
  gray_whiteTextBold:{
    color:'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle:"italic"
  
  },
  grayTextReg:{
    color:'gray',
    fontSize: 18,
    fontStyle:"italic"
  },
  blackTextBold:{
    color:'black',
    fontSize: 27,
    fontWeight: 'bold'
  },
  white_smallTextReg:{
    color:'white',
    fontSize: 15,
    fontWeight: 'bold'
  }
});