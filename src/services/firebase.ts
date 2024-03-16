import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, where, query } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const addSubscriber = async (email: string) => { 
  await addDoc(collection(db, 'subscribers'), {
    email,
    status: 'ACTIVE'
  });
}

export const isSubscribedAlready = async (email: string) => {
  const querySnapshot = await getDocs(
    query(collection(db, 'subscribers'), where('email', '==', email))
  );

  return !querySnapshot.empty;
}