import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/composables/useAuth'

import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import ItemDetailView from '../views/ItemDetailView.vue'
import CartView from '../views/CartView.vue'
import AuthView from '../views/AuthView.vue'
import ProfileView from '../views/user/ProfileView.vue'
import ContractView from '../views/user/ContractView.vue'
import LenderRegisterView from '../views/lender/LenderRegisterView.vue'
import LenderDashboardView from '../views/lender/LenderDashboardView.vue'
import AdminDashboardView from '../views/admin/AdminDashboardView.vue'
import HelpView from '../views/HelpView.vue'
import AboutView from '../views/AboutView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/search', component: SearchView },
  { path: '/item/:id', component: ItemDetailView },
  { path: '/cart', component: CartView },
  { path: '/auth', component: AuthView },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/contract', component: ContractView, meta: { requiresAuth: true } },
  { path: '/help', component: HelpView },
  { path: '/about', component: AboutView }
  { path: '/lender/register', component: LenderRegisterView, meta: { requiresAuth: true } },
  { path: '/lender/dashboard', component: LenderDashboardView, meta: { requiresAuth: true, role: 'lender' } },
  
  { path: '/admin/dashboard', component: AdminDashboardView, meta: { requiresAuth: true, role: 'admin' } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guard (ระบบป้องกันการเข้าถึง)
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (to.meta.requiresAuth && !session) {
    alert('กรุณาเข้าสู่ระบบก่อนใช้งานฟีเจอร์นี้')
    return next('/auth')
  }

  // ป้องกันการเข้าหน้า Dashboard ถ้าไม่ใช่ Lender หรือ Admin
  if (to.meta.role && session) {
    const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
    if (data && data.role !== to.meta.role && data.role !== 'admin') {
      alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้')
      return next('/')
    }
  }

  next()
})

export default router