<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user } = useAuth()

const cartItems = ref([])
const selectedOrderIds = ref([]) // เก็บ ID ของออเดอร์ที่ถูกติ๊กเลือก

// 🟢 โหมดของหน้าจอ (ตะกร้า หรือ กำลังชำระเงิน)
const isCheckoutStep = ref(false)
const paymentMethod = ref('promptpay') 
const isProcessing = ref(false)

onMounted(() => {
  cartItems.value = JSON.parse(localStorage.getItem('rentall_cart') || '[]')
  // เริ่มต้นให้ติ๊กเลือกทั้งหมดอัตโนมัติ
  selectedOrderIds.value = cartItems.value.map(item => item.orderId)
})

// ลบสินค้า
const removeFromCart = (orderId) => {
  cartItems.value = cartItems.value.filter(item => item.orderId !== orderId)
  selectedOrderIds.value = selectedOrderIds.value.filter(id => id !== orderId)
  localStorage.setItem('rentall_cart', JSON.stringify(cartItems.value))
}

// กรองเฉพาะสินค้าที่เลือกมาคำนวณ
const selectedItems = computed(() => cartItems.value.filter(item => selectedOrderIds.value.includes(item.orderId)))
const grandTotal = computed(() => selectedItems.value.reduce((sum, item) => sum + item.totalPrice, 0))

// ย้ายไปสเตปชำระเงิน
const proceedToCheckout = () => {
  if (selectedItems.value.length === 0) return alert('กรุณาเลือกสินค้าที่ต้องการชำระเงิน')
  isCheckoutStep.value = true
  window.scrollTo(0, 0)
}

