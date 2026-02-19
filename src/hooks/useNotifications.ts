import { useEffect, useCallback } from "react";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications, ScheduleOptions } from "@capacitor/local-notifications";

// Unique IDs for each notification type
export const NOTIF_IDS = {
  NEW_MESSAGE: 1001,
  PLAYDATE_REMINDER: 2001,
  NEW_MATCH: 3001,
} as const;

let notifIdCounter = 9000;
const nextId = () => ++notifIdCounter;

async function requestPermissions(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return true; // web — no-op, still schedule for demo
  const result = await LocalNotifications.requestPermissions();
  return result.display === "granted";
}

export function useNotifications() {
  useEffect(() => {
    // Request on first mount
    requestPermissions();

    // Listen for notification taps
    LocalNotifications.addListener("localNotificationActionPerformed", (action) => {
      console.log("Notification tapped:", action.notification);
    });

    return () => {
      LocalNotifications.removeAllListeners();
    };
  }, []);

  /** Fire immediately — simulates a new message arriving */
  const notifyNewMessage = useCallback(async (senderName: string, preview: string) => {
    const granted = await requestPermissions();
    if (!granted) return;

    await LocalNotifications.schedule({
      notifications: [
        {
          id: nextId(),
          title: `New message from ${senderName} 💬`,
          body: preview,
          smallIcon: "ic_stat_icon_config_sample",
          iconColor: "#3d8b5e",
          extra: { type: "message", sender: senderName },
        },
      ],
    } as ScheduleOptions);
  }, []);

  /** Schedule a reminder 1 hour before a playdate (or N ms from now for demo) */
  const schedulePlaydateReminder = useCallback(
    async (park: string, time: string, inMs: number = 1000) => {
      const granted = await requestPermissions();
      if (!granted) return;

      const at = new Date(Date.now() + inMs);

      await LocalNotifications.schedule({
        notifications: [
          {
            id: nextId(),
            title: "Playdate in 1 hour! 🛝",
            body: `Your playdate at ${park} starts at ${time}. Time to pack the snacks!`,
            schedule: { at },
            smallIcon: "ic_stat_icon_config_sample",
            iconColor: "#3d8b5e",
            extra: { type: "playdate", park, time },
          },
        ],
      } as ScheduleOptions);
    },
    []
  );

  /** Notify immediately when a new mom match is found nearby */
  const notifyNewMatch = useCallback(async (momName: string, distance: string) => {
    const granted = await requestPermissions();
    if (!granted) return;

    await LocalNotifications.schedule({
      notifications: [
        {
          id: nextId(),
          title: "New mom match nearby! 🌸",
          body: `${momName} is ${distance} away and shares your interests!`,
          smallIcon: "ic_stat_icon_config_sample",
          iconColor: "#3d8b5e",
          extra: { type: "match", momName, distance },
        },
      ],
    } as ScheduleOptions);
  }, []);

  return { notifyNewMessage, schedulePlaydateReminder, notifyNewMatch };
}
