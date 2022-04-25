import {SafeAreaView, View, TouchableOpacity, Text, TextInput, StyleSheet, ScrollView} from 'react-native';
import colors from '../config/colors';
import MyField from '../components/MyField';
import React, { useRef, useState } from 'react';
import {Overlay } from 'react-native-elements';
import MyButton from '../components/MyButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';

// Your web app's Firebase configuration

type ScreenProps = {
    navigation: any,
    route: any
}



export default function HostMealScreen({ navigation, route }: ScreenProps) {
    const [visible, setVisible] = useState(false);
    const { email,firstName,firestore } = route.params;
    const [event, setEvent] = useState("");
    const [eventID, setEventID] = useState("");
    const [location, enterLoc] = useState("");
    const [guest, enterGuest] = useState(0);
    const [allergens, enterAllergens] = useState("");
    const [notes, enterNotes] = useState("");

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState(null);
    const [show, setShow] = useState(false);
    const [fee, setFee] = useState(0);

    const [duration, setDuration] = useState(null);

    // this will be attached with each input onChangeText
    const [textValue, setTextValue] = useState(''); 
    const [textValue2, setTextValue2] = useState('');
    const [textValue3, setTextValue3] = useState('');
    // our number of inputs, we can add the length or decrease
    const [numInputs, setNumInputs] = useState(0);
    const [numInputs2, setNumInputs2] = useState(0);
    const [numInputs3, setNumInputs3] = useState(0);
    // all our input fields are tracked with this array
    const refInputs = useRef<Array<any>>([]);
    const refInputs2 = useRef<Array<any>>([]);
    const refInputs3 = useRef<Array<any>>([]);

    const hostEvent = async (email: string,eventName: string, address: string, guest: number, allergen: string, notes: string, duration: number, sDate: Date, fName: string,fee: number, app: Array<any>,ent: Array<any>,des: Array<any>) => {

        try {
            
            const mealRef = await addMeal(app, ent, des, allergen);
    
            const data = { HostEmail: email,event: eventName, capacity: guest, attendees: [], fee: fee, location: address, meal: mealRef, date: sDate, note: notes, host: fName, duration: duration }
    
            const docRef = await addDoc(collection(firestore, "events"), data);
            return docRef.id;
        } catch (e) {
            console.log(e);
            return e
        }
    }
    const addMeal = async (appetizer: Array<any>, entree: Array<any>, dessert: Array<any>, allergen: string) => {
    
        try {
            const data = { appetizer: [], entree: [], dessert: [], allergens: allergen }
    
            const docRef = await addDoc(collection(firestore, "meals"), data);
            await addDish(appetizer,docRef.id,"appetizer")
            await addDish(entree,docRef.id,"entree")
            await addDish(dessert,docRef.id,"dessert")
            
            
            return docRef.id;
            
        } catch (e) {
            console.log(e);
            return e
    
        }
    
    
    }
    
    const addDish = async(dish: Array<any>,id: string,meal: string) => {
    
        try {
            dish.forEach(async (value) => {
                const data = { name: value[0], image: value[1], ingredient: value[2] };
                const eventRef = doc(firestore, 'meals', id);
                if (meal == "appetizer"){
                    await updateDoc(eventRef, { appetizer: arrayUnion(data) });
                }
                if (meal == "entree"){
                    await updateDoc(eventRef, { entree: arrayUnion(data) });
                }
                if (meal == "dessert"){
                    await updateDoc(eventRef, { dessert: arrayUnion(data) });
                }
            });
           
            return
        } catch (e) {
            console.log(e);
            return e
        }
    }
    
    
    
    

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const toggleOverlay = () => {
        setVisible(true);
      };
    
    const hostEv = async () => {
        setEventID(await hostEvent(email,event, location, guest, allergens, notes, duration, date, firstName, fee, refInputs.current, refInputs2.current, refInputs3.current))
        toggleOverlay();
    };

    const viewMealE = () => {
        setVisible(false);
        navigation.navigate("ViewMeal", {eventID, firestore })
    };


    const setAppValue = (index: number, value: string) => {
        const inputs = refInputs.current;
        inputs[index][0] = value;
        setTextValue(value)
    }

    const setAppValue2 = (index: number, value: string) => {
        const inputs = refInputs.current;
        inputs[index][1] = value;
        setTextValue(value)
    }

    const setAppValue3 = (index: number, value: string) => {
        const inputs = refInputs.current;
        inputs[index][2] = value;
        setTextValue(value)
    }


    const setEntValue = (index: number, value: string) => {
        const inputs = refInputs2.current;
        inputs[index][0] = value;
        setTextValue2(value)
    }

    const setEntValue2 = (index: number, value: string) => {
        const inputs = refInputs2.current;
        inputs[index][1] = value;
        setTextValue2(value)
    }

    const setEntValue3 = (index: number, value: string) => {
        const inputs = refInputs2.current;
        inputs[index][2] = value;
        setTextValue2(value)
    }

    const setDesValue = (index: number, value: string) => {
        const inputs = refInputs3.current;
        inputs[index][0] = value;
        setTextValue3(value)
    }

    const setDesValue2 = (index: number, value: string) => {
        const inputs = refInputs3.current;
        inputs[index][1] = value;
        setTextValue3(value)
    }

    const setDesValue3 = (index: number, value: string) => {
        const inputs = refInputs3.current;
        inputs[index][2] = value;
        setTextValue3(value)
    }
    


    const addAppInput = () => {
        refInputs.current.push(["","",""]);
        setNumInputs(value => value+1);
    }

    const removeAppInput = (i: number) =>{
        refInputs.current.splice(i,1)[0];
        setNumInputs(value => value -1);
    }

    const addEntInput = () => {
        refInputs2.current.push(["","",""]);
        setNumInputs2(value => value+1);
    }

    const removeEntInput = (i: number) =>{
        refInputs2.current.splice(i,1)[0];
        setNumInputs2(value => value -1);
    }

    const addDesInput = () => {
        refInputs3.current.push(["","",""]);
        setNumInputs3(value => value+1);
    }

    const removeDesInput = (i: number) =>{
        refInputs3.current.splice(i,1)[0];
        setNumInputs3(value => value -1);
    }



    const appInput: JSX.Element[] = [];
    for (let i = 0; i < numInputs;i++){
        appInput.push(
            <View key = {i}>
                <Text>{i + 1}.</Text>
                <TextInput
                    onChangeText={value => setAppValue(i,value)}
                    value ={refInputs.current[i][0]}
                    placeholder="Dish Name"
                />
                <TextInput
                    onChangeText={value => setAppValue2(i,value)}
                    value ={refInputs.current[i][1]}
                    placeholder="Image"
                />
                <TextInput
                    onChangeText={value => setAppValue3(i,value)}
                    value ={refInputs.current[i][2]}
                    placeholder="ingredients seperated by ,"
                />

                <MyButton text="Remove" type="primary" onPressFn={ () => {removeAppInput(i)  }} />
            </View>
        );
    }

    const entInput: JSX.Element[] = [];
    for (let j = 0; j < numInputs2;j++){
        entInput.push(
            <View key = {j}>
                <Text>{j + 1}.</Text>
                <TextInput
                    onChangeText={value => setEntValue(j,value)}
                    value ={refInputs2.current[j][0]}
                    placeholder="Dish Name"
                />
                <TextInput
                    onChangeText={value => setEntValue2(j,value)}
                    value ={refInputs2.current[j][1]}
                    placeholder="Image"
                />
                <TextInput
                    onChangeText={value => setEntValue3(j,value)}
                    value ={refInputs2.current[j][2]}
                    placeholder="ingredients seperated by ,"
                />

                <MyButton text="Remove" type="primary" onPressFn={ () => {removeEntInput(j)  }} />
            </View>
        );
    }

    const desInput: JSX.Element[] = [];
    for (let x = 0; x < numInputs3;x++){
        desInput.push(
            <View key = {x}>
                <Text>{x + 1}.</Text>
                <TextInput
                    onChangeText={value => setDesValue(x,value)}
                    value ={refInputs3.current[x][0]}
                    placeholder="Dish Name"
                />
                <TextInput
                    onChangeText={value => setDesValue2(x,value)}
                    value ={refInputs3.current[x][1]}
                    placeholder="Image"
                />
                <TextInput
                    onChangeText={value => setDesValue3(x,value)}
                    value ={refInputs3.current[x][2]}
                    placeholder="ingredients seperated by ,"
                />

                <MyButton text="Remove" type="primary" onPressFn={ () => {removeDesInput(x)  }} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView>
                    <MyField title="Event Name" showText= "Test's Meal" type="text" secure={false} onChangeFn={setEvent}></MyField>
                    <Text>Select the DATE and TIME for your event</Text>
                    <View style={{ flexDirection: 'row', alignContent:'center' }}>
                        <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 10, padding: 10, alignContent: 'center', alignItems: 'center' }} onPress={() => showMode('date')}>
                            <Text style={{ color: 'white' }}>Select Date</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 10, padding: 10, alignContent: 'center', alignItems: 'center' }} onPress={() => showMode('time')}>
                            <Text style={{ color: 'white' }}>Select Time</Text>
                        </TouchableOpacity>

                    </View>
                    <Text>Date Selected:  {date.toLocaleString()}</Text>
                    
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            display="default"
                            onChange={onChange}
                        />
                    )}
                    
                    <MyButton text="console" type="primary" onPressFn={ ()=>{console.log(refInputs);console.log(refInputs2);console.log(refInputs3);}} />

                    <MyField title="Duration in hours" type="text" showText= "2.5" secure={false} onChangeFn={setDuration} ></MyField>

                    <MyField title="Address" type="text" secure={false} showText= "123 abc St. Hoboken" onChangeFn={enterLoc} ></MyField>

                    <MyField title="How many people are you serving?" type="number" showText= "2" secure={false} onChangeFn={enterGuest} ></MyField>

                    <MyField title="Fee in $" type="text" secure={false} showText= "3.50"  onChangeFn={setFee} ></MyField>

                    <Text>Appetizers</Text>
                    {/* <MyField title="Appetizers (separated by ',')" type="text" showText= "app1,app2, app3" secure={false} onChangeFn={enterAppetizersDish} ></MyField> */}

                    <View>
                        {appInput}
                        <MyButton text="+ Add a new input" type="primary" onPressFn={ () => {addAppInput()}} />
                        {/* <View>
                            <Text>you have answered:</Text>
                            {refInputs.current.map((value,i)=>{
                                return <Text key = {i}>{i+1} - {value[0]}</Text>
                            })}
                        </View> */}
                    </View>


                    <Text>Entrees</Text>
                    {/* <MyField title="Entrees (separated by ',')" type="text" showText= "ent1,ent2, ent3" secure={false} onChangeFn={enterEntreesDish} ></MyField> */}


                    <View>
                        {entInput}
                        <MyButton text="+ Add a new input" type="primary" onPressFn={ () => {addEntInput()}} />
                        {/* <View>
                            <Text>you have answered:</Text>
                            {refInputs2.current.map((value,i)=>{
                                return <Text key = {i}>{i+1} - {value[0]}</Text>
                            })}
                        </View> */}
                    </View>

                    <Text>Desserts</Text>
                    {/* <MyField title="Desserts (separated by ',')" type="text" showText= "des1, des2" secure={false} onChangeFn={enterDessertsDish} ></MyField> */}


                    <View>
                        {desInput}
                        <MyButton text="+ Add a new input" type="primary" onPressFn={ () => {addDesInput()}} />
                        {/* <View>
                            <Text>you have answered:</Text>
                            {refInputs.current.map((value,i)=>{
                                return <Text key = {i}>{i+1} - {value}</Text>
                            })}
                        </View> */}
                    </View>

                    <MyField title="Allergens?" type="text" secure={false} showText= "Dairy" onChangeFn={enterAllergens} ></MyField>

                    <MyField title="Other Notes....." type="text" secure={false} showText= "I have a cat" onChangeFn={enterNotes} ></MyField>

                    <MyButton text="Create Meal" type="primary" size="large" onPressFn={async () => { hostEv() }} />
                    
                    <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>

                        <Text>Meal Created!</Text>
                        <MyButton text="View Meal" type="primary" size="large" onPressFn={ () => {viewMealE()  }} />
                        <MyButton text="Ok" type="primary" size="large" onPressFn={async () => {  navigation.navigate("Home", { firstName })}} />
                    </Overlay>
                    


                </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: colors.secondary,
        alignContent: 'center',
        alignItems:"center",
        padding:10,
        width: '100%',
    },
    
    
}
);