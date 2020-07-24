import firebase from 'firebase';

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCLrpZg6c2ivuz4gACid0ciIteuMJWFajE",
    authDomain: "shalala-1.firebaseapp.com",
    databaseURL: "https://shalala-1.firebaseio.com",
    projectId: "shalala-1",
    storageBucket: "shalala-1.appspot.com",
    messagingSenderId: "76131808097",
    appId: "1:76131808097:web:0bf453c20c1b7d1c5e0b20",
    measurementId: "G-0PDMQV5LQL"
  })
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db,auth,storage};