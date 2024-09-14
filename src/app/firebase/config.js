import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC10RETolA-8IhANELBwSvokPPTFtrZQGU",
    authDomain: "expense-app-89b79.firebaseapp.com",
    projectId: "expense-app-89b79",
    storageBucket: "expense-app-89b79.appspot.com",
    messagingSenderId: "209314366381",
    appId: "1:209314366381:web:0443e9f01af6474162d724",
    measurementId: "G-L0V21N66EX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);