<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
// 🟢 เรียกใช้ตัวแปร isAuthenticated และ user จาก useAuth
const { isAuthenticated, user, logout } = useAuth() 

const showDropdown = ref(false)

// ปิด Dropdown เมื่อคลิกที่อื่น
const closeDropdown = (e) => {
  if (!e.target.closest('.user-dropdown')) {
    showDropdown.value = false
  }
}

onMounted(() => document.addEventListener('click', closeDropdown))
onUnmounted(() => document.removeEventListener('click', closeDropdown))

const handleLogout = async () => {
  if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
    await logout()
    showDropdown.value = false
    router.push('/auth')
  }
}
</script>

<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
    <!-- Top Bar (ติดต่อเรา) -->
    <div class="bg-slate-900 text-slate-300 text-[10px] md:text-xs py-1.5 px-4 md:px-10 flex justify-between items-center">
      <div class="flex gap-4">
        <span class="flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg> 02-105-4757</span>
        <span class="flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> support@rentall.com</span>
      </div>
      <div class="hidden md:block">RentAll แพลตฟอร์มเช่ายืมที่คุณไว้วางใจ</div>
    </div>

    <!-- Main Header -->
    <div class="max-w-[1400px] mx-auto px-4 md:px-10 py-3 md:py-4 flex items-center justify-between gap-4 md:gap-8">
      
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2 flex-shrink-0">
        <div class="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-lg md:text-xl shadow-md">R</div>
        <span class="font-black text-xl md:text-2xl text-indigo-900 tracking-tight hidden sm:block">RentAll</span>
      </RouterLink>

      <!-- Menus (หน้าแรก, สัญญาเช่า ฯลฯ) -->
      <nav class="hidden lg:flex items-center gap-6 font-bold text-sm text-slate-600">
        <RouterLink to="/" class="hover:text-indigo-600 transition">หน้าแรก</RouterLink>
        <RouterLink to="/search" class="hover:text-indigo-600 transition">ค้นหาสินค้าทั้งหมด</RouterLink>
        <RouterLink to="/contract" class="hover:text-indigo-600 transition">สัญญาเช่า</RouterLink>
        <RouterLink to="/help" class="hover:text-indigo-600 transition">ช่วยเหลือ</RouterLink>
        <RouterLink to="/about" class="hover:text-indigo-600 transition">เกี่ยวกับเรา</RouterLink>
      </nav>

      <!-- Right Section (Cart & Auth) -->
      <div class="flex items-center gap-3 md:gap-5 flex-shrink-0">
        
        <!-- ตะกร้าสินค้า -->
        <RouterLink to="/cart" class="relative p-2 text-slate-600 hover:text-indigo-600 transition">
          <svg class="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        </RouterLink>

        <!-- 🔴 ปุ่มเข้าสู่ระบบ (แสดงเมื่อยังไม่ล็อกอิน) -->
        <RouterLink v-if="!isAuthenticated" to="/auth" class="bg-slate-900 text-white font-bold text-xs md:text-sm px-5 py-2.5 md:px-6 md:py-3 rounded-full hover:bg-slate-800 transition shadow-md whitespace-nowrap">
          เข้าสู่ระบบ
        </RouterLink>

        <!-- 🟢 รูปโปรไฟล์ + Dropdown (แสดงเมื่อล็อกอินแล้ว) -->
        <div v-else class="relative user-dropdown">
          <button @click="showDropdown = !showDropdown" class="flex items-center gap-2 focus:outline-none bg-slate-50 border border-slate-200 pl-2 pr-4 py-1.5 rounded-full hover:bg-slate-100 transition">
            <img :src="user.avatar || `https://ui-avatars.com/api/?name=${user.name || 'U'}`" class="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover bg-white shadow-sm" />
            <span class="text-xs md:text-sm font-bold text-slate-700 truncate max-w-[80px] md:max-w-[120px]">{{ user.first_name || user.username }}</span>
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>

          <!-- Dropdown Menu -->
          <div v-if="showDropdown" class="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-slide-up origin-top-right">
            <div class="p-4 border-b border-slate-100 bg-slate-50">
              <p class="font-black text-slate-800 text-sm truncate">{{ user.name }}</p>
              <p class="text-[10px] text-slate-500 font-medium truncate mt-0.5">{{ user.email }}</p>
              
              <!-- ป้ายบอก Role -->
              <div class="mt-2">
                <span v-if="user.role === 'admin'" class="bg-rose-100 text-rose-700 text-[9px] font-black px-2 py-0.5 rounded uppercase">Admin</span>
                <span v-else-if="user.role === 'lender'" class="bg-amber-100 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded uppercase">Lender</span>
                <span v-else class="bg-indigo-100 text-indigo-700 text-[9px] font-black px-2 py-0.5 rounded uppercase">Member</span>
              </div>
            </div>

            <div class="p-2 space-y-1">
              <RouterLink to="/profile" @click="showDropdown = false" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> บัญชีของฉัน
              </RouterLink>
              <RouterLink to="/contract" @click="showDropdown = false" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> รายการเช่าของฉัน
              </RouterLink>

              <!-- เมนูเฉพาะ Lender (ร้านค้า) -->
              <RouterLink v-if="user.role === 'lender' || user.role === 'admin'" to="/lender/dashboard" @click="showDropdown = false" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-amber-700 hover:bg-amber-50 transition">
                <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg> จัดการร้านค้า
              </RouterLink>

              <!-- เมนูเฉพาะ Admin -->
              <RouterLink v-if="user.role === 'admin'" to="/admin/dashboard" @click="showDropdown = false" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition">
                <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> ระบบหลังบ้าน (Admin)
              </RouterLink>
            </div>

            <div class="p-2 border-t border-slate-100">
              <button @click="handleLogout" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg> ออกจากระบบ
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </header>
</template>

<style scoped>
@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-slide-up { animation: slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>