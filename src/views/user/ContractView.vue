<script setup>
import { ref } from 'vue'

const activeTab = ref('active')

// ข้อมูลจำลองสัญญาเช่า (เพิ่ม isReviewed เพื่อเช็คว่ารีวิวไปแล้วหรือยัง)
const contracts = ref([
  { 
    id: 'RN-882104', 
    title: 'Tesla Model 3 Long Range', 
    lender: 'คุณธน ์ (Super Lender)',
    startDate: '12 ก.ย. 2026', 
    endDate: '14 ก.ย. 2026',
    days: 3,
    price: 8700, 
    status: 'active', // 🔴 กำลังเช่าอยู่ (รีวิวไม่ได้)
    statusText: 'กำลังเช่าอยู่', 
    isReviewed: false,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 'RN-743299', 
    title: 'Sony A7IV พร้อมเลนส์ 24-70mm GM II', 
    lender: 'Pro Camera Studio',
    startDate: '1 ส.ค. 2026', 
    endDate: '3 ส.ค. 2026',
    days: 3,
    price: 4500, 
    status: 'completed', // 🟢 เสร็จสิ้นแล้ว (รีวิวได้)
    statusText: 'เสร็จสิ้น', 
    isReviewed: false,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400' 
  },
])

// ระบบ Modal สำหรับรีวิว
const showReviewModal = ref(false)
const selectedContract = ref(null)
const reviewForm = ref({ rating: 5, comment: '' })
const isSubmittingReview = ref(false)

const openReviewModal = (contract) => {
  selectedContract.value = contract
  reviewForm.value = { rating: 5, comment: '' } // รีเซ็ตฟอร์ม
  showReviewModal.value = true
}

