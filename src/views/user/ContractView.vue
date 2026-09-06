<script setup>
import { ref, onMounted } from 'vue'

const activeTab = ref('active')

// ข้อมูลจำลอง (ถ้าจะใช้ DB ก็เรียก useBookings() ได้เลย)
const contracts = ref([]) 
onMounted(() => window.scrollTo(0, 0))
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen pb-20 relative font-sans">
    
    <div class="bg-white border-b border-slate-200 pt-8 pb-4 px-4 md:px-10">
      <div class="max-w-[1000px] mx-auto">
        <h1 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">รายการเช่าของฉัน</h1>
        <p class="text-slate-500 mt-2 text-sm font-medium">ติดตามสถานะ และจัดการประวัติการเช่าของคุณ</p>
        <div class="flex gap-6 mt-8">
          <button @click="activeTab = 'active'" :class="['pb-3 text-sm font-black transition-all border-b-[3px] px-1', activeTab === 'active' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400']">กำลังดำเนินการ</button>
          <button @click="activeTab = 'completed'" :class="['pb-3 text-sm font-black transition-all border-b-[3px] px-1', activeTab === 'completed' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400']">ประวัติที่เสร็จสิ้น</button>
        </div>
      </div>
    </div>

    <div class="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-10 py-12">
      
      <!-- 🔴 Empty State (ออกแบบใหม่) -->
      <div v-if="contracts.filter(c => c.status === activeTab).length === 0" class="text-center py-20 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm max-w-2xl mx-auto">
        <div class="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
           <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <h3 class="text-2xl font-black text-slate-800 mb-2">ไม่มีสัญญาการเช่าในหมวดหมู่นี้</h3>
        <p class="text-sm font-medium text-slate-500 mb-8">คุณยังไม่เคยเช่าสินค้า หรือการเช่ายังไม่เสร็จสิ้น</p>
        <RouterLink to="/search" class="bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:bg-indigo-700 transition">
          เริ่มค้นหาสินค้าเพื่อเช่า
        </RouterLink>
      </div>

    </div>
  </div>
</template>