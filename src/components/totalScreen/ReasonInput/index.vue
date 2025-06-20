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
import { ref, watch } from 'vue';
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

// 初始化赋值
watch(() => props.modelValue, (val) => {
  currentReason.value = val;
});
watch(() => props.row.duty, (val) => {
  currentDuty.value = val || '';
});

// 打开弹窗时赋值
const handleInput = () => {
  currentReason.value = props.modelValue;
  currentDuty.value = props.row.duty || '';
  dialogVisible.value = true;
};

// 处理取消
const handleCancel = () => {
  dialogVisible.value = false;
  currentReason.value = props.modelValue;
  currentDuty.value = props.row.duty || '';
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
  emit('update:modelValue', currentReason.value);
  emit('save', {
    row: props.row,
    reason: currentReason.value,
    duty: currentDuty.value
  });
  dialogVisible.value = false;
  ElMessage.success('保存成功');
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