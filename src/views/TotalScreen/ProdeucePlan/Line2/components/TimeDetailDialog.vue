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
        
        <el-form-item label="原因">
          <el-input
            v-model="formData.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入原因"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="当前时间值">
          <span style="color: #409EFF; font-weight: bold;">{{ currentTimeValue }} 分钟</span>
        </el-form-item>
        
        <el-form-item label="当前原因" v-if="currentReason">
          <span style="color: #67C23A; font-weight: bold;">{{ currentReason }}</span>
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
  reason: ''
})

const dialogTitle = computed(() => {
  if (props.timeType === 1) {
    return '换型换线时间详情'
  } else if (props.timeType === 2) {
    return '计划生产外时间详情'
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

const currentReason = computed(() => {
  if (props.timeType === 1) {
    return props.Data.reduceMinute_hx_reason || ''
  } else if (props.timeType === 2) {
    return props.Data.reduceMinute_jhw_reason || ''
  }
  return ''
})

// 监听对话框打开，初始化表单数据
watch(visible, (newVal) => {
  if (newVal) {
    formData.timeValue = currentTimeValue.value
    formData.reason = currentReason.value
  }
})

const handleClose = () => {
  visible.value = false
  emit('close')
}

const handleSave = () => {
  console.log('保存时间数据:', {
    timeType: props.timeType,
    timeValue: formData.timeValue,
    reason: formData.reason
  })
  
  getEfficiencyReduceAdd(props.prodLine, formData.timeValue, formData.reason, props.timeType).then(res=>{
    console.log('保存时间数据:', res)
  })
  
  // 直接更新传入的 Data 对象
  if (props.timeType === 1) {
    props.Data.reduceMinute_hx = formData.timeValue
    props.Data.reduceMinute_hx_reason = formData.reason
  } else if (props.timeType === 2) {
    props.Data.reduceMinute_jhw = formData.timeValue
    props.Data.reduceMinute_jhw_reason = formData.reason
  }
  
  visible.value = false
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