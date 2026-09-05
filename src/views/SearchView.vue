<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const searchQuery = ref(route.query.q || '')
const selectedCategory = ref(route.query.category || 'ทั้งหมด')

// อัปเดตเมื่อ URL เปลี่ยน
watch(() => route.query, (newQuery) => {
  searchQuery.value = newQuery.q || ''
  selectedCategory.value = newQuery.category || 'ทั้งหมด'
})

const categories = ['ทั้งหมด', 'รถยนต์/ยานพาหนะ', 'อสังหาริมทรัพย์', 'กล้องและเลนส์', 'อุปกรณ์แคมป์ปิ้ง', 'ชุดออกงาน', 'เครื่องมือช่าง']

// 📦 ข้อมูลจำลอง (Mock Data)
const allItems = ref([
  { id: 1, title: 'Tesla Model 3 Long Range ขับเคลื่อน 4 ล้อ', price: 2900, rating: 5.0, reviews: 42, location: 'สุขุมวิท, กทม.', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800', category: 'รถยนต์/ยานพาหนะ', lender: { name: 'คุณธน ์', avatar: 'https://i.pravatar.cc/150?u=10' } },
  { id: 2, title: 'คอนโดหรู ใจกลางสาทร วิวสระว่ายน้ำส่วนตัว', price: 1800, rating: 4.9, reviews: 88, location: 'สาทร, กทม.', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800', category: 'อสังหาริมทรัพย์', lender: { name: 'BangkokStay', avatar: 'https://i.pravatar.cc/150?u=11' } },
  { id: 3, title: 'Sony A7IV พร้อมเลนส์ 24-70mm GM II สภาพใหม่', price: 1500, rating: 4.9, reviews: 34, location: 'สยาม, กทม.', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', category: 'กล้องและเลนส์', lender: { name: 'คุณนัท', avatar: 'https://i.pravatar.cc/150?u=1' } },
  { id: 4, title: 'เต็นท์ Coleman 4-5 คน ทรงเคบิน กันฝน 100%', price: 450, rating: 4.8, reviews: 128, location: 'เมือง, เชียงใหม่', image: 'https://images.unsplash.com/photo-1504280390267-33d0ef3c675c?auto=format&fit=crop&q=80&w=800', category: 'อุปกรณ์แคมป์ปิ้ง', lender: { name: 'CampLife', avatar: 'https://i.pravatar.cc/150?u=2' } },
  { id: 5, title: 'BMW Series 5 M-Sport สีขาวมุก', price: 3500, rating: 4.9, reviews: 21, location: 'บางนา, กทม.', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800', category: 'รถยนต์/ยานพาหนะ', lender: { name: 'PremiumCars', avatar: 'https://i.pravatar.cc/150?u=3' } },
  { id: 6, title: 'พูลวิลล่า พัทยา 4 ห้องนอน ปิ้งย่างได้', price: 6500, rating: 4.7, reviews: 56, location: 'พัทยา, ชลบุรี', image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800', category: 'อสังหาริมทรัพย์', lender: { name: 'PattayaVillas', avatar: 'https://i.pravatar.cc/150?u=4' } }
])

// ฟังก์ชันกรองข้อมูล
const filteredItems = computed(() => {
  let result = allItems.value

  // กรองตามคำค้นหา
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(item => item.title.toLowerCase().includes(q) || item.location.toLowerCase().includes(q))
  }

  // กรองตามหมวดหมู่
  if (selectedCategory.value !== 'ทั้งหมด') {
    result = result.filter(item => item.category === selectedCategory.value)
  }

  return result
})

const executeSearch = () => {
  const query = {}
  if (searchQuery.value) query.q = searchQuery.value
  if (selectedCategory.value !== 'ทั้งหมด') query.category = selectedCategory.value
  router.push({ path: '/search', query })
}
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen font-sans pb-20">
    
    <!-- 🔍 Search Header -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-4 md:py-6">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="w-full md:w-2/3 lg:w-1/2">
            <div class="relative flex items-center">
              <div class="absolute left-4 text-slate-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <input v-model="searchQuery" @keyup.enter="executeSearch" type="text" placeholder="ค้นหาสิ่งที่คุณต้องการ (เช่น รถยนต์, กล้อง, เชียงใหม่)..." class="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-800" />
              <button @click="executeSearch" class="absolute right-2 bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm text-sm">ค้นหา</button>
            </div>
          </div>
          <div class="text-sm font-bold text-slate-500 hidden md:block">
            พบสินค้าทั้งหมด <span class="text-indigo-600">{{ filteredItems.length }}</span> รายการ
          </div>
        </div>
        
        <!-- หมวดหมู่บนมือถือ -->
        <div class="flex gap-2 overflow-x-auto pb-2 mt-4 md:hidden scrollbar-hide">
          <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat; executeSearch()" :class="['flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition border', selectedCategory === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200']">
            {{ cat }}
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        
        <!-- ⬅️ Sidebar Filters (Desktop) -->
        <div class="hidden md:block w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 class="font-black text-slate-900 text-lg mb-4">หมวดหมู่</h3>
            <ul class="space-y-2">
              <li v-for="cat in categories" :key="cat">
                <button @click="selectedCategory = cat; executeSearch()" :class="['w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition flex justify-between items-center', selectedCategory === cat ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100']">
                  {{ cat }}
                  <svg v-if="selectedCategory === cat" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                </button>
              </li>
            </ul>
          </div>
          
          <hr class="border-slate-200" />
          
          <div>
            <h3 class="font-black text-slate-900 text-lg mb-4">ช่วงราคา (ต่อวัน)</h3>
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <input type="number" placeholder="ต่ำสุด" class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium outline-none focus:border-indigo-500" />
                <span class="text-slate-400">-</span>
                <input type="number" placeholder="สูงสุด" class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium outline-none focus:border-indigo-500" />
              </div>
              <button class="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 transition text-sm">ใช้ตัวกรอง</button>
            </div>
          </div>
        </div>

        <!-- ➡️ Main Content (Grid สินค้า) -->
        <div class="flex-grow">
          <div class="mb-4 md:hidden">
            <span class="text-sm font-bold text-slate-500">พบสินค้า <span class="text-indigo-600">{{ filteredItems.length }}</span> รายการ</span>
          </div>

          <div v-if="filteredItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            <div v-for="item in filteredItems" :key="item.id" @click="router.push(`/item/${item.id}`)" class="group cursor-pointer flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div class="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img :src="item.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div class="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                  {{ item.category.split('/')[0] }}
                </div>
              </div>
              
              <div class="p-5 flex flex-col flex-grow">
                <div class="flex justify-between items-center mb-2 gap-1">
                  <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md flex items-center gap-1">
                    <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    {{ item.rating }} <span class="text-amber-600/50">({{ item.reviews }})</span>
                  </span>
                  <span class="text-[11px] font-bold text-slate-400 truncate flex items-center gap-0.5">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    {{ item.location }}
                  </span>
                </div>
                <h3 class="font-black text-slate-800 text-base leading-snug line-clamp-2 mb-4">{{ item.title }}</h3>
                <hr class="border-slate-100 mb-4 mt-auto" />
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <img :src="item.lender.avatar" class="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover" />
                    <span class="text-xs font-bold text-slate-500 truncate max-w-[80px]">{{ item.lender.name }}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-lg font-black text-indigo-600">฿{{ item.price }}</span>
                    <span class="text-slate-400 text-[10px]">/วัน</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-32 bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <svg class="w-20 h-20 text-slate-300 mx-auto mb-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 10a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <h3 class="text-2xl font-black text-slate-800 mb-2">ไม่พบสินค้าที่คุณค้นหา</h3>
            <p class="text-slate-500 font-medium">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่ที่แตกต่างออกไป</p>
            <button @click="searchQuery=''; selectedCategory='ทั้งหมด'; executeSearch()" class="mt-6 font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-4">ล้างตัวกรองทั้งหมด</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>