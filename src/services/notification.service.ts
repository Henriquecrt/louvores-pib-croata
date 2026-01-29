import { Injectable, inject } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { inject as injectAuth } from '@angular/core'; // Ajuste conforme seu projeto

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messaging = inject(Messaging);
  
  // Chave VAPID (Você pega isso no Console do Firebase > Engajamento > Cloud Messaging)
  private vapidKey = 'SUA_CHAVE_VAPID_DO_FIREBASE_CONSOLE';

  constructor() {
    this.listenToMessages();
  }

  async requestPermission() {
    console.log('Pedindo permissão...');
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('Permissão concedida!');
        
        // Pega o TOKEN único deste celular
        const token = await getToken(this.messaging, { vapidKey: this.vapidKey });
        console.log('Token do dispositivo:', token);
        
        // AQUI VOCÊ SALVARIA ESSE TOKEN NO BANCO DE DADOS
        // Ex: updateDoc(userRef, { fcmToken: token });
        
        return token;
      } else {
        console.log('Permissão negada');
        return null;
      }
    } catch (error) {
      console.error('Erro ao pegar permissão', error);
      return null;
    }
  }

  // Escuta mensagens quando o app está ABERTO na tela
  listenToMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('Mensagem recebida com app aberto:', payload);
      // Aqui você pode disparar um Toast (aquele verde que criamos)
      // Ex: toast.show(payload.notification.title, payload.notification.body)
    });
  }
}