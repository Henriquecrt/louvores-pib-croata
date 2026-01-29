importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Copie as configurações do seu src/firebase-config.ts aqui
const firebaseConfig = {
  apiKey: "AIzaSyCb4xuxWrCGNuFM8yAFVPXvI7K35LX9WCE",
  authDomain: "louvores-gpv.firebaseapp.com",
  projectId: "louvores-gpv",
  storageBucket: "louvores-gpv.firebasestorage.app",
  messagingSenderId: "876395905450",
  appId: "1:876395905450:web:deba8f7763c562aec42bd3"
};

const messaging = firebase.messaging();

// Opcional: Tratar notificações quando o app está em background
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Notificação recebida em background:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png' // Seu ícone
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});