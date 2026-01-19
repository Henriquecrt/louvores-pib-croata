import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // <--- NOVO

const firebaseConfig = {
  apiKey: "AIzaSyCb4xuxWrCGNuFM8yAFVPXvI7K35LX9WCE",
  authDomain: "louvores-gpv.firebaseapp.com",
  projectId: "louvores-gpv",
  storageBucket: "louvores-gpv.firebasestorage.app",
  messagingSenderId: "876395905450",
  appId: "1:876395905450:web:deba8f7763c562aec42bd3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // <--- Exporta o sistema de login