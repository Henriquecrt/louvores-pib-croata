import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { SongService, Song } from '../../services/song.service';
import { AuthService } from '../../services/auth.service';
import { AddSongModalComponent } from '../../components/add-song-modal.component';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, AddSongModalComponent],
  template: `
    <div class="min-h-screen bg-background-light dark:bg-background-dark p-6 pb-24 font-display">
      
      @if (culto(); as currentCulto) {
        <div class="max-w-4xl mx-auto">
          
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <a routerLink="/services" class="text-primary hover:underline flex items-center gap-1 text-sm font-bold">
                  <span class="material-symbols-outlined text-sm">arrow_back</span> Voltar
                </a>
              </div>
              <h1 class="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{{ currentCulto.title }}</h1>
              <p class="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                <span class="material-symbols-outlined text-sm">calendar_today</span>
                {{ formatDate(currentCulto.date) }}
                <span class="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                <span class="material-symbols-outlined text-sm">schedule</span>
                {{ getWeekDay(currentCulto.date) }}
              </p>
            </div>

            @if (auth.currentUser()) {
              <button (click)="isModalOpen.set(true)" class="bg-primary hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-900/20 flex items-center gap-2 transition-all active:scale-95 w-full md:w-auto justify-center">
                <span class="material-symbols-outlined">add</span>
                Adicionar Música
              </button>
            }
          </div>

          <div class="bg-white dark:bg-[#1a2e1a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 mb-8">
            <h3 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">mic</span> Equipe de Louvor
            </h3>
            
            @if (currentCulto.vocals && currentCulto.vocals.length > 0) {
              <div class="flex flex-wrap gap-2">
                @for (vocal of currentCulto.vocals; track vocal) {
                  <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 text-sm font-bold border border-blue-100 dark:border-blue-800/30">
                    <span class="w-2 h-2 rounded-full bg-blue-500"></span> {{ vocal }}
                  </span>
                }
              </div>
            } @else {
              <p class="text-gray-400 italic text-sm">Nenhum vocal definido para este culto.</p>
            }
          </div>

          <div class="space-y-4">
            <h3 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">queue_music</span> Repertório ({{ currentSongs().length }})
            </h3>

            @if (currentSongs().length === 0) {
              <div class="text-center py-16 bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10">
                <span class="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-2">music_off</span>
                <p class="text-gray-400">Nenhuma música adicionada ainda.</p>
              </div>
            }

            @for (song of currentSongs(); track song.id; let i = $index) {
              <div class="group bg-white dark:bg-[#1a2e1a] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-4 hover:border-primary/50 transition-colors">
                
                <div class="font-mono text-2xl font-bold text-gray-200 dark:text-white/10 w-8 text-center select-none">
                  {{ i + 1 }}
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-bold text-gray-900 dark:text-white truncate text-lg">{{ song.title }}</h3>
                    @if (song.key) {
                      <span class="px-1.5 py-0.5 rounded text-[10px] font-black bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 min-w-[24px] text-center">
                        {{ song.key }}
                      </span>
                    }
                  </div>
                  
                  <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span class="truncate">{{ song.artist }}</span>
                    @if (song.youtubeUrl) {
                      <a [href]="song.youtubeUrl" target="_blank" class="text-red-500 hover:text-red-600 flex items-center gap-1 text-xs font-bold bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full transition-colors" title="Ver no YouTube">
                        <span class="material-symbols-outlined text-[14px]">play_circle</span> Ouvir
                      </a>
                    }
                  </div>
                </div>

                @if (auth.currentUser()) {
                  <div class="flex items-center gap-1">
                    
                    <div class="flex flex-col mr-2">
                      <button 
                        (click)="moveSong(i, -1)" 
                        [disabled]="i === 0"
                        [class.invisible]="i === 0"
                        class="p-1 text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-white/10 rounded transition-colors" 
                        title="Subir">
                        <span class="material-symbols-outlined text-lg">keyboard_arrow_up</span>
                      </button>
                      
                      <button 
                        (click)="moveSong(i, 1)" 
                        [disabled]="i === currentSongs().length - 1"
                        [class.invisible]="i === currentSongs().length - 1"
                        class="p-1 text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-white/10 rounded transition-colors" 
                        title="Descer">
                        <span class="material-symbols-outlined text-lg">keyboard_arrow_down</span>
                      </button>
                    </div>

                    <div class="w-px h-8 bg-gray-100 dark:bg-white/10 mx-1"></div>

                    <button (click)="removeSong(song.id)" class="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors" title="Remover da escala">
                      <span class="material-symbols-outlined">remove_circle_outline</span>
                    </button>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="flex items-center justify-center min-h-[50vh]">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }

      <app-add-song-modal 
        [isOpen]="isModalOpen()" 
        (close)="isModalOpen.set(false)"
        (add)="addSong($event)">
      </app-add-song-modal>

    </div>
  `
})
export class ServiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private songService = inject(SongService);
  private router = inject(Router);
  public auth = inject(AuthService);

  isModalOpen = signal(false);
  cultoId = signal<string>('');

  // Pega o culto específico baseado no ID da URL
  culto = computed(() => 
    this.songService.cultos().find(c => c.id === this.cultoId())
  );

  // Pega a lista completa de detalhes das músicas desse culto
  currentSongs = computed(() => {
    const c = this.culto();
    if (!c || !c.songIds) return [];
    // Mapeia os IDs para os objetos de música reais, mantendo a ordem do array songIds
    return c.songIds
      .map(id => this.songService.songs().find(s => s.id === id))
      .filter((s): s is Song => !!s); // Remove undefined se alguma música tiver sido excluída
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.cultoId.set(id);
      else this.router.navigate(['/services']);
    });
  }

  async addSong(songId: string) {
    if (!this.cultoId()) return;
    try {
      await this.songService.addSongToCulto(this.cultoId(), songId);
      this.isModalOpen.set(false);
    } catch (error) {
      console.error(error);
      alert('Erro ao adicionar música.');
    }
  }

  async removeSong(songId: string) {
    if (!this.cultoId()) return;
    if (confirm('Remover esta música da escala?')) {
      await this.songService.removeSongFromCulto(this.cultoId(), songId);
    }
  }

  // --- NOVA FUNÇÃO DE REORDENAR ---
  async moveSong(index: number, direction: number) {
    const culto = this.culto();
    if (!culto || !culto.songIds) return;

    const newIndex = index + direction;
    // Proteção extra para não sair dos limites
    if (newIndex < 0 || newIndex >= culto.songIds.length) return;

    // Cria uma cópia da lista atual de IDs
    const newSongIds = [...culto.songIds];
    
    // Troca os itens de lugar (Magia do Array)
    const temp = newSongIds[index];
    newSongIds[index] = newSongIds[newIndex];
    newSongIds[newIndex] = temp;

    // Salva no banco de dados
    try {
      await this.songService.updateCulto(culto.id, { songIds: newSongIds });
    } catch (error) {
      console.error('Erro ao reordenar', error);
      alert('Erro ao mudar a ordem.');
    }
  }

  formatDate(dateStr: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  getWeekDay(dateStr: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', { weekday: 'long' });
  }
}