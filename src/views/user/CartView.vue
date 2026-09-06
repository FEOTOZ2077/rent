<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useBookings } from '@/composables/useBookings'

const router = useRouter()
const { user } = useAuth()
const { createBooking } = useBookings()

const cartItems = ref([])
const paymentMethod = ref('promptpay') 
const isProcessing = ref(false)

onMounted(() => {
  cartItems.value = JSON.parse(localStorage.getItem('rentall_cart') || '[]')
})

const removeFromCart = (index) => {
  cartItems.value.splice(index, 1)
  localStorage.setItem('rentall_cart', JSON.stringify(cartItems.value))
}

const grandTotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.totalPrice, 0))

const handlePayNow = async () => {
  if (cartItems.value.length === 0) return alert('ไม่มีรายการในตะกร้า')
  if (!user.id) return alert('กรุณาเข้าสู่ระบบก่อนทำการชำระเงิน')
  
  isProcessing.value = true
  try {
    // 🟢 ยิงข้อมูลเข้า Database จริง
    await createBooking(user.id, cartItems.value)
    alert('ชำระเงินสำเร็จ! คำสั่งเช่าของคุณได้รับการยืนยันแล้ว และส่งสัญญาให้ผู้ให้เช่าแล้ว')
    localStorage.removeItem('rentall_cart')
    router.push('/contract')
  } catch(error) {
    alert(error.message)
  } finally {
    isProcessing.value = false
  }
}
</script>