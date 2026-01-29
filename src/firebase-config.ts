import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 👇 AQUI: Adicionei o 'export' para o main.ts conseguir usar essa configuração
export const firebaseConfig = {
  apiKey: "AIzaSyCb4xuxWrCGNuFM8yAFVPXvI7K35LX9WCE",
  authDomain: "louvores-gpv.firebaseapp.com",
  projectId: "louvores-gpv",
  storageBucket: "louvores-gpv.firebasestorage.app",
  messagingSenderId: "876395905450",
  appId: "1:876395905450:web:deba8f7763c562aec42bd3"
};

// Inicialização "manual" para os serviços que usam 'db' e 'auth' diretamente
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);