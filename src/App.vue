<template>
  <el-config-provider :locale="locale" size="small">
    <RouterView />
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

const locale = computed(() => (document.documentElement.lang === 'zh-CN' ? zhCn : en))
</script>

<style scoped></style>
