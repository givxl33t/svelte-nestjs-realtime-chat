import { writable } from 'svelte/store';

interface Notification {
  id?: string;
  text: string;
  read: boolean;
  metadata: {
    key: string;
    value: string;
  }[];
  createdAt: Date;
}

export const notificationsData = writable<Notification[]>([]);

export function updateNotifications(notifications: any) {
  notificationsData.set(notifications);
}