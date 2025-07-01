import { ref, onMounted, onUnmounted, watch } from 'vue';
import { pusher } from '../config/pusher';
import type { PusherNotification } from '../types/notification';
import { notificationStore } from '../stores/notificationStore';
import { toastController } from '@ionic/vue';

export function useNotifications(userId?: number) {
  const channel = ref<any>(null);

  const addNotification = (notification: PusherNotification) => {
    console.log('🟢 addNotification ejecutado con:', notification);
    notificationStore.addNotification(notification);
    showToast(notification);
  };

  const showToast = async (notification: PusherNotification) => {
    console.log('🟢 showToast ejecutado con:', notification);
    const toast = await toastController.create({
      message: notification.mensaje,
      duration: 3000,
      position: 'top',
      color: notification.estado === 'aceptado' ? 'success' : 'danger'
    });
    await toast.present();
  };

  const markAsRead = (notificationId: string) => {
    notificationStore.markAsRead(notificationId);
  };

  const markAllAsRead = () => {
    notificationStore.markAllAsRead();
  };

  const clearNotifications = () => {
    notificationStore.clearNotifications();
  };

  const connect = () => {
    if (!userId) {
      console.warn('No se puede conectar a las notificaciones sin userId');
      return;
    }

    console.log('Intentando conectar a Pusher con userId:', userId);

    try {
      notificationStore.setCurrentUser(userId);
      notificationStore.loadFromLocalStorage();
      const channelName = `postulacion.estado.${userId}`;
      console.log('Suscribiéndose al canal:', channelName);
      channel.value = pusher.subscribe(channelName);

      // Evento personalizado (recomendado)
      channel.value.bind('EstadoPostulacionActualizado', (data: PusherNotification) => {
        console.log('✅ Notificación recibida (evento personalizado):', data);
        addNotification(data);
      });

      // Evento por defecto de Laravel
      channel.value.bind('Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', (data: any) => {
        console.log('📢 Notificación Laravel recibida:', data);
        // Caso 1: data.data existe (objeto anidado)
        if (data && data.data) {
          const { estado, mensaje } = data.data;
          console.log('🟢 Extrayendo campos de notificación:', { estado, mensaje });
          if (estado && mensaje) {
            addNotification({ estado, mensaje });
          } else {
            console.warn('⚠️ Notificación recibida sin los campos esperados:', data.data);
          }
        }
        // Caso 2: el objeto recibido ya tiene los campos (objeto plano)
        else if (data && data.estado && data.mensaje) {
          console.log('🟢 Notificación recibida en formato plano:', { estado: data.estado, mensaje: data.mensaje });
          addNotification({ estado: data.estado, mensaje: data.mensaje });
        }
        else {
          console.warn('⚠️ Notificación Laravel recibida sin data.data ni campos esperados:', data);
        }
      });

      // Escuchar todos los eventos del canal para debugging
      channel.value.bind_global((eventName: string, data: any) => {
        console.log('🔍 Evento recibido en canal:', eventName, data);
      });

      pusher.connection.bind('connected', () => {
        console.log('✅ Conectado a Pusher');
        notificationStore.setConnectionStatus(true);
      });
      pusher.connection.bind('disconnected', () => {
        console.log('❌ Desconectado de Pusher');
        notificationStore.setConnectionStatus(false);
      });
      pusher.connection.bind('error', (error: any) => {
        console.error('❌ Error de conexión con Pusher:', error);
        notificationStore.setConnectionStatus(false);
      });
      console.log('Estado inicial de conexión:', pusher.connection.state);
    } catch (error) {
      console.error('❌ Error al conectar con Pusher:', error);
    }
  };

  const disconnect = () => {
    if (channel.value) {
      pusher.unsubscribe(`postulacion.estado.${userId}`);
      channel.value = null;
    }
    notificationStore.setConnectionStatus(false);
  };

  onMounted(() => {
    if (userId) {
      connect();
    }
  });

  onUnmounted(() => {
    disconnect();
  });

  return {
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    connect,
    disconnect
  };
} 