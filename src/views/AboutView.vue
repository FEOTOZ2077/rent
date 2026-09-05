<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-white font-sans">
    
    <!-- Hero About -->
    <div class="max-w-[1000px] mx-auto px-4 md:px-10 pt-20 md:pt-32 pb-16 text-center">
      <h1 class="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
        เปลี่ยนทรัพยากรที่ไม่ได้ใช้ <br/> ให้เป็น <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">"การแบ่งปัน"</span> ที่คุ้มค่า
      </h1>
      <p class="mt-6 md:mt-8 text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
        RentAll ก่อตั้งขึ้นด้วยวิสัยทัศน์ที่จะสร้าง <b>Circular Economy (เศรษฐกิจหมุนเวียน)</b> 
        ที่ทุกคนสามารถเข้าถึงยานพาหนะและสิ่งของคุณภาพสูงได้โดยไม่ต้องซื้อ และเจ้าของสามารถสร้างรายได้จากสิ่งที่มีอยู่
      </p>
    </div>

    <!-- Main Image -->
    <div class="max-w-[1200px] mx-auto px-4 md:px-10 mb-20">
      <div class="relative w-full h-[50vh] md:h-[65vh] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-slate-900/20 mix-blend-multiply"></div>
      </div>
    </div>
    
    <!-- Core Values -->
    <div class="bg-slate-50 py-20">
      <div class="max-w-[1200px] mx-auto px-4 md:px-10">
        <div class="text-center mb-16">
           <span class="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Our Core Values</span>
           <h2 class="text-3xl md:text-4xl font-black text-slate-900">สิ่งที่เรายึดมั่น</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-6">🔒</div>
            <h3 class="text-xl font-black text-slate-800 mb-3">Trust & Security</h3>
            <p class="text-slate-500 text-sm leading-relaxed font-medium">ความปลอดภัยคือหัวใจหลัก เรามีระบบ KYC ตรวจสอบประวัติ และระบบรับชำระเงิน Escrow ที่ทำให้ทุกคนมั่นใจในทุกธุรกรรม</p>
          </div>
          <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6">🌍</div>
            <h3 class="text-xl font-black text-slate-800 mb-3">Sustainability</h3>
            <p class="text-slate-500 text-sm leading-relaxed font-medium">ลดการผลิตและบริโภคที่มากเกินจำเป็น ด้วยการหมุนเวียนสิ่งของในคอมมูนิตี้ เพื่อโลกและสิ่งแวดล้อมที่ดีกว่า</p>
          </div>
          <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div class="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl mb-6">🤝</div>
            <h3 class="text-xl font-black text-slate-800 mb-3">Community First</h3>
            <p class="text-slate-500 text-sm leading-relaxed font-medium">เราเชื่อในพลังของชุมชน แพลตฟอร์มของเราถูกออกแบบมาให้ใช้งานง่าย ยุติธรรม และสร้างประโยชน์ให้กับผู้ใช้ทุกคนอย่างแท้จริง</p>
          </div>
        </div>
      </div>
    </div>

    <!-- The Numbers / Stats -->
    <div class="max-w-[1200px] mx-auto px-4 md:px-10 py-20">
      <div class="bg-slate-900 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
        <!-- Decoration -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        
        <div class="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <p class="text-4xl md:text-5xl font-black text-white mb-2">50k+</p>
            <p class="text-indigo-200 font-medium text-sm">ผู้ใช้งานทั่วประเทศ</p>
          </div>
          <div>
            <p class="text-4xl md:text-5xl font-black text-white mb-2">12k+</p>
            <p class="text-indigo-200 font-medium text-sm">รายการสินค้าบนระบบ</p>
          </div>
          <div>
            <p class="text-4xl md:text-5xl font-black text-white mb-2">฿45M</p>
            <p class="text-indigo-200 font-medium text-sm">รายได้ที่สร้างให้ผู้ให้เช่า</p>
          </div>
          <div>
            <p class="text-4xl md:text-5xl font-black text-white mb-2">99.8%</p>
            <p class="text-indigo-200 font-medium text-sm">ความพึงพอใจ</p>
          </div>
        </div>

        <div class="relative z-10 mt-16 pt-16 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <h3 class="text-2xl md:text-3xl font-black text-white tracking-tight text-center md:text-left">พร้อมร่วมเป็นส่วนหนึ่ง<br/>ของคอมมูนิตี้เราหรือยัง?</h3>
          <div class="flex gap-4">
            <button @click="router.push('/search')" class="bg-white text-slate-900 font-bold px-8 py-4 rounded-xl hover:bg-slate-100 transition shadow-xl text-sm md:text-base">เริ่มค้นหาสินค้า</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>