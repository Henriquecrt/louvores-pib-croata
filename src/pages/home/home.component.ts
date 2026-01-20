import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative flex min-h-screen w-full flex-col overflow-x-hidden transition-colors duration-300 font-display">
      
      <header class="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-primary/10 px-4 sm:px-10 py-2 transition-all duration-300">
        <div class="mx-auto max-w-7xl flex items-center justify-between">
          <div class="flex items-center gap-4">
            
            <img src="logo.png" alt="Logo PIB" class="h-20 md:h-24 w-auto object-contain hover:scale-105 transition-transform drop-shadow-sm py-1">
            
            <div class="flex flex-col leading-tight justify-center">
              <h2 class="text-primary text-xl font-black tracking-tight">PIB CROATÁ</h2>
              <span class="text-[11px] text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase">Ministério de Louvor</span>
            </div>
          </div>
          
          <nav class="hidden md:flex items-center gap-8">
            <a routerLink="/" class="text-sm font-bold text-primary cursor-default">Início</a>
            <a routerLink="/services" class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200">Cultos</a>
            <a routerLink="/repertoire" class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200">Repertório</a>
            <a routerLink="/stats" class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200 flex items-center gap-1"><span class="material-symbols-outlined text-[18px]">equalizer</span> Estatísticas</a>
            <a routerLink="/about" class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200">Sobre Nós</a>
          </nav>
          
          <div class="flex items-center gap-2 md:hidden">
            <button (click)="toggleTheme()" class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              <span class="material-symbols-outlined">{{ isDarkMode() ? 'light_mode' : 'dark_mode' }}</span>
            </button>
            <button (click)="toggleMobileMenu()" class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none">
              <span class="material-symbols-outlined">{{ isMobileMenuOpen() ? 'close' : 'menu' }}</span>
            </button>
          </div>
          
          <div class="hidden md:flex items-center gap-4">
            <button (click)="toggleTheme()" class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" [title]="isDarkMode() ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'">
              <span class="material-symbols-outlined text-xl">{{ isDarkMode() ? 'light_mode' : 'dark_mode' }}</span>
            </button>

            <button (click)="handleAuth()" class="inline-flex items-center justify-center rounded-lg bg-gray-900 dark:bg-white px-5 py-2 text-sm font-bold text-white dark:text-gray-900 shadow-sm hover:opacity-90 transition-all duration-200 cursor-pointer">
              {{ auth.currentUser() ? 'Sair' : 'Área da Liderança' }}
            </button>
          </div>
        </div>

        @if (isMobileMenuOpen()) {
          <div class="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-background-dark border-b border-primary/10 shadow-xl animate-[slideIn_0.2s_ease-out]">
            <nav class="flex flex-col p-4 gap-2">
              <a routerLink="/" (click)="toggleMobileMenu()" class="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-primary font-bold transition-colors">Início</a>
              <a routerLink="/services" (click)="toggleMobileMenu()" class="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-200 hover:text-primary transition-colors">Cultos</a>
              <a routerLink="/repertoire" (click)="toggleMobileMenu()" class="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-200 hover:text-primary transition-colors">Repertório</a>
              <a routerLink="/stats" (click)="toggleMobileMenu()" class="p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-500/10 text-gray-600 dark:text-gray-200 hover:text-orange-500 transition-colors flex items-center gap-2"><span class="material-symbols-outlined">equalizer</span> Estatísticas</a>
              <a routerLink="/about" (click)="toggleMobileMenu()" class="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-200 hover:text-primary transition-colors">Sobre Nós</a>
              
              <div class="h-px bg-gray-100 dark:bg-white/10 my-1"></div>
              
              <button (click)="handleAuth(); toggleMobileMenu()" class="w-full p-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-center shadow-sm">
                 {{ auth.currentUser() ? 'Sair' : 'Área da Liderança' }}
              </button>
            </nav>
          </div>
        }
      </header>

      <main class="flex-grow pt-28">
        <section class="relative flex flex-col items-center justify-center pt-12 pb-24 px-4 sm:px-6 lg:px-8 bg-hero-pattern">
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 dark:to-background-dark/50 pointer-events-none"></div>
          <div class="relative z-10 mx-auto max-w-4xl text-center flex flex-col items-center gap-8">
            
            <div class="inline-flex items-center gap-2 rounded-full bg-green-100 dark:bg-green-900/30 px-4 py-1.5 text-sm font-bold text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20 uppercase tracking-wide">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Portal Oficial
            </div>

            <h1 class="text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:leading-[1.1]">
              Adore com a gente <br class="hidden md:block"/>
              <span class="text-primary relative inline-block">
                em espírito e verdade
                <svg class="absolute -bottom-2 left-0 w-full h-3 text-primary/30" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" stroke-width="3"></path>
                </svg>
              </span>
            </h1>

            <p class="max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 md:text-xl">
              Bem-vindo à Primeira Igreja Batista em Croatá. Acompanhe nossas escalas, aprenda os louvores e participe dos nossos cultos.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4 flex-wrap">
              <button routerLink="/services" class="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:bg-primary-hover hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <span class="material-symbols-outlined">calendar_month</span>
                <span>Ver Agenda de Cultos</span>
              </button>
              
              <button routerLink="/repertoire" class="flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 transition-all duration-200 hover:bg-gray-50 hover:text-primary dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-700">
                <span class="material-symbols-outlined">library_music</span>
                Repertório
              </button>

              <button routerLink="/stats" class="flex items-center justify-center gap-2 rounded-xl bg-orange-50 px-8 py-4 text-base font-bold text-orange-600 shadow-sm ring-1 ring-inset ring-orange-200 transition-all duration-200 hover:bg-orange-100 hover:text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/30 dark:hover:bg-orange-500/20">
                <span class="material-symbols-outlined">equalizer</span>
                Ranking
              </button>
            </div>
          </div>

          <div class="relative mt-16 w-full max-w-5xl mx-auto px-4">
            <div class="relative rounded-2xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 dark:bg-white/10 dark:ring-white/10 lg:rounded-3xl lg:p-4">
              <div class="overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 relative aspect-[16/9] md:aspect-[21/9] flex items-center justify-center bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAqWg9vaHjwO3kSoP6lhHDdrObQ7BRnHQue95LVR-bq4-fOTsdjV_ApaaS0TZJAxIxklQgS4u4_y6eDX3Cec7HjCTmZzbiZUSg_8uk-Kp_mIXsnxEYQkd05_agNiw0caZzPsSb6mmzQwH-CRW3XpCsQBk0f78l9t5oF1Ei587bO4QBGMwh0XrQguGts9KqIWukcewXddgbIQ-r7SQ1KvAYIgkZdpfn3QCtgNyU8JSy1xm3EqbQEOucOq_EzkwubNnO4DM6cuR5O7eX6');">
                <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                
                <div class="absolute inset-0 flex items-center justify-center p-4 overflow-hidden">
                  <div class="grid grid-cols-3 gap-4 md:gap-6 min-w-[700px] md:min-w-0 md:w-full max-w-4xl scale-[0.42] md:scale-110 origin-center transition-transform">
                    
                    <div class="flex flex-col gap-3 p-5 bg-white/95 backdrop-blur rounded-xl shadow-xl transform rotate-[-6deg] translate-y-4 hover:rotate-0 transition-transform duration-500 border border-white/20">
                      <div class="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <span class="material-symbols-outlined text-sm">music_note</span>
                      </div>
                      <div class="space-y-2">
                        <div class="h-2 w-16 bg-gray-200 rounded"></div>
                        <div class="h-4 w-3/4 bg-gray-800 rounded"></div>
                      </div>
                      <div class="mt-2 h-1 w-full bg-primary rounded-full"></div>
                    </div>
                    
                    <div class="flex flex-col gap-4 p-6 bg-white/100 backdrop-blur-xl rounded-2xl shadow-2xl z-10 border border-gray-100">
                      <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Culto de Domingo</span>
                        <span class="h-2 w-2 rounded-full bg-green-500"></span>
                      </div>
                      <div class="space-y-3">
                        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <span class="text-gray-400 font-mono text-xs">01</span>
                          <div class="flex-1">
                            <div class="text-sm font-bold text-gray-800">Grande é o Senhor</div>
                            <div class="text-xs text-gray-500">Tom: G</div>
                          </div>
                          <span class="material-symbols-outlined text-gray-400 text-sm">drag_handle</span>
                        </div>
                        <div class="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/10 cursor-pointer">
                          <span class="text-primary font-mono text-xs">02</span>
                          <div class="flex-1">
                            <div class="text-sm font-bold text-gray-800">Caminho no Deserto</div>
                            <div class="text-xs text-primary">Tom: A • Ativo</div>
                          </div>
                          <span class="material-symbols-outlined text-primary text-sm">equalizer</span>
                        </div>
                        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <span class="text-gray-400 font-mono text-xs">03</span>
                          <div class="flex-1">
                            <div class="text-sm font-bold text-gray-800">Bondade de Deus</div>
                            <div class="text-xs text-gray-500">Tom: D</div>
                          </div>
                          <span class="material-symbols-outlined text-gray-400 text-sm">drag_handle</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex flex-col gap-3 p-5 bg-white/95 backdrop-blur rounded-xl shadow-xl transform rotate-[6deg] translate-y-4 hover:rotate-0 transition-transform duration-500 border border-white/20">
                      <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <span class="material-symbols-outlined text-sm">group</span>
                      </div>
                      <div class="space-y-2">
                        <div class="h-2 w-12 bg-gray-200 rounded"></div>
                        <div class="h-4 w-2/3 bg-gray-800 rounded"></div>
                      </div>
                      <div class="mt-2 flex -space-x-2">
                        <div class="h-6 w-6 rounded-full bg-gray-300 border-2 border-white"></div>
                        <div class="h-6 w-6 rounded-full bg-gray-400 border-2 border-white"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute -top-12 -left-12 -z-10 h-[300px] w-[300px] rounded-full bg-primary/20 blur-3xl opacity-50"></div>
            <div class="absolute -bottom-12 -right-12 -z-10 h-[300px] w-[300px] rounded-full bg-blue-400/20 blur-3xl opacity-50"></div>
          </div>
        </section>

        <section class="py-24 px-4 bg-white dark:bg-background-dark">
          <div class="mx-auto max-w-7xl">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              
              <a routerLink="/services" class="group flex flex-col items-center gap-4 p-8 rounded-3xl bg-gray-50 dark:bg-white/5 hover:bg-white hover:shadow-xl dark:hover:bg-[#1a2e1a] transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-white/10 cursor-pointer">
                <div class="h-16 w-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform">
                  <span class="material-symbols-outlined text-3xl">calendar_month</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Agenda de Cultos</h3>
                <p class="text-gray-500 dark:text-gray-400 leading-relaxed">
                  Confira os dias, horários e quem estará ministrando o louvor em cada culto da nossa igreja.
                </p>
                <span class="text-primary font-bold text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Ver Agenda →</span>
              </a>

              <a routerLink="/repertoire" class="group flex flex-col items-center gap-4 p-8 rounded-3xl bg-gray-50 dark:bg-white/5 hover:bg-white hover:shadow-xl dark:hover:bg-[#1a2e1a] transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-white/10 cursor-pointer">
                <div class="h-16 w-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                  <span class="material-symbols-outlined text-3xl">lyrics</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Nosso Repertório</h3>
                <p class="text-gray-500 dark:text-gray-400 leading-relaxed">
                  Acesse as letras, ouça os hinos e aprenda as canções que cantamos em nossa comunidade.
                </p>
                <span class="text-primary font-bold text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Ver Músicas →</span>
              </a>

              <a routerLink="/stats" class="group flex flex-col items-center gap-4 p-8 rounded-3xl bg-gray-50 dark:bg-white/5 hover:bg-white hover:shadow-xl dark:hover:bg-[#1a2e1a] transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-white/10 cursor-pointer">
                <div class="h-16 w-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-2 group-hover:scale-110 transition-transform">
                  <span class="material-symbols-outlined text-3xl">equalizer</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Mais Tocadas</h3>
                <p class="text-gray-500 dark:text-gray-400 leading-relaxed">
                  Veja quais louvores tem marcado nossa história recente através do nosso ranking de execuções.
                </p>
                <span class="text-primary font-bold text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Ver Ranking →</span>
              </a>

            </div>
          </div>
        </section>
      </main>

      <footer class="border-t border-gray-100 bg-white/50 px-4 py-12 dark:bg-background-dark dark:border-white/5">
        <div class="mx-auto max-w-7xl flex flex-col items-center gap-6 text-center">
          <div class="flex items-center gap-2 mb-2">
            <img src="logo.png" alt="Logo PIB" class="h-16 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
            <span class="font-bold text-gray-900 dark:text-white tracking-widest uppercase">PIB CROATÁ</span>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <a routerLink="/about" class="text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer">Sobre Nós</a>
            <a class="text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer">Localização</a>
            <a class="text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer">Contato</a>
          </div>
          <p class="text-sm text-gray-400">© 2026 Primeira Igreja Batista em Croatá. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  `
})
export class HomeComponent {
  auth = inject(AuthService);
  router = inject(Router);
  
  isMobileMenuOpen = signal(false);
  isDarkMode = signal(false);

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.isDarkMode.set(true);
      document.documentElement.classList.add('dark');
    }
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

  toggleTheme() {
    this.isDarkMode.update(v => !v);
    
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}