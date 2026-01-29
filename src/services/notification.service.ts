import { Injectable, inject, signal } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messaging = inject(Messaging);
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  currentMessage = signal<any>(null);

  constructor() {
    this.listenForMessages();
  }

  async requestPermission() {
    console.log('🔔 Solicitando permissão para notificações...');
    
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('✅ Permissão concedida!');
        
        // --- SUA CHAVE VAPID CONFIGURADA AQUI ---
        const vapidKey = 'BPDqHjlPQvo6dscJcPoKVwJNM3hnCrL3WRCLmPZVMSIK4dqMXmbJVvAfGlR_JWcYxlmeBqwmif6wyC-PZzSAp7E'; 

        const token = await getToken(this.messaging, { vapidKey });
        console.log('🎟️ Token do dispositivo:', token);
        
        if (token) {
          await this.saveTokenToUser(token);
        }
        
        return token;
      } else {
        console.log('🚫 Permissão negada');
        return null;
      }
    } catch (error) {
      console.error('❌ Erro ao ativar notificações:', error);
      return null;
    }
  }

  listenForMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('📩 Nova mensagem recebida (App Aberto):', payload);
      this.currentMessage.set(payload);
      
      // Exemplo: Disparar um alerta simples se quiser
      // alert(payload.notification?.title + ': ' + payload.notification?.body);
    });
  }

  private async saveTokenToUser(token: string) {
    const user = this.auth.currentUser;
    if (user) {
      // Salva o token no documento do usuário (coleção 'users')
      const userRef = doc(this.firestore, 'users', user.uid);
      await setDoc(userRef, { fcmToken: token }, { merge: true });
      console.log('💾 Token salvo no perfil do usuário!');
    }
  }
}