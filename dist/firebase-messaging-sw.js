importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyA2VQPybQqT9V96jCXpkeW1zcQXWyropY8",
  authDomain: "aidla-notifications-f7064.firebaseapp.com",
  projectId: "aidla-notifications-f7064",
  storageBucket: "aidla-notifications-f7064.firebasestorage.app",
  messagingSenderId: "343443993101",
  appId: "1:343443993101:web:43a177b9e1571d505adb44"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png",
  });
});