<template>
  <ion-page>
    <ion-content class="ion-padding register-content">
      <div class="register-container">
        <h1 class="register-title">Crea una cuenta!</h1>
        <p class="register-subtitle">"Completa tus datos para comenzar a explorar ofertas de empleo personalizadas."</p>
        <form @submit.prevent="register" class="register-form">
          <ion-item class="register-item">
            <ion-label position="stacked">Nombre completo</ion-label>
            <ion-input v-model="nombre" required placeholder="Nombre Apellido" />
          </ion-item>
          <ion-item class="register-item">
            <ion-label position="stacked">Email</ion-label>
            <ion-input v-model="email" type="email" required placeholder="nombre.apellido@email.com" />
          </ion-item>
          <ion-item class="register-item">
            <ion-label position="stacked">Contraseña</ion-label>
            <ion-input v-model="contrasena" :type="showPassword ? 'text' : 'password'" required />
            <ion-icon :icon="showPassword ? 'eye-off-outline' : 'eye-outline'" slot="end" @click="showPassword = !showPassword" class="eye-icon" />
          </ion-item>
          <ion-item class="register-item">
            <ion-label>Tipo de usuario</ion-label>
            <ion-select v-model="tipo_usuario" placeholder="Selecciona uno" required>
              <ion-select-option value="candidato">Candidato</ion-select-option>
              <ion-select-option value="representante_empresa">Empresa</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-button expand="block" type="submit" :disabled="loading" class="register-btn">
            REGISTRARSE
          </ion-button>
        </form>
        <ion-text color="danger" v-if="error">{{ error }}</ion-text>
        <ion-text color="success" v-if="success">{{ success }}</ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import {
  IonPage, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonText, IonIcon
} from '@ionic/vue';
import { useRouter } from 'vue-router';

const nombre = ref('');
const email = ref('');
const contrasena = ref('');
const tipo_usuario = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');
const showPassword = ref(false);
const router = useRouter();

async function register() {
  error.value = '';
  success.value = '';
  loading.value = true;
  try {
    const response = await fetch('http://localhost:8081/api/register', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json' 
      },
      body: JSON.stringify({
        nombre: nombre.value,
        email: email.value,
        contrasena: contrasena.value,
        tipo_usuario: tipo_usuario.value
      })
    });
    const data = await response.json();
    if (response.ok) {
      success.value = '¡Registro exitoso!';
      localStorage.setItem('token', data.token);
      setTimeout(() => {
        router.push('/'); // Redirige a login después de registro exitoso
      }, 1000);
    } else {
      error.value = data.message || 'Error en el registro';
    }
  } catch (err) {
    error.value = 'Error de red: ' + err.message;
  }
  loading.value = false;
}
</script>

<style scoped>
.register-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background: #fff;
}
.register-container {
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
  .register-container {
    max-width: 95vw;
    padding: 16px 4vw;
  }
}
.register-title {
  color: #18186B;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
}
.register-subtitle {
  color: #888;
  font-size: 0.95rem;
  margin-bottom: 24px;
  text-align: center;
}
.register-form {
  width: 100%;
}
.register-item {
  border-radius: 8px;
  margin-bottom: 12px;
  background: #f7f8fa;
}
.eye-icon {
  font-size: 1.2em;
  cursor: pointer;
}
.register-btn {
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