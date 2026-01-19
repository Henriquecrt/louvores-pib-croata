import { Injectable, signal } from '@angular/core';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Esse "sinal" guarda quem está logado. Se for null, é visitante.
  currentUser = signal<User | null>(null);

  constructor() {
    // Verifica se já tem alguém logado ao abrir o site
    onAuthStateChanged(auth, (user) => {
      this.currentUser.set(user);
    });
  }

  async login(email: string, pass: string) {
    await signInWithEmailAndPassword(auth, email, pass);
  }

  async logout() {
    await signOut(auth);
  }
}