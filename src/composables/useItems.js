import { ref } from 'vue'
import { supabase } from './useAuth'

export function useItems() {
  const items = ref([])
  const currentItem = ref(null)
  const isLoading = ref(false)

  // 🟢 ดึงสินค้าทั้งหมด
  const fetchItems = async () => {
    isLoading.value = true
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*, lender:profiles(first_name, last_name, avatar_url)')
        .eq('is_active', true)
      
      if (error) throw error
      if (data) items.value = data
    } catch (err) {
      console.error('Error fetching items:', err.message)
    } finally {
      isLoading.value = false
    }
  }

  // 🟢 ดึงสินค้ารายตัว (สำหรับหน้า ItemDetail)
  const fetchItemById = async (id) => {
    isLoading.value = true
    currentItem.value = null
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*, lender:profiles(first_name, last_name, avatar_url)')
        .eq('id', id)
        .single()
      
      if (error) throw error
      if (data) currentItem.value = data
    } catch (err) {
      console.error('Error fetching item detail:', err.message)
    } finally {
      isLoading.value = false
    }
  }

  // 🟢 ดึงสินค้าเฉพาะของร้านตัวเอง
  const fetchLenderItems = async (userId) => {
    isLoading.value = true
    const { data } = await supabase.from('items').select('*').eq('lender_id', userId)
    if (data) items.value = data
    isLoading.value = false
  }

  return { items, currentItem, isLoading, fetchItems, fetchItemById, fetchLenderItems }
}import { ref } from 'vue'
import { supabase } from './useAuth'

export function useItems() {
  const items = ref([])
  const currentItem = ref(null)
  const isLoading = ref(false)

  // 🟢 ดึงสินค้าทั้งหมด
  const fetchItems = async () => {
    isLoading.value = true
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*, lender:profiles(first_name, last_name, avatar_url)')
        .eq('is_active', true)
      
      if (error) throw error
      if (data) items.value = data
    } catch (err) {
      console.error('Error fetching items:', err.message)
    } finally {
      isLoading.value = false
    }
  }

// 🟢 ดึงสินค้ารายตัว (สำหรับหน้า ItemDetail)
  const fetchItemById = async (id) => {
    isLoading.value = true
    currentItem.value = null
    try {
      const { data, error } = await supabase
        .from('items')
        // ลบ created_at ออกแล้ว
        .select('*, lender:profiles(first_name, last_name, avatar_url, rental_count)')
        .eq('id', id)
        .single()
      
      if (error) throw error
      if (data) currentItem.value = data
    } catch (err) {
      console.error('Error fetching item detail:', err.message)
    } finally {
      isLoading.value = false
    }
  }

  // 🟢 ดึงสินค้าเฉพาะของร้านตัวเอง
  const fetchLenderItems = async (userId) => {
    isLoading.value = true
    const { data } = await supabase.from('items').select('*').eq('lender_id', userId)
    if (data) items.value = data
    isLoading.value = false
  }

  return { items, currentItem, isLoading, fetchItems, fetchItemById, fetchLenderItems }
}