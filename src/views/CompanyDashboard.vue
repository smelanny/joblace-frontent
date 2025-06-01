<template>
  <ion-page>
    <ion-header :translucent="true" class="main-header">
      <ion-toolbar>
        <div class="header-row">
          <ion-button fill="clear" class="back-btn" @click="$router.back()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </ion-button>
          <h1 class="company-title">{{ empresa?.nombre || 'Empresa' }}</h1>
          <div style="width:40px;"></div>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="company-summary">
        <div class="summary-item">
          <span class="summary-label">Open</span>
          <span class="summary-value">0</span>
        </div>
        <div class="summary-logo">
          <img v-if="empresa?.logo_url" :src="empresa.logo_url" alt="logo" />
          <div class="summary-company">{{ empresa?.nombre || '' }}</div>
        </div>
        <div class="summary-item">
          <span class="summary-label">Hired</span>
          <span class="summary-value">0</span>
        </div>
      </div>
      <div class="puestos-header">
        <h2 class="puestos-title">Puestos publicados</h2>
        <ion-button size="small" class="consultar-btn" @click="consultarPostulaciones">
          Consultar postulaciones recibidas
        </ion-button>
      </div>
      <div class="puestos-publicados-list">
        <div v-if="ofertas.length === 0" class="puestos-vacio">No hay puestos publicados aún.</div>
        <div v-for="oferta in ofertas" :key="oferta.id" class="puesto-card">
          <div class="puesto-titulo">{{ oferta.titulo_puesto }}</div>
          <div class="puesto-detalles">
            <span>{{ oferta.modalidad }}</span> ·
            <span>{{ oferta.tipo_jornada }}</span> ·
            <span>{{ oferta.ubicacion }}</span>
          </div>
          <div class="puesto-salario">Salario: {{ oferta.salario_estimado }}</div>
          <div class="puesto-descripcion">{{ oferta.descripcion_puesto }}</div>
        </div>
      </div>
      <ion-button expand="block" class="publicar-btn" @click="$router.push('/publicar-puesto')">PUBLICAR PUESTO</ion-button>
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
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonContent, IonFooter, IonButton, IonIcon, IonSegment, IonSegmentButton } from '@ionic/vue';

const empresa = ref<any>(null);
const ofertas = ref<any[]>([]);

function consultarPostulaciones() {
  alert('Funcionalidad de consulta de postulaciones próximamente.');
}

onMounted(async () => {
  const user_id = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');
  if (!user_id || !token) return;
  try {
    const resp = await fetch(`http://localhost:8081/api/usuarios/${user_id}/representaciones`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    const data = await resp.json();
    if (Array.isArray(data) && data.length > 0 && data[0].empresa) {
      empresa.value = data[0].empresa;
    } else if (Array.isArray(data) && data.length > 0) {
      empresa.value = data[0];
    }
    // Obtener ofertas de empleo de la empresa
    if (empresa.value?.id) {
      const ofertasResp = await fetch('http://localhost:8081/api/ofertas', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const ofertasData = await ofertasResp.json();
      if (Array.isArray(ofertasData)) {
        ofertas.value = ofertasData.filter(o => o.empresa_id === empresa.value.id);
      }
    }
  } catch (e) {
    // Error al obtener las ofertas de empleo
  }
});
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
.puestos-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24px 0 0 0;
  padding: 0 16px;
}
.puestos-title {
  font-size: 20px;
  font-weight: bold;
  color: #181a2a;
  margin-bottom: 0;
}
.consultar-btn {
  --background: #1566c3;
  --color: #fff;
  --border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  height: 32px;
  margin-left: 12px;
}
.puestos-publicados-list {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.puesto-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(59,108,183,0.04);
  padding: 18px 18px 12px 18px;
}
.puesto-titulo {
  font-size: 1.1em;
  font-weight: bold;
  color: #181a2a;
  margin-bottom: 4px;
}
.puesto-detalles {
  color: #888;
  font-size: 0.97em;
  margin-bottom: 4px;
}
.puesto-salario {
  color: #1566d6;
  font-size: 1em;
  margin-bottom: 4px;
}
.puesto-descripcion {
  color: #444;
  font-size: 0.97em;
}
.puestos-vacio {
  color: #b0b0b0;
  text-align: center;
  margin: 24px 0;
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