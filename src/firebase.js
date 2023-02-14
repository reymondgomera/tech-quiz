import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { collection, query, where, orderBy, onSnapshot, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';

const firebaseConfig = {
   apiKey: 'AIzaSyALS7AqwSUec5MnHUvVF2O0Es0kvPV4o_Y',
   authDomain: 'techquiz-app.firebaseapp.com',
   projectId: 'techquiz-app',
   storageBucket: 'techquiz-app.appspot.com',
   messagingSenderId: '280308931655',
   appId: '1:280308931655:web:9236bf64a1aca511a2e562',
   measurementId: '${config.measurementId}',
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export {
   db,
   auth,
   collection,
   doc,
   addDoc,
   serverTimestamp,
   query,
   where,
   orderBy,
   onSnapshot,
   onAuthStateChanged,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   updateProfile,
   signOut,
};
