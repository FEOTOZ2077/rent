<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useItems } from '@/composables/useItems'

const route = useRoute()
const router = useRouter()
const { currentItem: item, fetchItemById, isLoading } = useItems() // 🟢 ดึงข้อมูลรายตัว

const rentalMode = ref('daily') 
const rentalDays = ref(1)
const rentalHours = ref(3) 
const isAddingToCart = ref(false)

// 🗓️ ระบบคำนวณวันที่แบบ Real-time
const startDateObj = new Date()
startDateObj.setDate(startDateObj.getDate() + 1)
startDateObj.setHours(10, 0, 0, 0)

const formatDate = (date) => {
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
}

const startDisplay = computed(() => formatDate(startDateObj))

const endDisplay = computed(() => {
  const endDateObj = new Date(startDateObj)
  if (rentalMode.value === 'daily') {
    endDateObj.setDate(endDateObj.getDate() + parseInt(rentalDays.value))
  } else {
    endDateObj.setHours(endDateObj.getHours() + parseInt(rentalHours.value))
  }
  return formatDate(endDateObj)
})

// คำนวณราคา
const calculateTotal = computed(() => {
  if (!item.value) return 0
  return rentalMode.value === 'daily' 
    ? item.value.price_daily * rentalDays.value 
    : item.value.price_hourly * rentalHours.value
})

const platformFee = 150
const netPrice = computed(() => calculateTotal.value + platformFee)

onMounted(async () => {
  window.scrollTo(0, 0)
  await fetchItemById(route.params.id) // 🟢 ยิงไปหา Supabase ตอนเปิดหน้า
})

// 🛒 ฟังก์ชันบันทึกเข้า Cart
const executeAddToCart = () => {
  if (!item.value) return
  isAddingToCart.value = true
  setTimeout(() => {
    const newCartOrder = {
      orderId: 'RN-' + Math.floor(100000 + Math.random() * 900000),
      itemId: item.value.id,
      itemTitle: item.value.title,
      itemImage: item.value.images[0],
      lenderName: item.value.lender.first_name,
      mode: rentalMode.value,
      duration: rentalMode.value === 'daily' ? rentalDays.value : rentalHours.value,
      durationText: rentalMode.value === 'daily' ? `${rentalDays.value} วัน` : `${rentalHours.value} ชม.`,
      startDateISO: startDateObj.toISOString(), // เก็บลง DB
      endDateISO: rentalMode.value === 'daily' 
        ? new Date(startDateObj.getTime() + rentalDays.value * 86400000).toISOString() 
        : new Date(startDateObj.getTime() + rentalHours.value * 3600000).toISOString(),
      pickupDate: startDisplay.value, // สำหรับแสดงใน UI
      returnDate: endDisplay.value,
      netPrice: netPrice.value,
      totalPrice: netPrice.value
    }

    const currentCart = JSON.parse(localStorage.getItem('rentall_cart') || '[]')
    currentCart.push(newCartOrder)
    localStorage.setItem('rentall_cart', JSON.stringify(currentCart))

    isAddingToCart.value = false
    router.push('/cart')
  }, 600)
}
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen font-sans pb-32">
    <!-- ถ้ากำลังโหลด -->
    <div v-if="isLoading || !item" class="flex items-center justify-center min-h-screen text-slate-400">
       กำลังโหลดข้อมูล...
    </div>

    <!-- ถ้ามีข้อมูล -->
    <div v-else class="max-w-[1200px] mx-auto px-4 md:px-10 py-8">
      
      <!-- หัวข้อสินค้า -->
      <h1 class="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-4">{{ item.title }}</h1>
      <p class="text-slate-500 font-bold mb-8">📍 {{ item.location }}</p>

      <!-- รูปสินค้า -->
      <div class="aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden mb-10 shadow-sm border border-slate-200">
        <img :src="item.images[0]" class="w-full h-full object-cover" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- ฝั่งซ้าย (รายละเอียด) -->
        <div class="lg:col-span-2 space-y-8">
          <div class="flex items-center gap-4 bg-white p-6 rounded-3xl border shadow-sm">
            <img :src="item.lender?.avatar_url" class="w-14 h-14 rounded-full border object-cover" />
            <div>
              <h3 class="font-black text-slate-900 text-lg">ปล่อยเช่าโดยคุณ {{ item.lender?.first_name }}</h3>
            </div>
          </div>
          <div class="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
            <h3 class="text-xl font-black">รายละเอียดสินค้า</h3>
            <p class="text-slate-600 font-medium">{{ item.description }}</p>
          </div>
        </div>

        <!-- ฝั่งขวา (วิดเจ็ตจอง) -->
        <div class="lg:col-span-1 sticky top-28">
          <div class="bg-white rounded-3xl border shadow-lg p-7 space-y-6">
            <div class="flex items-end gap-1.5">
              <span class="text-3xl font-black text-slate-900">฿{{ (rentalMode === 'daily' ? item.price_daily : item.price_hourly).toLocaleString() }}</span>
              <span class="text-slate-500 text-sm">/ {{ rentalMode === 'daily' ? 'วัน' : 'ชม.' }}</span>
            </div>

            <!-- Tab & Slider -->
            <div class="flex bg-slate-100 p-1 rounded-xl">
              <button @click="rentalMode = 'daily'" :class="['flex-1 py-2 text-xs font-bold rounded-lg', rentalMode==='daily' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500']">รายวัน</button>
              <button @click="rentalMode = 'hourly'" :class="['flex-1 py-2 text-xs font-bold rounded-lg', rentalMode==='hourly' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500']">รายชั่วโมง</button>
            </div>

            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <p class="font-bold text-slate-500">รับ: <span class="text-slate-900">{{ startDisplay }}</span></p>
              <p class="font-bold text-indigo-500 mt-2">คืน: <span class="text-indigo-700">{{ endDisplay }}</span></p>
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold">ระยะเวลา</span>
                <span class="text-sm font-black text-indigo-600">{{ rentalMode === 'daily' ? `${rentalDays} วัน` : `${rentalHours} ชม.` }}</span>
              </div>
              <input v-if="rentalMode === 'daily'" type="range" v-model.number="rentalDays" min="1" max="30" class="w-full accent-indigo-600" />
              <input v-else type="range" v-model.number="rentalHours" min="1" max="24" class="w-full accent-indigo-600" />
            </div>

            <button @click="executeAddToCart" :disabled="isAddingToCart" class="w-full bg-slate-900 text-white font-black py-4 rounded-xl shadow-lg hover:bg-slate-800 transition">
              {{ isAddingToCart ? 'กำลังเพิ่ม...' : 'เพิ่มลงตะกร้า' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>