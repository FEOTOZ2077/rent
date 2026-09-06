<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cartItems = ref([])
const paymentMethod = ref('promptpay') // 'promptpay' | 'credit_card'
const isProcessing = ref(false)

onMounted(() => {
  cartItems.value = JSON.parse(localStorage.getItem('rentall_cart') || '[]')
})

const removeFromCart = (index) => {
  cartItems.value.splice(index, 1)
  localStorage.setItem('rentall_cart', JSON.stringify(cartItems.value))
}

const grandTotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.totalPrice, 0)
})

const handlePayNow = () => {
  if (cartItems.value.length === 0) return alert('ไม่มีรายการในตะกร้า')
  
  isProcessing.value = true
  setTimeout(() => {
    isProcessing.value = false
    alert('ชำระเงินสำเร็จ! สัญญาเช่าถูกสร้างและแจ้งเตือนไปยังผู้ให้เช่าแล้ว')
    localStorage.removeItem('rentall_cart')
    router.push('/contract')
  }, 2200)
}
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen font-sans pb-28 lg:pb-16">
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12">
      
      <div class="flex items-center gap-3 mb-8">
        <button @click="router.back()" class="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition">
          <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h1 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">ตะกร้าและการชำระเงิน</h1>
      </div>

      <!-- Empty Cart State -->
      <div v-if="cartItems.length === 0" class="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
        <div class="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        </div>
        <h3 class="text-xl font-black text-slate-800 mb-2">ไม่มีสินค้าในตะกร้า</h3>
        <p class="text-xs md:text-sm text-slate-400 mb-6">คุณยังไม่ได้เพิ่มสินค้าใดๆ เข้ามาในตะกร้า เริ่มต้นค้นหาได้เลย!</p>
        <button @click="router.push('/search')" class="bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-2xl text-xs shadow-md hover:bg-indigo-700 transition">
          ค้นหาสินค้า
        </button>
      </div>

      <!-- Main Cart & Checkout Flow -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <!-- รายการสินค้าในตะกร้า (ฝั่งซ้าย) -->
        <div class="lg:col-span-2 space-y-4">
          <div 
            v-for="(item, idx) in cartItems" 
            :key="idx" 
            class="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-5 items-center relative overflow-hidden"
          >
            <img :src="item.itemImage" class="w-full sm:w-36 h-28 object-cover rounded-2xl flex-shrink-0 bg-slate-100" />
            
            <div class="flex-1 w-full space-y-2">
              <div class="flex justify-between items-start">
                <span class="text-[10px] font-black tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md uppercase">
                  {{ item.orderId }}
                </span>
                <button @click="removeFromCart(idx)" class="text-xs font-bold text-rose-500 hover:text-rose-700 transition flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  ลบ
                </button>
              </div>

              <h4 class="font-black text-slate-900 text-base leading-snug">{{ item.itemTitle }}</h4>
              
              <!-- วันเวลาและโหมด -->
              <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] font-medium text-slate-600 space-y-0.5">
                <p>📍 ผู้ให้เช่า: <span class="font-bold text-slate-800">{{ item.lenderName }}</span></p>
                <p>⏱️ ระยะเวลา: <span class="font-bold text-indigo-600">{{ item.durationText }}</span></p>
                <p>📅 รับ: {{ item.pickupDate }} • คืน: {{ item.returnDate }}</p>
              </div>
            </div>

            <div class="w-full sm:w-auto text-right border-t sm:border-t-0 pt-3 sm:pt-0 sm:pl-4">
              <span class="text-lg md:text-xl font-black text-indigo-600 block">฿{{ item.totalPrice.toLocaleString() }}</span>
              <span class="text-[10px] text-slate-400 font-bold">รวมค่าบริการแล้ว</span>
            </div>
          </div>
        </div>

        <!-- ชำระเงิน (ฝั่งขวา) -->
        <div class="lg:col-span-1">
          <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.06)] space-y-6 sticky top-24">
            <h3 class="font-black text-slate-900 text-lg">เลือกช่องทางชำระเงิน</h3>

            <div class="space-y-3">
              <!-- PromptPay -->
              <label :class="['flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition', paymentMethod === 'promptpay' ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' : 'border-slate-200 hover:bg-slate-50']">
                <input type="radio" v-model="paymentMethod" value="promptpay" class="accent-indigo-600 w-4 h-4" />
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
                <span class="text-xs font-bold text-slate-800">สแกน QR Code พร้อมเพย์</span>
              </label>

              <!-- Credit/Debit Card -->
              <label :class="['flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition', paymentMethod === 'credit_card' ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' : 'border-slate-200 hover:bg-slate-50']">
                <input type="radio" v-model="paymentMethod" value="credit_card" class="accent-indigo-600 w-4 h-4" />
                <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                <span class="text-xs font-bold text-slate-800">บัตรเครดิต / เดบิต</span>
              </label>
            </div>

            <!-- กล่องแสดงผลตามประเภทการจ่าย -->
            <div v-if="paymentMethod === 'promptpay'" class="text-center p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div class="w-40 h-40 bg-white mx-auto p-2 rounded-xl shadow-inner border border-slate-200 flex items-center justify-center">
                <!-- SVG จำลอง QR code -->
                <svg class="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h4v4h-4v-4zm-4 2h2v2h-2v-2z"/>
                </svg>
              </div>
              <p class="text-[11px] font-bold text-slate-500">สแกนจ่ายได้ด้วย Mobile Banking ทุกธนาคาร</p>
            </div>

            <div v-else class="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <input type="text" placeholder="หมายเลขบัตร 16 หลัก" class="w-full p-3 rounded-xl border border-slate-200 font-mono outline-none focus:border-indigo-600 bg-white" />
              <div class="flex gap-2">
                <input type="text" placeholder="MM/YY" class="w-1/2 p-3 rounded-xl border border-slate-200 font-mono outline-none focus:border-indigo-600 bg-white" />
                <input type="text" placeholder="CVC" class="w-1/2 p-3 rounded-xl border border-slate-200 font-mono outline-none focus:border-indigo-600 bg-white" />
              </div>
            </div>

            <!-- Grand Total Summary -->
            <div class="border-t border-slate-100 pt-4 flex justify-between items-center">
              <span class="font-bold text-slate-600 text-sm">ยอดรวมทั้งหมด</span>
              <span class="text-2xl font-black text-indigo-600">฿{{ grandTotal.toLocaleString() }}</span>
            </div>

            <button 
              @click="handlePayNow" 
              :disabled="isProcessing"
              class="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-xl transition flex justify-center items-center gap-2 disabled:opacity-75"
            >
              <svg v-if="isProcessing" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span v-else>ยืนยันและชำระเงิน</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>