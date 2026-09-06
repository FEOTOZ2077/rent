<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useItems } from '@/composables/useItems'

const router = useRouter()
const { items, fetchItems, isLoading } = useItems() 

const searchQuery = ref('')
const activeCategory = ref('ยอดนิยมสูงสุด')

// หมวดหมู่สินค้า
const categories = [
  { name: 'ยอดนิยมสูงสุด', type: 'trending' },
  { name: 'รถยนต์/ยานพาหนะ', type: 'car' },
  { name: 'อสังหาริมทรัพย์', type: 'property' },
  { name: 'กล้องและเลนส์', type: 'camera' },
  { name: 'อุปกรณ์แคมป์ปิ้ง', type: 'camping' },
  { name: 'ชุดออกงาน', type: 'fashion' },
  { name: 'เครื่องมือช่าง', type: 'tools' },
  { name: 'อุปกรณ์เกมมิ่ง', type: 'gaming' }
]

// 🏪 ร้านค้าแนะนำ (Mock Data)
const popularStores = ref([
  { 
    id: 1, 
    name: 'Pro Camera Studio', 
    category: 'กล้องและอุปกรณ์ถ่ายภาพ', 
    rating: 4.9, 
    rentals: '2,400+', 
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', 
    avatar: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150' 
  },
  { 
    id: 2, 
    name: 'Premium Cars', 
    category: 'รถยนต์ & ซูเปอร์คาร์', 
    rating: 5.0, 
    rentals: '1,200+', 
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800', 
    avatar: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=150' 
  },
  { 
    id: 3, 
    name: 'CampLife Official', 
    category: 'อุปกรณ์แคมป์ปิ้ง', 
    rating: 4.8, 
    rentals: '850+', 
    image: 'https://images.unsplash.com/photo-1504280390267-33d0ef3c675c?auto=format&fit=crop&q=80&w=800', 
    avatar: 'https://images.unsplash.com/photo-1504280390267-33d0ef3c675c?w=150' 
  },
])

onMounted(() => fetchItems())

const handleSearch = () => {
  if (searchQuery.value) router.push(`/search?q=${searchQuery.value}`)
  else router.push('/search')
}

// กรองสินค้าตามหมวดหมู่
const filteredItems = computed(() => {
  if (!items.value) return []
  if (activeCategory.value === 'ยอดนิยมสูงสุด') return items.value.slice(0, 8) 
  return items.value.filter(item => item.category === activeCategory.value)
})
</script>

