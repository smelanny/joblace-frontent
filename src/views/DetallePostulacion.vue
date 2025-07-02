<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button fill="clear" @click="$router.back()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Detalle de Postulación</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding postulacion-detail-content">
      <div v-if="loading" class="loading">Cargando postulación...</div>
      <div v-else-if="postulacion" class="postulacion-container">
        <div class="postulacion-header-simple">
          <h2 class="postulacion-title">{{ postulacion.oferta?.titulo_puesto }}</h2>
          <div class="postulacion-header-row">
            <span class="status-chip" :class="estadoColor(postulacion.estado)">
              {{ formatearEstado(postulacion.estado) }}
            </span>
            <span class="postulacion-fecha">
              <ion-icon :icon="calendarOutline"></ion-icon>
              {{ formatearFecha(postulacion.fecha_postulacion) }}
            </span>
            <span class="postulacion-ubicacion">
              <ion-icon :icon="locationOutline"></ion-icon>
              {{ postulacion.oferta?.ubicacion }}
            </span>
          </div>
        </div>

        <!-- datos principales -->
        <div class="postulacion-main-data">
          <div class="main-block">
            <h3>Datos del candidato</h3>
            <div class="dato-row"><span class="dato-label">Nombre:</span> <span>{{ postulacion.usuario?.nombre }}</span></div>
            <div class="dato-row"><span class="dato-label">Email:</span> <span>{{ postulacion.usuario?.email }}</span></div>
          </div>
          <div class="main-block" v-if="postulacion.mensaje_adicional">
            <h3>Mensaje del candidato</h3>
            <div class="mensaje-content">{{ postulacion.mensaje_adicional }}</div>
          </div>
          <div class="main-block">
            <h3>Datos de la oferta</h3>
            <div class="dato-row"><span class="dato-label">Salario:</span> <span>${{ postulacion.oferta?.salario_estimado }}</span></div>
            <div class="dato-row"><span class="dato-label">Modalidad:</span> <span>{{ formatearModalidad(postulacion.oferta?.modalidad) }}</span></div>
            <div class="dato-row"><span class="dato-label">Jornada:</span> <span>{{ formatearJornada(postulacion.oferta?.tipo_jornada) }}</span></div>
            <div class="dato-row"><span class="dato-label">Fecha de publicación:</span> <span>{{ formatearFecha(postulacion.oferta?.fecha_publicacion) }}</span></div>
            <div class="dato-row"><span class="dato-label">Ubicación:</span> <span>{{ postulacion.oferta?.ubicacion }}</span></div>
            <div class="dato-row"><span class="dato-label">Descripción:</span> <span>{{ postulacion.oferta?.descripcion_puesto }}</span></div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="action-buttons" v-if="postulacion.estado === 'pendiente'">
          <ion-button expand="block" color="success" @click="cambiarEstado('aceptado')" :disabled="loadingAction">
            <ion-icon :icon="checkmarkOutline" slot="start"></ion-icon>
            Aceptar Candidato
          </ion-button>
          <ion-button expand="block" color="danger" @click="cambiarEstado('rechazado')" :disabled="loadingAction">
            <ion-icon :icon="closeOutline" slot="start"></ion-icon>
            Rechazar Candidato
          </ion-button>
        </div>

        <ion-text color="success" v-if="success">{{ success }}</ion-text>
        <ion-text color="danger" v-if="error">{{ error }}</ion-text>
      </div>
      <div v-else class="no-postulacion">
        <ion-text color="medium">No se encontró la postulación</ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonIcon, IonButtons, IonText 
} from '@ionic/vue';
import {
  calendarOutline, locationOutline, checkmarkOutline, closeOutline
} from 'ionicons/icons';

const route = useRoute();
const postulacion = ref(null);
const loading = ref(true);
const loadingAction = ref(false);
const error = ref('');
const success = ref('');

function estadoColor(estado) {
  if (estado === 'pendiente') return 'estado-pendiente';
  if (estado === 'aceptado') return 'estado-aceptado';
  if (estado === 'rechazado') return 'estado-rechazado';
  return '';
}

