<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useBookings } from '@/composables/useBookings'

const { user } = useAuth()
const { bookings: contracts, fetchUserBookings } = useBookings()

const activeTab = ref('active')

onMounted(async () => {
  window.scrollTo(0, 0)
  if (user.id) {
    await fetchUserBookings(user.id) // 🟢 ดึงจาก DB ตาม ID ตัวเอง
  }
})

// โค้ดส่วน Chat และ Review ให้คงไว้แบบนี้เพื่อให้กดลูกเล่น UI ได้
const showChatModal = ref(false)
const currentChatLender = ref(null)
const newMessage = ref('')
const chatMessages = ref([])

const openChat = (contract) => {
  currentChatLender.value = { id: contract.order_id, lender: contract.item.lender.first_name, lenderAvatar: contract.item.lender.avatar_url }
  chatMessages.value = [{ text: `สวัสดีครับ ยินดีต้อนรับสู่ร้าน ${contract.item.lender.first_name} ต้องการสอบถามข้อมูลแจ้งได้เลยครับ`, isMe: false, time: '10:01 น.' }]
  showChatModal.value = true
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  chatMessages.value.push({ text: newMessage.value, isMe: true, time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.' })
  newMessage.value = ''
}

const showReviewModal = ref(false)
const selectedContract = ref(null)
const reviewForm = ref({ rating: 5, comment: '' })

const openReviewModal = (contract) => {
  selectedContract.value = contract
  reviewForm.value = { rating: 5, comment: '' }
  showReviewModal.value = true
}

const submitReview = () => {
  alert('ส่งรีวิวเรียบร้อย ขอบคุณสำหรับความคิดเห็นครับ!')
  showReviewModal.value = false
}
</script>