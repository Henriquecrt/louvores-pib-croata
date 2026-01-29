import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SongService, Song } from '../../services/song.service';
import { AuthService } from '../../services/auth.service';
import { AddSongModalComponent } from '../../components/add-song-modal.component';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, AddSongModalComponent],
  template: `
    <div class="min-h-screen bg-background-light dark:bg-background-dark pb-20 font-display no-print">
      
      <div class="bg-white dark:bg-[#1a2e1a] border-b border-gray-100 dark:border-white/5 px-6 py-6 sticky top-0 z-40 shadow-sm transition-colors">
        <div class="max-w-4xl mx-auto">
          <a routerLink="/services" class="text-sm text-gray-500 hover:text-primary mb-2 inline-flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">arrow_back</span> Voltar para Lista
          </a>
          @if (culto(); as c) {
            <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">{{ c.title }}</h1>
                <p class="text-primary font-medium">{{ formatDate(c.date) }} • {{ songsInCulto().length }} músicas</p>
              </div>

              <div class="flex gap-2">
                <button (click)="printPage()" class="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold rounded-xl shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 text-sm">
                  <span class="material-symbols-outlined text-[20px]">print</span> Imprimir
                </button>
                <button (click)="shareOnWhatsApp()" class="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl shadow-lg transition-colors duration-200 text-sm">
                  <span class="material-symbols-outlined text-[20px]">share</span> WhatsApp
                </button>
              </div>
            </div>
          }
        </div>
      </div>

      <div class="max-w-4xl mx-auto p-6 grid gap-8" [ngClass]="{'md:grid-cols-2': auth.currentUser()}">
        
        <div class="space-y-6">
          
          @if (culto()?.vocals?.length) {
             <div class="bg-white dark:bg-[#1a2e1a] p-5 rounded-xl shadow-sm border-l-4 border-purple-500">
                <h2 class="text-lg font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-3">
                  <span class="material-symbols-outlined text-purple-500">mic</span> Equipe de Vocal
                </h2>
                <div class="flex flex-wrap gap-2">
                  @for (vocal of culto()?.vocals; track vocal) {
                    <span class="inline-flex items-center gap-1 pl-3 pr-2 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-100 dark:border-purple-800 group">
                       <span class="material-symbols-outlined text-[16px]">person</span> 
                       {{ vocal }}
                       @if (auth.currentUser()) {
                         <button (click)="removeVocal(vocal)" class="ml-1 p-0.5 hover:bg-purple-200 dark:hover:bg-purple-700 rounded-full transition-colors text-purple-400 hover:text-red-500" title="Remover da equipe">
                            <span class="material-symbols-outlined text-[16px] block">close</span>
                         </button>
                       }
                    </span>
                  }
                </div>
             </div>
          }

          <div class="space-y-4">
            <h2 class="text-lg font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <span class="material-symbols-outlined">queue_music</span> Músicas Selecionadas
            </h2>
            
            <div class="space-y-2">
              @for (song of songsInCulto(); track song.id; let i = $index) {
                <div (click)="viewSong(song)" class="bg-white dark:bg-[#253825] p-4 rounded-xl shadow-sm border-l-4 border-primary flex justify-between items-center group cursor-pointer hover:shadow-md transition-all">
                  <div class="flex items-center gap-3">
                    <span class="text-xl font-bold text-primary/40">#{{ i + 1 }}</span>
                    <div>
                      <div class="font-bold text-gray-900 dark:text-white">{{ song.title }}</div>
                      <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{{ song.artist }}</span>
                        @if(song.key) { <span class="px-1.5 py-0.5 border border-gray-200 dark:border-gray-600 rounded text-[10px]">{{ song.key }}</span> }
                      </div>
                    </div>
                  </div>
                  
                  @if (auth.currentUser()) {
                    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        
                        <div class="flex flex-col mr-2">
                          <button (click)="$event.stopPropagation(); moveSong(i, -1)" 
                            [class.invisible]="i === 0"
                            class="p-0.5 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors" title="Subir">
                            <span class="material-symbols-outlined text-lg block">keyboard_arrow_up</span>
                          </button>
                          <button (click)="$event.stopPropagation(); moveSong(i, 1)" 
                            [class.invisible]="i === songsInCulto().length - 1"
                            class="p-0.5 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors" title="Descer">
                            <span class="material-symbols-outlined text-lg block">keyboard_arrow_down</span>
                          </button>
                        </div>

                        <button (click)="$event.stopPropagation(); openEditModal(song)" class="text-gray-300 hover:text-blue-500 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Editar Música">
                            <span class="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button (click)="$event.stopPropagation(); removeSong(song.id)" class="text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Remover do culto">
                            <span class="material-symbols-outlined text-[20px]">remove_circle</span>
                        </button>
                    </div>
                  }
                </div>
              } @empty {
                <div class="p-8 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl text-center text-gray-400">
                  Nenhuma música adicionada.
                </div>
              }
            </div>
          </div>
        </div>

        @if (auth.currentUser()) {
          <div class="space-y-6">
            <div class="bg-white dark:bg-[#1a2e1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 transition-colors">
              <h2 class="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined">search</span> Adicionar Músicas
              </h2>
              <div class="relative mb-4">
                <input [(ngModel)]="searchTerm" placeholder="Buscar no repertório..." class="w-full h-10 px-4 pl-10 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary/50 outline-none text-gray-900 dark:text-white">
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-sm">search</span>
              </div>
              <div class="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                @for (song of searchResults(); track song.id) {
                  <button (click)="addSong(song.id)" class="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 flex justify-between items-center group transition-colors">
                    <div>
                      <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ song.title }}</div>
                      <div class="text-xs text-gray-400">{{ song.artist }}</div>
                    </div>
                    <span class="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100">add_circle</span>
                  </button>
                }
              </div>
            </div>

            <div class="bg-white dark:bg-[#1a2e1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 transition-colors">
               <h2 class="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined">mic</span> Editar Equipe de Vocal
              </h2>
              
              <div class="grid grid-cols-2 gap-3 mb-4">
                @for (member of songService.vocalTeam(); track member) {
                  <label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/10">
                    <input type="checkbox" 
                           [checked]="culto()?.vocals?.includes(member)" 
                           (change)="toggleVocal(member)"
                           class="w-5 h-5 rounded text-primary focus:ring-primary bg-gray-100 border-gray-300">
                    <span class="text-gray-700 dark:text-gray-200 font-medium text-sm">{{ member }}</span>
                  </label>
                }
              </div>

              <div class="flex gap-2 pt-4 border-t border-gray-100 dark:border-white/10">
                <input 
                   [(ngModel)]="vocalName" 
                   (keyup.enter)="addVocal()"
                   placeholder="Outro nome (ex: Visitante)..." 
                   class="flex-1 h-10 px-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary/50 outline-none text-gray-900 dark:text-white text-sm"
                >
                <button (click)="addVocal()" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 rounded-lg font-bold text-sm transition-colors">
                  <span class="material-symbols-outlined text-[20px]">add</span>
                </button>
              </div>

            </div>
          </div>
        }
      </div>

      @if (selectedSong(); as song) {
        <div class="fixed inset-0 z-[70] overflow-y-auto" role="dialog" aria-modal="true">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" (click)="closeViewModal()"></div>
          <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a2e1a] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl animate-[slideIn_0.3s_ease-out_forwards] flex flex-col max-h-[90vh]">
              <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                <div class="flex flex-col">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{{ song.title }}</h2>
                  <div class="flex flex-wrap items-center gap-3 mt-1">
                    <div class="flex items-center gap-2">
                        <span class="text-primary font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[18px]">mic</span> {{ song.artist }}</span>
                        @if(song.key) { <span class="text-gray-400 text-sm">•</span> <span class="font-bold text-gray-700 dark:text-gray-300 text-sm border border-gray-300 dark:border-gray-600 px-2 rounded">Tom: {{ song.key }}</span> }
                    </div>
                  </div>
                </div>
                <button (click)="closeViewModal()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10"><span class="material-symbols-outlined text-2xl">close</span></button>
              </div>
              <div class="flex-1 overflow-y-auto p-6 md:p-8 bg-white dark:bg-[#1a2e1a]">
                @if (song.youtubeUrl) {
                    <div class="mb-6 aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-black">
                      <iframe class="w-full h-full" [src]="getSafeUrl(song.youtubeUrl)" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>
                }
                <pre class="whitespace-pre-wrap font-sans text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed text-center">{{ song.lyrics }}</pre>
              </div>
              <div class="px-6 py-4 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex justify-center">
                <button (click)="closeViewModal()" class="w-full sm:w-auto px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Fechar Leitura</button>
              </div>
            </div>
          </div>
        </div>
      }

      <app-add-song-modal 
        [isOpen]="isModalOpen()" 
        [songToEdit]="editingSong()" 
        (close)="closeModal()" 
        (save)="onSaveSong($event)">
      </app-add-song-modal>
    </div>

    <div class="hidden print:block print:bg-white print:text-black print:p-8">
      @if (culto(); as c) {
        <div class="text-center mb-8 border-b-2 border-black pb-4">
          <h1 class="text-4xl font-black uppercase mb-2">{{ c.title }}</h1>
          <p class="text-xl">Data: {{ formatDate(c.date) }}</p>
          @if (c.vocals && c.vocals.length > 0) {
            <div class="mt-4 p-4 border border-black rounded-lg inline-block">
              <span class="font-bold">🎤 EQUIPE DE VOCAL:</span> {{ c.vocals.join(', ') }}
            </div>
          }
        </div>
        <div class="space-y-10">
          @for (song of songsInCulto(); track song.id; let i = $index) {
            <div class="break-inside-avoid">
              <div class="flex items-center justify-between border-b border-gray-300 pb-2 mb-4">
                <h2 class="text-2xl font-bold">#{{ i + 1 }}. {{ song.title }}</h2>
                <div class="text-right">
                  <span class="block text-sm text-gray-600">{{ song.artist }}</span>
                  @if(song.key) { <span class="font-bold border border-black px-2 rounded">Tom: {{ song.key }}</span> }
                </div>
              </div>
              <pre class="whitespace-pre-wrap font-sans text-lg leading-relaxed text-center font-medium">{{ song.lyrics }}</pre>
            </div>
          }
        </div>
        <div class="mt-12 text-center text-xs text-gray-400 border-t pt-4">Gerado por LOUVORES PIB CROATÁ</div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
    @media print {
      .no-print { display: none !important; }
      body { background-color: white !important; color: black !important; }
      .break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
    }
  `]
})
export class ServiceDetailComponent {
  private route = inject(ActivatedRoute);
  songService = inject(SongService); 
  private sanitizer = inject(DomSanitizer);
  auth = inject(AuthService);
  
