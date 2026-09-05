import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 🌐 1. โซนสาธารณะ (Public) - ทุกคนเข้าถึงได้
    { path: '/', name: 'home', component: HomeView },
    { path: '/auth', name: 'auth', component: () => import('../views/AuthView.vue') },
    { path: '/search', name: 'search', component: () => import('../views/SearchView.vue') },
    { path: '/item/:id', name: 'item-detail', component: () => import('../views/ItemDetailView.vue') },
    { path: '/help', name: 'help', component: () => import('../views/HelpView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },

    // 👤 2. โซนผู้ใช้ทั่วไป (User / Renter)
    { path: '/cart', name: 'cart', component: () => import('../views/user/CartView.vue') },
    { path: '/profile', name: 'profile', component: () => import('../views/user/ProfileView.vue') },
    { path: '/contract', name: 'contract', component: () => import('../views/user/ContractView.vue') },

    // 🏪 3. โซนผู้ให้เช่า (Lender)
    { path: '/lender/register', name: 'lender-register', component: () => import('../views/lender/LenderRegisterView.vue') },
    { path: '/lender/dashboard', name: 'lender-dashboard', component: () => import('../views/lender/LenderDashboardView.vue') },

    // 🛡️ 4. โซนผู้ดูแลระบบ (Admin)
    { path: '/admin/dashboard', name: 'admin-dashboard', component: () => import('../views/admin/AdminDashboardView.vue') }
  ],
  
  // เลื่อนกลับไปบนสุดเสมอเมื่อเปลี่ยนหน้า
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    else return { top: 0, behavior: 'smooth' }
  }
})

export default router