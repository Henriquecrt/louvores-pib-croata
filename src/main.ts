import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

// --- IMPORTS DO FIREBASE ---
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideMessaging, getMessaging } from '@angular/fire/messaging'; // <--- Importante para Notificações
import { firebaseConfig } from './firebase-config'; // <--- Sua configuração

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),

    // --- INICIALIZAÇÃO DO FIREBASE ---
    // Isso permite usar inject(Firestore), inject(Messaging), etc. nos componentes
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideMessaging(() => getMessaging()), // <--- Ativa o serviço de mensagens

    // --- PWA (SERVICE WORKER) ---
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
}).catch((err) => console.error(err));