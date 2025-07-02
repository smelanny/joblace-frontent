<template>
  <div class="notification-bell">
    <ion-button 
      fill="clear" 
      @click="toggleNotifications"
      class="notification-button"
    >
      <ion-icon 
        :icon="notificationsIcon" 
        :color="unreadCount > 0 ? 'warning' : 'medium'"
      ></ion-icon>
      
      <!-- Badge con contador de notificaciones no leídas -->
      <ion-badge 
        v-if="unreadCount > 0" 
        color="danger" 
        class="notification-badge"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </ion-badge>
    </ion-button>

    <!-- Panel de notificaciones -->
    <ion-popover 
      :is-open="showNotifications" 
      @didDismiss="showNotifications = false"
      trigger="notification-button"
      class="notification-popover"
    >
      <ion-content>
        <ion-header>
          <ion-toolbar>
            <ion-title>Notificaciones</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="markAllAsRead" fill="clear">
                Marcar como leídas
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-list v-if="notifications.length > 0">
          <ion-item 
            v-for="notification in notifications" 
            :key="notification.id"
            :class="{ 'unread': !notification.read }"
            @click="markAsRead(notification.id)"
            button
          >
            <ion-icon 
              :icon="getStatusIcon(notification.estado)" 
              :color="getStatusColor(notification.estado)"
              slot="start"
            ></ion-icon>
            
            <ion-label>
              <h3>{{ notification.mensaje }}</h3>
              <p>{{ formatTime(notification.timestamp) }}</p>
            </ion-label>

            <ion-badge 
              v-if="!notification.read" 
              color="primary" 
              slot="end"
            >
              Nuevo
            </ion-badge>
          </ion-item>
        </ion-list>

        <div v-else class="no-notifications">
          <ion-icon icon="notifications-outline" size="large" color="medium"></ion-icon>
          <p>No hay notificaciones</p>
        </div>

        <ion-footer v-if="notifications.length > 0">
          <ion-toolbar>
            <ion-button 
              @click="clearNotifications" 
              fill="clear" 
              color="danger"
            >
              Limpiar todas
            </ion-button>
          </ion-toolbar>
        </ion-footer>
      </ion-content>
    </ion-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  IonButton, 
  IonIcon, 
  IonBadge, 
  IonPopover, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonFooter 
} from '@ionic/vue';
import { 
  notificationsOutline, 
  checkmarkCircleOutline, 
  closeCircleOutline 
} from 'ionicons/icons';
import { useNotifications } from '../composables/useNotifications';
import { notificationStore } from '../stores/notificationStore';
import type { Notification } from '../types/notification';

// Props
interface Props {
  userId?: number;
}

const props = withDefaults(defineProps<Props>(), {
  userId: undefined
});

// Estado reactivo
const showNotifications = ref(false);

// Composable de notificaciones
const { 
  markAsRead, 
  markAllAsRead, 
  clearNotifications 
} = useNotifications(props.userId);

// Store de notificaciones
const { 
  notifications, 
  isConnected, 
  unreadCount 
} = notificationStore;

const notificationsIcon = computed(() => {
  return notificationsOutline;
});

// Métodos
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const getStatusIcon = (estado: string) => {
  return estado === 'aceptado' ? checkmarkCircleOutline : closeCircleOutline;
};

const getStatusColor = (estado: string) => {
  return estado === 'aceptado' ? 'success' : 'danger';
};

const formatTime = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Ahora mismo';
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours < 24) return `Hace ${hours} h`;
  if (days < 7) return `Hace ${days} días`;
  
  return timestamp.toLocaleDateString();
};
</script>

<style scoped>
.notification-bell {
  position: relative;
}

.notification-button {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.7rem;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
}

.notification-popover {
  --width: 350px;
  --max-width: 90vw;
}

.unread {
  --background: var(--ion-color-light-tint);
  font-weight: 500;
}

.no-notifications {
  text-align: center;
  padding: 2rem;
  color: var(--ion-color-medium);
}

.no-notifications p {
  margin-top: 1rem;
  font-size: 0.9rem;
}

ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
}

ion-item h3 {
  font-size: 0.9rem;
  margin-bottom: 4px;
}

ion-item p {
  font-size: 0.8rem;
  color: var(--ion-color-medium);
  margin: 0;
}
</style> 