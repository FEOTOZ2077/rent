<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { useAuth, supabase } from '@/composables/useAuth'
import { useBookings } from '@/composables/useBookings'
import { useRouter } from 'vue-router'

const router = useRouter()
const { user } = useAuth()
const { bookings, fetchLenderBookings, updateStatus } = useBookings()

const activeTab = ref('overview')
const myItems = ref([])
const isLoading = ref(false)

const showItemModal = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const itemForm = reactive({
  id: null, title: '', description: '', category: 'รถยนต์/ยานพาหนะ', location: 'กทม.', price_daily: 0, price_hourly: 0, images: '',
})

onMounted(async () => {
  if (!user.id) return router.push('/auth')
  await fetchLenderBookings(user.id)
  await loadMyItems()
})

const loadMyItems = async () => {
  isLoading.value = true
  const { data } = await supabase.from('items').select('*').eq('lender_id', user.id).order('created_at', { ascending: false })
  if (data) myItems.value = data
  isLoading.value = false
}

const totalRevenue = computed(() => bookings.value.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.net_price, 0))
const activeOrdersCount = computed(() => bookings.value.filter(b => b.status === 'active').length)
const activeItemsCount = computed(() => myItems.value.filter(i => i.is_active).length)

const handleCompleteBooking = async (id) => {
  if(confirm('ยืนยันว่าได้รับสินค้าคืนในสภาพสมบูรณ์เรียบร้อยแล้ว?')) {
    await updateStatus(id, 'completed')
    await fetchLenderBookings(user.id)
    alert('✅ อัปเดตสถานะออเดอร์เป็น "เสร็จสิ้น" เรียบร้อยแล้ว')
  }
}

const openAddItem = () => {
  isEditing.value = false
  Object.assign(itemForm, { id: null, title: '', description: '', category: 'รถยนต์/ยานพาหนะ', location: 'กทม.', price_daily: 0, price_hourly: 0, images: '' })
  showItemModal.value = true
}

const openEditItem = (item) => {
  isEditing.value = true
  Object.assign(itemForm, { ...item, images: item.images.join(', ') })
  showItemModal.value = true
}

const saveItem = async () => {
  isSaving.value = true
  try {
    const payload = {
      lender_id: user.id, title: itemForm.title, description: itemForm.description, category: itemForm.category,
      location: itemForm.location, price_daily: itemForm.price_daily, price_hourly: itemForm.price_hourly,
      images: itemForm.images.split(',').map(url => url.trim()), is_active: true
    }
    if (isEditing.value) {
      await supabase.from('items').update(payload).eq('id', itemForm.id)
    } else {
      await supabase.from('items').insert([payload])
    }
    showItemModal.value = false
    await loadMyItems()
  } catch (err) {
    alert('เกิดข้อผิดพลาด: ' + err.message)
  } finally {
    isSaving.value = false
  }
}

