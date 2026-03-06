import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SongService } from '../services/song.service';

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (songService.topAlert() && !isDismissed(songService.topAlert()?.message)) {
      <div class="bg-gradient-to-r from-blue-600 to-primary text-white px-4 py-3 shadow-md flex items-center justify-between sticky top-0 z-[60]">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined animate-bounce">notifications_active</span>
          <span class="text-sm md:text-base font-bold">{{ songService.topAlert()?.message }}</span>
        </div>
        
        <div class="flex items-center gap-2">
          <a [routerLink]="songService.topAlert()?.link" 
             (click)="dismiss(songService.topAlert()?.message)"
             class="bg-white text-primary text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm whitespace-nowrap">
            {{ songService.topAlert()?.buttonText }}
          </a>
          
          <button (click)="dismiss(songService.topAlert()?.message)" class="text-white/80 hover:text-white transition-colors p-1 flex items-center justify-center">
            <span class="material-symbols-outlined text-[20px] block">close</span>
          </button>
        </div>
      </div>
    }
  `
})
export class AlertBannerComponent {
  songService = inject(SongService);

  // Verifica se o usuário já clicou ou fechou ESSA mensagem específica
  isDismissed(message: string | undefined): boolean {
    if (!message) return true;
    return localStorage.getItem('dismissed_alert') === message;
  }

  // Grava no celular do usuário que ele já viu essa mensagem e esconde o banner
  dismiss(message: string | undefined) {
    if (message) {
      localStorage.setItem('dismissed_alert', message);
    }
  }
}