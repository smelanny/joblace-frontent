<template>
    <ion-page>
      <ion-content class="ion-padding setup-content">
        <div class="setup-container">
          <h1 class="setup-title">Completa tu perfil de candidato</h1>
          <form @submit.prevent="guardarPerfil" class="setup-form">
            <ion-item class="setup-item">
              <ion-label position="stacked">Título profesional</ion-label>
              <ion-input v-model="form.titulo_profesional" required />
            </ion-item>
  
            <ion-item class="setup-item">
              <ion-label position="stacked">Resumen de perfil</ion-label>
              <ion-textarea v-model="form.resumen_perfil" required />
            </ion-item>
  
            <ion-item class="setup-item">
              <ion-label position="stacked">Años de experiencia</ion-label>
              <ion-input v-model="form.anos_experiencia" type="number" required />
            </ion-item>
  
            <ion-item class="setup-item">
              <ion-label position="stacked">Disponibilidad</ion-label>
              <ion-select v-model="form.disponibilidad" required>
                <ion-select-option value="tiempo_completo">Tiempo completo</ion-select-option>
                <ion-select-option value="medio_tiempo">Medio tiempo</ion-select-option>
                <ion-select-option value="freelance">Freelance</ion-select-option>
                <ion-select-option value="practica">Práctica</ion-select-option>
              </ion-select>
            </ion-item>
  
            <ion-button expand="block" type="submit" class="setup-btn" :disabled="loading">
              {{ loading ? 'Guardando...' : 'Guardar perfil' }}
            </ion-button>
            <ion-text color="danger" v-if="error">{{ error }}</ion-text>
            <ion-text color="success" v-if="success">{{ success }}</ion-text>
          </form>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import {
    IonPage, IonContent, IonItem, IonLabel, IonInput,
    IonSelect, IonSelectOption, IonTextarea, IonButton, IonText
  } from '@ionic/vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const loading = ref(false);
  const error = ref('');
  const success = ref('');
  
  const form = ref({
    titulo_profesional: '',
    resumen_perfil: '',
    anos_experiencia: '',
    disponibilidad: ''
  });
  
  async function guardarPerfil() {
    error.value = '';
    success.value = '';
    loading.value = true;
  
    try {
      const user_id = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');
  
      if (!user_id || !token) {
        error.value = 'No se encontró la sesión del usuario.';
        loading.value = false;
        return;
      }
  
      const res = await fetch('http://localhost:8081/api/candidatos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form.value,
          user_id: user_id,
          anos_experiencia: Number(form.value.anos_experiencia)
        })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        success.value = '¡Perfil guardado exitosamente!';
        setTimeout(() => {
          router.push('/home');
        }, 1200);
      } else {
        error.value = data.message || (data.errors ? Object.values(data.errors).join(', ') : 'Error al guardar el perfil');
      }
    } catch (e) {
      error.value = 'Error de red: ' + e.message;
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
    margin-bottom: 18px;
    text-align: center;
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