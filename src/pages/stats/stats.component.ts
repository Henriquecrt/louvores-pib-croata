import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-background-light dark:bg-background-dark p-6 pb-20 font-display">
      
      <div class="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div class="text-center md:text-left">
          <h1 class="text-3xl font-black text-[#101810] dark:text-white flex items-center justify-center md:justify-start gap-2">
            <span class="material-symbols-outlined text-yellow-500 text-4xl">equalizer</span> 
            Estatísticas
          </h1>
          <p class="text-gray-500 dark:text-gray-400">O termômetro do seu repertório</p>
        </div>
        
        <div class="bg-white dark:bg-[#1a2e1a] p-1.5 rounded-xl border border-gray-200 dark:border-white/10 flex shadow-sm">
          <button (click)="setPeriod('geral')" 
            class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
            [class.bg-primary]="period() === 'geral'"
            [class.text-white]="period() === 'geral'"
            [class.text-gray-500]="period() !== 'geral'">
            Geral
          </button>
          <button (click)="setPeriod('2026')" 
            class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
            [class.bg-primary]="period() === '2026'"
            [class.text-white]="period() === '2026'"
            [class.text-gray-500]="period() !== '2026'">
            2026
          </button>
          <button (click)="setPeriod('3meses')" 
            class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
            [class.bg-primary]="period() === '3meses'"
            [class.text-white]="period() === '3meses'"
            [class.text-gray-500]="period() !== '3meses'">
            3 Meses
          </button>
        </div>

        <a routerLink="/" class="text-primary font-bold hover:underline hidden md:block">Voltar</a>
      </div>

      <div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        
        <div class="bg-white dark:bg-[#1a2e1a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 animate-[fadeIn_0.3s]">
          <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
            <span class="material-symbols-outlined text-orange-500">local_fire_department</span>
            Mais Tocadas
          </h2>
          <p class="text-xs text-gray-400 mb-6 uppercase font-bold tracking-wider">
            {{ getPeriodLabel() }}
          </p>
          
          <div class="space-y-4">
            @for (song of statsData().ranked; track song.id; let i = $index) {
              <div class="relative group cursor-default">
                <div class="flex justify-between items-center mb-1 relative z-10">
                  <div class="flex items-center gap-3">
                    <span class="font-black text-gray-300 text-lg w-6">{{ i + 1 }}</span>
                    <div>
                      <div class="font-bold text-gray-800 dark:text-gray-200 leading-tight">{{ song.title }}</div>
                      <div class="text-xs text-gray-400">{{ song.artist }}</div>
                    </div>
                  </div>
                  <div class="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-xs">
                    {{ song.periodViews }}x
                  </div>
                </div>
                <div class="h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-1000 ease-out" 
                       [style.width.%]="getPercent(song.periodViews)"></div>
                </div>
              </div>
            } @empty {
              <div class="text-center py-10 opacity-60">
                <span class="material-symbols-outlined text-4xl text-gray-300">bar_chart</span>
                <p class="text-gray-400 text-sm mt-2">Nenhum dado neste período.</p>
              </div>
            }
          </div>
        </div>

        <div class="bg-white dark:bg-[#1a2e1a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 animate-[fadeIn_0.4s]">
          <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
            <span class="material-symbols-outlined text-blue-400">history_toggle_off</span>
            Para Resgatar
          </h2>
          <p class="text-xs text-gray-400 mb-6 font-medium">
            Músicas que ainda não foram cantadas em <strong>{{ getPeriodLabel() }}</strong>.
          </p>

          <div class="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
            @for (song of statsData().zero; track song.id) {
              <div class="p-3 rounded-lg border border-dashed border-gray-200 dark:border-white/10 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                 <div>
                    <div class="font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">{{ song.title }}</div>
                    <div class="text-xs text-gray-400">{{ song.artist }}</div>
                 </div>
                 <span class="text-[10px] font-bold text-gray-300 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">0x</span>
              </div>
            } @empty {
              <div class="text-center py-10">
                <span class="material-symbols-outlined text-4xl text-green-500 mb-2">check_circle</span>
                <p class="text-green-600 font-bold">Incrível!</p>
                <p class="text-gray-400 text-sm">Vocês já cantaram todo o repertório neste período.</p>
              </div>
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
  
  // Controle do Filtro
  period = signal<'geral' | '2026' | '3meses'>('geral');

  // Cálculos Inteligentes
  statsData = computed(() => {
    const p = this.period();
    const cultos = this.songService.cultos();
    const allSongs = this.songService.songs();
    
    // 1. Filtra os Cultos pela Data
    let filteredCultos = cultos;
    const now = new Date();
    
    if (p === '2026') {
       filteredCultos = cultos.filter(c => c.date.startsWith('2026'));
    } else if (p === '3meses') {
       const cutoff = new Date();
       cutoff.setDate(now.getDate() - 90);
       filteredCultos = cultos.filter(c => new Date(c.date + 'T12:00') >= cutoff);
    }

    // 2. Conta quantas vezes cada música tocou NESSES cultos filtrados
    const counts = new Map<string, number>();
    filteredCultos.forEach(c => {
       c.songIds?.forEach(id => {
          counts.set(id, (counts.get(id) || 0) + 1);
       });
    });

    // 3. Monta o Ranking (Top 10)
    const ranked = allSongs
       .map(song => ({ ...song, periodViews: counts.get(song.id) || 0 }))
       .filter(s => s.periodViews > 0)
       .sort((a, b) => b.periodViews - a.periodViews)
       .slice(0, 10);

    // 4. Monta a Lista de "Zero Views" (Oportunidades)
    const zero = allSongs
       .filter(s => !counts.has(s.id))
       .sort((a, b) => a.title.localeCompare(b.title));

    return { ranked, zero };
  });

  setPeriod(p: 'geral' | '2026' | '3meses') {
    this.period.set(p);
  }

  getPercent(views: number): number {
    const max = this.statsData().ranked[0]?.periodViews || 1;
    return (views / max) * 100;
  }

  getPeriodLabel() {
    switch(this.period()) {
      case 'geral': return 'Todo o Período';
      case '2026': return 'Ano de 2026';
      case '3meses': return 'Últimos 90 dias';
      default: return '';
    }
  }
}