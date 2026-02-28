import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { SongService } from '../../services/song.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-background-light dark:bg-background-dark p-6 pb-20 font-display no-print">
      <div class="max-w-4xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-black text-[#101810] dark:text-white">Cultos</h1>
          <p class="text-gray-500 dark:text-gray-400">Planeje e organize seus próximos eventos</p>
        </div>
        <a routerLink="/" class="text-primary font-bold hover:underline">Voltar</a>
      </div>

      @if (auth.currentUser()) {
        <div class="max-w-4xl mx-auto bg-white dark:bg-[#1a2e1a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 mb-8">
          
          <h3 class="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">{{ editingId() ? 'edit_calendar' : 'add_circle' }}</span>
            {{ editingId() ? 'Editar Culto' : 'Agendar Novo Culto' }}
          </h3>
          
          <form [formGroup]="form" (ngSubmit)="save()" class="flex flex-col gap-4">
            <div class="flex flex-col md:flex-row gap-4">
              <input type="text" formControlName="title" placeholder="Nome do Evento (ex: Culto de Jovens)" class="flex-1 h-12 px-4 rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
              <input type="date" formControlName="date" class="h-12 px-4 rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
            </div>

            <div class="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10">
              <p class="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Selecione o Vocal:</p>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                @for (member of songService.vocalTeam(); track member) {
                  <label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white dark:hover:bg-white/5 transition-colors">
                    <input type="checkbox" 
                           [checked]="selectedVocals().includes(member)" 
                           (change)="toggleVocal(member)"
                           class="w-5 h-5 rounded text-primary focus:ring-primary bg-gray-100 border-gray-300">
                    <span class="text-gray-700 dark:text-gray-200 font-medium">{{ member }}</span>
                  </label>
                }
              </div>
            </div>
            
            <div class="flex gap-2 justify-end mt-2">
              @if (editingId()) {
                <button type="button" (click)="cancelEdit()" class="h-12 px-6 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  Cancelar
                </button>
              }

              <button type="submit" [disabled]="form.invalid" class="h-12 px-8 bg-primary text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors shadow-lg shadow-green-900/10">
                {{ editingId() ? 'Salvar' : 'Agendar' }}
              </button>
            </div>
          </form>
        </div>
      }

      <div class="max-w-4xl mx-auto flex gap-4 mb-6 border-b border-gray-200 dark:border-white/10 pb-1">
        <button (click)="viewMode.set('upcoming')" 
                [class.text-primary]="viewMode() === 'upcoming'"
                [class.border-b-2]="viewMode() === 'upcoming'"
                [class.border-primary]="viewMode() === 'upcoming'"
                class="pb-2 font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors flex items-center gap-2">
          <span class="material-symbols-outlined text-lg">event_upcoming</span> Próximos Eventos
        </button>
        <button (click)="viewMode.set('history')" 
                [class.text-primary]="viewMode() === 'history'"
                [class.border-b-2]="viewMode() === 'history'"
                [class.border-primary]="viewMode() === 'history'"
                class="pb-2 font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors flex items-center gap-2">
          <span class="material-symbols-outlined text-lg">history</span> Histórico
        </button>
      </div>

      <div class="max-w-4xl mx-auto space-y-10">
        @for (group of groupedCultos(); track group.monthYear) {
          <section class="animate-[fadeIn_0.5s_ease-out]">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-4 flex-1">
                <h2 class="text-xl font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{{ group.monthLabel }}</h2>
                <div class="h-px flex-1 bg-gray-200 dark:bg-white/10"></div>
              </div>
              <div class="flex gap-2 ml-4">
                <button (click)="printMonth(group)" class="flex items-center gap-2 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-lg shadow-sm transition-colors" title="Imprimir escala">
                  <span class="material-symbols-outlined text-[16px]">print</span>
                </button>
                <button (click)="shareMonth(group)" class="flex items-center gap-2 px-3 py-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold rounded-lg shadow-sm transition-colors" title="Enviar escala completa no WhatsApp">
                  <span class="material-symbols-outlined text-[16px]">share</span>
                  Escala
                </button>
              </div>
            </div>

            <div class="grid gap-3">
              @for (culto of group.cultos; track culto.id) {
                <div [class.opacity-60]="viewMode() === 'history'" class="group bg-white dark:bg-[#1a2e1a] p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-primary/30 dark:hover:border-primary/30 transition-all flex justify-between items-center relative overflow-hidden">
                  <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-gray-100 dark:bg-white/5 group-hover:bg-primary transition-colors"></div>
                  <a [routerLink]="['/services', culto.id]" class="flex-1 cursor-pointer pl-4">
                    <div class="flex items-center gap-3 mb-1">
                      <div class="flex items-center gap-1 font-bold text-sm px-2 py-0.5 rounded-md" [ngClass]="viewMode() === 'history' ? 'bg-gray-100 text-gray-500' : 'bg-primary/10 text-primary'">
                        <span class="material-symbols-outlined text-[16px]">calendar_today</span>
                        {{ getDay(culto.date) }}
                      </div>
                      <span class="text-xs text-gray-400 font-medium">• {{ getWeekDay(culto.date) }}</span>
                      <span class="text-xs text-gray-400 font-medium">• {{ culto.songIds.length }} músicas</span>
                    </div>
                    <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{{ culto.title }}</h3>
                    
                    @if(culto.vocals && culto.vocals.length > 0) {
                      <p class="text-xs text-gray-500 mt-1">🎤 {{ culto.vocals.join(', ') }}</p>
                    }
                  </a>
                  
                  @if (auth.currentUser()) {
                    <div class="flex items-center gap-1 pl-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button (click)="notifyShortcut(culto)" class="p-2 text-gray-300 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-colors" title="Notificar Igreja">
                        <span class="material-symbols-outlined">campaign</span>
                      </button>

                      <button (click)="startEdit(culto)" class="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors" title="Editar Culto">
                        <span class="material-symbols-outlined">edit</span>
                      </button>
                      <button (click)="delete(culto.id)" class="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors" title="Excluir Culto">
                        <span class="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  }
                </div>
              }
            </div>
          </section>
        } @empty {
          <div class="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10">
            <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">
              {{ viewMode() === 'history' ? 'history' : 'event_busy' }}
            </span>
            <h3 class="text-xl font-bold text-gray-500 dark:text-gray-400">
              {{ viewMode() === 'history' ? 'Nenhum culto no histórico' : 'Nenhum evento futuro agendado' }}
            </h3>
            @if (viewMode() === 'upcoming') {
              <p class="text-gray-400 text-sm mt-2">Use o formulário acima para planejar os próximos eventos.</p>
            }
          </div>
        }
      </div>
    </div>

    <div class="hidden print:block print:bg-white print:text-black print:p-8">
      @if (printGroup(); as group) {
        <div class="text-center mb-8 border-b-2 border-black pb-4">
          <h1 class="text-3xl font-black uppercase">ESCALA DE LOUVOR</h1>
          <h2 class="text-xl uppercase text-gray-600">{{ group.monthLabel }}</h2>
          <p class="text-sm mt-2">PIB CROATÁ</p>
        </div>
        <div class="space-y-6">
          @for (culto of group.cultos; track culto.id) {
            <div class="break-inside-avoid border border-gray-300 rounded-lg p-4 shadow-sm">
              <div class="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
                <div>
                  <h3 class="text-xl font-bold uppercase">{{ getDay(culto.date) }} - {{ culto.title }}</h3>
                  <p class="text-sm text-gray-600">{{ getWeekDay(culto.date) }}</p>
                </div>
              </div>
              @if (culto.vocals && culto.vocals.length > 0) {
                 <div class="mb-3 text-sm"><span class="font-bold">🎤 VOCAL:</span> {{ culto.vocals.join(', ') }}</div>
              } @else {
                 <div class="mb-3 text-sm italic text-gray-500">🎤 Vocal: A definir</div>
              }
              <div>
                <span class="font-bold text-sm block mb-2">🎵 REPERTÓRIO:</span>
                @if (culto.songIds.length > 0) {
                  <ul class="list-decimal list-inside text-sm space-y-2">
                    @for (songId of culto.songIds; track songId) {
                      @if (getSongDetails(songId); as song) {
                        <li class="pl-1">
                          <span class="font-medium text-base">{{ song.title }}</span>
                          @if(song.key) { <span class="text-xs border border-black px-1 rounded ml-1 align-middle">{{ song.key }}</span> }
                          
                          @if (song.youtubeUrl) { 
                            <div class="text-[10px] text-gray-500 mt-0.5 ml-4 break-all">
                              ▶️ <a [href]="song.youtubeUrl" target="_blank" class="text-blue-600 underline hover:text-blue-800">{{ song.youtubeUrl }}</a>
                            </div> 
                          }
                        </li>
                      }
                    }
                  </ul>
                } @else {
                  <p class="text-sm italic text-gray-500">Músicas não selecionadas.</p>
                }
              </div>
            </div>
          }
        </div>
        <div class="mt-8 text-center text-xs text-gray-400 border-t pt-4">Gerado pelo Sistema de Louvores</div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    @media print {
      .no-print { display: none !important; }
      body { background-color: white !important; color: black !important; }
      .break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
    }
  `]
})
export class ServicesListComponent {
  songService = inject(SongService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  
  editingId = signal<string | null>(null);
  printGroup = signal<any>(null);
  selectedVocals = signal<string[]>([]);

  // 🧹 SINAL QUE CONTROLA AS ABAS (Por padrão mostra os próximos cultos)
  viewMode = signal<'upcoming' | 'history'>('upcoming');

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    date: new FormControl(new Date().toISOString().split('T')[0], Validators.required)
  });

  // 🧹 LÓGICA DA VASSOURA MÁGICA: Filtra os cultos antes de agrupar
  groupedCultos = computed(() => {
    const allCultos = this.songService.cultos();
    const todayStr = new Date().toISOString().split('T')[0]; // Pega a data de hoje YYYY-MM-DD
    const mode = this.viewMode();

    // Filtra a lista inteira baseada na aba selecionada
    const filteredCultos = allCultos.filter(c => {
      if (mode === 'upcoming') {
        return c.date >= todayStr; // Cultos de hoje em diante
      } else {
        return c.date < todayStr;  // Cultos do passado
      }
    });

    // O resto da função de agrupar por mês continua igualzinho!
    const groups: { [key: string]: any[] } = {};
    filteredCultos.forEach(c => {
      const monthKey = c.date.substring(0, 7); 
      if (!groups[monthKey]) { groups[monthKey] = []; }
      groups[monthKey].push(c);
    });
    
    Object.keys(groups).forEach(key => {
        // Na aba próximos, a ordem é do mais perto pro mais longe (Crescente). No histórico é invertido (Decrescente)
        if (mode === 'upcoming') {
          groups[key].sort((a, b) => a.date.localeCompare(b.date)); 
        } else {
          groups[key].sort((a, b) => b.date.localeCompare(a.date));
        }
    });

    return Object.keys(groups).sort((a, b) => {
        // Ordena os meses. Se for próximo culto, mostra o mês atual primeiro. Se for histórico, mostra o mais recente que passou.
        return mode === 'upcoming' ? a.localeCompare(b) : b.localeCompare(a);
      }).map(key => {
        const [year, month] = key.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
        return {
          monthYear: key,
          monthLabel: dateObj.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
          cultos: groups[key]
        };
      });
  });

  toggleVocal(name: string) {
    const current = this.selectedVocals();
    if (current.includes(name)) {
      this.selectedVocals.set(current.filter(n => n !== name));
    } else {
      this.selectedVocals.set([...current, name]);
    }
  }

  save() {
    if (this.form.invalid) return;

    if (this.editingId()) {
      this.songService.updateCulto(this.editingId()!, {
        title: this.form.value.title!,
        date: this.form.value.date!,
        vocals: this.selectedVocals()
      });
      this.cancelEdit();
    } else {
      this.songService.addCulto({
        title: this.form.value.title!,
        date: this.form.value.date!,
        vocals: this.selectedVocals(),
        leader: ''
      });
      this.form.reset({ date: new Date().toISOString().split('T')[0] });
      this.selectedVocals.set([]);
      
      // Ao salvar um culto, joga o usuário para a aba de "Próximos Eventos" pra ele ver o que acabou de criar
      this.viewMode.set('upcoming');
    }
  }

  startEdit(culto: any) {
    this.editingId.set(culto.id);
    this.form.patchValue({ title: culto.title, date: culto.date });
    this.selectedVocals.set(culto.vocals || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.form.reset({ date: new Date().toISOString().split('T')[0] });
    this.selectedVocals.set([]);
  }

  delete(id: string) { if(confirm('Tem certeza que deseja excluir este culto?')) this.songService.deleteCulto(id); }
  getDay(dateStr: string) { return dateStr.split('-')[2]; }
  getWeekDay(dateStr: string) { const date = new Date(dateStr + 'T12:00:00'); return date.toLocaleDateString('pt-BR', { weekday: 'long' }); }
  getSongDetails(id: string) { return this.songService.songs().find(s => s.id === id); }

  printMonth(group: any) {
    this.printGroup.set(group);
    const originalTitle = document.title;
    document.title = `Escala PIB Croatá - ${group.monthLabel.toUpperCase()}`;
    setTimeout(() => {
        window.print();
        setTimeout(() => { document.title = originalTitle; }, 500);
    }, 100);
  }
  
  shareMonth(group: any) {
    // 🛡️ VACINA WHATSAPP APLICADA AQUI TAMBÉM
    let text = `🗓️ *ESCALA DE ${group.monthLabel.toUpperCase()}*\n_PIB CROATÁ_\n\n🔗 *Acesse os detalhes no sistema:*\n${window.location.origin}\n`;
    const allSongs = this.songService.songs();
    group.cultos.forEach((culto: any) => {
        const day = this.getDay(culto.date);
        text += `\n〰️〰️〰️〰️〰️〰️〰️〰️\n\n📌 *DIA ${day} - ${culto.title}*\n\n`;
        if (culto.vocals && culto.vocals.length > 0) {
            text += `🎤 *Vocal:* ${culto.vocals.join(', ')}\n\n`;
        } else {
            text += `🎤 *Vocal:* (A definir)\n\n`;
        }
        text += `🎵 *Repertório:*\n`;
        if (culto.songIds.length === 0) { text += `(Ainda sem músicas)\n`; } else {
            culto.songIds.forEach((songId: string, index: number) => {
                const song = allSongs.find(s => s.id === songId);
                if (song) {
                    const key = song.key ? `(${song.key})` : '';
                    text += `${index + 1}. ${song.title} ${key}\n`;
                    if (song.youtubeUrl) { text += `▶️ ${song.youtubeUrl}\n`; }
                    text += `\n`;
                }
            });
        }
    });
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  }

  notifyShortcut(culto: any) {
    const day = this.getDay(culto.date);
    const monthLabel = new Date(culto.date + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short' });
    
    const title = `Nova Escala: ${culto.title}`;
    const body = `📅 ${day} de ${monthLabel} - A lista de louvores já está no App. Confira!`;
    
    const textToCopy = `TÍTULO:\n${title}\n\nTEXTO:\n${body}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      this.toast.show('Copiado! Cole no Firebase.', 'info');
      window.open('https://console.firebase.google.com/project/louvores-gpv/messaging', '_blank');
    }).catch(err => {
      this.toast.show('Erro ao copiar.', 'error');
    });
  }
}