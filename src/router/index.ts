import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/folder/:id',
    component: () => import ('../views/FolderPage.vue')
  },
  {
    path: '/job/:id',
    component: () => import('../views/JobDetail.vue')
  },
  {
    path: '/company',
    component: () => import('../views/CompanyDashboard.vue')
  },
  {
    path: '/register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/setup-representante',
    component: () => import('../views/RepresentanteEmpresaSetup.vue')
  },
  {
    path: '/publicar-puesto',
    component: () => import('../views/PublicarPuesto.vue')
  },
  {
    path: '/candidato-setup',
    component: () => import('../views/CandidatoSetup.vue')
  },
  {
    path: '/empresa/postulaciones',
    component: () => import('../views/PostulacionesEmpresa.vue')
  },
  {
    path: '/buscar',
    component: () => import('../views/BuscarOfertas.vue')
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
