<template>
  <ion-page>
    <ion-content class="ion-padding publicar-content">
      <div class="publicar-container">
        <h1 class="publicar-title">Publicar puesto</h1>
        <form @submit.prevent="publicarEmpleo" class="publicar-form">
          <ion-item class="publicar-item">
            <ion-label position="stacked">Título del puesto</ion-label>
            <ion-input v-model="form.titulo_puesto" required />
          </ion-item>
          <ion-item class="publicar-item">
            <ion-label position="stacked">Modalidad</ion-label>
            <ion-select v-model="form.modalidad" required>
              <ion-select-option value="presencial">Presencial</ion-select-option>
              <ion-select-option value="remoto">Remoto</ion-select-option>
              <ion-select-option value="hibrido">Híbrido</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item class="publicar-item">
            <ion-label position="stacked">Ubicación</ion-label>
            <ion-input v-model="form.ubicacion" required />
          </ion-item>
          <ion-item class="publicar-item">
            <ion-label position="stacked">Tipo de jornada</ion-label>
            <ion-select v-model="form.tipo_jornada" required>
              <ion-select-option value="tiempo_completo">Tiempo completo</ion-select-option>
              <ion-select-option value="medio_tiempo">Medio tiempo</ion-select-option>
              <ion-select-option value="freelance">Freelance</ion-select-option>
              <ion-select-option value="practica">Práctica</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item class="publicar-item">
            <ion-label position="stacked">Salario estimado</ion-label>
            <ion-input v-model="form.salario_estimado" type="number" required />
          </ion-item>
          <ion-item class="publicar-item">
            <ion-label position="stacked">Descripción</ion-label>
            <ion-textarea v-model="form.descripcion_puesto" required />
          </ion-item>
          <ion-item class="publicar-item">
            <ion-label position="stacked">Categorías</ion-label>
            <div class="categorias-checkboxes">
              <label v-for="categoria in categorias" :key="categoria.id" class="categoria-checkbox-label">
                <input
                  type="checkbox"
                  :value="categoria.id"
                  v-model="form.categorias"
                  class="categoria-checkbox"
                />
                {{ categoria.nombre }}
              </label>
            </div>
          </ion-item>
          <ion-button expand="block" type="submit" class="publicar-btn" :disabled="loading">
            {{ loading ? 'Publicando...' : 'Publicar' }}
          </ion-button>
          <ion-text color="danger" v-if="error">{{ error }}</ion-text>
          <ion-text color="success" v-if="success">{{ success }}</ion-text>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  IonPage, IonContent, IonItem, IonLabel, IonInput,
  IonSelect, IonSelectOption, IonTextarea, IonButton, IonText
} from '@ionic/vue';
import { useRouter } from 'vue-router';

const empresa = ref(null);
const loading = ref(false);
const error = ref('');
const success = ref('');
const categorias = ref([]);
const router = useRouter();

const form = ref({
  titulo_puesto: '',
  modalidad: '',
  ubicacion: '',
  tipo_jornada: '',
  salario_estimado: '',
  descripcion_puesto: '',
  categorias: []
});

async function publicarEmpleo() {
  error.value = '';
  success.value = '';
  loading.value = true;
  try {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    if (!user_id || !empresa.value?.id) {
      error.value = 'No se encontró la empresa o usuario.';
      loading.value = false;
      return;
    }
    const res = await fetch('http://localhost:8081/api/ofertas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...form.value,
        empresa_id: empresa.value.id,
        user_id: user_id,
        salario_estimado: Number(form.value.salario_estimado),
        categorias: form.value.categorias.map(Number)
      })
    });
    const data = await res.json();
    if (res.ok) {
      success.value = '¡Oferta publicada exitosamente!';
      setTimeout(() => {
        router.push('/company');
      }, 1200);
    } else {
      error.value = data.message || (data.errors ? Object.values(data.errors).join(', ') : 'Error al publicar');
    }
  } catch (e) {
    error.value = 'Error de red: ' + e.message;
  }
  loading.value = false;
}

onMounted(async () => {
  const user_id = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');
  if (!user_id || !token) return;

  // Cargar categorías con logs de depuración
  try {
    const catRes = await fetch('http://localhost:8081/api/categorias', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Status de /api/categorias:', catRes.status);
    if (catRes.ok) {
      const json = await catRes.json();
      console.log('Respuesta de categorías:', json);
      categorias.value = Array.isArray(json)
        ? json.map(cat => ({ ...cat, id: Number(cat.id) }))
        : [];
      console.log('Array final de categorías:', categorias.value);
    } else {
      const errorText = await catRes.text();
      console.error('Error al cargar categorías:', errorText);
    }
  } catch (e) {
    console.error('Error al cargar categorías:', e);
  }

  // Cargar empresa
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
  } catch (e) {
    //Error al cargar la empresa
  }
});
</script>

<style scoped>
.publicar-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background: #fff;
}
.publicar-container {
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
  .publicar-container {
    max-width: 95vw;
    padding: 16px 4vw;
  }
}
.publicar-title {
  color: #18186B;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 18px;
  text-align: center;
}
.publicar-form {
  width: 100%;
}
.publicar-item {
  border-radius: 8px;
  margin-bottom: 12px;
  background: #f7f8fa;
}
.publicar-btn {
  background: #1566c3;
  color: #fff;
  font-weight: bold;
  letter-spacing: 1px;
  font-size: 1.1em;
  border-radius: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
}
.categorias-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}
.categoria-checkbox-label {
  background: #f7f8fa;
  border-radius: 6px;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.2s;
}
.categoria-checkbox-label:hover {
  background: #e0e7ff;
}
.categoria-checkbox {
  margin-right: 8px;
  accent-color: #1566d6;
}
</style>