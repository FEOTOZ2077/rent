import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/composables/useAuth'

// Import หน้าทั้งหมด
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import ItemDetailView from '../views/ItemDetailView.vue'
import CartView from '../views/CartView.vue'
import AuthView from '../views/AuthView.vue'
import HelpView from '../views/HelpView.vue'
import AboutView from '../views/AboutView.vue'

import ProfileView from '../views/user/ProfileView.vue'
import ContractView from '../views/user/ContractView.vue'

import LenderRegisterView from '../views/lender/LenderRegisterView.vue'
import LenderDashboardView from '../views/lender/LenderDashboardView.vue'
import AdminDashboardView from '../views/admin/AdminDashboardView.vue'

const routes = [
  // หน้าสาธารณะ (ใครก็เข้าได้)
  { path: '/', component: HomeView },
  { path: '/search', component: SearchView },
  { path: '/item/:id', component: ItemDetailView },
  { path: '/cart', component: CartView },
  { path: '/auth', component: AuthView },
  { path: '/help', component: HelpView },
  { path: '/about', component: AboutView },
  
  // หน้าที่ต้องล็อกอินก่อน (User ทั่วไป)
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/contract', component: ContractView, meta: { requiresAuth: true } },
  
  // หน้าของร้านค้า (Lender)
  { path: '/lender/register', component: LenderRegisterView, meta: { requiresAuth: true } },
  { path: '/lender/dashboard', component: LenderDashboardView, meta: { requiresAuth: true, role: 'lender' } },
  
  // หน้าของผู้ดูแลระบบ (Admin)
  { path: '/admin/dashboard', component: AdminDashboardView, meta: { requiresAuth: true, role: 'admin' } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 🛡️ Navigation Guard (ระบบป้องกันการเข้าถึง)
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  // 🟢 1. ป้องกันคนล็อกอินแล้ว แอบเข้าหน้าล็อกอินอีก (/auth) -> ให้เด้งไปหน้าแรก
  if (session && to.path === '/auth') {
    return next('/')
  }

  // 🔴 2. ป้องกันคนยังไม่ล็อกอิน แอบเข้าหน้าที่ต้องใช้รหัสผ่าน -> ให้เด้งไปหน้าล็อกอิน
  if (to.meta.requiresAuth && !session) {
    alert('กรุณาเข้าสู่ระบบก่อนใช้งานฟีเจอร์นี้')
    return next('/auth')
  }

  // 🛡️ 3. ป้องกันการเข้าหน้า Dashboard ถ้ายศ (Role) ไม่ถึง
  if (to.meta.role && session) {
    const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
    
    // ถ้าไม่ใช่ role ที่กำหนด และไม่ใช่ admin ให้เด้งออก
    if (data && data.role !== to.meta.role && data.role !== 'admin') {
      alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้')
      return next('/')
    }
  }

  next()
})

export default router