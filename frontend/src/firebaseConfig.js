// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDqh2RXUP9ZE3DzI-S22s6Kka-U5uZESX4",
    authDomain: "sibiuparking-d21d1.firebaseapp.com",
    projectId: "sibiuparking-d21d1",
    storageBucket: "sibiuparking-d21d1.appspot.com",
    messagingSenderId: "45824651200",
    appId: "1:45824651200:web:5a7ea20157f56629102225",
    measurementId: "G-LHM50049L9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);