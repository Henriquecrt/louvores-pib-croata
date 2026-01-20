import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col font-display bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white transition-colors duration-300">
      
      <header class="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-primary/10 px-4 sm:px-10 py-3 transition-all duration-300">
        <div class="mx-auto max-w-7xl flex items-center justify-between">
          <div class="flex items-center gap-4">
            <img src="logo.png" alt="Logo PIB" class="h-20 md:h-24 w-auto object-contain hover:scale-105 transition-transform drop-shadow-sm py-1 cursor-pointer" routerLink="/">
            <div class="flex flex-col leading-tight justify-center">
              <h2 class="text-primary text-xl font-black tracking-tight cursor-pointer" routerLink="/">PIB CROATÁ</h2>
              <span class="text-[11px] text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase">Ministério de Louvor</span>
            </div>
          </div>
          
          <nav class="hidden md:flex items-center gap-8">
            <a routerLink="/" class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200">Início</a>
            <a routerLink="/services" class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200">Cultos</a>
            <a routerLink="/repertoire" class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200">Repertório</a>
            <a routerLink="/stats" class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200 flex items-center gap-1"><span class="material-symbols-outlined text-[18px]">equalizer</span> Estatísticas</a>
            <a routerLink="/about" class="text-sm font-bold text-primary cursor-default">Sobre Nós</a>
          </nav>
          
          <div class="flex items-center gap-4">
             <button (click)="handleAuth()" class="hidden md:inline-flex items-center justify-center rounded-lg bg-gray-900 dark:bg-white px-5 py-2 text-sm font-bold text-white dark:text-gray-900 shadow-sm hover:opacity-90 transition-all duration-200 cursor-pointer">
              {{ auth.currentUser() ? 'Sair' : 'Área da Liderança' }}
            </button>
            <button (click)="toggleMobileMenu()" class="md:hidden p-2 text-gray-600 dark:text-gray-300">
               <span class="material-symbols-outlined text-3xl">menu</span>
            </button>
          </div>
        </div>

        @if (isMobileMenuOpen()) {
          <div class="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-background-dark border-b border-primary/10 shadow-xl animate-[slideIn_0.2s_ease-out]">
            <nav class="flex flex-col p-4 gap-2">
              <a routerLink="/" (click)="toggleMobileMenu()" class="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-200 hover:text-primary transition-colors">Início</a>
              <a routerLink="/services" (click)="toggleMobileMenu()" class="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-200 hover:text-primary transition-colors">Cultos</a>
              <a routerLink="/repertoire" (click)="toggleMobileMenu()" class="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-200 hover:text-primary transition-colors">Repertório</a>
              <a routerLink="/stats" (click)="toggleMobileMenu()" class="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-200 hover:text-primary transition-colors">Estatísticas</a>
              <a routerLink="/about" (click)="toggleMobileMenu()" class="p-3 rounded-xl bg-primary/10 text-primary font-bold transition-colors">Sobre Nós</a>
              <button (click)="handleAuth(); toggleMobileMenu()" class="w-full mt-2 p-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-center">
                 {{ auth.currentUser() ? 'Sair' : 'Área da Liderança' }}
              </button>
            </nav>
          </div>
        }
      </header>

      <main class="flex-grow pt-32 pb-20 px-4">
        <div class="max-w-4xl mx-auto space-y-12">
          
          <section class="text-center space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <div class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary uppercase tracking-wide">
              <span class="material-symbols-outlined text-sm">church</span> Nossa História
            </div>
            <h1 class="text-4xl md:text-5xl font-black leading-tight">Uma família de fé<br>apaixonada por Jesus</h1>
            <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              A Primeira Igreja Batista em Croatá existe para glorificar a Deus, pregar o evangelho e servir ao próximo com amor e excelência.
            </p>
          </section>

          <section class="grid md:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-[#1a2e1a] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-colors">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                <span class="material-symbols-outlined text-2xl">diversity_3</span>
              </div>
              <h3 class="text-2xl font-bold mb-4">Nossa Comunidade</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                Somos um povo acolhedor, unido pelo propósito de viver os ensinamentos de Cristo. Acreditamos na comunhão, no discipulado e no crescimento mútuo através da Palavra de Deus.
              </p>
            </div>

            <div class="bg-white dark:bg-[#1a2e1a] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-colors">
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
                <span class="material-symbols-outlined text-2xl">music_note</span>
              </div>
              <h3 class="text-2xl font-bold mb-4">Ministério de Louvor</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                Nosso louvor é mais que música; é adoração. Usamos nossos talentos e este sistema digital para garantir que cada culto seja organizado com excelência, permitindo que a igreja adore em liberdade.
              </p>
            </div>
          </section>

          <div class="relative rounded-3xl overflow-hidden aspect-video shadow-2xl bg-black group">
             <iframe 
               class="w-full h-full"
               src="https://www.youtube.com/embed/_QGgpdDipik" 
               title="Louvor PIB Croatá - Nosso Deus é Poderoso"
               frameborder="0" 
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
               allowfullscreen>
             </iframe>
          </div>

          <section class="bg-primary/5 dark:bg-white/5 p-8 md:p-12 rounded-3xl text-center border border-primary/10 dark:border-white/10">
            <h2 class="text-2xl font-bold mb-2">Fale Conosco</h2>
            <p class="text-gray-500 dark:text-gray-400 mb-8">Tem alguma dúvida, pedido de oração ou quer nos visitar?</p>
            
            <div class="flex flex-col md:flex-row justify-center gap-4">
              <a href="mailto:midiapibdecroata@gmail.com" class="flex items-center justify-center gap-3 bg-white dark:bg-[#1a2e1a] px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-all text-gray-800 dark:text-white font-bold border border-gray-100 dark:border-white/5">
                <span class="material-symbols-outlined text-red-500">mail</span>
                midiapibdecroata&#64;gmail.com
              </a>
              
              <a href="#" class="flex items-center justify-center gap-3 bg-[#25D366] px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-all text-white font-bold">
                <span class="material-symbols-outlined">chat</span>
                WhatsApp da Igreja
              </a>
            </div>
          </section>

        </div>
      </main>

      <footer class="border-t border-gray-100 bg-white/50 px-4 py-8 dark:bg-background-dark dark:border-white/5 mt-auto">
        <div class="mx-auto max-w-7xl flex flex-col items-center text-center">
           <img src="logo.png" alt="Logo PIB" class="h-10 w-auto grayscale opacity-50 mb-4">
           <p class="text-sm text-gray-400">© 2026 Primeira Igreja Batista em Croatá.</p>
        </div>
      </footer>
    </div>
  `
})
export class AboutComponent {
  auth = inject(AuthService);
  router = inject(Router);
  isMobileMenuOpen = signal(false);

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
}