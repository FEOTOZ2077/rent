<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useItems } from '@/composables/useItems'

const router = useRouter()
const { items, fetchItems, isLoading } = useItems() 

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

onMounted(() => fetchItems())

const handleSearch = () => {
  if (searchQuery.value) router.push(`/search?q=${searchQuery.value}`)
  else router.push('/search')
}

const filteredItems = computed(() => {
  if (!items.value) return []
  if (activeCategory.value === 'ยอดนิยมสูงสุด') return items.value.slice(0, 8) 
  return items.value.filter(item => item.category === activeCategory.value)
})

const popularStores = ref([
  { id: 1, name: 'Bangkok Car Rent Pro', category: 'รถยนต์ & ซูเปอร์คาร์', rating: 5.0, rentals: '1,200+', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600', avatar: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=150' },
  { id: 2, name: 'Urban Space', category: 'อสังหาฯ ใจกลางเมือง', rating: 4.9, rentals: '850+', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600', avatar: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=150' },
  { id: 3, name: 'Pro Camera Studio', category: 'กล้องและอุปกรณ์ถ่ายภาพ', rating: 4.9, rentals: '2,400+', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600', avatar: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=150' },
])
</script>

<template>
  <div class="w-full overflow-x-hidden bg-[#F8FAFC] font-sans pb-20">
    
    <!-- Hero Banner -->
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
            <svg class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input v-model="searchQuery" @keyup.enter="handleSearch" type="text" placeholder="ค้นหารถยนต์, คอนโด, กล้อง..." class="w-full bg-transparent outline-none text-slate-800 text-sm md:text-base font-medium py-2.5" />
          </div>
          <button @click="handleSearch" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 md:px-8 py-3 rounded-full font-bold shadow-lg transition-all text-sm md:text-base whitespace-nowrap">ค้นหา</button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-10 py-12">
      <!-- Categories -->
      <div class="flex flex-col items-center mb-10">
        <div class="w-full flex overflow-x-auto gap-4 md:gap-10 pb-4 scrollbar-hide justify-start lg:justify-center">
          <button v-for="cat in categories" :key="cat.name" @click="activeCategory = cat.name" class="flex flex-col items-center justify-center group flex-shrink-0 w-20">
            <div :class="['w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all shadow-sm group-hover:-translate-y-1', activeCategory === cat.name ? 'bg-indigo-600 text-white ring-4 ring-indigo-600/20 scale-110' : 'bg-white text-slate-600 border border-slate-200 group-hover:border-indigo-600']">
               <!-- ไอคอนหมวดหมู่ -->
               <svg v-if="cat.type === 'trending'" class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
               <svg v-else-if="cat.type === 'car'" class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
               <svg v-else-if="cat.type === 'property'" class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
               <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
            </div>
            <span :class="['text-xs font-bold mt-3 text-center line-clamp-1', activeCategory === cat.name ? 'text-indigo-600' : 'text-slate-600']">{{ cat.name }}</span>
          </button>
        </div>
      </div>

      <!-- Featured Items -->
      <div class="mb-16">
        <div class="flex justify-between items-end mb-6">
          <h2 class="text-2xl md:text-4xl font-black text-slate-900">{{ activeCategory === 'ยอดนิยมสูงสุด' ? 'รายการสินค้าแนะนำ' : `รายการ ${activeCategory}` }}</h2>
          <button @click="router.push(`/search?category=${activeCategory}`)" class="text-sm font-bold text-indigo-600 bg-white px-4 py-2 rounded-xl border shadow-sm">ดูทั้งหมด</button>
        </div>
        
        <div v-if="isLoading" class="text-center py-20 text-slate-400">กำลังโหลด...</div>
        <div v-else-if="filteredItems.length > 0" class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <!-- Card -->
          <div v-for="item in filteredItems" :key="item.id" @click="router.push(`/item/${item.id}`)" class="group cursor-pointer bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col">
            <div class="aspect-[4/3] bg-slate-100 overflow-hidden relative">
              <img :src="item.images[0]" class="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              <span class="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm">{{ item.category.split('/')[0] }}</span>
            </div>
            <div class="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">★ {{ item.rating }}</span>
                  <span class="text-[10px] font-bold text-slate-400">📍 {{ item.location }}</span>
                </div>
                <h3 class="font-black text-slate-800 text-sm md:text-base line-clamp-2">{{ item.title }}</h3>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                <span class="text-xs font-bold text-slate-500 truncate max-w-[80px]">{{ item.lender?.first_name || 'Lender' }}</span>
                <span class="text-sm md:text-lg font-black text-indigo-600">฿{{ item.price_daily.toLocaleString() }}<span class="text-[10px] text-slate-400">/วัน</span></span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-20 bg-white rounded-3xl border border-slate-200">
           <p class="text-slate-500 font-medium">ยังไม่มีสินค้าในหมวดหมู่นี้</p>
        </div>
      </div>

      <!-- How to Rent -->
      <div class="bg-slate-900 text-white rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl mb-16">
        <div class="relative z-10 text-center max-w-2xl mx-auto mb-10">
          <h2 class="text-3xl md:text-5xl font-black">เช่าง่ายๆ ใน 3 ขั้นตอน</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div class="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center">
            <div class="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-2xl font-black mb-5">1</div>
            <h3 class="text-xl font-bold mb-2">ค้นหาสินค้า</h3>
            <p class="text-slate-400 text-sm">เลือกรถ บ้าน หรือของใช้ที่คุณต้องการ</p>
          </div>
          <div class="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center">
            <div class="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-2xl font-black mb-5">2</div>
            <h3 class="text-xl font-bold mb-2">จองและชำระเงิน</h3>
            <p class="text-slate-400 text-sm">ชำระเงินปลอดภัยผ่านระบบส่วนกลาง</p>
          </div>
          <div class="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center">
            <div class="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-2xl font-black mb-5">3</div>
            <h3 class="text-xl font-bold mb-2">รับของไปใช้งาน</h3>
            <p class="text-slate-400 text-sm">นัดรับของแล้วเพลิดเพลินกับการใช้งานได้เลย</p>
          </div>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <footer class="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div class="max-w-[1300px] mx-auto px-4 md:px-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-slate-800 pb-12">
          <div>
            <h3 class="text-2xl font-black text-white mb-4"><span class="bg-indigo-600 p-1.5 rounded-lg text-lg mr-1">R</span> RentAll</h3>
            <p class="text-sm font-medium">แพลตฟอร์มเช่ายืมทุกสิ่งครบวงจร ปลอดภัย มั่นใจได้ 100%</p>
          </div>
          <div>
             <h4 class="font-bold text-white mb-4">สำรวจ</h4>
             <ul class="space-y-3 text-sm font-medium">
               <li><RouterLink to="/search" class="hover:text-indigo-400">ค้นหาสินค้าทั้งหมด</RouterLink></li>
               <li><RouterLink to="/auth" class="hover:text-indigo-400">เข้าสู่ระบบ / สมัครสมาชิก</RouterLink></li>
             </ul>
          </div>
          <div>
             <h4 class="font-bold text-white mb-4">ช่วยเหลือ</h4>
             <ul class="space-y-3 text-sm font-medium">
               <li><RouterLink to="/help" class="hover:text-indigo-400">ศูนย์ช่วยเหลือ (FAQ)</RouterLink></li>
               <li><RouterLink to="/lender/register" class="hover:text-indigo-400">สมัครเป็นผู้ให้เช่า</RouterLink></li>
             </ul>
          </div>
          <div>
             <h4 class="font-bold text-white mb-4">ติดต่อเรา</h4>
             <p class="text-sm font-medium mb-2">support@rentall.co.th</p>
             <p class="text-sm font-medium">02-XXX-XXXX</p>
          </div>
        </div>
        <div class="text-center text-sm font-medium mt-8">&copy; 2026 RentAll Platform. All rights reserved.</div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>