<template>
  <div class="reason-input">
    <el-button 
      type="primary" 
      size="small" 
      @click="handleInput"
    >
      输入
    </el-button>

    <!-- 原因输入弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="输入说明原因"
      width="30%"
      append-to-body
    >
      <el-input
        v-model="currentReason"
        type="textarea"
        :rows="4"
        placeholder="请输入说明原因"
      />
      <el-input
        v-model="currentDuty"
        type="text"
        :rows="1"
        placeholder="请输入责任人"
        style="margin-top: 10px;"
      />
      <el-date-picker
        v-model="currentCompleteDate"
        type="date"
        placeholder="请选择完成期限"
        style="margin-top: 10px; width: 100%;"
        value-format="YYYY-MM-DD"
      />
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  row: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const dialogVisible = ref(false);
const currentReason = ref('');
const currentDuty = ref('');
const currentCompleteDate = ref('');

// 打开弹窗时赋值（只在这里赋值，去掉 watch）
const handleInput = () => {
  try {
    currentReason.value = props.modelValue || '';
    // 兼容 duty/责任人，添加数据验证
    currentDuty.value = (props.row?.duty || props.row?.['责任人'] || '').trim();
    currentCompleteDate.value = props.row?.completeDate || props.row?.['完成期限'] || '';
    dialogVisible.value = true;
  } catch (error) {
    console.error('Input error:', error);
    ElMessage.error('数据加载失败，请重试');
  }
};

// 处理取消
const handleCancel = () => {
  dialogVisible.value = false;
  // 取消时不需要重置输入框内容
};

// 处理保存
const handleSave = () => {

  if (!currentReason.value.trim()) {
    ElMessage.warning('请输入说明原因');
    return;
  }
  if (!currentDuty.value.trim()) {
    ElMessage.warning('请输入责任人');
    return;
  }
  if (!currentCompleteDate.value) {
    ElMessage.warning('请选择完成期限');
    return;
  }

  // 检查row数据是否完整
  if (!props.row || typeof props.row !== 'object') {
    console.error('Row data is invalid:', props.row);
    ElMessage.error('数据格式错误，请刷新页面重试');
    return;
  }

  try {
    emit('update:modelValue', currentReason.value);
    emit('save', {
      row: props.row,
      reason: currentReason.value.trim(),
      duty: currentDuty.value.trim(),
      completeDate: currentCompleteDate.value
    });
    dialogVisible.value = false;
  } catch (error) {
    console.error('Save error:', error);
    ElMessage.error('保存失败，请重试');
    return;
  }
};
</script>

<style scoped>
.reason-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 