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
    // Alert 1: Saber se a função começou
    alert('🔄 Iniciando pedido de permissão...'); 
    
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // Alert 2: Permissão dada, tentando pegar token
        alert('✅ Permissão concedida! Gerando token...');
        
        // --- SUA CHAVE VAPID ---
        const vapidKey = 'BPDqHjlPQvo6dscJcPoKVwJNM3hnCrL3WRCLmPZVMSIK4dqMXmbJVvAfGlR_JWcYxlmeBqwmif6wyC-PZzSAp7E'; 

        const token = await getToken(this.messaging, { vapidKey });
        
        if (token) {
          // Alert 3: Token gerado, tentando salvar
          alert('🎟️ Token gerado! Salvando no banco...');
          await this.saveTokenPublicly(token);
        } else {
          alert('⚠️ Ocorreu um erro estranho: Token veio vazio.');
        }
        
        return token;
      } else {
        alert('🚫 Você negou a permissão (ou o iPhone bloqueou). Verifique os Ajustes > Notificações.');
        return null;
      }
    } catch (error: any) {
      // Alert DE ERRO: Aqui vamos descobrir o problema
      console.error('Erro ao ativar:', error);
      alert('❌ ERRO TÉCNICO: ' + (error.message || error));
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
      
      // SUCESSO FINAL
      alert('✅ TUDO CERTO! Você foi registrado no banco de dados.');
      
    } catch (error: any) {
      console.error('Erro no banco:', error);
      alert('❌ ERRO NO BANCO DE DADOS: ' + (error.message || error));
    }
  }

  private getDeviceType() {
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) return 'Android';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
    return 'Desktop';
  }
}