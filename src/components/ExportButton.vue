<template>
  <el-button 
    :type="type" 
    :size="size" 
    :loading="loading"
    :disabled="disabled"
    @click="handleExport"
  >
    <el-icon v-if="icon" class="mr-1">
      <component :is="icon" />
    </el-icon>
    {{ text }}
  </el-button>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { exportProductionScheduling } from '@/api/report'

const props = defineProps({
  // 按钮类型
  type: {
    type: String,
    default: 'primary'
  },
  // 按钮大小
  size: {
    type: String,
    default: 'small'
  },
  // 按钮文本
  text: {
    type: String,
    default: '导出Excel'
  },
  // 图标
  icon: {
    type: String,
    default: 'Download'
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 文件名
  filename: {
    type: String,
    default: '生产排程导出.xlsx'
  },
  // 确认提示文本
  confirmText: {
    type: String,
    default: '确认要导出数据吗？'
  }
})

const emit = defineEmits(['success', 'error'])

const loading = ref(false)

const handleExport = async () => {
  try {
    // 显示确认对话框
    await ElMessageBox.confirm(
      props.confirmText,
      '导出确认',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info'
      }
    )

    loading.value = true
    
    // 调用导出接口
    const success = await exportProductionScheduling(props.filename)
    
    if (success) {
      emit('success')
    } else {
      emit('error')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('导出失败：', error)
      ElMessage.error('导出失败，请重试！')
      emit('error', error)
    }
  } finally {
    loading.value = false
  }
}
</script> 