<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button fill="clear" @click="$router.back()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Buscar</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="buscar-content">
      <div class="buscar-box">
        <ion-searchbar
          v-model="busqueda"
          placeholder="Buscar trabajo o puesto..."
          class="buscar-searchbar"
          autofocus
        ></ion-searchbar>
      </div>
      <div class="categorias-section">
        <div class="categorias-title">Categorías</div>
        <div class="categorias-chips">
          <button
            v-for="cat in categorias"
            :key="cat.id"
            :class="['chip-categoria', { 'chip-categoria-activa': categoriasSeleccionadas.includes(cat.id) }]"
            @click="toggleCategoria(cat.id)"
          >
            {{ cat.nombre }}
          </button>
        </div>
      </div>
      <div class="resultados-section">
        <div v-if="loading" class="no-resultados">
          <ion-text color="medium">Buscando ofertas...</ion-text>
        </div>
        <div v-else-if="resultados.length === 0" class="no-resultados">
          <ion-text color="medium">No hay resultados para tu búsqueda.</ion-text>
        </div>
        <div v-else>
          <div
            v-for="oferta in resultados"
            :key="oferta.id"
            class="oferta-card-busqueda"
            @click="verDetalle(oferta.id)"
            style="cursor:pointer"
          >
            <div class="oferta-header-busqueda">
              <img class="oferta-logo-busqueda" :src="oferta.empresa?.logo_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(oferta.empresa?.nombre || 'Empresa') + '&background=1566c3&color=fff'" />
              <div>
                <div class="oferta-titulo-busqueda">{{ oferta.titulo_puesto }}</div>
                <div class="oferta-empresa-busqueda">{{ oferta.empresa?.nombre }}</div>
              </div>
            </div>
            <div class="oferta-info-busqueda">
              <span class="oferta-salario-busqueda">${{ oferta.salario_estimado }}</span>
              <span class="oferta-ubicacion-busqueda">{{ oferta.ubicacion }}</span>
            </div>
            <div class="oferta-categorias-busqueda">
              <span v-for="cat in oferta.categorias" :key="cat.id" class="chip-categoria">{{ cat.nombre }}</span>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonButtons, IonSearchbar, IonText } from '@ionic/vue';

const router = useRouter();
const busqueda = ref('');
const categorias = ref([]);
const categoriasSeleccionadas = ref([]);
const resultados = ref([]);
const loading = ref(false);

function toggleCategoria(id) {
  const idx = categoriasSeleccionadas.value.indexOf(id);
  if (idx === -1) {
    categoriasSeleccionadas.value.push(id);
  } else {
    categoriasSeleccionadas.value.splice(idx, 1);
  }
  buscarOfertas();
}

async function cargarCategorias() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8081/api/categorias', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    categorias.value = Array.isArray(data)
      ? data.map(cat => ({ ...cat, id: Number(cat.id) }))
      : [];
  } catch (error) {
    categorias.value = [];
  }
}

async function buscarOfertas() {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (busqueda.value) params.append('busqueda', busqueda.value);
    categoriasSeleccionadas.value.forEach(catId => {
      params.append('categoria_id', catId);
    });
    const response = await fetch(`http://localhost:8081/api/ofertas/buscar?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    resultados.value = Array.isArray(data) ? data : [];
  } catch (error) {
    resultados.value = [];
  }
  loading.value = false;
}

function verDetalle(id) {
  router.push(`/job/${id}`);
}

watch(busqueda, buscarOfertas);

onMounted(async () => {
  await cargarCategorias();
  await buscarOfertas();
});
</script>

<style scoped>
.buscar-content {
  background: #f9f9fb;
  min-height: 100vh;
}
.buscar-box {
  margin: 32px 0 0 0;
  padding: 0 18px;
}
.buscar-searchbar {
  --background: #f3f3f6;
  --border-radius: 18px;
  --box-shadow: none;
  --color: #181a2a;
  --placeholder-color: #b0b0b0;
  font-size: 1.1em;
}
.categorias-section {
  margin: 32px 0 0 0;
  padding: 0 18px;
}
.categorias-title {
  color: #181a2a;
  font-size: 1.1em;
  font-weight: bold;
  margin-bottom: 10px;
}
.categorias-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.chip-categoria {
  background: #fff;
  color: #1566c3;
  border: none;
  border-radius: 16px;
  padding: 7px 18px;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.chip-categoria-activa {
  background: #1566c3;
  color: #fff;
}
.resultados-section {
  margin: 38px 0 0 0;
  padding: 0 18px;
}
.no-resultados {
  color: #b0b0b0;
  text-align: center;
  margin: 32px 0;
}
.oferta-card-busqueda {
  background: linear-gradient(135deg, #1566c3 60%, #1e90ff 100%);
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(21,102,195,0.08);
  color: #fff;
  padding: 24px 20px;
  margin-bottom: 18px;
  border: none;
}
.oferta-header-busqueda {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
}
.oferta-logo-busqueda {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: #fff;
  object-fit: contain;
  padding: 6px;
}
.oferta-titulo-busqueda {
  font-size: 1.1em;
  font-weight: bold;
  color: #fff;
}
.oferta-empresa-busqueda {
  color: #e0e7ff;
  font-size: 0.97em;
}
.oferta-info-busqueda {
  display: flex;
  gap: 18px;
  margin-bottom: 8px;
  font-size: 1em;
}
.oferta-salario-busqueda {
  font-weight: bold;
}
.oferta-ubicacion-busqueda {
  color: #e0e7ff;
}
.oferta-categorias-busqueda {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style> 