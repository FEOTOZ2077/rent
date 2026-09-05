import { ref, reactive } from 'vue'
import { createClient } from '@supabase/supabase-js'

// 1. ⚠️ ใส่ URL และ ANON KEY ของ Supabase ของคุณ
const supabaseUrl = 'https://zdwhdoazubrchboeyllh.supabase.co'
const supabaseAnonKey = 'sb_publishable_tSl14p9Whn2fMYHaRA7unw_rYfiXpqX'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 2. 🟢 ประกาศ State ไว้ "ด้านนอก" ฟังก์ชัน (แก้ Error ตรงนี้)
const isAuthenticated = ref(false)
const user = reactive({
  id: '', 
  name: '', 
  firstName: '', 
  lastName: '', 
  username: '', 
  email: '', 
  role: 'user', 
  phone: '', 
  address: '', 
  avatar: '',
  rentalCount: 0,
  rating: 0
})

export function useAuth() {
  
  // 🟢 ฟังก์ชันดึงข้อมูลแบบละเอียดจากตาราง Profiles
  const fetchUserProfile = async (userId, userEmail) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    
    if (data && !error) {
      isAuthenticated.value = true
      user.id = userId
      user.email = userEmail
      user.username = data.username
      user.firstName = data.first_name || ''
      user.lastName = data.last_name || ''
      user.name = data.first_name ? `${data.first_name} ${data.last_name}` : data.username
      user.role = data.role || 'user'
      user.phone = data.phone || ''
      user.address = data.address || ''
      user.avatar = data.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff&bold=true`
      
      // ดึงค่าสถิติ
      user.rentalCount = data.rental_count || 0
      user.rating = data.rating || 0
    }
  }

  // 🔴 ฟังก์ชันล้างข้อมูลเมื่อล็อกเอาท์
  const clearUserData = () => {
    isAuthenticated.value = false
    Object.keys(user).forEach(key => {
      if (typeof user[key] === 'number') user[key] = 0
      else user[key] = ''
    })
    user.role = 'user'
  }

  // 🔄 ตรวจสอบ Session เมื่อโหลดเว็บ
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) fetchUserProfile(session.user.id, session.user.email)
  })

  // 🔄 ฟังสัญญาณเมื่อมีการล็อกอิน/ล็อกเอาท์
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) fetchUserProfile(session.user.id, session.user.email)
    else clearUserData()
  })

  // 🔵 1. สมัครสมาชิกด้วย Email
  const registerUser = async (userData) => {
    if (userData.username.includes('@')) throw new Error('Username ห้ามมีเครื่องหมาย @')
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: { 
        data: { 
          username: userData.username.toLowerCase(), 
          first_name: userData.firstName, 
          last_name: userData.lastName 
        } 
      }
    })
    if (error) throw new Error(error.message.includes('unique') ? 'Username หรือ Email นี้ถูกใช้งานแล้ว' : error.message)
    return data
  }

  // 🔵 2. เข้าสู่ระบบด้วย Email หรือ Username
  const login = async (credentials) => {
    let loginEmail = credentials.identifier.toLowerCase().trim()
    
    // ถ้าพิมพ์ Username มา (ไม่มี @) ให้ไปหาอีเมลในฐานข้อมูล
    if (!loginEmail.includes('@')) {
      const { data, error } = await supabase.from('profiles').select('email').eq('username', loginEmail).single()
      if (error || !data) throw new Error('ไม่พบชื่อผู้ใช้งาน (Username) นี้ในระบบ')
      loginEmail = data.email
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: credentials.password })
    if (error) throw new Error('รหัสผ่านไม่ถูกต้อง')
    return data
  }

  // 🌟 3. เข้าสู่ระบบด้วย Google/Facebook
  const loginWithProvider = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({ 
      provider: provider, 
      options: { redirectTo: `${window.location.origin}/` } 
    })
    if (error) throw new Error(`ไม่สามารถเข้าสู่ระบบด้วย ${provider} ได้`)
    return data
  }

  // 🔴 4. ออกจากระบบ
  const logout = async () => {
    await supabase.auth.signOut()
  }

  // 🟣 5. อัปเดต Profile เข้าสู่ Database
  const updateProfile = async (updates) => {
    const { error } = await supabase.from('profiles').update({
      first_name: updates.firstName,
      last_name: updates.lastName,
      phone: updates.phone,
      address: updates.address
    }).eq('id', user.id)
    
    if (error) throw new Error('ไม่สามารถบันทึกข้อมูลได้')
    await fetchUserProfile(user.id, user.email) // ดึงข้อมูลมาอัปเดตหน้าเว็บใหม่
  }

  // 🟣 6. อัปเดต Role (สถานะผู้ใช้)
  const setRole = async (newRole) => {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', user.id)
    if (!error) user.role = newRole
    else throw new Error('ไม่สามารถอัปเดตสิทธิ์ได้')
  }

  // 🟢 ส่งออกตัวแปรและฟังก์ชันทั้งหมดไปให้หน้าต่างๆ ใช้งาน
  return { 
    isAuthenticated, 
    user, 
    registerUser, 
    login, 
    loginWithProvider, 
    logout, 
    updateProfile, 
    setRole 
  }
}