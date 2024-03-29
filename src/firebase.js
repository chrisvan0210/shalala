import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';        // for authentication
import 'firebase/compat/storage';     // for storage
import 'firebase/compat/database';    // for realtime database
import 'firebase/compat/firestore';   // for cloud firestore
import 'firebase/compat/messaging';   // for cloud messaging
import 'firebase/compat/functions';   // for cloud functions
// TODO: Replace the following with your app's Firebase project configuration
  const firebaseApp = {
    apiKey: "AIzaSyCLrpZg6c2ivuz4gACid0ciIteuMJWFajE",
    authDomain: "shalala-1.firebaseapp.com",
    databaseURL: "https://shalala-1.firebaseio.com",
    projectId: "shalala-1",
    storageBucket: "shalala-1.appspot.com",
    messagingSenderId: "76131808097",
    appId: "1:76131808097:web:0bf453c20c1b7d1c5e0b20",
    measurementId: "G-0PDMQV5LQL"
  }
  // Initialize Firebase
  firebase.initializeApp(firebaseApp);

  const db = firebase.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  

  export {db,auth,storage};
  export default firebase;
