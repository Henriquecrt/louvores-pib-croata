import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Service, ServiceService } from '../../services/service.service'; // Serviço de Cultos
import { SongService } from '../../services/song.service'; // Serviço de Músicas (para pegar os nomes na impressão)
import { AuthService } from '../../services/auth.service';
import { AddServiceModalComponent } from '../../components/add-service-modal.component';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AddServiceModalComponent],
  template: `
    <div class="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark no-print">
      
      <header class="sticky top-0 z-40 flex w-full items-center justify-between border-b border-solid border-[#dbece0] dark:border-white/10 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md px-6 py-4 lg:px-10 transition-colors">
        <div class="flex items-center gap-4 text-primary">
          <div class="flex items-center justify-center size-10 rounded-xl bg-[#e6f2e6] dark:bg-primary/20">
            <span class="material-symbols-outlined text-primary text-2xl">calendar_month</span>
          </div>
          <a routerLink="/" class="text-[#101810] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] cursor-pointer hover:text-primary transition-colors">LOUVORES PIB CROATÁ</a>
        </div>
        <div class="flex gap-3">
          <a routerLink="/repertoire" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-colors">
            <span class="material-symbols-outlined text-[20px]">music_note</span>
            <span class="hidden sm:inline">Repertório</span>
          </a>
        </div>
      </header>

      <main class="flex-1 flex flex-col items-center w-full py-8 px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-6xl flex flex-col gap-8">
          
          <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div class="flex flex-col gap-2">
              <h1 class="text-[#101810] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Agenda de Cultos</h1>
              <p class="text-[#5e8d5e] dark:text-gray-400 text-lg font-medium">Próximas escalas e ministrações</p>
            </div>
          </div>

          <div class="space-y-10">
            @for (group of groupedServices(); track group.monthYear) {
              <section class="animate-[fadeIn_0.5s_ease-out]">
                
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-4 flex-1">
                    <h2 class="text-xl font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{{ group.monthLabel }}</h2>
                    <div class="h-px flex-1 bg-gray-200 dark:bg-white/10"></div>
                  </div>
                  <div class="flex gap-2 ml-4">
                    <button (click)="printMonth(group)" class="flex items-center gap-2 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-lg shadow-sm transition-colors" title="Imprimir escala deste mês">
                      <span class="material-symbols-outlined text-[16px]">print</span>
                    </button>
                    <button (click)="shareMonth(group)" class="flex items-center gap-2 px-3 py-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold rounded-lg shadow-sm transition-colors" title="Enviar escala completa deste mês no WhatsApp">
                      <span class="material-symbols-outlined text-[16px]">share</span>
                      Escala
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  @for (service of group.services; track service.id) {
                    <div class="group relative flex flex-col bg-white dark:bg-[#1a2e1a] rounded-2xl p-6 shadow-sm ring-1 ring-[#e6f0e6] dark:ring-white/5 hover:shadow-lg hover:ring-primary/30 transition-all duration-300">
                      
                      <div class="absolute -top-3 left-6 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold shadow-md uppercase tracking-wider">
                        {{ formatDate(service.date) }}
                      </div>

                      <div class="mt-4 flex justify-between items-start">
                        <div>
                          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ service.title }}</h3>
                          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span class="material-symbols-outlined text-[18px] text-primary">person</span>
                            <span class="font-medium">Ministro:</span> {{ service.leader || 'A definir' }}
                          </div>
                        </div>

                        @if (auth.currentUser()) {
                          <div class="flex gap-1">
                            <button (click)="openEditModal(service)" class="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Editar Escala">
                              <span class="material-symbols-outlined text-[20px]">edit_calendar</span>
                            </button>
                            <button (click)="askToDelete(service)" class="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Excluir Culto">
                              <span class="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        }
                      </div>

                      <div class="my-4 border-t border-dashed border-gray-200 dark:border-gray-700"></div>

                      <div class="space-y-3">
                        @if (service.backingVocals && service.backingVocals.length > 0) {
                          <div class="flex items-start gap-2">
                            <span class="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">mic_external_on</span>
                            <div class="text-sm text-gray-600 dark:text-gray-300">
                              <span class="font-bold text-xs text-gray-400 uppercase block mb-0.5">Vozes</span>
                              {{ service.backingVocals.join(', ') }}
                            </div>
                          </div>
                        }

                        <div class="flex items-start gap-2">
                          <span class="material-symbols-outlined text-gray-400 text-[18px] mt-0.5">queue_music</span>
                          <div class="text-sm text-gray-600 dark:text-gray-300 w-full">
                            <span class="font-bold text-xs text-gray-400 uppercase block mb-0.5">Repertório</span>
                            @if (service.songIds && service.songIds.length > 0) {
                              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 border border-green-100 dark:border-green-900/30">
                                {{ service.songIds.length }} louvores selecionados
                              </span>
                            } @else {
                              <span class="text-gray-400 italic">Nenhuma música adicionada</span>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>

              </section>
            } @empty {
              <div class="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10">
                <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">event_busy</span>
                <h3 class="text-xl font-bold text-gray-500 dark:text-gray-400">Nenhum culto agendado</h3>
                <p class="text-gray-400 text-sm mt-2">Clique no botão "+" para criar uma nova escala.</p>
              </div>
            }
          </div>
        </div>
      </main>

      @if (auth.currentUser()) {
        <div class="fixed bottom-6 right-6 z-30">
          <button (click)="openAddModal()" class="flex items-center justify-center size-14 rounded-full bg-primary text-white shadow-lg shadow-green-900/20 transition-transform hover:scale-105 hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/30">
            <span class="material-symbols-outlined text-[28px]">add</span>
          </button>
        </div>
      }

      <app-add-service-modal [isOpen]="isModalOpen()" [serviceToEdit]="editingService()" (close)="closeModal()" (save)="onSaveService($event)"></app-add-service-modal>

      @if (showConfirmModal()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" (click)="closeConfirmModal()"></div>
          <div class="relative bg-white dark:bg-[#1a2e1a] rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-gray-200 dark:border-white/10 animate-[scaleIn_0.2s_ease-out]">
            <div class="flex flex-col items-center text-center gap-4">
              <div class="h-14 w-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                <span class="material-symbols-outlined text-3xl">warning</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Excluir Escala?</h3>
              <p class="text-gray-500 dark:text-gray-300">
                {{ confirmMessage() }}
              </p>
              <div class="flex gap-3 w-full mt-2">
                <button (click)="closeConfirmModal()" class="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white font-bold hover:bg-gray-200 transition-colors">
                  Cancelar
                </button>
                <button (click)="confirmAction()" class="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-md shadow-red-200 dark:shadow-none transition-colors">
                  Sim, Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      @if (toastState().show) {
        <div class="fixed top-24 left-1/2 -translate-x-1/2 z-[110] w-full max-w-sm px-4 animate-[slideDown_0.3s_ease-out]">
          <div [class]="'flex items-center p-4 rounded-xl shadow-2xl border-l-4 ' + toastState().classes">
            <div [class]="'inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ' + toastState().iconBg">
              <span class="material-symbols-outlined text-[20px]">{{ toastState().icon }}</span>
            </div>
            <div class="ml-3 text-sm font-normal text-gray-800 dark:text-gray-100">
              <span class="font-bold block mb-0.5">{{ toastState().title }}</span> 
              {{ toastState().message }}
            </div>
          </div>
        </div>
      }
    </div>

    <div class="hidden print:block print:bg-white print:text-black print:p-8">
      @if (printGroup(); as group) {
        <div class="text-center mb-8 border-b-2 border-black pb-4">
          <h1 class="text-3xl font-black uppercase">ESCALA DE LOUVOR</h1>
          <h2 class="text-xl uppercase text-gray-600">{{ group.monthLabel }}</h2>
          <p class="text-sm mt-2">PIB CROATÁ</p>
        </div>
        <div class="space-y-6">
          @for (service of group.services; track service.id) {
            <div class="break-inside-avoid border border-gray-300 rounded-lg p-4 shadow-sm">
              <div class="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
                <div>
                  <h3 class="text-xl font-bold uppercase">{{ getDay(service.date) }} - {{ service.title }}</h3>
                  <p class="text-sm text-gray-600">{{ getWeekDay(service.date) }}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm"><span class="font-bold">Ministro:</span> {{ service.leader || '---' }}</p>
                </div>
              </div>
              
              @if (service.backingVocals && service.backingVocals.length > 0) {
                 <div class="mb-3 text-sm"><span class="font-bold">🎤 VOCAL:</span> {{ service.backingVocals.join(', ') }}</div>
              } @else {
                 <div class="mb-3 text-sm italic text-gray-500">🎤 Vocal: A definir</div>
              }
              
              <div>
                <span class="font-bold text-sm block mb-2">🎵 REPERTÓRIO:</span>
                @if (service.songIds && service.songIds.length > 0) {
                  <ul class="list-decimal list-inside text-sm space-y-2">
                    @for (songId of service.songIds; track songId) {
                      @if (getSongDetails(songId); as song) {
                        <li class="pl-1">
                          <span class="font-medium text-base">{{ song.title }}</span>
                          @if(song.key) { <span class="text-xs border border-black px-1 rounded ml-1 align-middle">{{ song.key }}</span> }
                          @if (song.youtubeUrl) { 
                            <div class="text-[10px] text-gray-500 mt-0.5 ml-4 break-all">
                              ▶️ {{ song.youtubeUrl }}
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
  serviceService = inject(ServiceService);
  songService = inject(SongService); // Injetado para buscar detalhes da música na impressão
  auth = inject(AuthService);

  isModalOpen = signal(false);
  editingService = signal<Service | null>(null);
  
  // Estados para Impressão
  printGroup = signal<any>(null);

  // Estados dos Modais
  showConfirmModal = signal(false);
  confirmMessage = signal('');
  pendingDeleteAction: (() => void) | null = null;
  toastState = signal({ show: false, title: '', message: '', classes: '', icon: '', iconBg: '' });

  // Agrupa os cultos por Mês (YYYY-MM) para exibição e impressão
  groupedServices = computed(() => {
    const services = this.serviceService.services();
    const groups: { [key: string]: Service[] } = {};
    
    services.forEach(s => {
      const monthKey = s.date.substring(0, 7); // "2026-01"
      if (!groups[monthKey]) { groups[monthKey] = []; }
      groups[monthKey].push(s);
    });

    // Ordena os dias dentro do mês
    Object.keys(groups).forEach(key => {
        groups[key].sort((a, b) => a.date.localeCompare(b.date));
    });

    // Retorna array ordenado (Mês mais recente primeiro, ou futuro primeiro)
    return Object.keys(groups).sort((a, b) => a.localeCompare(b)).map(key => {
        const [year, month] = key.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
        
        // Formata o nome do mês (Ex: Janeiro 2026)
        const monthLabel = dateObj.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

        return {
          monthYear: key,
          monthLabel: monthLabel,
          services: groups[key]
        };
      });
  });

  // Utilitários de Data
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', weekday: 'short' }).format(date).replace('.', '');
  }

  getDay(dateStr: string) { return dateStr.split('-')[2]; }
  
  getWeekDay(dateStr: string) { 
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', { weekday: 'long' }); 
  }

  getSongDetails(id: string) { return this.songService.songs().find(s => s.id === id); }

  // --- IMPRESSÃO ---
  printMonth(group: any) {
    this.printGroup.set(group);
    const originalTitle = document.title;
    document.title = `Escala - ${group.monthLabel.toUpperCase()}`;
    
    // Pequeno delay para o Angular renderizar a área de impressão
    setTimeout(() => {
        window.print();
        setTimeout(() => { document.title = originalTitle; }, 500);
    }, 100);
  }

  // --- WHATSAPP ---
  shareMonth(group: any) {
    let text = `🗓️ *ESCALA DE ${group.monthLabel.toUpperCase()}*\n_PIB CROATÁ_\n\n🔗 *Acesse:* ${window.location.origin}\n`;
    const allSongs = this.songService.songs();
    
    group.services.forEach((service: Service) => {
        const day = this.getDay(service.date);
        const weekDay = this.getWeekDay(service.date);
        text += `\n〰️〰️〰️〰️〰️〰️〰️〰️\n\n📌 *DIA ${day} (${weekDay}) - ${service.title}*\n`;
        text += `👤 *Ministro:* ${service.leader || 'A definir'}\n`;
        
        if (service.backingVocals && service.backingVocals.length > 0) {
            text += `🎤 *Vocal:* ${service.backingVocals.join(', ')}\n\n`;
        } else {
            text += `🎤 *Vocal:* (A definir)\n\n`;
        }
        
        text += `🎵 *Repertório:*\n`;
        if (!service.songIds || service.songIds.length === 0) { 
            text += `(Ainda sem músicas)\n`; 
        } else {
            service.songIds.forEach((songId: string, index: number) => {
                const song = allSongs.find(s => s.id === songId);
                if (song) {
                    const key = song.key ? `(${song.key})` : '';
                    text += `${index + 1}. ${song.title} ${key}\n`;
                    if (song.youtubeUrl) { text += `▶️ ${song.youtubeUrl}\n`; }
                }
            });
        }
    });
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  // --- CONFIRMAÇÃO & TOASTS ---
  askToDelete(service: Service) {
    const dataFormatada = this.formatDate(service.date);
    this.confirmMessage.set(`Deseja apagar a escala de ${dataFormatada}?`);
    this.pendingDeleteAction = () => {
      this.serviceService.deleteService(service.id);
      this.triggerToast('Sucesso', 'Escala excluída.', 'success');
    };
    this.showConfirmModal.set(true);
  }

  confirmAction() {
    if (this.pendingDeleteAction) this.pendingDeleteAction();
    this.closeConfirmModal();
  }

  closeConfirmModal() {
    this.showConfirmModal.set(false);
    this.pendingDeleteAction = null;
  }

  triggerToast(title: string, message: string, type: 'success' | 'warning' | 'error') {
    let classes = '';
    let icon = '';
    let iconBg = '';

    if (type === 'success') {
      classes = 'bg-white dark:bg-[#1a2e1a] border-primary';
      icon = 'check';
      iconBg = 'bg-primary/10 text-primary';
    } else {
      classes = 'bg-white dark:bg-[#1a2e1a] border-red-500';
      icon = 'error';
      iconBg = 'bg-red-100 text-red-600';
    }

    this.toastState.set({ show: true, title, message, classes, icon, iconBg });
    setTimeout(() => { this.toastState.update(s => ({ ...s, show: false })); }, 3500);
  }

  openAddModal() { this.editingService.set(null); this.isModalOpen.set(true); }
  openEditModal(service: Service) { this.editingService.set(service); this.isModalOpen.set(true); }
  closeModal() { this.isModalOpen.set(false); this.editingService.set(null); }

  onSaveService(serviceData: any) {
    const currentService = this.editingService();
    if (currentService) {
      this.serviceService.updateService(currentService.id, serviceData);
      this.triggerToast('Atualizado', 'Escala alterada com sucesso.', 'success');
    } else {
      this.serviceService.addService(serviceData);
      this.triggerToast('Criado', 'Nova escala agendada!', 'success');
    }
    this.closeModal();
  }
}