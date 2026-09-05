<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
// 🟢 เพิ่ม loginWithProvider ออกมาใช้งาน
const { login, registerUser, loginWithProvider } = useAuth() 

const isLogin = ref(true)
const isForgotPassword = ref(false)
const isLoading = ref(false)

const form = reactive({
  identifier: '', 
  username: '',   
  email: '',      
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: ''
})

const resetEmail = ref('')

// 🟢 ฟังก์ชันสำหรับจัดการ Social Login
const handleSocialLogin = async (provider) => {
  try {
    isLoading.value = true
    await loginWithProvider(provider)
    // หมายเหตุ: กรณี Social Login เว็บจะเด้งไปหน้าอื่น ดังนั้นโค้ดหลังจากบรรทัดนี้อาจไม่ได้ทำงานทันที 
    // จนกว่าจะกลับมายังหน้าเว็บและ Session ถูกจับได้โดย onAuthStateChange ใน useAuth.js
  } catch (error) {
    alert(error.message)
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  isLoading.value = true

  try {
    if (isForgotPassword.value) {
      alert('ระบบได้ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลของคุณแล้ว!')
      isForgotPassword.value = false
      isLogin.value = true
    } 
    else if (isLogin.value) {
      await login({ identifier: form.identifier, password: form.password })
      router.push('/')
    } 
    else {
      if (form.password !== form.confirmPassword) {
        alert('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน!')
        isLoading.value = false
        return
      }

      await registerUser({
        username: form.username,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password
      })
      
      alert('สมัครสมาชิกสำเร็จแล้ว! กรุณาเข้าสู่ระบบ')
      isLogin.value = true 
      form.password = ''
      form.confirmPassword = ''
    }
  } catch (error) {
    alert(error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="w-full min-h-[calc(100vh-80px)] grid grid-cols-1 lg:grid-cols-2 m-0 p-0 bg-white">
    
    <!-- 🖼️ ฝั่งซ้าย: แบนเนอร์ -->
    <div class="relative hidden lg:flex flex-col justify-between p-16 bg-slate-900 text-white overflow-hidden">
      <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200" class="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 hover:scale-100 transition-transform duration-1000" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
      <div class="relative z-10">
        <span class="text-2xl font-black tracking-tighter flex items-center gap-2">
          <span class="bg-indigo-600 text-white p-1 rounded-xl text-lg">R</span> RentAll
        </span>
      </div>
      <div class="relative z-10 space-y-4 max-w-lg">
        <span class="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold border border-white/20">Smart P2P Rental Platform</span>
        <h2 class="text-4xl font-black tracking-tight leading-snug">เข้าถึงอุปกรณ์คุณภาพสูง <br/> ได้โดยไม่ต้องเป็นเจ้าของ</h2>
        <p class="text-slate-300 text-base font-medium leading-relaxed">แพลตฟอร์มที่เชื่อมโยงผู้คนเข้าด้วยกัน ให้คุณเริ่มต้นเช่าหรือให้เช่าได้ทันที</p>
      </div>
    </div>

    <!-- 📝 ฝั่งขวา: ฟอร์มกรอกข้อมูล -->
    <div class="p-8 md:p-16 flex flex-col justify-center bg-white w-full max-w-xl mx-auto lg:max-w-none">
      
      <template v-if="isForgotPassword">
        <!-- ลืมรหัสผ่าน (เหมือนเดิม) -->
        <div class="mb-8">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">รีเซ็ตรหัสผ่าน</h1>
          <p class="text-slate-500 mt-1 text-sm font-medium">กรอกอีเมลของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่</p>
        </div>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">อีเมล</label>
            <input v-model="resetEmail" type="email" required class="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-600 outline-none text-sm font-medium" placeholder="your@email.com" />
          </div>
          <button type="submit" :disabled="isLoading" class="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-base shadow-lg hover:bg-indigo-700 transition-all mt-4 disabled:opacity-70">
             {{ isLoading ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน' }}
          </button>
          <div class="text-center mt-4">
            <button type="button" @click="isForgotPassword = false" class="text-sm font-bold text-slate-600 hover:text-indigo-600 transition">← กลับไปหน้าเข้าสู่ระบบ</button>
          </div>
        </form>
      </template>

      <template v-else>
        <!-- 🌟 ปุ่ม Social Login 🌟 -->
        <div class="mb-6">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">{{ isLogin ? 'ยินดีต้อนรับกลับมา' : 'สร้างบัญชีใหม่กับเรา' }}</h1>
          <p class="text-slate-500 mt-1.5 text-sm font-medium">{{ isLogin ? 'เข้าสู่ระบบเพื่อจัดการการเช่าของคุณ' : 'สมัครด้วย Social หรือกรอกแบบฟอร์ม' }}</p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-3 mb-6">
          <!-- ปุ่ม Google -->
          <button @click="handleSocialLogin('google')" :disabled="isLoading" type="button" class="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all shadow-sm">
            <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.2v3.15C3.16 21.39 7.23 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.39-1.5-.39-2.25s.14-1.53.39-2.25V6.6H1.2C.44 8.14 0 9.87 0 12s.44 3.86 1.2 5.4l4.08-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.16 2.61 1.2 6.6l4.08 3.15c.95-2.84 3.6-4.95 6.72-4.95z"/></svg>
            <span>Google</span>
          </button>
          
          <!-- ปุ่ม Facebook -->
          <button @click="handleSocialLogin('facebook')" :disabled="isLoading" type="button" class="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] font-bold text-sm transition-all shadow-sm">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span>Facebook</span>
          </button>
        </div>

        <div class="relative flex py-2 items-center mb-6">
          <div class="flex-grow border-t border-slate-200"></div>
          <span class="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">หรือเข้าด้วยบัญชีแพลตฟอร์ม</span>
          <div class="flex-grow border-t border-slate-200"></div>
        </div>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <template v-if="!isLogin">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">ชื่อผู้ใช้งาน (Username) <span class="text-rose-500">*</span></label>
              <input v-model="form.username" type="text" required class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-600 outline-none text-sm font-medium" placeholder="ตั้งชื่อ Username (ห้ามมี @)" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">ชื่อจริง</label>
                <input v-model="form.firstName" type="text" required class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-600 outline-none text-sm font-medium" placeholder="ชื่อ" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">นามสกุล</label>
                <input v-model="form.lastName" type="text" required class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-600 outline-none text-sm font-medium" placeholder="นามสกุล" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">อีเมล</label>
              <input v-model="form.email" type="email" required class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-600 outline-none text-sm font-medium" placeholder="your@email.com" />
            </div>
          </template>
          
          <template v-else>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">อีเมล หรือ ชื่อผู้ใช้งาน</label>
              <input v-model="form.identifier" type="text" required class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-600 outline-none text-sm font-medium" placeholder="กรอก Email หรือ Username" />
            </div>
          </template>
          
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="block text-xs font-bold text-slate-700">รหัสผ่าน</label>
              <button v-if="isLogin" type="button" @click="isForgotPassword = true" class="text-xs font-bold text-indigo-600 hover:underline">ลืมรหัสผ่าน?</button>
            </div>
            <input v-model="form.password" type="password" required class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-600 outline-none text-sm font-medium" placeholder="••••••••" />
          </div>
          
          <div v-if="!isLogin">
            <label class="block text-xs font-bold text-slate-700 mb-1">ยืนยันรหัสผ่านอีกครั้ง</label>
            <input v-model="form.confirmPassword" type="password" required class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-600 outline-none text-sm font-medium" placeholder="••••••••" />
          </div>
          
          <button type="submit" :disabled="isLoading" class="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-base shadow-lg hover:bg-indigo-700 transition-all mt-4 disabled:opacity-70 flex justify-center items-center gap-2">
            <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isLoading ? 'กำลังประมวลผล...' : (isLogin ? 'เข้าสู่ระบบ' : 'ยืนยันการสมัครสมาชิก') }}
          </button>
        </form>
        
        <div class="mt-6 text-center text-xs font-medium text-slate-500">
          {{ isLogin ? 'ยังไม่มีบัญชีใช่ไหม?' : 'มีบัญชีอยู่แล้ว?' }}
          <button @click="isLogin = !isLogin; form.password=''; form.confirmPassword=''" class="text-indigo-600 font-bold hover:text-indigo-800 transition ml-1 underline underline-offset-4">
            {{ isLogin ? 'สมัครสมาชิกที่นี่' : 'เข้าสู่ระบบ' }}
          </button>
        </div>
      </template>

    </div>
  </div>
</template>