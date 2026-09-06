<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth, supabase } from '@/composables/useAuth'
import { useBookings } from '@/composables/useBookings'

const router = useRouter()
const { user } = useAuth()
const { createBooking } = useBookings()

const cartItems = ref([])
const selectedOrderIds = ref([]) 

// 🟢 โหมดหน้าจอ
const isCheckoutStep = ref(false)
const paymentMethod = ref('promptpay') 
const isProcessing = ref(false)

// 📍 ข้อมูลที่อยู่จัดส่ง (Delivery Form)
const deliveryForm = ref({
  name: '',
  phone: '',
  address: '',
  note: ''
})

onMounted(async () => {
  cartItems.value = JSON.parse(localStorage.getItem('rentall_cart') || '[]')
  selectedOrderIds.value = cartItems.value.map(item => item.orderId)
  
  // โหลดข้อมูลเดิมจาก Profile มาใส่ฟอร์มให้อัตโนมัติ (ถ้าล็อกอิน)
  if (user.id) {
    const { data } = await supabase.from('profiles').select('first_name, last_name, phone, address').eq('id', user.id).single()
    if (data) {
      deliveryForm.value.name = `${data.first_name || ''} ${data.last_name || ''}`.trim() || user.name
      deliveryForm.value.phone = data.phone || ''
      deliveryForm.value.address = data.address || ''
    }
  }
})

const removeFromCart = (orderId) => {
  if (confirm('คุณต้องการลบสินค้านี้ออกจากตะกร้าใช่หรือไม่?')) {
    cartItems.value = cartItems.value.filter(item => item.orderId !== orderId)
    selectedOrderIds.value = selectedOrderIds.value.filter(id => id !== orderId)
    localStorage.setItem('rentall_cart', JSON.stringify(cartItems.value))
  }
}

// 🧮 คำนวณยอดเงิน
const selectedItems = computed(() => cartItems.value.filter(item => selectedOrderIds.value.includes(item.orderId)))
const subTotal = computed(() => selectedItems.value.reduce((sum, item) => sum + (item.totalPrice - 150), 0)) // หักค่าธรรมเนียมออกก่อนเพื่อคำนวณใหม่
const platformFeeTotal = computed(() => selectedItems.value.length * 150)
const grandTotal = computed(() => subTotal.value + platformFeeTotal.value)

