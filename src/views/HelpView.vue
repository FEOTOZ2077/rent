<script setup>
import { ref, onMounted } from 'vue'

const activeFaq = ref(null)

const faqs = [
  { q: 'การยืนยันตัวตน (KYC) ใช้เวลานานแค่ไหน?', a: 'ระบบจะทำการตรวจสอบข้อมูลและเอกสารของคุณภายใน 24-48 ชั่วโมงทำการ หากผ่านการอนุมัติคุณจะได้รับป้ายยืนยัน (Verified Badge) ทันที' },
  { q: 'ระบบรับประกันสินค้าเสียหายทำงานอย่างไร?', a: 'หากเกิดความเสียหายในระหว่างการเช่า ระบบมีวงเงินประกันจากเงินมัดจำของผู้เช่า รวมถึงประกันภัยเสริมที่ครอบคลุมความเสียหายสูงสุด 100,000 บาท ตามเงื่อนไขของแต่ละสินค้า' },
  { q: 'ต้องการยกเลิกการเช่า ต้องทำอย่างไร?', a: 'คุณสามารถยกเลิกการเช่าได้ฟรีก่อนวันรับของ 48 ชั่วโมง หากยกเลิกหลังจากนั้นอาจมีค่าธรรมเนียมการยกเลิก 30% ของยอดเช่าสุทธิ' },
  { q: 'การจ่ายเงินและรับเงินปลอดภัยหรือไม่?', a: 'RentAll ใช้ระบบ Escrow ที่ได้รับมาตรฐาน PCI-DSS โดยเราจะเก็บเงินค่าเช่าไว้ในระบบกลาง และจะโอนให้ผู้ให้เช่าเมื่อผู้เช่าได้รับสินค้าอย่างปลอดภัยแล้วเท่านั้น' }
]

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

onMounted(() => window.scrollTo(0, 0))
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen font-sans pb-20">
    <!-- Hero Support -->
    <div class="bg-slate-900 text-white pt-20 pb-24 px-4 relative overflow-hidden text-center">
      <div class="absolute inset-0 opacity-20 mix-blend-overlay" style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 20px 20px;"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px]"></div>
      
      <div class="relative z-10 max-w-2xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-black tracking-tight mb-4">สวัสดี, มีอะไรให้เราช่วยเหลือ?</h1>
        <p class="text-indigo-200 text-sm md:text-base font-medium mb-8">ค้นหาคำตอบ ข้อสงสัย หรือติดต่อทีมงาน Support ได้ตลอด 24 ชั่วโมง</p>
        
        <div class="relative max-w-xl mx-auto">
          <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="พิมพ์คำถามที่ต้องการค้นหา..." class="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-900 text-sm font-medium outline-none shadow-lg focus:ring-4 focus:ring-indigo-500/30" />
        </div>
      </div>
    </div>

    <!-- Topics Grid -->
    <div class="max-w-[1000px] mx-auto px-4 md:px-10 -mt-10 relative z-20">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg hover:-translate-y-1 transition cursor-pointer group">
          <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <h3 class="text-lg font-black text-slate-800 mb-1">การจัดการบัญชี</h3>
          <p class="text-xs text-slate-500 font-medium">การยืนยัน KYC, รีเซ็ตรหัสผ่าน, เปลี่ยนข้อมูลส่วนตัว</p>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg hover:-translate-y-1 transition cursor-pointer group">
          <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          </div>
          <h3 class="text-lg font-black text-slate-800 mb-1">การชำระเงิน</h3>
          <p class="text-xs text-slate-500 font-medium">เพิ่มบัตรเครดิต, ระบบมัดจำ, การขอคืนเงิน (Refund)</p>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg hover:-translate-y-1 transition cursor-pointer group">
          <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <h3 class="text-lg font-black text-slate-800 mb-1">ความปลอดภัย</h3>
          <p class="text-xs text-slate-500 font-medium">ประกันภัยสินค้า, กฎการเช่า, การระงับข้อพิพาท</p>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="max-w-[800px] mx-auto px-4 md:px-10 py-16">
      <h2 class="text-2xl md:text-3xl font-black text-slate-900 mb-8 text-center">คำถามที่พบบ่อย (FAQ)</h2>
      <div class="space-y-4">
        <div v-for="(faq, idx) in faqs" :key="idx" class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_4px_15px_rgb(0,0,0,0.02)]">
          <button @click="toggleFaq(idx)" class="w-full text-left p-5 flex justify-between items-center bg-white outline-none">
            <span class="font-bold text-slate-800 text-sm md:text-base pr-4">{{ faq.q }}</span>
            <svg :class="['w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0', activeFaq === idx ? 'rotate-180' : '']" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div v-show="activeFaq === idx" class="p-5 pt-0 bg-slate-50 text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100">
            {{ faq.a }}
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Support Banner -->
    <div class="max-w-[1000px] mx-auto px-4 md:px-10 pb-16">
      <div class="bg-indigo-600 text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
        <div class="relative z-10">
          <svg class="w-12 h-12 mx-auto mb-4 text-indigo-200" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
          <h2 class="text-2xl font-black mb-2">ไม่พบคำตอบที่คุณต้องการใช่ไหม?</h2>
          <p class="text-indigo-100 text-sm font-medium mb-8">ทีมงาน Support ของเราพร้อมให้ความช่วยเหลือคุณตลอด 24 ชั่วโมง</p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <button class="bg-white text-indigo-600 font-bold px-8 py-3.5 rounded-xl shadow-lg transition hover:scale-105">คุยกับแอดมิน (Live Chat)</button>
            <button class="bg-indigo-800 text-white font-bold px-8 py-3.5 rounded-xl border border-indigo-500 hover:bg-indigo-900 transition">ส่งอีเมลหาเรา</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>