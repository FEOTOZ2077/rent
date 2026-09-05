<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
    
    <!-- 💻 Sidebar (Dark Theme สำหรับ Admin) -->
    <aside class="hidden md:flex flex-col w-72 bg-slate-900 text-white h-screen sticky top-0 shadow-2xl">
      <div class="p-8 border-b border-slate-800">
        <RouterLink to="/" class="text-2xl font-black tracking-tight text-white flex items-center gap-2">
          RentAll <span class="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-md ml-1 border border-red-500/30">ADMIN</span>
        </RouterLink>
      </div>
      
      <div class="p-6 pb-2">
        <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">ระบบจัดการหลัก</p>
        <nav class="space-y-2">
          <RouterLink to="/admin/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-900/50">
            <span class="text-xl">📈</span> ภาพรวมระบบ
          </RouterLink>
          <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white font-bold transition">
            <span class="text-xl">👥</span> จัดการผู้ใช้งาน
          </a>
          <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white font-bold transition">
            <span class="text-xl">⚖️</span> ข้อพิพาทและการแจ้งเตือน
          </a>
          <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white font-bold transition">
            <span class="text-xl">⚙️</span> ตั้งค่าแพลตฟอร์ม
          </a>
        </nav>
      </div>
      
      <div class="mt-auto p-6 border-t border-slate-800">
        <RouterLink to="/" class="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 hover:text-white transition">
          ออกจากระบบ Admin
        </RouterLink>
      </div>
    </aside>

    <!-- พื้นที่ทำงานหลัก -->
    <main class="flex-1 overflow-y-auto">
      <header class="md:hidden bg-slate-900 text-white p-4 sticky top-0 z-10 flex justify-between items-center shadow-lg">
        <span class="font-bold text-lg">Admin Panel</span>
        <RouterLink to="/" class="text-sm font-bold bg-slate-800 px-3 py-1.5 rounded-lg">ออก</RouterLink>
      </header>
      
      <div class="p-4 md:p-10 max-w-6xl mx-auto">
        <RouterView /> 
      </div>
    </main>
  </div>
</template>