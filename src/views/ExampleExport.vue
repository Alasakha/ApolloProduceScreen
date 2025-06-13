<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">生产排程导出示例</h2>
    
    <div class="space-y-4">
      <!-- 基础用法 -->
      <div class="flex items-center space-x-4">
        <span class="text-gray-600">基础用法：</span>
        <ExportButton />
      </div>
      
      <!-- 自定义样式 -->
      <div class="flex items-center space-x-4">
        <span class="text-gray-600">自定义样式：</span>
        <ExportButton 
          type="success" 
          size="default" 
          text="导出生产排程" 
          filename="生产排程报表.xlsx"
          confirm-text="确认要导出生产排程数据吗？"
        />
      </div>
      
      <!-- 带事件处理 -->
      <div class="flex items-center space-x-4">
        <span class="text-gray-600">带事件处理：</span>
        <ExportButton 
          type="warning" 
          text="导出数据" 
          @success="handleExportSuccess"
          @error="handleExportError"
        />
      </div>
      
      <!-- 禁用状态 -->
      <div class="flex items-center space-x-4">
        <span class="text-gray-600">禁用状态：</span>
        <ExportButton 
          type="info" 
          text="导出数据" 
          :disabled="true"
        />
      </div>
    </div>
    
    <!-- 状态显示 -->
    <div class="mt-8 p-4 bg-gray-100 rounded">
      <h3 class="font-semibold mb-2">操作状态：</h3>
      <p v-if="lastOperation" class="text-sm">
        {{ lastOperation }}
      </p>
      <p v-else class="text-sm text-gray-500">
        暂无操作记录
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ExportButton from '@/components/ExportButton.vue'

const lastOperation = ref('')

const handleExportSuccess = () => {
  lastOperation.value = `✅ ${new Date().toLocaleString()} - 导出成功`
}

const handleExportError = (error) => {
  lastOperation.value = `❌ ${new Date().toLocaleString()} - 导出失败: ${error?.message || '未知错误'}`
}
</script> 