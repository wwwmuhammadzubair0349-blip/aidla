import { useEffect } from "react";
import { messaging, getToken, onMessage } from "../lib/firebase";
import { supabase } from "../lib/supabase";

const VAPID_KEY = "BAJEG27eoLjLsGT9Dl_j4i9tewSuTjBfFJrtlX_ZcHQRhjoJSlo8NAsWG3CHrtN5GxV07dryeZSfq1auRJ4_rps";

export function usePushNotifications(userId) {
  useEffect(() => {
    if (!userId) return;
    registerToken(userId);
    
    // Handle notifications when app is open/foreground
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Notification received:", payload);
      
      // Show a simple browser notification
      if (Notification.permission === "granted") {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: "/logo.png",
        });
      }
    });

    return () => unsubscribe();
  }, [userId]);
}

async function registerToken(userId) {
  try {
    // Ask user for permission
    const permission = await Notification.requestPermission();
    
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return;
    }

    // Get FCM token
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });

    if (!token) {
      console.log("No token received");
      return;
    }

    // Save token to Supabase
    const { error } = await supabase
      .from("user_fcm_tokens")
      .upsert(
        { user_id: userId, token, platform: "web" },
        { onConflict: "token" }
      );

    if (error) console.error("Error saving token:", error);
    else console.log("Push token saved successfully ✅");

  } catch (err) {
    console.error("Push registration error:", err);
  }
}
