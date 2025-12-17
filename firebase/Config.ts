import { initializeApp } from "firebase/app";
import {
    getFirestore,
    Firestore,
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    query,
    orderBy,
    onSnapshot,
    doc,
    deleteDoc,
    updateDoc
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API,
    authDomain: process.env.EXPO_PUBLIC_DOM,
    projectId: process.env.EXPO_PUBLIC_PRID,
    storageBucket: process.env.EXPO_PUBLIC_SB,
    messagingSenderId: process.env.EXPO_PUBLIC_MSID,
    appId: process.env.EXPO_PUBLIC_APPID
};

const app = initializeApp(firebaseConfig)
const firestore: Firestore = getFirestore(app)

const LISTITEMS: string = 'listitems'

export {
    firestore,
    collection,
    addDoc,
    serverTimestamp,
    LISTITEMS,
    getDocs,
    query,
    orderBy,
    onSnapshot,
    doc,
    deleteDoc,
    updateDoc
}