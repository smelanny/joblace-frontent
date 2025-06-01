<template>
  <ion-page>
    <ion-content class="ion-padding setup-content">
      <div class="setup-container">
        <h1 class="setup-title">Configura tu empresa</h1>
        <p class="setup-subtitle">Crea tu empresa y completa tus datos como representante para comenzar a publicar ofertas.</p>
        <form @submit.prevent="handleSetup" class="setup-form">
          <h2 class="section-title">Datos de la empresa</h2>
          <ion-item class="setup-item">
            <ion-label position="stacked">Nombre de la empresa</ion-label>
            <ion-input v-model="empresa.nombre" required />
          </ion-item>
          <ion-item class="setup-item">
            <ion-label position="stacked">Descripción</ion-label>
            <ion-input v-model="empresa.descripcion" required />
          </ion-item>
          <ion-item class="setup-item">
            <ion-label position="stacked">Industria</ion-label>
            <ion-input v-model="empresa.industria" required />
          </ion-item>
          <ion-item class="setup-item">
            <ion-label position="stacked">Sitio web</ion-label>
            <ion-input v-model="empresa.sitio_web" />
          </ion-item>
          <ion-item class="setup-item">
            <ion-label position="stacked">Logo URL</ion-label>
            <ion-input v-model="empresa.logo_url" />
          </ion-item>

          <h2 class="section-title">Tus datos como representante</h2>
          <ion-item class="setup-item">
            <ion-label position="stacked">Cargo</ion-label>
            <ion-input v-model="cargo" required />
          </ion-item>
          <ion-item class="setup-item">
            <ion-label position="stacked">Teléfono de contacto</ion-label>
            <ion-input v-model="telefono_contacto" required />
          </ion-item>

          <ion-button expand="block" type="submit" :disabled="loading" class="setup-btn">
            {{ loading ? 'Guardando...' : 'Guardar y continuar' }}
          </ion-button>
        </form>
        <ion-text color="danger" v-if="error">{{ error }}</ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, IonText } from '@ionic/vue';
import { useRouter } from 'vue-router';

const empresa = ref({
  nombre: '',
  descripcion: '',
  industria: '',
  sitio_web: '',
  logo_url: ''
});
const cargo = ref('');
const telefono_contacto = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();

// Suponiendo que tienes el user_id en localStorage o en algún store
const user_id = localStorage.getItem('user_id');
const token = localStorage.getItem('token');

async function handleSetup() {
  error.value = '';
  loading.value = true;
  try {
    // 1. Crear empresa
    const empresaRes = await fetch('http://localhost:8081/api/empresas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(empresa.value)
    });
    const empresaData = await empresaRes.json();
    if (!empresaRes.ok) {
      error.value = empresaData.message || 'Error al crear la empresa';
      loading.value = false;
      return;
    }
    const empresa_id = empresaData.empresa.id;

    // 2. Asociar representante
    const repRes = await fetch('http://localhost:8081/api/representantes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id,
        empresa_id,
        cargo: cargo.value,
        telefono_contacto: telefono_contacto.value
      })
    });
    const repData = await repRes.json();
    if (!repRes.ok) {
      error.value = repData.message || 'Error al asociar representante';
      loading.value = false;
      return;
    }
    // Redirigir al dashboard de empresa 
    router.push('/company');
  } catch (err) {
    error.value = 'Error de red: ' + err.message;
  }
  loading.value = false;
}
</script>

<style scoped>
.setup-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background: #fff;
}
.setup-container {
  width: 100%;
  max-width: 700px;
  margin: 40px auto 0 auto;
  background: #fff;
  border-radius: 0;
  box-shadow: none;
  padding: 32px 24px 16px 24px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
@media (max-width: 800px) {
  .setup-container {
    max-width: 95vw;
    padding: 16px 4vw;
  }
}
.setup-title {
  color: #18186B;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
}
.setup-subtitle {
  color: #888;
  font-size: 0.95rem;
  margin-bottom: 24px;
  text-align: center;
}
.section-title {
  font-size: 1.1em;
  font-weight: bold;
  margin: 18px 0 8px 0;
  color: #18186B;
}
.setup-form {
  width: 100%;
}
.setup-item {
  border-radius: 8px;
  margin-bottom: 12px;
  background: #f7f8fa;
}
.setup-btn {
  background: #1566d6;
  color: #fff;
  font-weight: bold;
  letter-spacing: 1px;
  font-size: 1.1em;
  border-radius: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
}
</style> 