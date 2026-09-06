<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useItems } from '@/composables/useItems'

const route = useRoute()
const router = useRouter()
const { currentItem: item, fetchItemById, isLoading } = useItems() 

// 🎯 ระบบจัดการโหมดเช่า (ชั่วโมง, วัน, เดือน, ปี)
const rentalMode = ref('daily') 
const durationValue = ref(1) // ใช้ตัวแปรเดียวเก็บระยะเวลา
const isAddingToCart = ref(false)
const selectedImage = ref('')

// รีเซ็ตระยะเวลาเมื่อเปลี่ยนโหมด
watch(rentalMode, () => {
  durationValue.value = 1
})

// 🛡️ ข้อมูลสำรอง (Fallback)
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
  if (rentalMode.value === 'hourly') endDateObj.setHours(endDateObj.getHours() + durationValue.value)
  else if (rentalMode.value === 'daily') endDateObj.setDate(endDateObj.getDate() + durationValue.value)
  else if (rentalMode.value === 'monthly') endDateObj.setMonth(endDateObj.getMonth() + durationValue.value)
  else if (rentalMode.value === 'yearly') endDateObj.setFullYear(endDateObj.getFullYear() + durationValue.value)
  return formatDate(endDateObj)
})

// 🧮 คำนวณราคาและส่วนลดอัจฉริยะ
const pricing = computed(() => {
  if (!item.value) return { unit: 0, originalTotal: 0, discount: 0, net: 0, label: 'วัน' }
  
  let unitPrice = 0
  let originalUnit = 0
  let label = 'วัน'

  if (rentalMode.value === 'hourly') {
    unitPrice = item.value.price_hourly || Math.round(item.value.price_daily / 8)
    originalUnit = unitPrice
    label = 'ชม.'
  } else if (rentalMode.value === 'daily') {
    unitPrice = item.value.price_daily
    originalUnit = unitPrice
    label = 'วัน'
  } else if (rentalMode.value === 'monthly') {
    originalUnit = item.value.price_daily * 30
    unitPrice = originalUnit * 0.90 // ลด 10% เมื่อเช่ารายเดือน
    label = 'เดือน'
  } else if (rentalMode.value === 'yearly') {
    originalUnit = item.value.price_daily * 365
    unitPrice = originalUnit * 0.75 // ลด 25% เมื่อเช่ารายปี
    label = 'ปี'
  }

  const originalTotal = originalUnit * durationValue.value
  const netTotal = unitPrice * durationValue.value
  
  return {
    unit: unitPrice,
    originalTotal: originalTotal,
    discount: originalTotal - netTotal,
    net: netTotal,
    label: label
  }
})

const platformFee = 150
const grandTotal = computed(() => pricing.value.net + platformFee)

