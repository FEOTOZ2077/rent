<script setup>
import { RouterView } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
</script>

<template>
  <!-- เรียกใช้ MainLayout และให้ RouterView แสดงผลเนื้อหาอยู่ภายใน -->
  <MainLayout />
</template>

<style>
/* นำ style พื้นฐานมาไว้ที่นี่ */
body {
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}
</style>