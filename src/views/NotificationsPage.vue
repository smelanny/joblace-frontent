<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Notificaciones</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="markAllAsRead" fill="clear">
            Marcar como leídas
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Componente de debug (solo para desarrollo) -->
      <NotificationDebug />
      
      <!-- Estado de conexión -->
      <ion-item v-if="!isConnected" color="warning">
        <ion-icon icon="wifi-outline" slot="start"></ion-icon>
        <ion-label>
          <h3>Sin conexión</h3>
          <p>No se pueden recibir notificaciones en tiempo real</p>
        </ion-label>
      </ion-item>

      <!-- Lista de notificaciones -->
      <ion-list v-if="notifications.length > 0">
        <ion-item-sliding v-for="notification in notifications" :key="notification.id">
          <ion-item 
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

          <ion-item-options side="end">
            <ion-item-option 
              color="danger" 
              @click="deleteNotification(notification.id)"
            >
              <ion-icon icon="trash-outline" slot="icon-only"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <!-- Estado vacío -->
      <div v-else class="empty-state">
        <ion-icon icon="notifications-outline" size="large" color="medium"></ion-icon>
        <h2>No hay notificaciones</h2>
        <p>Cuando recibas notificaciones sobre tus postulaciones, aparecerán aquí.</p>
      </div>

      <!-- Botón flotante para limpiar todas -->
      <ion-fab v-if="notifications.length > 0" vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="showClearConfirm" color="danger">
          <ion-icon icon="trash-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonBackButton, 
  IonButton, 
  IonContent, 
  IonList, 
  IonItem, 
  IonItemSliding, 
  IonItemOptions, 
  IonItemOption, 
  IonIcon, 
  IonLabel, 
  IonBadge, 
  IonFab, 
  IonFabButton,
  alertController
} from '@ionic/vue';
import { 
  notificationsOutline, 
  checkmarkCircleOutline, 
  closeCircleOutline,
  wifiOutline,
  trashOutline
} from 'ionicons/icons';
import { notificationStore } from '../stores/notificationStore';
import NotificationDebug from '../components/NotificationDebug.vue';

// Store de notificaciones
const { 
  notifications, 
  isConnected, 
  markAsRead, 
  markAllAsRead, 
  clearNotifications 
} = notificationStore;

// Métodos
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

const deleteNotification = (notificationId: string) => {
  // Implementar eliminación individual si es necesario
  console.log('Eliminar notificación:', notificationId);
};

const showClearConfirm = async () => {
  const alert = await alertController.create({
    header: 'Limpiar notificaciones',
    message: '¿Estás seguro de que quieres eliminar todas las notificaciones?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Limpiar',
        role: 'destructive',
        handler: () => {
          clearNotifications();
        }
      }
    ]
  });

  await alert.present();
};
</script>

<style scoped>
.unread {
  --background: var(--ion-color-light-tint);
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--ion-color-medium);
}

.empty-state h2 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: 500;
}

.empty-state p {
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
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