function formatearEstado(estado) {
  if (estado === 'pendiente') return 'Pendiente';
  if (estado === 'aceptado') return 'Aceptado';
  if (estado === 'rechazado') return 'Rechazado';
  return estado;
}

function formatearFecha(fecha) {
  if (!fecha) return '';
  const d = new Date(fecha);
  if (isNaN(d)) return fecha;
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatearJornada(jornada) {
  const formatos = {
    tiempo_completo: 'Tiempo completo',
    medio_tiempo: 'Medio tiempo',
    freelance: 'Freelance',
    practica: 'Práctica'
  };
  return formatos[jornada] || jornada;
}

function formatearModalidad(modalidad) {
  const formatos = {
    presencial: 'Presencial',
    remoto: 'Remoto',
    hibrido: 'Híbrido'
  };
  return formatos[modalidad] || modalidad;
}

async function cargarPostulacion() {
  loading.value = true;
  error.value = '';
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8081/api/postulaciones/${route.params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('No se pudo cargar la postulación');
    }
    
    const data = await response.json();
    postulacion.value = data;
  } catch (e) {
    error.value = 'Error al cargar la postulación: ' + e.message;
  } finally {
    loading.value = false;
  }
}

async function cambiarEstado(nuevoEstado) {
  loadingAction.value = true;
  error.value = '';
  success.value = '';
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8081/api/postulaciones/${route.params.id}/estado`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ estado: nuevoEstado })
    });
    
    if (response.ok) {
      success.value = `Postulación ${nuevoEstado === 'aceptado' ? 'aceptada' : 'rechazada'} con éxito`;
      postulacion.value.estado = nuevoEstado;
    } else {
      const data = await response.json();
      error.value = data.message || 'Error al cambiar el estado';
    }
  } catch (e) {
    error.value = 'Error de red: ' + e.message;
  } finally {
    loadingAction.value = false;
  }
}

onMounted(cargarPostulacion);
</script>

<style scoped>
.postulacion-detail-content {
  background: #f9f9fb;
  min-height: 100vh;
}

.loading, .no-postulacion {
  text-align: center;
  padding: 40px 20px;
  color: #b0b0b0;
}

.postulacion-container {
  max-width: 700px;
  margin: 0 auto;
}

.postulacion-header-simple {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 12px rgba(59,108,183,0.08);
  padding: 28px 24px 18px 24px;
  margin-bottom: 20px;
}

.postulacion-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #181a2a;
  margin: 0 0 12px 0;
}

.postulacion-header-row {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
}

.status-chip {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: bold;
}
.estado-pendiente {
  background: #e3f2fd;
  color: #1566c3;
}
.estado-aceptado {
  background: #e8f5e8;
  color: #1bbf5c;
}
.estado-rechazado {
  background: #ffebee;
  color: #e74c3c;
}
.postulacion-fecha, .postulacion-ubicacion {
  color: #666;
  font-size: 1em;
  display: flex;
  align-items: center;
}
.postulacion-fecha ion-icon, .postulacion-ubicacion ion-icon {
  margin-right: 4px;
}

.postulacion-main-data {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(59,108,183,0.04);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.main-block h3 {
  margin: 0 0 12px 0;
  color: #1566c3;
  font-size: 1.1em;
}
.dato-row {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
}
.dato-label {
  font-weight: 500;
  color: #333;
}
.mensaje-content {
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 8px;
  color: #333;
  line-height: 1.5;
}
.action-buttons {
  display: grid;
  gap: 12px;
  margin-top: 24px;
}
.action-buttons ion-button {
  --border-radius: 12px;
  font-weight: bold;
}
@media (max-width: 768px) {
  .postulacion-container {
    padding: 0 4px;
  }
  .postulacion-header-simple {
    padding: 18px 8px 12px 8px;
  }
  .postulacion-main-data {
    padding: 12px 4px;
  }
}
</style>