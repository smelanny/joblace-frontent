<template>
  <ion-page>
    <ion-content class="ion-padding job-detail-content">
      <div class="job-header">
        <div class="job-logo">
          <img :src="logoEmpresa" alt="Logo empresa" />
        </div>
        <div class="job-main-info">
          <h2 class="job-title">{{ oferta?.titulo_puesto }}</h2>
          <div class="job-company">{{ oferta?.empresa?.nombre }}</div>
          <div class="job-chips">
            <span v-for="cat in oferta?.categorias || []" :key="cat.id" class="chip">{{ cat.nombre }}</span>
            <span class="chip">{{ formatearJornada(oferta?.tipo_jornada) }}</span>
            <span class="chip">{{ formatearModalidad(oferta?.modalidad) }}</span>
          </div>
          <div class="job-salary-location">
            <span class="salary">${{ oferta?.salario_estimado }}/año</span>
            <span class="location">{{ oferta?.ubicacion }}</span>
          </div>
        </div>
      </div>

      <div class="job-tabs">
        <button v-for="tab in tabs" :key="tab" :class="['tab-btn', {active: currentTab === tab}]" @click="currentTab = tab">
          {{ tab }}
        </button>
      </div>

      <div class="tab-content">
        <div v-if="currentTab === 'Descripción'">
          <p>{{ oferta?.descripcion_puesto }}</p>
        </div>
        <div v-else-if="currentTab === 'Requerimientos'">
          <ul>
            <li v-for="req in requerimientos" :key="req">{{ req }}</li>
          </ul>
        </div>
        <div v-else-if="currentTab === 'About'">
          <p><b>Empresa:</b> {{ oferta?.empresa?.nombre }}</p>
          <p><b>Publicado por:</b> {{ oferta?.usuario?.nombre }}</p>
          <p><b>Fecha de publicación:</b> {{ oferta?.fecha_publicacion }}</p>
        </div>
        <div v-else-if="currentTab === 'Reviews'">
          <p>No hay reviews disponibles.</p>
        </div>
      </div>

      <!-- Campo de mensaje adicional -->
      <ion-textarea
        v-model="mensajeAdicional"
        placeholder="Mensaje adicional (opcional)"
        rows="3"
        class="mensaje-adicional"
      ></ion-textarea>

      <ion-button expand="block" class="aplicar-btn" @click="postularse" :disabled="yaPostulado || loading">
        {{ yaPostulado ? 'Ya postulado' : loading ? 'Enviando...' : 'Aplicar' }}
      </ion-button>
      <ion-text color="danger" v-if="error">{{ error }}</ion-text>
      <ion-text color="success" v-if="success">{{ success }}</ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { IonPage, IonContent, IonButton, IonText, IonTextarea } from '@ionic/vue';

const route = useRoute();
const oferta = ref(null);
const loading = ref(false);
const error = ref('');
const success = ref('');
const yaPostulado = ref(false);
const logoEmpresa = ref('https://ui-avatars.com/api/?name=Empresa&background=1566d6&color=fff');
const currentTab = ref('Descripción');
const tabs = ['Descripción', 'Requerimientos', 'About', 'Reviews'];
const requerimientos = ref([
  'Licenciatura o experiencia relevante en el área.',
  'Habilidades de comunicación y trabajo en equipo.',
  'Capacidad de adaptación y aprendizaje rápido.',
  'Conocimientos técnicos relacionados al puesto.'
]);
const mensajeAdicional = ref('');

function formatearJornada(jornada) {
  const formatos = {
    tiempo_completo: 'Full-Time',
    medio_tiempo: 'Part-Time',
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

async function cargarOferta() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:8081/api/ofertas/${route.params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    const data = await res.json();
    oferta.value = data;
    if (data.empresa && data.empresa.logo_url) {
      logoEmpresa.value = data.empresa.logo_url;
    } else if (data.empresa && data.empresa.nombre) {
      logoEmpresa.value = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.empresa.nombre)}&background=1566d6&color=fff`;
    }
    await verificarPostulacion();
  } catch (e) {
    error.value = 'No se pudo cargar la oferta.';
  }
}

async function verificarPostulacion() {
  yaPostulado.value = false;
}

async function postularse() {
  error.value = '';
  success.value = '';
  loading.value = true;
  try {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8081/api/postulaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id: user_id,
        oferta_id: oferta.value.id,
        mensaje_adicional: mensajeAdicional.value
      })
    });
    const data = await res.json();
    if (res.ok) {
      success.value = '¡Postulación enviada con éxito!';
      yaPostulado.value = true;
    } else {
      error.value = data.message || (data.errors ? Object.values(data.errors).join(', ') : 'Error al postularse');
    }
  } catch (e) {
    error.value = 'Error de red: ' + e.message;
  }
  loading.value = false;
}

onMounted(cargarOferta);
</script>

<style scoped>
.job-detail-content {
  width: 100%;
  max-width: 100vw;
  margin: 0;
  background: #fff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 0;
}
.job-header {
  background: #134b8d;
  border-radius: 0 0 32px 32px;
  padding: 32px 24px 24px 24px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}
.job-logo img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #fff;
  margin-bottom: 12px;
}
.job-title {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0 0 4px 0;
  color: #fff;
  text-align: center;
}
.job-company {
  font-size: 1.1em;
  margin-bottom: 10px;
  color: #e0e7ff;
  text-align: center;
}
.job-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
  justify-content: center;
}
.chip {
  background: #fff;
  color: #1566d6;
  border-radius: 16px;
  padding: 4px 14px;
  font-size: 0.95em;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.job-salary-location {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 10px;
  font-size: 1.1em;
}
.salary {
  font-weight: bold;
}
.location {
  color: #e0e7ff;
}
.job-tabs {
  display: flex;
  justify-content: space-around;
  margin: 18px 0 0 0;
  border-bottom: 1.5px solid #e0e7ff;
}
.tab-btn {
  background: none;
  border: none;
  font-size: 1.1em;
  font-weight: 500;
  color: #666;
  padding: 12px 0 10px 0;
  cursor: pointer;
  border-bottom: 2.5px solid transparent;
  transition: color 0.2s, border-bottom 0.2s;
}
.tab-btn.active {
  color: #1566d6;
  border-bottom: 2.5px solid #1566d6;
}
.tab-content {
  padding: 18px 18px 0 18px;
  min-height: 120px;
}
.aplicar-btn {
  margin: 24px 0 0 0;
  background: #1566d6;
  color: #fff;
  font-weight: bold;
  font-size: 1.1em;
  border-radius: 8px;
}
.mensaje-adicional {
  margin: 18px 0 0 0;
  width: 100%;
  --background: #f7f8fa;
  --color: #18186B;
  border-radius: 8px;
  font-size: 1em;
}
</style> 