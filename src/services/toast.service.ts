import { Injectable, signal } from '@angular/core';

export interface ToastData {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toast = signal<ToastData>({ message: '', type: 'info', visible: false });

  show(message: string, type: 'success' | 'error' | 'info' = 'success') {
    // 1. Mostra o Toast
    this.toast.set({ message, type, visible: true });

    // 2. Esconde automaticamente depois de 4 segundos
    setTimeout(() => {
      this.close();
    }, 4000);
  }

  close() {
    this.toast.update(current => ({ ...current, visible: false }));
  }
}