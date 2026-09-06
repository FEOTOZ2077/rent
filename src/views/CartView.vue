<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth, supabase } from '@/composables/useAuth'
import { useBookings } from '@/composables/useBookings'

const router = useRouter()
const { user } = useAuth()
const { createBooking } = useBookings()

// 📦 State ของตะกร้า
const cartItems = ref([])
const selectedOrderIds = ref([]) 

// 🟢 โหมดและสถานะหน้าจอ
const isCheckoutStep = ref(false)
const paymentMethod = ref('promptpay') 
const isProcessing = ref(false)

// 📍 ข้อมูลที่อยู่จัดส่ง
const deliveryForm = ref({
  name: '',
  phone: '',
  address: '',
  note: ''
})

onMounted(async () => {
  window.scrollTo(0, 0)
  // โหลดตะกร้าจาก LocalStorage
  cartItems.value = JSON.parse(localStorage.getItem('rentall_cart') || '[]')
  selectedOrderIds.value = cartItems.value.map(item => item.orderId)
  
  // โหลดข้อมูล Profile มาใส่ฟอร์มที่อยู่
  if (user.id) {
    const { data } = await supabase.from('profiles').select('first_name, last_name, phone, address').eq('id', user.id).single()
    if (data) {
      deliveryForm.value.name = `${data.first_name || ''} ${data.last_name || ''}`.trim() || user.name
      deliveryForm.value.phone = data.phone || ''
      deliveryForm.value.address = data.address || ''
    }
  }
})

// 🗑️ ลบสินค้า
const removeFromCart = (orderId) => {
  if (confirm('คุณต้องการลบสินค้านี้ออกจากตะกร้าใช่หรือไม่?')) {
    cartItems.value = cartItems.value.filter(item => item.orderId !== orderId)
    selectedOrderIds.value = selectedOrderIds.value.filter(id => id !== orderId)
    localStorage.setItem('rentall_cart', JSON.stringify(cartItems.value))
    
    // ถ้ายกเลิกจนหมดตะกร้า ให้กลับไป Step 1
    if (cartItems.value.length === 0) isCheckoutStep.value = false
  }
}

// ✅ ระบบ Checkbox เลือกทั้งหมดแบบอัจฉริยะ
const isAllSelected = computed({
  get: () => cartItems.value.length > 0 && selectedOrderIds.value.length === cartItems.value.length,
  set: (val) => {
    selectedOrderIds.value = val ? cartItems.value.map(item => item.orderId) : []
  }
})

// 🧮 คำนวณยอดเงิน (เฉพาะชิ้นที่เลือก)
const selectedItems = computed(() => cartItems.value.filter(item => selectedOrderIds.value.includes(item.orderId)))
const subTotal = computed(() => selectedItems.value.reduce((sum, item) => sum + (item.totalPrice - 150), 0)) 
const platformFeeTotal = computed(() => selectedItems.value.length * 150)
const grandTotal = computed(() => subTotal.value + platformFeeTotal.value)