// ➡️ ย้ายไป Step 2
const proceedToCheckout = () => {
  if (selectedItems.value.length === 0) return alert('กรุณาเลือกสินค้าที่ต้องการชำระเงินอย่างน้อย 1 รายการ')
  if (!user.id) return router.push('/auth')
  
  isCheckoutStep.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ⬅️ ย้อนกลับไป Step 1
const goBackToCart = () => {
  isCheckoutStep.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 💳 ยืนยันจ่ายเงิน
const handlePayNow = async () => {
  if (!deliveryForm.value.name || !deliveryForm.value.phone || !deliveryForm.value.address) {
    return alert('กรุณากรอกข้อมูลผู้รับและที่อยู่จัดส่งให้ครบถ้วน')
  }

  isProcessing.value = true
  try {
    // 1. บันทึกข้อมูลที่อยู่กลับไปที่ Profile (อัปเดตข้อมูลล่าสุด)
    await supabase.from('profiles').update({
      first_name: deliveryForm.value.name.split(' ')[0],
      last_name: deliveryForm.value.name.split(' ').slice(1).join(' ') || '',
      phone: deliveryForm.value.phone,
      address: deliveryForm.value.address
    }).eq('id', user.id)

    // 2. ส่งข้อมูลการเช่าเข้า Database
    await createBooking(user.id, selectedItems.value)
    
    // 3. จัดการตะกร้า (เก็บเฉพาะของที่ไม่ได้เลือกจ่าย)
    const remainingItems = cartItems.value.filter(item => !selectedOrderIds.value.includes(item.orderId))
    localStorage.setItem('rentall_cart', JSON.stringify(remainingItems))
    
    alert('✅ ทำรายการสำเร็จ! ชำระเงินเรียบร้อยแล้ว')
    router.push('/contract')
  } catch (error) {
    alert('❌ เกิดข้อผิดพลาด: ' + error.message)
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen font-sans pb-32 lg:pb-16 relative">
    
    <!-- 🟢 Header แบบ Step Progress -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm pt-6 pb-4">
      <div class="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button v-if="isCheckoutStep" @click="goBackToCart" class="p-2 bg-slate-50 text-slate-500 rounded-full hover:bg-slate-100 hover:text-slate-800 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{{ isCheckoutStep ? 'ดำเนินการชำระเงิน' : 'ตะกร้าของคุณ' }}</h1>
            <p v-if="!isCheckoutStep" class="text-xs font-bold text-slate-400 mt-1">คุณมี {{ cartItems.length }} รายการในตะกร้า</p>
          </div>
        </div>

        <!-- Step Indicator -->
        <div class="hidden md:flex items-center gap-4 text-xs font-bold">
          <div :class="['flex items-center gap-2', !isCheckoutStep ? 'text-indigo-600' : 'text-emerald-500']">
            <div :class="['w-6 h-6 rounded-full flex items-center justify-center text-white', !isCheckoutStep ? 'bg-indigo-600' : 'bg-emerald-500']">
               <span v-if="!isCheckoutStep">1</span>
               <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <span>รถเข็น</span>
          </div>
          <div class="w-8 h-px bg-slate-300"></div>
          <div :class="['flex items-center gap-2', isCheckoutStep ? 'text-indigo-600' : 'text-slate-400']">
            <div :class="['w-6 h-6 rounded-full flex items-center justify-center', isCheckoutStep ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500']">2</div>
            <span>ชำระเงิน</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 py-8">

      <!-- 🔴 Empty Cart State -->
      <div v-if="cartItems.length === 0" class="bg-white rounded-[2.5rem] py-20 px-4 text-center border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-2xl mx-auto mt-10">
        <div class="w-24 h-24 bg-slate-50 text-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        </div>
        <h3 class="text-2xl font-black text-slate-800 mb-3">ตะกร้าว่างเปล่า</h3>
        <p class="text-sm text-slate-500 font-medium mb-8">คุณยังไม่ได้เลือกสินค้าใดๆ เข้าตะกร้า ลองค้นหาสิ่งที่คุณสนใจได้เลย</p>
        <button @click="router.push('/search')" class="bg-indigo-600 text-white font-bold px-10 py-4 rounded-2xl text-sm shadow-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all">ค้นหาสินค้าเพื่อเช่า</button>
      </div>

      <!-- 🟢 STEP 1: ตะกร้าสินค้า -->
      <div v-else-if="!isCheckoutStep" class="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 items-start">
        
        <div class="lg:col-span-2 space-y-4">
          <!-- เช็คบ็อกซ์เลือกทั้งหมด -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" :checked="selectedOrderIds.length === cartItems.length" @change="(e) => selectedOrderIds = e.target.checked ? cartItems.map(i => i.orderId) : []" class="w-5 h-5 accent-indigo-600 rounded" />
              <span class="text-sm font-bold text-slate-700">เลือกทั้งหมด ({{ cartItems.length }} รายการ)</span>
            </label>
          </div>

          <!-- รายการสินค้า -->
          <div v-for="item in cartItems" :key="item.orderId" class="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex gap-4 md:gap-6 items-start md:items-center transition hover:shadow-md relative overflow-hidden group">
            
            <input type="checkbox" :value="item.orderId" v-model="selectedOrderIds" class="w-5 h-5 accent-indigo-600 cursor-pointer mt-1 md:mt-0 flex-shrink-0" />
            
            <div class="aspect-square md:aspect-[4/3] w-24 md:w-40 bg-slate-100 rounded-2xl border border-slate-100 overflow-hidden flex-shrink-0">
              <img :src="item.itemImage" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            
            <div class="flex-grow w-full">
              <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-1 gap-2">
                <div class="flex flex-col items-start gap-1">
                  <span class="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{{ item.orderId }}</span>
                  <h4 class="font-black text-slate-900 text-base md:text-lg leading-snug line-clamp-2 hover:text-indigo-600 cursor-pointer transition">{{ item.itemTitle }}</h4>
                </div>
                <button @click="removeFromCart(item.orderId)" class="hidden md:flex text-slate-400 hover:text-rose-500 p-2 bg-slate-50 hover:bg-rose-50 rounded-lg transition" title="ลบสินค้า">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>

              <div class="text-[11px] md:text-xs text-slate-500 font-medium mt-2 space-y-1">
                <p class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> ระยะเวลาเช่า: <span class="font-bold text-slate-700">{{ item.durationText }}</span></p>
                <p class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> รับ: {{ item.pickupDate.split(' ')[0] }} | คืน: {{ item.returnDate.split(' ')[0] }}</p>
              </div>
              
              <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <p class="text-[10px] md:text-xs font-bold text-slate-400 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  {{ item.lenderName }}
                </p>
                <div class="flex items-center gap-4">
                  <button @click="removeFromCart(item.orderId)" class="md:hidden text-[10px] font-bold text-rose-500 underline">ลบ</button>
                  <p class="text-lg md:text-xl font-black text-indigo-600">฿{{ item.totalPrice.toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- กล่องสรุปยอดรวม (Desktop) -->
        <div class="hidden lg:block lg:col-span-1">
          <div class="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-32">
            <h3 class="font-black text-xl mb-6 flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              สรุปคำสั่งเช่า
            </h3>
            
            <div class="space-y-4 text-sm font-medium text-slate-300 border-b border-slate-700 pb-6 mb-6">
              <div class="flex justify-between items-center">
                <span>ยอดรวมสินค้า ({{ selectedItems.length }} รายการ)</span>
                <span class="text-white font-bold">฿{{ subTotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span>ค่าบริการแพลตฟอร์ม</span>
                <span class="text-white font-bold">฿{{ platformFeeTotal.toLocaleString() }}</span>
              </div>
            </div>

            <div class="flex justify-between items-end mb-8">
              <span class="font-bold text-slate-400">ยอดชำระสุทธิ</span>
              <span class="text-4xl font-black text-emerald-400">฿{{ grandTotal.toLocaleString() }}</span>
            </div>
            <button @click="proceedToCheckout" :disabled="selectedItems.length === 0" class="w-full bg-indigo-600 text-white font-black py-4.5 rounded-2xl shadow-lg hover:bg-indigo-500 hover:-translate-y-1 transition duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
              ดำเนินการชำระเงิน
            </button>
            <p class="text-center text-[10px] text-slate-500 mt-4">รวมภาษีมูลค่าเพิ่ม (VAT) 7% แล้ว</p>
          </div>
        </div>
      </div>

      <!-- 🟢 STEP 2: ฟอร์มจัดส่ง และ การชำระเงิน -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 items-start">
        
        <div class="lg:col-span-2 space-y-6 md:space-y-8">
          
          <!-- ที่อยู่สำหรับรับสินค้า/จัดส่ง -->
          <div class="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
            <h3 class="font-black text-slate-800 text-xl mb-6 flex items-center gap-2">
              <span class="bg-indigo-100 text-indigo-600 p-2 rounded-xl"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></span>
              ข้อมูลผู้เช่าและสถานที่รับของ
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase mb-2">ชื่อ-นามสกุล ผู้รับ</label>
                <input v-model="deliveryForm.name" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition" placeholder="ระบุชื่อผู้รับสินค้า" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase mb-2">เบอร์โทรศัพท์ติดต่อ</label>
                <input v-model="deliveryForm.phone" type="tel" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition" placeholder="08X-XXX-XXXX" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-600 uppercase mb-2">ที่อยู่จัดส่ง / นัดรับ (โดยละเอียด)</label>
                <textarea v-model="deliveryForm.address" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition resize-none" placeholder="บ้านเลขที่, ซอย, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"></textarea>
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-600 uppercase mb-2">หมายเหตุถึงผู้ให้เช่า (ไม่บังคับ)</label>
                <input v-model="deliveryForm.note" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition" placeholder="เช่น ฝากไว้ที่ป้อมยาม, โทรหาก่อนถึง 15 นาที" />
              </div>
            </div>
          </div>

          <!-- สรุปรายการสินค้าที่สั่ง -->
          <div class="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
            <h3 class="font-black text-slate-800 text-xl mb-6 flex items-center gap-2">
              <span class="bg-emerald-100 text-emerald-600 p-2 rounded-xl"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg></span>
              สินค้าที่จะดำเนินการ ({{ selectedItems.length }})
            </h3>
            
            <div class="space-y-4">
              <div v-for="item in selectedItems" :key="'chk-'+item.orderId" class="flex gap-4 border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                <img :src="item.itemImage" class="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl border border-slate-200 bg-white" />
                <div class="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 class="font-bold text-slate-800 text-sm line-clamp-1">{{ item.itemTitle }}</h4>
                    <p class="text-[11px] text-slate-500 font-medium mt-1">{{ item.durationText }} • วันรับ: {{ item.pickupDate.split(' ')[0] }}</p>
                  </div>
                  <div class="flex justify-between items-center text-xs font-bold">
                    <span class="text-slate-400">ร้าน: {{ item.lenderName }}</span>
                    <span class="text-indigo-600 text-sm">฿{{ item.totalPrice.toLocaleString() }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-amber-50 border border-amber-200 p-4 rounded-xl text-[11px] text-amber-800 font-bold mt-6 flex items-start gap-2">
              <svg class="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              กรุณาตรวจสอบข้อมูลการรับ-ส่งสินค้าและวันที่ให้ถูกต้อง การยกเลิกหลังจากชำระเงินอาจมีค่าธรรมเนียมตามนโยบายของแพลตฟอร์ม
            </div>
          </div>

        </div>

        <!-- 💳 กล่องเลือกการชำระเงิน (Desktop) -->
        <div class="hidden lg:block lg:col-span-1">
          <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sticky top-32">
            <h3 class="font-black text-slate-900 mb-6 text-xl">วิธีชำระเงิน</h3>
            
            <div class="space-y-3 mb-8">
              <label :class="['flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition', paymentMethod === 'promptpay' ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-300']">
                <input type="radio" v-model="paymentMethod" value="promptpay" class="accent-indigo-600 w-4 h-4" />
                <span class="text-sm font-bold text-slate-800 flex-grow">สแกน QR พร้อมเพย์</span>
                <svg class="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h6v6H4V4zm2 2v2h2V6H6zm10-2h6v6h-6V4zm2 2v2h2V6h-2zM4 14h6v6H4v-6zm2 2v2h2v-2H6zm10-2h6v6h-6v-6zm2 2v2h2v-2h-2zm-4-4h2v2h-2v-2zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2z"/></svg>
              </label>
              <label :class="['flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition', paymentMethod === 'credit_card' ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-300']">
                <input type="radio" v-model="paymentMethod" value="credit_card" class="accent-indigo-600 w-4 h-4" />
                <span class="text-sm font-bold text-slate-800 flex-grow">บัตรเครดิต / เดบิต</span>
                <div class="flex gap-1"><div class="w-6 h-4 bg-rose-500 rounded-sm"></div><div class="w-6 h-4 bg-amber-500 rounded-sm"></div></div>
              </label>
            </div>

            <!-- Mockup QR / Card -->
            <div v-if="paymentMethod === 'promptpay'" class="text-center p-6 bg-slate-50 border border-slate-200 rounded-2xl mb-8 shadow-inner">
              <div class="w-32 h-32 bg-white mx-auto p-2 rounded-xl shadow-sm border border-slate-200 mb-3 flex items-center justify-center">
                <svg class="w-20 h-20 text-slate-800 opacity-20" viewBox="0 0 24 24" fill="currentColor"><path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h4v4h-4v-4zm-4 2h2v2h-2v-2z"/></svg>
              </div>
              <p class="text-xs font-bold text-slate-500">สแกนจ่ายได้ด้วยทุกแอปธนาคาร</p>
            </div>
            <div v-else class="space-y-3 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-200">
               <input type="text" placeholder="หมายเลขบัตร 16 หลัก" class="w-full text-xs font-bold p-3 rounded-xl border border-slate-200 outline-none" />
               <div class="flex gap-2">
                 <input type="text" placeholder="MM/YY" class="w-1/2 text-xs font-bold p-3 rounded-xl border border-slate-200 outline-none" />
                 <input type="text" placeholder="CVC" class="w-1/2 text-xs font-bold p-3 rounded-xl border border-slate-200 outline-none" />
               </div>
            </div>

            <div class="border-t border-slate-200 pt-6 space-y-3 mb-6 text-sm font-bold text-slate-500">
               <div class="flex justify-between"><span>รวมราคาสินค้า</span><span>฿{{ subTotal.toLocaleString() }}</span></div>
               <div class="flex justify-between"><span>ค่าแพลตฟอร์ม</span><span>฿{{ platformFeeTotal.toLocaleString() }}</span></div>
               <div class="flex justify-between items-end pt-3 text-slate-900"><span>ยอดชำระสุทธิ</span><span class="text-3xl font-black text-indigo-600">฿{{ grandTotal.toLocaleString() }}</span></div>
            </div>

            <button @click="handlePayNow" :disabled="isProcessing" class="w-full bg-slate-900 text-white font-black py-4.5 rounded-2xl shadow-xl hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition duration-300 disabled:opacity-75 flex justify-center items-center gap-2">
              <svg v-if="isProcessing" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isProcessing ? 'ระบบกำลังดำเนินการ...' : 'ยืนยันชำระเงิน' }}
            </button>
          </div>
        </div>

      </div>
    </div>
    
    <!-- 📱 Mobile Floating Bottom Bar -->
    <div v-if="cartItems.length > 0" class="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-5 py-4 flex justify-between items-center z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] pb-safe transition-transform duration-300">
      <div>
        <p class="text-xs font-bold text-slate-500 mb-0.5">ยอดรวม ({{ selectedItems.length }} รายการ)</p>
        <p class="text-xl md:text-2xl font-black text-slate-900">
          ฿{{ grandTotal.toLocaleString() }}
        </p>
      </div>
      <button v-if="!isCheckoutStep" @click="proceedToCheckout" :disabled="selectedItems.length === 0" class="bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-lg disabled:opacity-50">
        ชำระเงิน
      </button>
      <button v-else @click="handlePayNow" :disabled="isProcessing" class="bg-slate-900 text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-lg shadow-slate-300 disabled:opacity-75 flex items-center gap-2">
         <svg v-if="isProcessing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        {{ isProcessing ? 'รอสักครู่...' : 'ยืนยันสั่งเช่า' }}
      </button>
    </div>

  </div>
</template>

<style scoped>
.pb-safe { padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem); }
</style>