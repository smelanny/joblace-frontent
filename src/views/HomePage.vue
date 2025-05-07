<template>
  <ion-page>
    <ion-header :translucent="true" class="main-header">
      <ion-toolbar>
        <div class="header-content">
          <div>
            <p class="bienvenido">Bienvenido</p>
            <h1 class="nombre">Frank Buzano <span class="emoji">👋</span></h1>
          </div>
          <div class="avatar-container">
            <img class="avatar" src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" />
            <span class="notificacion"></span>
          </div>
        </div>
        <div class="search-filter-row">
          <ion-searchbar placeholder="Buscar trabajo" class="searchbar"></ion-searchbar>
          <ion-button fill="clear" class="filter-btn">
            <ion-icon :icon="funnelOutline" />
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="ofertas-section">
        <h2 class="ofertas-title">Ofertas de empleo</h2>
        <div class="ofertas-list">
          <div v-for="(oferta, idx) in ofertas" :key="idx" :class="['oferta-card', idx === 1 ? 'oscura' : '', idx === 2 ? 'clara' : '']"
            @click="idx === 0 ? goToJobDetail(1) : null"
            :style="idx === 0 ? 'cursor:pointer;' : ''">
            <div class="oferta-header">
              <img :src="oferta.logo" class="oferta-logo" />
              <div>
                <h3 class="oferta-titulo">{{ oferta.titulo }}</h3>
                <p class="oferta-empresa">{{ oferta.empresa }}</p>
              </div>
            </div>
            <div class="oferta-tags">
              <span v-for="tag in oferta.tags" :key="tag" class="oferta-tag">{{ tag }}</span>
            </div>
            <div class="oferta-info">
              <span class="oferta-salario">{{ oferta.salario }}</span>
              <span class="oferta-ubicacion">{{ oferta.ubicacion }}</span>
            </div>
          </div>
        </div>
      </div>
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
      <div class="custom-footer">
        © 2024 JobLace. Todos los derechos reservados.
      </div>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonFooter, IonSearchbar, IonButton, IonIcon, IonSegment, IonSegmentButton } from '@ionic/vue';
import { funnelOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';

const router = useRouter();
const goToJobDetail = (id: number) => {
  router.push(`/job/${id}`);
};

const ofertas = [
  {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    titulo: 'Product Designer',
    empresa: 'Google',
    tags: ['Design', 'Full-Time', 'Junior'],
    salario: '$160,000/year',
    ubicacion: 'San José, CR',
  },
  {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    titulo: 'Full-Stack Developer',
    empresa: 'Google',
    tags: ['Design', 'Full-Time', 'Junior'],
    salario: '$160,000/year',
    ubicacion: 'California, USA',
  },
  {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    titulo: 'Software Engineer',
    empresa: 'Google',
    tags: ['Engineering', 'Full-Time', 'Senior'],
    salario: '$180,000/year',
    ubicacion: 'California, USA',
  },
];
</script>

<style scoped>
.main-header {
  --background: #f9f9fb;
  border-bottom: none;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}
.bienvenido {
  color: #b0b0b0;
  margin: 0;
  font-size: 18px;
}
.nombre {
  font-size: 28px;
  font-weight: bold;
  margin: 0;
  color: #181a2a;
}
.emoji {
  font-size: 24px;
}
.avatar-container {
  position: relative;
}
.avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.notificacion {
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #ff3b30;
  border-radius: 50%;
  border: 2px solid #fff;
}
.search-filter-row {
  display: flex;
  align-items: center;
  margin-top: 18px;
}
.searchbar {
  flex: 1;
  --background: #f3f3f6;
  --box-shadow: none;
  --border-radius: 16px;
  margin-right: 10px;
}
.filter-btn {
  --background: #f3f3f6;
  --color: #181a2a;
  border-radius: 12px;
  min-width: 44px;
  min-height: 44px;
}
.ofertas-section {
  margin-top: 24px;
  padding: 0 16px;
}
.ofertas-title {
  font-size: 22px;
  font-weight: bold;
  color: #181a2a;
  margin-bottom: 18px;
}
.ofertas-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.oferta-card {
  background: #3b6cb7;
  border-radius: 28px;
  padding: 22px 20px;
  color: #fff;
  box-shadow: 0 2px 12px rgba(59,108,183,0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.oferta-card.oscura {
  background: #181a2a;
}
.oferta-card.clara {
  background: #4e8cff;
}
.oferta-header {
  display: flex;
  align-items: center;
  gap: 16px;
}
.oferta-logo {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: #fff;
  object-fit: contain;
  padding: 6px;
}
.oferta-titulo {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}
.oferta-empresa {
  font-size: 16px;
  color: #e0e0e0;
  margin: 0;
}
.oferta-tags {
  display: flex;
  gap: 10px;
}
.oferta-tag {
  background: rgba(255,255,255,0.18);
  border-radius: 16px;
  padding: 4px 14px;
  font-size: 14px;
  color: #fff;
}
.oferta-info {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: #fff;
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
.custom-footer {
  text-align: center;
  font-size: 14px;
  color: #b0b0b0;
  padding: 12px 0 18px 0;
  background: transparent;
}
</style> 