<template>
  <div class="w-full overflow-x-hidden bg-[#F8FAFC] font-sans pb-20">
    
    <!-- 📢 Hero Banner -->
    <div class="relative w-full min-h-[75vh] md:min-h-[85vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-10 py-12 md:py-16">
      <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-indigo-950/80 to-[#F8FAFC]"></div>
      <div class="absolute inset-0 mix-blend-overlay opacity-30" style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 20px 20px;"></div>
      
      <div class="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center pt-8 md:pt-12">
        <span class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-bold rounded-full mb-6 border border-white/20 shadow-lg">
          <svg class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          แพลตฟอร์มเช่ายืมทุกสิ่ง รถยนต์ อสังหาฯ และของใช้
        </span>
        <h1 class="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight drop-shadow-lg">เช่ารถ บ้านพัก หรือของใช้ <br class="hidden md:block"/> จบครบในที่เดียว</h1>
        
        <div class="w-full max-w-2xl bg-white p-1.5 sm:p-2 md:p-3 rounded-full shadow-[0_20px_50px_rgb(0,0,0,0.15)] flex items-center border border-white/50 backdrop-blur-md transition-all hover:shadow-[0_20px_50px_rgb(79,70,229,0.2)]">
          <div class="flex-grow flex items-center pl-4 md:pl-6">
            <svg class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <input v-model="searchQuery" @keyup.enter="handleSearch" type="text" placeholder="ค้นหารถยนต์, คอนโด, กล้อง..." class="w-full bg-transparent outline-none text-slate-800 text-sm md:text-base font-medium py-2.5" />
          </div>
          <button @click="handleSearch" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 md:px-8 py-3 rounded-full font-bold shadow-lg transition-all text-sm md:text-base whitespace-nowrap">ค้นหา</button>
        </div>
      </div>
    </div>

    <!-- 📦 Main Content -->
    <div class="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-10 py-12">
      
      <!-- หมวดหมู่ไอคอน (Categories) -->
      <div class="flex flex-col items-center mb-10">
        <div class="w-full flex overflow-x-auto gap-4 md:gap-10 pb-4 scrollbar-hide justify-start lg:justify-center">
          <button v-for="cat in categories" :key="cat.name" @click="activeCategory = cat.name" class="flex flex-col items-center justify-center group flex-shrink-0 w-20 outline-none">
            <div :class="['w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all shadow-sm group-hover:-translate-y-1', activeCategory === cat.name ? 'bg-indigo-600 text-white ring-4 ring-indigo-600/20 scale-110' : 'bg-white text-slate-600 border border-slate-200 group-hover:border-indigo-600']">
               <svg v-if="cat.type === 'trending'" class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
               <svg v-else-if="cat.type === 'car'" class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
               <svg v-else-if="cat.type === 'property'" class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
               <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
            </div>
            <span :class="['text-xs font-bold mt-3 text-center line-clamp-1', activeCategory === cat.name ? 'text-indigo-600' : 'text-slate-600']">{{ cat.name }}</span>
          </button>
        </div>
      </div>

      <!-- 🛍️ Featured Items (ดึงจาก Supabase) -->
      <div class="mb-16 md:mb-24">
        <div class="flex justify-between items-end mb-6 md:mb-8">
          <div>
            <h2 class="text-2xl md:text-4xl font-black text-slate-900">{{ activeCategory === 'ยอดนิยมสูงสุด' ? 'รายการสินค้าแนะนำ' : `รายการ ${activeCategory}` }}</h2>
          </div>
          <button @click="router.push(`/search?category=${activeCategory}`)" class="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition">ดูทั้งหมด →</button>
        </div>
        
        <div v-if="isLoading" class="text-center py-20 text-slate-400">
          <svg class="animate-spin h-8 w-8 mx-auto mb-4 text-indigo-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          กำลังโหลดข้อมูล...
        </div>

        <div v-else-if="filteredItems.length > 0" class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div v-for="item in filteredItems" :key="item.id" @click="router.push(`/item/${item.id}`)" class="group cursor-pointer bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col">
            <div class="aspect-[4/3] bg-slate-100 overflow-hidden relative">
              <img :src="item.images && item.images[0] ? item.images[0] : ''" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <span class="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-800 shadow-sm">{{ item.category.split('/')[0] }}</span>
            </div>
            <div class="p-4 md:p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex justify-between mb-2 gap-1">
                  <span class="text-[10px] md:text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">★ {{ item.rating }}</span>
                  <span class="text-[10px] md:text-xs font-bold text-slate-400 truncate">📍 {{ item.location }}</span>
                </div>
                <h3 class="font-black text-slate-800 text-sm md:text-base leading-snug line-clamp-2 mb-4">{{ item.title }}</h3>
              </div>
              <div class="pt-3 border-t border-slate-100 flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <img :src="item.lender?.avatar_url || 'https://ui-avatars.com/api/?name=User'" class="w-6 h-6 rounded-full border border-slate-200 object-cover" />
                  <span class="text-[10px] md:text-xs font-bold text-slate-500 truncate max-w-[80px]">{{ item.lender?.first_name || 'ผู้ให้เช่า' }}</span>
                </div>
                <div class="text-right">
                  <span class="text-sm md:text-lg font-black text-indigo-600">฿{{ item.price_daily.toLocaleString() }}</span>
                  <span class="text-slate-400 text-[10px]">/วัน</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
           <p class="text-slate-500 font-medium">ยังไม่มีสินค้าในหมวดหมู่นี้</p>
        </div>
      </div>

      <!-- 🏪 Recommended Stores (ร้านค้าแนะนำ - Mock Data) -->
      <div class="mb-16 md:mb-24">
        <div class="flex justify-between items-end mb-6 md:mb-8">
          <div>
            <span class="text-[10px] sm:text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Top Partners</span>
            <h2 class="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mt-3">ร้านค้าและพาร์ทเนอร์ยอดนิยม</h2>
          </div>
          <button @click="router.push('/search')" class="text-xs sm:text-sm font-bold text-indigo-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition hidden md:block">ดูทั้งหมด →</button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
          <div v-for="store in popularStores" :key="store.id" @click="router.push('/search')" class="group cursor-pointer bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden">
            <div class="h-32 sm:h-40 overflow-hidden relative">
              <img :src="store.image" class="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent"></div>
            </div>
            <div class="px-5 pb-5 relative">
              <!-- Avatar แบบซ้อนทับ Cover (Premium UI) -->
              <div class="absolute -top-8 left-5 w-16 h-16 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                <img :src="store.avatar" class="w-full h-full object-cover" />
              </div>
              <div class="flex justify-end pt-3 mb-2">
                 <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100 flex items-center gap-1">
                   <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                   {{ store.rating }}
                 </span>
              </div>
              <div class="mt-1">
                <h3 class="font-black text-slate-900 text-lg line-clamp-1 group-hover:text-indigo-600 transition">{{ store.name }}</h3>
                <p class="text-[11px] text-slate-500 font-bold mb-3">{{ store.category }}</p>
                <div class="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                  <span class="text-slate-400 font-medium">สถิติปล่อยเช่าสำเร็จ</span>
                  <span class="font-black text-slate-800">{{ store.rentals }} รายการ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 💡 How to Rent -->
      <div class="bg-slate-900 text-white rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl mb-12">
        <!-- Decoration Effect -->
        <div class="absolute top-0 right-0 w-72 h-72 bg-indigo-600/30 rounded-full blur-3xl"></div>
        <div class="relative z-10 text-center max-w-2xl mx-auto mb-10">
          <h2 class="text-3xl md:text-5xl font-black">เช่าง่ายๆ ใน 3 ขั้นตอน</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
          <div class="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center">
            <div class="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-2xl font-black mb-5 shadow-lg shadow-indigo-600/30">1</div>
            <h3 class="text-xl font-bold mb-2">ค้นหาสินค้า</h3>
            <p class="text-slate-400 text-sm">เลือกรถ บ้าน หรือของใช้ที่คุณต้องการ ผ่านตัวกรองอัจฉริยะ</p>
          </div>
          <div class="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center">
            <div class="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-2xl font-black mb-5 shadow-lg shadow-indigo-600/30">2</div>
            <h3 class="text-xl font-bold mb-2">จองและชำระเงิน</h3>
            <p class="text-slate-400 text-sm">ชำระเงินปลอดภัยผ่านระบบส่วนกลาง (Escrow)</p>
          </div>
          <div class="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center">
            <div class="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-2xl font-black mb-5 shadow-lg shadow-indigo-600/30">3</div>
            <h3 class="text-xl font-bold mb-2">รับของไปใช้งาน</h3>
            <p class="text-slate-400 text-sm">นัดรับของ ตรวจสอบสภาพ แล้วเพลิดเพลินกับการใช้งานได้เลย</p>
          </div>
        </div>
      </div>

    </div>

    <!-- 🌐 Footer -->
    <footer class="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div class="max-w-[1300px] mx-auto px-4 md:px-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-slate-800 pb-12">
          <div>
            <h3 class="text-2xl font-black text-white mb-4"><span class="bg-indigo-600 p-1.5 rounded-lg text-lg mr-1 shadow-sm">R</span> RentAll</h3>
            <p class="text-sm font-medium">แพลตฟอร์มเช่ายืมทุกสิ่งครบวงจร เชื่อมโยงผู้ให้เช่าและผู้เช่า ปลอดภัย มั่นใจได้ 100%</p>
          </div>
          <div>
             <h4 class="font-bold text-white mb-4">เมนูด่วน</h4>
             <ul class="space-y-3 text-sm font-medium">
               <li><RouterLink to="/search" class="hover:text-indigo-400 transition">ค้นหาสินค้าทั้งหมด</RouterLink></li>
               <li><RouterLink to="/auth" class="hover:text-indigo-400 transition">เข้าสู่ระบบ / สมัครสมาชิก</RouterLink></li>
             </ul>
          </div>
          <div>
             <h4 class="font-bold text-white mb-4">บริการผู้ใช้</h4>
             <ul class="space-y-3 text-sm font-medium">
               <li><RouterLink to="/help" class="hover:text-indigo-400 transition">ศูนย์ช่วยเหลือผู้ใช้งาน</RouterLink></li>
               <li><RouterLink to="/lender/register" class="hover:text-indigo-400 transition">สมัครเป็นร้านค้าให้เช่า</RouterLink></li>
             </ul>
          </div>
          <div>
             <h4 class="font-bold text-white mb-4">ติดต่อเรา</h4>
             <p class="text-sm font-medium mb-2 flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> support@rentall.co.th</p>
             <p class="text-sm font-medium flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg> 02-XXX-XXXX</p>
          </div>
        </div>
        <div class="text-center text-sm font-medium mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span>&copy; 2026 RentAll Platform. All rights reserved.</span>
          <div class="flex gap-4">
            <a href="#" class="hover:text-white transition">เงื่อนไขการใช้งาน</a>
            <a href="#" class="hover:text-white transition">นโยบายความเป็นส่วนตัว</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>