const submitReview = async () => {
  isSubmittingReview.value = true
  try {
    // จำลองการส่งข้อมูลไป Database
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // เปลี่ยนสถานะการ์ดสินค้านั้นว่า "รีวิวแล้ว"
    const index = contracts.value.findIndex(c => c.id === selectedContract.value.id)
    if(index !== -1) contracts.value[index].isReviewed = true
    
    alert('ขอบคุณสำหรับรีวิวของคุณ!')
    showReviewModal.value = false
  } catch (error) {
    alert('เกิดข้อผิดพลาดในการส่งรีวิว')
  } finally {
    isSubmittingReview.value = false
  }
}
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen pb-20 relative">
    
    <!-- 🟢 Modal สำหรับให้คะแนนรีวิว -->
    <div v-if="showReviewModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showReviewModal = false"></div>
      
      <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-fade-in-up">
        <div class="p-6 md:p-8">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-2xl font-black text-slate-900">ให้คะแนนประสบการณ์</h2>
              <p class="text-slate-500 text-sm mt-1">สินค้า: {{ selectedContract?.title }}</p>
            </div>
            <button @click="showReviewModal = false" class="bg-slate-100 text-slate-500 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center transition">✕</button>
          </div>

          <form @submit.prevent="submitReview">
            <!-- เลือกระดับดาว -->
            <div class="flex justify-center gap-2 mb-6">
              <button type="button" v-for="star in 5" :key="star" @click="reviewForm.rating = star" class="text-4xl transition-transform hover:scale-110 focus:outline-none" :class="star <= reviewForm.rating ? 'text-amber-400' : 'text-slate-200'">
                ★
              </button>
            </div>
            
            <div class="text-center mb-6 text-sm font-bold" :class="reviewForm.rating >= 4 ? 'text-emerald-600' : (reviewForm.rating === 3 ? 'text-amber-600' : 'text-rose-600')">
              {{ reviewForm.rating >= 4 ? 'ยอดเยี่ยมมาก!' : (reviewForm.rating === 3 ? 'พอใช้ได้' : 'ต้องปรับปรุง') }}
            </div>

            <!-- กล่องคอมเมนต์ -->
            <div class="mb-6">
              <label class="block text-xs font-bold text-slate-600 uppercase mb-2">ความคิดเห็นของคุณ (ไม่บังคับ)</label>
              <textarea v-model="reviewForm.comment" rows="4" class="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 resize-none" placeholder="บอกเล่าประสบการณ์การเช่าของคุณ เพื่อเป็นประโยชน์กับผู้ใช้งานท่านอื่น..."></textarea>
            </div>

            <button type="submit" :disabled="isSubmittingReview" class="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg flex justify-center items-center gap-2 disabled:opacity-70">
              <svg v-if="isSubmittingReview" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isSubmittingReview ? 'กำลังส่งข้อมูล...' : 'ส่งรีวิว' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div class="bg-white border-b border-slate-200 pt-10 pb-6 px-4 md:px-10">
      <div class="max-w-[1000px] mx-auto">
        <h1 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">รายการเช่าของฉัน</h1>
        <p class="text-slate-500 mt-2 font-medium">จัดการสัญญา ติดตามสถานะ และดูประวัติการเช่าทั้งหมดของคุณ</p>
        
        <!-- Tabs -->
        <div class="flex gap-8 mt-8 border-b border-slate-100">
          <button @click="activeTab = 'active'" :class="['pb-4 text-sm font-black transition-all border-b-2 px-2', activeTab === 'active' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700']">กำลังดำเนินการ</button>
          <button @click="activeTab = 'completed'" :class="['pb-4 text-sm font-black transition-all border-b-2 px-2', activeTab === 'completed' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700']">เสร็จสิ้นแล้ว</button>
        </div>
      </div>
    </div>

    <!-- Contract List -->
    <div class="max-w-[1000px] mx-auto px-4 md:px-10 py-8">
      <div class="space-y-6">
        
        <!-- การ์ดสัญญา -->
        <div v-for="contract in contracts.filter(c => c.status === activeTab)" :key="contract.id" class="bg-white rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden hover:shadow-xl transition-all duration-300">
          
          <div class="flex flex-col md:flex-row">
            <!-- รูปภาพ -->
            <div class="w-full md:w-64 h-48 md:h-auto bg-slate-100 relative">
              <img :src="contract.image" class="w-full h-full object-cover" />
              <div class="absolute top-3 left-3">
                <span :class="['text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm', contract.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-white']">
                  {{ contract.statusText }}
                </span>
              </div>
            </div>
            
            <!-- ข้อมูลหลัก -->
            <div class="flex-grow p-6 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-2">
                  <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md tracking-widest uppercase">
                    Order {{ contract.id }}
                  </span>
                </div>
                <h3 class="text-xl font-black text-slate-800 mb-1">{{ contract.title }}</h3>
                <p class="text-sm text-slate-500 font-medium">ผู้ให้เช่า: <span class="text-indigo-600">{{ contract.lender }}</span></p>
              </div>

              <!-- วันที่เช่า -->
              <div class="flex items-center gap-4 mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">รับของ</p>
                  <p class="text-sm font-bold text-slate-800">{{ contract.startDate }}</p>
                </div>
                <div class="flex-grow relative flex items-center justify-center">
                  <div class="w-full h-px bg-slate-300 border-dashed border-t-2 border-slate-300"></div>
                  <span class="absolute bg-slate-50 text-[10px] font-bold text-slate-500 px-2">{{ contract.days }} วัน</span>
                </div>
                <div class="text-right">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ส่งคืน</p>
                  <p class="text-sm font-bold text-slate-800">{{ contract.endDate }}</p>
                </div>
              </div>
            </div>
            
            <!-- ส่วนราคาและปุ่มกด -->
            <div class="w-full md:w-56 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 p-6 flex flex-row md:flex-col justify-between items-center md:items-end text-right">
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left md:text-right">ยอดชำระสุทธิ</p>
                <p class="text-2xl font-black text-indigo-600">฿{{ contract.price.toLocaleString() }}</p>
              </div>
              <div class="flex flex-col gap-2 w-full md:w-auto">
                <button class="w-full bg-slate-900 text-white text-xs font-bold px-5 py-3 rounded-xl hover:bg-slate-800 transition shadow-md">
                  ดูสัญญาเต็ม (PDF)
                </button>

                <!-- 🌟 ปุ่มรีวิว จะโผล่เฉพาะ Status = completed -->
                <template v-if="contract.status === 'completed'">
                  <button v-if="!contract.isReviewed" @click="openReviewModal(contract)" class="w-full bg-white border-2 border-amber-400 text-amber-600 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-amber-50 transition flex justify-center items-center gap-1.5">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ให้คะแนนรีวิว
                  </button>
                  <button v-else disabled class="w-full bg-slate-100 border border-slate-200 text-slate-400 text-xs font-bold px-5 py-2.5 rounded-xl cursor-not-allowed">
                    รีวิวแล้ว ✔️
                  </button>
                </template>

              </div>
            </div>

          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="contracts.filter(c => c.status === activeTab).length === 0" class="text-center py-20 bg-white border border-slate-200 rounded-[2rem] shadow-sm">
          <div class="text-6xl mb-4 grayscale opacity-50">📭</div>
          <h3 class="text-xl font-black text-slate-800">ไม่มีประวัติการเช่าในหมวดหมู่นี้</h3>
          <p class="text-slate-500 font-medium text-sm mt-2 mb-6">คุณยังไม่มีรายการเช่าที่ตรงกับสถานะที่คุณเลือก</p>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>