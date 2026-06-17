import * as Device from 'expo-device';
import { Platform } from 'react-native';

import type * as ExpoNotifications from 'expo-notifications';

let notificationsModule: typeof ExpoNotifications | null = null;

async function getNotificationsModule() {
  if (Platform.OS === 'web') {
    return null;
  }

  if (!notificationsModule) {
    notificationsModule = await import('expo-notifications');
    notificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }

  return notificationsModule;
}

let configured = false;

export async function configureNotifications() {
  // Disable in development / Expo Go to prevent the annoying push warning toast.
  return;
}

export async function sendLocalNotification(title: string, body: string) {
  try {
    const Notifications = await getNotificationsModule();
    if (!Notifications) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null,
    });
  } catch {
    // Ignore notification failures in simulator and local preview mode.
  }
}
