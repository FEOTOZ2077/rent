<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useItems } from '@/composables/useItems'
import { useBookings } from '@/composables/useBookings'
import { useRouter } from 'vue-router'

const router = useRouter()
const { user } = useAuth()
const { items, fetchLenderItems } = useItems()
const { bookings, fetchLenderBookings, updateStatus } = useBookings()

const activeTab = ref('orders')

onMounted(async () => {
  if (!user.id) return router.push('/auth')
  await fetchLenderBookings(user.id)
  await fetchLenderItems(user.id)
})

const totalRevenue = computed(() => bookings.value.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.net_price, 0))

const handleCompleteBooking = async (id) => {
  if(confirm('ยืนยันว่าลูกค้าคืนของเรียบร้อยแล้ว? ระบบจะโอนเงินให้คุณ')) {
    await updateStatus(id, 'completed')
    await fetchLenderBookings(user.id)
    alert('อัปเดตสถานะออเดอร์เรียบร้อยแล้ว')
  }
}
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen font-sans pb-20">
    <!-- Header -->
    <div class="bg-slate-900 text-white pt-10 pb-20 px-6">
      <div class="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-black mb-1">แผงควบคุมร้านค้า</h1>
          <p class="text-indigo-200 text-sm">ยินดีต้อนรับกลับมา, คุณ {{ user.name }}</p>
        </div>
        <div class="text-left md:text-right bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-md">
          <p class="text-xs text-indigo-300 font-bold uppercase tracking-widest">รายได้รวมของคุณ</p>
          <p class="text-3xl font-black text-emerald-400">฿{{ totalRevenue.toLocaleString() }}</p>
        </div>
      </div>
    </div>

    <div class="max-w-[1200px] mx-auto px-6 -mt-8">
      <!-- Tabs -->
      <div class="flex gap-4 mb-6 overflow-x-auto pb-2">
        <button @click="activeTab = 'orders'" :class="['px-6 py-3 rounded-2xl font-bold text-sm shadow-sm transition whitespace-nowrap', activeTab === 'orders' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50']">ออเดอร์ลูกค้า ({{ bookings.length }})</button>
        <button @click="activeTab = 'items'" :class="['px-6 py-3 rounded-2xl font-bold text-sm shadow-sm transition whitespace-nowrap', activeTab === 'items' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50']">จัดการสินค้า ({{ items.length }})</button>
      </div>

      <!-- Tab Orders -->
      <div v-if="activeTab === 'orders'" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden">
        <h2 class="text-xl font-black text-slate-800 mb-6">รายการเช่าที่ต้องจัดการ</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-slate-50 text-slate-500">
              <tr>
                <th class="p-4 rounded-l-xl">Order ID</th>
                <th class="p-4">สินค้า</th>
                <th class="p-4">ผู้เช่า</th>
                <th class="p-4">ยอดเงิน</th>
                <th class="p-4">สถานะ</th>
                <th class="p-4 rounded-r-xl">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="bookings.length === 0"><td colspan="6" class="text-center p-8 text-slate-400 font-medium">ยังไม่มีออเดอร์ในขณะนี้</td></tr>
              <tr v-for="b in bookings" :key="b.id" class="border-b border-slate-100 hover:bg-slate-50">
                <td class="p-4 font-mono font-bold text-indigo-600 text-xs">{{ b.order_id }}</td>
                <td class="p-4 font-bold text-slate-800">{{ b.item.title }}</td>
                <td class="p-4 text-slate-600">{{ b.renter?.first_name || 'ไม่ระบุชื่อ' }} <br><span class="text-[10px]">{{ b.renter?.phone || '-' }}</span></td>
                <td class="p-4 font-black">฿{{ b.net_price.toLocaleString() }}</td>
                <td class="p-4">
                  <span :class="['px-2.5 py-1 rounded-md text-[10px] font-bold', b.status === 'active' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700']">
                    {{ b.status === 'active' ? 'กำลังเช่า' : 'เสร็จสิ้น' }}
                  </span>
                </td>
                <td class="p-4">
                  <button v-if="b.status === 'active'" @click="handleCompleteBooking(b.id)" class="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-800 transition">รับของคืนแล้ว</button>
                  <span v-else class="text-xs text-slate-400 font-bold">จัดการแล้ว</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab Items -->
      <div v-if="activeTab === 'items'" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-black text-slate-800">คลังสินค้าของคุณ</h2>
          <button class="bg-indigo-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-md hover:bg-indigo-700 transition">+ เพิ่มสินค้า</button>
        </div>
        <div v-if="items.length === 0" class="text-center py-10 text-slate-400 font-medium">คุณยังไม่มีสินค้าในร้าน</div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="item in items" :key="item.id" class="border border-slate-200 rounded-2xl p-4 flex gap-4 hover:shadow-md transition">
            <img :src="item.images[0]" class="w-20 h-20 rounded-xl object-cover bg-slate-100" />
            <div class="flex-grow">
              <h4 class="font-bold text-slate-800 line-clamp-1">{{ item.title }}</h4>
              <p class="text-xs text-slate-500 mt-1">฿{{ item.price_daily.toLocaleString() }}/วัน</p>
              <div class="mt-2 text-[10px] font-bold text-indigo-600 cursor-pointer hover:underline">แก้ไขข้อมูล</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>