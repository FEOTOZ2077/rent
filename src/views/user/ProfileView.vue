<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { user, logout, updateProfile } = useAuth()
const router = useRouter()

const activeTab = ref('profile') 
const isEditing = ref(false)
const isLoading = ref(false)

// ฟอร์มสำหรับเก็บข้อมูลที่จะแก้ไข
const editForm = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  address: ''
})

// โหลดข้อมูลล่าสุดจาก user สู่ฟอร์ม
const loadDataToForm = () => {
  editForm.firstName = user.firstName || ''
  editForm.lastName = user.lastName || ''
  editForm.phone = user.phone || ''
  editForm.address = user.address || ''
}

onMounted(() => { loadDataToForm() })

// ฟังก์ชันบันทึกข้อมูล (ส่งเข้า Database)
const handleSaveProfile = async () => {
  isLoading.value = true
  try {
    await updateProfile({
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      phone: editForm.phone,
      address: editForm.address
    })
    isEditing.value = false
    alert('บันทึกข้อมูลเรียบร้อยแล้ว!')
  } catch (error) {
    alert(error.message)
  } finally {
    isLoading.value = false
  }
}

const handleLogout = async () => {
  if(confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
    await logout()
    router.push('/auth')
  }
}

// ฟังก์ชันเมื่อกดปุ่ม "แก้ไขโปรไฟล์" จากแบนเนอร์ด้านบน
const startEditing = () => {
  activeTab.value = 'profile'
  isEditing.value = true
  loadDataToForm()
}
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen pb-20 font-sans">
    
    <!-- 🖼️ Cover -->
    <div class="h-48 md:h-64 w-full bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 relative">
      <div class="absolute inset-0 bg-white/5 mix-blend-overlay" style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 20px 20px;"></div>
    </div>

    <div class="max-w-[1100px] mx-auto px-4 md:px-10 -mt-20 md:-mt-24 relative z-10">
      
      <!-- 🧑‍💼 User Info Card (รองรับระบบ Role) -->
      <div class="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left relative overflow-hidden">
        <div :class="['absolute top-0 left-0 w-full h-2', user?.role === 'admin' ? 'bg-rose-500' : (user?.role === 'lender' ? 'bg-amber-500' : 'bg-indigo-500')]"></div>
        
        <div class="relative flex-shrink-0">
          <img :src="user?.avatar" class="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white shadow-lg object-cover bg-white" />
          <div class="absolute bottom-2 right-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm" title="Verified">
            <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          </div>
        </div>
        
        <div class="flex-grow">
          <div class="flex items-center justify-center md:justify-start gap-2 mb-2">
            <!-- ป้ายบอกสถานะตาม Role -->
            <span v-if="user?.role === 'admin'" class="inline-flex bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">Super Admin</span>
            <span v-else-if="user?.role === 'lender'" class="inline-flex bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">Lender (ผู้ให้เช่า)</span>
            <span v-else class="inline-flex bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">Verified Member</span>
            
            <span v-if="user?.username" class="text-xs font-bold text-slate-400">@{{ user.username }}</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{{ user?.name || 'ผู้ใช้งาน' }}</h1>
          <p class="text-slate-500 font-medium mt-1">{{ user?.email }}</p>
        </div>

        <!-- 🛠️ ปุ่มแก้ไขโปรไฟล์ + ปุ่ม Dashboard -->
        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
          
          <!-- ปุ่มแก้ไขโปรไฟล์ (นำกลับมาแล้ว) -->
          <button @click="startEditing" class="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-3.5 rounded-xl transition shadow-sm text-sm flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            แก้ไขโปรไฟล์
          </button>

          <!-- 🟢 ปุ่มเข้า Dashboard ตาม Role -->
          <button v-if="user?.role === 'admin'" @click="router.push('/admin/dashboard')" class="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-lg text-sm flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Dashboard (Admin)
          </button>

          <button v-else-if="user?.role === 'lender'" @click="router.push('/lender/dashboard')" class="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-lg text-sm flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            จัดการร้านค้า
          </button>
          
          <button v-else @click="router.push('/lender/register')" class="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-lg text-sm flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            สมัครเป็นผู้ให้เช่า
          </button>
        </div>
      </div>

      <!-- 🗂️ Content Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mt-8">
        
        <!-- ⬅️ Sidebar Menu -->
        <div class="md:col-span-1 space-y-2">
          <button @click="activeTab = 'profile'; isEditing = false; loadDataToForm()" :class="['w-full text-left px-5 py-4 rounded-2xl font-bold text-sm transition-all flex items-center gap-3', activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200']">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> ข้อมูลส่วนตัว
          </button>
          
          <button @click="activeTab = 'security'" :class="['w-full text-left px-5 py-4 rounded-2xl font-bold text-sm transition-all flex items-center gap-3', activeTab === 'security' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200']">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg> ความปลอดภัย (KYC)
          </button>
          
          <button @click="activeTab = 'payment'" :class="['w-full text-left px-5 py-4 rounded-2xl font-bold text-sm transition-all flex items-center gap-3', activeTab === 'payment' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200']">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg> วิธีการชำระเงิน
          </button>
          
          <hr class="border-slate-200 my-4" />
          
          <button @click="handleLogout" class="w-full text-left px-5 py-4 rounded-2xl font-bold text-sm text-rose-600 bg-white border border-slate-200 hover:bg-rose-50 flex items-center gap-3 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg> ออกจากระบบ
          </button>
        </div>

        <!-- ➡️ Main Content -->
        <div class="md:col-span-3 space-y-6">
          
          <!-- 🟢 TAB 1: ข้อมูลส่วนตัว (Profile) -->
          <template v-if="activeTab === 'profile'">
            
            <!-- การ์ดสถิติ (เฉพาะตอนที่ไม่ได้แก้ไขโปรไฟล์) -->
            <div v-if="!isEditing" class="grid grid-cols-2 gap-4 md:gap-6 mb-6">
              <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex items-center gap-4 hover:shadow-md transition">
                <div class="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">ประวัติการเช่า</p>
                  <p class="text-3xl font-black text-slate-800">12 <span class="text-sm font-bold text-slate-500">ครั้ง</span></p>
                </div>
              </div>
              <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex items-center gap-4 hover:shadow-md transition">
                <div class="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                  <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">คะแนนรีวิว</p>
                  <p class="text-3xl font-black text-slate-800">5.0</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 md:p-8">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-black text-slate-900">ข้อมูลติดต่อ</h3>
                <!-- ปุ่มแก้ไขเล็กๆ ใน Tab เผื่อผู้ใช้อยากกดตรงนี้ -->
                <button v-if="!isEditing" @click="isEditing = true; loadDataToForm()" class="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg> แก้ไข
                </button>
              </div>
              
              <form @submit.prevent="handleSaveProfile" class="space-y-5">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">ชื่อจริง</label>
                    <input v-model="editForm.firstName" :disabled="!isEditing" type="text" class="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-medium outline-none focus:border-indigo-600 disabled:opacity-70 disabled:bg-slate-100" placeholder="ชื่อจริง..." />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">นามสกุล</label>
                    <input v-model="editForm.lastName" :disabled="!isEditing" type="text" class="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-medium outline-none focus:border-indigo-600 disabled:opacity-70 disabled:bg-slate-100" placeholder="นามสกุล..." />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">อีเมล (ไม่สามารถแก้ไขได้)</label>
                    <input :value="user?.email" disabled type="email" class="w-full bg-slate-100 border border-slate-200 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 outline-none" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">เบอร์โทรศัพท์มือถือ</label>
                    <input v-model="editForm.phone" :disabled="!isEditing" type="text" class="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-medium outline-none focus:border-indigo-600 disabled:opacity-70 disabled:bg-slate-100" placeholder="08X-XXX-XXXX" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">ที่อยู่จัดส่ง / นัดรับ</label>
                    <textarea v-model="editForm.address" :disabled="!isEditing" rows="3" class="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-medium outline-none focus:border-indigo-600 disabled:opacity-70 disabled:bg-slate-100 resize-none" placeholder="ระบุที่อยู่ของคุณให้ครบถ้วน..."></textarea>
                  </div>
                </div>
                
                <div v-if="isEditing" class="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button type="button" @click="isEditing = false; loadDataToForm()" class="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition">ยกเลิก</button>
                  <button type="submit" :disabled="isLoading" class="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition flex items-center gap-2">
                    <svg v-if="isLoading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {{ isLoading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล' }}
                  </button>
                </div>
              </form>
            </div>
          </template>

          <!-- 🛡️ TAB 2: ความปลอดภัย (Security) -->
          <template v-if="activeTab === 'security'">
            <div class="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 md:p-8">
              <h3 class="text-xl font-black text-slate-900 mb-2">ความปลอดภัยของบัญชี</h3>
              <p class="text-sm font-medium text-slate-500 mb-8">บัญชีที่ได้รับการยืนยันตัวตนครบถ้วนจะได้รับความน่าเชื่อถือจากผู้ให้เช่ามากขึ้น</p>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl hover:shadow-sm transition">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </div>
                    <div>
                      <p class="font-bold text-slate-800 text-sm md:text-base">ยืนยันอีเมลแล้ว</p>
                      <p class="text-xs text-slate-500">{{ user?.email }}</p>
                    </div>
                  </div>
                  <span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg> สำเร็จ
                  </span>
                </div>

                <div class="flex items-center justify-between p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl hover:shadow-sm transition">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    </div>
                    <div>
                      <p class="font-bold text-slate-800 text-sm md:text-base">ยืนยันเบอร์โทรศัพท์แล้ว</p>
                      <p class="text-xs text-slate-500">{{ user?.phone || 'ยังไม่ได้ระบุเบอร์โทรศัพท์' }}</p>
                    </div>
                  </div>
                  <span v-if="user?.phone" class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg> สำเร็จ
                  </span>
                  <span v-else class="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">รอยืนยัน</span>
                </div>

                <div class="flex items-center justify-between p-4 bg-amber-50/80 border border-amber-200 rounded-2xl hover:shadow-sm transition">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/></svg>
                    </div>
                    <div>
                      <p class="font-bold text-slate-800 text-sm md:text-base">ยืนยันด้วยบัตรประชาชน (KYC)</p>
                      <p class="text-xs text-amber-700 font-medium">จำเป็นสำหรับการเช่ายานพาหนะและอสังหาฯ</p>
                    </div>
                  </div>
                  <button class="text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-xl shadow-md transition">
                    ยืนยันตัวตน
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- 💳 TAB 3: วิธีการชำระเงิน (Payment) -->
          <template v-if="activeTab === 'payment'">
             <div class="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 md:p-8">
                <h3 class="text-xl font-black text-slate-900 mb-6">วิธีการชำระเงิน</h3>
                <div class="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:bg-slate-100 transition">
                  <svg class="w-10 h-10 text-indigo-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                  <p class="font-bold text-slate-700">เพิ่มบัตรเครดิต/เดบิตใบใหม่</p>
                </div>
             </div>
          </template>

        </div>
      </div>
    </div>
  </div>
</template>