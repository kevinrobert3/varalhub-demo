import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB2JDSqIwtCDM3MrlA0DJWlniR3TmtFv9g",
    authDomain: "varalhub-demo.firebaseapp.com",
    projectId: "varalhub-demo",
    storageBucket: "varalhub-demo.appspot.com",
    messagingSenderId: "980373006796",
    appId: "1:980373006796:web:3f5c106ea5c7b3f2281569"
  };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth };


