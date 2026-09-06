<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useItems } from '@/composables/useItems'

const route = useRoute()
const router = useRouter()
const { items, fetchItems, isLoading } = useItems() // 🟢 เรียกใช้ Data จริง

const searchQuery = ref(route.query.q || '')
const selectedCategory = ref(route.query.category || 'ทั้งหมด')
const priceMax = ref(10000)
const selectedLocation = ref('ทั้งหมด')
const minRating = ref(0)
const sortBy = ref('recommended') 

const categories = ['ทั้งหมด', 'รถยนต์/ยานพาหนะ', 'อสังหาริมทรัพย์', 'กล้องและเลนส์', 'อุปกรณ์แคมป์ปิ้ง', 'ชุดออกงาน', 'เครื่องมือช่าง', 'อุปกรณ์เกมมิ่ง']
const locations = ['ทั้งหมด', 'กทม.', 'เชียงใหม่', 'ชลบุรี', 'ภูเก็ต', 'ปทุมธานี']

onMounted(() => {
  fetchItems()
})

const filteredItems = computed(() => {
  if (!items.value) return []
  
  let result = items.value.filter(item => {
    const matchQuery = item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCategory = selectedCategory.value === 'ทั้งหมด' || item.category === selectedCategory.value
    const matchLocation = selectedLocation.value === 'ทั้งหมด' || item.location.includes(selectedLocation.value)
    const matchPrice = item.price_daily <= priceMax.value // 🟢 ใช้ price_daily ตามฐานข้อมูล
    const matchRating = item.rating >= minRating.value
    return matchQuery && matchCategory && matchLocation && matchPrice && matchRating
  })

  if (sortBy.value === 'price_asc') result.sort((a, b) => a.price_daily - b.price_daily)
  if (sortBy.value === 'price_desc') result.sort((a, b) => b.price_daily - a.price_daily)
  if (sortBy.value === 'rating') result.sort((a, b) => b.rating - a.rating)

  return result
})

const executeSearch = () => {
  router.push({ path: '/search', query: { q: searchQuery.value, category: selectedCategory.value } })
}
const resetFilters = () => {
  searchQuery.value = ''; selectedCategory.value = 'ทั้งหมด'; priceMax.value = 10000; selectedLocation.value = 'ทั้งหมด'; minRating.value = 0;
}

watch(() => route.query, (newQuery) => {
  if (newQuery.q !== undefined) searchQuery.value = newQuery.q
  if (newQuery.category) selectedCategory.value = newQuery.category
})
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen font-sans pb-20">
    <!-- Search Bar ด้านบน -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div class="max-w-[1400px] mx-auto px-4 md:px-10 py-3.5">
        <div class="flex items-center gap-3">
          <input v-model="searchQuery" @keyup.enter="executeSearch" type="text" placeholder="ค้นหาสินค้า..." class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none" />
        </div>
        <div class="flex gap-2 overflow-x-auto pt-3 pb-1 scrollbar-hide text-xs">
          <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat" :class="['px-4 py-2 rounded-xl font-bold whitespace-nowrap border', selectedCategory === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50']">
            {{ cat }}
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-[1400px] mx-auto px-4 md:px-10 py-6 md:py-8">
      <div class="flex flex-col lg:flex-row gap-8 items-start">
        
        <!-- Sidebar Filters -->
        <aside class="hidden lg:block w-72 flex-shrink-0 sticky top-36 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div class="flex justify-between items-center"><h3 class="font-black text-lg">ตัวกรอง</h3><button @click="resetFilters" class="text-xs text-indigo-600 font-bold">รีเซ็ต</button></div>
          <div><label class="block text-xs font-bold text-slate-500 mb-2">จังหวัด</label>
          <select v-model="selectedLocation" class="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold outline-none"><option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option></select></div>
          <div><label class="block text-xs font-bold text-slate-500 mb-2">งบประมาณต่อวัน</label>
          <input type="range" v-model.number="priceMax" min="300" max="20000" step="100" class="w-full accent-indigo-600" />
          <p class="text-xs font-black text-indigo-600 mt-1">สูงสุด ฿{{ priceMax.toLocaleString() }}</p></div>
        </aside>

        <!-- Main Listing -->
        <main class="flex-1 w-full">
          <div class="flex justify-between items-center mb-6">
            <p class="text-sm font-bold text-slate-500">พบสินค้า <span class="text-indigo-600">{{ filteredItems.length }}</span> รายการ</p>
            <select v-model="sortBy" class="bg-white border rounded-xl px-3 py-2 text-xs font-bold outline-none"><option value="recommended">แนะนำ</option><option value="price_asc">ราคา: ต่ำไปสูง</option><option value="price_desc">ราคา: สูงไปต่ำ</option></select>
          </div>

          <div v-if="isLoading" class="text-center py-20 text-slate-400">กำลังโหลด...</div>
          <div v-else-if="filteredItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <!-- Product Card -->
            <div v-for="item in filteredItems" :key="item.id" @click="router.push(`/item/${item.id}`)" class="group cursor-pointer bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition flex flex-col overflow-hidden">
              <div class="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                <img :src="item.images[0]" class="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              </div>
              <div class="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 class="font-black text-slate-900 text-base line-clamp-2 mb-4">{{ item.title }}</h4>
                </div>
                <div class="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <img :src="item.lender?.avatar_url" class="w-7 h-7 rounded-full border object-cover" />
                    <span class="text-xs font-bold text-slate-500 truncate max-w-[80px]">{{ item.lender?.first_name || 'Lender' }}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-lg font-black text-indigo-600">฿{{ item.price_daily.toLocaleString() }}</span>
                    <span class="text-[10px] font-bold text-slate-400">/วัน</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-24 bg-white rounded-3xl border shadow-sm">ไม่พบสินค้า</div>
        </main>
      </div>
    </div>
  </div>
</template>