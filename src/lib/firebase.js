import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA2VQPybQqT9V96jCXpkeW1zcQXWyropY8",
  authDomain: "aidla-notifications-f7064.firebaseapp.com",
  projectId: "aidla-notifications-f7064",
  storageBucket: "aidla-notifications-f7064.firebasestorage.app",
  messagingSenderId: "343443993101",
  appId: "1:343443993101:web:43a177b9e1571d505adb44"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export { getToken, onMessage };