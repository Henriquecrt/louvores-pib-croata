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
    console.log('🔔 Solicitando permissão (Modo Público)...');
    
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // --- SUA CHAVE VAPID ---
        const vapidKey = 'BPDqHjlPQvo6dscJcPoKVwJNM3hnCrL3WRCLmPZVMSIK4dqMXmbJVvAfGlR_JWcYxlmeBqwmif6wyC-PZzSAp7E'; 

        const token = await getToken(this.messaging, { vapidKey });
        
        if (token) {
          console.log('🎟️ Token gerado:', token);
          await this.saveTokenPublicly(token);
        }
        
        return token;
      } else {
        alert('Você negou a permissão. Para ativar, acesse as configurações do navegador.');
        return null;
      }
    } catch (error) {
      console.error('❌ Erro ao ativar:', error);
      return null;
    }
  }

  listenForMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('📩 Mensagem recebida:', payload);
      this.currentMessage.set(payload);
    });
  }

  // --- NOVA FUNÇÃO: Salva qualquer pessoa (Logada ou Não) ---
  private async saveTokenPublicly(token: string) {
    try {
      // Usa o próprio token como ID para evitar duplicatas
      const subscriberRef = doc(this.firestore, 'subscribers', token);
      
      const user = this.auth.currentUser;
      
      const data = {
        token: token,
        updatedAt: new Date().toISOString(),
        // Se estiver logado, salva quem é. Se não, salva como "Anônimo"
        userUid: user ? user.uid : 'anonimo',
        deviceType: this.getDeviceType()
      };

      // setDoc com merge: true cria ou atualiza sem apagar
      await setDoc(subscriberRef, data, { merge: true });
      
      console.log('💾 Token salvo na lista pública de inscritos!');
      alert('✅ Avisos Ativados com Sucesso!\nVocê receberá as notificações da igreja.');
      
    } catch (error) {
      console.error('Erro ao salvar token no banco:', error);
      // Se der erro de permissão, é provável que precise ajustar as regras do Firestore
    }
  }

  private getDeviceType() {
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) return 'Android';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
    return 'Desktop';
  }
}