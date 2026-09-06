<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/composables/useAuth'

const allUsers = ref([])
const allBookings = ref([])
const platformRevenue = ref(0) 

onMounted(async () => {
  const { data: users } = await supabase.from('profiles').select('*')
  allUsers.value = users || []

  const { data: bookings } = await supabase.from('bookings').select('*')
  allBookings.value = bookings || []

  platformRevenue.value = allBookings.value.length * 150
})
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen font-sans pb-20">
    <div class="bg-rose-600 text-white pt-10 pb-20 px-6">
      <div class="max-w-[1200px] mx-auto">
        <h1 class="text-3xl font-black mb-1">Super Admin Dashboard</h1>
        <p class="text-rose-200 text-sm">ระบบควบคุมและจัดการแพลตฟอร์ม RentAll</p>
      </div>
    </div>

    <div class="max-w-[1200px] mx-auto px-6 -mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">ผู้ใช้งานทั้งหมด</p>
        <p class="text-4xl font-black text-slate-800">{{ allUsers.length }} <span class="text-sm">คน</span></p>
      </div>
      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">ธุรกรรมทั้งหมด</p>
        <p class="text-4xl font-black text-slate-800">{{ allBookings.length }} <span class="text-sm">ออเดอร์</span></p>
      </div>
      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">รายได้แพลตฟอร์ม (Fee)</p>
        <p class="text-4xl font-black text-emerald-500">฿{{ platformRevenue.toLocaleString() }}</p>
      </div>
    </div>

    <div class="max-w-[1200px] mx-auto px-6">
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden">
        <h2 class="text-xl font-black text-slate-800 mb-6">ผู้ใช้งานล่าสุด</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-slate-50 text-slate-500">
              <tr>
                <th class="p-4">UID</th>
                <th class="p-4">อีเมล</th>
                <th class="p-4">สถานะ (Role)</th>
                <th class="p-4">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in allUsers" :key="u.id" class="border-b border-slate-100 hover:bg-slate-50">
                <td class="p-4 font-mono text-xs text-slate-400">{{ u.id.split('-')[0] }}...</td>
                <td class="p-4 font-bold text-slate-800">{{ u.email }}</td>
                <td class="p-4">
                  <span :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase', u.role === 'admin' ? 'bg-rose-100 text-rose-700' : (u.role === 'lender' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700')]">
                    {{ u.role }}
                  </span>
                </td>
                <td class="p-4">
                  <button class="text-rose-500 text-xs font-bold hover:underline bg-rose-50 px-3 py-1.5 rounded-lg">ระงับบัญชี</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>