  cultoId = signal<string>('');
  searchTerm = signal('');
  vocalName = signal('');
  selectedSong = signal<Song | null>(null);
  isModalOpen = signal(false);
  editingSong = signal<Song | null>(null);

  constructor() { this.route.params.subscribe(params => this.cultoId.set(params['id'])); }

  culto = computed(() => this.songService.cultos().find(c => c.id === this.cultoId()));
  songsInCulto = computed(() => { const currentCulto = this.culto(); if (!currentCulto) return []; return currentCulto.songIds.map(id => this.songService.songs().find(s => s.id === id)).filter((s): s is Song => !!s); });
  searchResults = computed(() => { const term = this.searchTerm().toLowerCase(); const currentIds = this.culto()?.songIds || []; return this.songService.songs().filter(s => !currentIds.includes(s.id)).filter(s => s.title.toLowerCase().includes(term) || s.artist.toLowerCase().includes(term)).slice(0, 10); });

  addSong(songId: string) { this.songService.addSongToCulto(this.cultoId(), songId); this.searchTerm.set(''); }
  removeSong(songId: string) { if(confirm('Remover esta música do culto?')) { this.songService.removeSongFromCulto(this.cultoId(), songId); } }
  
  // FUNÇÃO NOVA: Reordenar
  async moveSong(index: number, direction: number) {
    const c = this.culto();
    if (!c || !c.songIds) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= c.songIds.length) return;
    const newIds = [...c.songIds];
    const temp = newIds[index];
    newIds[index] = newIds[newIndex];
    newIds[newIndex] = temp;
    await this.songService.updateCulto(c.id, { songIds: newIds });
  }

  toggleVocal(member: string) {
    const currentVocals = this.culto()?.vocals || [];
    if (currentVocals.includes(member)) {
        this.songService.removeVocalFromCulto(this.cultoId(), member);
    } else {
        this.songService.addVocalToCulto(this.cultoId(), member);
    }
  }

  addVocal() { 
    if (this.vocalName()) { 
      this.songService.addVocalToCulto(this.cultoId(), this.vocalName()); 
      this.vocalName.set(''); 
    } 
  }

  removeVocal(name: string) {
    if(confirm(`Remover ${name} da escala?`)) {
      this.songService.removeVocalFromCulto(this.cultoId(), name);
    }
  }

  viewSong(song: Song) { this.selectedSong.set(song); }
  closeViewModal() { this.selectedSong.set(null); }
  formatDate(dateStr: string) { const [y, m, d] = dateStr.split('-'); return `${d}/${m}/${y}`; }
  printPage() { window.print(); }
  openEditModal(song: Song) { this.editingSong.set(song); this.isModalOpen.set(true); }
  closeModal() { this.isModalOpen.set(false); this.editingSong.set(null); }
  onSaveSong(songData: any) { const currentSong = this.editingSong(); if (currentSong) { this.songService.updateSong(currentSong.id, songData); } this.closeModal(); }

  shareOnWhatsApp() {
    const currentCulto = this.culto();
    const songs = this.songsInCulto();
    if (!currentCulto) return;
    let text = `*CULTO - ${this.formatDate(currentCulto.date)}*\n`;
    if (currentCulto.vocals && currentCulto.vocals.length > 0) { text += `\n*🎤 EQUIPE DE VOCAL:*\n${currentCulto.vocals.join(', ')}\n`; }
    text += `\n*LISTA DE LOUVORES:*\n\n`;
    songs.forEach((song, index) => {
      const key = song.key ? `(${song.key})` : '';
      text += `*${index + 1}. ${song.title}* ${key}\n`;
      if (song.youtubeUrl) { text += `>> ${song.youtubeUrl}\n`; }
      text += `\n`;
    });
    text += `______________________________\n*Acompanhe a cifra e a letra aqui:*\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
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

  getLetrasSearchUrl(song: Song): string {
    const query = encodeURIComponent(`${song.title} ${song.artist}`);
    return `https://www.letras.mus.br/?q=${query}`;
  }
}