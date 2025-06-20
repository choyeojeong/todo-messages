// src/utils/firebaseClient.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCTkBnm92kg4MGE_nifBVJMjkSZ9CT11Ms",
  authDomain: "todo-messages.firebaseapp.com",
  projectId: "todo-messages",
  storageBucket: "todo-messages.firebasestorage.app",
  messagingSenderId: "430804742701",
  appId: "1:430804742701:web:db5dcc339552757d8f7ea4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
