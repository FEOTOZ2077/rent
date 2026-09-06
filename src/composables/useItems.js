import { ref } from 'vue'
import { supabase } from './useAuth'

export function useItems() {
  const items = ref([])
  const currentItem = ref(null)
  const isLoading = ref(false)

  // 🟢 ดึงสินค้าทั้งหมด (แสดงใน Home, Search)
  const fetchItems = async () => {
    isLoading.value = true
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          lender:profiles!items_lender_id_fkey(first_name, last_name, avatar_url)
        `)
        .eq('is_active', true)
      
      if (error) throw error
      if (data) items.value = data
    } catch (err) {
      console.error('Error fetching items:', err.message)
    } finally {
      isLoading.value = false
    }
  }

  // 🟢 ดึงสินค้าเฉพาะของร้านตัวเอง (Lender Dashboard)
  const fetchLenderItems = async (userId) => {
    isLoading.value = true
    const { data } = await supabase.from('items').select('*').eq('lender_id', userId)
    if (data) items.value = data
    isLoading.value = false
  }

  return { items, currentItem, isLoading, fetchItems, fetchLenderItems }
}