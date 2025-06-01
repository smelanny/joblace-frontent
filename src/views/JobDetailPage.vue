<template>
  <ion-page>
    <ion-content :fullscreen="true" class="job-detail-content">
      <div class="job-header">
        <ion-button fill="clear" class="back-btn" @click="$router.back()">
          <ion-icon name="chevron-back-outline"></ion-icon>
        </ion-button>
        <img class="job-logo" :src="oferta.logo" />
        <ion-button fill="clear" class="bookmark-btn">
          <ion-icon name="bookmark-outline"></ion-icon>
        </ion-button>
        <h2 class="job-title">{{ oferta.titulo }}</h2>
        <p class="job-company">{{ oferta.empresa }}</p>
        <div class="job-tags">
          <span v-for="tag in oferta.tags" :key="tag" class="job-tag">{{ tag }}</span>
        </div>
        <div class="job-info">
          <span class="job-salario">{{ oferta.salario }}</span>
          <span class="job-ubicacion">San José, CR</span>
        </div>
      </div>
      <div class="job-tabs">
        <span :class="['job-tab', activeTab === 'description' ? 'active' : '']" @click="activeTab = 'description'">Description</span>
        <span :class="['job-tab', activeTab === 'requirement' ? 'active' : '']" @click="activeTab = 'requirement'">Requirement</span>
        <span :class="['job-tab', activeTab === 'about' ? 'active' : '']" @click="activeTab = 'about'">About</span>
        <span :class="['job-tab', activeTab === 'reviews' ? 'active' : '']" @click="activeTab = 'reviews'">Reviews</span>
      </div>
      <div class="job-tab-content">
        <ul v-if="activeTab === 'requirement'">
          <li v-for="(req, idx) in oferta.requisitos" :key="idx">{{ req }}</li>
        </ul>
        <div v-else>
          <p style="color:#b0b0b0;">Contenido de la pestaña "{{ activeTab }}"</p>
        </div>
      </div>
      <ion-button expand="block" class="apply-btn">Aplicar</ion-button>
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
import { ref } from 'vue';
import { IonPage, IonContent, IonButton, IonIcon, IonFooter, IonToolbar, IonSegment, IonSegmentButton } from '@ionic/vue';

const oferta = {
  logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  titulo: 'Product Designer',
  empresa: 'Google',
  tags: ['Design', 'Full-Time', 'Junior'],
  salario: '$160,000/year',
  requisitos: [
    "Master's degree in Design, Computer Science, Computer Interaction, or a related field.",
    '3 years of relevant industry experience.',
    'Ability to lead and ideate products from scratch and improve features, all with a user-centered design process.',
    'Skills in communicating and influencing product design strategy.',
    'Excellent problem-solving skills and familiarity with technical constraints and limitations.',
    'Experience designing across multiple platforms.'
  ]
};

const activeTab = ref('requirement');
</script>

<style scoped>
.job-detail-content {
  --background: #f9f9fb;
  padding-bottom: 80px;
}
.job-header {
  background: #3b6cb7;
  border-bottom-left-radius: 36px;
  border-bottom-right-radius: 36px;
  padding: 32px 16px 24px 16px;
  text-align: center;
  position: relative;
}
.back-btn {
  position: absolute;
  left: 12px;
  top: 18px;
  z-index: 2;
  color: #fff;
}
.bookmark-btn {
  position: absolute;
  right: 12px;
  top: 18px;
  z-index: 2;
  color: #fff;
}
.job-logo {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: #fff;
  object-fit: contain;
  margin: 0 auto 12px auto;
  display: block;
  box-shadow: 0 2px 12px rgba(59,108,183,0.08);
}
.job-title {
  color: #fff;
  font-size: 26px;
  font-weight: bold;
  margin: 12px 0 0 0;
}
.job-company {
  color: #e0e0e0;
  font-size: 18px;
  margin: 0 0 16px 0;
}
.job-tags {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}
.job-tag {
  background: rgba(255,255,255,0.18);
  border-radius: 16px;
  padding: 6px 18px;
  font-size: 15px;
  color: #fff;
}
.job-info {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 18px;
  color: #fff;
  font-weight: bold;
}
.job-salario {
  margin-left: 16px;
}
.job-ubicacion {
  margin-right: 16px;
}
.job-tabs {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin: 32px 0 0 0;
}
.job-tab {
  font-size: 17px;
  color: #b0b0b0;
  font-weight: 500;
  cursor: pointer;
  padding-bottom: 6px;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}
.job-tab.active {
  color: #181a2a;
  border-bottom: 2.5px solid #181a2a;
}
.job-tab-content {
  margin: 24px 24px 0 24px;
  color: #8c8c8c;
  font-size: 16px;
}
.job-tab-content ul {
  padding-left: 18px;
}
.apply-btn {
  margin: 32px 16px 0 16px;
  --background: #1566c3;
  --color: #fff;
  --border-radius: 14px;
  font-size: 20px;
  font-weight: bold;
  height: 56px;
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