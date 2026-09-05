<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
    
    <!-- 💻 Sidebar (Dashboard Style) -->
    <aside class="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div class="p-8 border-b border-slate-100">
        <RouterLink to="/" class="text-2xl font-black tracking-tight text-indigo-600 flex items-center gap-2">
          <span class="bg-indigo-600 text-white p-1.5 rounded-lg text-lg">R</span> RentAll <span class="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md ml-1">Lender</span>
        </RouterLink>
      </div>
      
      <div class="p-6 pb-2">
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">เมนูจัดการร้านค้า</p>
        <nav class="space-y-2">
          <RouterLink to="/lender/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-50 text-indigo-700 font-bold">
            <span class="text-xl">📊</span> ภาพรวมร้านค้า
          </RouterLink>
          <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold transition">
            <span class="text-xl">📦</span> จัดการสิ่งของ
          </a>
          <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold transition">
            <span class="text-xl">📋</span> ออเดอร์เช่า
          </a>
          <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold transition">
            <span class="text-xl">💰</span> รายได้และบิล
          </a>
        </nav>
      </div>
      
      <div class="mt-auto p-6 border-t border-slate-100">
        <RouterLink to="/" class="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition">
          ← กลับสู่หน้าร้าน
        </RouterLink>
      </div>
    </aside>

    <!-- พื้นที่ทำงานหลัก -->
    <main class="flex-1 overflow-y-auto">
      <header class="md:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <span class="font-bold text-lg text-indigo-600">Lender Centre</span>
        <RouterLink to="/" class="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">ออก</RouterLink>
      </header>
      
      <div class="p-4 md:p-10 max-w-6xl mx-auto">
        <RouterView /> 
      </div>
    </main>
  </div>
</template>