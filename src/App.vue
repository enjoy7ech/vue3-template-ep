<template>
  <el-config-provider :locale="locale" size="small">
    <RouterView />
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import Standard from './layouts/Standard.vue'

const locale = computed(() => (document.documentElement.lang === 'zh-CN' ? zhCn : en))

provide('layout', Standard)
</script>

<style scoped></style>
