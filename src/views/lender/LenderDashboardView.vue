<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { useAuth, supabase } from '@/composables/useAuth'
import { useBookings } from '@/composables/useBookings'
import { useRouter } from 'vue-router'

const router = useRouter()
const { user } = useAuth()
const { bookings, fetchLenderBookings, updateStatus } = useBookings()

const activeTab = ref('overview') // overview, orders, items
const myItems = ref([])
const isLoading = ref(false)

// 📦 State สำหรับจัดการสินค้า (Add / Edit)
const showItemModal = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const itemForm = reactive({
  id: null,
  title: '',
  description: '',
  category: 'รถยนต์/ยานพาหนะ',
  location: 'กทม.',
  price_daily: 0,
  price_hourly: 0,
  images: '', // รับเป็น URL เดี่ยวๆ คั่นด้วยลูกน้ำเพื่อความง่าย
})

// โหลดข้อมูลทั้งหมดเมื่อเปิดหน้า
onMounted(async () => {
  if (!user.id) return router.push('/auth')
  await fetchLenderBookings(user.id)
  await loadMyItems()
})

// ดึงข้อมูลสินค้าของร้านตัวเอง
const loadMyItems = async () => {
  isLoading.value = true
  const { data } = await supabase.from('items').select('*').eq('lender_id', user.id).order('created_at', { ascending: false })
  if (data) myItems.value = data
  isLoading.value = false
}

// 🧮 คำนวณสถิติ
const totalRevenue = computed(() => bookings.value.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.net_price, 0))
const activeOrdersCount = computed(() => bookings.value.filter(b => b.status === 'active').length)
const activeItemsCount = computed(() => myItems.value.filter(i => i.is_active).length)

// 📝 จัดการออเดอร์
const handleCompleteBooking = async (id) => {
  if(confirm('ยืนยันว่าได้รับสินค้าคืนในสภาพสมบูรณ์เรียบร้อยแล้ว?\n\n*ระบบจะโอนเงินให้คุณและอัปเดตสถานะเป็นเสร็จสิ้น')) {
    await updateStatus(id, 'completed')
    await fetchLenderBookings(user.id)
    alert('✅ อัปเดตสถานะออเดอร์เป็น "เสร็จสิ้น" เรียบร้อยแล้ว')
  }
}

// 🛍️ เปิดฟอร์มเพิ่ม/แก้ไขสินค้า
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

// 💾 บันทึกสินค้า (ลง Supabase)
const saveItem = async () => {
  isSaving.value = true
  try {
    const payload = {
      lender_id: user.id,
      title: itemForm.title,
      description: itemForm.description,
      category: itemForm.category,
      location: itemForm.location,
      price_daily: itemForm.price_daily,
      price_hourly: itemForm.price_hourly,
      images: itemForm.images.split(',').map(url => url.trim()), // แปลง String เป็น Array
      is_active: true
    }

    if (isEditing.value) {
      await supabase.from('items').update(payload).eq('id', itemForm.id)
      alert('อัปเดตข้อมูลสินค้าเรียบร้อย')
    } else {
      await supabase.from('items').insert([payload])
      alert('เพิ่มสินค้าชิ้นใหม่เรียบร้อย')
    }
    
    showItemModal.value = false
    await loadMyItems()
  } catch (err) {
    alert('เกิดข้อผิดพลาด: ' + err.message)
  } finally {
    isSaving.value = false
  }
}

