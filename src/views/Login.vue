<template>
  <ion-page>
    <ion-content class="ion-padding login-content">
      <div class="login-container">
        <h1 class="login-title">Bienvenido!</h1>
        <p class="login-subtitle">Ingresa tus credenciales para acceder a las mejores oportunidades laborales.</p>
        <form @submit.prevent="login" class="login-form">
          <ion-item class="login-item">
            <ion-label position="stacked">Email</ion-label>
            <ion-input v-model="email" type="email" required placeholder="nombre.apellido@email.com" />
          </ion-item>
          <ion-item class="login-item">
            <ion-label position="stacked">Contraseña</ion-label>
            <ion-input v-model="contrasena" :type="showPassword ? 'text' : 'password'" required />
            <ion-icon :icon="showPassword ? 'eye-off-outline' : 'eye-outline'" slot="end" @click="showPassword = !showPassword" class="eye-icon" />
          </ion-item>
          <div class="login-options">
            <ion-checkbox v-model="rememberMe" class="remember-checkbox"></ion-checkbox>
            <span class="remember-text">Remember me</span>
            <a class="forgot-link" href="#">¿Olvidaste la contraseña?</a>
          </div>
          <ion-button expand="block" type="submit" :disabled="loading" class="login-btn">
            LOGIN
          </ion-button>
        </form>
        <ion-text color="danger" v-if="error">{{ error }}</ion-text>
        <ion-text color="success" v-if="success">{{ success }}</ion-text>
        <div class="register-link">
          <span>Aún no tienes una cuenta?</span>
          <a @click.prevent="goToRegister"> Registrarme</a>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import {
  IonPage, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonText, IonCheckbox, IonIcon
} from '@ionic/vue';
import { useRouter } from 'vue-router';

const email = ref('');
const contrasena = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);
const router = useRouter();

function goToRegister() {
  router.push('/register');
}

async function login() {
  error.value = '';
  success.value = '';
  loading.value = true;
  try {
    const response = await fetch('http://localhost:8081/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        contrasena: contrasena.value
      })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      if (data.usuario) {
        localStorage.setItem('user_id', data.usuario.id);
        localStorage.setItem('tipo_usuario', data.usuario.tipo_usuario);
      }
      success.value = '¡Login exitoso!';
      setTimeout(async () => {
        if (data.usuario && data.usuario.tipo_usuario === 'representante_empresa') {
          const resp = await fetch(`http://localhost:8081/api/usuarios/${data.usuario.id}/representaciones`, {
            headers: { 'Authorization': `Bearer ${data.token}` }
          });
          const empresas = await resp.json();
          if (Array.isArray(empresas) && empresas.length === 0) {
            router.push('/setup-representante');
          } else {
            router.push('/company');
          }
        } else {
          router.push('/home');
        }
      }, 1000);
    } else {
      error.value = data.message || 'Credenciales incorrectas';
    }
  } catch (err) {
    error.value = 'Error de red: ' + err.message;
  }
  loading.value = false;
}
</script>

<style scoped>
.login-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background: #fff;
}
.login-container {
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
  .login-container {
    max-width: 95vw;
    padding: 16px 4vw;
  }
}
.login-title {
  color: #18186B;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
}
.login-subtitle {
  color: #888;
  font-size: 0.95rem;
  margin-bottom: 24px;
  text-align: center;
}
.login-form {
  width: 100%;
}
.login-item {
  border-radius: 8px;
  margin-bottom: 12px;
  background: #f7f8fa;
}
.eye-icon {
  font-size: 1.2em;
  cursor: pointer;
}
.login-options {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  font-size: 0.95em;
}
.remember-checkbox {
  margin-right: 6px;
}
.remember-text {
  margin-right: auto;
  color: #888;
}
.forgot-link {
  color: #18186B;
  text-decoration: underline;
  margin-left: auto;
  font-size: 0.95em;
  cursor: pointer;
}
.login-btn {
  background: #1566d6;
  color: #fff;
  font-weight: bold;
  letter-spacing: 1px;
  font-size: 1.1em;
  border-radius: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
}
.register-link {
  margin-top: 18px;
  text-align: center;
  font-size: 0.97em;
}
.register-link a {
  color: #1566d6;
  text-decoration: underline;
  cursor: pointer;
  margin-left: 4px;
}
</style>