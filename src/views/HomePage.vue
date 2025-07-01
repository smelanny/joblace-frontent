<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <!-- Componente de notificaciones -->
          <NotificationBell :userId="userId" />
          <ion-button @click="cerrarSesion">
            <ion-icon :icon="logOutOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="bienvenida">
        <h2 class="bienvenida-titulo">Bienvenido, {{ nombreUsuario }}</h2>
        <p class="bienvenida-subtitulo">Encuentra las mejores oportunidades laborales</p>
      </div>
      <div class="filtros-container">
        <div class="busqueda-row">
          <ion-searchbar
            v-model="busqueda"
            placeholder="Buscar trabajo"
            readonly
            @click="irABuscar"
            class="busqueda-home"
          ></ion-searchbar>
          <button class="btn-buscar" @click="irABuscar">
            <ion-icon :icon="funnelOutline" style="margin-left:4px;"></ion-icon>
          </button>
        </div>
      </div>

      <h2 class="titulo-ofertas">Ofertas de empleo</h2>
      <!-- Lista de ofertas -->
      <div class="ofertas-container">
        <div v-for="oferta in ofertasFiltradas" :key="oferta.id" class="oferta-card-proto" @click="verDetalle(oferta.id)">
          <div class="oferta-header-proto">
            <div>
              <div class="oferta-titulo-proto">{{ oferta.titulo_puesto }}</div>
              <div class="oferta-empresa-proto">{{ oferta.empresa?.nombre }}</div>
            </div>
          </div>
          <div class="oferta-info-proto">
            <span class="oferta-ubicacion-proto"><ion-icon :icon="locationOutline"></ion-icon> {{ oferta.ubicacion }}</span>
            <span class="oferta-jornada-proto"><ion-icon :icon="timeOutline"></ion-icon> {{ formatearJornada(oferta.tipo_jornada) }}</span>
            <span class="oferta-modalidad-proto"><ion-icon :icon="desktopOutline"></ion-icon> {{ formatearModalidad(oferta.modalidad) }}</span>
            <span class="oferta-salario-proto"><ion-icon :icon="cashOutline"></ion-icon> ${{ oferta.salario_estimado }}</span>
          </div>
          <div class="oferta-categorias-proto">
            <span v-for="cat in oferta.categorias" :key="cat.id" class="chip-categoria-proto">{{ cat.nombre }}</span>
          </div>
        </div>

        <!-- Mensaje cuando no hay ofertas -->
        <div v-if="ofertasFiltradas.length === 0" class="no-ofertas">
          <ion-text color="medium">No se encontraron ofertas que coincidan con los filtros</ion-text>
        </div>
      </div>
      <footer class="footer-home">
        © 2025 JobLace. Todos los derechos reservados.
      </footer>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonContent,
  IonIcon, IonButtons, IonButton,
  IonSearchbar, IonText
} from '@ionic/vue';
import NotificationBell from '../components/NotificationBell.vue';
import {
  locationOutline, timeOutline, desktopOutline,
  cashOutline, logOutOutline, funnelOutline
} from 'ionicons/icons';

const router = useRouter();
const ofertas = ref([]);
const categorias = ref([]);
const nombreUsuario = ref('');
const busqueda = ref('');
const mostrarCategorias = ref(false);
const categoriasSeleccionadas = ref([]);
const userId = ref(Number(localStorage.getItem('user_id')));
const filtros = ref({
  modalidad: '',
  tipo_jornada: '',
  categoria: ''
});

// Computed para filtrar ofertas
const ofertasFiltradas = computed(() => {
  return ofertas.value.filter(oferta => {
    const coincideBusqueda = oferta.titulo_puesto.toLowerCase().includes(busqueda.value.toLowerCase()) ||
                            oferta.empresa?.nombre.toLowerCase().includes(busqueda.value.toLowerCase());
    
    const coincideModalidad = !filtros.value.modalidad || oferta.modalidad === filtros.value.modalidad;
    const coincideJornada = !filtros.value.tipo_jornada || oferta.tipo_jornada === filtros.value.tipo_jornada;
    
    // Mejorar la lógica de filtrado por categoría
    const coincideCategoria = !filtros.value.categoria || 
                             oferta.categorias.some(cat => {
                               const categoriaId = Number(filtros.value.categoria);
                               return Number(cat.id) === categoriaId;
                             });

    return coincideBusqueda && coincideModalidad && coincideJornada && coincideCategoria;
  });
});

