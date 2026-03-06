import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SongService } from '../services/song.service';

@Component({
  selector: 'app-alert-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-[#1a2e1a] p-5 rounded-2xl shadow-md border border-gray-100 dark:border-white/10 mt-6">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span class="material-symbols-outlined text-primary">campaign</span>
        Painel do Banner de Aviso
      </h3>
      
      <div class="space-y-4">
        <label class="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
          <input type="checkbox" [(ngModel)]="alertData.active" class="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary">
          <span class="font-bold text-gray-700 dark:text-gray-300">Ativar Banner no topo do Aplicativo</span>
        </label>

        @if (alertData.active) {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-200 dark:border-white/10">
            <div class="md:col-span-3">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mensagem do Aviso</label>
              <input type="text" [(ngModel)]="alertData.message" class="w-full rounded-lg bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="Ex: Escala de Domingo liberada!">
            </div>
            
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texto do Botão</label>
              <input type="text" [(ngModel)]="alertData.buttonText" class="w-full rounded-lg bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="Ex: Confira">
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link (Para onde o botão leva?)</label>
              <input type="text" [(ngModel)]="alertData.link" class="w-full rounded-lg bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="Ex: / (página inicial) ou /repertoire">
            </div>
          </div>
        }

        <button (click)="saveAlert()" class="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center w-full md:w-auto gap-2">
          <span class="material-symbols-outlined text-[18px]">send</span> Publicar Aviso
        </button>
      </div>
    </div>
  `
})
export class AlertControlComponent implements OnInit {
  songService = inject(SongService);
  
  alertData = {
    active: false,
    message: 'A escala do culto de Domingo já saiu! 🙌',
    buttonText: 'Confira',
    link: '/'
  };

  ngOnInit() {
    // Puxa os dados atuais para o formulário se já existir um banner rolando
    const currentAlert = this.songService.topAlert();
    if (currentAlert) {
      this.alertData = { ...currentAlert };
    }
  }

  saveAlert() {
    this.songService.updateTopAlert(
      this.alertData.active, 
      this.alertData.message, 
      this.alertData.buttonText, 
      this.alertData.link
    );
    alert('Banner atualizado e enviado para todos os celulares!');
  }
}