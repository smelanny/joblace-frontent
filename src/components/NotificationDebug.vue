<template>
  <div class="notification-debug">
    <h3>🔧 Debug de Notificaciones</h3>
    
    <div class="debug-section">
      <h4>Estado de Conexión</h4>
      <p>Conectado a Pusher: <span :class="isConnected ? 'connected' : 'disconnected'">{{ isConnected ? '✅ Sí' : '❌ No' }}</span></p>
      <p>Estado de conexión: {{ connectionState }}</p>
      <p>Usuario ID: {{ currentUserId || 'No definido' }}</p>
    </div>

    <div class="debug-section">
      <h4>Notificaciones</h4>
      <p>Total: {{ notifications.length }}</p>
      <p>No leídas: {{ unreadCount }}</p>
      
      <div v-if="notifications.length > 0" class="notifications-list">
        <div v-for="notification in notifications" :key="notification.id" class="notification-item">
          <div class="notification-header">
            <span class="notification-id">ID: {{ notification.id }}</span>
            <span :class="notification.read ? 'read' : 'unread'">
              {{ notification.read ? 'Leída' : 'No leída' }}
            </span>
          </div>
          <div class="notification-content">
            <strong>{{ notification.estado }}</strong>: {{ notification.mensaje }}
          </div>
          <div class="notification-time">
            {{ formatTime(notification.timestamp) }}
          </div>
        </div>
      </div>
      <p v-else>No hay notificaciones</p>
    </div>

    <div class="debug-section">
      <h4>Acciones de Debug</h4>
      <ion-button @click="testConnection" fill="outline" size="small">
        Probar Conexión
      </ion-button>
      <ion-button @click="simulateNotification('aceptado')" fill="outline" size="small" color="success">
        Simular Aceptación
      </ion-button>
      <ion-button @click="simulateNotification('rechazado')" fill="outline" size="small" color="danger">
        Simular Rechazo
      </ion-button>
      <ion-button @click="clearAll" fill="outline" size="small" color="warning">
        Limpiar Todo
      </ion-button>
      <ion-button @click="runPusherTests" fill="outline" size="small" color="primary">
        Ejecutar Pruebas Pusher
      </ion-button>
    </div>

    <div class="debug-section">
      <h4>Logs</h4>
      <div class="logs-container">
        <div v-for="(log, index) in logs" :key="index" class="log-entry">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
      <ion-button @click="clearLogs" fill="outline" size="small">
        Limpiar Logs
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { IonButton } from '@ionic/vue';
import { notificationStore } from '../stores/notificationStore';
import { useNotifications } from '../composables/useNotifications';
import { pusher } from '../config/pusher';
import { runAllTests } from '../utils/pusherTest';

const logs = ref<Array<{time: string, message: string}>>([]);
const connectionState = ref('Desconocido');

// Store de notificaciones
const { 
  notifications, 
  isConnected, 
  unreadCount, 
  currentUserId,
  addNotification,
  clearNotifications 
} = notificationStore;

// Composable de notificaciones
const userId = Number(localStorage.getItem('user_id'));
const { connect } = useNotifications(userId);

// Métodos
const addLog = (message: string) => {
  const time = new Date().toLocaleTimeString();
  logs.value.unshift({ time, message });
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50);
  }
};

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleString();
};

const testConnection = () => {
  addLog('Probando conexión con Pusher...');
  addLog(`Estado actual: ${pusher.connection.state}`);
  addLog(`Conectado: ${pusher.connection.connected}`);
  connectionState.value = pusher.connection.state;
};

const simulateNotification = (estado: 'aceptado' | 'rechazado') => {
  const mensaje = estado === 'aceptado' 
    ? '¡Tu postulación ha sido aceptada! (Simulado)'
    : 'Tu postulación no ha sido seleccionada. (Simulado)';
  
  addLog(`Simulando notificación: ${estado}`);
  addNotification({ estado, mensaje });
};

const clearAll = () => {
  addLog('Limpiando todas las notificaciones');
  clearNotifications();
};

const clearLogs = () => {
  logs.value = [];
};

const runPusherTests = () => {
  addLog('🧪 Ejecutando pruebas de Pusher...');
  runAllTests();
};

// Observar cambios en el estado de conexión
watch(isConnected, (newValue) => {
  addLog(`Estado de conexión cambiado: ${newValue ? 'Conectado' : 'Desconectado'}`);
});

// Observar cambios en las notificaciones
watch(notifications, (newNotifications) => {
  addLog(`Notificaciones actualizadas: ${newNotifications.length} total`);
}, { deep: true });

// Observar cambios en el contador de no leídas
watch(unreadCount, (newCount) => {
  addLog(`Contador de no leídas: ${newCount}`);
});

onMounted(() => {
  addLog('Componente de debug montado');
  addLog(`Usuario ID: ${userId}`);
  
  if (userId) {
    addLog('Conectando notificaciones...');
    connect();
  } else {
    addLog('❌ No hay userId disponible');
  }
  
  // Verificar estado inicial
  testConnection();
});
</script>

<style scoped>
.notification-debug {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px;
  font-family: monospace;
  font-size: 14px;
}

.debug-section {
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.debug-section h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.connected {
  color: #28a745;
  font-weight: bold;
}

.disconnected {
  color: #dc3545;
  font-weight: bold;
}

.notifications-list {
  max-height: 200px;
  overflow-y: auto;
}

.notification-item {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 8px;
  background: #fafafa;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
}

.notification-id {
  color: #666;
}

.read {
  color: #28a745;
}

.unread {
  color: #dc3545;
  font-weight: bold;
}

.notification-content {
  margin-bottom: 5px;
}

.notification-time {
  font-size: 12px;
  color: #666;
}

.logs-container {
  max-height: 150px;
  overflow-y: auto;
  background: #000;
  color: #0f0;
  padding: 10px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.log-entry {
  margin-bottom: 2px;
}

.log-time {
  color: #888;
  margin-right: 10px;
}

ion-button {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style> 