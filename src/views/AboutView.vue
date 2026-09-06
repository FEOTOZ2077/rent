<script setup>
import { onMounted } from 'vue'
onMounted(() => window.scrollTo(0, 0))
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen font-sans pb-20">
    
    <!-- Hero About -->
    <div class="bg-slate-900 text-white py-24 md:py-32 px-4 relative overflow-hidden text-center flex flex-col items-center justify-center">
      <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=2000" class="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
      
      <div class="relative z-10 max-w-3xl mx-auto">
        <span class="text-indigo-400 font-bold tracking-widest uppercase text-xs mb-4 block">About RentAll</span>
        <h1 class="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">แบ่งปันทรัพยากร <br/> เพื่อโลกที่ยั่งยืนขึ้น</h1>
        <p class="text-slate-300 text-sm md:text-lg font-medium leading-relaxed">
          แพลตฟอร์มเช่ายืมของแบบ P2P ที่สร้างขึ้นเพื่อเชื่อมโยงผู้คน ส่งเสริมให้เกิดการใช้ทรัพยากรร่วมกันอย่างมีประสิทธิภาพ สร้างรายได้ และลดการบริโภคที่เกินจำเป็น
        </p>
      </div>
    </div>

    <!-- Stats -->
    <div class="max-w-[1000px] mx-auto px-4 md:px-10 -mt-12 relative z-20 mb-20">
      <div class="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
        <div class="pt-4 md:pt-0">
          <p class="text-4xl font-black text-indigo-600 mb-1">50K+</p>
          <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">ผู้ใช้งานระบบ</p>
        </div>
        <div class="pt-8 md:pt-0">
          <p class="text-4xl font-black text-indigo-600 mb-1">12,000</p>
          <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">รายการสินค้าให้เช่า</p>
        </div>
        <div class="pt-8 md:pt-0">
          <p class="text-4xl font-black text-indigo-600 mb-1">฿25M</p>
          <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">สร้างรายได้ให้ผู้ให้เช่า</p>
        </div>
      </div>
    </div>

    <!-- Features / Value -->
    <div class="max-w-[1200px] mx-auto px-4 md:px-10 py-12 mb-12">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <h2 class="text-3xl font-black text-slate-900 mb-4">ทำไมผู้คนถึงเลือก RentAll?</h2>
        <p class="text-slate-500 text-sm font-medium">เราออกแบบแพลตฟอร์มโดยยึดความปลอดภัยและประสบการณ์ใช้งานเป็นหัวใจสำคัญ</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div class="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <h3 class="text-xl font-black text-slate-800 mb-3">ปลอดภัย 100%</h3>
          <p class="text-sm text-slate-500 font-medium leading-relaxed">ระบบ KYC ตรวจสอบตัวตนผู้ใช้ทุกคน พร้อมวงเงินประกันสินค้า และระบบ Escrow ที่พักเงินไว้จนกว่าจะจบงาน</p>
        </div>
        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h3 class="text-xl font-black text-slate-800 mb-3">รวดเร็ว สะดวกสบาย</h3>
          <p class="text-sm text-slate-500 font-medium leading-relaxed">จองและชำระเงินออนไลน์ได้ทันที มีระบบสัญญาสร้างให้อัตโนมัติ (Smart Contract) และแชทคุยกับผู้ให้เช่าได้โดยตรง</p>
        </div>
        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div class="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
          </div>
          <h3 class="text-xl font-black text-slate-800 mb-3">สร้างรายได้ง่ายๆ</h3>
          <p class="text-sm text-slate-500 font-medium leading-relaxed">เปลี่ยนของที่คุณไม่ได้ใช้ทุกวัน ให้กลายเป็นแหล่งรายได้เสริมสุดคุ้มค่า สมัครฟรีไม่มีค่าใช้จ่ายล่วงหน้า</p>
        </div>
      </div>
    </div>

    <!-- Trust / Footer CTA -->
    <div class="max-w-[1000px] mx-auto px-4 md:px-10 pb-10 text-center">
      <div class="bg-indigo-50 border border-indigo-100 rounded-3xl p-10 md:p-14">
        <h2 class="text-2xl md:text-3xl font-black text-indigo-900 mb-4">พร้อมเริ่มต้นกับเราแล้วหรือยัง?</h2>
        <p class="text-indigo-700 text-sm font-medium mb-8">เข้าร่วมเป็นส่วนหนึ่งของคอมมูนิตี้แบ่งปันที่ใหญ่ที่สุดในไทย</p>
        <div class="flex justify-center gap-4">
          <RouterLink to="/search" class="bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:bg-indigo-700 transition">เริ่มค้นหาสินค้า</RouterLink>
          <RouterLink to="/lender/register" class="bg-white text-indigo-600 font-bold px-8 py-3.5 rounded-xl border border-indigo-200 hover:bg-indigo-50 transition">เปิดร้านให้เช่า</RouterLink>
        </div>
      </div>
    </div>

  </div>
</template>