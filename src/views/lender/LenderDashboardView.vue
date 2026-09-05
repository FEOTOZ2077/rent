<script setup>
import { useAuth } from '@/composables/useAuth'
const { user } = useAuth()
</script>

<template>
  <div class="bg-slate-50 min-h-screen">
    <div class="bg-indigo-900 pb-24 pt-10 px-4 md:px-10">
      <div class="max-w-[1400px] mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-3xl md:text-4xl font-black text-white tracking-tight">ภาพรวมร้านค้า 🏪</h1>
          <p class="text-indigo-200 mt-2 font-medium text-sm">ยินดีต้อนรับกลับมา, {{ user?.name }}! นี่คือสถิติร้านค้าของคุณ</p>
        </div>
        <button class="bg-white text-indigo-900 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition shadow-lg">
          + ลงประกาศใหม่
        </button>
      </div>
    </div>

    <div class="max-w-[1400px] mx-auto px-4 md:px-10 -mt-12">
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div class="bg-white p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100">
          <p class="text-slate-500 text-xs font-bold uppercase">รายได้เดือนนี้</p>
          <p class="text-2xl md:text-3xl font-black text-indigo-600 mt-2">฿14,500</p>
        </div>
        <div class="bg-white p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100">
          <p class="text-slate-500 text-xs font-bold uppercase">รอการยืนยัน</p>
          <p class="text-2xl md:text-3xl font-black text-amber-500 mt-2">3 <span class="text-sm font-medium text-slate-400">รายการ</span></p>
        </div>
        <div class="bg-white p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100">
          <p class="text-slate-500 text-xs font-bold uppercase">กำลังถูกเช่าอยู่</p>
          <p class="text-2xl md:text-3xl font-black text-emerald-500 mt-2">8 <span class="text-sm font-medium text-slate-400">รายการ</span></p>
        </div>
        <div class="bg-white p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100">
          <p class="text-slate-500 text-xs font-bold uppercase">รีวิวเฉลี่ย</p>
          <p class="text-2xl md:text-3xl font-black text-slate-800 mt-2">★ 4.9</p>
        </div>
      </div>

      <!-- Content Area -->
      <div class="mt-8 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 text-center min-h-[300px] flex flex-col justify-center items-center">
         <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4"><svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg></div>
         <h3 class="text-lg font-black text-slate-700">ไม่มีคำขอเช่าใหม่ในขณะนี้</h3>
         <p class="text-slate-500 mt-1 text-sm">หากมีลูกค้าสนใจเช่าสินค้า ระบบจะแจ้งเตือนคุณทันที</p>
      </div>
    </div>
  </div>
</template>