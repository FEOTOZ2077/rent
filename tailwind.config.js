/** @type {import('tailwindcss').Config} */
export default {
  // เพิ่มบรรทัดนี้เข้าไปเพื่อให้ Tailwind สแกนหาคลาสในไฟล์เหล่านี้
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}