// Función para cargar ofertas con filtros
async function cargarOfertas() {
  try {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    
    // Agregar búsqueda si existe
    if (busqueda.value) {
      params.append('busqueda', busqueda.value);
    }
    
    // Agregar filtros si existen
    if (filtros.value.modalidad) {
      params.append('modalidad', filtros.value.modalidad);
    }
    if (filtros.value.tipo_jornada) {
      params.append('tipo_jornada', filtros.value.tipo_jornada);
    }
    
    // Agregar categorías seleccionadas
    if (categoriasSeleccionadas.value.length > 0) {
      categoriasSeleccionadas.value.forEach(catId => {
        params.append('categoria_id', catId);
      });
    }

    const response = await fetch(`http://localhost:8081/api/ofertas/buscar?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    ofertas.value = data;
    console.log('Ofertas cargadas:', ofertas.value); // Para depuración
  } catch (error) {
    console.error('Error al cargar ofertas:', error);
  }
}

// Cargar categorías
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
    console.log('Categorías cargadas:', categorias.value); // Para depuración
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
}

// Cargar datos del usuario
async function cargarDatosUsuario() {
  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    const response = await fetch(`http://localhost:8081/api/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    nombreUsuario.value = data.nombre;
  } catch (error) {
    console.error('Error al cargar datos del usuario:', error);
  }
}

// Formatear tipos de jornada
function formatearJornada(jornada) {
  const formatos = {
    tiempo_completo: 'Tiempo completo',
    medio_tiempo: 'Medio tiempo',
    freelance: 'Freelance',
    practica: 'Práctica'
  };
  return formatos[jornada] || jornada;
}

// Formatear modalidad
function formatearModalidad(modalidad) {
  const formatos = {
    presencial: 'Presencial',
    remoto: 'Remoto',
    hibrido: 'Híbrido'
  };
  return formatos[modalidad] || modalidad;
}

// Ver detalle de oferta
function verDetalle(id) {
  router.push(`/job/${id}`);
}

// Cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('tipo_usuario');
  router.push('/');
}

// Función para manejar cambios en los filtros
function actualizarFiltros() {
  cargarOfertas();
}

// Modificar la función toggleCategoria
function toggleCategoria(id) {
  const idx = categoriasSeleccionadas.value.indexOf(id);
  if (idx === -1) {
    categoriasSeleccionadas.value.push(id);
  } else {
    categoriasSeleccionadas.value.splice(idx, 1);
  }
  cargarOfertas(); // Recargar ofertas cuando cambia la categoría
}

// Agregar watchers para los filtros
watch(busqueda, () => {
  cargarOfertas();
});

watch(filtros, () => {
  cargarOfertas();
}, { deep: true });

// Cargar datos al montar el componente
onMounted(async () => {
  await Promise.all([
    cargarOfertas(),
    cargarCategorias(),
    cargarDatosUsuario()
  ]);
});

const irABuscar = () => {
  router.push('/buscar');
};
</script>

<style scoped>
.filtros-container {
  margin-bottom: 20px;
}

.filtros-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.filtros-row ion-select {
  flex: 1;
  --padding-start: 10px;
  --padding-end: 10px;
  background: #f7f8fa;
  border-radius: 8px;
}

.ofertas-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.oferta-card-proto {
  background: linear-gradient(135deg, #1566c3 60%, #1e90ff 100%);
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(21,102,195,0.08);
  color: #fff;
  padding: 24px 20px;
  margin-bottom: 18px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}
.oferta-card-proto:hover {
  transform: translateY(-2px);
}
.oferta-header-proto {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
}
.oferta-titulo-proto {
  font-size: 1.1em;
  font-weight: bold;
  color: #fff;
}
.oferta-empresa-proto {
  color: #e0e7ff;
  font-size: 0.97em;
}
.oferta-info-proto {
  display: flex;
  gap: 18px;
  margin-bottom: 8px;
  font-size: 1em;
  flex-wrap: wrap;
}
.oferta-info-proto ion-icon {
  font-size: 1.1em;
  margin-right: 3px;
  color: #fff;
}
.oferta-salario-proto {
  font-weight: bold;
}
.oferta-ubicacion-proto, .oferta-jornada-proto, .oferta-modalidad-proto {
  color: #e0e7ff;
}
.oferta-categorias-proto {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip-categoria-proto {
  background: #fff;
  color: #1566c3;
  border-radius: 16px;
  padding: 6px 18px;
  font-weight: 500;
  margin-right: 8px;
  margin-bottom: 8px;
  display: inline-block;
  font-size: 0.95em;
}
.footer-home {
  text-align: center;
  color: #b0b0b0;
  font-size: 15px;
  margin: 38px 0 12px 0;
}

.titulo-ofertas {
  font-size: 1.4em;
  font-weight: bold;
  color: #03030f;
  margin: 18px 0 10px 0;
}

.no-ofertas {
  text-align: center;
  padding: 40px 0;
}

.bienvenida {
  margin-bottom: 24px;
}

.bienvenida-titulo {
  font-size: 1.8em;
  font-weight: bold;
  color: #03030f;
  margin: 0;
}

.bienvenida-subtitulo {
  color: #666;
  margin: 4px 0 0 0;
  font-size: 1em;
}

.busqueda-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.busqueda-home {
  flex: 1;
  --background: #f3f3f6;
  --border-radius: 18px;
  --box-shadow: none;
  --color: #181a2a;
  --placeholder-color: #b0b0b0;
  font-size: 1.1em;
}

.btn-buscar {
  background: #f3f3f6;
  border: none;
  border-radius: 12px;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1.3em;
  color: #1566c3;
  transition: background 0.2s;
}

.btn-buscar:hover {
  background: #e0e7ff;
}
</style> 