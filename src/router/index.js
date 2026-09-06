import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/composables/useAuth'

// ... (Import หน้าต่างๆ ไว้ที่นี่)

const routes = [
  { path: '/', component: HomeView },
  { path: '/search', component: SearchView },
  { path: '/item/:id', component: ItemDetailView },
  { path: '/cart', component: CartView },
  { path: '/auth', component: AuthView },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/contract', component: ContractView, meta: { requiresAuth: true } },
  
  // 🟢 Role Guards
  { path: '/lender/dashboard', component: LenderDashboardView, meta: { requiresAuth: true, role: 'lender' } },
  { path: '/admin/dashboard', component: AdminDashboardView, meta: { requiresAuth: true, role: 'admin' } },
]

const router = createRouter({ history: createWebHistory(), routes })

// ตรวจสอบสิทธิ์ก่อนเข้าหน้าต่างๆ
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (to.meta.requiresAuth && !session) {
    return next('/auth')
  }

  if (to.meta.role) {
    const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
    if (data.role !== to.meta.role && data.role !== 'admin') {
      alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้')
      return next('/')
    }
  }
  next()
})

export default router