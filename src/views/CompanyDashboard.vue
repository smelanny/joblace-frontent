<template>
  <ion-page>
    <ion-header :translucent="true" class="main-header">
      <ion-toolbar>
        <div class="header-row">
          <ion-button fill="clear" class="back-btn" @click="$router.back()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </ion-button>
          <h1 class="company-title">Google Jobs</h1>
          <div style="width:40px;"></div>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="company-summary">
        <div class="summary-item">
          <span class="summary-label">Open</span>
          <span class="summary-value">140</span>
        </div>
        <div class="summary-logo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="logo" />
          <div class="summary-company">Google</div>
        </div>
        <div class="summary-item">
          <span class="summary-label">Hired</span>
          <span class="summary-value">176K</span>
        </div>
      </div>
      <div class="solicitudes-section">
        <h2 class="solicitudes-title">Solicitudes</h2>
        <div class="solicitudes-list">
          <div v-for="(sol, idx) in solicitudes" :key="idx" class="solicitud-card">
            <img :src="sol.logo" class="solicitud-logo" />
            <div class="solicitud-info">
              <div class="solicitud-puesto-row">
                <span class="solicitud-puesto">{{ sol.puesto }}</span>
                <span class="solicitud-estado" :class="sol.estado.toLowerCase()">{{ sol.estado }}</span>
              </div>
              <div class="solicitud-detalles">
                <span class="solicitud-nombre">{{ sol.nombre }}</span>
                <span class="solicitud-ubicacion">{{ sol.ubicacion }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mostrar-todo">Mostrar todo</div>
      </div>
      <ion-button expand="block" class="publicar-btn" @click="publicarPuesto">PUBLICAR PUESTO</ion-button>
    </ion-content>
    <ion-footer>
      <ion-toolbar class="footer-toolbar">
        <ion-segment value="home" class="footer-tabs">
          <ion-segment-button value="home">
            <ion-icon name="home-outline"></ion-icon>
          </ion-segment-button>
          <ion-segment-button value="mail">
            <ion-icon name="mail-outline"></ion-icon>
          </ion-segment-button>
          <ion-segment-button value="bookmark">
            <ion-icon name="bookmark-outline"></ion-icon>
          </ion-segment-button>
          <ion-segment-button value="apps">
            <ion-icon name="apps-outline"></ion-icon>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonFooter, IonButton, IonIcon, IonSegment, IonSegmentButton } from '@ionic/vue';

const solicitudes = [
  {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    puesto: 'Product Designer',
    nombre: 'Frank Buzano',
    ubicacion: 'San José, CR',
    estado: 'Pendiente',
  },
  {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    puesto: 'UX Designer',
    nombre: 'Kit Connor',
    ubicacion: 'Heredia, CR',
    estado: 'Aceptado',
  },
  {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    puesto: 'Web Developer',
    nombre: 'Carlos Jimenez',
    ubicacion: 'Florida, US',
    estado: 'Rechazado',
  },
];

function publicarPuesto() {
  alert('Funcionalidad de publicación próximamente.');
}
</script>

<style scoped>
.main-header {
  --background: #f9f9fb;
  border-bottom: none;
}
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}
.back-btn {
  color: #181a2a;
  font-size: 24px;
}
.company-title {
  font-size: 24px;
  font-weight: bold;
  color: #181a2a;
  margin: 0;
}
.company-summary {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #fff;
  border-radius: 0 0 32px 32px;
  margin-bottom: 18px;
  padding: 18px 0 10px 0;
  box-shadow: 0 2px 12px rgba(59,108,183,0.04);
}
.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.summary-label {
  color: #b0b0b0;
  font-size: 16px;
}
.summary-value {
  color: #181a2a;
  font-size: 22px;
  font-weight: bold;
}
.summary-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.summary-logo img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #fff;
  object-fit: contain;
  box-shadow: 0 2px 8px rgba(59,108,183,0.08);
}
.summary-company {
  font-size: 18px;
  color: #181a2a;
  font-weight: 500;
}
.solicitudes-section {
  margin: 24px 0 0 0;
  padding: 0 16px;
}
.solicitudes-title {
  font-size: 20px;
  font-weight: bold;
  color: #181a2a;
  margin-bottom: 18px;
}
.solicitudes-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.solicitud-card {
  background: #fff;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 16px 18px;
  box-shadow: 0 2px 12px rgba(59,108,183,0.04);
  gap: 16px;
}
.solicitud-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #fff;
  object-fit: contain;
}
.solicitud-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.solicitud-puesto-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.solicitud-puesto {
  font-size: 17px;
  font-weight: bold;
  color: #181a2a;
}
.solicitud-estado {
  font-size: 15px;
  font-weight: 500;
}
.solicitud-estado.pendiente {
  color: #8b7cf6;
}
.solicitud-estado.aceptado {
  color: #1ec773;
}
.solicitud-estado.rechazado {
  color: #ff3b30;
}
.solicitud-detalles {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #8c8c8c;
  font-size: 15px;
}
.mostrar-todo {
  color: #b0b0b0;
  font-size: 16px;
  margin: 18px 0 0 8px;
}
.publicar-btn {
  margin: 38px 0 0 0;
  --background: #1566c3;
  --color: #fff;
  --border-radius: 14px;
  font-size: 18px;
  font-weight: bold;
  height: 54px;
}
.footer-toolbar {
  --background: #fff;
  border-top: 1px solid #f0f0f0;
}
.footer-tabs {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
ion-segment-button {
  --color-checked: #3b6cb7;
  --color: #b0b0b0;
  --indicator-color: transparent;
  background: transparent;
}
ion-segment-button.ion-activated {
  --color-checked: #3b6cb7;
}
</style> 