<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button fill="clear" @click="$router.back()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Solicitudes recibidas</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="postulaciones-content">
      <div class="company-summary-card">
        <div class="company-logo-card">
          <img :src="logoEmpresa" alt="Logo empresa" />
        </div>
        <div class="company-name-card">{{ empresaNombre }}</div>
        <div class="company-stats-card">
          <div class="company-stat-card">
            <div class="stat-label-card">Open</div>
            <div class="stat-value-card">{{ openCount }}</div>
          </div>
          <div class="company-stat-card">
            <div class="stat-label-card">Hired</div>
            <div class="stat-value-card">{{ hiredCount }}</div>
          </div>
        </div>
      </div>
      <div class="solicitudes-header">
        <h2 class="solicitudes-title">Solicitudes</h2>
      </div>
      <div class="solicitudes-list">
        <div v-if="loading" class="loading">Cargando postulaciones...</div>
        <div v-else-if="postulaciones.length === 0" class="no-postulaciones">No hay postulaciones recibidas.</div>
        <div v-else>
          <div v-for="post in postulaciones" :key="post.postulacion_id" class="solicitud-card">
            <img class="solicitud-logo" :src="post.oferta?.empresa?.logo_url || defaultLogo(post.oferta?.empresa?.nombre)" />
            <div class="solicitud-info">
              <div class="solicitud-titulo">{{ post.oferta?.titulo_puesto }}</div>
              <div class="solicitud-candidato">{{ post.usuario?.nombre }}</div>
              <div class="solicitud-ubicacion">{{ post.oferta?.ubicacion }}</div>
            </div>
            <div class="solicitud-estado" :class="estadoColor(post.estado)">{{ formatearEstado(post.estado) }}</div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonButtons } from '@ionic/vue';

const postulaciones = ref([]);
const loading = ref(true);
const router = useRouter();

const logoEmpresa = ref('');
const empresaNombre = ref('');
const openCount = ref(0);
const hiredCount = ref(0);

function defaultLogo(nombre) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre || 'Empresa')}&background=1566d6&color=fff`;
}

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

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function cargarPostulaciones() {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    // Obtener empresa del usuario
    const empresaResp = await fetch(`http://localhost:8081/api/usuarios/${user_id}/representaciones`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    const empresaData = await empresaResp.json();
    let empresaId = null;
    let empresaObj = null;
    if (Array.isArray(empresaData) && empresaData.length > 0 && empresaData[0].empresa) {
      empresaId = empresaData[0].empresa.id;
      empresaObj = empresaData[0].empresa;
    } else if (Array.isArray(empresaData) && empresaData.length > 0) {
      empresaId = empresaData[0].id;
      empresaObj = empresaData[0];
    }
    if (empresaObj) {
      empresaNombre.value = empresaObj.nombre || 'Empresa';
      if (empresaObj.logo_url) {
        logoEmpresa.value = empresaObj.logo_url;
      } else if (empresaObj.nombre) {
        logoEmpresa.value = `https://ui-avatars.com/api/?name=${encodeURIComponent(empresaObj.nombre)}&background=1566d6&color=fff`;
      }
      openCount.value = randomInt(10, 200);
      hiredCount.value = randomInt(1, 100);
    }
    if (!empresaId) {
      postulaciones.value = [];
      loading.value = false;
      return;
    }
    // Obtener postulaciones
    const resp = await fetch(`http://localhost:8081/api/empresas/${empresaId}/postulaciones`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    const data = await resp.json();
    postulaciones.value = Array.isArray(data) ? data : [];
  } catch (e) {
    postulaciones.value = [];
  }
  loading.value = false;
}

onMounted(cargarPostulaciones);
</script>

<style scoped>
.postulaciones-content {
  background: #f9f9fb;
  min-height: 100vh;
}
.company-summary-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 12px rgba(59,108,183,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 18px 18px 18px;
  margin: 24px 18px 12px 18px;
}
.company-logo-card img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #fff;
  object-fit: contain;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(59,108,183,0.08);
}
.company-name-card {
  font-size: 1.3em;
  font-weight: bold;
  color: #181a2a;
  margin-bottom: 8px;
  text-align: center;
}
.company-stats-card {
  display: flex;
  gap: 32px;
  justify-content: center;
  margin-top: 4px;
}
.company-stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-label-card {
  color: #b0b0b0;
  font-size: 1em;
}
.stat-value-card {
  font-size: 1.2em;
  font-weight: bold;
  color: #1566c3;
}
.solicitudes-list {
  margin: 32px 0 0 0;
  padding: 0 12px;
}
.solicitud-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(59,108,183,0.04);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 18px;
  margin-bottom: 18px;
}
.solicitud-logo {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #fff;
  object-fit: contain;
  box-shadow: 0 2px 8px rgba(59,108,183,0.08);
}
.solicitud-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.solicitud-titulo {
  font-size: 1.1em;
  font-weight: bold;
  color: #181a2a;
}
.solicitud-candidato {
  color: #3b6cb7;
  font-size: 1em;
  font-weight: 500;
}
.solicitud-ubicacion {
  color: #888;
  font-size: 0.97em;
}
.solicitud-estado {
  font-size: 1em;
  font-weight: bold;
  margin-left: 10px;
}
.estado-pendiente {
  color: #1566c3;
}
.estado-aceptado {
  color: #1bbf5c;
}
.estado-rechazado {
  color: #e74c3c;
}
.loading, .no-postulaciones {
  color: #b0b0b0;
  text-align: center;
  margin: 32px 0;
}
.solicitudes-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24px 0 0 0;
  padding: 0 16px;
}
.solicitudes-title {
  font-size: 20px;
  font-weight: bold;
  color: #181a2a;
  margin-bottom: 0;
}
</style> 