<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useItems } from '@/composables/useItems'

const route = useRoute()
const router = useRouter()
const { currentItem: item, fetchItemById, isLoading } = useItems() 

const rentalMode = ref('daily') 
const rentalDays = ref(1)
const rentalHours = ref(3) 
const isAddingToCart = ref(false)

// 🛡️ ข้อมูลสำรอง (Fallback) กรณีที่ฐานข้อมูลไม่มี features ใส่ไว้
const defaultFeatures = [
  { icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>', name: 'รับประกันคุณภาพ 100%' },
  { icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>', name: 'ตรวจสอบสภาพก่อนส่งมอบ' }
]

// 🗓️ ระบบคำนวณวันที่
const startDateObj = new Date()
startDateObj.setDate(startDateObj.getDate() + 1)
startDateObj.setHours(10, 0, 0, 0)

const formatDate = (date) => {
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
}

const startDisplay = computed(() => formatDate(startDateObj))

const endDisplay = computed(() => {
  const endDateObj = new Date(startDateObj)
  if (rentalMode.value === 'daily') {
    endDateObj.setDate(endDateObj.getDate() + parseInt(rentalDays.value))
  } else {
    endDateObj.setHours(endDateObj.getHours() + parseInt(rentalHours.value))
  }
  return formatDate(endDateObj)
})

// 🧮 คำนวณราคา
const calculateTotal = computed(() => {
  if (!item.value) return 0
  return rentalMode.value === 'daily' 
    ? item.value.price_daily * rentalDays.value 
    : item.value.price_hourly * rentalHours.value
})

const platformFee = 150
const netPrice = computed(() => calculateTotal.value + platformFee)

onMounted(async () => {
  window.scrollTo(0, 0)
  if (route.params.id) {
    await fetchItemById(route.params.id) 
  }
})

// 🛒 ฟังก์ชันบันทึกเข้า Cart
const executeAddToCart = () => {
  if (!item.value) return
  isAddingToCart.value = true
  setTimeout(() => {
    const newCartOrder = {
      orderId: 'RN-' + Math.floor(100000 + Math.random() * 900000),
      itemId: item.value.id,
      itemTitle: item.value.title,
      itemImage: item.value.images && item.value.images.length > 0 ? item.value.images[0] : 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
      lenderName: item.value.lender?.first_name || 'ผู้ให้เช่า',
      mode: rentalMode.value,
      duration: rentalMode.value === 'daily' ? rentalDays.value : rentalHours.value,
      durationText: rentalMode.value === 'daily' ? `${rentalDays.value} วัน` : `${rentalHours.value} ชม.`,
      startDateISO: startDateObj.toISOString(), 
      endDateISO: rentalMode.value === 'daily' 
        ? new Date(startDateObj.getTime() + rentalDays.value * 86400000).toISOString() 
        : new Date(startDateObj.getTime() + rentalHours.value * 3600000).toISOString(),
      pickupDate: startDisplay.value, 
      returnDate: endDisplay.value,
      netPrice: netPrice.value,
      totalPrice: netPrice.value
    }

    const currentCart = JSON.parse(localStorage.getItem('rentall_cart') || '[]')
    currentCart.push(newCartOrder)
    localStorage.setItem('rentall_cart', JSON.stringify(currentCart))

    isAddingToCart.value = false
    router.push('/cart')
  }, 600)
}
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen font-sans pb-32">
    
    <!-- ⏳ ถ้ากำลังโหลด -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[70vh] text-slate-400">
       <svg class="animate-spin h-10 w-10 mb-4 text-indigo-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
       <p class="font-bold">กำลังโหลดข้อมูลสินค้า...</p>
    </div>

    <!-- ❌ ถ้าไม่พบสินค้า -->
    <div v-else-if="!item" class="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
       <div class="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
       </div>
       <h2 class="text-2xl font-black text-slate-800 mb-2">ไม่พบสินค้านี้</h2>
       <p class="text-slate-500 mb-6 font-medium">สินค้าอาจถูกลบหรือหยุดการให้เช่าชั่วคราว</p>
       <button @click="router.push('/search')" class="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl shadow-md">กลับไปหน้าค้นหาสินค้า</button>
    </div>

    <!-- 🟢 ถ้ามีข้อมูลสินค้า -->
    <div v-else class="max-w-[1200px] mx-auto px-4 md:px-10 py-8">
      
      <h1 class="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-4">{{ item.title }}</h1>
      <p class="text-slate-500 font-bold mb-8 flex items-center gap-1">
        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        {{ item.location }}
      </p>

      <div class="aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden mb-10 shadow-sm border border-slate-200 bg-slate-100">
        <img :src="item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200'" class="w-full h-full object-cover" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <!-- ฝั่งซ้าย (รายละเอียด) -->
        <div class="lg:col-span-2 space-y-8">
          <div class="flex items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <img :src="item.lender?.avatar_url || 'https://ui-avatars.com/api/?name=Lender'" class="w-14 h-14 rounded-full border border-slate-200 object-cover" />
            <div>
              <h3 class="font-black text-slate-900 text-base md:text-lg">ปล่อยเช่าโดยคุณ {{ item.lender?.first_name || 'ผู้ให้เช่าใจดี' }}</h3>
              <p class="text-xs text-slate-500 font-medium mt-1">ผู้ให้เช่าที่ผ่านการตรวจสอบยืนยันตัวตนแล้ว</p>
            </div>
          </div>

          <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 class="text-xl font-black text-slate-800">รายละเอียดสินค้า</h3>
            <p class="text-slate-600 font-medium leading-relaxed">{{ item.description || 'ไม่มีรายละเอียดเพิ่มเติม' }}</p>
          </div>

          <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 class="text-xl font-black text-slate-800 mb-6">คุณสมบัติเด่น</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
              <div v-for="(feat, index) in (item.features && item.features.length > 0 ? item.features : defaultFeatures)" :key="index" class="flex items-center gap-3 text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div class="text-indigo-600 bg-white p-2 rounded-xl shadow-sm" v-html="feat.icon || defaultFeatures[0].icon"></div>
                <span class="font-bold text-sm">{{ feat.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ฝั่งขวา (วิดเจ็ตจอง) -->
        <div class="lg:col-span-1 relative">
          <div class="sticky top-28 bg-white rounded-3xl border border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-6 md:p-7 space-y-6">
            
            <div class="flex items-end gap-1.5">
              <span class="text-3xl font-black text-slate-900">฿{{ (rentalMode === 'daily' ? (item.price_daily || 0) : (item.price_hourly || 0)).toLocaleString() }}</span>
              <span class="text-slate-500 font-bold text-sm">/ {{ rentalMode === 'daily' ? 'วัน' : 'ชม.' }}</span>
            </div>

            <div class="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button @click="rentalMode = 'daily'" :class="['flex-1 py-2.5 text-xs font-bold rounded-xl transition', rentalMode==='daily' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700']">รายวัน</button>
              <button @click="rentalMode = 'hourly'" :class="['flex-1 py-2.5 text-xs font-bold rounded-xl transition', rentalMode==='hourly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700']">รายชั่วโมง</button>
            </div>

            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <p class="font-bold text-slate-500 mb-2">รับ: <span class="text-slate-900 ml-1">{{ startDisplay }}</span></p>
              <p class="font-bold text-indigo-500 border-t border-slate-200 pt-2">คืน: <span class="text-indigo-700 ml-1">{{ endDisplay }}</span></p>
            </div>

            <div>
              <div class="flex justify-between items-center mb-3">
                <span class="text-xs font-bold text-slate-600">ระยะเวลา</span>
                <span class="text-sm font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">{{ rentalMode === 'daily' ? `${rentalDays} วัน` : `${rentalHours} ชม.` }}</span>
              </div>
              <input v-if="rentalMode === 'daily'" type="range" v-model.number="rentalDays" min="1" max="30" class="w-full accent-indigo-600 cursor-pointer" />
              <input v-else type="range" v-model.number="rentalHours" min="1" max="24" class="w-full accent-indigo-600 cursor-pointer" />
            </div>

            <div class="pt-4 border-t border-slate-100 space-y-2 text-xs font-bold text-slate-600">
              <div class="flex justify-between">
                <span>ค่าเช่าสุทธิ</span>
                <span>฿{{ calculateTotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span>ค่าบริการแพลตฟอร์ม</span>
                <span>฿{{ platformFee }}</span>
              </div>
              <div class="flex justify-between items-center text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>ยอดชำระสุทธิ</span>
                <span class="text-xl text-indigo-600">฿{{ netPrice.toLocaleString() }}</span>
              </div>
            </div>

            <button @click="executeAddToCart" :disabled="isAddingToCart" class="w-full bg-slate-900 text-white font-black py-4.5 rounded-2xl shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition disabled:opacity-75 disabled:hover:translate-y-0 flex items-center justify-center gap-2">
              <svg v-if="isAddingToCart" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isAddingToCart ? 'กำลังเพิ่ม...' : 'เพิ่มลงตะกร้า' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 📱 Mobile Floating Booking Bar -->
    <div v-if="!isLoading && item" class="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-5 py-4 flex justify-between items-center z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] pb-safe">
      <div>
        <p class="text-xl font-black text-slate-900">
          ฿{{ netPrice.toLocaleString() }} <span class="text-[10px] text-slate-500 font-medium uppercase">สุทธิ</span>
        </p>
        <p class="text-[11px] font-bold text-indigo-600 mt-0.5">
          {{ rentalMode === 'daily' ? `เช่า ${rentalDays} วัน` : `เช่า ${rentalHours} ชั่วโมง` }}
        </p>
      </div>
      <button @click="executeAddToCart" :disabled="isAddingToCart" class="bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-lg shadow-indigo-200">
        {{ isAddingToCart ? 'รอสักครู่...' : 'เพิ่มลงตะกร้า' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.pb-safe { padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem); }
</style>