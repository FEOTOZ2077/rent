<script setup>
import { ref, onMounted } from 'vue'

const activeTab = ref('active')

// 📦 ข้อมูลจำลองสัญญาเช่า
const contracts = ref([
  { 
    id: 'RN-882104', 
    title: 'Tesla Model 3 Long Range', 
    lender: 'คุณธน ์ (Super Lender)',
    lenderAvatar: 'https://i.pravatar.cc/150?u=10',
    startDate: '12 ก.ย. 2026 10:00 น.', 
    endDate: '14 ก.ย. 2026 10:00 น.',
    duration: '2 วัน',
    price: 5950, 
    status: 'active',
    statusText: 'กำลังเช่าอยู่', 
    isReviewed: false,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 'RN-743299', 
    title: 'Sony A7IV พร้อมเลนส์ 24-70mm GM II', 
    lender: 'Pro Camera Studio',
    lenderAvatar: 'https://i.pravatar.cc/150?u=22',
    startDate: '1 ส.ค. 2026 09:00 น.', 
    endDate: '3 ส.ค. 2026 09:00 น.',
    duration: '2 วัน',
    price: 3150, 
    status: 'completed',
    statusText: 'เสร็จสิ้น', 
    isReviewed: false,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400' 
  },
])

// 💬 ระบบ Chat Modal
const showChatModal = ref(false)
const currentChatLender = ref(null)
const newMessage = ref('')
const chatMessages = ref([])

