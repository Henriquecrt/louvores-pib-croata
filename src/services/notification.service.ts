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
    try {
      // 1. Pede permissão direto ao navegador (sem avisos antes)
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        
        // --- SUA CHAVE VAPID ---
        const vapidKey = 'BPDqHjlPQvo6dscJcPoKVwJNM3hnCrL3WRCLmPZVMSIK4dqMXmbJVvAfGlR_JWcYxlmeBqwmif6wyC-PZzSAp7E'; 

        // 2. Pega o token silenciosamente
        const token = await getToken(this.messaging, { vapidKey });
        
        if (token) {
          // 3. Salva no banco silenciosamente
          await this.saveTokenPublicly(token);
        }
        
        return token;
      } else {
        // Só avisa se a pessoa negar
        alert('Para receber avisos, você precisa permitir as notificações nas configurações do seu navegador.');
        return null;
      }
    } catch (error) {
      console.error('Erro ao ativar notificações:', error);
      // Opcional: só mostre erro se for algo crítico
      return null;
    }
  }

  listenForMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('📩 Mensagem recebida:', payload);
      this.currentMessage.set(payload);
    });
  }

  private async saveTokenPublicly(token: string) {
    try {
      const subscriberRef = doc(this.firestore, 'subscribers', token);
      const user = this.auth.currentUser;
      
      const data = {
        token: token,
        updatedAt: new Date().toISOString(),
        userUid: user ? user.uid : 'anonimo',
        deviceType: this.getDeviceType()
      };

      await setDoc(subscriberRef, data, { merge: true });
      
      // 4. O ÚNICO ALERTA QUE VAI APARECER: SUCESSO!
      alert('✅ Notificações ativadas! Agora você receberá os avisos da igreja.');
      
    } catch (error) {
      console.error('Erro ao salvar no banco:', error);
    }
  }

  private getDeviceType() {
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) return 'Android';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
    return 'Desktop';
  }
}