// ยืนยันจ่ายเงิน
const handlePayNow = () => {
  isProcessing.value = true
  setTimeout(() => {
    // 1. ดึงเฉพาะสินค้าที่ "ไม่ได้เลือก" เอาไว้ในตะกร้าต่อ
    const remainingItems = cartItems.value.filter(item => !selectedOrderIds.value.includes(item.orderId))
    localStorage.setItem('rentall_cart', JSON.stringify(remainingItems))
    
    isProcessing.value = false
    alert('✅ ชำระเงินสำเร็จ! ระบบได้สร้างสัญญาเช่าสำหรับสินค้าที่เลือกแล้ว')
    router.push('/contract')
  }, 2000)
}
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen font-sans pb-28 lg:pb-16">
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12">
      
      <div class="flex items-center gap-3 mb-8">
        <button v-if="isCheckoutStep" @click="isCheckoutStep = false" class="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50">
          <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h1 class="text-2xl md:text-3xl font-black text-slate-900">{{ isCheckoutStep ? 'ดำเนินการชำระเงิน' : 'ตะกร้าของคุณ' }}</h1>
      </div>

      <!-- 🔴 Empty Cart State -->
      <div v-if="cartItems.length === 0" class="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
        <div class="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        </div>
        <h3 class="text-xl font-black text-slate-800 mb-2">ไม่มีสินค้าในตะกร้า</h3>
        <p class="text-xs md:text-sm text-slate-400 mb-6">เริ่มค้นหาสิ่งที่คุณต้องการได้เลย</p>
        <button @click="router.push('/search')" class="bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-2xl text-xs shadow-md">ค้นหาสินค้า</button>
      </div>

      <!-- 🟢 ตะกร้าสินค้าปกติ (Step 1) -->
      <div v-else-if="!isCheckoutStep" class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div class="lg:col-span-2 space-y-4">
          
          <div v-for="item in cartItems" :key="item.orderId" class="bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex gap-4 items-center transition hover:shadow-md">
            <!-- Checkbox -->
            <input type="checkbox" :value="item.orderId" v-model="selectedOrderIds" class="w-5 h-5 accent-indigo-600 cursor-pointer" />
            
            <img :src="item.itemImage" class="hidden sm:block w-32 h-24 object-cover rounded-xl border border-slate-100" />
            
            <div class="flex-grow w-full">
              <div class="flex justify-between items-start mb-1">
                <span class="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{{ item.orderId }}</span>
                <button @click="removeFromCart(item.orderId)" class="text-xs font-bold text-rose-500 hover:underline">ลบ</button>
              </div>
              <h4 class="font-black text-slate-800 text-sm md:text-base leading-snug">{{ item.itemTitle }}</h4>
              <p class="text-[11px] text-slate-500 font-medium mt-1">ระยะเวลา: {{ item.durationText }} (รับ: {{ item.pickupDate }})</p>
              <p class="text-lg font-black text-indigo-600 mt-2">฿{{ item.totalPrice.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg sticky top-24">
            <h3 class="font-black text-slate-900 mb-4 text-lg">สรุปยอดตะกร้า</h3>
            <div class="flex justify-between items-center mb-6">
              <span class="font-bold text-slate-500 text-sm">เลือกชำระ {{ selectedItems.length }} รายการ</span>
              <span class="text-2xl font-black text-indigo-600">฿{{ grandTotal.toLocaleString() }}</span>
            </div>
            <button @click="proceedToCheckout" :disabled="selectedItems.length === 0" class="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition disabled:opacity-50">
              ดำเนินการชำระเงิน
            </button>
          </div>
        </div>
      </div>

      <!-- 🟢 หน้าจอ Checkout / Payment (Step 2) -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <!-- รายการที่เลือกมาจ่าย -->
        <div class="lg:col-span-2 space-y-6">
          <h3 class="font-black text-slate-800 text-lg">สินค้าที่กำลังทำรายการชำระเงิน</h3>
          <div v-for="item in selectedItems" :key="item.orderId" class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <img :src="item.itemImage" class="w-16 h-16 object-cover rounded-lg border border-slate-100" />
            <div class="flex-grow">
              <h4 class="font-bold text-slate-800 text-sm">{{ item.itemTitle }}</h4>
              <p class="text-xs text-slate-500">ยอดชำระ: ฿{{ item.totalPrice.toLocaleString() }}</p>
            </div>
          </div>
          
          <div class="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-xs text-indigo-800 font-medium">
            🔒 กรุณาตรวจสอบข้อมูลการรับ-ส่งสินค้าให้ถูกต้องก่อนดำเนินการชำระเงิน
          </div>
        </div>

        <!-- กล่องเลือกการชำระเงิน -->
        <div class="lg:col-span-1">
          <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.06)] sticky top-24">
            <h3 class="font-black text-slate-900 mb-6 text-lg">วิธีชำระเงิน</h3>
            <div class="space-y-3 mb-8">
              <label :class="['flex items-center gap-3 p-4 rounded-xl border cursor-pointer', paymentMethod === 'promptpay' ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' : 'border-slate-200']">
                <input type="radio" v-model="paymentMethod" value="promptpay" class="accent-indigo-600 w-4 h-4" />
                <span class="text-xs font-bold text-slate-800">สแกน QR Code พร้อมเพย์</span>
              </label>
              <label :class="['flex items-center gap-3 p-4 rounded-xl border cursor-pointer', paymentMethod === 'credit_card' ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' : 'border-slate-200']">
                <input type="radio" v-model="paymentMethod" value="credit_card" class="accent-indigo-600 w-4 h-4" />
                <span class="text-xs font-bold text-slate-800">บัตรเครดิต / เดบิต</span>
              </label>
            </div>

            <!-- กล่องแสดงวิธีจ่าย (QR หรือ ฟอร์มบัตร) -->
            <div v-if="paymentMethod === 'promptpay'" class="text-center p-5 bg-slate-50 border border-slate-200 rounded-2xl mb-8">
              <div class="w-32 h-32 bg-white mx-auto p-2 rounded-xl shadow-inner border border-slate-200 mb-2">
                <svg class="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="currentColor"><path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h4v4h-4v-4zm-4 2h2v2h-2v-2z"/></svg>
              </div>
              <p class="text-[10px] font-bold text-slate-500">สแกนจ่ายได้ด้วย Mobile Banking</p>
            </div>

            <div class="border-t border-slate-100 pt-4 flex justify-between items-center mb-6">
              <span class="font-bold text-slate-600 text-sm">ยอดชำระสุทธิ</span>
              <span class="text-2xl font-black text-indigo-600">฿{{ grandTotal.toLocaleString() }}</span>
            </div>

            <button @click="handlePayNow" :disabled="isProcessing" class="w-full bg-slate-900 text-white font-black py-4.5 rounded-2xl shadow-xl hover:-translate-y-1 transition disabled:opacity-75 flex justify-center items-center gap-2">
              <svg v-if="isProcessing" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isProcessing ? 'ระบบกำลังดำเนินการ...' : 'ชำระเงินทันที' }}
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>