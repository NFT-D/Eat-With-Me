// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, addDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import Constants from "expo-constants";

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

export const signUpWithEmail = async (fName: string, lName: string, email:string, password:string) => {
    try {
        let result = await createUserWithEmailAndPassword(auth, email, password);
        user = result.user;
        await updateProfile(user, {
            displayName: fName + " " + lName,
        });
        console.log(user);
        await addNewUser(fName, lName, email);
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
const addNewUser = async (fName: string, lName: string, email: string) => {
    try {
        const userData = {
            first_name: fName,
            last_name: lName,
            email: email
        }
        const docRef = await addDoc(collection(firestore, "users", ), userData);
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
            console.log(doc.data()['first_name'])
            firstName =  doc.data()['first_name'];
        });
        return firstName;

    } catch (e) {
        console.log(e);
    }
}

// CREATE A MEAL // --------------------------------------------------------------


export const hostEvent = async (appetizer: string,entree: string, dessert: string,address:string, guest: number, allergen: string, notes: string, duration: number, sDate: Date) => {
    try {
        const mealRef = await addMeal(appetizer,entree, dessert, allergen);
    
        const data = {capacity: guest, attendees: null, fee: null, location: address, meal: mealRef, date: sDate, note: notes}

        const docRef = await addDoc(collection(firestore, "events"), data);
        console.log(docRef.path);
    } catch (e) {
        console.log(e);
        return e
    }
}
export const addMeal = async(appetizer:string,entree: string, dessert: string, allergen: string) => {

    try {

        var aDish = appetizer.split(",");
        var eDish = entree.split(",");
        var dDish = dessert.split(",");
        var ing = allergen.split(",");

        const data = {Appetizers: aDish, entree: eDish, dessert: dDish, allergens: ing}

        const docRef = await addDoc(collection(firestore, "meals"), data);
        console.log(docRef.path);
        const mealRef = await doc(firestore, 'meals', docRef.id);
        return mealRef;
    } catch (e) {
        console.log(e);
        return e

    }   


}
/*
export const addIngredients = async(allergen: string) => {
    try {
        const data = {name: allergen}

        const docRef = await addDoc(collection(firestore, "ingredients"), data);
        console.log(docRef.path);
        const ingredientRef = doc(firestore, 'ingredients', docRef.id);
        return ingredientRef.id;
    } catch (e) {
        console.log(e);
        return e
    }
}


export const addDish = async(dish: string, allergen: string) => {

    try {
        // const ingredientArray = allergen.split(',');
        const ingredientRefID = await addIngredients(allergen);
        const ingredientRef = doc(firestore, 'ingredients', ingredientRefID)

        const data = {name: dish, ingredients: ingredientRef}

        const docRef = await addDoc(collection(firestore, "dishes"), data);
        console.log(docRef.path);
        const dishRef = doc(firestore, 'dishes', docRef.id);
        return dishRef.id;
    } catch (e) {
        console.log(e);
        return e
    }
}

*/


export const getEvent = async (id: string) => {
    try {
        var meal;
        const eventRef = doc(firestore, 'events', id);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
            console.log('event data', eventSnap.data());
            // console.log('meal', eventSnap.data()['meal']);
            const mealRef = eventSnap.data()['meal'];
            const mealSnap = await getDoc(mealRef);

            if (mealSnap.exists()) {
                console.log('meal data', mealSnap.data());
                meal = mealSnap.data();

                const dishRef = mealSnap.data()['entree'];
                const dishSnap = await getDoc(dishRef);

                const ingredientRef = mealSnap.data()['allergens'];
                const ingredientSnap = await getDoc(ingredientRef);

                if (dishSnap.exists()) {
                    console.log('dish data', dishSnap.data());
                    meal['dish'] = dishSnap.data()['name'];
                } else {
                    console.log('dish not found');
                }

                if (ingredientSnap.exists()) {
                    console.log('ingredient data', ingredientSnap.data());
                    meal['allergen'] = ingredientSnap.data();
                } else {
                    console.log('ingredient not found');
                }
            } else {
                console.log('meal does not exist');
            }
        } else {
            console.log('no such document!');
        }
        // console.log(eventRef.get('meal'));
        return eventRef;
        // const q = query(
        //     collection(firestore, "events"),
        //     where("id", "==", id)
        // );

        // const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doc) => {
        //     console.log(doc.data()['meals'])
        //     meal = doc.data()['meals'];
        // });
        // console.log(meal);
        // return meal;

    } catch (e) {
        console.log(e);
    }
}

