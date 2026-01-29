import { Injectable, inject, signal } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { ToastService } from './toast.service'; // <--- IMPORTANTE

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messaging = inject(Messaging);
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private toast = inject(ToastService); // <--- Injetando o Toast

  currentMessage = signal<any>(null);

  constructor() {
    this.listenForMessages();
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const vapidKey = 'BPDqHjlPQvo6dscJcPoKVwJNM3hnCrL3WRCLmPZVMSIK4dqMXmbJVvAfGlR_JWcYxlmeBqwmif6wyC-PZzSAp7E'; 

        const token = await getToken(this.messaging, { vapidKey });
        
        if (token) {
          await this.saveTokenPublicly(token);
        }
        
        return token;
      } else {
        // Usa o Toast de Erro
        this.toast.show('Você precisa permitir as notificações no navegador.', 'error');
        return null;
      }
    } catch (error) {
      console.error('Erro ao ativar notificações:', error);
      this.toast.show('Erro técnico ao ativar notificações.', 'error');
      return null;
    }
  }

  listenForMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('📩 Mensagem recebida:', payload);
      this.currentMessage.set(payload);
      // Opcional: Mostrar um toast quando chegar mensagem com o site aberto
      if (payload.notification) {
        this.toast.show(payload.notification.title + ': ' + payload.notification.body, 'info');
      }
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
      
      // ✅ AQUI ESTÁ A MÁGICA: Toast Bonito em vez de Alert
      this.toast.show('Notificações ativadas com sucesso!', 'success');
      
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