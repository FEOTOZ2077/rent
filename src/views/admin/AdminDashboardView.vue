<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/composables/useAuth'

const activeTab = ref('users') // overview, users, items, transactions
const allUsers = ref([])
const allItems = ref([])
const allBookings = ref([])
const isLoading = ref(true)

onMounted(async () => {
  await loadDashboardData()
})

const loadDashboardData = async () => {
  isLoading.value = true
  // 1. ดึง Users ทั้งหมด
  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  allUsers.value = users || []

  // 2. ดึง Items ทั่วแพลตฟอร์ม
  const { data: items } = await supabase.from('items').select('*, lender:profiles!items_lender_id_fkey(first_name, email)').order('created_at', { ascending: false })
  allItems.value = items || []

  // 3. ดึง Bookings เพื่อคำนวณธุรกรรม
  const { data: bookings } = await supabase.from('bookings').select('*, item:items!inner(title), renter:profiles!bookings_renter_id_fkey(email)').order('created_at', { ascending: false })
  allBookings.value = bookings || []
  
  isLoading.value = false
}

// 🧮 สถิติ
const platformRevenue = computed(() => allBookings.value.length * 150)
const totalGmv = computed(() => allBookings.value.reduce((sum, b) => sum + b.net_price, 0)) // ยอดเงินหมุนเวียนรวม
const lendersCount = computed(() => allUsers.value.filter(u => u.role === 'lender').length)

// 📝 การจัดการ User
const changeUserRole = async (user, newRole) => {
  if (confirm(`ยืนยันการเปลี่ยนสิทธิ์เป็น ${newRole} ใช่หรือไม่?`)) {
    await supabase.from('profiles').update({ role: newRole }).eq('id', user.id)
    user.role = newRole
  }
}

