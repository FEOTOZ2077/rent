<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 📦 ข้อมูลจำลอง (เพิ่มราคาต่อชั่วโมง pricePerHour เข้ามา)
const item = ref({
  id: route.params.id || 1,
  title: 'Tesla Model 3 Long Range ขับเคลื่อน 4 ล้อ (2026)',
  description: 'สัมผัสประสบการณ์การขับขี่แห่งอนาคตกับ Tesla Model 3 Long Range วิ่งได้ไกลถึง 600 กม. ต่อการชาร์จ 1 ครั้ง พร้อมระบบ Autopilot ขั้นสูง ตัวรถสภาพใหม่เอี่ยม ภายในสะอาด กว้างขวาง เหมาะสำหรับทริปครอบครัว หรือการเช่าระยะสั้นเพื่อประชุมธุรกิจ',
  price: 2900,         // ราคาต่อวัน
  pricePerHour: 350,   // ราคาต่อชั่วโมง
  rating: 4.96,
  reviews: 124,
  location: 'สุขุมวิท, กทม. (ติด BTS อโศก)',
  category: 'รถยนต์/ยานพาหนะ',
  images: [
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1200', 
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1571127236794-81c0bbef1651?auto=format&fit=crop&q=80&w=800'
  ],
  features: [
    { icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>', name: 'ไฟฟ้า 100%' },
    { icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>', name: 'Autopilot' },
    { icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>', name: '5 ที่นั่ง' },
    { icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>', name: 'สภาพดีเยี่ยม' }
  ],
  rules: [
    'ห้ามสูบบุหรี่หรือพอตในรถเด็ดขาด (ปรับ 5,000 บาท)',
    'คืนรถในสภาพเดิมพร้อมชาร์จไฟไม่ต่ำกว่า 50%'
  ],
  lender: { 
    name: 'คุณธน ์ (Super Lender)', 
    avatar: 'https://i.pravatar.cc/150?u=10',
    joined: 'พ.ค. 2023',
    responseRate: '100%',
    responseTime: 'ภายใน 15 นาที',
    isVerified: true
  }
})

// 🧮 State สำหรับระบบเช่า
const activeImage = ref(0)
const rentalMode = ref('daily') // 'daily' หรือ 'hourly'
const rentalDays = ref(1)
const rentalHours = ref(3) // เช่ารายชั่วโมงขั้นต่ำ 3 ชม.
const isAddingToCart = ref(false)

// 🧮 คำนวณราคา
const calculateTotal = computed(() => {
  if (rentalMode.value === 'daily') {
    return item.value.price * rentalDays.value
  } else {
    return item.value.pricePerHour * rentalHours.value
  }
})

const platformFee = 150
const netPrice = computed(() => calculateTotal.value + platformFee)

// 🛒 ฟังก์ชันเพิ่มลงตะกร้า (เก็บลง LocalStorage เพื่อให้หน้า Cart ดึงไปใช้ได้)
const handleAddToCart = () => {
  isAddingToCart.value = true
  
  setTimeout(() => {
    // 1. สร้าง Object ข้อมูลการจอง
    const orderData = {
      orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      itemId: item.value.id,
      itemTitle: item.value.title,
      itemImage: item.value.images[0],
      lender: item.value.lender.name,
      mode: rentalMode.value,
      duration: rentalMode.value === 'daily' ? rentalDays.value : rentalHours.value,
      startDate: rentalMode.value === 'daily' ? '12 ก.ย. 2026' : '12 ก.ย. 2026 (10:00 น.)',
      endDate: rentalMode.value === 'daily' ? '14 ก.ย. 2026' : '12 ก.ย. 2026 (13:00 น.)',
      totalPrice: calculateTotal.value,
      platformFee: platformFee,
      netPrice: netPrice.value
    }

    // 2. ดึงตะกร้าเก่ามา และเพิ่มของใหม่เข้าไป
    const existingCart = JSON.parse(localStorage.getItem('rentall_cart') || '[]')
    existingCart.push(orderData)
    localStorage.setItem('rentall_cart', JSON.stringify(existingCart))

    // 3. ย้ายไปหน้าตะกร้า
    isAddingToCart.value = false
    router.push('/cart')
  }, 800) // จำลองความหน่วง
}

onMounted(() => { window.scrollTo(0, 0) })
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen pb-20 font-sans">
    
    <!-- 📍 Breadcrumb -->
    <div class="border-b border-slate-200 bg-white">
      <div class="max-w-[1200px] mx-auto px-4 md:px-10 py-4 flex items-center gap-2 text-xs font-bold text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <RouterLink to="/" class="hover:text-indigo-600 transition">หน้าแรก</RouterLink>
        <span class="text-slate-300">/</span>
        <RouterLink :to="`/search?category=${item.category}`" class="hover:text-indigo-600 transition">{{ item.category }}</RouterLink>
        <span class="text-slate-300">/</span>
        <span class="text-slate-800">{{ item.title }}</span>
      </div>
    </div>

    <div class="max-w-[1200px] mx-auto px-4 md:px-10 py-8 md:py-10">
      
      <!-- 🌟 หัวข้อสินค้า -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          {{ item.title }}
        </h1>
        <div class="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-700">
          <span class="flex items-center gap-1.5 text-slate-900">
            <svg class="w-5 h-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            {{ item.rating }} 
            <span class="text-slate-500 font-medium underline underline-offset-4 hover:text-indigo-600 cursor-pointer">({{ item.reviews }} รีวิว)</span>
          </span>
          <span class="text-slate-300">•</span>
          <span class="flex items-center gap-1.5 underline underline-offset-4 hover:text-indigo-600 cursor-pointer text-slate-600">
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            {{ item.location }}
          </span>
        </div>
      </div>

      <!-- 🖼️ Image Gallery -->
      <div class="hidden md:grid grid-cols-4 grid-rows-2 gap-3 h-[450px] lg:h-[550px] rounded-[2rem] overflow-hidden mb-12 relative group shadow-sm">
        <div class="col-span-2 row-span-2 h-full cursor-pointer relative overflow-hidden">
          <img :src="item.images[0]" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700 hover:brightness-95" />
        </div>
        <div class="h-full cursor-pointer overflow-hidden"><img :src="item.images[1]" class="w-full h-full object-cover hover:brightness-95 transition-all duration-300" /></div>
        <div class="h-full cursor-pointer overflow-hidden"><img :src="item.images[2]" class="w-full h-full object-cover hover:brightness-95 transition-all duration-300" /></div>
        <div class="h-full cursor-pointer overflow-hidden"><img :src="item.images[3]" class="w-full h-full object-cover hover:brightness-95 transition-all duration-300" /></div>
        <div class="h-full cursor-pointer overflow-hidden relative">
          <img :src="item.images[4]" class="w-full h-full object-cover hover:brightness-95 transition-all duration-300" />
          <button class="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-slate-900 font-bold px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm text-sm hover:bg-white flex items-center gap-2 transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
            ดูรูปทั้งหมด
          </button>
        </div>
      </div>

      <!-- 📱 Mobile Image Gallery -->
      <div class="md:hidden space-y-3 mb-8">
        <div class="relative aspect-[4/3] w-full bg-slate-100 rounded-3xl overflow-hidden shadow-sm border border-slate-200">
          <img :src="item.images[activeImage]" class="w-full h-full object-cover" />
          <div class="absolute bottom-4 right-4 bg-slate-900/80 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg backdrop-blur">
            {{ activeImage + 1 }} / {{ item.images.length }}
          </div>
        </div>
        <div class="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
          <button v-for="(img, index) in item.images" :key="index" @click="activeImage = index"
            :class="['w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all', activeImage === index ? 'border-indigo-600 shadow-md opacity-100' : 'border-transparent opacity-60 hover:opacity-100']">
            <img :src="img" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- 📝 Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
        
        <!-- ⬅️ ฝั่งซ้าย: รายละเอียดเนื้อหา -->
        <div class="lg:col-span-2 space-y-10">
          <!-- ผู้ให้เช่า -->
          <div class="flex justify-between items-center pb-8 border-b border-slate-200">
            <div>
              <h2 class="text-2xl font-black text-slate-800">ปล่อยเช่าโดย {{ item.lender.name.split(' ')[0] }}</h2>
              <p class="text-slate-500 font-medium text-sm mt-1">ผู้ให้เช่าตั้งแต่ {{ item.lender.joined }} • อัตราตอบกลับ {{ item.lender.responseRate }}</p>
            </div>
            <img :src="item.lender.avatar" class="w-16 h-16 rounded-full border-2 border-slate-100 shadow-sm object-cover bg-white" />
          </div>

          <!-- รายละเอียด -->
          <div class="pb-8 border-b border-slate-200">
            <h3 class="text-xl font-black text-slate-800 mb-4">รายละเอียดสินค้า</h3>
            <p class="text-slate-600 leading-relaxed text-base font-medium">{{ item.description }}</p>
          </div>

          <!-- สิ่งอำนวยความสะดวก -->
          <div class="pb-8 border-b border-slate-200">
            <h3 class="text-xl font-black text-slate-800 mb-6">คุณสมบัติเด่น</h3>
            <div class="grid grid-cols-2 gap-y-6 gap-x-6">
              <div v-for="feat in item.features" :key="feat.name" class="flex items-center gap-4 text-slate-700">
                <div class="text-indigo-600" v-html="feat.icon"></div>
                <span class="font-bold text-sm">{{ feat.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ➡️ ฝั่งขวา: วิดเจ็ตการจอง (Booking Card) -->
        <div class="lg:col-span-1 hidden lg:block relative">
          <div class="sticky top-[100px] bg-white rounded-[2rem] border border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-8">
            
            <!-- ราคา (แสดงผลตาม Mode) -->
            <div class="flex items-end gap-1.5 mb-6">
              <span class="text-3xl font-black text-slate-900 tracking-tight">
                ฿{{ rentalMode === 'daily' ? item.price.toLocaleString() : item.pricePerHour.toLocaleString() }}
              </span>
              <span class="text-slate-500 font-medium mb-1.5 text-sm">/ {{ rentalMode === 'daily' ? 'วัน' : 'ชม.' }}</span>
            </div>

            <!-- Tab สลับโหมด รายวัน / รายชั่วโมง -->
            <div class="flex bg-slate-100 p-1.5 rounded-2xl mb-6 shadow-inner border border-slate-200">
               <button @click="rentalMode = 'daily'" :class="{'bg-white shadow-sm text-indigo-700 border border-slate-200': rentalMode === 'daily', 'text-slate-500 hover:text-slate-700': rentalMode !== 'daily'}" class="flex-1 text-xs font-bold py-2.5 rounded-xl transition-all">เช่ารายวัน</button>
               <button @click="rentalMode = 'hourly'" :class="{'bg-white shadow-sm text-indigo-700 border border-slate-200': rentalMode === 'hourly', 'text-slate-500 hover:text-slate-700': rentalMode !== 'hourly'}" class="flex-1 text-xs font-bold py-2.5 rounded-xl transition-all">เช่ารายชั่วโมง</button>
            </div>

            <!-- 🟢 กล่องเลือกเวลา (เปลี่ยนฟอร์มตามโหมด) -->
            <div class="border border-slate-300 rounded-2xl overflow-hidden mb-6 flex flex-col focus-within:ring-2 focus-within:ring-indigo-500 transition-all bg-white">
              
              <!-- 🗓️ กรณีเช่ารายวัน -->
              <template v-if="rentalMode === 'daily'">
                <div class="flex">
                  <div class="flex-1 p-4 border-r border-slate-300 cursor-pointer hover:bg-slate-50 transition">
                    <label class="block text-[10px] font-black uppercase text-slate-800 tracking-widest mb-1">วันรับของ</label>
                    <p class="text-sm text-slate-500 font-medium">12 ก.ย. 2026</p>
                  </div>
                  <div class="flex-1 p-4 cursor-pointer hover:bg-slate-50 transition">
                    <label class="block text-[10px] font-black uppercase text-slate-800 tracking-widest mb-1">วันส่งคืน</label>
                    <p class="text-sm text-slate-500 font-medium">14 ก.ย. 2026</p>
                  </div>
                </div>
                <div class="border-t border-slate-300 p-4 flex justify-between items-center bg-slate-50">
                  <label class="block text-[10px] font-black uppercase text-slate-800 tracking-widest">ระยะเวลา</label>
                  <div class="flex items-center gap-3 bg-white px-2 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                    <button @click="rentalDays > 1 && rentalDays--" class="w-6 h-6 flex items-center justify-center text-slate-500 font-bold hover:bg-slate-100 hover:text-slate-900 rounded-md transition">-</button>
                    <span class="text-sm font-black text-slate-900 w-6 text-center">{{ rentalDays }} <span class="text-[10px] font-normal text-slate-400">วัน</span></span>
                    <button @click="rentalDays++" class="w-6 h-6 flex items-center justify-center text-slate-500 font-bold hover:bg-slate-100 hover:text-slate-900 rounded-md transition">+</button>
                  </div>
                </div>
              </template>

              <!-- ⏱️ กรณีเช่ารายชั่วโมง -->
              <template v-if="rentalMode === 'hourly'">
                <div class="flex">
                  <div class="flex-1 p-4 border-r border-slate-300 cursor-pointer hover:bg-slate-50 transition">
                    <label class="block text-[10px] font-black uppercase text-slate-800 tracking-widest mb-1">วันที่เช่า</label>
                    <p class="text-sm text-slate-500 font-medium">12 ก.ย. 2026</p>
                  </div>
                  <div class="flex-1 p-4 cursor-pointer hover:bg-slate-50 transition">
                    <label class="block text-[10px] font-black uppercase text-slate-800 tracking-widest mb-1">เวลารับของ</label>
                    <p class="text-sm text-slate-500 font-medium">10:00 น.</p>
                  </div>
                </div>
                <div class="border-t border-slate-300 p-4 flex justify-between items-center bg-slate-50">
                  <label class="block text-[10px] font-black uppercase text-slate-800 tracking-widest">ระยะเวลา (ขั้นต่ำ 3 ชม.)</label>
                  <div class="flex items-center gap-3 bg-white px-2 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                    <button @click="rentalHours > 3 && rentalHours--" class="w-6 h-6 flex items-center justify-center text-slate-500 font-bold hover:bg-slate-100 hover:text-slate-900 rounded-md transition">-</button>
                    <span class="text-sm font-black text-slate-900 w-8 text-center">{{ rentalHours }} <span class="text-[10px] font-normal text-slate-400">ชม.</span></span>
                    <button @click="rentalHours < 24 && rentalHours++" class="w-6 h-6 flex items-center justify-center text-slate-500 font-bold hover:bg-slate-100 hover:text-slate-900 rounded-md transition">+</button>
                  </div>
                </div>
              </template>

            </div>

            <!-- 🛒 ปุ่มเพิ่มลงตะกร้า -->
            <button @click="handleAddToCart" :disabled="isAddingToCart" class="w-full bg-indigo-600 text-white font-black py-4.5 rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all text-base flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0">
              <svg v-if="isAddingToCart" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              {{ isAddingToCart ? 'กำลังประมวลผล...' : 'เพิ่มลงตะกร้าเพื่อจอง' }}
            </button>
            <p class="text-[11px] text-center text-slate-400 mt-4 font-medium flex items-center justify-center gap-1.5">
               <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
               ไปตรวจสอบยอดรวมที่หน้าตะกร้าสินค้า
            </p>

            <!-- สรุปราคา -->
            <div class="mt-8 space-y-4">
              <div class="flex justify-between text-sm text-slate-600 font-medium">
                <span class="underline underline-offset-4 decoration-slate-300">
                  ฿{{ rentalMode === 'daily' ? item.price.toLocaleString() : item.pricePerHour.toLocaleString() }} 
                  x 
                  {{ rentalMode === 'daily' ? rentalDays : rentalHours }} {{ rentalMode === 'daily' ? 'วัน' : 'ชม.' }}
                </span>
                <span>฿{{ calculateTotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm text-slate-600 font-medium">
                <span class="underline underline-offset-4 decoration-slate-300">ค่าบริการแพลตฟอร์ม</span>
                <span>฿150</span>
              </div>
              <hr class="border-slate-200 my-5" />
              <div class="flex justify-between items-center font-black">
                <span class="text-lg text-slate-800">ราคาสุทธิ</span>
                <span class="text-2xl text-indigo-600">฿{{ netPrice.toLocaleString() }}</span>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
    
    <!-- 📱 Mobile Floating Booking Bar (อัปเดตราคาตาม Mode) -->
    <div class="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-5 py-4 flex justify-between items-center z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] pb-safe">
      <div>
        <p class="text-xl font-black text-slate-900">
          ฿{{ netPrice.toLocaleString() }} <span class="text-[10px] text-slate-500 font-medium uppercase">รวมค่าบริการ</span>
        </p>
        <p class="text-[11px] font-bold text-slate-500 underline underline-offset-2 mt-1">
          {{ rentalMode === 'daily' ? `เช่า ${rentalDays} วัน` : `เช่า ${rentalHours} ชั่วโมง` }}
        </p>
      </div>
      <button @click="handleAddToCart" class="bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-lg shadow-indigo-200">
        เพิ่มลงตะกร้า
      </button>
    </div>

  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.pb-safe { padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem); }
</style>