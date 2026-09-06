<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { isAuthenticated, user, logout } = useAuth()

const isMobileMenuOpen = ref(false)
const isCategoryOpen = ref(false)
const isProfileMenuOpen = ref(false)

const isHeaderHidden = ref(false)
let lastScrollY = 0

const handleScroll = () => {
  const currentScrollY = window.scrollY
  if (currentScrollY > lastScrollY && currentScrollY > 80) {
    isHeaderHidden.value = true
    isCategoryOpen.value = false
    isProfileMenuOpen.value = false
  } else {
    isHeaderHidden.value = false
  }
  lastScrollY = currentScrollY
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const handleLogout = () => {
  logout()
  isMobileMenuOpen.value = false
  isProfileMenuOpen.value = false
  router.push('/auth')
}
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col">
    
    <!-- 🌐 Smart Header -->
    <div :class="['fixed top-0 left-0 w-full z-50 transition-transform duration-300 shadow-sm bg-white', isHeaderHidden ? '-translate-y-full' : 'translate-y-0']">
      
      <!-- ⬛ Top Bar (Desktop) -->
      <div class="hidden md:flex bg-slate-900 text-slate-300 text-xs py-2 px-10 justify-between items-center tracking-wide">
        <div class="flex items-center gap-6">
          <span class="flex items-center gap-1.5 font-medium">
            <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            02-105-4757
          </span>
          <span>|</span>
          <span class="flex items-center gap-1.5 font-medium">
            <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            support@rentall.com
          </span>
          <span>|</span>
          <span class="text-slate-400">RentAll แพลตฟอร์มเช่ายืมที่คุณไว้วางใจ</span>
        </div>
        <div class="flex items-center gap-6 font-medium">
          <RouterLink to="/search" class="hover:text-white transition flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            ค้นหาสิ่งของใกล้คุณ
          </RouterLink>
        </div>
      </div>

      <!-- 💻 Desktop Main Header -->
      <div class="hidden md:block">
        <div class="max-w-[1400px] mx-auto px-4 md:px-10 h-20 flex items-center justify-between gap-6 bg-white">
          <RouterLink to="/" class="text-3xl font-black text-indigo-600 tracking-tighter flex items-center gap-2 flex-shrink-0">
            <span class="bg-indigo-600 text-white p-1.5 rounded-xl text-xl">R</span> RentAll
          </RouterLink>
          
          <div class="flex-1 max-w-2xl">
            <div class="w-full bg-slate-50 rounded-full flex items-center px-5 py-3 border border-slate-200 focus-within:bg-white focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-600/10 transition-all shadow-inner">
              <svg class="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" placeholder="ค้นหาสินค้า, รถยนต์, อสังหาฯ..." class="bg-transparent w-full outline-none text-sm text-slate-700 font-medium" />
            </div>
          </div>

          <div class="flex items-center space-x-3 md:space-x-4">
            
            <!-- 🟢 ปุ่มเข้า Dashboard ของ Lender -->
            <RouterLink v-if="isAuthenticated && user?.role === 'lender'" to="/lender/dashboard" class="flex items-center gap-2 font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-full transition text-xs">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              โหมดผู้ให้เช่า
            </RouterLink>

            <!-- 🔴 ปุ่มเข้า Dashboard ของ Admin -->
            <RouterLink v-if="isAuthenticated && user?.role === 'admin'" to="/admin/dashboard" class="flex items-center gap-2 font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 rounded-full transition text-xs">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              โหมดแอดมิน
            </RouterLink>

            <RouterLink to="/cart" class="w-11 h-11 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition relative">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <span class="absolute top-1 right-1 bg-indigo-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">2</span>
            </RouterLink>
            
            <!-- 👤 Profile Dropdown -->
            <div v-if="isAuthenticated" class="relative">
              <button @click="isProfileMenuOpen = !isProfileMenuOpen" class="flex items-center gap-3 bg-slate-50 pl-2.5 pr-4 py-1.5 rounded-full border border-slate-200 shadow-sm hover:bg-slate-100 transition">
                <img :src="user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`" class="w-8 h-8 rounded-full border border-white shadow-sm object-cover" />
                <div class="flex flex-col text-left">
                  <span class="text-[10px] text-slate-400 font-bold leading-none">ยินดีต้อนรับ</span>
                  <span class="text-xs font-black text-slate-700 truncate max-w-[80px]">{{ user?.name }}</span>
                </div>
                <svg class="w-4 h-4 text-slate-400" :class="isProfileMenuOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              <!-- เมนูย่อย -->
              <div v-if="isProfileMenuOpen" class="absolute right-0 mt-3 w-56 bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-2xl py-2 z-50">
                <div class="px-5 py-3 border-b border-slate-100 mb-2">
                  <p class="text-sm font-black text-slate-800">{{ user?.name }}</p>
                  <p class="text-xs text-slate-500 font-medium">{{ user?.email }}</p>
                </div>
                
                <RouterLink to="/profile" @click="isProfileMenuOpen = false" class="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> จัดการบัญชี
                </RouterLink>

                <RouterLink to="/contract" @click="isProfileMenuOpen = false" class="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> รายการเช่าของฉัน
                </RouterLink>
                
                <!-- ซ่อนปุ่มสมัคร หากเป็น Lender หรือ Admin อยู่แล้ว -->
                <RouterLink v-if="user?.role !== 'lender' && user?.role !== 'admin'" to="/lender/register" @click="isProfileMenuOpen = false" class="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg> สมัครเป็นผู้ให้เช่า
                </RouterLink>

                <!-- เพิ่มปุ่ม Admin ลงใน Dropdown ด้วย -->
                <RouterLink v-if="user?.role === 'admin'" to="/admin/dashboard" @click="isProfileMenuOpen = false" class="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> แผงควบคุมผู้ดูแลระบบ
                </RouterLink>

                <div class="h-px bg-slate-100 my-2"></div>
                
                <button @click="handleLogout" class="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg> ออกจากระบบ
                </button>
              </div>
            </div>
            
            <template v-else>
              <RouterLink to="/auth" class="px-6 py-2.5 rounded-full bg-slate-900 text-white hover:bg-indigo-600 font-bold transition shadow-sm text-sm">เข้าสู่ระบบ</RouterLink>
            </template>
          </div>
        </div>

        <!-- 📋 Sub Navbar & หมวดหมู่ -->
        <div class="bg-white border-t border-slate-100">
          <div class="max-w-[1400px] mx-auto px-10 flex items-center justify-between h-14">
            <div class="relative">
              <button @click="isCategoryOpen = !isCategoryOpen" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 h-10 rounded-xl font-bold flex items-center gap-3 transition shadow-md shadow-indigo-100 text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                หมวดหมู่สินค้า 
                <svg class="w-3 h-3 transition-transform" :class="isCategoryOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </button>
              
              <div v-if="isCategoryOpen" class="absolute top-12 left-0 w-64 bg-white border border-slate-100 shadow-xl rounded-2xl py-2 z-50">
                <RouterLink to="/search" @click="isCategoryOpen = false" class="block px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">รถยนต์ / ยานพาหนะ</RouterLink>
                <RouterLink to="/search" @click="isCategoryOpen = false" class="block px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">อสังหาริมทรัพย์ / ที่พัก</RouterLink>
                <RouterLink to="/search" @click="isCategoryOpen = false" class="block px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">กล้องและเลนส์</RouterLink>
                <RouterLink to="/search" @click="isCategoryOpen = false" class="block px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">อุปกรณ์แคมป์ปิ้ง</RouterLink>
                <RouterLink to="/search" @click="isCategoryOpen = false" class="block px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">ชุดออกงาน / แฟชั่น</RouterLink>
              </div>
            </div>

            <!-- 🔗 เมนูลิงก์ Desktop -->
            <nav class="flex space-x-8 text-sm font-bold text-slate-600">
              <RouterLink to="/" class="hover:text-indigo-600 transition [&.router-link-exact-active]:text-indigo-600">หน้าแรก</RouterLink>
              <RouterLink to="/search" class="hover:text-indigo-600 transition [&.router-link-exact-active]:text-indigo-600">ค้นหาสินค้าทั้งหมด</RouterLink>
              <RouterLink to="/contract" class="hover:text-indigo-600 transition [&.router-link-exact-active]:text-indigo-600">สัญญาเช่า</RouterLink>
              <RouterLink to="/help" class="hover:text-indigo-600 transition [&.router-link-exact-active]:text-indigo-600">ช่วยเหลือ</RouterLink>
              <RouterLink to="/about" class="hover:text-indigo-600 transition [&.router-link-exact-active]:text-indigo-600">เกี่ยวกับเรา</RouterLink>
            </nav>
          </div>
        </div>
      </div>

      <!-- 📱 Mobile Header -->
      <div class="md:hidden w-full bg-white h-16 flex justify-between items-center px-4 shadow-sm">
        <div class="flex items-center gap-3">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-slate-700 text-2xl font-bold focus:outline-none">
            {{ isMobileMenuOpen ? '✕' : '☰' }}
          </button>
          <RouterLink to="/" class="text-2xl font-black text-indigo-600 tracking-tight">RentAll</RouterLink>
        </div>
        <img v-if="isAuthenticated" :src="user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'U'}`" class="w-8 h-8 rounded-full border border-slate-200 object-cover" />
        <RouterLink v-else to="/auth" class="bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
          เข้าสู่ระบบ
        </RouterLink>
      </div>

    </div>

    <!-- 📱 Mobile Dropdown Menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden fixed top-16 left-0 w-full bg-white border-b border-slate-100 shadow-2xl z-40 flex flex-col px-6 py-6 space-y-5">
      <div v-if="isAuthenticated" class="flex items-center gap-3 pb-4 border-b border-slate-100">
        <img :src="user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'U'}`" class="w-12 h-12 rounded-full border border-slate-200 object-cover" />
        <div>
          <p class="text-xs text-slate-400 font-bold">บัญชีของคุณ,</p>
          <p class="text-base font-black text-slate-800">{{ user?.name }}</p>
        </div>
      </div>

      <RouterLink to="/" @click="isMobileMenuOpen = false" class="font-bold text-slate-700 text-base hover:text-indigo-600">หน้าแรก</RouterLink>
      <RouterLink to="/search" @click="isMobileMenuOpen = false" class="font-bold text-slate-700 text-base hover:text-indigo-600">ค้นหาสินค้า</RouterLink>
      <RouterLink to="/contract" @click="isMobileMenuOpen = false" class="font-bold text-slate-700 text-base hover:text-indigo-600">สัญญาเช่า</RouterLink>
      <RouterLink to="/help" @click="isMobileMenuOpen = false" class="font-bold text-slate-700 text-base hover:text-indigo-600">ช่วยเหลือ</RouterLink>
      
      <!-- เมนู Mobile ตาม Role -->
      <RouterLink v-if="isAuthenticated && user?.role !== 'lender' && user?.role !== 'admin'" to="/lender/register" @click="isMobileMenuOpen = false" class="font-bold text-slate-700 text-base hover:text-indigo-600">สมัครผู้ให้เช่า</RouterLink>
      <RouterLink v-if="isAuthenticated && user?.role === 'lender'" to="/lender/dashboard" @click="isMobileMenuOpen = false" class="font-bold text-indigo-600 text-base">เข้าแผงควบคุมร้านค้า</RouterLink>
      <RouterLink v-if="isAuthenticated && user?.role === 'admin'" to="/admin/dashboard" @click="isMobileMenuOpen = false" class="font-bold text-rose-600 text-base">แผงควบคุมผู้ดูแลระบบ</RouterLink>

      <button v-if="isAuthenticated" @click="handleLogout" class="text-left font-bold text-rose-500 text-base pt-4 border-t border-slate-100">ออกจากระบบ</button>
    </div>

    <!-- 🧱 Spacer Box ดันเนื้อหาลงมาให้พอดีกับ Header ที่ลอยอยู่ (แก้ช่องโหว่สีขาวตอนเลื่อนจอ) -->
    <div class="h-[64px] md:h-[168px] w-full flex-shrink-0"></div>

    <!-- 🌟 Main Content -->
    <main class="flex-grow pb-24 md:pb-0 relative z-10 w-full">
      <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false" class="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30"></div>
      <RouterView /> 
    </main>

    <!-- 📱 Mobile Bottom Nav -->
    <nav class="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around items-center py-2 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      
      <RouterLink to="/" class="flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 [&.router-link-exact-active]:text-indigo-600 transition-colors py-1 px-2 w-16">
        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        <span class="text-[10px] font-bold tracking-tight">หน้าแรก</span>
      </RouterLink>

      <RouterLink to="/search" class="flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 [&.router-link-exact-active]:text-indigo-600 transition-colors py-1 px-2 w-16">
        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        <span class="text-[10px] font-bold tracking-tight">ค้นหา</span>
      </RouterLink>

      <RouterLink to="/cart" class="flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 [&.router-link-exact-active]:text-indigo-600 transition-colors py-1 px-2 w-16 relative">
        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        <span class="text-[10px] font-bold tracking-tight">ตะกร้า</span>
      </RouterLink>

      <RouterLink to="/contract" class="flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 [&.router-link-exact-active]:text-indigo-600 transition-colors py-1 px-2 w-16">
        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        <span class="text-[10px] font-bold tracking-tight">สัญญา</span>
      </RouterLink>

      <RouterLink :to="isAuthenticated ? '/profile' : '/auth'" class="flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 [&.router-link-exact-active]:text-indigo-600 transition-colors py-1 px-2 w-16">
        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        <span class="text-[10px] font-bold tracking-tight">บัญชี</span>
      </RouterLink>

    </nav>
  </div>
</template>

<style>
.pb-safe { padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 0.5rem); }
</style>