<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 📦 Mock Detail Item
const item = ref({
  id: route.params.id || 1,
  title: 'Tesla Model 3 Long Range ขับเคลื่อน 4 ล้อ (2026)',
  description: 'สัมผัสประสบการณ์การขับขี่แห่งอนาคตกับ Tesla Model 3 Long Range แบตเตอรี่อึดวิ่งได้ไกลถึง 600 กม. ต่อการชาร์จ 1 ครั้ง พร้อมระบบ Autopilot ขั้นสูง ตัวรถสภาพใหม่เอี่ยม 100% ดูแลรักษาอย่างดี เบาะหนังพรีเมียม สะอาด ไร้กลิ่นอับ เหมาะทั้งทริปท่องเที่ยว และเช่ารายชั่วโมงเพื่อทำงาน',
  price: 2900,
  pricePerHour: 350,
  rating: 4.96,
  reviews: 124,
  location: 'สุขุมวิท, กทม. (BTS อโศก)',
  category: 'รถยนต์/ยานพาหนะ',
  images: [
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1200', 
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1571127236794-81c0bbef1651?auto=format&fit=crop&q=80&w=800'
  ],
  features: [
    { icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>', name: 'มอเตอร์ไฟฟ้า 100%' },
    { icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>', name: 'ระบบขับเคลื่อน 4 ล้อ' },
    { icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>', name: 'Autopilot อัจฉริยะ' },
    { icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>', name: 'ผู้โดยสาร 5 ที่นั่ง' }
  ],
  lender: {
    name: 'คุณธน ์ (Super Lender)',
    avatar: 'https://i.pravatar.cc/150?u=10',
    joined: 'มีนาคม 2024',
    responseRate: '100%',
    responseTime: 'ภายใน 15 นาที',
    isVerified: true
  }
})

// 🧮 Calculator & Booking State
const rentalMode = ref('daily') // 'daily' | 'hourly'
const rentalDays = ref(2)
const rentalHours = ref(4)
const activeImageIndex = ref(0)
const isAddingToCart = ref(false)
const showMobileBookingModal = ref(false)

// 🗓️ การคำนวณวัน-เวลา Dynamic จากปัจจุบัน
const now = new Date()
const startDate = new Date(now)
startDate.setDate(startDate.getDate() + 1) // เริ่มเช่าพรุ่งนี้ 09:00 น.
startDate.setHours(9, 0, 0, 0)

const formatDateTime = (d) => {
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
}

const pickupDisplay = computed(() => formatDateTime(startDate))

const returnDisplay = computed(() => {
  const d = new Date(startDate)
  if (rentalMode.value === 'daily') {
    d.setDate(d.getDate() + parseInt(rentalDays.value))
  } else {
    d.setHours(d.getHours() + parseInt(rentalHours.value))
  }
  return formatDateTime(d)
})

const rentalPriceSubtotal = computed(() => {
  return rentalMode.value === 'daily' 
    ? item.value.price * rentalDays.value 
    : item.value.pricePerHour * rentalHours.value
})

const platformFee = 150
const totalPrice = computed(() => rentalPriceSubtotal.value + platformFee)

// 🛒 ฟังก์ชันบันทึกเข้า Cart
const executeAddToCart = () => {
  isAddingToCart.value = true
  setTimeout(() => {
    const newCartOrder = {
      orderId: 'RN-' + Math.floor(100000 + Math.random() * 900000),
      itemId: item.value.id,
      itemTitle: item.value.title,
      itemImage: item.value.images[0],
      lenderName: item.value.lender.name,
      mode: rentalMode.value,
      durationText: rentalMode.value === 'daily' ? `${rentalDays.value} วัน` : `${rentalHours.value} ชม.`,
      pickupDate: pickupDisplay.value,
      returnDate: returnDisplay.value,
      subtotal: rentalPriceSubtotal.value,
      platformFee: platformFee,
      totalPrice: totalPrice.value
    }

    const currentCart = JSON.parse(localStorage.getItem('rentall_cart') || '[]')
    currentCart.push(newCartOrder)
    localStorage.setItem('rentall_cart', JSON.stringify(currentCart))

    isAddingToCart.value = false
    showMobileBookingModal.value = false
    router.push('/cart')
  }, 600)
}

onMounted(() => window.scrollTo(0, 0))
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen font-sans pb-32 lg:pb-20">
    
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-slate-200">
      <div class="max-w-[1300px] mx-auto px-4 md:px-10 py-3.5 flex items-center gap-2 text-xs font-bold text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <RouterLink to="/" class="hover:text-indigo-600">หน้าหลัก</RouterLink>
        <span class="text-slate-300">/</span>
        <RouterLink :to="`/search?category=${item.category}`" class="hover:text-indigo-600">{{ item.category }}</RouterLink>
        <span class="text-slate-300">/</span>
        <span class="text-slate-800 truncate max-w-xs">{{ item.title }}</span>
      </div>
    </div>

    <main class="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-10">
      
      <!-- Title & Header Bar -->
      <div class="mb-6 md:mb-8">
        <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3">
          {{ item.title }}
        </h1>
        <div class="flex flex-wrap items-center gap-4 text-xs md:text-sm font-bold text-slate-600">
          <span class="flex items-center gap-1 text-slate-900 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">
            <svg class="w-4 h-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            {{ item.rating }} ({{ item.reviews }} รีวิว)
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            {{ item.location }}
          </span>
        </div>
      </div>

      <!-- 🖼️ Image Gallery: Responsive Desktop Grid & Mobile Swiper -->
      <!-- Desktop Layout (5 รูปแบบตาราง) -->
      <div class="hidden md:grid grid-cols-4 grid-rows-2 gap-3 h-[420px] lg:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-sm">
        <div class="col-span-2 row-span-2 relative cursor-pointer overflow-hidden">
          <img :src="item.images[0]" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
        </div>
        <div v-for="(img, idx) in item.images.slice(1, 5)" :key="idx" class="relative cursor-pointer overflow-hidden">
          <img :src="img" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
        </div>
      </div>

      <!-- Mobile Layout (รูปใหญ่ + แถบ thumbnail) -->
      <div class="md:hidden space-y-3 mb-8">
        <div class="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 relative shadow-sm border border-slate-200">
          <img :src="item.images[activeImageIndex]" class="w-full h-full object-cover" />
          <span class="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
            {{ activeImageIndex + 1 }} / {{ item.images.length }}
          </span>
        </div>
        <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button 
            v-for="(img, i) in item.images" 
            :key="i" 
            @click="activeImageIndex = i" 
            :class="['w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition', activeImageIndex === i ? 'border-indigo-600 scale-95' : 'border-transparent opacity-60']"
          >
            <img :src="img" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Content Grid: ฝั่งซ้ายเนื้อหา, ฝั่งขวา Sticky Widget -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-start">
        
        <!-- Left details -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- ผู้ให้เช่า -->
          <div class="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div class="flex items-center gap-4">
              <div class="relative">
                <img :src="item.lender.avatar" class="w-14 h-14 rounded-full object-cover border-2 border-slate-100" />
                <span class="absolute bottom-0 right-0 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                </span>
              </div>
              <div>
                <h3 class="font-black text-slate-900 text-base md:text-lg">{{ item.lender.name }}</h3>
                <p class="text-xs text-slate-500 font-medium mt-0.5">สมาชิกตั้งแต่ {{ item.lender.joined }} • อัตราตอบกลับ {{ item.lender.responseRate }}</p>
              </div>
            </div>
          </div>

          <!-- รายละเอียดสินค้า -->
          <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 class="text-lg md:text-xl font-black text-slate-900">รายละเอียดสินค้า</h3>
            <p class="text-slate-600 text-sm md:text-base leading-relaxed font-medium">{{ item.description }}</p>
          </div>

          <!-- สิ่งอำนวยความสะดวก / คุณสมบัติ -->
          <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 class="text-lg md:text-xl font-black text-slate-900 mb-6">คุณสมบัติเด่น</h3>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="f in item.features" :key="f.name" class="flex items-center gap-3 text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div class="text-indigo-600 bg-white p-2 rounded-xl shadow-sm" v-html="f.icon"></div>
                <span class="text-xs md:text-sm font-bold">{{ f.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ➡️ Right Sticky Booking Widget (Desktop) -->
        <aside class="hidden lg:block lg:col-span-1 sticky top-28">
          <div class="bg-white rounded-3xl border border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-7 space-y-6">
            
            <div class="flex justify-between items-end">
              <div>
                <span class="text-3xl font-black text-slate-900">
                  ฿{{ (rentalMode === 'daily' ? item.price : item.pricePerHour).toLocaleString() }}
                </span>
                <span class="text-xs font-bold text-slate-400"> / {{ rentalMode === 'daily' ? 'วัน' : 'ชั่วโมง' }}</span>
              </div>
              <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">พร้อมให้เช่า</span>
            </div>

            <!-- Tab สลับ รายวัน / รายชั่วโมง -->
            <div class="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button 
                @click="rentalMode = 'daily'"
                :class="['flex-1 py-2.5 rounded-xl text-xs font-black transition', rentalMode === 'daily' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800']"
              >
                เช่ารายวัน
              </button>
              <button 
                @click="rentalMode = 'hourly'"
                :class="['flex-1 py-2.5 rounded-xl text-xs font-black transition', rentalMode === 'hourly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800']"
              >
                เช่ารายชั่วโมง
              </button>
            </div>

            <!-- กล่องแสดงวันเวลาคำนวณอัตโนมัติ -->
            <div class="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <div class="p-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <span class="font-bold text-slate-500">วันเวลารับของ</span>
                <span class="font-black text-slate-800">{{ pickupDisplay }}</span>
              </div>
              <div class="p-3.5 bg-indigo-50/50 flex justify-between items-center">
                <span class="font-bold text-indigo-600">วันเวลาส่งคืน</span>
                <span class="font-black text-indigo-700">{{ returnDisplay }}</span>
              </div>
            </div>

            <!-- 🟢 Slider ควบคุมระยะเวลา -->
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <label class="text-xs font-black text-slate-700">ระยะเวลาที่ต้องการ</label>
                <span class="text-sm font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  {{ rentalMode === 'daily' ? `${rentalDays} วัน` : `${rentalHours} ชั่วโมง` }}
                </span>
              </div>
              <input 
                v-if="rentalMode === 'daily'" 
                type="range" 
                v-model.number="rentalDays" 
                min="1" 
                max="30" 
                class="w-full accent-indigo-600 cursor-pointer"
              />
              <input 
                v-else 
                type="range" 
                v-model.number="rentalHours" 
                min="1" 
                max="24" 
                class="w-full accent-indigo-600 cursor-pointer"
              />
              <div class="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{{ rentalMode === 'daily' ? '1 วัน' : '1 ชม.' }}</span>
                <span>{{ rentalMode === 'daily' ? '30 วัน' : '24 ชม.' }}</span>
              </div>
            </div>

            <!-- ปุ่ม Add to Cart -->
            <button 
              @click="executeAddToCart" 
              :disabled="isAddingToCart"
              class="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-xl transition flex items-center justify-center gap-2"
            >
              <svg v-if="isAddingToCart" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              {{ isAddingToCart ? 'กำลังเพิ่ม...' : 'เพิ่มลงตะกร้าเพื่อจอง' }}
            </button>

            <!-- สรุปตัวเลขราคา -->
            <div class="pt-4 border-t border-slate-100 space-y-2 text-xs font-bold text-slate-600">
              <div class="flex justify-between">
                <span>ค่าเช่าสุทธิ</span>
                <span>฿{{ rentalPriceSubtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span>ค่าบริการแพลตฟอร์ม</span>
                <span>฿{{ platformFee }}</span>
              </div>
              <div class="flex justify-between items-center text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>ยอดชำระสุทธิ</span>
                <span class="text-xl text-indigo-600">฿{{ totalPrice.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <!-- 📱 Mobile Floating Bottom Bar (กดเปิด Modal สำหรับเลื่อน Slider) -->
    <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-5 py-3.5 z-40 flex items-center justify-between shadow-[0_-10px_25px_rgba(0,0,0,0.08)]">
      <div>
        <p class="text-lg font-black text-slate-900">฿{{ totalPrice.toLocaleString() }}</p>
        <button @click="showMobileBookingModal = true" class="text-xs font-bold text-indigo-600 underline">
          {{ rentalMode === 'daily' ? `${rentalDays} วัน` : `${rentalHours} ชม.` }} (แตะเพื่อปรับเวลา)
        </button>
      </div>
      <button 
        @click="executeAddToCart" 
        class="bg-indigo-600 text-white font-black px-6 py-3 rounded-2xl text-xs shadow-lg shadow-indigo-200"
      >
        เพิ่มลงตะกร้า
      </button>
    </div>

    <!-- 📱 Mobile Slider Popup Modal -->
    <div v-if="showMobileBookingModal" class="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="showMobileBookingModal = false"></div>
      <div class="relative bg-white rounded-t-[2.5rem] p-6 space-y-5 animate-slide-up z-10 shadow-2xl">
        <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto"></div>
        <h3 class="font-black text-slate-900 text-base">ปรับระยะเวลาและโหมดการเช่า</h3>

        <div class="flex bg-slate-100 p-1 rounded-2xl">
          <button @click="rentalMode = 'daily'" :class="['flex-1 py-2 rounded-xl text-xs font-bold', rentalMode === 'daily' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500']">เช่ารายวัน</button>
          <button @click="rentalMode = 'hourly'" :class="['flex-1 py-2 rounded-xl text-xs font-bold', rentalMode === 'hourly' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500']">เช่ารายชั่วโมง</button>
        </div>

        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1 text-xs">
          <p class="font-bold text-slate-600">รับ: <span class="text-slate-900">{{ pickupDisplay }}</span></p>
          <p class="font-bold text-indigo-600">คืน: <span class="text-indigo-800">{{ returnDisplay }}</span></p>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-bold text-slate-600">เลื่อนระยะเวลา</span>
            <span class="text-xs font-black text-indigo-600">{{ rentalMode === 'daily' ? `${rentalDays} วัน` : `${rentalHours} ชม.` }}</span>
          </div>
          <input v-if="rentalMode === 'daily'" type="range" v-model.number="rentalDays" min="1" max="30" class="w-full accent-indigo-600" />
          <input v-else type="range" v-model.number="rentalHours" min="1" max="24" class="w-full accent-indigo-600" />
        </div>

        <button @click="showMobileBookingModal = false" class="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-2xl text-xs shadow">ตกลง</button>
      </div>
    </div>

  </div>
</template>

<style scoped>
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>