// ➡️ ไปหน้าชำระเงิน
const proceedToCheckout = () => {
  if (selectedItems.value.length === 0) return alert('กรุณาเลือกสินค้าที่ต้องการชำระเงินอย่างน้อย 1 รายการ')
  if (!user.id) return router.push('/auth')
  isCheckoutStep.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ⬅️ กลับไปตะกร้า
const goBackToCart = () => {
  isCheckoutStep.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 💳 ยืนยันชำระเงิน
const handlePayNow = async () => {
  if (!deliveryForm.value.name || !deliveryForm.value.phone || !deliveryForm.value.address) {
    return alert('กรุณากรอกชื่อ เบอร์โทรศัพท์ และที่อยู่จัดส่งให้ครบถ้วน')
  }

  isProcessing.value = true
  try {
    // 1. อัปเดตข้อมูล Profile
    await supabase.from('profiles').update({
      first_name: deliveryForm.value.name.split(' ')[0],
      last_name: deliveryForm.value.name.split(' ').slice(1).join(' ') || '',
      phone: deliveryForm.value.phone,
      address: deliveryForm.value.address
    }).eq('id', user.id)

    // 2. สร้างใบสั่งเช่าเข้า DB
    await createBooking(user.id, selectedItems.value)
    
    // 3. เคลียร์เฉพาะของที่จ่ายแล้วออกจากตะกร้า
    const remainingItems = cartItems.value.filter(item => !selectedOrderIds.value.includes(item.orderId))
    localStorage.setItem('rentall_cart', JSON.stringify(remainingItems))
    cartItems.value = remainingItems
    selectedOrderIds.value = remainingItems.map(item => item.orderId)
    
    alert('✅ ทำรายการสำเร็จ! การชำระเงินและการจองของคุณเรียบร้อยแล้ว')
    router.push('/contract')
  } catch (error) {
    alert('❌ เกิดข้อผิดพลาด: ' + error.message)
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <!-- pb-32 เพื่อเผื่อพื้นที่ให้ Floating Bar ในมือถือ ไม่ให้บังเนื้อหา -->
  <div class="bg-[#F8FAFC] min-h-screen font-sans pb-32 lg:pb-16 relative">
    
    <!-- 🟢 Header Progress Bar -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm pt-4 md:pt-6 pb-3 md:pb-4">
      <div class="max-w-[1200px] mx-auto px-4 md:px-10 flex items-center justify-between">
        <div class="flex items-center gap-3 md:gap-4">
          <button v-if="isCheckoutStep" @click="goBackToCart" class="p-1.5 md:p-2 bg-slate-50 text-slate-500 rounded-full hover:bg-slate-200 hover:text-slate-800 transition">
            <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 class="text-xl md:text-3xl font-black text-slate-900 tracking-tight">{{ isCheckoutStep ? 'การจัดส่ง & ชำระเงิน' : 'ตะกร้าของคุณ' }}</h1>
            <p v-if="!isCheckoutStep" class="text-[10px] md:text-xs font-bold text-slate-400 mt-0.5 md:mt-1">มีสินค้าทั้งหมด {{ cartItems.length }} รายการ</p>
          </div>
        </div>

        <!-- Step Indicator (เฉพาะ Desktop) -->
        <div class="hidden md:flex items-center gap-4 text-sm font-bold">
          <div :class="['flex items-center gap-2', !isCheckoutStep ? 'text-indigo-600' : 'text-emerald-500']">
            <div :class="['w-7 h-7 rounded-full flex items-center justify-center text-white', !isCheckoutStep ? 'bg-indigo-600' : 'bg-emerald-500']">
               <span v-if="!isCheckoutStep">1</span>
               <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <span>รถเข็น</span>
          </div>
          <div class="w-10 h-0.5 bg-slate-200"></div>
          <div :class="['flex items-center gap-2', isCheckoutStep ? 'text-indigo-600' : 'text-slate-400']">
            <div :class="['w-7 h-7 rounded-full flex items-center justify-center text-white', isCheckoutStep ? 'bg-indigo-600' : 'bg-slate-300']">2</div>
            <span>ชำระเงิน</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-[1200px] mx-auto px-4 md:px-10 py-6 md:py-8">

      <!-- 🔴 Empty Cart -->
      <div v-if="cartItems.length === 0" class="bg-white rounded-[2rem] py-16 md:py-24 px-6 text-center border border-slate-200 shadow-sm max-w-2xl mx-auto mt-6 md:mt-10">
        <div class="w-20 h-20 md:w-28 md:h-28 bg-slate-50 text-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 md:w-14 md:h-14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        </div>
        <h3 class="text-xl md:text-3xl font-black text-slate-800 mb-2 md:mb-3">ตะกร้าของคุณว่างเปล่า</h3>
        <p class="text-xs md:text-base text-slate-500 font-medium mb-8">คุณยังไม่ได้เลือกสินค้าใดๆ ลงในตะกร้า ลองค้นหาสิ่งที่คุณสนใจได้เลย</p>
        <button @click="router.push('/search')" class="bg-indigo-600 text-white font-bold px-10 py-4 rounded-xl md:rounded-2xl text-sm md:text-base shadow-lg hover:bg-indigo-700 transition w-full md:w-auto">ค้นหาสินค้าเพื่อเช่า</button>
      </div>

      <!-- 🟢 STEP 1: Cart Items -->
      <div v-else-if="!isCheckoutStep" class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        
        <div class="lg:col-span-2 space-y-4">
          <!-- Select All -->
          <div class="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <label class="flex items-center gap-3 cursor-pointer w-full group">
              <input type="checkbox" v-model="isAllSelected" class="w-5 h-5 accent-indigo-600 rounded flex-shrink-0 cursor-pointer" />
              <span class="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition select-none">เลือกทั้งหมด ({{ cartItems.length }} รายการ)</span>
            </label>
            <button v-if="selectedOrderIds.length > 0" @click="selectedOrderIds = []" class="text-xs font-bold text-slate-400 hover:text-slate-600 whitespace-nowrap">ยกเลิกการเลือก</button>
          </div>

          <!-- Items List -->
          <div v-for="item in cartItems" :key="item.orderId" class="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-slate-200 shadow-[0_4px_15px_rgb(0,0,0,0.02)] flex gap-3 md:gap-6 items-start transition relative hover:border-indigo-100 hover:shadow-md">
            
            <input type="checkbox" :value="item.orderId" v-model="selectedOrderIds" class="w-5 h-5 md:mt-8 accent-indigo-600 cursor-pointer flex-shrink-0" />
            
            <div class="aspect-square w-20 md:w-32 lg:w-40 bg-slate-100 rounded-xl md:rounded-2xl border border-slate-100 overflow-hidden flex-shrink-0 cursor-pointer" @click="router.push(`/item/${item.itemId}`)">
              <img :src="item.itemImage" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
            </div>
            
            <div class="flex-grow flex flex-col justify-between min-h-[5rem] md:min-h-full w-full overflow-hidden">
              <div>
                <div class="flex justify-between items-start mb-1 md:mb-2">
                  <span class="text-[9px] md:text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 md:px-2 py-0.5 rounded border border-indigo-100">{{ item.orderId }}</span>
                  <button @click="removeFromCart(item.orderId)" class="hidden md:flex items-center justify-center text-slate-400 hover:text-rose-500 w-8 h-8 hover:bg-rose-50 rounded-lg transition" title="ลบสินค้า">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
                <h4 @click="router.push(`/item/${item.itemId}`)" class="font-black text-slate-900 text-sm md:text-lg leading-tight md:leading-snug line-clamp-2 hover:text-indigo-600 cursor-pointer transition">{{ item.itemTitle }}</h4>
                
                <div class="text-[10px] md:text-xs text-slate-500 font-medium mt-1.5 md:mt-2 space-y-0.5 md:space-y-1">
                  <p>ระยะเวลา: <span class="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{{ item.durationText }}</span></p>
                  <p class="truncate">รับ: {{ item.pickupDate.split(' ')[0] }} | คืน: {{ item.returnDate.split(' ')[0] }}</p>
                </div>
              </div>
              
              <div class="mt-3 pt-3 md:mt-4 md:pt-4 border-t border-slate-100 flex justify-between items-center">
                <p class="hidden sm:flex text-[10px] md:text-xs font-bold text-slate-400 items-center gap-1.5 truncate max-w-[50%]">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> 
                  <span class="truncate">{{ item.lenderName }}</span>
                </p>
                <div class="w-full sm:w-auto flex justify-between sm:justify-end items-center gap-4">
                  <button @click="removeFromCart(item.orderId)" class="md:hidden text-[10px] font-bold text-rose-500 underline py-1">ลบรายการ</button>
                  <p class="text-base md:text-xl font-black text-indigo-600">฿{{ item.totalPrice.toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 💰 กล่องสรุปยอดรวม (Desktop) -->
        <div class="hidden lg:block lg:col-span-1">
          <div class="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl sticky top-32">
            <h3 class="font-black text-xl mb-6 flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              สรุปคำสั่งเช่า
            </h3>
            <div class="space-y-4 text-sm font-medium text-slate-300 border-b border-slate-700 pb-6 mb-6">
              <div class="flex justify-between items-center">
                <span>ยอดรวม ({{ selectedItems.length }} ชิ้น)</span>
                <span class="text-white font-bold">฿{{ subTotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span>ค่าบริการแพลตฟอร์ม</span>
                <span class="text-white font-bold">฿{{ platformFeeTotal.toLocaleString() }}</span>
              </div>
            </div>
            <div class="flex justify-between items-end mb-8">
              <span class="font-bold text-slate-400 text-sm">ยอดชำระสุทธิ</span>
              <span class="text-4xl font-black text-emerald-400">฿{{ grandTotal.toLocaleString() }}</span>
            </div>
            <button @click="proceedToCheckout" :disabled="selectedItems.length === 0" class="w-full bg-indigo-600 text-white font-black py-4.5 rounded-2xl shadow-lg hover:bg-indigo-500 hover:-translate-y-1 transition duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
              ดำเนินการชำระเงิน
            </button>
            <p class="text-center text-[10px] text-slate-500 mt-4">รวมภาษีมูลค่าเพิ่ม (VAT) 7% แล้ว</p>
          </div>
        </div>
      </div>

      <!-- 🟢 STEP 2: ฟอร์มจัดส่ง & ชำระเงิน -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 items-start">
        
        <div class="lg:col-span-2 space-y-6 md:space-y-8">
          
          <!-- ฟอร์มข้อมูลการจัดส่ง -->
          <div class="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 class="font-black text-slate-800 text-lg md:text-xl mb-5 md:mb-6 flex items-center gap-2">
              <span class="bg-indigo-100 text-indigo-600 p-1.5 md:p-2 rounded-lg md:rounded-xl"><svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></span>
              ข้อมูลผู้รับและสถานที่
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div>
                <label class="block text-[10px] md:text-xs font-bold text-slate-600 uppercase mb-1.5 md:mb-2">ชื่อ-นามสกุล ผู้รับ <span class="text-rose-500">*</span></label>
                <input v-model="deliveryForm.name" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:bg-white focus:border-indigo-600 transition" placeholder="ระบุชื่อผู้รับสินค้า" />
              </div>
              <div>
                <label class="block text-[10px] md:text-xs font-bold text-slate-600 uppercase mb-1.5 md:mb-2">เบอร์โทรศัพท์ <span class="text-rose-500">*</span></label>
                <input v-model="deliveryForm.phone" type="tel" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:bg-white focus:border-indigo-600 transition" placeholder="08X-XXX-XXXX" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-[10px] md:text-xs font-bold text-slate-600 uppercase mb-1.5 md:mb-2">ที่อยู่จัดส่ง / นัดรับ (โดยละเอียด) <span class="text-rose-500">*</span></label>
                <textarea v-model="deliveryForm.address" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:bg-white focus:border-indigo-600 transition resize-none" placeholder="บ้านเลขที่, ซอย, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"></textarea>
              </div>
              <div class="md:col-span-2">
                <label class="block text-[10px] md:text-xs font-bold text-slate-600 uppercase mb-1.5 md:mb-2">หมายเหตุถึงร้านค้า (ไม่บังคับ)</label>
                <input v-model="deliveryForm.note" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:bg-white focus:border-indigo-600 transition" placeholder="เช่น ฝากไว้ที่ป้อมยาม, โทรหาก่อนถึง 15 นาที" />
              </div>
            </div>
          </div>

          <!-- สินค้าทบทวน -->
          <div class="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 class="font-black text-slate-800 text-lg md:text-xl mb-4 md:mb-6 flex items-center gap-2">
              <span class="bg-emerald-100 text-emerald-600 p-1.5 md:p-2 rounded-lg md:rounded-xl"><svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg></span>
              สินค้าที่จะดำเนินการ ({{ selectedItems.length }})
            </h3>
            
            <div class="space-y-3">
              <div v-for="item in selectedItems" :key="'chk-'+item.orderId" class="flex gap-3 border border-slate-100 rounded-xl md:rounded-2xl p-3 md:p-4 bg-slate-50/50">
                <img :src="item.itemImage" class="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg md:rounded-xl border border-slate-200 bg-white" />
                <div class="flex-grow flex flex-col justify-center">
                  <h4 class="font-bold text-slate-800 text-xs md:text-sm line-clamp-2 md:line-clamp-1 leading-snug">{{ item.itemTitle }}</h4>
                  <div class="flex justify-between items-end md:items-center mt-2">
                    <span class="text-[10px] md:text-xs text-slate-500 font-medium bg-white px-2 py-0.5 rounded border border-slate-100">{{ item.durationText }}</span>
                    <span class="text-indigo-600 font-black text-sm md:text-base">฿{{ item.totalPrice.toLocaleString() }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-amber-50 border border-amber-200 p-4 rounded-xl text-[10px] md:text-[11px] text-amber-800 font-bold mt-6 flex items-start gap-2">
              <svg class="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              กรุณาตรวจสอบข้อมูลการรับ-ส่งสินค้าให้ถูกต้อง การยกเลิกหลังจากชำระเงินอาจมีค่าธรรมเนียมตามนโยบายของแพลตฟอร์ม
            </div>
          </div>

        </div>

        <!-- 💳 วิธีการชำระเงิน (Desktop) -->
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

            <!-- Payment Mockup Visuals -->
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
               <div class="flex justify-between"><span>ราคาสินค้ารวม</span><span>฿{{ subTotal.toLocaleString() }}</span></div>
               <div class="flex justify-between"><span>ค่าแพลตฟอร์ม</span><span>฿{{ platformFeeTotal.toLocaleString() }}</span></div>
               <div class="flex justify-between items-end pt-3 text-slate-900 border-t border-slate-100 mt-2"><span>ยอดชำระสุทธิ</span><span class="text-3xl font-black text-indigo-600">฿{{ grandTotal.toLocaleString() }}</span></div>
            </div>

            <button @click="handlePayNow" :disabled="isProcessing" class="w-full bg-slate-900 text-white font-black py-4.5 rounded-2xl shadow-xl hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition duration-300 disabled:opacity-75 flex justify-center items-center gap-2">
              <svg v-if="isProcessing" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isProcessing ? 'ระบบกำลังดำเนินการ...' : 'ยืนยันชำระเงิน' }}
            </button>
          </div>
        </div>

      </div>
    </div>
    
    <!-- 📱 Mobile Floating Bottom Bar อัจฉริยะ -->
    <div v-if="cartItems.length > 0" class="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-4 md:px-5 py-3 md:py-4 flex justify-between items-center z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] pb-safe transition-transform duration-300">
      <div class="flex flex-col justify-center">
        <p class="text-[10px] md:text-xs font-bold text-slate-500 mb-0.5">ยอดสุทธิ ({{ selectedItems.length }} ชิ้น)</p>
        <p class="text-lg md:text-xl font-black text-slate-900 leading-none">
          ฿{{ grandTotal.toLocaleString() }}
        </p>
      </div>
      
      <!-- ปุ่มสลับตาม Step -->
      <button v-if="!isCheckoutStep" @click="proceedToCheckout" :disabled="selectedItems.length === 0" class="bg-indigo-600 text-white font-bold px-6 md:px-8 py-3 rounded-xl text-xs md:text-sm shadow-md disabled:opacity-50 transition active:scale-95">
        ชำระเงิน
      </button>
      <button v-else @click="handlePayNow" :disabled="isProcessing" class="bg-slate-900 text-white font-bold px-5 md:px-6 py-3 rounded-xl text-xs md:text-sm shadow-md disabled:opacity-75 flex items-center gap-1.5 transition active:scale-95">
         <svg v-if="isProcessing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        {{ isProcessing ? 'รอสักครู่...' : 'ยืนยันสั่งเช่า' }}
      </button>
    </div>

  </div>
</template>

<style scoped>
.pb-safe { padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 4.5rem); }
</style>