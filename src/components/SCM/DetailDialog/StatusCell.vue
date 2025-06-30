<template>
    <span :style="{ color: color }">
      <el-icon v-if="status === '正常'"><CircleCheckFilled /></el-icon>
      <el-icon v-else-if="status === '逾期'"><CircleCloseFilled /></el-icon>
      <el-icon v-else><WarningFilled /></el-icon>
      {{ status }}
    </span>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { CircleCheckFilled, CircleCloseFilled, WarningFilled } from '@element-plus/icons-vue'
  
  const props = defineProps({
    completeDate: String
  })
  
  const status = computed(() => {
    if (!props.completeDate) return '异常'
    const today = new Date()
    const date = new Date(props.completeDate)
    if (isNaN(date.getTime())) return '异常'
    if (date < today.setHours(0,0,0,0)) return '逾期'
    return '正常'
  })
  
  const color = computed(() => {
    if (status.value === '正常') return '#67C23A'
    if (status.value === '逾期') return '#F56C6C'
    return '#E6A23C'
  })
  </script>