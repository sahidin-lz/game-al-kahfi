import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAaqjX1rsjAFjhWK7v3qC9ZW6Z-POwzKr0",
  authDomain: "game-al-kahfi.firebaseapp.com",
  projectId: "game-al-kahfi",
  storageBucket: "game-al-kahfi.firebasestorage.app",
  messagingSenderId: "715435620340",
  appId: "1:715435620340:web:ed423c849d47a7c28c6ba1",
  measurementId: "G-EVBD4EQ5EB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });