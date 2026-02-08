import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { SongService, Song } from '../../services/song.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative flex min-h-screen w-full flex-col overflow-x-hidden transition-colors duration-300 font-display">
      
      <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary/10 px-4 sm:px-10 py-3 transition-all duration-300">
        <div class="mx-auto max-w-7xl flex items-center justify-between">
          <div class="flex items-center gap-4">
            <img src="logo.png" alt="Logo PIB" class="h-20 md:h-24 w-auto object-contain hover:scale-105 transition-transform drop-shadow-sm py-1 cursor-pointer" routerLink="/">
            <div class="flex flex-col leading-tight justify-center">
              <h2 class="text-primary text-xl font-black tracking-tight cursor-pointer" routerLink="/">PIB CROATÁ</h2>
              <span class="text-[11px] text-gray-500 font-bold tracking-widest uppercase">Ministério de Louvor</span>
            </div>
          </div>
          
          <nav class="hidden md:flex items-center gap-8">
            <a routerLink="/" class="text-sm font-bold text-primary cursor-default">Início</a>
            <a routerLink="/services" class="text-sm font-medium text-gray-600 hover:text-primary transition-colors duration-200">Cultos</a>
            <a routerLink="/repertoire" class="text-sm font-medium text-gray-600 hover:text-primary transition-colors duration-200">Repertório</a>
            <a routerLink="/stats" class="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors duration-200 flex items-center gap-1"><span class="material-symbols-outlined text-[18px]">equalizer</span> Estatísticas</a>
            <a routerLink="/about" class="text-sm font-medium text-gray-600 hover:text-primary transition-colors duration-200">Sobre Nós</a>
          </nav>
          
          <div class="flex items-center gap-2 md:hidden">
            @if (deferredPrompt) {
              <button (click)="installPwa()" class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors focus:outline-none animate-pulse border border-green-200 shadow-sm">
                <span class="material-symbols-outlined">download</span>
              </button>
            }
            <button (click)="toggleMobileMenu()" class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none">
              <span class="material-symbols-outlined">{{ isMobileMenuOpen() ? 'close' : 'menu' }}</span>
            </button>
          </div>
          
          <div class="hidden md:flex items-center gap-4">
            @if (auth.currentUser()) {
              <button (click)="songService.downloadBackup()" class="inline-flex items-center gap-2 justify-center rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-200 transition-all duration-200 cursor-pointer border border-gray-200" title="Baixar Backup dos Dados">
                 <span class="material-symbols-outlined text-lg">save</span>
              </button>
            }

            <button (click)="enableNotifications()" class="inline-flex items-center gap-2 justify-center rounded-lg bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm hover:bg-blue-100 transition-all duration-200 cursor-pointer border border-blue-200" title="Receber novidades">
               <span class="material-symbols-outlined text-lg">notifications_active</span>
               Avisos
            </button>

            @if (deferredPrompt) {
              <button (click)="installPwa()" class="inline-flex items-center gap-2 justify-center rounded-lg bg-green-50 px-4 py-2 text-sm font-bold text-green-700 shadow-sm hover:bg-green-100 transition-all duration-200 cursor-pointer border border-green-200">
                <span class="material-symbols-outlined text-lg">download</span>
                Instalar App
              </button>
            }

            <button (click)="handleAuth()" class="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2 text-sm font-bold text-white shadow-sm hover:opacity-90 transition-all duration-200 cursor-pointer">
              {{ auth.currentUser() ? 'Sair' : 'Área da Liderança' }}
            </button>
          </div>
        </div>

        @if (isMobileMenuOpen()) {
          <div class="md:hidden absolute top-full left-0 right-0 bg-white border-b border-primary/10 shadow-xl animate-[slideIn_0.2s_ease-out]">
            <nav class="flex flex-col p-4 gap-2">
              @if (deferredPrompt) {
                <button (click)="installPwa()" class="w-full p-3 mb-2 rounded-xl bg-green-50 text-green-700 font-bold text-center border border-green-200 flex items-center justify-center gap-2 shadow-sm">
                   <span class="material-symbols-outlined">download</span> Instalar Aplicativo
                </button>
              }

              <button (click)="enableNotifications(); toggleMobileMenu()" class="w-full p-3 mb-2 rounded-xl bg-blue-50 text-blue-700 font-bold text-center border border-blue-200 flex items-center justify-center gap-2 shadow-sm">
                  <span class="material-symbols-outlined">notifications_active</span> Ativar Notificações
              </button>
              
              @if (auth.currentUser()) {
                <button (click)="songService.downloadBackup(); toggleMobileMenu()" class="w-full p-3 mb-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-center border border-gray-200 flex items-center justify-center gap-2 shadow-sm">
                  <span class="material-symbols-outlined">save</span> Fazer Backup dos Dados
                </button>
              }

              <a routerLink="/" (click)="toggleMobileMenu()" class="p-3 rounded-xl hover:bg-gray-50 text-primary font-bold transition-colors">Início</a>
              <a routerLink="/services" (click)="toggleMobileMenu()" class="p-3 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-primary transition-colors">Cultos</a>
              <a routerLink="/repertoire" (click)="toggleMobileMenu()" class="p-3 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-primary transition-colors">Repertório</a>
              <a routerLink="/stats" (click)="toggleMobileMenu()" class="p-3 rounded-xl hover:bg-orange-50 text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-2"><span class="material-symbols-outlined">equalizer</span> Estatísticas</a>
              <a routerLink="/about" (click)="toggleMobileMenu()" class="p-3 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-primary transition-colors">Sobre Nós</a>
              
              <div class="h-px bg-gray-100 my-1"></div>
              
              <button (click)="handleAuth(); toggleMobileMenu()" class="w-full p-3 rounded-xl bg-gray-900 text-white font-bold text-center shadow-sm">
                 {{ auth.currentUser() ? 'Sair' : 'Área da Liderança' }}
              </button>
            </nav>
          </div>
        }
      </header>

      <main class="flex-grow pt-28">
        <section class="relative flex flex-col items-center justify-center pt-12 pb-24 px-4 sm:px-6 lg:px-8 bg-hero-pattern">
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 pointer-events-none"></div>
          <div class="relative z-10 mx-auto max-w-4xl text-center flex flex-col items-center gap-8">
            
            <div class="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-bold text-green-700 ring-1 ring-inset ring-green-600/20 uppercase tracking-wide">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Portal Oficial
            </div>

            <h1 class="text-4xl font-black leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:leading-[1.1]">
              Adore com a gente <br class="hidden md:block"/>
              <span class="text-primary relative inline-block">
                em espírito e verdade
                <svg class="absolute -bottom-2 left-0 w-full h-3 text-primary/30" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" stroke-width="3"></path>
                </svg>
              </span>
            </h1>

            <p class="max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
              Bem-vindo à Primeira Igreja Batista em Croatá. Acompanhe nossas escalas, aprenda os louvores e participe dos nossos cultos.
            </p>

            @if (auth.currentUser()) {
              <div class="w-full max-w-sm mx-auto my-2 animate-[fadeIn_0.5s_ease-out]">
                @if (!suggestionState().song) {
                  <button (click)="generateSuggestion()" class="w-full group relative flex flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 p-4 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95">
                    <div class="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10 blur-xl"></div>
                    <div class="absolute -left-4 -bottom-4 h-16 w-16 rounded-full bg-white/10 blur-xl"></div>
                    
                    <span class="material-symbols-outlined text-3xl mb-1 animate-bounce">casino</span>
                    <h3 class="font-black text-lg">Me Ajuda, Deus! 🎲</h3>
                    <p class="text-white/80 text-xs font-medium">Sortear louvor esquecido</p>
                  </button>
                } @else {
                  <div class="relative w-full rounded-xl bg-white p-5 shadow-xl border border-green-100 ring-4 ring-green-50 text-left animate-[scaleIn_0.3s_ease-out]">
                    <div class="absolute top-4 right-4 text-green-200">
                      <span class="material-symbols-outlined text-3xl">lightbulb</span>
                    </div>
                    
                    <p class="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Sugestão de Resgate</p>
                    <h3 class="text-xl font-black text-gray-900 mb-0.5 leading-tight truncate">{{ suggestionState().song?.title }}</h3>
                    <p class="text-xs font-bold text-gray-500 mb-3 truncate">{{ suggestionState().song?.artist }}</p>
                    
                    <div class="bg-green-50 rounded-lg p-2.5 mb-3 border border-green-100">
                      <p class="text-green-800 text-xs font-medium flex items-center gap-2">
                        <span class="material-symbols-outlined text-base">history</span>
                        {{ suggestionState().reason }}
                      </p>
                    </div>

                    <div class="flex gap-2">
                      <button (click)="generateSuggestion()" class="flex-1 py-2 rounded-lg bg-gray-100 text-gray-600 font-bold text-xs hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                        <span class="material-symbols-outlined text-base">refresh</span> Outra
                      </button>
                      <a routerLink="/repertoire" class="flex-1 py-2 rounded-lg bg-green-600 text-white font-bold text-xs hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-1">
                        Ver Letra <span class="material-symbols-outlined text-base">arrow_forward</span>
                      </a>
                    </div>
                  </div>
                }
              </div>
            }

            <div class="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4 flex-wrap">
              <button routerLink="/services" class="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:bg-primary-hover hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <span class="material-symbols-outlined">calendar_month</span>
                <span>Ver Agenda de Cultos</span>
              </button>
              
              <button routerLink="/repertoire" class="flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-gray-700 shadow-lg ring-1 ring-inset ring-gray-200 transition-all duration-300 hover:bg-gray-50 hover:text-primary hover:scale-105 hover:shadow-xl">
                <span class="material-symbols-outlined">library_music</span>
                Repertório
              </button>

              <button routerLink="/stats" class="flex items-center justify-center gap-2 rounded-xl bg-orange-50 px-8 py-4 text-base font-bold text-orange-600 shadow-lg ring-1 ring-inset ring-orange-200 transition-all duration-300 hover:bg-orange-100 hover:text-orange-700 hover:scale-105 hover:shadow-xl">
                <span class="material-symbols-outlined">equalizer</span>
                Ranking
              </button>
            </div>
          </div>

          <div class="relative mt-16 w-full max-w-5xl mx-auto px-4">
            <div class="relative rounded-2xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-3xl lg:p-4">
              <div class="overflow-hidden rounded-xl bg-white shadow-2xl border border-gray-100 relative aspect-[16/9] md:aspect-[21/9] flex items-center justify-center bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAqWg9vaHjwO3kSoP6lhHDdrObQ7BRnHQue95LVR-bq4-fOTsdjV_ApaaS0TZJAxIxklQgS4u4_y6eDX3Cec7HjCTmZzbiZUSg_8uk-Kp_mIXsnxEYQkd05_agNiw0caZzPsSb6mmzQwH-CRW3XpCsQBk0f78l9t5oF1Ei587bO4QBGMwh0XrQguGts9KqIWukcewXddgbIQ-r7SQ1KvAYIgkZdpfn3QCtgNyU8JSy1xm3EqbQEOucOq_EzkwubNnO4DM6cuR5O7eX6');">
                <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                
                <div class="absolute inset-0 flex items-center justify-center p-4 overflow-hidden">
                  <div class="grid grid-cols-3 gap-4 md:gap-6 min-w-[700px] md:min-w-0 md:w-full max-w-4xl scale-[0.42] md:scale-110 origin-center transition-transform">
                    <div class="flex flex-col gap-3 p-5 bg-white/95 backdrop-blur rounded-xl shadow-xl transform rotate-[-6deg] translate-y-4 hover:rotate-0 transition-transform duration-500 border border-white/20">
                      <div class="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary"><span class="material-symbols-outlined text-sm">music_note</span></div>
                      <div class="space-y-2"><div class="h-2 w-16 bg-gray-200 rounded"></div><div class="h-4 w-3/4 bg-gray-800 rounded"></div></div>
                      <div class="mt-2 h-1 w-full bg-primary rounded-full"></div>
                    </div>
                    
                    <div class="flex flex-col gap-4 p-6 bg-white/100 backdrop-blur-xl rounded-2xl shadow-2xl z-10 border border-gray-100">
                      <div class="flex items-center justify-between border-b border-gray-100 pb-3"><span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Culto de Domingo</span><span class="h-2 w-2 rounded-full bg-green-500"></span></div>
                      <div class="space-y-3">
                        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"><span class="text-gray-400 font-mono text-xs">01</span><div class="flex-1"><div class="text-sm font-bold text-gray-800">Grande é o Senhor</div><div class="text-xs text-gray-500">Tom: G</div></div><span class="material-symbols-outlined text-gray-400 text-sm">drag_handle</span></div>
                        <div class="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/10 cursor-pointer"><span class="text-primary font-mono text-xs">02</span><div class="flex-1"><div class="text-sm font-bold text-gray-800">Caminho no Deserto</div><div class="text-xs text-primary">Tom: A • Ativo</div></div><span class="material-symbols-outlined text-primary text-sm">equalizer</span></div>
                        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"><span class="text-gray-400 font-mono text-xs">03</span><div class="flex-1"><div class="text-sm font-bold text-gray-800">Bondade de Deus</div><div class="text-xs text-gray-500">Tom: D</div></div><span class="material-symbols-outlined text-gray-400 text-sm">drag_handle</span></div>
                      </div>
                    </div>
                    
                    <div class="flex flex-col gap-3 p-5 bg-white/95 backdrop-blur rounded-xl shadow-xl transform rotate-[6deg] translate-y-4 hover:rotate-0 transition-transform duration-500 border border-white/20">
                      <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><span class="material-symbols-outlined text-sm">group</span></div>
                      <div class="space-y-2"><div class="h-2 w-12 bg-gray-200 rounded"></div><div class="h-4 w-2/3 bg-gray-800 rounded"></div></div>
                      <div class="mt-2 flex -space-x-2"><div class="h-6 w-6 rounded-full bg-gray-300 border-2 border-white"></div><div class="h-6 w-6 rounded-full bg-gray-400 border-2 border-white"></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute -top-12 -left-12 -z-10 h-[300px] w-[300px] rounded-full bg-primary/20 blur-3xl opacity-50"></div>
            <div class="absolute -bottom-12 -right-12 -z-10 h-[300px] w-[300px] rounded-full bg-blue-400/20 blur-3xl opacity-50"></div>
          </div>
        </section>

        <section class="py-24 px-4 bg-white">
          <div class="mx-auto max-w-7xl">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              
              <a routerLink="/services" class="group flex flex-col items-center gap-4 p-8 rounded-3xl bg-white shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-green-100/50 hover:border-green-200 hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden">
                <div class="h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 mb-2 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                  <span class="material-symbols-outlined text-3xl">calendar_month</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">Agenda de Cultos</h3>
                <p class="text-gray-500 leading-relaxed">
                  Confira os dias, horários e quem estará ministrando o louvor em cada culto da nossa igreja.
                </p>
                <span class="text-primary font-bold text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">Ver Agenda →</span>
              </a>

              <a routerLink="/repertoire" class="group flex flex-col items-center gap-4 p-8 rounded-3xl bg-white shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-blue-100/50 hover:border-blue-200 hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden">
                <div class="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-2 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <span class="material-symbols-outlined text-3xl">lyrics</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Nosso Repertório</h3>
                <p class="text-gray-500 leading-relaxed">
                  Acesse as letras, ouça os hinos e aprenda as canções que cantamos em nossa comunidade.
                </p>
                <span class="text-blue-600 font-bold text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">Ver Músicas →</span>
              </a>

              <a routerLink="/stats" class="group flex flex-col items-center gap-4 p-8 rounded-3xl bg-white shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-orange-100/50 hover:border-orange-200 hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden">
                <div class="h-16 w-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mb-2 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <span class="material-symbols-outlined text-3xl">equalizer</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">Mais Tocadas</h3>
                <p class="text-gray-500 leading-relaxed">
                  Veja quais louvores tem marcado nossa história recente através do nosso ranking de execuções.
                </p>
                <span class="text-orange-600 font-bold text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">Ver Ranking →</span>
              </a>

            </div>
          </div>
        </section>
      </main>

      <footer class="border-t border-gray-100 bg-white/50 px-4 py-12">
        <div class="mx-auto max-w-7xl flex flex-col items-center gap-6 text-center">
          <div class="flex items-center gap-2 mb-2">
            <img src="logo.png" alt="Logo PIB" class="h-16 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
            <span class="font-bold text-gray-900 tracking-widest uppercase">PIB CROATÁ</span>
          </div>
          
          <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <a routerLink="/about" class="text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer">Sobre Nós</a>
            <a routerLink="/about" class="text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer">Localização</a>
            <a routerLink="/about" class="text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer">Contato</a>
          </div>
          
          <p class="text-sm text-gray-400">© 2026 Primeira Igreja Batista em Croatá. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  `
})
export class HomeComponent implements OnInit {
  auth = inject(AuthService);
  router = inject(Router);
  notificationService = inject(NotificationService);
  songService = inject(SongService); 
  
  isMobileMenuOpen = signal(false);
  deferredPrompt: any = null;

  // Estado da Sugestão (Me Ajuda, Deus!)
  suggestionState = signal<{song: Song | null, reason: string}>({ song: null, reason: '' });

  isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  constructor() {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme'); 
  }

  ngOnInit() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
  }

  installPwa() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        this.deferredPrompt = null;
      });
    }
  }

  enableNotifications() {
    if (this.isIOS && !this.isStandalone) {
      alert('⚠️ No iPhone, você precisa instalar o App primeiro!\n\n1. Toque no botão "Compartilhar" (quadrado com seta) do navegador.\n2. Escolha "Adicionar à Tela de Início".\n3. Abra o app novo que apareceu e tente de novo.');
      return; // Para tudo por aqui
    }
    this.notificationService.requestPermission();
  }

  handleAuth() {
    if (this.auth.currentUser()) {
      this.auth.logout(); 
    } else {
      this.router.navigate(['/login']);
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(val => !val);
  }

  // --- LÓGICA DO SORTEIO (ME AJUDA, DEUS!) 🎲 ---
  generateSuggestion() {
    const allSongs = this.songService.songs();
    const allCultos = this.songService.cultos();
    const today = new Date();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(today.getDate() - 90); // 90 dias atrás

    // 1. Mapear última data de cada música
    const lastDates = new Map<string, Date>();
    
    // Como cultos estão ordenados por data (desc), a primeira vez que vemos a música é a última vez que tocou
    for (const culto of allCultos) {
      const cultoDate = new Date(culto.date + 'T12:00:00'); // Compensar fuso
      for (const songId of culto.songIds) {
        if (!lastDates.has(songId)) {
          lastDates.set(songId, cultoDate);
        }
      }
    }

    // 2. Filtrar "Esquecidas"
    const candidates = allSongs.filter(song => {
      const lastDate = lastDates.get(song.id);
      // Se nunca tocou OU tocou antes de 90 dias atrás
      return !lastDate || lastDate < ninetyDaysAgo;
    });

    if (candidates.length === 0) {
      this.suggestionState.set({ song: null, reason: 'O repertório está super em dia! Parabéns!' });
      alert('Parabéns! Nenhuma música está esquecida (todas foram tocadas nos últimos 3 meses).');
      return;
    }

    // 3. Sorteio Aleatório
    const winner = candidates[Math.floor(Math.random() * candidates.length)];
    const lastDate = lastDates.get(winner.id);
    
    let reason = '';
    if (!lastDate) reason = 'Nunca foi tocada nos cultos registrados.';
    else {
      // Diferença em dias
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      reason = `Não é tocada há ${diffDays} dias (desde ${lastDate.toLocaleDateString('pt-BR')}).`;
    }

    this.suggestionState.set({ song: winner, reason });
  }
}