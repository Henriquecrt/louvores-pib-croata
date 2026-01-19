import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Song, SongService } from '../services/song.service';

@Component({
  selector: 'app-add-song-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" (click)="closeModal()"></div>

        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a2e1a] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-white/10">
            
            <div class="bg-gray-50 dark:bg-white/5 px-6 py-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white" id="modal-title">
                {{ songToEdit ? 'Editar Louvor' : 'Novo Louvor' }}
              </h3>
              <button (click)="closeModal()" class="text-gray-400 hover:text-gray-500 dark:hover:text-white transition-colors">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            @if (!songToEdit && !isImporting) {
              <div class="px-6 pt-4 pb-0 space-y-3">
                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-800 dark:text-blue-200 border border-blue-100 dark:border-blue-900/30">
                  <strong>💡 Dica Inteligente:</strong><br>
                  Pode subir a planilha completa sempre!<br>
                  • Se a música já existir, o sistema <strong>atualiza</strong>.<br>
                  • Se for nova, o sistema <strong>adiciona</strong>.
                </div>

                <label class="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all group">
                  <div class="flex flex-col items-center">
                    <span class="material-symbols-outlined text-gray-400 group-hover:text-green-600 mb-2 text-3xl">table_view</span>
                    <span class="text-gray-600 dark:text-gray-300 group-hover:text-green-700 font-bold">Importar Planilha CSV</span>
                    <span class="text-xs text-gray-400 mt-1">Excel, Google Sheets (.csv)</span>
                  </div>
                  <input type="file" class="hidden" accept=".csv,text/csv" (change)="onFileSelected($event)">
                </label>
              </div>
            }

            @if (isImporting) {
              <div class="px-6 py-10 text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                <p class="text-gray-700 dark:text-white font-bold text-lg">Processando Planilha...</p>
                <p class="text-sm text-gray-500 mt-2">{{ importStatus }}</p>
              </div>
            } @else {
              <div class="px-6 py-6 space-y-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título da Música</label>
                  <input [(ngModel)]="formData.title" type="text" class="w-full rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Ex: Bondade de Deus">
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Artista/Cantor</label>
                    <input [(ngModel)]="formData.artist" type="text" class="w-full rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="Ex: Isaías Saad">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tom</label>
                    <input [(ngModel)]="formData.key" type="text" class="w-full rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="Ex: G">
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link do YouTube (Opcional)</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="material-symbols-outlined text-gray-400">play_circle</span>
                    </div>
                    <input [(ngModel)]="formData.youtubeUrl" type="text" class="w-full pl-10 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="Cole o link do vídeo aqui">
                  </div>
                </div>

                <div>
                  <div class="flex justify-between items-center mb-1">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Letra</label>
                      <a [href]="getLetrasSearchUrl()" target="_blank" class="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center gap-1 transition-colors bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md">
                          <span class="material-symbols-outlined text-[14px]">search</span> Buscar no Letras
                      </a>
                  </div>
                  <textarea [(ngModel)]="formData.lyrics" rows="8" class="w-full rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none font-mono text-sm leading-relaxed" placeholder="Cole a letra aqui..."></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (separadas por vírgula)</label>
                  <input [(ngModel)]="formData.tags" type="text" class="w-full rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="Ex: adoração, santa ceia, animada">
                </div>
              </div>

              <div class="bg-gray-50 dark:bg-white/5 px-6 py-4 flex flex-row-reverse gap-3 border-t border-gray-100 dark:border-white/10">
                <button (click)="submit()" [disabled]="!isValid()" class="w-full sm:w-auto inline-flex justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  {{ songToEdit ? 'Salvar Alterações' : 'Adicionar Louvor' }}
                </button>
                <button (click)="closeModal()" class="w-full sm:w-auto mt-3 sm:mt-0 inline-flex justify-center rounded-xl bg-white dark:bg-transparent px-6 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                  Cancelar
                </button>
              </div>
            }

          </div>
        </div>
      </div>
    }
  `
})
export class AddSongModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() songToEdit: Song | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  private songService = inject(SongService);

  formData = {
    title: '',
    artist: '',
    key: '',
    lyrics: '',
    tags: '',
    youtubeUrl: '' 
  };

  isImporting = false;
  importStatus = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['songToEdit'] && this.songToEdit) {
      this.formData = { ...this.songToEdit, youtubeUrl: this.songToEdit.youtubeUrl || '' } as any;
    } else if (changes['isOpen'] && this.isOpen && !this.songToEdit) {
      this.resetForm();
    }
  }

  resetForm() {
    this.formData = { title: '', artist: '', key: '', lyrics: '', tags: '', youtubeUrl: '' };
    this.isImporting = false;
  }

  isValid() {
    return this.formData.title.trim() && this.formData.lyrics.trim();
  }

  submit() {
    if (this.isValid()) this.save.emit(this.formData);
  }

  closeModal() {
    this.close.emit();
  }

  getLetrasSearchUrl(): string {
    const query = encodeURIComponent(`${this.formData.title} ${this.formData.artist}`);
    return `https://www.letras.mus.br/?q=${query}`;
  }

  // --- LÓGICA DE IMPORTAÇÃO CSV INTELIGENTE (SEM DUPLICATAS) ---
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.isImporting = true;
    this.importStatus = 'Lendo arquivo CSV...';

    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');

    reader.onload = async (e: any) => {
      let content = e.target.result;
      const lines = content.split(/\r\n|\n/);
      
      let total = lines.length;
      let added = 0;
      let updated = 0;

      // Pega a lista atual de músicas para comparar
      const currentSongs = this.songService.songs();

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue; 

        // Separar por Ponto e Vírgula (;)
        const parts = line.split(';');

        if (parts.length >= 2) {
            const title = parts[0].replace(/^"|"$/g, '').trim();
            const artist = parts[1].replace(/^"|"$/g, '').trim();
            
            let lyrics = '';
            if (parts.length >= 3) {
                lyrics = parts.slice(2).join(';').replace(/^"|"$/g, '').trim();
                lyrics = lyrics.replace(/""/g, '"');
            }

            if (title && lyrics) {
                // --- AQUI ESTÁ A INTELIGÊNCIA ANTI-DUPLICIDADE ---
                
                // Procura se já existe música com esse título (ignorando maiúsculas/minúsculas)
                const existingSong = currentSongs.find(s => s.title.toLowerCase() === title.toLowerCase());

                if (existingSong) {
                    // SE EXISTE: ATUALIZA
                    this.importStatus = `Atualizando: ${title}`;
                    await this.songService.updateSong(existingSong.id, {
                        title: title,   // Atualiza caso tenha corrigido maiusculas/minusculas
                        artist: artist || existingSong.artist,
                        lyrics: lyrics,
                        // Não mexe no tom, tags ou youtube se já existiam
                    });
                    updated++;
                } else {
                    // SE NÃO EXISTE: CRIA NOVA
                    this.importStatus = `Adicionando: ${title}`;
                    await this.songService.addSong({
                        title: title,
                        artist: artist || 'Desconhecido',
                        key: '',
                        lyrics: lyrics,
                        tags: 'Importado CSV',
                        youtubeUrl: ''
                    });
                    added++;
                }
            }
        }
        
        // Pausa pra não travar
        if (i % 20 === 0) await new Promise(r => setTimeout(r, 10));
      }

      this.importStatus = 'Concluído!';
      setTimeout(() => {
        this.closeModal();
        alert(`Relatório da Importação:\n\n✅ ${added} novas músicas adicionadas.\n🔄 ${updated} músicas antigas atualizadas.\n\nTotal processado com sucesso!`);
        window.location.reload();
      }, 500);
    };
  }
}