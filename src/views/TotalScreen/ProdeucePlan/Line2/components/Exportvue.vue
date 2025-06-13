<template>
  <el-dialog v-model="dialogVisible" title="导出数据" width="500" center>
    <div class="flex flex-col gap-4">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
      />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleExport">
          确认导出
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getExportProductionScheduling } from '@/api/report'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  prodLine: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const dialogVisible = ref(false)
const dateRange = ref([])

// 监听modelValue的变化
watch(() => props.modelValue, (newVal) => {
  dialogVisible.value = newVal
})

// 监听dialogVisible的变化
watch(() => dialogVisible.value, (newVal) => {
  emit('update:modelValue', newVal)
})

const handleCancel = () => {
  dialogVisible.value = false
  dateRange.value = []
}

const handleExport = async () => {
  if (!dateRange.value || dateRange.value.length !== 2) {
    ElMessage.warning('请选择日期范围')
    return
  }

  try {
    const [daystart, dayEnd] = dateRange.value
    const response = await getExportProductionScheduling(props.prodLine, daystart, dayEnd, {
      responseType: 'blob',  // 设置响应类型为blob
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    })
    
    // 从响应头中获取文件名
    const contentDisposition = response.headers['content-disposition']
    let filename = `生产计划_${daystart}_${dayEnd}.xlsx`
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)/)
      if (filenameMatch) {
        filename = decodeURIComponent(filenameMatch[1])
      }
    }

    // 创建Blob对象
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    
    // 创建下载链接
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    
    // 触发下载
    document.body.appendChild(link)
    link.click()
    
    // 清理
    document.body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
    
    ElMessage.success('导出成功')
    handleCancel()
  } catch (error) {
    console.error('导出失败：', error)
    ElMessage.error('导出失败，请重试')
  }
}
</script>

<style scoped>
:deep(.el-dialog) {
  background: #1a1a1a;
  border: 1px solid #303030;
}

:deep(.el-dialog__title) {
  color: #fff;
}

:deep(.el-dialog__body) {
  color: #fff;
}
</style>
  