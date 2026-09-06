<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useItems } from '@/composables/useItems'

const route = useRoute()
const router = useRouter()
const { items, fetchItems, isLoading } = useItems() // 🟢 ดึงข้อมูลจากฐานข้อมูลจริง

// 🎯 Filter State
const searchQuery = ref(route.query.q || '')
const selectedCategory = ref(route.query.category || 'ทั้งหมด')
const priceMax = ref(10000)
const selectedLocation = ref('ทั้งหมด')
const minRating = ref(0)
const sortBy = ref('recommended') 
const isMobileFilterOpen = ref(false)

const categories = ['ทั้งหมด', 'รถยนต์/ยานพาหนะ', 'อสังหาริมทรัพย์', 'กล้องและเลนส์', 'อุปกรณ์แคมป์ปิ้ง', 'ชุดออกงาน', 'เครื่องมือช่าง', 'อุปกรณ์เกมมิ่ง']
const locations = ['ทั้งหมด', 'กทม.', 'เชียงใหม่', 'ชลบุรี', 'ภูเก็ต', 'ปทุมธานี']

onMounted(() => {
  fetchItems()
  window.scrollTo(0, 0)
})

// 🎯 Logic กรองข้อมูล
const filteredItems = computed(() => {
  if (!items.value) return []
  
  let result = items.value.filter(item => {
    const matchQuery = item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCategory = selectedCategory.value === 'ทั้งหมด' || item.category === selectedCategory.value
    const matchLocation = selectedLocation.value === 'ทั้งหมด' || item.location.includes(selectedLocation.value)
    const matchPrice = item.price_daily <= priceMax.value // อิงตาม price_daily ในฐานข้อมูล
    const matchRating = item.rating >= minRating.value
    return matchQuery && matchCategory && matchLocation && matchPrice && matchRating
  })

  // ระบบเรียงลำดับ
  if (sortBy.value === 'price_asc') result.sort((a, b) => a.price_daily - b.price_daily)
  if (sortBy.value === 'price_desc') result.sort((a, b) => b.price_daily - a.price_daily)
  if (sortBy.value === 'rating') result.sort((a, b) => b.rating - a.rating)

  return result
})

