import { ref } from 'vue'
import { supabase } from './useAuth'

export function useBookings() {
  const bookings = ref([])
  const isLoading = ref(false)

  // 🟢 ดึงประวัติการเช่าของตัวเอง (ผู้เช่าดูในหน้า Contract)
  const fetchUserBookings = async (userId) => {
    isLoading.value = true
    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        item:items (
          title, images,
          lender:profiles!items_lender_id_fkey (first_name, avatar_url)
        )
      `)
      .eq('renter_id', userId)
      .order('created_at', { ascending: false })
      
    if (data) bookings.value = data
    isLoading.value = false
  }

  // 🟢 ดึงออเดอร์ของลูกค้าที่มาเช่าของร้านเรา (Lender Dashboard)
  const fetchLenderBookings = async (lenderId) => {
    isLoading.value = true
    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        item:items!inner (title, images, lender_id),
        renter:profiles!bookings_renter_id_fkey (first_name, phone)
      `)
      .eq('item.lender_id', lenderId)
      .order('created_at', { ascending: false })
      
    if (data) bookings.value = data
    isLoading.value = false
  }

  // 🟢 สร้างสัญญาเช่าใหม่ (หน้า Cart ตอนจ่ายเงิน)
  const createBooking = async (userId, cartData) => {
    const payloads = cartData.map(c => ({
      order_id: c.orderId,
      renter_id: userId,
      item_id: c.itemId,
      mode: c.mode,
      duration: c.duration,
      start_date: new Date(c.startDateISO || Date.now()).toISOString(),
      end_date: new Date(c.endDateISO || Date.now()).toISOString(),
      net_price: c.netPrice,
      status: 'active'
    }))
    
    const { error } = await supabase.from('bookings').insert(payloads)
    if (error) throw new Error('เกิดข้อผิดพลาดในการสร้างสัญญาเช่า')
  }

  // 🟢 อัปเดตสถานะสัญญา (เช่น คืนของแล้ว)
  const updateStatus = async (bookingId, status) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId)
    if (error) throw new Error('ไม่สามารถอัปเดตสถานะได้')
  }

  return { bookings, isLoading, fetchUserBookings, fetchLenderBookings, createBooking, updateStatus }
}