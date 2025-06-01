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
    component: () => import('../views/JobDetailPage.vue')
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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
