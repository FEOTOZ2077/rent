/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 🟢 เพิ่มโค้ดส่วนนี้เพื่อตั้งค่าฟอนต์เริ่มต้น
      fontFamily: {
        sans: ['Kanit', 'sans-serif'], // บังคับให้คลาส font-sans ทั้งหมดเปลี่ยนเป็น Kanit
      },
    },
  },
  plugins: [],
}