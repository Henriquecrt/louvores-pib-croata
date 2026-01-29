/* Service Worker para Firebase Cloud Messaging 
   Versão atualizada: v10.7.1 (Compat)
*/
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Inicializa o Firebase com suas credenciais
firebase.initializeApp({
  apiKey: "AIzaSyCb4xuxWrCGNuFM8yAFVPXvI7K35LX9WCE",
  authDomain: "louvores-gpv.firebaseapp.com",
  projectId: "louvores-gpv",
  storageBucket: "louvores-gpv.firebasestorage.app",
  messagingSenderId: "876395905450",
  appId: "1:876395905450:web:deba8f7763c562aec42bd3"
});

// Recupera a instância do Messaging
const messaging = firebase.messaging();

// Configura o comportamento para notificações em segundo plano (quando o app está fechado)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Notificação em Background:', payload);

  // Personalize a notificação aqui
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png', // Verifique se esse ícone existe na pasta assets ou public
    badge: '/icons/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});