const toggleItemStatus = async (item) => {
  const newStatus = !item.is_active
  if(confirm(`ต้องการ ${newStatus ? 'เปิด' : 'ซ่อน'} การแสดงผลสินค้านี้ใช่หรือไม่?`)) {
    await supabase.from('items').update({ is_active: newStatus }).eq('id', item.id)
    item.is_active = newStatus
  }
}
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen font-sans pb-24 relative">
    
    <!-- Modal: เพิ่ม/แก้ไขสินค้า (Responsive Mobile) -->
    <div v-if="showItemModal" class="fixed inset-0 z-50 flex items-end md:items-center justify-center sm:p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showItemModal = false"></div>
      <div class="bg-white w-full rounded-t-[2rem] md:rounded-[2rem] max-w-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col h-[90vh] md:max-h-[90vh] animate-slide-up md:animate-none pb-safe">
        <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2 md:hidden"></div>
        <div class="px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-white z-10 sticky top-0">
          <h2 class="text-xl font-black text-slate-900">{{ isEditing ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่' }}</h2>
          <button @click="showItemModal = false" class="p-2 bg-slate-50 text-slate-500 rounded-full hover:bg-slate-100"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        
        <div class="p-6 overflow-y-auto bg-slate-50 flex-grow">
          <form @submit.prevent="saveItem" class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-600 uppercase mb-2">ชื่อสินค้า</label>
              <input v-model="itemForm.title" required type="text" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-indigo-600" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase mb-2">หมวดหมู่</label>
                <select v-model="itemForm.category" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-indigo-600">
                  <option value="รถยนต์/ยานพาหนะ">รถยนต์/ยานพาหนะ</option>
                  <option value="อสังหาริมทรัพย์">อสังหาริมทรัพย์</option>
                  <option value="กล้องและเลนส์">กล้องและเลนส์</option>
                  <option value="อุปกรณ์แคมป์ปิ้ง">อุปกรณ์แคมป์ปิ้ง</option>
                  <option value="อุปกรณ์เกมมิ่ง">อุปกรณ์เกมมิ่ง</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase mb-2">สถานที่ / จังหวัด</label>
                <input v-model="itemForm.location" required type="text" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-indigo-600" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 md:gap-5">
              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase mb-2">ราคาเช่า/วัน</label>
                <input v-model.number="itemForm.price_daily" required type="number" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-indigo-600 outline-none focus:border-indigo-600" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase mb-2">ราคาเช่า/ชม.</label>
                <input v-model.number="itemForm.price_hourly" required type="number" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-indigo-600 outline-none focus:border-indigo-600" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 uppercase mb-2">ลิงก์รูปภาพ (คั่นด้วยลูกน้ำ)</label>
              <textarea v-model="itemForm.images" required rows="2" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-indigo-600 resize-none"></textarea>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 uppercase mb-2">รายละเอียดสินค้า</label>
              <textarea v-model="itemForm.description" rows="4" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-indigo-600 resize-none"></textarea>
            </div>
          </form>
        </div>

        <div class="px-6 py-4 border-t border-slate-100 bg-white sticky bottom-0">
          <button @click="saveItem" :disabled="isSaving" class="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition flex justify-center items-center gap-2">
            <svg v-if="isSaving" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isSaving ? 'กำลังบันทึกข้อมูล...' : 'บันทึกข้อมูลสินค้า' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Header (Mobile Friendly) -->
    <div class="bg-slate-900 text-white pt-10 pb-20 px-4 md:px-6 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
      <div class="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div>
          <span class="text-[10px] font-bold tracking-widest text-amber-400 bg-white/10 px-3 py-1 rounded-full border border-white/10 uppercase mb-3 inline-block">Lender Center</span>
          <h1 class="text-2xl md:text-3xl font-black mb-1">แผงควบคุมร้านค้า</h1>
          <p class="text-indigo-200 text-xs md:text-sm">จัดการสินค้าและรายได้ของคุณในที่เดียว</p>
        </div>
        <div class="w-full md:w-auto text-left md:text-right bg-white/10 px-5 md:px-6 py-4 rounded-2xl backdrop-blur-md">
          <p class="text-[10px] md:text-[11px] text-indigo-300 font-bold uppercase tracking-widest">ยอดรายได้สะสม</p>
          <p class="text-3xl md:text-4xl font-black text-emerald-400 mt-1">฿{{ totalRevenue.toLocaleString() }}</p>
        </div>
      </div>
    </div>

    <div class="max-w-[1200px] mx-auto px-4 md:px-6 -mt-8 relative z-20">
      
      <!-- Tabs Navigation -->
      <div class="flex gap-2 md:gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button @click="activeTab = 'overview'" :class="['px-5 md:px-6 py-3 rounded-2xl font-bold text-xs md:text-sm shadow-sm transition whitespace-nowrap', activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200']">ภาพรวมร้านค้า</button>
        <button @click="activeTab = 'orders'" :class="['px-5 md:px-6 py-3 rounded-2xl font-bold text-xs md:text-sm shadow-sm transition whitespace-nowrap', activeTab === 'orders' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200']">ออเดอร์ ({{ activeOrdersCount }})</button>
        <button @click="activeTab = 'items'" :class="['px-5 md:px-6 py-3 rounded-2xl font-bold text-xs md:text-sm shadow-sm transition whitespace-nowrap', activeTab === 'items' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200']">สินค้า ({{ myItems.length }})</button>
      </div>

      <!-- 🟢 Tab: Overview -->
      <div v-if="activeTab === 'overview'" class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div class="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 md:gap-5">
          <div class="w-12 h-12 md:w-14 md:h-14 bg-amber-50 text-amber-600 rounded-xl md:rounded-2xl flex items-center justify-center"><svg class="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
          <div><p class="text-[10px] md:text-xs font-bold text-slate-400 uppercase">ออเดอร์รอจัดการ</p><p class="text-2xl md:text-3xl font-black text-slate-800">{{ activeOrdersCount }}</p></div>
        </div>
        <div class="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 md:gap-5">
          <div class="w-12 h-12 md:w-14 md:h-14 bg-indigo-50 text-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center"><svg class="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg></div>
          <div><p class="text-[10px] md:text-xs font-bold text-slate-400 uppercase">สินค้าที่เปิดให้เช่า</p><p class="text-2xl md:text-3xl font-black text-slate-800">{{ activeItemsCount }}</p></div>
        </div>
      </div>

      <!-- 🟢 Tab: Orders -->
      <div v-if="activeTab === 'orders'" class="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-4 md:p-6 overflow-hidden">
        <h2 class="text-lg md:text-xl font-black text-slate-800 mb-4 md:mb-6">ออเดอร์เช่าสินค้า</h2>
        
        <!-- 💻 Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-slate-50 text-slate-500">
              <tr>
                <th class="p-4 rounded-l-xl font-bold">รหัสเช่า</th>
                <th class="p-4 font-bold">สินค้า</th>
                <th class="p-4 font-bold">ผู้เช่า</th>
                <th class="p-4 font-bold text-right">ยอดสุทธิ</th>
                <th class="p-4 font-bold text-center">สถานะ</th>
                <th class="p-4 rounded-r-xl font-bold text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="bookings.length === 0"><td colspan="6" class="text-center p-10 text-slate-400">ยังไม่มีออเดอร์เข้ามา</td></tr>
              <tr v-for="b in bookings" :key="b.id" class="border-b border-slate-100 hover:bg-slate-50">
                <td class="p-4 font-mono font-black text-indigo-600 text-xs">{{ b.order_id }}</td>
                <td class="p-4 font-bold text-slate-800">{{ b.item?.title || 'ไม่ระบุ' }}</td>
                <td class="p-4"><div class="text-slate-800 font-bold">{{ b.renter?.first_name || 'ลูกค้า' }}</div></td>
                <td class="p-4 font-black text-indigo-600 text-right">฿{{ b.net_price.toLocaleString() }}</td>
                <td class="p-4 text-center"><span :class="['px-3 py-1 rounded-lg text-[10px] font-black', b.status === 'active' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700']">{{ b.status === 'active' ? 'กำลังเช่า' : 'เสร็จสิ้น' }}</span></td>
                <td class="p-4 text-center">
                  <button v-if="b.status === 'active'" @click="handleCompleteBooking(b.id)" class="bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800">คืนของสำเร็จ</button>
                  <span v-else class="text-xs text-slate-400 font-bold">จบงานแล้ว</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 📱 Mobile Cards (สลับเป็น Card เมื่อจอเล็ก) -->
        <div class="md:hidden space-y-4">
          <div v-if="bookings.length === 0" class="text-center p-8 text-slate-400 font-medium">ยังไม่มีออเดอร์เข้ามา</div>
          <div v-for="b in bookings" :key="'mob-'+b.id" class="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <div class="flex justify-between items-center mb-3">
              <span class="font-mono font-black text-indigo-600 text-[10px] bg-indigo-50 px-2 py-0.5 rounded">{{ b.order_id }}</span>
              <span :class="['px-2 py-1 rounded-md text-[9px] font-bold', b.status === 'active' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700']">{{ b.status === 'active' ? 'กำลังเช่า' : 'เสร็จสิ้น' }}</span>
            </div>
            <h4 class="font-bold text-slate-800 text-sm mb-1 leading-snug">{{ b.item?.title || 'ไม่ระบุสินค้า' }}</h4>
            <p class="text-xs text-slate-500 mb-3 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              {{ b.renter?.first_name || 'ลูกค้า' }}
            </p>
            <div class="flex justify-between items-center pt-3 border-t border-slate-200">
              <div><span class="text-[10px] text-slate-400 block">ยอดสุทธิ</span><span class="font-black text-indigo-600">฿{{ b.net_price.toLocaleString() }}</span></div>
              <button v-if="b.status === 'active'" @click="handleCompleteBooking(b.id)" class="bg-slate-900 text-white text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-md">รับของคืนแล้ว</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 🟢 Tab: Items -->
      <div v-if="activeTab === 'items'" class="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-4 md:p-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-100 pb-4 gap-4">
          <h2 class="text-xl font-black text-slate-800">คลังสินค้าของคุณ</h2>
          <button @click="openAddItem" class="w-full md:w-auto bg-indigo-600 text-white text-xs md:text-sm font-bold px-6 py-3.5 md:py-3 rounded-xl shadow-md hover:bg-indigo-700 transition flex items-center justify-center gap-2">
            <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg> เพิ่มสินค้าใหม่
          </button>
        </div>
        
        <div v-if="isLoading" class="text-center py-10 text-slate-400">กำลังโหลด...</div>
        <div v-else-if="myItems.length === 0" class="text-center py-12 text-slate-400 text-sm font-medium bg-slate-50 rounded-3xl border border-slate-200 border-dashed">คุณยังไม่ได้เพิ่มสินค้าลงในระบบ</div>
        
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div v-for="item in myItems" :key="item.id" class="border border-slate-200 rounded-3xl p-4 md:p-5 flex flex-col gap-4 bg-white relative">
            <div class="absolute top-4 left-4 z-10">
               <span :class="['text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm', item.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white']">
                 {{ item.is_active ? 'ออนไลน์' : 'ซ่อนอยู่' }}
               </span>
            </div>
            <div class="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative">
              <img :src="item.images && item.images.length > 0 ? item.images[0] : ''" class="w-full h-full object-cover" />
            </div>
            <div class="flex-grow flex flex-col justify-between">
              <div>
                <h4 class="font-black text-slate-800 line-clamp-2 text-sm md:text-base">{{ item.title }}</h4>
                <p class="text-[10px] md:text-xs text-slate-500 mt-1.5 font-medium bg-slate-50 inline-block px-2 py-1 rounded-lg">{{ item.category }}</p>
              </div>
              <div class="mt-4 pt-3 md:pt-4 border-t border-slate-100 flex justify-between items-center">
                <p class="text-base md:text-lg font-black text-indigo-600">฿{{ item.price_daily.toLocaleString() }}<span class="text-[9px] md:text-[10px] text-slate-400 font-normal">/วัน</span></p>
                <div class="flex gap-2">
                  <button @click="toggleItemStatus(item)" :class="['w-8 h-8 rounded-lg flex items-center justify-center transition border', item.is_active ? 'bg-white border-slate-200 text-slate-400' : 'bg-emerald-50 text-emerald-600 border-emerald-200']"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button>
                  <button @click="openEditItem(item)" class="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.pb-safe { padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem); }
</style>