onMounted(async () => {
  window.scrollTo(0, 0)
  if (route.params.id) {
    await fetchItemById(route.params.id) 
    if (item.value?.images?.length > 0) {
      selectedImage.value = item.value.images[0]
    }
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
      itemImage: selectedImage.value || 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
      lenderName: item.value.lender?.first_name || 'ผู้ให้เช่า',
      mode: rentalMode.value,
      duration: durationValue.value,
      durationText: `${durationValue.value} ${pricing.value.label}`,
      startDateISO: startDateObj.toISOString(), 
      endDateISO: new Date(startDateObj.getTime() + (pricing.value.net * 1000)).toISOString(), // Mock ISO สำหรับตัวอย่าง
      pickupDate: startDisplay.value, 
      returnDate: endDisplay.value,
      netPrice: grandTotal.value,
      totalPrice: grandTotal.value
    }

    const currentCart = JSON.parse(localStorage.getItem('rentall_cart') || '[]')
    currentCart.push(newCartOrder)
    localStorage.setItem('rentall_cart', JSON.stringify(currentCart))

    isAddingToCart.value = false
    router.push('/cart')
  }, 800)
}
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen font-sans pb-32">
    
    <!-- ⏳ สถานะกำลังโหลด -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[70vh] text-slate-400">
       <svg class="animate-spin h-10 w-10 mb-4 text-indigo-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
       <p class="font-bold">กำลังโหลดข้อมูลสินค้าแบบจัดเต็ม...</p>
    </div>

    <!-- ❌ ไม่พบสินค้า -->
    <div v-else-if="!item" class="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
       <div class="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
       </div>
       <h2 class="text-2xl font-black text-slate-800 mb-2">ไม่พบสินค้านี้</h2>
       <p class="text-slate-500 mb-6 font-medium">สินค้าอาจถูกลบหรือหยุดการให้เช่าชั่วคราว</p>
       <button @click="router.push('/search')" class="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition">กลับไปหน้าค้นหาสินค้า</button>
    </div>

    <!-- 🟢 มีข้อมูลสินค้า -->
    <div v-else class="max-w-[1300px] mx-auto px-4 md:px-10 py-8">
      
      <!-- Breadcrumb -->
      <div class="text-[11px] md:text-xs font-bold text-slate-400 mb-6 flex items-center gap-2">
        <RouterLink to="/" class="hover:text-indigo-600 transition">หน้าแรก</RouterLink>
        <span>/</span>
        <RouterLink :to="`/search?category=${item.category}`" class="hover:text-indigo-600 transition">{{ item.category }}</RouterLink>
        <span>/</span>
        <span class="text-slate-600">{{ item.title }}</span>
      </div>

      <!-- หัวข้อสินค้า -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h1 class="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-3">{{ item.title }}</h1>
          <div class="flex flex-wrap items-center gap-3 text-xs md:text-sm font-bold">
            <span class="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100"><svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg> {{ item.rating }} ({{ item.reviews_count || 12 }} รีวิว)</span>
            <span class="flex items-center gap-1 text-slate-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg> {{ item.location }}</span>
            <span class="text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">ยืนยันตัวตนแล้ว</span>
          </div>
        </div>
      </div>

      <!-- แกลเลอรีรูปภาพ -->
      <div class="mb-10">
        <div class="aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 bg-slate-100 mb-4">
          <img :src="selectedImage" class="w-full h-full object-cover transition duration-500 hover:scale-105 cursor-zoom-in" />
        </div>
        <div class="flex gap-3 overflow-x-auto scrollbar-hide pb-2" v-if="item.images && item.images.length > 1">
          <img 
            v-for="(img, idx) in item.images" :key="idx" 
            :src="img" 
            @click="selectedImage = img"
            :class="['w-24 h-24 md:w-32 md:h-32 object-cover rounded-2xl cursor-pointer border-2 transition', selectedImage === img ? 'border-indigo-600 shadow-md' : 'border-transparent opacity-70 hover:opacity-100']" 
          />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <!-- ⬅️ ฝั่งซ้าย (รายละเอียดทั้งหมด) -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- ผู้ให้เช่า -->
          <div class="flex items-center gap-5 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
            <img :src="item.lender?.avatar_url || 'https://ui-avatars.com/api/?name=Lender'" class="w-16 h-16 rounded-full border-2 border-slate-100 object-cover shadow-sm" />
            <div class="flex-grow">
              <h3 class="font-black text-slate-900 text-lg">ปล่อยเช่าโดยคุณ {{ item.lender?.first_name || 'ผู้ให้เช่าใจดี' }}</h3>
              <p class="text-xs text-slate-500 font-bold mt-1 flex items-center gap-3">
                <span>ตอบกลับภายใน 1 ชม.</span>
                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> <span>ปล่อยเช่าสำเร็จ {{ item.lender?.rental_count || '15+' }} ครั้ง</span>
              </p>
            </div>
          </div>

          <!-- คุณสมบัติเด่น -->
          <div class="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
            <h3 class="text-xl font-black text-slate-800 mb-6">คุณสมบัติเด่น (Features)</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <div v-for="(feat, index) in (item.features && item.features.length > 0 ? item.features : defaultFeatures)" :key="index" class="flex items-center gap-4 text-slate-700">
                <div class="text-indigo-600 bg-indigo-50 p-3 rounded-2xl" v-html="feat.icon || defaultFeatures[0].icon"></div>
                <span class="font-bold text-sm">{{ feat.name }}</span>
              </div>
            </div>
          </div>

          <!-- รายละเอียดเต็ม -->
          <div class="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] space-y-4">
            <h3 class="text-xl font-black text-slate-800">รายละเอียดข้อมูลสินค้า</h3>
            <div class="text-slate-600 font-medium leading-loose text-sm whitespace-pre-line">{{ item.description || 'ไม่มีรายละเอียดเพิ่มเติมจากผู้ให้เช่า' }}</div>
          </div>

          <!-- เงื่อนไขและนโยบาย -->
          <div class="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
            <h3 class="text-xl font-black text-slate-800 mb-6">นโยบายและเงื่อนไขการเช่า</h3>
            <ul class="space-y-4 text-sm font-medium text-slate-600">
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span><strong>ยกเลิกฟรี:</strong> คุณสามารถยกเลิกการเช่าล่วงหน้าได้ฟรี 48 ชั่วโมงก่อนถึงกำหนดรับสินค้า</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <span><strong>เงินประกัน (มัดจำ):</strong> อาจมีการกันวงเงินในบัตรเครดิต 10-30% ของมูลค่าสินค้า และจะคืนให้ทันทีเมื่อส่งคืนสินค้าในสภาพเดิม</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                <span><strong>การรับประกันแพลตฟอร์ม:</strong> RentAll คุ้มครองผู้เช่าและผู้ให้เช่าด้วยระบบระงับข้อพิพาทและประกันความเสียหายวงเงินสูงสุด 100,000 บาท</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- ➡️ ฝั่งขวา (วิดเจ็ตจองแบบเลือกได้ 4 โหมด) -->
        <div class="lg:col-span-1 relative">
          <div class="sticky top-28 bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-6 md:p-8 space-y-6">
            
            <div class="flex items-end gap-1.5">
              <span class="text-4xl font-black text-slate-900">฿{{ pricing.unit.toLocaleString() }}</span>
              <span class="text-slate-500 font-bold text-base mb-1">/ {{ pricing.label }}</span>
            </div>
            
            <!-- ป้ายบอกส่วนลด (ถ้ามี) -->
            <div v-if="rentalMode === 'monthly' || rentalMode === 'yearly'" class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 inline-block animate-pulse">
              🎉 ราคานี้รวมส่วนลดพิเศษ {{ rentalMode === 'monthly' ? '10%' : '25%' }} สำหรับการเช่าระยะยาวแล้ว!
            </div>

            <!-- Tab เลือกโหมด 4 แบบ -->
            <div class="grid grid-cols-4 gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button @click="rentalMode = 'hourly'" :class="['py-2 text-[10px] md:text-xs font-bold rounded-xl transition', rentalMode==='hourly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700']">ชม.</button>
              <button @click="rentalMode = 'daily'" :class="['py-2 text-[10px] md:text-xs font-bold rounded-xl transition', rentalMode==='daily' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700']">วัน</button>
              <button @click="rentalMode = 'monthly'" :class="['py-2 text-[10px] md:text-xs font-bold rounded-xl transition', rentalMode==='monthly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700']">เดือน</button>
              <button @click="rentalMode = 'yearly'" :class="['py-2 text-[10px] md:text-xs font-bold rounded-xl transition', rentalMode==='yearly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700']">ปี</button>
            </div>

            <div class="bg-slate-50 p-4.5 rounded-2xl border border-slate-200 text-xs">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>
                <div><p class="font-bold text-slate-500 text-[10px]">วันและเวลารับของ</p><p class="font-black text-slate-800 text-sm">{{ startDisplay }}</p></div>
              </div>
              <div class="w-px h-4 bg-slate-300 ml-4 mb-3"></div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                <div><p class="font-bold text-indigo-400 text-[10px]">วันกำหนดคืน</p><p class="font-black text-indigo-700 text-sm">{{ endDisplay }}</p></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-3">
                <span class="text-xs font-bold text-slate-600">ระบุระยะเวลา</span>
                <span class="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">{{ durationValue }} {{ pricing.label }}</span>
              </div>
              <!-- อัปเดต Max ของ Slider ตามโหมด -->
              <input v-if="rentalMode === 'hourly'" type="range" v-model.number="durationValue" min="1" max="24" class="w-full accent-indigo-600 cursor-pointer" />
              <input v-else-if="rentalMode === 'daily'" type="range" v-model.number="durationValue" min="1" max="30" class="w-full accent-indigo-600 cursor-pointer" />
              <input v-else-if="rentalMode === 'monthly'" type="range" v-model.number="durationValue" min="1" max="12" class="w-full accent-indigo-600 cursor-pointer" />
              <input v-else-if="rentalMode === 'yearly'" type="range" v-model.number="durationValue" min="1" max="5" class="w-full accent-indigo-600 cursor-pointer" />
            </div>

            <div class="pt-5 border-t border-slate-100 space-y-3 text-xs font-bold text-slate-600">
              <div class="flex justify-between items-center">
                <span>ค่าเช่าสุทธิ ({{ durationValue }} {{ pricing.label }})</span>
                <span :class="{'line-through text-slate-400 font-medium': pricing.discount > 0}">฿{{ pricing.originalTotal.toLocaleString() }}</span>
              </div>
              <div v-if="pricing.discount > 0" class="flex justify-between items-center text-emerald-600">
                <span>ส่วนลดแพ็กเกจระยะยาว</span>
                <span>- ฿{{ pricing.discount.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span>ค่าบริการและดูแลระบบ</span>
                <span>฿{{ platformFee }}</span>
              </div>
              <div class="flex justify-between items-end text-sm font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>ยอดชำระสุทธิ</span>
                <span class="text-2xl text-indigo-600">฿{{ grandTotal.toLocaleString() }}</span>
              </div>
            </div>

            <button @click="executeAddToCart" :disabled="isAddingToCart" class="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:bg-indigo-600 hover:-translate-y-1 transition-all duration-300 disabled:opacity-75 disabled:hover:translate-y-0 flex items-center justify-center gap-2">
              <svg v-if="isAddingToCart" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isAddingToCart ? 'กำลังสร้างออเดอร์...' : 'เพิ่มลงตะกร้า' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 📱 Mobile Floating Bar -->
    <div v-if="!isLoading && item" class="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-5 py-4 flex justify-between items-center z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] pb-safe">
      <div>
        <p class="text-xl font-black text-slate-900">
          ฿{{ grandTotal.toLocaleString() }} <span class="text-[10px] text-slate-500 font-medium uppercase">สุทธิ</span>
        </p>
        <p class="text-[11px] font-bold text-indigo-600 mt-0.5">
          เช่า {{ durationValue }} {{ pricing.label }}
        </p>
      </div>
      <button @click="executeAddToCart" :disabled="isAddingToCart" class="bg-slate-900 text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-lg">
        {{ isAddingToCart ? 'รอสักครู่...' : 'จองเลย' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.pb-safe { padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem); }
</style>