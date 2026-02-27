import { Component, ChangeDetectionStrategy, signal, inject, OnInit, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { SongService, Song, Culto } from '../../services/song.service';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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
              <button (click)="enableNotifications(); toggleMobileMenu()" class="w-full p-3 mb-2 rounded-xl bg-blue-50 text-blue-700 font-bold text-center border border-blue-200 flex items-center justify-center gap-2 shadow-sm">
                  <span class="material-symbols-outlined">notifications_active</span> Ativar Notificações
              </button>
              
              <a routerLink="/" (click)="toggleMobileMenu()" class="p-3 rounded-xl hover:bg-gray-50 text-primary font-bold transition-colors">Início</a>
              <a routerLink="/services" (click)="toggleMobileMenu()" class="p-3 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-primary transition-colors">Cultos</a>
              <a routerLink="/repertoire" (click)="toggleMobileMenu()" class="p-3 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-primary transition-colors">Repertório</a>
              <a routerLink="/stats" (click)="toggleMobileMenu()" class="p-3 rounded-xl hover:bg-orange-50 text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-2"><span class="material-symbols-outlined">equalizer</span> Estatísticas</a>
              
              <div class="h-px bg-gray-100 my-1"></div>
              
              <button (click)="handleAuth(); toggleMobileMenu()" class="w-full p-3 rounded-xl bg-gray-900 text-white font-bold text-center shadow-sm">
                  {{ auth.currentUser() ? 'Sair' : 'Área da Liderança' }}
              </button>
            </nav>
          </div>
        }
      </header>

      <main class="flex-grow pt-28">
        
        @if (songService.noticeMessage() || auth.currentUser()) {
          <div class="mx-auto max-w-4xl px-4 sm:px-6 mb-6">
            <div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-100 to-yellow-50 border border-amber-200 p-4 shadow-sm">
              <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-amber-600 mt-0.5 animate-pulse">campaign</span>
                <div class="flex-1">
                  <h3 class="text-sm font-bold text-amber-800 uppercase tracking-wide mb-1">Mural da Equipe</h3>
                  
                  @if (auth.currentUser() && isEditingNotice()) {
                    <textarea 
                      [(ngModel)]="tempNotice" 
                      class="w-full p-2 text-sm border border-amber-300 rounded bg-white/80 focus:ring-2 focus:ring-amber-500 outline-none" 
                      rows="3"
                      placeholder="Escreva um aviso para a equipe..."></textarea>
                    <div class="flex gap-2 mt-2 justify-end">
                      <button (click)="cancelEditNotice()" class="text-xs font-bold text-gray-500 hover:text-gray-700 px-3 py-1">Cancelar</button>
                      <button (click)="saveNotice()" class="text-xs font-bold bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition-colors">Salvar Aviso</button>
                    </div>
                  } @else {
                    <p class="text-amber-900 font-medium whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                      {{ songService.noticeMessage() || 'Nenhum aviso no momento.' }}
                    </p>
                    
                    @if (auth.currentUser()) {
                      <button (click)="startEditNotice()" class="absolute top-2 right-2 p-1 text-amber-400 hover:text-amber-700 transition-colors rounded-full hover:bg-amber-200/50" title="Editar Aviso">
                        <span class="material-symbols-outlined text-sm">edit</span>
                      </button>
                    }
                  }
                </div>
              </div>
            </div>
          </div>
        }

        <section class="relative flex flex-col items-center justify-center pt-6 pb-24 px-4 sm:px-6 lg:px-8 bg-hero-pattern">
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
                      
                      <button (click)="viewSuggestedSong()" class="flex-1 py-2 rounded-lg bg-green-600 text-white font-bold text-xs hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-1">
                        Ver Letra <span class="material-symbols-outlined text-base">visibility</span>
                      </button>
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

            <div class="w-full max-w-3xl mx-auto mt-12 animate-[fadeIn_0.8s_ease-out]">
              <div class="bg-white/80 backdrop-blur rounded-2xl p-6 border border-gray-200 shadow-xl relative overflow-hidden group">
                <div class="absolute -right-10 -top-10 w-32 h-32 bg-orange-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div class="absolute -left-10 -bottom-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>

                <h3 class="text-lg font-bold text-gray-800 mb-6 flex items-center justify-center gap-2 relative z-10">
                  <span class="material-symbols-outlined text-orange-500 text-2xl animate-pulse">trophy</span> 
                  <span class="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">Nossa Equipe de Louvor</span>
                </h3>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                  @for (member of topMembers(); track member.name; let i = $index) {
                    <button (click)="viewMemberDetails(member)" class="flex flex-col items-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm relative group/card hover:-translate-y-1 transition-all duration-300 hover:shadow-md hover:border-orange-200 cursor-pointer active:scale-95 w-full">
                      
                      @if (i === 0) { <span class="absolute -top-3 -right-2 text-2xl drop-shadow-sm animate-[bounce_2s_infinite]">🥇</span> }
                      @if (i === 1) { <span class="absolute -top-3 -right-2 text-2xl drop-shadow-sm">🥈</span> }
                      @if (i === 2) { <span class="absolute -top-3 -right-2 text-2xl drop-shadow-sm">🥉</span> }

                      <div class="h-16 w-16 rounded-full overflow-hidden mb-3 shadow-md border-2 border-white group-hover/card:border-orange-200 transition-colors bg-gray-100 relative pointer-events-none">
                        <img [src]="'assets/equipe/' + member.name + '.jpg'" 
                             (error)="handleImageError($event)" 
                             alt="{{member.name}}" 
                             class="h-full w-full object-cover">
                        
                        <div class="fallback-initial absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 flex items-center justify-center font-bold text-xl hidden">
                          {{ member.name.charAt(0) }}
                        </div>
                      </div>

                      <div class="font-bold text-gray-800 text-sm truncate w-full text-center group-hover/card:text-primary transition-colors pointer-events-none">{{ member.name }}</div>
                      <div class="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-full mt-1 border border-gray-100 pointer-events-none">{{ member.count }} escalas</div>
                    </button>
                  } @empty {
                    <div class="col-span-full text-gray-400 text-sm py-4 italic">
                      Comece a criar escalas para ver a equipe aqui!
                    </div>
                  }
                </div>
                
                <p class="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold">Toque na foto para ver a agenda</p>
              </div>
            </div>

          </div>

          <div class="relative mt-24 w-full max-w-5xl mx-auto px-4">
             <div class="relative rounded-2xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-3xl lg:p-4">
              <div class="overflow-hidden rounded-xl bg-white shadow-2xl border border-gray-100 relative aspect-[16/9] md:aspect-[21/9] flex items-center justify-center bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAqWg9vaHjwO3kSoP6lhHDdrObQ7BRnHQue95LVR-bq4-fOTsdjV_ApaaS0TZJAxIxklQgS4u4_y6eDX3Cec7HjCTmZzbiZUSg_8uk-Kp_mIXsnxEYQkd05_agNiw0caZzPsSb6mmzQwH-CRW3XpCsQBk0f78l9t5oF1Ei587bO4QBGMwh0XrQguGts9KqIWukcewXddgbIQ-r7SQ1KvAYIgkZdpfn3QCtgNyU8JSy1xm3EqbQEOucOq_EzkwubNnO4DM6cuR5O7eX6');">
                <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                <div class="absolute inset-0 flex items-center justify-center p-4 overflow-hidden">
                   <div class="text-white font-bold text-lg md:text-2xl drop-shadow-md text-center">
                      Louvor que transforma, adoração que liberta.
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

      @if (selectedMemberDetails(); as data) {
        <div class="fixed inset-0 z-[100] overflow-y-auto" role="dialog" aria-modal="true">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" (click)="closeMemberDetails()"></div>
          
          <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-md animate-[scaleIn_0.2s_ease-out]">
              
              <div class="relative h-24 bg-gradient-to-r from-orange-400 to-orange-600">
                <button (click)="closeMemberDetails()" class="absolute top-3 right-3 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors">
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div class="px-6 pb-6 -mt-12 flex flex-col items-center">
                <div class="h-24 w-24 rounded-full border-4 border-white shadow-lg bg-white overflow-hidden mb-3 relative">
                   <img [src]="'assets/equipe/' + data.name + '.jpg'" (error)="handleImageError($event)" class="h-full w-full object-cover">
                   <div class="fallback-initial absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 flex items-center justify-center font-bold text-3xl hidden">{{ data.name.charAt(0) }}</div>
                </div>
                
                <h3 class="text-2xl font-black text-gray-900">{{ data.name }}</h3>
                <p class="text-gray-500 text-sm font-medium">{{ data.past.length + data.upcoming.length }} escalas no total</p>

                <div class="w-full mt-6 text-left">
                  <h4 class="text-xs font-bold text-green-600 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">event_upcoming</span> Próximas Escalas
                  </h4>
                  
                  <div class="space-y-2 mb-6">
                    @for (culto of data.upcoming; track culto.id) {
                      <div [routerLink]="['/services', culto.id]" (click)="closeMemberDetails()" class="flex items-center justify-between gap-3 p-3 rounded-xl bg-green-50 border border-green-100 cursor-pointer hover:bg-green-100 transition-colors relative group">
                        
                        <div class="flex items-center gap-3 flex-1">
                          <div class="flex flex-col items-center justify-center h-10 w-10 bg-white rounded-lg border border-green-100 shadow-sm text-green-700">
                            <span class="text-[10px] font-bold uppercase">{{ formatDateMonth(culto.date) }}</span>
                            <span class="text-lg font-black leading-none">{{ formatDateDay(culto.date) }}</span>
                          </div>
                          <div>
                            <div class="font-bold text-gray-800 text-sm">{{ culto.title }}</div>
                            <div class="text-xs text-gray-500">{{ getWeekDay(culto.date) }}</div>
                          </div>
                        </div>

                        <button (click)="$event.stopPropagation(); shareSingleService(data.name, culto)" class="h-8 w-8 flex items-center justify-center rounded-full bg-green-200 text-green-700 hover:bg-green-300 hover:text-green-800 transition-colors z-10" title="Enviar este culto no WhatsApp">
                          <span class="material-symbols-outlined text-lg">share</span>
                        </button>

                      </div>
                    } @empty {
                      <p class="text-sm text-gray-400 italic text-center py-2">Nenhuma escala futura agendada.</p>
                    }
                  </div>

                  <button (click)="shareMemberSchedule()" class="w-full py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl shadow-lg shadow-green-900/10 transition-all active:scale-95 flex items-center justify-center gap-2 mb-6">
                    <span class="material-symbols-outlined">share</span> Enviar Todas as Escalas
                  </button>

                  <details class="group">
                    <summary class="flex items-center justify-between cursor-pointer list-none text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">
                      <span>Ver Histórico Recente</span>
                      <span class="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                    </summary>
                    <div class="mt-3 space-y-2 pl-4 border-l-2 border-gray-100">
                      @for (culto of data.past.slice(0, 5); track culto.id) {
                        <div [routerLink]="['/services', culto.id]" (click)="closeMemberDetails()" class="text-sm text-gray-500 py-2 px-2 hover:bg-gray-50 rounded cursor-pointer flex justify-between items-center transition-colors">
                          <span><span class="font-bold">{{ formatDate(culto.date) }}</span> - {{ culto.title }}</span>
                          <span class="material-symbols-outlined text-xs text-gray-300">arrow_forward</span>
                        </div>
                      }
                    </div>
                  </details>

                </div>
              </div>

            </div>
          </div>
        </div>
      }

      @if (selectedSuggestedSong(); as song) {
        <div class="fixed inset-0 z-[100] overflow-y-auto" role="dialog" aria-modal="true">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" (click)="closeSuggestedSong()"></div>
          
          <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-2xl animate-[scaleIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
              
              <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50">
                <div class="flex flex-col">
                  <h2 class="text-2xl font-bold text-gray-900 leading-tight">{{ song.title }}</h2>
                  <span class="text-primary font-medium flex items-center gap-1 mt-1">
                    <span class="material-symbols-outlined text-[18px]">mic</span> {{ song.artist }}
                  </span>
                </div>
                <button (click)="closeSuggestedSong()" class="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-200">
                  <span class="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              <div class="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
                @if (song.youtubeUrl) {
                    <div class="mb-6 aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-black">
                      <iframe class="w-full h-full" [src]="getSafeUrl(song.youtubeUrl)" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>
                }
                <pre class="whitespace-pre-wrap font-sans text-lg md:text-xl text-gray-700 leading-relaxed text-center">{{ song.lyrics }}</pre>
              </div>

              <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button (click)="closeSuggestedSong()" class="py-2 px-6 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition-colors">
                  Fechar Letra
                </button>
              </div>

            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class HomeComponent implements OnInit {
  auth = inject(AuthService);
  router = inject(Router);
  notificationService = inject(NotificationService);
  songService = inject(SongService); 
  
  // 🚨 Injeção do DomSanitizer para o link do YouTube da Sugestão funcionar
  private sanitizer = inject(DomSanitizer);
  
  isMobileMenuOpen = signal(false);
  deferredPrompt: any = null;

  suggestionState = signal<{song: Song | null, reason: string}>({ song: null, reason: '' });
  
  // 🚨 Sinal para controlar o Modal da Letra Sugerida
  selectedSuggestedSong = signal<Song | null>(null);

  isEditingNotice = signal(false);
  tempNotice = '';

  selectedMemberDetails = signal<{
    name: string;
    upcoming: Culto[];
    past: Culto[];
  } | null>(null);

  isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  topMembers = computed(() => {
    const cultos = this.songService.cultos();
    const countMap = new Map<string, number>();
    cultos.forEach(culto => {
      culto.vocals?.forEach(member => {
        countMap.set(member, (countMap.get(member) || 0) + 1);
      });
    });
    return Array.from(countMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  });

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

  viewMemberDetails(member: { name: string, count: number }) {
    const allCultos = this.songService.cultos();
    const memberCultos = allCultos.filter(c => c.vocals?.includes(member.name));
    memberCultos.sort((a, b) => b.date.localeCompare(a.date));
    const today = new Date().toISOString().split('T')[0];
    const upcoming = memberCultos.filter(c => c.date >= today).reverse();
    const past = memberCultos.filter(c => c.date < today);
    this.selectedMemberDetails.set({ name: member.name, upcoming, past });
  }

  closeMemberDetails() { this.selectedMemberDetails.set(null); }

  shareMemberSchedule() {
    const data = this.selectedMemberDetails();
    if (!data) return;
    const baseUrl = window.location.href.split('#')[0];
    let text = `Olá *${data.name}*! 👋\n\nConfira suas *Próximas Escalas* na PIB Croatá:\n\n`;

    if (data.upcoming.length === 0) { text += `_Nenhuma escala agendada por enquanto._\n`; } 
    else {
      data.upcoming.forEach(c => {
        const date = this.formatDate(c.date);
        const link = `${baseUrl}#/services/${c.id}`;
        text += `🗓️ *${date}* - ${c.title}\n🔗 ${link}\n\n`;
      });
    }
    text += `_Gerado pelo App Louvores PIB_`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  }

  shareSingleService(name: string, culto: Culto) {
    const baseUrl = window.location.href.split('#')[0];
    const date = this.formatDate(culto.date);
    const link = `${baseUrl}#/services/${culto.id}`;

    const text = `Olá *${name}*! 👋\n\nPassando para lembrar da sua escala:\n\n🗓️ *${date}* - ${culto.title}\n🔗 ${link}\n\nDeus abençoe! 🙏`;
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  }

  formatDate(dateStr: string) { const [y, m, d] = dateStr.split('-'); return `${d}/${m}/${y}`; }
  formatDateDay(dateStr: string) { return dateStr.split('-')[2]; }
  formatDateMonth(dateStr: string) { 
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    return months[parseInt(dateStr.split('-')[1]) - 1]; 
  }
  getWeekDay(dateStr: string) {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[new Date(dateStr + 'T12:00:00').getDay()];
  }

  handleImageError(event: any) {
    const imgElement = event.target;
    imgElement.style.display = 'none';
    const fallbackDiv = imgElement.nextElementSibling;
    if (fallbackDiv) { fallbackDiv.classList.remove('hidden'); fallbackDiv.classList.add('flex'); }
  }

  installPwa() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then(() => { this.deferredPrompt = null; });
    }
  }

  enableNotifications() {
    if (this.isIOS && !this.isStandalone) {
      alert('⚠️ No iPhone, você precisa instalar o App primeiro!\n\n1. Toque no botão "Compartilhar".\n2. Escolha "Adicionar à Tela de Início".');
      return; 
    }
    this.notificationService.requestPermission();
  }

  handleAuth() {
    if (this.auth.currentUser()) { this.auth.logout(); } 
    else { this.router.navigate(['/login']); }
  }

  toggleMobileMenu() { this.isMobileMenuOpen.update(val => !val); }

  generateSuggestion() {
    const allSongs = this.songService.songs();
    const allCultos = this.songService.cultos();
    const today = new Date();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(today.getDate() - 90);

    const lastDates = new Map<string, Date>();
    for (const culto of allCultos) {
      const cultoDate = new Date(culto.date + 'T12:00:00'); 
      for (const songId of culto.songIds) {
        if (!lastDates.has(songId)) { lastDates.set(songId, cultoDate); }
      }
    }
    const candidates = allSongs.filter(song => {
      const lastDate = lastDates.get(song.id);
      return !lastDate || lastDate < ninetyDaysAgo;
    });

    if (candidates.length === 0) {
      this.suggestionState.set({ song: null, reason: 'O repertório está super em dia! Parabéns!' });
      alert('Parabéns! Nenhuma música está esquecida.');
      return;
    }

    const winner = candidates[Math.floor(Math.random() * candidates.length)];
    const lastDate = lastDates.get(winner.id);
    let reason = !lastDate ? 'Nunca foi tocada.' : `Não é tocada há ${Math.ceil(Math.abs(today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24))} dias.`;
    this.suggestionState.set({ song: winner, reason });
  }

  // 🚨 Funções para o Modal da Sugestão
  viewSuggestedSong() {
    if (this.suggestionState().song) {
      this.selectedSuggestedSong.set(this.suggestionState().song);
    }
  }

  closeSuggestedSong() {
    this.selectedSuggestedSong.set(null);
  }

  getSafeUrl(url: string | undefined): SafeResourceUrl | null {
    if (!url) return null;
    let videoId = '';
    if (url.includes('v=')) { videoId = url.split('v=')[1].split('&')[0]; } 
    else if (url.includes('youtu.be/')) { videoId = url.split('youtu.be/')[1].split('?')[0]; }
    else if (url.includes('youtube.com/')) { return this.sanitizer.bypassSecurityTrustResourceUrl(url); }
    else { return this.sanitizer.bypassSecurityTrustResourceUrl(url); }
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  startEditNotice() { this.tempNotice = this.songService.noticeMessage(); this.isEditingNotice.set(true); }
  cancelEditNotice() { this.isEditingNotice.set(false); }
  async saveNotice() { await this.songService.updateNoticeMessage(this.tempNotice); this.isEditingNotice.set(false); }
}