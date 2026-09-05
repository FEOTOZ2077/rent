<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value) {
    router.push(`/search?q=${searchQuery.value}`)
  } else {
    router.push('/search')
  }
}

// 📌 หมวดหมู่สินค้า
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

const activeCategory = ref('ยอดนิยมสูงสุด')

// ฟังก์ชันเลือกหมวดหมู่
const selectCategory = (categoryName) => {
  activeCategory.value = categoryName
}

// 📦 ข้อมูลจำลอง สินค้าทั้งหมดในระบบ
const allItems = ref([
  { id: 1, title: 'Tesla Model 3 Long Range ขับเคลื่อน 4 ล้อ', price: 2900, rating: 5.0, reviews: 42, location: 'สุขุมวิท, กทม.', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800', category: 'รถยนต์/ยานพาหนะ', lender: { name: 'คุณธน ์', avatar: 'https://i.pravatar.cc/150?u=10' }, isTrending: true },
  { id: 2, title: 'คอนโดหรู ใจกลางสาทร วิวสระว่ายน้ำส่วนตัว', price: 1800, rating: 4.9, reviews: 88, location: 'สาทร, กทม.', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800', category: 'อสังหาริมทรัพย์', lender: { name: 'BangkokStay', avatar: 'https://i.pravatar.cc/150?u=11' }, isTrending: true },
  { id: 3, title: 'Sony A7IV พร้อมเลนส์ 24-70mm GM II สภาพใหม่', price: 1500, rating: 4.9, reviews: 34, location: 'สยาม, กทม.', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', category: 'กล้องและเลนส์', lender: { name: 'คุณนัท', avatar: 'https://i.pravatar.cc/150?u=1' }, isTrending: true },
  { id: 4, title: 'เต็นท์ Coleman 4-5 คน ทรงเคบิน กันฝน 100%', price: 450, rating: 4.8, reviews: 128, location: 'เมือง, เชียงใหม่', image: 'https://images.unsplash.com/photo-1504280390267-33d0ef3c675c?auto=format&fit=crop&q=80&w=800', category: 'อุปกรณ์แคมป์ปิ้ง', lender: { name: 'CampLife', avatar: 'https://i.pravatar.cc/150?u=2' }, isTrending: true },
  { id: 5, title: 'BMW Series 5 M-Sport สีขาวมุก', price: 3500, rating: 4.9, reviews: 21, location: 'บางนา, กทม.', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800', category: 'รถยนต์/ยานพาหนะ', lender: { name: 'PremiumCars', avatar: 'https://i.pravatar.cc/150?u=3' }, isTrending: false },
  { id: 6, title: 'พูลวิลล่า พัทยา 4 ห้องนอน ปิ้งย่างได้', price: 6500, rating: 4.7, reviews: 56, location: 'พัทยา, ชลบุรี', image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800', category: 'อสังหาริมทรัพย์', lender: { name: 'PattayaVillas', avatar: 'https://i.pravatar.cc/150?u=4' }, isTrending: false },
  { id: 7, title: 'DJI Mavic 3 Pro โดรนถ่ายภาพระดับโปร', price: 1200, rating: 5.0, reviews: 15, location: 'ลาดพร้าว, กทม.', image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800', category: 'กล้องและเลนส์', lender: { name: 'FlyHigh', avatar: 'https://i.pravatar.cc/150?u=5' }, isTrending: false },
  { id: 8, title: 'ชุดโต๊ะเก้าอี้แคมป์ปิ้ง Snow Peak', price: 300, rating: 4.9, reviews: 45, location: 'รังสิต, ปทุมธานี', image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800', category: 'อุปกรณ์แคมป์ปิ้ง', lender: { name: 'Outdoorsy', avatar: 'https://i.pravatar.cc/150?u=6' }, isTrending: false },
  { id: 9, title: 'เครื่อง PlayStation 5 พร้อม 2 จอย', price: 400, rating: 4.8, reviews: 92, location: 'ดินแดง, กทม.', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800', category: 'อุปกรณ์เกมมิ่ง', lender: { name: 'GameZone', avatar: 'https://i.pravatar.cc/150?u=7' }, isTrending: true }
])

// 🎯 กรองสินค้าตามหมวดหมู่ที่ถูกเลือก
const filteredItems = computed(() => {
  if (activeCategory.value === 'ยอดนิยมสูงสุด') {
    return allItems.value.filter(item => item.isTrending).slice(0, 4)
  }
  return allItems.value.filter(item => item.category === activeCategory.value)
})

// 🏪 ข้อมูลจำลอง ร้านค้ายอดนิยม
const popularStores = ref([
  { id: 1, name: 'Bangkok Car Rent Pro', category: 'รถยนต์ & ซูเปอร์คาร์', rating: 5.0, rentals: '1,200+ รายการเช่า', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600', avatar: 'https://i.pravatar.cc/150?u=20' },
  { id: 2, name: 'Urban Space & Condo', category: 'อสังหาฯ ใจกลางเมือง', rating: 4.9, rentals: '850+ รายการเช่า', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600', avatar: 'https://i.pravatar.cc/150?u=21' },
  { id: 3, name: 'Pro Camera Studio', category: 'กล้องและอุปกรณ์ถ่ายภาพ', rating: 4.9, rentals: '2,400+ รายการเช่า', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600', avatar: 'https://i.pravatar.cc/150?u=22' },
])
</script>

<template>
  <div class="w-full overflow-x-hidden bg-[#F8FAFC] font-sans">
    
    <!-- 📢 Full-screen Hero Banner (เปลี่ยนรูปใหม่ระดับ Premium) -->
    <div class="relative w-full min-h-[75vh] md:min-h-[85vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-10 py-12 md:py-16">
      <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000" class="absolute inset-0 w-full h-full object-cover" alt="Background Luxury Home" />
      <div class="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-indigo-950/80 to-[#F8FAFC]"></div>
      <div class="absolute inset-0 mix-blend-overlay opacity-30" style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 20px 20px;"></div>
      
      <div class="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center pt-8 md:pt-12">
        <span class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs md:text-sm font-bold rounded-full mb-4 md:mb-6 border border-white/20 shadow-lg">
          <svg class="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          แพลตฟอร์มเช่ายืมทุกสิ่ง รถยนต์ อสังหาฯ และของใช้
        </span>
        <h1 class="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 md:mb-6 tracking-tight leading-tight drop-shadow-lg">
          เช่ารถ บ้านพัก หรือของใช้ <br class="hidden md:block"/> จบครบในที่เดียว
        </h1>
        <p class="text-slate-200 text-sm sm:text-base md:text-lg max-w-xl md:max-w-2xl mx-auto mb-8 md:mb-10 drop-shadow-md font-medium px-2">
          เข้าถึงยานพาหนะ ที่พัก และสิ่งของคุณภาพสูงจากผู้คนรอบตัวคุณ พร้อมระบบความปลอดภัยและการันตี 100%
        </p>

        <!-- 🔍 กล่องค้นหาหลัก -->
        <div class="w-full max-w-2xl bg-white p-1.5 sm:p-2 md:p-3 rounded-full shadow-[0_20px_50px_rgb(0,0,0,0.15)] flex items-center border border-white/50 backdrop-blur-md transition-all hover:shadow-[0_20px_50px_rgb(79,70,229,0.2)]">
          <div class="flex-grow flex items-center pl-3 sm:pl-4 md:pl-6">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <input v-model="searchQuery" @keyup.enter="handleSearch" type="text" placeholder="ค้นหารถยนต์, คอนโด, กล้อง, เต็นท์..." class="w-full bg-transparent outline-none text-slate-800 text-xs sm:text-sm md:text-base font-medium py-2.5 sm:py-3 placeholder-slate-400" />
          </div>
          <button @click="handleSearch" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-full font-bold shadow-lg shadow-indigo-600/30 transition-all text-xs sm:text-sm md:text-base whitespace-nowrap">
            ค้นหา
          </button>
        </div>
      </div>
    </div>

    <!-- 🌟 Content Container -->
    <div class="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12">
      
      <!-- 🏷️ Circular Category Icons Row (ลดช่องว่างด้านล่างลง) -->
      <div class="flex flex-col items-center mb-8 md:mb-10">
        <div class="w-full flex overflow-x-auto gap-4 sm:gap-6 md:gap-10 pb-4 scrollbar-hide pt-2 relative z-20 justify-start lg:justify-center px-2">
          <button 
            v-for="cat in categories" 
            :key="cat.name"
            @click="selectCategory(cat.name)"
            class="flex flex-col items-center justify-center group cursor-pointer flex-shrink-0 focus:outline-none w-18 sm:w-20"
          >
            <div :class="[
              'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm group-hover:-translate-y-1',
              activeCategory === cat.name 
                ? 'bg-indigo-600 text-white shadow-indigo-200 shadow-xl ring-4 ring-indigo-600/20 scale-110' 
                : 'bg-white text-slate-600 border border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200'
            ]">
              <svg v-if="cat.type === 'trending'" class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
              <svg v-else-if="cat.type === 'car'" class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
              <svg v-else-if="cat.type === 'property'" class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              <svg v-else-if="cat.type === 'camera'" class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <svg v-else-if="cat.type === 'camping'" class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 20l7-16 7 16M3 20h18M9 10h6"/></svg>
              <svg v-else-if="cat.type === 'fashion'" class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <svg v-else-if="cat.type === 'tools'" class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <svg v-else-if="cat.type === 'gaming'" class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
            </div>
            <span :class="[
              'text-[11px] sm:text-xs md:text-sm font-bold tracking-tight mt-3 text-center transition-all line-clamp-1',
              activeCategory === cat.name ? 'text-indigo-600' : 'text-slate-600 group-hover:text-indigo-600'
            ]">{{ cat.name }}</span>
          </button>
        </div>
      </div>

      <!-- 📦 Featured Listings (อยู่ใกล้หมวดหมู่มากขึ้น) -->
      <div class="mb-16 md:mb-24">
        <div class="flex justify-between items-end mb-6 md:mb-8">
          <div>
            <span class="text-[10px] sm:text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Featured</span>
            <h2 class="text-xl sm:text-2xl md:text-4xl font-black text-slate-900 tracking-tight mt-2 flex items-center gap-2">
              {{ activeCategory === 'ยอดนิยมสูงสุด' ? 'รายการสินค้าแนะนำ' : `รายการ ${activeCategory}` }}
            </h2>
          </div>
          <button @click="router.push(`/search?category=${activeCategory}`)" class="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 transition bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:shadow-md">ดูทั้งหมด →</button>
        </div>
        
        <div v-if="filteredItems.length > 0" class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          <div v-for="item in filteredItems" :key="item.id" @click="router.push(`/item/${item.id}`)" class="group cursor-pointer flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div class="relative aspect-square md:aspect-[4/3] bg-slate-100 overflow-hidden">
              <img :src="item.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div class="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-bold text-slate-800 shadow-sm">
                {{ item.category.split('/')[0] }}
              </div>
            </div>
            
            <div class="p-4 md:p-5 flex flex-col flex-grow">
              <div class="flex justify-between items-center mb-2 gap-1">
                <span class="text-[10px] md:text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md flex items-center gap-1">
                  ★ {{ item.rating }} <span class="text-amber-600/50 hidden lg:inline">({{ item.reviews }})</span>
                </span>
                <span class="text-[10px] md:text-xs font-bold text-slate-400 truncate">📍 {{ item.location }}</span>
              </div>
              <h3 class="font-black text-slate-800 text-sm md:text-base leading-snug line-clamp-2 mb-4">{{ item.title }}</h3>
              <hr class="border-slate-100 mb-4 mt-auto" />
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <img :src="item.lender.avatar" class="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white shadow-sm object-cover" />
                  <span class="text-[10px] md:text-xs font-bold text-slate-500 truncate max-w-[50px] md:max-w-[80px]">{{ item.lender.name }}</span>
                </div>
                <div class="text-right">
                  <span class="text-sm md:text-lg font-black text-indigo-600">฿{{ item.price }}</span>
                  <span class="text-slate-400 text-[10px]">/วัน</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div class="text-5xl mb-4 grayscale opacity-40">📦</div>
          <h3 class="text-xl font-black text-slate-800 mb-2">ยังไม่มีสินค้าในหมวดหมู่นี้</h3>
          <p class="text-slate-500 font-medium text-sm">ผู้ให้เช่าอาจยังไม่ได้ลงประกาศสินค้าในหมวดหมู่นี้ ลองค้นหาหมวดหมู่อื่นดูนะ!</p>
        </div>
      </div>

      <!-- 🏪 Popular Stores (ร้านค้ายอดนิยม) -->
      <div class="mb-16 md:mb-24">
        <div class="flex justify-between items-end mb-6 md:mb-8">
          <div>
            <span class="text-[10px] sm:text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Top Partners</span>
            <h2 class="text-xl sm:text-2xl md:text-4xl font-black text-slate-900 tracking-tight mt-2">ร้านค้าและพาร์ทเนอร์ยอดนิยม</h2>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div v-for="store in popularStores" :key="store.id" class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer" @click="router.push('/search')">
            <div class="relative h-40 sm:h-48 overflow-hidden">
              <img :src="store.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
              <div class="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 flex items-center gap-3">
                <img :src="store.avatar" class="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white shadow-md object-cover" />
                <div class="text-white">
                  <h4 class="font-black text-base sm:text-lg">{{ store.name }}</h4>
                  <p class="text-[11px] sm:text-xs text-indigo-200 font-bold tracking-wide">{{ store.category }}</p>
                </div>
              </div>
            </div>
            <div class="p-4 sm:p-5 flex justify-between items-center bg-white">
              <div>
                <span class="text-[10px] sm:text-xs font-bold text-slate-400">สถิติการปล่อยเช่า</span>
                <p class="font-black text-slate-800 text-xs sm:text-sm">{{ store.rentals }}</p>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg text-xs font-black border border-amber-100">
                  ★ {{ store.rating }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 🌟 How to Rent Steps -->
      <div class="bg-slate-900 text-white rounded-3xl md:rounded-[3rem] p-8 sm:p-10 md:p-16 relative overflow-hidden shadow-2xl mb-12">
        <div class="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-600/30 rounded-full blur-3xl"></div>
        <div class="relative z-10 text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span class="text-[10px] sm:text-xs font-bold text-indigo-400 uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full border border-white/10">Easy Process</span>
          <h2 class="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight mt-4">ขั้นตอนการเช่ากับ RentAll ง่ายๆ</h2>
          <p class="text-slate-400 mt-3 text-xs sm:text-sm md:text-base font-medium">ไม่ว่าจะเป็นรถยนต์ คอนโด หรือกล้องถ่ายรูป เริ่มต้นใช้งานได้ทันทีใน 3 ขั้นตอน</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
          <div class="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center hover:bg-white/10 transition">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl sm:text-2xl font-black mb-5 shadow-lg shadow-indigo-600/30">1</div>
            <h3 class="text-lg sm:text-xl font-bold mb-3">ค้นหาและเลือกสิ่งของ</h3>
            <p class="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">เลือกหมวดหมู่ ระบุวันที่ต้องการใช้งาน และเลือกสิ่งของหรือยานพาหนะที่ถูกใจจากผู้ให้เช่าที่น่าเชื่อถือ</p>
          </div>
          <div class="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center hover:bg-white/10 transition">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl sm:text-2xl font-black mb-5 shadow-lg shadow-indigo-600/30">2</div>
            <h3 class="text-lg sm:text-xl font-bold mb-3">จองและชำระเงินปลอดภัย</h3>
            <p class="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">ส่งคำขอเช่าและชำระเงินผ่านระบบ Escrow ปลอดภัย 100% เงินจะถูกพักไว้จนกว่าคุณจะได้รับสินค้าจริง</p>
          </div>
          <div class="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center hover:bg-white/10 transition">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl sm:text-2xl font-black mb-5 shadow-lg shadow-indigo-600/30">3</div>
            <h3 class="text-lg sm:text-xl font-bold mb-3">รับของและสนุกกับการใช้งาน</h3>
            <p class="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">นัดรับของหรือกุญแจรถ ตรวจสอบสภาพสินค้า เพลิดเพลินกับการใช้งาน และส่งคืนตามกำหนดเวลา</p>
          </div>
        </div>
      </div>

    </div>

    <!-- 🏢 Footer อย่างเป็นทางการ -->
    <footer class="w-full bg-slate-950 text-slate-400 pt-16 sm:pt-20 pb-12 md:pb-16 border-t border-slate-800">
      <div class="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 border-b border-slate-800 pb-12 sm:pb-16">
          <div class="md:col-span-1">
            <h3 class="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 sm:mb-5 flex items-center gap-2">
              <span class="bg-indigo-600 text-white p-1.5 rounded-lg text-lg">R</span> RentAll
            </h3>
            <p class="text-sm leading-relaxed mb-6 font-medium text-slate-400">
              แพลตฟอร์มเช่ายืมทุกสิ่งครบวงจร เชื่อมโยงผู้คน รถยนต์ อสังหาริมทรัพย์ และสิ่งของไว้ในที่เดียว ปลอดภัย มั่นใจได้ 100%
            </p>
          </div>
          <div>
             <h4 class="font-bold text-white mb-4 sm:mb-6 text-base sm:text-lg tracking-wide">สำรวจ</h4>
             <ul class="space-y-3 sm:space-y-4 text-sm font-medium">
               <li><RouterLink to="/search?category=รถยนต์/ยานพาหนะ" class="hover:text-indigo-400 transition">เช่ารถยนต์และยานพาหนะ</RouterLink></li>
               <li><RouterLink to="/search?category=อสังหาริมทรัพย์" class="hover:text-indigo-400 transition">เช่าที่พักและอสังหาฯ</RouterLink></li>
               <li><RouterLink to="/search?category=กล้องและเลนส์" class="hover:text-indigo-400 transition">เช่าอุปกรณ์ถ่ายภาพ</RouterLink></li>
               <li><RouterLink to="/search" class="hover:text-indigo-400 transition">ดูหมวดหมู่ทั้งหมด</RouterLink></li>
             </ul>
          </div>
          <div>
             <h4 class="font-bold text-white mb-4 sm:mb-6 text-base sm:text-lg tracking-wide">สำหรับผู้ใช้งาน</h4>
             <ul class="space-y-3 sm:space-y-4 text-sm font-medium">
               <li><RouterLink to="/lender/register" class="hover:text-indigo-400 transition">สมัครเป็นผู้ให้เช่า (Lender)</RouterLink></li>
               <li><RouterLink to="/help" class="hover:text-indigo-400 transition">ศูนย์ช่วยเหลือผู้ใช้งาน</RouterLink></li>
               <li><RouterLink to="/contract" class="hover:text-indigo-400 transition">สัญญาระบบเช่ายืม</RouterLink></li>
               <li><RouterLink to="/about" class="hover:text-indigo-400 transition">เกี่ยวกับ RentAll</RouterLink></li>
             </ul>
          </div>
          <div>
             <h4 class="font-bold text-white mb-4 sm:mb-6 text-base sm:text-lg tracking-wide">ติดต่อเรา</h4>
             <ul class="space-y-3 sm:space-y-4 text-sm font-medium">
               <li class="flex items-start gap-3">
                 <svg class="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                 <span>123 อาคารสาทรสแควร์ ชั้น 15 ถนนสาทร กรุงเทพมหานคร 10120</span>
               </li>
               <li class="flex items-start gap-3">
                 <svg class="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                 <span>support@rentall.co.th</span>
               </li>
             </ul>
          </div>
        </div>
        <div class="flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm mt-8 font-medium gap-4">
          <p>&copy; 2026 RentAll Platform. All rights reserved.</p>
          <div class="flex gap-4">
            <a href="#" class="hover:text-white transition">ข้อกำหนดและเงื่อนไข</a>
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