const openChat = (contract) => {
  currentChatLender.value = contract
  chatMessages.value = [
    { text: `สวัสดีครับ ยินดีต้อนรับสู่ร้าน ${contract.lender} ต้องการสอบถามข้อมูลการรับ-ส่งของ หรือการใช้งานแจ้งได้เลยนะครับ`, isMe: false, time: '10:01 น.' }
  ]
  showChatModal.value = true
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  chatMessages.value.push({ text: newMessage.value, isMe: true, time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.' })
  newMessage.value = ''
  
  // จำลองร้านค้าตอบกลับ
  setTimeout(() => {
    chatMessages.value.push({ text: 'รับทราบครับ เดี๋ยวทางเราประสานงานให้นะครับ', isMe: false, time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.' })
  }, 1500)
}

// ⭐ ระบบ Review Modal
const showReviewModal = ref(false)
const selectedContract = ref(null)
const reviewForm = ref({ rating: 5, comment: '' })
const isSubmittingReview = ref(false)

const openReviewModal = (contract) => {
  selectedContract.value = contract
  reviewForm.value = { rating: 5, comment: '' }
  showReviewModal.value = true
}

const submitReview = async () => {
  isSubmittingReview.value = true
  setTimeout(() => {
    const index = contracts.value.findIndex(c => c.id === selectedContract.value.id)
    if(index !== -1) contracts.value[index].isReviewed = true
    alert('ส่งรีวิวเรียบร้อย ขอบคุณสำหรับความคิดเห็นครับ!')
    showReviewModal.value = false
    isSubmittingReview.value = false
  }, 1000)
}

onMounted(() => window.scrollTo(0, 0))
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen pb-20 relative font-sans">
    
    <!-- 💬 Modal: Chat (ระบบแชทกับร้านค้า) -->
    <div v-if="showChatModal" class="fixed inset-0 z-50 flex items-center justify-center lg:p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showChatModal = false"></div>
      <div class="bg-white lg:rounded-3xl w-full h-full lg:h-auto lg:max-h-[85vh] max-w-lg relative z-10 flex flex-col overflow-hidden animate-slide-up shadow-2xl">
        <!-- Chat Header -->
        <div class="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-white shadow-sm z-10">
          <img :src="currentChatLender?.lenderAvatar" class="w-10 h-10 rounded-full border border-slate-200 object-cover" />
          <div class="flex-grow">
            <h3 class="font-black text-slate-800 text-sm line-clamp-1">{{ currentChatLender?.lender }}</h3>
            <p class="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> ออนไลน์
            </p>
          </div>
          <button @click="showChatModal = false" class="p-2 bg-slate-50 text-slate-500 rounded-full hover:bg-slate-100 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <!-- Chat Messages Area -->
        <div class="flex-grow p-5 overflow-y-auto bg-slate-50 space-y-4">
          <div class="text-center mb-6">
            <span class="text-[10px] bg-slate-200/50 text-slate-400 px-3 py-1 rounded-full font-bold">แชทเกี่ยวกับการเช่า {{ currentChatLender?.id }}</span>
          </div>
          
          <div v-for="(msg, i) in chatMessages" :key="i" :class="['flex w-full', msg.isMe ? 'justify-end' : 'justify-start']">
            <div :class="['max-w-[75%] px-4 py-2.5 rounded-2xl text-sm font-medium', msg.isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm']">
              {{ msg.text }}
              <div :class="['text-[9px] mt-1 text-right opacity-70', msg.isMe ? 'text-indigo-100' : 'text-slate-400']">{{ msg.time }}</div>
            </div>
          </div>
        </div>

        <!-- Chat Input Area -->
        <div class="p-4 bg-white border-t border-slate-100">
          <form @submit.prevent="sendMessage" class="flex items-center gap-2">
            <input v-model="newMessage" type="text" placeholder="พิมพ์ข้อความ..." class="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition" />
            <button type="submit" class="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition shadow-md">
              <svg class="w-5 h-5 -rotate-45 ml-0.5 mb-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- ⭐ Modal: Review (ระบบรีวิว) -->
    <div v-if="showReviewModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showReviewModal = false"></div>
      <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-slide-up p-6 md:p-8">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-xl md:text-2xl font-black text-slate-900">ให้คะแนนประสบการณ์</h2>
            <p class="text-slate-500 text-xs font-medium mt-1 line-clamp-1">รายการ: {{ selectedContract?.title }}</p>
          </div>
          <button @click="showReviewModal = false" class="bg-slate-50 text-slate-500 p-2 rounded-full hover:bg-slate-100 transition">
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form @submit.prevent="submitReview">
          <div class="flex justify-center gap-2 mb-4">
            <button type="button" v-for="star in 5" :key="star" @click="reviewForm.rating = star" class="transition-transform hover:scale-110 outline-none">
              <svg :class="['w-10 h-10', star <= reviewForm.rating ? 'text-amber-400' : 'text-slate-200']" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </button>
          </div>
          <div class="text-center mb-6 text-sm font-bold" :class="reviewForm.rating >= 4 ? 'text-emerald-600' : (reviewForm.rating === 3 ? 'text-amber-600' : 'text-rose-600')">
            {{ reviewForm.rating >= 4 ? 'ยอดเยี่ยมประทับใจ!' : (reviewForm.rating === 3 ? 'ใช้งานได้ปกติ' : 'ต้องปรับปรุงด่วน') }}
          </div>

          <div class="mb-6">
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">ความคิดเห็น (ไม่บังคับ)</label>
            <textarea v-model="reviewForm.comment" rows="3" class="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none" placeholder="แชร์ความประทับใจ หรือข้อเสนอแนะ..."></textarea>
          </div>

          <button type="submit" :disabled="isSubmittingReview" class="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-slate-800 transition shadow-lg flex justify-center items-center gap-2 disabled:opacity-70">
            <svg v-if="isSubmittingReview" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isSubmittingReview ? 'กำลังส่งข้อมูล...' : 'ส่งรีวิวให้ร้านค้า' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Header Section -->
    <div class="bg-white border-b border-slate-200 pt-8 pb-4 px-4 md:px-10">
      <div class="max-w-[1000px] mx-auto">
        <h1 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">รายการเช่าของฉัน</h1>
        <p class="text-slate-500 mt-2 text-sm font-medium">ติดตามสถานะ แชทกับร้านค้า และจัดการประวัติการเช่าของคุณ</p>
        
        <!-- Tabs -->
        <div class="flex gap-6 mt-8">
          <button @click="activeTab = 'active'" :class="['pb-3 text-sm font-black transition-all border-b-[3px] px-1', activeTab === 'active' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600']">กำลังดำเนินการ</button>
          <button @click="activeTab = 'completed'" :class="['pb-3 text-sm font-black transition-all border-b-[3px] px-1', activeTab === 'completed' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600']">ประวัติที่เสร็จสิ้น</button>
        </div>
      </div>
    </div>

    <!-- Contract List Grid -->
    <div class="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-10 py-8">
      <div class="space-y-6">
        
        <div v-for="contract in contracts.filter(c => c.status === activeTab)" :key="contract.id" class="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col md:flex-row">
          
          <div class="w-full md:w-64 h-48 md:h-auto bg-slate-100 relative flex-shrink-0">
            <img :src="contract.image" class="w-full h-full object-cover" />
            <div class="absolute top-3 left-3">
              <span :class="['text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm border', contract.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200']">
                {{ contract.statusText }}
              </span>
            </div>
          </div>
          
          <div class="flex-grow p-5 md:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100">
            <div>
              <div class="flex justify-between items-start mb-1">
                <span class="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase">
                  {{ contract.id }}
                </span>
              </div>
              <h3 class="text-lg md:text-xl font-black text-slate-900 mb-2 leading-snug">{{ contract.title }}</h3>
              <div class="flex items-center gap-2 text-xs font-bold text-slate-500">
                <img :src="contract.lenderAvatar" class="w-5 h-5 rounded-full object-cover border border-slate-200" />
                ผู้ให้เช่า: <span class="text-slate-800">{{ contract.lender }}</span>
              </div>
            </div>

            <div class="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 font-medium grid grid-cols-2 gap-2">
              <div><span class="font-bold text-slate-800">รับ:</span> {{ contract.startDate }}</div>
              <div><span class="font-bold text-indigo-700">คืน:</span> {{ contract.endDate }}</div>
            </div>
          </div>
          
          <!-- Action Buttons / Price -->
          <div class="w-full md:w-64 p-5 md:p-6 flex flex-row md:flex-col justify-between items-center md:items-end text-right bg-slate-50/50">
            <div class="text-left md:text-right w-full md:w-auto">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ยอดสุทธิ ({{ contract.duration }})</p>
              <p class="text-xl font-black text-indigo-600">฿{{ contract.price.toLocaleString() }}</p>
            </div>
            
            <div class="flex flex-col gap-2 w-auto md:w-full mt-0 md:mt-4">
              <!-- 🟢 ปุ่มแชท (เฉพาะตอน Active) -->
              <button v-if="contract.status === 'active'" @click="openChat(contract)" class="w-full bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-sm flex items-center justify-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                แชทกับร้านค้า
              </button>

              <button class="w-full bg-white border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                ดูสัญญาเต็ม
              </button>

              <!-- ⭐ ปุ่มรีวิว (เฉพาะตอน Completed) -->
              <template v-if="contract.status === 'completed'">
                <button v-if="!contract.isReviewed" @click="openReviewModal(contract)" class="w-full bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition shadow-sm flex items-center justify-center gap-1.5">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ให้คะแนนร้านค้า
                </button>
                <button v-else disabled class="w-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold px-4 py-2.5 rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg> รีวิวเรียบร้อย
                </button>
              </template>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="contracts.filter(c => c.status === activeTab).length === 0" class="text-center py-24 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div class="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <h3 class="text-xl font-black text-slate-800">ไม่มีข้อมูลสัญญาเช่าในหมวดหมู่นี้</h3>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>