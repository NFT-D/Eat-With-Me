import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from 'firebase-admin';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from 'react';
import uuid from "uuid";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: Constants.manifest?.extra?.firebaseApiKey,
    authDomain: Constants.manifest?.extra?.firebaseAuthDomain,
    projectId: Constants.manifest?.extra?.firebaseProjectId,
    storageBucket: Constants.manifest?.extra?.firebaseStorageBucket,
    messagingSenderId: Constants.manifest?.extra?.firebaseMessagingSenderId,
    appId: Constants.manifest?.extra?.firebaseAppId,
};

// // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// // const auth = getAuth(app);
// // let user = auth.currentUser;

let folder = '';

export const pickImage = async (folderPath: string) => {
    folder = folderPath;
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
    });
    console.log(pickerResult);
    return handleImpagePicked(pickerResult);
};

const handleImpagePicked = async (pickerResult) => {
    var state = null;
    try {
        state = { uploading: true };

        if (!pickerResult.cancelled) {
            const uploadUrl = await uploadImageAsync(pickerResult.uri);
            state = { image: uploadUrl };
            return uploadUrl;
        }
    } catch (e) {
        console.log(e);
        alert("Upload failed, sorry :(");
    } finally {
        state = { uploading: false };
    }
};

const uploadImageAsync = async (uri) => {
    const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
    });

    const fileRef = ref(getStorage(), folder + '/' + uuid.v4());
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    // blob.close();

    return await getDownloadURL(fileRef);
};
