<template>
  <div class="bg-slate-50 min-h-screen">
    <!-- Admin Header -->
    <div class="bg-rose-900 pb-24 pt-10 px-4 md:px-10">
      <div class="max-w-[1400px] mx-auto">
        <span class="bg-rose-500 text-white text-[10px] px-3 py-1 rounded-full font-bold tracking-widest uppercase">Admin Panel</span>
        <h1 class="text-3xl md:text-4xl font-black text-white tracking-tight mt-3">ระบบหลังบ้าน (Control Panel) 🛡️</h1>
        <p class="text-rose-200 mt-2 font-medium text-sm">ผู้ดูแลระบบ: ตรวจสอบและจัดการความเรียบร้อยของแพลตฟอร์ม</p>
      </div>
    </div>

    <div class="max-w-[1400px] mx-auto px-4 md:px-10 -mt-12">
      <!-- Admin Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div class="bg-white p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100">
          <p class="text-slate-500 text-xs font-bold uppercase">ผู้ใช้ทั้งหมด</p>
          <p class="text-2xl md:text-3xl font-black text-slate-800 mt-2">1,248</p>
        </div>
        <div class="bg-white p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div class="absolute right-0 top-0 w-2 h-full bg-amber-400"></div>
          <p class="text-slate-500 text-xs font-bold uppercase">คำขอรอตรวจสอบ</p>
          <p class="text-2xl md:text-3xl font-black text-amber-500 mt-2">15</p>
        </div>
        <div class="bg-white p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div class="absolute right-0 top-0 w-2 h-full bg-rose-500"></div>
          <p class="text-slate-500 text-xs font-bold uppercase">ข้อพิพาท/แจ้งรายงาน</p>
          <p class="text-2xl md:text-3xl font-black text-rose-500 mt-2">2</p>
        </div>
        <div class="bg-white p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100">
          <p class="text-slate-500 text-xs font-bold uppercase">กระแสเงินหมุนเวียน</p>
          <p class="text-2xl md:text-3xl font-black text-emerald-600 mt-2">฿2.4M</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <!-- ภารกิจที่ต้องทำ -->
        <div class="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
          <h3 class="text-lg font-black text-slate-800 mb-4">รายการรออนุมัติล่าสุด (KYC & Listings)</h3>
          <div class="space-y-3">
             <div class="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100">
               <div>
                 <p class="font-bold text-sm text-slate-800">คำขอยืนยันตัวตนผู้ให้เช่า #ID-9821</p>
                 <p class="text-xs text-slate-500 mt-1">สมชาย ใจดี (ส่งเมื่อ 10 นาทีที่แล้ว)</p>
               </div>
               <button class="bg-rose-100 text-rose-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-rose-200 transition">ตรวจสอบ</button>
             </div>
             <div class="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100">
               <div>
                 <p class="font-bold text-sm text-slate-800">แจ้งประกาศไม่เหมาะสม #REP-044</p>
                 <p class="text-xs text-slate-500 mt-1">แจ้งโดย: User004 (ส่งเมื่อ 1 ชม.ที่แล้ว)</p>
               </div>
               <button class="bg-rose-100 text-rose-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-rose-200 transition">จัดการ</button>
             </div>
          </div>
        </div>
        <!-- กราฟจำลอง -->
        <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center text-center">
          <div class="w-32 h-32 rounded-full border-8 border-slate-100 border-t-rose-500 border-r-rose-500 mb-6"></div>
          <h3 class="text-sm font-black text-slate-800">สถานะเซิร์ฟเวอร์</h3>
          <p class="text-emerald-500 text-xs font-bold mt-1">● ระบบทำงานปกติ 100%</p>
        </div>
      </div>
    </div>
  </div>
</template>