<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 🎯 Filter State
const searchQuery = ref(route.query.q || '')
const selectedCategory = ref(route.query.category || 'ทั้งหมด')
const priceMin = ref(0)
const priceMax = ref(10000)
const selectedLocation = ref('ทั้งหมด')
const minRating = ref(0)
const sortBy = ref('recommended') // recommended, price_asc, price_desc, rating
const isMobileFilterOpen = ref(false)

const categories = ['ทั้งหมด', 'รถยนต์/ยานพาหนะ', 'อสังหาริมทรัพย์', 'กล้องและเลนส์', 'อุปกรณ์แคมป์ปิ้ง', 'ชุดออกงาน', 'เครื่องมือช่าง', 'อุปกรณ์เกมมิ่ง']
const locations = ['ทั้งหมด', 'กทม.', 'เชียงใหม่', 'ชลบุรี', 'ภูเก็ต', 'ปทุมธานี']

// 📦 Mock Data
const allItems = ref([
  { id: 1, title: 'Tesla Model 3 Long Range ขับเคลื่อน 4 ล้อ', price: 2900, rating: 5.0, reviews: 42, location: 'กทม.', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800', category: 'รถยนต์/ยานพาหนะ', lender: { name: 'คุณธน ์', avatar: 'https://i.pravatar.cc/150?u=10' } },
  { id: 2, title: 'คอนโดหรู ใจกลางสาทร วิวสระว่ายน้ำพาโนรามา', price: 1800, rating: 4.9, reviews: 88, location: 'กทม.', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800', category: 'อสังหาริมทรัพย์', lender: { name: 'BangkokStay', avatar: 'https://i.pravatar.cc/150?u=11' } },
  { id: 3, title: 'Sony A7IV พร้อมเลนส์ 24-70mm GM II สภาพใหม่', price: 1500, rating: 4.8, reviews: 34, location: 'กทม.', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', category: 'กล้องและเลนส์', lender: { name: 'คุณนัท', avatar: 'https://i.pravatar.cc/150?u=1' } },
  { id: 4, title: 'เต็นท์ Coleman 4-5 คน ทรงเคบิน กันฝน 100%', price: 450, rating: 4.8, reviews: 128, location: 'เชียงใหม่', image: 'https://images.unsplash.com/photo-1504280390267-33d0ef3c675c?auto=format&fit=crop&q=80&w=800', category: 'อุปกรณ์แคมป์ปิ้ง', lender: { name: 'CampLife', avatar: 'https://i.pravatar.cc/150?u=2' } },
  { id: 5, title: 'BMW Series 5 M-Sport สีขาวมุก เบาะหนังแท้', price: 3500, rating: 4.9, reviews: 21, location: 'กทม.', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800', category: 'รถยนต์/ยานพาหนะ', lender: { name: 'PremiumCars', avatar: 'https://i.pravatar.cc/150?u=3' } },
  { id: 6, title: 'พูลวิลล่า พัทยา 4 ห้องนอน คาราโอเกะ สระว่ายน้ำ', price: 6500, rating: 4.7, reviews: 56, location: 'ชลบุรี', image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800', category: 'อสังหาริมทรัพย์', lender: { name: 'PattayaVillas', avatar: 'https://i.pravatar.cc/150?u=4' } },
  { id: 7, title: 'DJI Mavic 3 Pro โดรนถ่ายภาพยนตร์ เซนเซอร์ 3 ตัว', price: 1200, rating: 5.0, reviews: 15, location: 'กทม.', image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800', category: 'กล้องและเลนส์', lender: { name: 'FlyHigh', avatar: 'https://i.pravatar.cc/150?u=5' } },
  { id: 8, title: 'ชุดโต๊ะเก้าอี้สนาม Snow Peak ครบชุด 4 ที่นั่ง', price: 300, rating: 4.9, reviews: 45, location: 'ปทุมธานี', image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800', category: 'อุปกรณ์แคมป์ปิ้ง', lender: { name: 'Outdoorsy', avatar: 'https://i.pravatar.cc/150?u=6' } },
  { id: 9, title: 'เครื่องเล่น PlayStation 5 พร้อม 2 จอยเกมแท้', price: 400, rating: 4.8, reviews: 92, location: 'กทม.', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800', category: 'อุปกรณ์เกมมิ่ง', lender: { name: 'GameZone', avatar: 'https://i.pravatar.cc/150?u=7' } }
])

// 🎯 Filter & Sort Logic
const filteredItems = computed(() => {
  let result = allItems.value.filter(item => {
    const matchQuery = item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCategory = selectedCategory.value === 'ทั้งหมด' || item.category === selectedCategory.value
    const matchLocation = selectedLocation.value === 'ทั้งหมด' || item.location.includes(selectedLocation.value)
    const matchPrice = item.price >= priceMin.value && item.price <= priceMax.value
    const matchRating = item.rating >= minRating.value
    return matchQuery && matchCategory && matchLocation && matchPrice && matchRating
  })

  if (sortBy.value === 'price_asc') result.sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price_desc') result.sort((a, b) => b.price - a.price)
  if (sortBy.value === 'rating') result.sort((a, b) => b.rating - a.rating)

  return result
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'ทั้งหมด'
  priceMin.value = 0
  priceMax.value = 10000
  selectedLocation.value = 'ทั้งหมด'
  minRating.value = 0
  sortBy.value = 'recommended'
  isMobileFilterOpen.value = false
}

watch(() => route.query, (newQuery) => {
  if (newQuery.q !== undefined) searchQuery.value = newQuery.q
  if (newQuery.category) selectedCategory.value = newQuery.category
})
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen font-sans pb-24 lg:pb-16">
    
    <!-- 🔍 Top Search Sticky Bar -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-3.5 md:py-4">
        <div class="flex items-center gap-3">
          <div class="relative flex-1">
            <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="ค้นหารถยนต์, คอนโด, กล้อง, แคมป์ปิ้ง..." 
              class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition"
            />
          </div>

          <!-- ปุ่มเปิดตัวกรองในมือถือ -->
          <button 
            @click="isMobileFilterOpen = true" 
            class="lg:hidden flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-2xl text-xs font-bold shadow-md flex-shrink-0"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
            ตัวกรอง
          </button>
        </div>

        <!-- แท็กหมวดหมู่เลื่อนแนวนอน (เหมาะกับทั้งมือถือและคอม) -->
        <div class="flex gap-2 overflow-x-auto pt-3 pb-1 scrollbar-hide text-xs">
          <button 
            v-for="cat in categories" 
            :key="cat" 
            @click="selectedCategory = cat"
            :class="[
              'px-4 py-2 rounded-xl font-bold whitespace-nowrap transition border',
              selectedCategory === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8">
      <div class="flex flex-col lg:flex-row gap-8 items-start">
        
        <!-- ⬅️ Sidebar Filters (Desktop View) -->
        <aside class="hidden lg:block w-72 flex-shrink-0 sticky top-36 bg-white p-6 rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="font-black text-slate-900 text-lg">ตัวกรองละเอียด</h3>
            <button @click="resetFilters" class="text-xs font-bold text-indigo-600 hover:underline">รีเซ็ต</button>
          </div>

          <!-- จังหวัด -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">จังหวัด / สถานที่</label>
            <select v-model="selectedLocation" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-indigo-600 cursor-pointer">
              <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
            </select>
          </div>

          <!-- ช่วงราคา -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs font-bold text-slate-500 uppercase">งบประมาณ / วัน</label>
              <span class="text-xs font-black text-indigo-600">สูงสุด ฿{{ priceMax.toLocaleString() }}</span>
            </div>
            <input type="range" v-model.number="priceMax" min="300" max="10000" step="100" class="w-full accent-indigo-600 cursor-pointer" />
            <div class="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
              <span>฿300</span>
              <span>฿10,000+</span>
            </div>
          </div>

          <!-- คะแนนรีวิว -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">คะแนนรีวิว</label>
            <div class="grid grid-cols-2 gap-2">
              <button 
                v-for="r in [0, 4.0, 4.5, 4.8]" 
                :key="r" 
                @click="minRating = r"
                :class="[
                  'py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1',
                  minRating === r ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                ]"
              >
                <svg class="w-3.5 h-3.5 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                {{ r === 0 ? 'ทั้งหมด' : `${r} ขึ้นไป` }}
              </button>
            </div>
          </div>
        </aside>

        <!-- ➡️ Main Listing Grid -->
        <main class="flex-1 w-full">
          
          <!-- Bar สรุปยอด และ เรียงลำดับ -->
          <div class="flex justify-between items-center mb-6">
            <p class="text-xs md:text-sm font-bold text-slate-500">
              พบสินค้า <span class="text-indigo-600 font-black">{{ filteredItems.length }}</span> รายการ
            </p>

            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-400 hidden sm:inline">เรียงตาม:</span>
              <select v-model="sortBy" class="bg-white border border-slate-200 text-xs font-bold rounded-xl px-3 py-2 text-slate-700 outline-none cursor-pointer focus:border-indigo-600 shadow-sm">
                <option value="recommended">แนะนำสำหรับคุณ</option>
                <option value="price_asc">ราคา: ต่ำไปสูง</option>
                <option value="price_desc">ราคา: สูงไปต่ำ</option>
                <option value="rating">คะแนนรีวิวสูงสุด</option>
              </select>
            </div>
          </div>

          <!-- Cards Grid -->
          <div v-if="filteredItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <div 
              v-for="item in filteredItems" 
              :key="item.id" 
              @click="router.push(`/item/${item.id}`)"
              class="group cursor-pointer bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_25px_rgb(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
            >
              <!-- รูปสินค้า -->
              <div class="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img :src="item.image" class="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
                <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black text-slate-800 shadow-sm">
                  {{ item.category.split('/')[0] }}
                </span>
              </div>

              <!-- รายละเอียดการ์ด -->
              <div class="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-center gap-2 mb-2">
                    <span class="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg text-xs font-black text-amber-700">
                      <svg class="w-3.5 h-3.5 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      {{ item.rating }} <span class="text-slate-400 font-normal">({{ item.reviews }})</span>
                    </span>
                    <span class="inline-flex items-center gap-1 text-slate-400 text-xs font-bold truncate">
                      <svg class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      {{ item.location }}
                    </span>
                  </div>
                  <h4 class="font-black text-slate-900 text-base leading-snug line-clamp-2 mb-4 group-hover:text-indigo-600 transition">{{ item.title }}</h4>
                </div>

                <div class="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <img :src="item.lender.avatar" class="w-7 h-7 rounded-full border border-slate-200 object-cover" />
                    <span class="text-xs font-bold text-slate-500 truncate max-w-[80px]">{{ item.lender.name }}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-lg font-black text-indigo-600">฿{{ item.price.toLocaleString() }}</span>
                    <span class="text-[10px] font-bold text-slate-400">/วัน</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm px-4">
            <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <h3 class="text-xl font-black text-slate-800">ไม่พบรายการที่ตรงกับเงื่อนไข</h3>
            <p class="text-xs md:text-sm text-slate-400 mt-1 max-w-sm mx-auto">ลองปรับช่วงราคาหรือเคลียร์ตัวกรองเพื่อค้นหาไอเทมใหม่</p>
            <button @click="resetFilters" class="mt-5 bg-slate-900 text-white text-xs font-bold px-6 py-3 rounded-xl shadow hover:bg-slate-800 transition">ล้างตัวกรองทั้งหมด</button>
          </div>
        </main>
      </div>
    </div>

    <!-- 📱 Mobile Filter Drawer / Bottom Sheet -->
    <div v-if="isMobileFilterOpen" class="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="isMobileFilterOpen = false"></div>
      
      <div class="relative bg-white rounded-t-[2.5rem] p-6 max-h-[85vh] overflow-y-auto z-10 space-y-6 animate-slide-up shadow-2xl">
        <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2"></div>
        <div class="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 class="font-black text-slate-900 text-lg">ตัวกรองการค้นหา</h3>
          <button @click="isMobileFilterOpen = false" class="text-slate-400 hover:text-slate-600 p-1">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-600 uppercase mb-2">จังหวัด</label>
          <select v-model="selectedLocation" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none">
            <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
          </select>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-xs font-bold text-slate-600 uppercase">งบประมาณต่อวัน</label>
            <span class="text-xs font-black text-indigo-600">฿{{ priceMax.toLocaleString() }}</span>
          </div>
          <input type="range" v-model.number="priceMax" min="300" max="10000" step="100" class="w-full accent-indigo-600" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-600 uppercase mb-2">คะแนนรีวิว</label>
          <div class="grid grid-cols-2 gap-2">
            <button 
              v-for="r in [0, 4.0, 4.5, 4.8]" 
              :key="r" 
              @click="minRating = r"
              :class="['py-2.5 rounded-xl text-xs font-bold border', minRating === r ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200']"
            >
              {{ r === 0 ? 'ทุกคะแนน' : `${r} ดาวขึ้นไป` }}
            </button>
          </div>
        </div>

        <div class="flex gap-3 pt-4 border-t border-slate-100">
          <button @click="resetFilters" class="flex-1 py-3.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm">ล้างค่า</button>
          <button @click="isMobileFilterOpen = false" class="flex-1 py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-200">ดูผลลัพธ์ ({{ filteredItems.length }})</button>
        </div>
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