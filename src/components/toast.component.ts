import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 pointer-events-none transition-all duration-500 ease-out"
         [class.opacity-0]="!toastService.toast().visible"
         [class.-translate-y-4]="!toastService.toast().visible"
         [class.opacity-100]="toastService.toast().visible"
         [class.translate-y-0]="toastService.toast().visible">
      
      <div class="flex items-center gap-4 p-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md transition-all"
           [ngClass]="{
             'bg-white text-gray-800': true,
             'pointer-events-auto': toastService.toast().visible, 
             'pointer-events-none': !toastService.toast().visible
           }">
        
        <div class="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full"
             [ngClass]="{
               'bg-green-100 text-green-600': toastService.toast().type === 'success',
               'bg-red-100 text-red-600': toastService.toast().type === 'error',
               'bg-blue-100 text-blue-600': toastService.toast().type === 'info'
             }">
          <span class="material-symbols-outlined text-xl">
            {{ toastService.toast().type === 'success' ? 'check_circle' : 
               toastService.toast().type === 'error' ? 'error' : 'info' }}
          </span>
        </div>

        <div class="flex-1">
          <p class="text-sm font-bold">
            {{ toastService.toast().type === 'success' ? 'Sucesso!' : 
               toastService.toast().type === 'error' ? 'Atenção' : 'Informação' }}
          </p>
          <p class="text-sm text-gray-600 leading-tight">{{ toastService.toast().message }}</p>
        </div>

        <button (click)="toastService.close()" class="text-gray-400 hover:text-gray-600 transition-colors pointer-events-auto">
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}