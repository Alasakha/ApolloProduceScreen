<template>
  <teleport to="body">
    <div v-if="visible" class="reason-dialog-overlay" @click="handleOverlayClick">
      <div class="reason-dialog" @click.stop>
      <div class="dialog-header">
        <h3 class="dialog-title">填写原因/对策</h3>
        <button class="close-btn" @click="closeDialog">×</button>
      </div>
      
      <div class="dialog-content">
        <div class="form-group">
          <label class="form-label">指标名称</label>
          <div class="metric-info">
            <span class="metric-name">{{ metricInfo.name }}</span>
            <span class="metric-period">{{ metricInfo.period }}</span>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">目标值</label>
          <div class="metric-value">{{ metricInfo.target }}%</div>
        </div>
        
        <div class="form-group">
          <label class="form-label">实际值</label>
          <div class="metric-value" :class="getAchievementClass(metricInfo.actual,metricInfo.target)">
            {{ metricInfo.actual }}%
          </div>
        </div>
        
        <!-- <div class="form-group">
          <label class="form-label">达成率</label>
          <div class="metric-value" :class="getAchievementClass(metricInfo.achievement)">
            {{ metricInfo.achievement }}%
          </div>
        </div> -->
        
        <div class="form-group">
          <label class="form-label required">原因分析</label>
          <textarea 
            v-model="formData.reason" 
            class="form-textarea"  
            placeholder="请详细分析未达成目标的原因..."
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label required">对策措施</label>
          <textarea 
            v-model="formData.solution" 
            class="form-textarea" 
            placeholder="请提出具体的改进对策和措施..."
            rows="3"
          ></textarea>
        </div>
<!--         
        <div class="form-group">
          <label class="form-label required">负责人</label>
          <input 
            v-model="formData.responsible" 
            class="form-input" 
            placeholder="请输入负责人姓名"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">预计完成时间</label>
          <input 
            v-model="formData.expectedDate" 
            class="form-input" 
            type="date"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">备注</label>
          <textarea 
            v-model="formData.remark" 
            class="form-textarea" 
            placeholder="其他需要说明的事项..."
            rows="2"
          ></textarea>
        </div> -->
      </div>
      
      <div class="dialog-footer">
        <button class="btn btn-secondary" @click="closeDialog">取消</button>
        <button class="btn btn-primary" @click="submitForm" >
          提交
        </button>
      </div>
    </div>
  </div>
    </teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getFillInData } from '@/api/produceperformance'
// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  metricInfo: {
    type: Object,
    default: () => ({
      name: '',
      period: '',
      target: 0,
      actual: 0,
      achievement: 0
    })
  },
  code: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['close', 'submit'])

// 表单数据
const formData = ref({
  reason: '',
  solution: '',
  responsible: '',
  expectedDate: '',
  remark: ''
})



// 获取达成率样式类
const getAchievementClass = (value1,value2) => {
  if (value1 >= value2) return 'achievement-excellent'
  if (value1 < value2) return 'achievement-normal'
  if (value1 < value2*0.6) return 'achievement-warning'
  return 'achievement-normal'
}

// 关闭对话框
const closeDialog = () => {
  emit('close')
  // resetForm()
}

// 重置表单
// const resetForm = () => {
//   formData.value = {
//     reason: '',
//     solution: '',
//     responsible: '',
//     expectedDate: '',
//     remark: ''
//   }
// }

// 提交表单
const submitForm = () => {

  
  const submitData = {
    ...formData.value,
    metricInfo: props.metricInfo,
    submitTime: new Date().toISOString()
  }
  
  emit('submit', submitData)
  closeDialog()
}

// 点击遮罩层关闭
const handleOverlayClick = () => {
  closeDialog()
}

// 监听visible变化，重置表单和加载数据
watch(() => props.visible, (newVal) => {
  if (newVal) {
    loadData() // 对话框打开时加载数据


  }
})


const loadData = () => {
  if (!props.code) return // 如果没有code则不加载
  
  getFillInData(props.code).then(res => {
    if (res.data) {
      formData.value.reason = res.data.reason || ''
      formData.value.solution = res.data.solve || ''
    }
  }).catch(error => {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  })
}
</script>

<style scoped>
.reason-dialog-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999 !important;
  backdrop-filter: blur(4px);
}

.reason-dialog {
  background: linear-gradient(135deg, #001e3c 0%, #003366 100%);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  position: relative;
  z-index: 10000;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  background: rgba(0, 30, 60, 0.5);
}

.dialog-title {
  color: #00d4ff;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #00d4ff;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(0, 212, 255, 0.1);
}

.dialog-content {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  color: #8cc8ff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
}

.form-label.required::after {
  content: ' *';
  color: #ff4444;
}

.metric-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid rgba(0, 150, 255, 0.2);
}

.metric-name {
  color: #00d4ff;
  font-weight: 500;
}

.metric-period {
  color: #8cc8ff;
  font-size: 12px;
}

.metric-value {
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid rgba(0, 150, 255, 0.2);
  color: #fff;
  font-weight: 500;
  text-align: center;
}

.achievement-excellent {
  color: #00ff88;
}

.achievement-good {
  color: #00d4ff;
}

.achievement-normal {
  color: #fff;
}

.achievement-warning {
  color: #ff4444;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #00d4ff;
  box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #8cc8ff;
  opacity: 0.6;
}

.form-textarea {
  resize: vertical;
  min-height: 60px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid rgba(0, 150, 255, 0.3);
  background: rgba(0, 30, 60, 0.5);
}

.btn {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #00b8e6 0%, #0088b3 100%);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #666;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #8cc8ff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .reason-dialog {
    width: 95%;
    margin: 20px;
  }
  
  .dialog-content {
    padding: 16px;
  }
  
  .dialog-header,
  .dialog-footer {
    padding: 12px 16px;
  }
}
</style> 