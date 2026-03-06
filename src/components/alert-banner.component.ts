import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SongService } from '../services/song.service';

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (songService.topAlert()) {
      <div class="bg-gradient-to-r from-blue-600 to-primary text-white px-4 py-3 shadow-md flex items-center justify-between sticky top-0 z-[60]">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined animate-bounce">notifications_active</span>
          <span class="text-sm md:text-base font-bold">{{ songService.topAlert()?.message }}</span>
        </div>
        
        <a [routerLink]="songService.topAlert()?.link" 
           class="bg-white text-primary text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm whitespace-nowrap ml-2">
          {{ songService.topAlert()?.buttonText }}
        </a>
      </div>
    }
  `
})
export class AlertBannerComponent {
  songService = inject(SongService);
}