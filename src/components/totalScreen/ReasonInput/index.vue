<template>
  <div class="reason-input">
    <div class="reason-cell">
      <span>{{ model || '--' }}</span>
      <el-button 
        type="primary" 
        size="small" 
        @click="handleInput"
      >
        输入
      </el-button>
    </div>

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

const model = defineModel();
const props = defineProps({
  row: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['save']);

const dialogVisible = ref(false);
const currentReason = ref('');

// 监听 model 变化
watch(() => model.value, (val) => {
  currentReason.value = val;
});

// 处理输入按钮点击
const handleInput = () => {
  currentReason.value = model.value;
  dialogVisible.value = true;
};

// 处理取消
const handleCancel = () => {
  dialogVisible.value = false;
  currentReason.value = model.value;
};

// 处理保存
const handleSave = () => {
  if (!currentReason.value.trim()) {
    ElMessage.warning('请输入说明原因');
    return;
  }

  model.value = currentReason.value;
  emit('save', {
    row: props.row,
    reason: currentReason.value
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