import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker'; // <--- Importante para atualização
import { filter } from 'rxjs';
import { ToastComponent } from './components/toast.component'; 
import { NotificationService } from './services/notification.service'; 
import { InstallPromptComponent } from './components/install-prompt.component'; // <--- Nosso novo componente importado

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, InstallPromptComponent], // <--- Adicionado aos imports
  template: `
    <app-toast></app-toast> 
    
    <router-outlet></router-outlet>

    <app-install-prompt></app-install-prompt>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  notificationService = inject(NotificationService);
  updates = inject(SwUpdate); // <--- Injeção do serviço de atualização

  ngOnInit() {
    // Verifica se o Service Worker (PWA) está ativo no navegador
    if (this.updates.isEnabled) {
      
      // Fica vigiando se chegou uma nova versão do site
      this.updates.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {
          // Assim que baixar a nova versão, ativa e recarrega a página sozinho
          this.updates.activateUpdate().then(() => document.location.reload());
        });
    }
  }
}