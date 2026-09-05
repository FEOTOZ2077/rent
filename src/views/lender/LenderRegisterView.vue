<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { setRole } = useAuth()

const isSubmitting = ref(false)
const isSubmitted = ref(false)

const form = reactive({
  // ข้อมูลส่วนตัว
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  
  // ข้อมูลร้านค้า
  storeType: 'individual',
  storeName: '',
  storeDesc: '',
  address: '',
  
  // ยืนยันตัวตน (KYC)
  idCard: '',
  uploads: {
    idCardFront: false,
    idCardBack: false,
    selfie: false,
    bookBank: false
  },
  
  // บัญชีธนาคาร
  bankName: 'kbank',
  bankAccountName: '',
  bankAccountNo: '',
  
  acceptTerms: false
})

const handleFileUpload = (type) => {
  // จำลองการอัปโหลดไฟล์ (สลับสถานะ True/False เมื่อกดคลิก)
  form.uploads[type] = !form.uploads[type]
}

const handleSubmit = async () => {
  if (!form.acceptTerms) {
    alert('กรุณายอมรับเงื่อนไขและข้อตกลงก่อนดำเนินการต่อ')
    return
  }
  if (!form.uploads.idCardFront || !form.uploads.selfie || !form.uploads.bookBank) {
    alert('กรุณาอัปโหลดเอกสารสำคัญ (ที่มีเครื่องหมาย *) ให้ครบถ้วน')
    return
  }

  isSubmitting.value = true
  
  try {
    // 1. จำลองเวลาอัปโหลดเอกสารและตรวจสอบ 2 วินาที
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 2. ส่งคำสั่งอัปเดต Role ไปที่ Supabase
    await setRole('lender')
    
    // 3. แสดงหน้าต่างยืนยันความสำเร็จ
    isSubmitted.value = true
    
  } catch (error) {
    alert(error.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 flex justify-center items-start font-sans">
    
    <!-- 🟢 หน้าจอสำเร็จ (Success State) -->
    <div v-if="isSubmitted" class="max-w-xl w-full bg-white rounded-[2rem] p-10 md:p-14 text-center shadow-xl border border-slate-100 mt-10 animate-fade-in-up">
      <div class="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border-4 border-emerald-100 relative">
        <svg class="w-12 h-12 relative z-10" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        <div class="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
      </div>
      
      <h2 class="text-3xl font-black text-slate-900 mb-4 tracking-tight">ส่งใบสมัครสำเร็จ!</h2>
      <p class="text-slate-600 font-medium leading-relaxed mb-8">
        เอกสารการสมัครร้านค้าของคุณถูกส่งเข้าระบบเรียบร้อยแล้ว ทีมงานจะใช้เวลาตรวจสอบความถูกต้องและอนุมัติภายใน 
        <span class="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">1 - 3 วันทำการ</span>
      </p>
      
      <div class="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl text-left mb-8 flex gap-4 items-start">
        <span class="text-2xl mt-1">🎉</span>
        <div>
          <p class="font-black text-indigo-900 text-sm mb-1">คุณได้รับสิทธิ์ Lender ทันที (โหมดทดสอบ)</p>
          <p class="text-[11px] text-indigo-700 font-medium leading-relaxed">เพื่อความสะดวกในการพัฒนา ระบบได้อัปเกรดสถานะของคุณให้สามารถเข้าถึง "หน้าแดชบอร์ดผู้ให้เช่า" ได้ทันที</p>
        </div>
      </div>
      
      <button @click="router.push('/lender/dashboard')" class="w-full bg-slate-900 text-white font-black py-4.5 rounded-2xl hover:bg-slate-800 transition shadow-xl hover:-translate-y-1">
        เข้าสู่หน้าแผงควบคุมร้านค้า
      </button>
    </div>

    <!-- 📝 หน้าจอแบบฟอร์ม (Form State) -->
    <div v-else class="max-w-4xl w-full">
      
      <!-- Header -->
      <div class="text-center md:text-left mb-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <span class="inline-flex w-max mx-auto md:mx-0 text-[10px] md:text-xs font-bold text-indigo-700 bg-indigo-100 px-3 py-1.5 rounded-full uppercase tracking-widest border border-indigo-200">
            Lender Partnership Program
          </span>
          <span class="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
            <svg class="w-4 h-4 text-amber-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
            ระยะเวลาตรวจสอบ: 1-3 วันทำการ
          </span>
        </div>
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">ลงทะเบียนผู้ให้เช่า</h1>
        <p class="text-slate-500 mt-3 font-medium text-sm md:text-base max-w-2xl">สร้างรายได้จากทรัพยากรที่คุณมีอยู่ กรุณากรอกข้อมูลตามความเป็นจริงเพื่อความรวดเร็วในการอนุมัติบัญชีร้านค้า</p>
      </div>

      <!-- Main Form -->
      <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden relative">
        <div class="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
        
        <form @submit.prevent="handleSubmit" class="p-6 md:p-12 space-y-12">
          
          <!-- Section 1 -->
          <section>
            <div class="flex items-center gap-4 mb-6">
              <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-base border border-indigo-100 shadow-sm">1</div>
              <h3 class="text-xl md:text-2xl font-black text-slate-800">ข้อมูลส่วนตัว</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 ml-0 md:ml-14">
              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase mb-1.5">ชื่อจริง</label>
                <input v-model="form.firstName" type="text" required class="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition" placeholder="ระบุชื่อจริง" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase mb-1.5">นามสกุล</label>
                <input v-model="form.lastName" type="text" required class="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition" placeholder="ระบุนามสกุล" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase mb-1.5">เบอร์โทรศัพท์มือถือ</label>
                <input v-model="form.phone" type="tel" required class="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition" placeholder="08X-XXX-XXXX" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase mb-1.5">อีเมล</label>
                <input v-model="form.email" type="email" required class="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition" placeholder="example@email.com" />
              </div>
            </div>
          </section>

          <hr class="border-slate-100 ml-0 md:ml-14" />

          <!-- Section 2 -->
          <section>
            <div class="flex items-center gap-4 mb-6">
              <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-base border border-indigo-100 shadow-sm">2</div>
              <h3 class="text-xl md:text-2xl font-black text-slate-800">ข้อมูลร้านค้า / ธุรกิจ</h3>
            </div>
            <div class="space-y-5 ml-0 md:ml-14">
              <div class="flex flex-col sm:flex-row gap-4">
                <label :class="['flex items-center gap-3 cursor-pointer border px-5 py-4 rounded-xl flex-1 transition-all', form.storeType === 'individual' ? 'bg-indigo-50 border-indigo-400' : 'bg-slate-50 border-slate-200 hover:border-indigo-200']">
                  <input type="radio" v-model="form.storeType" value="individual" class="text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                  <span class="text-sm font-bold text-slate-700">บุคคลธรรมดา</span>
                </label>
                <label :class="['flex items-center gap-3 cursor-pointer border px-5 py-4 rounded-xl flex-1 transition-all', form.storeType === 'corporate' ? 'bg-indigo-50 border-indigo-400' : 'bg-slate-50 border-slate-200 hover:border-indigo-200']">
                  <input type="radio" v-model="form.storeType" value="corporate" class="text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                  <span class="text-sm font-bold text-slate-700">นิติบุคคล (จดทะเบียน)</span>
                </label>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase mb-1.5">ชื่อร้านค้า (แสดงผลต่อลูกค้า)</label>
                <input v-model="form.storeName" type="text" required class="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition" placeholder="เช่น BKK Camera Rent หรือ สมชาย แคมป์ปิ้ง" />
              </div>
              
              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase mb-1.5">รายละเอียดจุดรับส่งสินค้า</label>
                <textarea v-model="form.address" rows="3" required class="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition resize-none" placeholder="ระบุสถานที่นัดรับของที่ชัดเจนให้ลูกค้าทราบ..."></textarea>
              </div>
            </div>
          </section>

          <hr class="border-slate-100 ml-0 md:ml-14" />

          <!-- Section 3 -->
          <section>
            <div class="flex items-center gap-4 mb-6">
              <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-base border border-indigo-100 shadow-sm">3</div>
              <div>
                <h3 class="text-xl md:text-2xl font-black text-slate-800">เอกสารยืนยันตัวตน (KYC)</h3>
                <p class="text-[11px] font-medium text-slate-400 mt-1">ข้อมูลถูกเข้ารหัสด้วยความปลอดภัยระดับธนาคาร</p>
              </div>
            </div>
            
            <div class="ml-0 md:ml-14 space-y-6">
              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase mb-1.5">เลขบัตรประจำตัวประชาชน 13 หลัก</label>
                <input v-model="form.idCard" type="text" maxlength="13" required class="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-black outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition tracking-[0.2em] text-slate-700 font-mono" placeholder="X-XXXX-XXXXX-XX-X" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <!-- ID Card Front -->
                <div @click="handleFileUpload('idCardFront')" :class="['relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all h-36', form.uploads.idCardFront ? 'bg-indigo-50 border-indigo-400' : 'bg-slate-50 border-slate-200 hover:bg-slate-100']">
                  <div v-if="form.uploads.idCardFront" class="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-0.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div>
                  <span class="text-3xl mb-2 grayscale">🪪</span>
                  <p class="text-[11px] font-bold text-slate-600 text-center leading-relaxed">รูปถ่ายบัตร ปชช.<br/>(ด้านหน้า)<span class="text-rose-500">*</span></p>
                </div>
                
                <!-- ID Card Back -->
                <div @click="handleFileUpload('idCardBack')" :class="['relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all h-36', form.uploads.idCardBack ? 'bg-indigo-50 border-indigo-400' : 'bg-slate-50 border-slate-200 hover:bg-slate-100']">
                   <div v-if="form.uploads.idCardBack" class="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-0.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div>
                  <span class="text-3xl mb-2 grayscale">💳</span>
                  <p class="text-[11px] font-bold text-slate-600 text-center leading-relaxed">รูปถ่ายบัตร ปชช.<br/>(ด้านหลัง)</p>
                </div>

                <!-- Selfie -->
                <div @click="handleFileUpload('selfie')" :class="['relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all h-36', form.uploads.selfie ? 'bg-indigo-50 border-indigo-400' : 'bg-slate-50 border-slate-200 hover:bg-slate-100']">
                   <div v-if="form.uploads.selfie" class="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-0.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div>
                  <span class="text-3xl mb-2 grayscale">🤳</span>
                  <p class="text-[11px] font-bold text-slate-600 text-center leading-relaxed">รูปเซลฟี่คู่กับ<br/>บัตรประชาชน<span class="text-rose-500">*</span></p>
                </div>
              </div>
            </div>
          </section>

          <hr class="border-slate-100 ml-0 md:ml-14" />

          <!-- Section 4 -->
          <section>
            <div class="flex items-center gap-4 mb-6">
              <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-base border border-indigo-100 shadow-sm">4</div>
              <h3 class="text-xl md:text-2xl font-black text-slate-800">บัญชีรับเงินค่าเช่า</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 ml-0 md:ml-14">
              <div class="md:col-span-2">
                 <div @click="handleFileUpload('bookBank')" :class="['relative border-2 border-dashed rounded-2xl p-6 flex flex-col md:flex-row items-center justify-center gap-3 cursor-pointer transition-all h-24', form.uploads.bookBank ? 'bg-indigo-50 border-indigo-400' : 'bg-slate-50 border-slate-200 hover:bg-slate-100']">
                    <div v-if="form.uploads.bookBank" class="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-0.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div>
                    <span class="text-3xl">🏦</span> 
                    <p class="text-xs font-bold text-slate-600">คลิกเพื่ออัปโหลดสำเนาหน้าสมุดบัญชีธนาคาร <span class="text-rose-500">*</span></p>
                 </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase mb-1.5">เลือกธนาคาร</label>
                <select v-model="form.bankName" class="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition cursor-pointer">
                  <option value="kbank">ธนาคารกสิกรไทย (KBank)</option>
                  <option value="scb">ธนาคารไทยพาณิชย์ (SCB)</option>
                  <option value="bbl">ธนาคารกรุงเทพ (BBL)</option>
                  <option value="ktb">ธนาคารกรุงไทย (KTB)</option>
                </select>
              </div>
              
              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase mb-1.5">ชื่อบัญชี (ต้องตรงกับผู้สมัคร)</label>
                <input v-model="form.bankAccountName" type="text" required class="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition" placeholder="ชื่อ-นามสกุลบัญชีรับเงิน" />
              </div>

              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-600 uppercase mb-1.5">เลขที่บัญชี</label>
                <input v-model="form.bankAccountNo" type="text" required class="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-xl font-black outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition tracking-[0.1em] text-indigo-700 font-mono" placeholder="XXX-X-XXXXX-X" />
              </div>
            </div>
          </section>

          <!-- Terms -->
          <div class="bg-indigo-50/50 border border-indigo-100 p-5 md:p-6 rounded-2xl flex items-start gap-4 mt-8 ml-0 md:ml-14">
            <input v-model="form.acceptTerms" type="checkbox" id="terms" class="mt-1 w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600 cursor-pointer flex-shrink-0" />
            <label for="terms" class="text-xs md:text-sm text-slate-600 font-medium leading-relaxed cursor-pointer select-none">
              ข้าพเจ้าขอยืนยันว่าข้อมูลและเอกสารทั้งหมดถูกต้อง และยินยอมปฏิบัติตาม <a href="#" class="text-indigo-600 font-bold hover:underline">นโยบายและเงื่อนไขการเป็นผู้ให้เช่า</a> รวมถึงยินยอมให้ RentAll ถือครองเงินค่าเช่าจนกว่าการเช่าจะเสร็จสมบูรณ์เพื่อความปลอดภัยของแพลตฟอร์ม
            </label>
          </div>

          <!-- Submit Button -->
          <div class="ml-0 md:ml-14 pt-4">
            <button type="submit" :disabled="isSubmitting" :class="[
              'w-full py-5 rounded-2xl text-white font-black text-base md:text-lg shadow-xl transition-all flex items-center justify-center gap-3', 
              isSubmitting ? 'bg-indigo-400 cursor-wait' : 'bg-slate-900 hover:bg-slate-800 hover:-translate-y-1 shadow-slate-200'
            ]">
              <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? 'กำลังส่งคำขอและเข้ารหัสข้อมูล...' : 'ส่งใบสมัครเพื่อเปิดร้าน' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* แอนิเมชันสำหรับหน้า Success */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}
</style>