import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WakeLockService {
  private wakeLock: any = null;
  private isActivated = false;

  constructor() {
    this.init();
  }

  private init() {
    // Verifica se o navegador do celular suporta essa tecnologia
    if (!('wakeLock' in navigator)) return;

    // 1. Tenta ligar a luz no primeiro toque que a pessoa der em QUALQUER lugar do app
    document.addEventListener('click', () => {
      if (!this.isActivated) {
        this.activate();
      }
    }, { once: true }); // O { once: true } garante que só vai executar 1 vez!

    // 2. Se o músico minimizar o app e voltar pro palco, a gente liga a luz de novo
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.isActivated) {
        this.activate();
      }
    });
  }

  private async activate() {
    try {
      // Pede permissão silenciosa pro celular para não apagar a tela
      this.wakeLock = await (navigator as any).wakeLock.request('screen');
      this.isActivated = true;
      console.log('💡 Modo Palco ativado! A tela não vai mais apagar.');
    } catch (err) {
      console.error('Não foi possível travar a tela:', err);
    }
  }
}