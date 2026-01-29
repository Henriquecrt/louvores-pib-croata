import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Song, SongService } from '../../services/song.service';
import { AuthService } from '../../services/auth.service';
import { AddSongModalComponent } from '../../components/add-song-modal.component';

@Component({
  selector: 'app-repertoire',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AddSongModalComponent],
  template: `
    <div class="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      <header class="sticky top-0 z-40 flex w-full items-center justify-between border-b border-solid border-[#dbece0] dark:border-white/10 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md px-6 py-4 lg:px-10 transition-colors">
        <div class="flex items-center gap-4 text-primary">
          <div class="flex items-center justify-center size-10 rounded-xl bg-[#e6f2e6] dark:bg-primary/20">
            <span class="material-symbols-outlined text-primary text-2xl">music_note</span>
          </div>
          <a routerLink="/" class="text-[#101810] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] cursor-pointer hover:text-primary transition-colors">LOUVORES PIB CROATÁ</a>
        </div>
        <div class="flex gap-3">
          <a routerLink="/services" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-colors">
            <span class="material-symbols-outlined text-[20px]">calendar_month</span>
            <span class="hidden sm:inline">Cultos</span>
          </a>
        </div>
      </header>

      <main class="flex-1 flex flex-col items-center w-full py-8 px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-6xl flex flex-col gap-8">
          
          <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div class="flex flex-col gap-2">
              <h1 class="text-[#101810] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Repertório</h1>
              <p class="text-[#5e8d5e] dark:text-gray-400 text-lg font-medium">Gerencie e visualize suas letras de louvor</p>
            </div>
          </div>

          @if (topSongs().length > 0 && !searchQuery()) {
            <div class="animate-[fadeIn_0.5s_ease-out]">
              <h2 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1">
                <span class="material-symbols-outlined text-orange-500 text-lg">local_fire_department</span>
                Mais Tocadas
              </h2>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                @for (song of topSongs(); track song.id) {
                  <div (click)="viewSong(song)" class="bg-white dark:bg-[#1a2e1a] p-3 rounded-xl border border-orange-100 dark:border-orange-500/20 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col items-center text-center group relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
                    <span class="text-xs font-bold text-orange-500 mb-1">{{ song.views }}x</span>
                    <div class="font-bold text-gray-800 dark:text-gray-200 text-sm line-clamp-2 leading-tight mb-1 group-hover:text-orange-500 transition-colors uppercase">
                      {{ song.title }}
                    </div>
                    <div class="text-[10px] text-gray-400 uppercase">{{ song.artist }}</div>
                  </div>
                }
              </div>
            </div>
          }

          <div class="w-full">
            <label class="relative flex w-full flex-col">
              <div class="relative flex w-full items-stretch rounded-xl h-14 bg-white dark:bg-[#1a2e1a] shadow-sm ring-1 ring-black/5 dark:ring-white/10 focus-within:ring-2 focus-within:ring-primary transition-all">
                <div class="absolute left-0 top-0 flex h-full items-center justify-center pl-4 pr-2">
                  <span class="material-symbols-outlined text-[#5e8d5e] text-[24px]">search</span>
                </div>
                <input [(ngModel)]="searchQuery" class="flex w-full h-full min-w-0 flex-1 bg-transparent px-4 pl-12 text-base text-[#101810] dark:text-white placeholder:text-[#9ca3af] focus:outline-none rounded-xl" placeholder="Pesquisar por título, cantor ou letra" />
                @if(searchQuery()) {
                  <button (click)="searchQuery.set('')" class="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <span class="material-symbols-outlined">close</span>
                  </button>
                }
              </div>
            </label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (song of filteredSongs(); track song.id) {
              <div class="group flex flex-col justify-between rounded-xl bg-white dark:bg-[#1a2e1a] p-6 shadow-sm ring-1 ring-[#e6f0e6] dark:ring-white/5 transition-all hover:shadow-md hover:ring-primary/30">
                <div class="mb-4 cursor-pointer" (click)="viewSong(song)">
                  <div class="flex justify-between items-start mb-3">
                    <div class="flex flex-col max-w-[70%]">
                      <h3 class="text-[#101810] dark:text-white text-xl font-bold leading-tight truncate uppercase">{{ song.title }}</h3>
                      <div class="flex items-center gap-1 mt-1 text-sm font-medium text-primary uppercase">
                        <span class="material-symbols-outlined text-[16px]">mic</span>
                        <span class="truncate">{{ song.artist }}</span>
                      </div>
                    </div>
                    
                    @if (auth.currentUser()) {
                      <div class="flex gap-1" (click)="$event.stopPropagation()">
                        <button (click)="openEditModal(song)" class="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Editar">
                          <span class="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button (click)="confirmDelete(song)" class="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20" title="Excluir">
                          <span class="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    }
                  </div>
                  
                  @if (song.key) {
                    <div class="mb-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                      Tom: {{ song.key }}
                    </div>
                  }

                  <p class="text-[#4B5563] dark:text-gray-400 text-base font-normal leading-relaxed line-clamp-3 mt-1">
                    {{ song.lyrics }}
                  </p>
                </div>
                <div class="pt-2 border-t border-[#f0f5f0] dark:border-white/5 mt-auto">
                  <button (click)="viewSong(song)" class="w-full mt-4 flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] transition hover:bg-primary-hover shadow-sm">
                    Ver Completa
                  </button>
                </div>
              </div>
            } @empty {
              <div class="col-span-full flex flex-col items-center justify-center py-12 text-center text-gray-500">
                <span class="material-symbols-outlined text-6xl mb-4 text-gray-300 dark:text-gray-600">search_off</span>
                <p class="text-lg dark:text-gray-400">Nenhum louvor encontrado.</p>
              </div>
            }
          </div>
          
          @if (auth.currentUser()) {
            <div class="mt-12 p-8 border-2 border-red-200 dark:border-red-900/30 rounded-2xl bg-red-50 dark:bg-red-900/10 text-center">
              <h3 class="text-red-700 dark:text-red-400 font-bold text-xl mb-2">Zona de Perigo</h3>
              <p class="text-red-600/70 dark:text-red-300/70 mb-4">Use este botão para apagar TODAS as músicas do banco de dados.</p>
              <p class="mb-4 text-sm font-bold">Total de músicas encontradas: {{ songService.songs().length }}</p>
              <button (click)="deleteAllSongs()" class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mx-auto">
                <span class="material-symbols-outlined">delete_forever</span>
                EXCLUIR TUDO AGORA
              </button>
            </div>
          }
        </div>
      </main>

      @if (auth.currentUser()) {
        <div class="fixed bottom-6 right-6 z-30">
          <button (click)="openAddModal()" class="flex items-center justify-center size-14 rounded-full bg-primary text-white shadow-lg shadow-green-900/20 transition-transform hover:scale-105 hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/30">
            <span class="material-symbols-outlined text-[28px]">add</span>
          </button>
        </div>
      }

      <app-add-song-modal [isOpen]="isModalOpen()" [songToEdit]="editingSong()" (close)="closeModal()" (save)="onSaveSong($event)"></app-add-song-modal>

      @if (selectedSong(); as song) {
        <div class="fixed inset-0 z-[70] overflow-y-auto" role="dialog" aria-modal="true">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" (click)="closeViewModal()"></div>
          <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a2e1a] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl animate-[slideIn_0.3s_ease-out_forwards] flex flex-col max-h-[90vh]">
              
              <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                <div class="flex flex-col">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white leading-tight uppercase">{{ song.title }}</h2>
                  
                  <div class="flex flex-wrap items-center gap-3 mt-2">
                    <span class="text-primary font-medium flex items-center gap-1 uppercase">
                      <span class="material-symbols-outlined text-[18px]">mic</span> {{ song.artist }}
                    </span>
                    
                    @if(song.key) { 
                      <span class="font-bold text-gray-700 dark:text-gray-300 text-sm border border-gray-300 dark:border-gray-600 px-2 rounded">Tom: {{ song.key }}</span> 
                    }

                    @if(getLastPlayed(song.id); as lastDate) {
                        <span class="flex items-center gap-1 text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full border border-orange-100 dark:border-orange-900/30" title="Data do último culto em que esta música foi usada">
                          <span class="material-symbols-outlined text-[14px]">history</span>
                          Última vez: {{ lastDate }}
                        </span>
                    }
                  </div>

                </div>
                <button (click)="closeViewModal()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10"><span class="material-symbols-outlined text-2xl">close</span></button>
              </div>

              <div class="flex-1 overflow-y-auto p-6 md:p-8 bg-white dark:bg-[#1a2e1a]">
                @if (song.youtubeUrl && getSafeEmbedUrl(song.youtubeUrl)) {
                  <div class="mb-8 w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-white/10">
                    <iframe 
                      [src]="getSafeEmbedUrl(song.youtubeUrl)" 
                      title="YouTube video player" 
                      frameborder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowfullscreen
                      class="w-full h-full"
                    ></iframe>
                  </div>
                }

                <pre class="whitespace-pre-wrap font-sans text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed text-center">{{ song.lyrics }}</pre>
                
                @if (song.tags) {
                  <div class="mt-8 flex flex-wrap gap-2 justify-center">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600">#{{ song.tags }}</span>
                  </div>
                }
              </div>

              <div class="px-6 py-4 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex justify-center">
                <button (click)="closeViewModal()" class="w-full sm:w-auto px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Fechar Leitura</button>
              </div>
            </div>
          </div>
        </div>
      }

      @if (showToast()) {
        <div class="fixed bottom-6 right-6 z-[80] animate-[slideIn_0.3s_ease-out_forwards]">
          <div class="flex items-center w-full max-w-sm p-4 bg-white dark:bg-[#1a2e1a] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-l-4 border-primary">
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-primary bg-primary/10 rounded-lg"><span class="material-symbols-outlined text-[20px]">check</span></div>
            <div class="ml-3 text-sm font-normal text-gray-800 dark:text-gray-100"><span class="font-semibold block mb-0.5 text-primary">Sucesso!</span> Operação realizada com sucesso!</div>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepertoireComponent {
  songService = inject(SongService);
  private sanitizer = inject(DomSanitizer);
  auth = inject(AuthService);
  
  searchQuery = signal('');
  isModalOpen = signal(false);
  editingSong = signal<Song | null>(null);
  selectedSong = signal<Song | null>(null);
  showToast = signal(false);

  // Computa o TOP 5
  topSongs = computed(() => {
    return this.songService.songs()
      .filter(s => (s.views || 0) > 0)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  });

  filteredSongs = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const songs = this.songService.songs();
    if (!query) return songs;
    return songs.filter(song => song.title.toLowerCase().includes(query) || song.lyrics.toLowerCase().includes(query) || (song.artist && song.artist.toLowerCase().includes(query)));
  });

  getLastPlayed(songId: string): string | null {
    const cultos = this.songService.cultos();
    const playedIn = cultos.filter(c => c.songIds.includes(songId));
    if (playedIn.length === 0) return null;
    const lastCulto = playedIn[0];
    const [y, m, d] = lastCulto.date.split('-');
    return `${d}/${m}/${y}`;
  }

  // --- FUNÇÃO AUXILIAR DE LIMPEZA ---
  // Remove acentos e espaços extras (ex: "CORAÇÃO " vira "CORACAO")
  normalizeText(text: string): string {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .trim()
      .toUpperCase();
  }
  // ----------------------------------

  openAddModal() { this.editingSong.set(null); this.isModalOpen.set(true); }
  openEditModal(song: Song) { this.editingSong.set(song); this.isModalOpen.set(true); }
  closeModal() { this.isModalOpen.set(false); this.editingSong.set(null); }
  
  onSaveSong(songData: any) {
    const currentSong = this.editingSong();
    
    // Converte para maiúsculo para salvar bonito no banco
    const upperTitle = songData.title.trim().toUpperCase();
    const upperArtist = songData.artist ? songData.artist.trim().toUpperCase() : '';
    const upperKey = songData.key ? songData.key.trim().toUpperCase() : '';

    const normalizedData = {
      ...songData,
      title: upperTitle,
      artist: upperArtist,
      key: upperKey
    };

    // --- VERIFICAÇÃO DE DUPLICIDADE (AGORA IGNORANDO ACENTOS) ---
    if (!currentSong) {
      // 1. Limpa o texto que o usuário digitou (remove acento)
      const inputLimpo = this.normalizeText(upperTitle);
      console.log('Tentando salvar:', inputLimpo);

      // 2. Compara com cada música do banco (também limpando o acento delas)
      const exists = this.songService.songs().some(song => {
        const bancoLimpo = this.normalizeText(song.title);
        // console.log(`Comparando com: ${bancoLimpo}`); // Descomente se precisar debugar muito
        return bancoLimpo === inputLimpo;
      });

      if (exists) {
        alert(`⚠️ Atenção: A música "${upperTitle}" já está cadastrada no sistema!\n\n(Verificamos que já existe um título igual ou muito parecido).`);
        return; 
      }
    }
    // ----------------------------------

    if (currentSong) this.songService.updateSong(currentSong.id, normalizedData);
    else this.songService.addSong(normalizedData);
    
    this.closeModal(); 
    this.triggerToast();
  }

  confirmDelete(song: Song) { if (confirm(`Tem certeza que deseja excluir "${song.title}"?`)) { this.songService.deleteSong(song.id); this.triggerToast(); } }
  viewSong(song: Song) { this.selectedSong.set(song); }
  closeViewModal() { this.selectedSong.set(null); }
  triggerToast() { this.showToast.set(true); setTimeout(() => { this.showToast.set(false); }, 3000); }

  getSafeEmbedUrl(url: string): SafeResourceUrl | null {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      const videoId = match[2];
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
    return null;
  }

  getLetrasSearchUrl(song: Song): string {
    const query = encodeURIComponent(`${song.title} ${song.artist}`);
    return `https://www.letras.mus.br/?q=${query}`;
  }

  async deleteAllSongs() {
    const confirm1 = confirm("ATENÇÃO: Você tem certeza que deseja EXCLUIR TODAS as músicas?");
    if (!confirm1) return;
    const confirm2 = confirm("Isso apaga o banco de dados inteiro. Confirma?");
    if (!confirm2) return;
    const songs = this.songService.songs();
    if (songs.length === 0) { alert('O banco de dados já está vazio!'); return; }
    let count = 0;
    for (const song of songs) { await this.songService.deleteSong(song.id); count++; }
    alert(`Limpeza concluída! ${count} músicas foram removidas.`);
    window.location.reload();
  }
}