const executeSearch = () => {
  router.push({ path: '/search', query: { q: searchQuery.value, category: selectedCategory.value } })
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'ทั้งหมด'
  priceMax.value = 10000
  selectedLocation.value = 'ทั้งหมด'
  minRating.value = 0
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
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-3 md:py-4">
        <div class="flex items-center gap-3">
          <div class="relative flex-1">
            <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input 
              v-model="searchQuery" 
              @keyup.enter="executeSearch"
              type="text" 
              placeholder="ค้นหารถยนต์, กล้อง, เต็นท์..." 
              class="w-full pl-11 pr-4 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition"
            />
          </div>

          <!-- ปุ่มเปิดตัวกรองในมือถือ -->
          <button 
            @click="isMobileFilterOpen = true" 
            class="lg:hidden flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md flex-shrink-0"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
            ตัวกรอง
          </button>
        </div>

        <!-- แท็กหมวดหมู่เลื่อนแนวนอน -->
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
      <div class="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
        
        <!-- ⬅️ Sidebar Filters (Desktop) -->
        <aside class="hidden lg:block w-72 flex-shrink-0 sticky top-36 bg-white p-6 rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="font-black text-slate-900 text-lg">ตัวกรองละเอียด</h3>
            <button @click="resetFilters" class="text-xs font-bold text-indigo-600 hover:underline">รีเซ็ต</button>
          </div>

          <!-- จังหวัด -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">จังหวัด / สถานที่</label>
            <select v-model="selectedLocation" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600 cursor-pointer">
              <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
            </select>
          </div>

          <!-- ช่วงราคา -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs font-bold text-slate-500 uppercase">งบสูงสุด / วัน</label>
              <span class="text-sm font-black text-indigo-600">฿{{ priceMax.toLocaleString() }}</span>
            </div>
            <input type="range" v-model.number="priceMax" min="300" max="20000" step="100" class="w-full accent-indigo-600 cursor-pointer" />
          </div>

          <!-- คะแนนรีวิว -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">คะแนนรีวิวขั้นต่ำ</label>
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
                <svg v-if="r !== 0" class="w-3.5 h-3.5 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                {{ r === 0 ? 'ทั้งหมด' : `${r} ขึ้นไป` }}
              </button>
            </div>
          </div>
        </aside>

        <!-- ➡️ Main Listing Grid -->
        <main class="flex-1 w-full">
          
          <!-- Bar สรุปยอด และ เรียงลำดับ -->
          <div class="flex justify-between items-center mb-4 md:mb-6">
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

          <!-- 🟢 แสดงสถานะ Loading -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-slate-400">
            <svg class="animate-spin h-8 w-8 mb-4 text-indigo-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p class="text-sm font-bold">กำลังโหลดข้อมูล...</p>
          </div>

          <!-- 🟢 Cards Grid (ปรับเป็น 2 คอลัมน์ในมือถือ grid-cols-2) -->
          <div v-else-if="filteredItems.length > 0" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div 
              v-for="item in filteredItems" 
              :key="item.id" 
              @click="router.push(`/item/${item.id}`)"
              class="group cursor-pointer bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-[0_4px_15px_rgb(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
            >
              <!-- รูปสินค้า -->
              <div class="relative aspect-square md:aspect-[4/3] bg-slate-100 overflow-hidden">
                <img :src="item.images && item.images[0] ? item.images[0] : ''" class="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
                <span class="absolute top-2 left-2 md:top-3 md:left-3 bg-white/90 backdrop-blur-md px-2 py-1 md:px-3 md:py-1 rounded-lg md:rounded-full text-[9px] md:text-[11px] font-black text-slate-800 shadow-sm line-clamp-1 max-w-[80%]">
                  {{ item.category.split('/')[0] }}
                </span>
              </div>

              <!-- รายละเอียดการ์ด (ย่อขนาดสำหรับมือถือ) -->
              <div class="p-3 md:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-center gap-1 mb-1.5 md:mb-2">
                    <span class="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 px-1.5 py-0.5 md:px-2 rounded-md text-[9px] md:text-xs font-black text-amber-700">
                      <svg class="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      {{ item.rating }}
                    </span>
                    <span class="inline-flex items-center gap-0.5 text-slate-400 text-[9px] md:text-xs font-bold truncate max-w-[50%]">
                      <svg class="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      {{ item.location }}
                    </span>
                  </div>
                  <h4 class="font-black text-slate-900 text-xs md:text-base leading-snug line-clamp-2 mb-3 md:mb-4 group-hover:text-indigo-600 transition">{{ item.title }}</h4>
                </div>

                <div class="pt-2 md:pt-4 border-t border-slate-100 flex justify-between items-end">
                  <div class="flex items-center gap-1.5 w-1/2">
                    <img :src="item.lender?.avatar_url || 'https://ui-avatars.com/api/?name=U'" class="hidden sm:block w-5 h-5 md:w-6 md:h-6 rounded-full border border-slate-200 object-cover flex-shrink-0" />
                    <span class="text-[9px] md:text-xs font-bold text-slate-500 truncate w-full">{{ item.lender?.first_name || 'Lender' }}</span>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <span class="text-sm md:text-lg font-black text-indigo-600">฿{{ item.price_daily.toLocaleString() }}</span>
                    <span class="text-[8px] md:text-[10px] font-bold text-slate-400 block -mt-1 md:inline md:mt-0"> /วัน</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm px-4">
            <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <h3 class="text-lg md:text-xl font-black text-slate-800">ไม่พบรายการที่ตรงกับเงื่อนไข</h3>
            <p class="text-xs md:text-sm text-slate-400 mt-1 max-w-sm mx-auto">ลองปรับช่วงราคาหรือเคลียร์ตัวกรองเพื่อค้นหาสินค้าใหม่</p>
            <button @click="resetFilters" class="mt-5 bg-slate-900 text-white text-xs md:text-sm font-bold px-6 py-3 rounded-xl shadow hover:bg-slate-800 transition">ล้างตัวกรองทั้งหมด</button>
          </div>
        </main>
      </div>
    </div>

    <!-- 📱 Mobile Filter Drawer / Bottom Sheet -->
    <div v-if="isMobileFilterOpen" class="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="isMobileFilterOpen = false"></div>
      
      <div class="relative bg-white rounded-t-[2.5rem] p-6 max-h-[85vh] overflow-y-auto z-10 space-y-6 animate-slide-up shadow-2xl pb-safe">
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
            <label class="text-xs font-bold text-slate-600 uppercase">งบประมาณสูงสุดต่อวัน</label>
            <span class="text-sm font-black text-indigo-600">฿{{ priceMax.toLocaleString() }}</span>
          </div>
          <input type="range" v-model.number="priceMax" min="300" max="20000" step="100" class="w-full accent-indigo-600" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-600 uppercase mb-2">คะแนนรีวิวขั้นต่ำ</label>
          <div class="grid grid-cols-2 gap-2">
            <button 
              v-for="r in [0, 4.0, 4.5, 4.8]" 
              :key="r" 
              @click="minRating = r"
              :class="['py-2.5 rounded-xl text-xs font-bold border transition', minRating === r ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-slate-50 text-slate-600 border-slate-200']"
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
.pb-safe { padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 1.5rem); }
</style>