// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, addDoc, collection, query, where, getDocs, getDoc, Timestamp } from 'firebase/firestore';
import Constants from "expo-constants";
import { MutableRefObject, useState } from "react";
import { isEmpty } from "@firebase/util";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: Constants.manifest?.extra?.firebaseApiKey,
    authDomain: Constants.manifest?.extra?.firebaseAuthDomain,
    projectId: Constants.manifest?.extra?.firebaseProjectId,
    storageBucket: Constants.manifest?.extra?.firebaseStorageBucket,
    messagingSenderId: Constants.manifest?.extra?.firebaseMessagingSenderId,
    appId: Constants.manifest?.extra?.firebaseAppId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// AUTHENTICATION // ---------------------------------------------------------
let user = auth.currentUser;

export const signUpWithEmail = async (fName: string, lName: string, email: string, password: string, avatarURL: string) => {
    try {
        let result = await createUserWithEmailAndPassword(auth, email, password);
        user = result.user;
        await updateProfile(user, {
            displayName: fName + " " + lName,
        });
        await addNewUser(fName, lName, email, avatarURL);
        return 'success';
    } catch (e) {
        console.log(e);
        return e;
    }
}

export const logInWithEmail = async (email: string, password: string) => {
    try {
        let result = await signInWithEmailAndPassword(auth, email, password);
        user = result.user;
        return 'success'
    } catch (e) {
        console.log(e);
        return e;
    }
}

export const logOut = async () => {
    try {
        await signOut(auth);
        user = auth.currentUser;
        console.log(user)
        return 'success'
    } catch (e) {
        console.log(e);
    }
}

// FIRESTORE // --------------------------------------------------------------
const addNewUser = async (fName: string, lName: string, email: string, avatarURL: string) => {
    try {
        const userData = {
            first_name: fName,
            last_name: lName,
            email: email,
            avatar: avatarURL
        }
        const docRef = await addDoc(collection(firestore, "users",), userData);
        console.log(docRef.id);
    } catch (e) {
        console.log(e);
    }
}

export const getFirstName = async () => {
    try {
        let firstName = 'Temp';
        const q = query(
            collection(firestore, "users"),
            where("email", "==", user?.email)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // console.log(doc.data()['first_name'])
            firstName = doc.data()['first_name'];
        });
        return firstName;

    } catch (e) {
        console.log(e);
    }
}

// CREATE A MEAL // --------------------------------------------------------------


// export const hostEvent = async (eventName: string, address: string, guest: number, allergen: string, notes: string, duration: number, sDate: Date, fName: string,fee: number, app: Array<any>,ent: Array<any>,des: Array<any>) => {

//     try {
        
//         const mealRef = await addMeal(app, ent, des, allergen);

//         const data = { event: eventName, capacity: guest, attendees: [], fee: fee, location: address, meal: mealRef, date: sDate, note: notes, host: fName }

//         const docRef = await addDoc(collection(firestore, "events"), data);
//         return docRef.id;
//     } catch (e) {
//         console.log(e);
//         return e
//     }
// }
// const addMeal = async (appetizer: Array<any>, entree: Array<any>, dessert: Array<any>, allergen: string) => {

//     try {
        
//         var a = await addDish(appetizer)
//         var b = await addDish(entree)
//         var c = await addDish(dessert)
        
//         console.log(await a[0]);
//         const data = { appetizer: a, entree: b, dessert: c, allergens: allergen }

//         const docRef = await addDoc(collection(firestore, "meals"), data);
//         return docRef.id;
        
//     } catch (e) {
//         console.log(e);
//         return e

//     }


// }

// const addDish = async(dish: Array<any>) => {

//     try {
//         const ary = [];
//         dish.forEach(async function (value) {
//             const data = {name: value[0], image: value[1], ingredient: value[2]};
//             const dishRef = await addDoc(collection(firestore, "dishes"), data);
//             ary.push( dishRef.id);
//           }); 
//         return ary;
//     } catch (e) {
//         console.log(e);
//         return e
//     }
// }







