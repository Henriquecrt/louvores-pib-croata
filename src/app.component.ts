import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast.component'; // O visual do aviso
import { NotificationService } from './services/notification.service'; // Para garantir que os avisos cheguem

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `
    <app-toast></app-toast> 
    
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  // Injetamos o serviço aqui para garantir que o app comece a "escutar" 
  // notificações assim que for aberto, independente da página.
  notificationService = inject(NotificationService);
}