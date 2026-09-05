<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-[#F8FAFC]">
    <div class="w-full max-w-md bg-white rounded-[2rem] p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100">
      <div class="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
      </div>
      <h2 class="text-2xl font-black text-slate-800 mb-2">ตะกร้าของคุณยังว่างเปล่า</h2>
      <p class="text-slate-500 font-medium text-sm mb-8">คุณยังไม่ได้เพิ่มสินค้า รถยนต์ หรือที่พักลงในรายการเช่า กลับไปค้นหาสิ่งที่คุณต้องการกันเถอะ!</p>
      <button @click="router.push('/search')" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all">
        เริ่มค้นหาสินค้าเลย 🚀
      </button>
    </div>
  </div>
</template> 