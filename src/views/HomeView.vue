<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useItems } from '@/composables/useItems'

const router = useRouter()
const { items, fetchItems, isLoading } = useItems() // 🟢 เรียกใช้ Data จาก Supabase

const searchQuery = ref('')
const activeCategory = ref('ยอดนิยมสูงสุด')

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

onMounted(() => {
  fetchItems() // ดึงข้อมูลตอนเปิดหน้า
})

const handleSearch = () => {
  if (searchQuery.value) {
    router.push(`/search?q=${searchQuery.value}`)
  } else {
    router.push('/search')
  }
}

// 🎯 กรองสินค้าตามหมวดหมู่
const filteredItems = computed(() => {
  if (!items.value) return []
  if (activeCategory.value === 'ยอดนิยมสูงสุด') {
    return items.value.slice(0, 8) // แสดง 8 อันดับแรก
  }
  return items.value.filter(item => item.category === activeCategory.value)
})
</script>

<template>
  <div class="w-full overflow-x-hidden bg-[#F8FAFC] font-sans">
    
    <!-- Hero Banner (เหมือนเดิม) -->
    <div class="relative w-full min-h-[75vh] md:min-h-[85vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-10 py-12 md:py-16">
      <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-indigo-950/80 to-[#F8FAFC]"></div>
      
      <div class="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center pt-8 md:pt-12">
        <h1 class="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 md:mb-6 tracking-tight leading-tight drop-shadow-lg">
          เช่ารถ บ้านพัก หรือของใช้ <br class="hidden md:block"/> จบครบในที่เดียว
        </h1>
        
        <!-- Search Box -->
        <div class="w-full max-w-2xl bg-white p-1.5 sm:p-2 md:p-3 rounded-full shadow-[0_20px_50px_rgb(0,0,0,0.15)] flex items-center border border-white/50 backdrop-blur-md transition-all hover:shadow-[0_20px_50px_rgb(79,70,229,0.2)]">
          <div class="flex-grow flex items-center pl-3 sm:pl-4 md:pl-6">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <input v-model="searchQuery" @keyup.enter="handleSearch" type="text" placeholder="ค้นหารถยนต์, คอนโด, กล้อง..." class="w-full bg-transparent outline-none text-slate-800 text-xs sm:text-sm md:text-base font-medium py-2.5 sm:py-3" />
          </div>
          <button @click="handleSearch" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-bold shadow-lg">ค้นหา</button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12">
      
      <!-- Categories -->
      <div class="flex flex-col items-center mb-8 md:mb-10">
        <div class="w-full flex overflow-x-auto gap-4 sm:gap-6 md:gap-10 pb-4 scrollbar-hide pt-2 justify-start lg:justify-center px-2">
          <button v-for="cat in categories" :key="cat.name" @click="activeCategory = cat.name" class="flex flex-col items-center justify-center group flex-shrink-0 w-18 sm:w-20">
            <div :class="['w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all shadow-sm group-hover:-translate-y-1', activeCategory === cat.name ? 'bg-indigo-600 text-white ring-4 ring-indigo-600/20 scale-110' : 'bg-white text-slate-600 border border-slate-200']">
               <span class="text-2xl">✨</span> <!-- ใส่ SVG ไอคอนตามโค้ดเดิมของคุณได้เลยครับ -->
            </div>
            <span :class="['text-[11px] md:text-sm font-bold mt-3 text-center line-clamp-1', activeCategory === cat.name ? 'text-indigo-600' : 'text-slate-600']">{{ cat.name }}</span>
          </button>
        </div>
      </div>

      <!-- Featured Items -->
      <div class="mb-16 md:mb-24">
        <div class="flex justify-between items-end mb-6 md:mb-8">
          <div>
            <h2 class="text-xl sm:text-2xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              {{ activeCategory === 'ยอดนิยมสูงสุด' ? 'รายการสินค้าแนะนำ' : `รายการ ${activeCategory}` }}
            </h2>
          </div>
          <button @click="router.push(`/search?category=${activeCategory}`)" class="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">ดูทั้งหมด →</button>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-20 text-slate-400">
          <svg class="animate-spin h-8 w-8 mx-auto mb-4 text-indigo-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          กำลังโหลดข้อมูล...
        </div>

        <div v-else-if="filteredItems.length > 0" class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          <div v-for="item in filteredItems" :key="item.id" @click="router.push(`/item/${item.id}`)" class="group cursor-pointer flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden">
            <div class="relative aspect-square md:aspect-[4/3] bg-slate-100 overflow-hidden">
              <img :src="item.images && item.images[0] ? item.images[0] : ''" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            
            <div class="p-4 md:p-5 flex flex-col flex-grow">
              <div class="flex justify-between items-center mb-2 gap-1">
                <span class="text-[10px] md:text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">★ {{ item.rating }}</span>
                <span class="text-[10px] md:text-xs font-bold text-slate-400 truncate">📍 {{ item.location }}</span>
              </div>
              <h3 class="font-black text-slate-800 text-sm md:text-base leading-snug line-clamp-2 mb-4">{{ item.title }}</h3>
              <hr class="border-slate-100 mb-4 mt-auto" />
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <img :src="item.lender?.avatar_url || 'https://ui-avatars.com/api/?name=User'" class="w-6 h-6 md:w-8 md:h-8 rounded-full border border-slate-200 object-cover" />
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

        <div v-else class="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <h3 class="text-xl font-black text-slate-800 mb-2">ยังไม่มีสินค้าในหมวดหมู่นี้</h3>
        </div>
      </div>
    </div>
  </div>
</template>