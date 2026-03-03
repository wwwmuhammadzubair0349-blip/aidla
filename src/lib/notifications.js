import { messaging, getToken, onMessage } from "./firebase";
import { supabase } from "./supabase";

const VAPID_KEY = "BAJEG27eoLjLsGT9Dl_j4i9tewSuTjBfFJrtlX_ZcHQRhjoJSlo8NAsWG3CHrtN5GxV07dryeZSfq1auRJ4_rps";

export async function registerPushToken() {
  try {
    // Ask user for notification permission
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return;
    }

    // Get the FCM token
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });

    if (!token) {
      console.log("No token received");
      return;
    }

    // Get the current logged in user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log("No user logged in");
      return;
    }

    // Save token to Supabase
    const { error } = await supabase
      .from("user_fcm_tokens")
      .upsert(
        { user_id: user.id, token, platform: "web" },
        { onConflict: "token" }
      );

    if (error) console.error("Error saving token:", error);
    else console.log("Push token saved successfully ✅");

  } catch (err) {
    console.error("Push registration error:", err);
  }
}

// Handle notifications when app is open/foreground
export function listenForNotifications() {
  onMessage(messaging, (payload) => {
    console.log("Notification received:", payload);

    // Show a browser notification even when app is open
    if (Notification.permission === "granted") {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/logo.png",
      });
    }
  });
}