// 👁️ สลับสถานะ เปิด/ปิด การมองเห็นสินค้า
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
    
    <!-- 🟢 Modal: เพิ่ม/แก้ไขสินค้า -->
    <div v-if="showItemModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showItemModal = false"></div>
      <div class="bg-white rounded-[2rem] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div class="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white z-10 sticky top-0">
          <h2 class="text-xl font-black text-slate-900">{{ isEditing ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่' }}</h2>
          <button @click="showItemModal = false" class="p-2 bg-slate-50 text-slate-500 rounded-full hover:bg-slate-100"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        
        <div class="p-6 overflow-y-auto bg-slate-50">
          <form @submit.prevent="saveItem" class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-600 uppercase mb-2">ชื่อสินค้า</label>
              <input v-model="itemForm.title" required type="text" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-indigo-600" placeholder="เช่น กล้อง Sony A7IV..." />
            </div>
            <div class="grid grid-cols-2 gap-4">
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
                <input v-model="itemForm.location" required type="text" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-indigo-600" placeholder="กทม., เชียงใหม่..." />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase mb-2">ราคาเช่า/วัน (บาท)</label>
                <input v-model.number="itemForm.price_daily" required type="number" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-indigo-600 outline-none focus:border-indigo-600" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase mb-2">ราคาเช่า/ชม. (บาท)</label>
                <input v-model.number="itemForm.price_hourly" required type="number" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-indigo-600 outline-none focus:border-indigo-600" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 uppercase mb-2">ลิงก์รูปภาพ (คั่นด้วยลูกน้ำ)</label>
              <textarea v-model="itemForm.images" required rows="2" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-indigo-600 resize-none" placeholder="https://image1.jpg, https://image2.jpg..."></textarea>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 uppercase mb-2">รายละเอียดสินค้า</label>
              <textarea v-model="itemForm.description" rows="4" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-indigo-600 resize-none" placeholder="อธิบายคุณสมบัติ กฎการเช่า หรือข้อควรระวัง..."></textarea>
            </div>
          </form>
        </div>

        <div class="px-6 py-4 border-t border-slate-100 bg-white sticky bottom-0">
          <button @click="saveItem" :disabled="isSaving" class="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition disabled:opacity-70 flex justify-center items-center gap-2">
            <svg v-if="isSaving" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isSaving ? 'กำลังบันทึกข้อมูล...' : 'บันทึกข้อมูลสินค้า' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div class="bg-slate-900 text-white pt-10 pb-20 px-6 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
      <div class="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div>
          <span class="text-[10px] font-bold tracking-widest text-amber-400 bg-white/10 px-3 py-1 rounded-full border border-white/10 uppercase mb-3 inline-block">Lender Center</span>
          <h1 class="text-3xl font-black mb-1">แผงควบคุมร้านค้า</h1>
          <p class="text-indigo-200 text-sm">จัดการสินค้า ออเดอร์ และรายได้ของคุณในที่เดียว</p>
        </div>
        <div class="text-left md:text-right">
          <p class="text-[11px] text-slate-400 font-bold uppercase tracking-widest">ยอดรายได้สะสม</p>
          <p class="text-4xl font-black text-emerald-400 mt-1">฿{{ totalRevenue.toLocaleString() }}</p>
        </div>
      </div>
    </div>

    <div class="max-w-[1200px] mx-auto px-6 -mt-8 relative z-20">
      
      <!-- Tabs Navigation -->
      <div class="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button @click="activeTab = 'overview'" :class="['px-6 py-3 rounded-2xl font-bold text-sm shadow-sm transition whitespace-nowrap', activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200']">ภาพรวมร้านค้า</button>
        <button @click="activeTab = 'orders'" :class="['px-6 py-3 rounded-2xl font-bold text-sm shadow-sm transition whitespace-nowrap', activeTab === 'orders' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200']">การเช่าและออเดอร์ ({{ activeOrdersCount }})</button>
        <button @click="activeTab = 'items'" :class="['px-6 py-3 rounded-2xl font-bold text-sm shadow-sm transition whitespace-nowrap', activeTab === 'items' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200']">คลังสินค้า ({{ myItems.length }})</button>
      </div>

      <!-- 🟢 Tab: Overview -->
      <div v-if="activeTab === 'overview'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5">
          <div class="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
          <div><p class="text-xs font-bold text-slate-400 uppercase">ออเดอร์รอดำเนินการ</p><p class="text-3xl font-black text-slate-800">{{ activeOrdersCount }}</p></div>
        </div>
        <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5">
          <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg></div>
          <div><p class="text-xs font-bold text-slate-400 uppercase">สินค้าที่เปิดให้เช่า</p><p class="text-3xl font-black text-slate-800">{{ activeItemsCount }}</p></div>
        </div>
        <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5">
          <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
          <div><p class="text-xs font-bold text-slate-400 uppercase">อัตราส่งมอบสำเร็จ</p><p class="text-3xl font-black text-slate-800">100%</p></div>
        </div>
      </div>

      <!-- 🟢 Tab: Orders -->
      <div v-if="activeTab === 'orders'" class="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 overflow-hidden">
        <h2 class="text-xl font-black text-slate-800 mb-6">จัดการออเดอร์เช่าสินค้า</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-slate-50 text-slate-500">
              <tr>
                <th class="p-4 rounded-l-xl font-bold">รหัสเช่า</th>
                <th class="p-4 font-bold">สินค้า</th>
                <th class="p-4 font-bold">ข้อมูลผู้เช่า</th>
                <th class="p-4 font-bold text-right">ยอดสุทธิ</th>
                <th class="p-4 font-bold text-center">สถานะ</th>
                <th class="p-4 rounded-r-xl font-bold text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="bookings.length === 0"><td colspan="6" class="text-center p-10 text-slate-400 font-medium">ยังไม่มีออเดอร์เข้ามาในขณะนี้</td></tr>
              <tr v-for="b in bookings" :key="b.id" class="border-b border-slate-100 hover:bg-slate-50 transition">
                <td class="p-4 font-mono font-black text-indigo-600 text-xs">{{ b.order_id }}</td>
                <td class="p-4 font-bold text-slate-800 truncate max-wxs">{{ b.item?.title || 'ไม่ระบุ' }}</td>
                <td class="p-4">
                  <div class="text-slate-800 font-bold">{{ b.renter?.first_name || 'ลูกค้าใหม่' }}</div>
                  <div class="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg> {{ b.renter?.phone || 'ไม่ได้ระบุเบอร์' }}</div>
                </td>
                <td class="p-4 font-black text-indigo-600 text-right">฿{{ b.net_price.toLocaleString() }}</td>
                <td class="p-4 text-center">
                  <span :class="['px-3 py-1 rounded-lg text-[10px] font-black', b.status === 'active' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700']">
                    {{ b.status === 'active' ? 'กำลังเช่าอยู่' : 'เสร็จสิ้นแล้ว' }}
                  </span>
                </td>
                <td class="p-4 text-center">
                  <button v-if="b.status === 'active'" @click="handleCompleteBooking(b.id)" class="bg-slate-900 text-white text-[11px] font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 shadow-md transition">คืนของสำเร็จ</button>
                  <span v-else class="text-xs text-slate-400 font-bold px-4 py-2">จบงานแล้ว</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 🟢 Tab: Items -->
      <div v-if="activeTab === 'items'" class="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 md:p-8">
        <div class="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
          <h2 class="text-xl font-black text-slate-800">คลังสินค้าของคุณ</h2>
          <button @click="openAddItem" class="bg-indigo-600 text-white text-xs md:text-sm font-bold px-5 md:px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition flex items-center gap-2">
            <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg> เพิ่มสินค้าใหม่
          </button>
        </div>
        
        <div v-if="isLoading" class="text-center py-10 text-slate-400">กำลังโหลด...</div>
        <div v-else-if="myItems.length === 0" class="text-center py-16 text-slate-400 font-medium bg-slate-50 rounded-3xl border border-slate-200 border-dashed">คุณยังไม่ได้เพิ่มสินค้าลงในระบบ คลิกปุ่ม "เพิ่มสินค้าใหม่" เพื่อเริ่มต้นรับรายได้!</div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="item in myItems" :key="item.id" class="border border-slate-200 rounded-3xl p-5 flex flex-col gap-4 hover:shadow-lg transition group relative overflow-hidden bg-white">
            
            <!-- ป้ายกำกับสถานะ (ซ่อน/แสดง) -->
            <div class="absolute top-4 left-4 z-10">
               <span :class="['text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm', item.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white']">
                 {{ item.is_active ? 'ออนไลน์' : 'ซ่อนอยู่' }}
               </span>
            </div>

            <div class="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative">
              <img :src="item.images && item.images.length > 0 ? item.images[0] : ''" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            
            <div class="flex-grow flex flex-col justify-between">
              <div>
                <h4 class="font-black text-slate-800 line-clamp-2 text-base">{{ item.title }}</h4>
                <p class="text-xs text-slate-500 mt-2 font-medium bg-slate-50 inline-block px-2 py-1 rounded-lg">หมวดหมู่: {{ item.category }}</p>
              </div>
              <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <p class="text-lg font-black text-indigo-600">฿{{ item.price_daily.toLocaleString() }}<span class="text-[10px] text-slate-400 font-normal">/วัน</span></p>
                <div class="flex gap-2">
                  <button @click="toggleItemStatus(item)" :class="['w-8 h-8 rounded-lg flex items-center justify-center transition border', item.is_active ? 'bg-white border-slate-200 text-slate-400 hover:text-rose-500' : 'bg-emerald-50 text-emerald-600 border-emerald-200']" :title="item.is_active ? 'ซ่อนสินค้า' : 'เปิดให้เช่า'">
                    <svg v-if="item.is_active" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                  <button @click="openEditItem(item)" class="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition" title="แก้ไข">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                  </button>
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
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>