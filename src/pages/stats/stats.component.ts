import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-background-light dark:bg-background-dark p-6 pb-20 font-display">
      
      <div class="max-w-4xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-black text-[#101810] dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-yellow-500 text-4xl">equalizer</span> 
            Estatísticas
          </h1>
          <p class="text-gray-500 dark:text-gray-400">O termômetro do seu repertório</p>
        </div>
        <a routerLink="/" class="text-primary font-bold hover:underline">Voltar</a>
      </div>

      <div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        
        <div class="bg-white dark:bg-[#1a2e1a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
          <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-orange-500">local_fire_department</span>
            Mais Tocadas (Top 10)
          </h2>
          
          <div class="space-y-4">
            @for (song of topSongs(); track song.id; let i = $index) {
              <div class="relative">
                <div class="flex justify-between items-center mb-1 relative z-10">
                  <div class="flex items-center gap-3">
                    <span class="font-black text-gray-300 text-lg w-6">{{ i + 1 }}</span>
                    <div>
                      <div class="font-bold text-gray-800 dark:text-gray-200">{{ song.title }}</div>
                      <div class="text-xs text-gray-400">{{ song.artist }}</div>
                    </div>
                  </div>
                  <div class="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-xs">
                    {{ song.views || 0 }}x
                  </div>
                </div>
                <div class="h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" 
                       [style.width.%]="getPercent(song.views)"></div>
                </div>
              </div>
            } @empty {
              <p class="text-gray-400 text-center py-4">Nenhum dado ainda.</p>
            }
          </div>
        </div>

        <div class="bg-white dark:bg-[#1a2e1a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
          <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-blue-400">ac_unit</span>
            Nunca Tocadas
          </h2>
          <p class="text-sm text-gray-400 mb-4">Sugestões para resgatar:</p>

          <div class="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
            @for (song of zeroSongs(); track song.id) {
              <div class="p-3 rounded-lg border border-dashed border-gray-200 dark:border-white/10 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                 <div>
                    <div class="font-medium text-gray-700 dark:text-gray-300">{{ song.title }}</div>
                    <div class="text-xs text-gray-400">{{ song.artist }}</div>
                 </div>
                 <span class="text-xs font-bold text-gray-300">0x</span>
              </div>
            } @empty {
              <p class="text-green-500 font-bold text-center py-4">Parabéns! Vocês já tocaram tudo!</p>
            }
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [` .custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; } `]
})
export class StatsComponent {
  songService = inject(SongService);

  // Computa as top 10 músicas ordenadas por views
  topSongs = computed(() => {
    return this.songService.songs()
      .filter(s => (s.views || 0) > 0) // Só pega quem tem views
      .sort((a, b) => (b.views || 0) - (a.views || 0)) // Ordena do maior pro menor
      .slice(0, 10); // Pega só as 10 primeiras
  });

  // Computa as músicas com 0 views
  zeroSongs = computed(() => {
    return this.songService.songs()
      .filter(s => !s.views || s.views === 0)
      .sort((a, b) => a.title.localeCompare(b.title));
  });

  // Calcula a porcentagem para a barrinha colorida
  getPercent(views: number | undefined): number {
    const maxViews = this.topSongs()[0]?.views || 1;
    return ((views || 0) / maxViews) * 100;
  }
}