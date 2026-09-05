<script setup>
import { ref } from 'vue'

const activeFaq = ref(1)

const topics = [
  { icon: '💳', name: 'การชำระเงินและบิล', desc: 'ข้อมูลบัตรเครดิต, การคืนเงิน, ค่าปรับ' },
  { icon: '🛡️', name: 'ความปลอดภัย & KYC', desc: 'การยืนยันตัวตน, ข้อมูลส่วนบุคคล' },
  { icon: '📦', name: 'การรับและคืนสินค้า', desc: 'ขั้นตอนรับของ, การขยายเวลาเช่า' },
  { icon: '🏪', name: 'การเป็นผู้ให้เช่า', desc: 'วิธีลงประกาศ, ค่าธรรมเนียม, การรับเงิน' }
]

const faqs = [
  { id: 1, q: 'RentAll คุ้มครองความเสียหายของสินค้าอย่างไร?', a: 'เรามีระบบพักเงิน (Escrow) และทำสัญญายินยอมความรับผิดชอบก่อนเช่าทุกครั้ง หากเกิดความเสียหาย ผู้เช่าจะต้องรับผิดชอบตามมูลค่าจริง หรือตามประกันภัยที่ครอบคลุม (สำหรับรถยนต์)' },
  { id: 2, q: 'ฉันจะได้รับเงินคืน (Deposit) เมื่อไหร่?', a: 'ระบบจะคืนเงินมัดจำ (ถ้ามี) เข้าบัตรเครดิต/บัญชีของคุณโดยอัตโนมัติภายใน 3-5 วันทำการ หลังจากผู้ให้เช่ายืนยันการรับคืนสินค้าในสภาพสมบูรณ์' },
  { id: 3, q: 'สามารถยกเลิกการจองได้หรือไม่?', a: 'คุณสามารถยกเลิกได้ฟรีหากยกเลิกล่วงหน้า 48 ชั่วโมงก่อนถึงเวลารับของ หากน้อยกว่านั้นอาจมีค่าธรรมเนียมการยกเลิกตามนโยบายของผู้ให้เช่า' }
]
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen pb-20 font-sans">
    
    <!-- Hero Support -->
    <div class="bg-indigo-900 pt-20 pb-28 px-4 text-center relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-indigo-800 to-indigo-950 opacity-50"></div>
      <div class="relative z-10 max-w-2xl mx-auto">
        <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight">ศูนย์ช่วยเหลือ RentAll</h1>
        <p class="text-indigo-200 mt-4 font-medium md:text-lg">พิมพ์คำถามหรือปัญหาที่คุณพบ เพื่อค้นหาวิธีแก้ไขได้ทันที</p>
        
        <div class="mt-8 relative group">
          <div class="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <input type="text" placeholder="เช่น วิธียกเลิกการจอง, ขอเงินคืน..." class="w-full pl-14 pr-32 py-5 rounded-2xl outline-none shadow-2xl text-slate-800 font-medium text-sm md:text-base focus:ring-4 focus:ring-indigo-500/30 transition-all" />
          <button class="absolute right-2.5 top-2.5 bottom-2.5 bg-indigo-600 text-white font-bold px-6 md:px-8 rounded-xl hover:bg-indigo-700 transition shadow-md text-sm">ค้นหา</button>
        </div>
      </div>
    </div>

    <div class="max-w-[1000px] mx-auto px-4 md:px-10 -mt-16 relative z-20">
      
      <!-- Quick Topics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <div v-for="topic in topics" :key="topic.name" class="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 hover:shadow-xl transition-all cursor-pointer">
          <div class="text-3xl mb-3">{{ topic.icon }}</div>
          <h3 class="font-black text-slate-800 text-sm mb-1">{{ topic.name }}</h3>
          <p class="text-xs text-slate-500 font-medium leading-relaxed">{{ topic.desc }}</p>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200">
        <div class="text-center mb-10">
          <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">FAQ</span>
          <h2 class="text-2xl md:text-3xl font-black text-slate-900 mt-4 tracking-tight">คำถามที่พบบ่อยที่สุด</h2>
        </div>

        <div class="space-y-4">
          <div v-for="faq in faqs" :key="faq.id" class="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300" :class="activeFaq === faq.id ? 'bg-slate-50 border-indigo-200 ring-1 ring-indigo-100' : 'bg-white hover:border-slate-300'">
            <button @click="activeFaq = activeFaq === faq.id ? null : faq.id" class="w-full px-6 py-5 text-left font-bold text-slate-800 flex justify-between items-center gap-4 text-sm md:text-base">
              {{ faq.q }}
              <span :class="['flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300', activeFaq === faq.id ? 'bg-indigo-600 text-white rotate-180' : 'bg-slate-100 text-slate-500']">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </span>
            </button>
            <div v-if="activeFaq === faq.id" class="px-6 pb-6 text-slate-600 text-sm leading-relaxed">
              {{ faq.a }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Contact Support CTA -->
      <div class="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div class="text-center md:text-left">
          <h3 class="text-2xl font-black text-white mb-2">ไม่พบคำตอบที่คุณตามหาใช่ไหม?</h3>
          <p class="text-slate-400 text-sm font-medium">ทีมงาน Support ของเราพร้อมช่วยเหลือคุณตลอด 24 ชั่วโมง ผ่านช่องทางแชทและอีเมล</p>
        </div>
        <button class="flex-shrink-0 bg-white text-slate-900 font-black px-8 py-4 rounded-xl hover:bg-indigo-50 transition shadow-lg w-full md:w-auto">
          💬 ติดต่อแอดมิน
        </button>
      </div>

    </div>
  </div>
</template>