<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="80%"
    :before-close="handleClose"
  >
    <div class="time-detail-content">
      <el-form :model="formData" label-width="120px">
        <el-form-item :label="timeLabel">
          <el-input-number
            v-model="formData.timeValue"
            :min="0"
            :precision="0"
            controls-position="right"
            style="width: 200px"
          />
          <span style="margin-left: 10px">分钟</span>
        </el-form-item>

        <el-form-item label="新增人数">
          <el-input-number
            v-model="formData.personNumber"
            :min="0"
            :precision="0"
            controls-position="right"
            style="width: 200px"
          />
          <span style="margin-left: 10px">人数</span>
        </el-form-item>
        
        <el-form-item label="新增原因">
          <el-input
            v-model="formData.newReason"
            type="textarea"
            :rows="3"
            placeholder="请输入原因（可为空，系统将显示'无'）"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="当前时间值">
          <span style="color: #409EFF; font-weight: bold;">{{ currentTimeValue }} 分钟</span>
        </el-form-item>
        
        <el-form-item label="当前原因" v-if="currentReason">
          <div style="color: #67C23A; font-weight: bold; white-space: pre-line;">{{ currentReason }}</div>
        </el-form-item>
      </el-form>
    </div>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { getEfficiencyReduceAdd } from '@/api/getProduceinfo'
import { ElMessage } from 'element-plus'
const visible = defineModel({ type: Boolean, default: false })

const props = defineProps({
  timeType: Number,
  Data: {
    type: Object,
    default: () => ({})
  },
  prodLine: String
})

const emit = defineEmits(['close', 'save'])

const formData = reactive({
  timeValue: 0,
  newReason: '',  // 重命名为newReason，明确这是用户新输入的原因
  personNumber:0
})

const dialogTitle = computed(() => {
  if (props.timeType === 1) {
    return '换型换线工时'
  } else if (props.timeType === 2) {
    return '计划外工时'
  }
  return '时间详情'
})

const timeLabel = computed(() => {
  if (props.timeType === 1) {
    return '换型换线时间'
  } else if (props.timeType === 2) {
    return '计划生产外时间'
  }
  return '时间'
})

const currentTimeValue = computed(() => {
  if (props.timeType === 1) {
    return props.Data.reduceMinute_hx || 0
  } else if (props.timeType === 2) {
    return props.Data.reduceMinute_jhw || 0
  }
  return 0
})

// 获取原始原因数据（数组格式）
const currentReasonRaw = computed(() => {
  if (props.timeType === 1) {
    return props.Data.reduceMinute_hx_reason || []
  } else if (props.timeType === 2) {
    return props.Data.reduceMinute_jhw_reason || []
  }
  return []
})

// 显示用的原因（带序号和详细信息）
const currentReason = computed(() => {
  const rawReasons = currentReasonRaw.value
  if (!Array.isArray(rawReasons) || rawReasons.length === 0) return ''
  
  // 为每个原因条目生成显示文本
  return rawReasons
    .filter(item => item.reason && item.reason.trim()) // 只显示有原因的条目
    .map((item, index) => {
      const reasonText = item.reason.trim()
      const timeInfo = `${item.reduce_minute}分钟 × ${item.reduce_count}次 = ${item.reduce_total}分钟`
      return `${index + 1}. ${reasonText} (${timeInfo})`
    })
    .join('\n')
})

// 监听对话框打开，初始化表单数据
watch(visible, (newVal) => {
  console.log('TimeDetailDialog visible 状态变化:', newVal);
  if (newVal) {
    formData.timeValue = ''
    // 不要将当前原因绑定到输入框，保持输入框独立
    formData.newReason = ''
    console.log('表单数据已初始化');
  }
})

const handleClose = () => {
  visible.value = false
  emit('close')
}

const handleSave = () => {
  const newReason = formData.newReason.trim()
  
  console.log('保存时间数据:', {
    prodLine: props.prodLine,
    timeValue: formData.timeValue,
    personNumber: formData.personNumber,
    newReason: newReason,
    timeType: props.timeType
  })
  
  getEfficiencyReduceAdd(props.prodLine, formData.timeValue, formData.personNumber, formData.newReason, props.timeType).then(res=>{
    console.log('保存时间数据响应:', res)
    
    // 检查响应是否包含更新的数据
    if (res.data) {
      // 更新本地数据为后端返回的最新数据
      if (props.timeType === 1) {
        props.Data.reduceMinute_hx = res.data.reduceMinute_hx || formData.timeValue
        props.Data.reduceMinute_hx_reason = res.data.reduceMinute_hx_reason || []
      } else if (props.timeType === 2) {
        props.Data.reduceMinute_jhw = res.data.reduceMinute_jhw || formData.timeValue
        props.Data.reduceMinute_jhw_reason = res.data.reduceMinute_jhw_reason || []
      }
    } else {
      // 如果后端没有返回新数据，创建一个新的条目添加到现有数组中
      const newEntry = {
        reduce_type: props.timeType,
        reduce_minute: formData.timeValue,
        reduce_count: 1,
        reduce_total: formData.timeValue,
        reason: newReason || '无'
      }
      
      if (props.timeType === 1) {
        if (!Array.isArray(props.Data.reduceMinute_hx_reason)) {
          props.Data.reduceMinute_hx_reason = []
        }
        props.Data.reduceMinute_hx_reason.push(newEntry)
        props.Data.reduceMinute_hx = (props.Data.reduceMinute_hx || 0) + formData.timeValue
      } else if (props.timeType === 2) {
        if (!Array.isArray(props.Data.reduceMinute_jhw_reason)) {
          props.Data.reduceMinute_jhw_reason = []
        }
        props.Data.reduceMinute_jhw_reason.push(newEntry)
        props.Data.reduceMinute_jhw = (props.Data.reduceMinute_jhw || 0) + formData.timeValue
      }
    }
    
    ElMessage.success('保存成功')
    
    // 构建完整的回调数据对象
    const callbackData = {
      ...props.Data,
      prodLine: props.prodLine,
      timeType: props.timeType,
      timeValue: formData.timeValue,
      newReason: newReason,
      timestamp: new Date().toISOString()
    }
    
    // 发出save事件，传递完整的回调数据
    emit('save', callbackData)
    
    // 清空输入框
    formData.newReason = ''
    formData.timeValue = 0
    formData.personNumber = 0
    
    visible.value = false
  }).catch(error => {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请重试')
  })
}
</script>

<style scoped>
.time-detail-content {
  min-height: 300px;
  padding: 20px;
  text-align: center;
  color: #666;
}
</style>