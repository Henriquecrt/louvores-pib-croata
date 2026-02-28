import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-install-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (showPrompt) {
      <div class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-[#1a2e1a] border border-primary/20 p-5 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] z-[9999] animate-[slideUp_0.5s_ease-out]">
        
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center gap-3">
            <div class="bg-primary/10 p-2 rounded-xl text-primary">
              <span class="material-symbols-outlined">install_mobile</span>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white text-base leading-tight">Instale o Aplicativo</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Acesso rápido e tela cheia!</p>
            </div>
          </div>
          <button (click)="dismiss()" class="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1 bg-gray-50 dark:bg-white/5 rounded-full">
            <span class="material-symbols-outlined text-[18px] block">close</span>
          </button>
        </div>

        @if (isIOS) {
          <div class="bg-gray-50 dark:bg-black/20 rounded-xl p-3 text-sm text-gray-700 dark:text-gray-300 space-y-3 border border-gray-100 dark:border-white/5 mt-2">
            <p class="flex items-center gap-2">
              <span class="bg-white dark:bg-gray-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border border-gray-100 dark:border-white/10">1</span>
              <span>Toque em <b>Compartilhar</b></span>
              <span class="material-symbols-outlined text-[20px] ml-auto text-blue-500">ios_share</span>
            </p>
            <p class="flex items-center gap-2">
              <span class="bg-white dark:bg-gray-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border border-gray-100 dark:border-white/10">2</span>
              <span>Escolha <b>Adicionar à Tela de Início</b></span>
              <span class="material-symbols-outlined text-[20px] ml-auto text-gray-500 dark:text-gray-400">add_box</span>
            </p>
          </div>
        } @else if (deferredPrompt) {
          <button (click)="installAndroid()" class="w-full mt-2 bg-primary hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-md flex justify-center items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">download</span>
            Instalar Agora
          </button>
        }
      </div>
    }
  `,
  styles: [`
    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class InstallPromptComponent implements OnInit {
  showPrompt = false;
  isIOS = false;
  deferredPrompt: any = null;

  ngOnInit() {
    this.checkIfShouldShow();
  }

  // Captura o evento nativo de instalação do Android/Chrome
  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(e: Event) {
    e.preventDefault(); // Impede o banner feio padrão do Google
    this.deferredPrompt = e; // Guarda o evento para usarmos no nosso botão
    
    // Se não for iOS e o usuário não fechou o aviso antes, mostra nosso pop-up bonitão
    if (!this.isIOS && !localStorage.getItem('pib_app_dismissed_install')) {
       this.showPrompt = true;
    }
  }

  checkIfShouldShow() {
    // 1. O usuário já clicou no "X" para fechar esse aviso antes?
    if (localStorage.getItem('pib_app_dismissed_install')) {
      return;
    }

    // 2. O app JÁ ESTÁ instalado? (Verifica se abriu pelo ícone ou pelo navegador)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandalone) {
      return; // Se já instalou, não mostra nada!
    }

    // 3. É um iPhone/iPad? (A Apple exige instalação manual)
    const userAgent = window.navigator.userAgent.toLowerCase();
    this.isIOS = /iphone|ipad|ipod/.test(userAgent);

    if (this.isIOS) {
      this.showPrompt = true;
    }
  }

  // Esconde o aviso e lembra que o usuário não quer ver de novo
  dismiss() {
    this.showPrompt = false;
    localStorage.setItem('pib_app_dismissed_install', 'true');
  }

  // Dispara a caixinha de instalação nativa do Android
  async installAndroid() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        this.showPrompt = false;
      }
      this.deferredPrompt = null;
    }
  }
}