import { ref, computed } from 'vue';
import type { Notification, PusherNotification } from '../types/notification';

export const useNotificationStore = () => {
  // Estado global
  const notifications = ref<Notification[]>([]);
  const isConnected = ref(false);
  const currentUserId = ref<number | null>(null);

  // Getters
  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.read).length;
  });

  const hasUnreadNotifications = computed(() => {
    return unreadCount.value > 0;
  });

  // Actions
  const setCurrentUser = (userId: number) => {
    currentUserId.value = userId;
  };

  const addNotification = (notification: PusherNotification) => {
    console.log('🟢 Store: agregando notificación:', notification);
    
    const newNotification: Notification = {
      id: Date.now().toString(),
      estado: notification.estado,
      mensaje: notification.mensaje,
      timestamp: new Date(),
      read: false
    };
    
    notifications.value.unshift(newNotification);
    console.log('🟢 Store: notificaciones actuales:', notifications.value);
    
    // Persistir en localStorage
    saveToLocalStorage();
  };

  const markAsRead = (notificationId: string) => {
    const notification = notifications.value.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      saveToLocalStorage();
    }
  };

  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      notification.read = true;
    });
    saveToLocalStorage();
  };

  const clearNotifications = () => {
    notifications.value = [];
    saveToLocalStorage();
  };

  const setConnectionStatus = (status: boolean) => {
    isConnected.value = status;
  };

  // Persistencia en localStorage
  const saveToLocalStorage = () => {
    if (currentUserId.value) {
      const key = `notifications_${currentUserId.value}`;
      localStorage.setItem(key, JSON.stringify(notifications.value));
    }
  };

  const loadFromLocalStorage = () => {
    if (currentUserId.value) {
      const key = `notifications_${currentUserId.value}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          notifications.value = parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }));
        } catch (error) {
          console.error('Error al cargar notificaciones del localStorage:', error);
        }
      }
    }
  };

  const clearLocalStorage = () => {
    if (currentUserId.value) {
      const key = `notifications_${currentUserId.value}`;
      localStorage.removeItem(key);
    }
  };

  return {
    // State
    notifications,
    isConnected,
    currentUserId,
    
    // Getters
    unreadCount,
    hasUnreadNotifications,
    
    // Actions
    setCurrentUser,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    setConnectionStatus,
    loadFromLocalStorage,
    clearLocalStorage
  };
};

// Exportar una instancia singleton
export const notificationStore = useNotificationStore(); 