// 📝 การจัดการ Item (แบนสินค้า)
const banItem = async (item) => {
  const newStatus = !item.is_active
  const actionText = newStatus ? 'ปลดแบน' : 'ระงับการแสดงผล'
  if (confirm(`ยืนยันการ ${actionText} สินค้านี้จากแพลตฟอร์ม?`)) {
    await supabase.from('items').update({ is_active: newStatus }).eq('id', item.id)
    item.is_active = newStatus
  }
}
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen font-sans pb-20 relative">
    
    <!-- Header -->
    <div class="bg-rose-600 text-white pt-10 pb-20 px-6 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div class="max-w-[1300px] mx-auto flex justify-between items-end relative z-10">
        <div>
          <span class="text-[10px] font-black tracking-widest text-rose-200 bg-black/20 px-3 py-1 rounded-full uppercase mb-3 inline-block">Platform Control</span>
          <h1 class="text-3xl md:text-4xl font-black mb-1">ศูนย์ควบคุมระบบ (Admin)</h1>
          <p class="text-rose-100 text-sm font-medium">ภาพรวม ธุรกรรม และการดูแลจัดการระบบ RentAll</p>
        </div>
        <div class="text-right hidden md:block">
          <p class="text-[10px] font-bold text-rose-200 uppercase tracking-widest">ยอดเงินหมุนเวียน (GMV)</p>
          <p class="text-3xl font-black text-white">฿{{ totalGmv.toLocaleString() }}</p>
        </div>
      </div>
    </div>

    <div class="max-w-[1300px] mx-auto px-6 -mt-10 relative z-20">
      
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">ผู้ใช้ / ร้านค้า</p>
          <p class="text-3xl font-black text-slate-800 mt-2">{{ allUsers.length }} <span class="text-sm font-bold text-slate-400">/ {{ lendersCount }}</span></p>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">สินค้าในระบบ</p>
          <p class="text-3xl font-black text-indigo-600 mt-2">{{ allItems.length }} <span class="text-sm font-bold text-slate-400">รายการ</span></p>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">สัญญาเช่า (Bookings)</p>
          <p class="text-3xl font-black text-amber-500 mt-2">{{ allBookings.length }} <span class="text-sm font-bold text-slate-400">ออเดอร์</span></p>
        </div>
        <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-3xl shadow-lg border border-emerald-400 text-white flex flex-col justify-between relative overflow-hidden">
          <div class="absolute -right-4 -bottom-4 opacity-20"><svg class="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.311c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.311c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/></svg></div>
          <p class="text-[11px] font-bold uppercase tracking-widest relative z-10">รายได้ Platform (Fee)</p>
          <p class="text-3xl font-black mt-2 relative z-10">฿{{ platformRevenue.toLocaleString() }}</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button @click="activeTab = 'users'" :class="['px-6 py-3.5 rounded-2xl font-bold text-sm transition', activeTab === 'users' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200']">ผู้ใช้งาน (Users)</button>
        <button @click="activeTab = 'items'" :class="['px-6 py-3.5 rounded-2xl font-bold text-sm transition', activeTab === 'items' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200']">สินค้า (Moderation)</button>
        <button @click="activeTab = 'transactions'" :class="['px-6 py-3.5 rounded-2xl font-bold text-sm transition', activeTab === 'transactions' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200']">ธุรกรรม (Transactions)</button>
      </div>

      <div v-if="isLoading" class="text-center py-20 text-slate-400 font-bold bg-white rounded-3xl border border-slate-200">กำลังดึงข้อมูลระดับระบบ...</div>

      <!-- 🟢 Tab: Users -->
      <div v-else-if="activeTab === 'users'" class="bg-white rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div class="overflow-x-auto p-2">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              <tr>
                <th class="p-5 rounded-l-2xl">ข้อมูลผู้ใช้</th>
                <th class="p-5">อีเมลติดต่อ</th>
                <th class="p-5">สิทธิ์ปัจจุบัน (Role)</th>
                <th class="p-5 rounded-r-2xl text-center">จัดการสิทธิ์</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in allUsers" :key="u.id" class="border-b border-slate-100 hover:bg-slate-50 transition">
                <td class="p-5">
                  <div class="font-bold text-slate-800">{{ u.first_name || u.username }}</div>
                  <div class="text-[9px] font-mono text-slate-400 mt-0.5">ID: {{ u.id.split('-')[0] }}</div>
                </td>
                <td class="p-5 text-slate-600 font-medium">{{ u.email }}</td>
                <td class="p-5">
                  <span :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase', u.role === 'admin' ? 'bg-rose-100 text-rose-700' : (u.role === 'lender' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600')]">
                    {{ u.role }}
                  </span>
                </td>
                <td class="p-5 text-center flex gap-2 justify-center">
                  <button v-if="u.role !== 'admin'" @click="changeUserRole(u, 'admin')" class="text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-600 hover:text-white transition">เลื่อนเป็น Admin</button>
                  <button v-if="u.role === 'user'" @click="changeUserRole(u, 'lender')" class="text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-500 hover:text-white transition">ให้สิทธิ์ Lender</button>
                  <button v-if="u.role !== 'user'" @click="changeUserRole(u, 'user')" class="text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition">ลดเหลือ User</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 🟢 Tab: Items Moderation -->
      <div v-else-if="activeTab === 'items'" class="bg-white rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div class="overflow-x-auto p-2">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              <tr>
                <th class="p-5 rounded-l-2xl">ข้อมูลสินค้า</th>
                <th class="p-5">ร้านค้า (Lender)</th>
                <th class="p-5">ราคา/วัน</th>
                <th class="p-5 text-center">สถานะแสดงผล</th>
                <th class="p-5 rounded-r-2xl text-center">ระบบตรวจพิจารณา</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in allItems" :key="item.id" class="border-b border-slate-100 hover:bg-slate-50 transition">
                <td class="p-5 flex items-center gap-3">
                  <img :src="item.images[0]" class="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                  <div>
                    <div class="font-bold text-slate-800 line-clamp-1 max-w-[200px]">{{ item.title }}</div>
                    <div class="text-[10px] text-slate-500">{{ item.category }}</div>
                  </div>
                </td>
                <td class="p-5 text-slate-600 font-medium">{{ item.lender?.first_name || 'ไม่ระบุ' }}</td>
                <td class="p-5 font-black text-indigo-600">฿{{ item.price_daily }}</td>
                <td class="p-5 text-center">
                  <span :class="['px-2.5 py-1 rounded-md text-[10px] font-bold shadow-sm', item.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-white']">
                    {{ item.is_active ? 'ปกติ' : 'ถูกระงับ' }}
                  </span>
                </td>
                <td class="p-5 text-center">
                  <button @click="banItem(item)" :class="['text-[11px] font-bold px-4 py-2 rounded-xl transition shadow-sm', item.is_active ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white']">
                    {{ item.is_active ? 'ระงับสินค้า (Ban)' : 'ปลดระงับ (Unban)' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 🟢 Tab: Transactions -->
      <div v-else-if="activeTab === 'transactions'" class="bg-white rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div class="overflow-x-auto p-2">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              <tr>
                <th class="p-5 rounded-l-2xl">Order ID</th>
                <th class="p-5">ผู้เช่า (Renter)</th>
                <th class="p-5">สินค้าอ้างอิง</th>
                <th class="p-5 text-right">ยอดสุทธิ (GMV)</th>
                <th class="p-5 text-right">ค่าธรรมเนียมแพลตฟอร์ม</th>
                <th class="p-5 rounded-r-2xl text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in allBookings" :key="b.id" class="border-b border-slate-100 hover:bg-slate-50 transition">
                <td class="p-5 font-mono font-bold text-indigo-600 text-[11px]">{{ b.order_id }}</td>
                <td class="p-5 text-slate-600 font-medium text-[11px]">{{ b.renter?.email }}</td>
                <td class="p-5 font-bold text-slate-800 line-clamp-1 max-w-[200px]">{{ b.item?.title }}</td>
                <td class="p-5 font-black text-slate-900 text-right">฿{{ b.net_price.toLocaleString() }}</td>
                <td class="p-5 font-black text-emerald-600 text-right">+ ฿150</td>
                <td class="p-5 text-center">
                  <span :class="['px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider', b.status === 'active' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-500 border border-slate-200']">
                    {{ b.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>