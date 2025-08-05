<template>
    <div class="order-card-glow">
      <div class="order-card-main">
        <div class="line1-content flex w-full mt-1 ">

            <div class="flex flex-col w-[30%]"><div class="box-label">工单号：</div><div class="text-sm text-white">{{ props.frame }}</div></div>
            <div class="flex flex-col w-[30%]"><div class="box-label">品号：</div><div class="text-sm text-white">{{ props.customerNo }} </div></div>
            <div class="flex flex-col w-[30%]"><div class="box-label">规格：</div><div class="text-sm text-white">{{ props.modelSpec }}</div></div>
            <div class="flex flex-col flex-1"><div class="box-label">计划数：</div><div class="text-sm text-white">{{ props.planNum }}</div></div>
        </div>
        <div class="progress-container mt-2 flex">

          <div class="catogory w-[10%]">{{ catogory }}</div>
          <div class="w-[90%]">
            <div v-for="(process, index) in processListWithProgress" :key="index" 
       class="progress-section flex w-full items-center">
    <div class="progress-label w-18 text-blue-200 text-right mr-2">
      {{ process.name }}
    </div>
    <div class="progress-bar flex-2 mx-2">
      <div class="progress-fill" 
           :style="{ width: process.percent + '%' }"
           :class="{ 'active': process.isDoing }">
      </div>
    </div>
    <div class="progress-value flex flex-1 items-center gap-2">
      <el-input
        v-model.number="process.current"
        class="w-16 h-5 !bg-transparent progress-input"
        @input="handleInput($event, process)"
        @blur="handleProgressChange(process)"
        size="small"
        type="number"
      />
      <span class="text-white w-14 text-right">{{ process.percent }}%</span>
 
    </div>
    
  </div>
    </div>
  </div>
  <!-- 只有当showRepairWelding为true时才显示补焊功能 -->
  <span v-if="showRepairWelding" class="text-white text-sm text-right flex w-[50%]">
    已补焊：
    <el-input
      v-model.number="repairWelding"
      class="w-16 h-5 !bg-transparent progress-input"
      @input="handleInput($event, 'repairWelding')"
      @blur="handleProgressChange('repairWelding')"
      size="small"
      type="number"
    /> 件
  </span>
</div>
</div>
</template>

<script setup lang="ts">
import { addProcesshum, addWeldingRepair } from '@/api/getStampWeldinfo';
import { ElMessage } from 'element-plus';
import { ref, watch, computed } from 'vue';

const props = defineProps<{
  catogory: string;
  frame: string;
  customerNo: string;
  modelSpec: string;
  planNum: number;
  process_list: Array<{
    name: string;
    current: number;
    total: number;
    isDoing: boolean;
    mo_routing_d_id: string;
  }>;
  repairWelding?: number; // 修改为可选参数
  showRepairWelding?: boolean; // 控制是否显示补焊功能
}>();

// 类型检查函数
const ensureNumber = (value: any): number => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

// 内部数据列表
const internalProcessList = ref(props.process_list.map(p => ({
  ...p,
  current: ensureNumber(p.current)
})));

// 补焊数据 - 使用默认值0
const repairWelding = ref(ensureNumber(props.repairWelding ?? 0));

// 使用计算属性处理进度列表
const processListWithProgress = computed(() => {
  return internalProcessList.value.map(process => {
    const current = ensureNumber(process.current);
    const planNum = ensureNumber(props.planNum);
    const percent = planNum === 0 ? 0 : Math.round((current / planNum) * 100);
    
    return {
      ...process,
      percent
    };
  });
});

// 监听 props 变化
watch(() => props.process_list, (newVal) => {
  internalProcessList.value = newVal.map(p => ({
    ...p,
    current: ensureNumber(p.current)
  }));
}, { deep: true, immediate: true });

// 监听补焊数据变化
watch(() => props.repairWelding, (newVal) => {
  repairWelding.value = ensureNumber(newVal);
}, { immediate: true });

// 输入处理
const handleInput = (value: number, processOrType: any) => {
  if (!isNaN(value) && value >= 0) {
    // 如果是补焊数据
    if (processOrType === 'repairWelding') {
      repairWelding.value = value;
      return;
    }
    
    // 如果是工序数据
    if (processOrType && processOrType.mo_routing_d_id) {
      const targetProcess = internalProcessList.value.find(p => p.mo_routing_d_id === processOrType.mo_routing_d_id);
      if (targetProcess) {
        targetProcess.current = value;
      }
    }
  }
};

// 进度更新处理
const handleProgressChange = async (processOrType: any) => {
  // 如果是补焊数据
  if (processOrType === 'repairWelding') {
    const value = ensureNumber(repairWelding.value);
    
    try {
      if (value < 0) {
        ElMessage.error('请输入有效的数字');
        return;
      }

      // 调用焊接补焊API，使用工单号和产品ID
      await addWeldingRepair(props.frame, props.customerNo, value);
      ElMessage.success('补焊数据更新成功');
    } catch (error) {
      console.error('补焊数据更新失败:', error);
      ElMessage.error('补焊数据更新失败，请重试');
    }
    return;
  }

  // 工序数据处理
  if (processOrType && processOrType.mo_routing_d_id) {
    const targetProcess = internalProcessList.value.find(p => p.mo_routing_d_id === processOrType.mo_routing_d_id);
    const value = targetProcess ? ensureNumber(targetProcess.current) : 0;
    
    try {
      if (value < 0) {
        ElMessage.error('请输入有效的数字');
        return;
      }

      await addProcesshum(processOrType.mo_routing_d_id, value);
      ElMessage.success('更新成功');
    } catch (error) {
      console.error('更新失败:', error);
      ElMessage.error('更新失败，请重试');
    }
  }
};
</script>

<style scoped>
.order-card-glow {
  width: 100%;
  background: rgba(255, 255, 255, 0.13);
  border-radius: 16px;
  box-shadow:
    0 0 12px 2px #2575fc,
    0 0 0 2px #2575fc inset;
  border: 1px solid #2575fc;
  position: relative;
  overflow: hidden;
  padding: 4px;
}

.order-card-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.line1-content {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 5px;
  padding: 0 10px;
  height: 24px;
}

.progress-container {
  display: flex;
  /* flex-direction: column; */
  gap: 2px;
}

.progress-section {
  height: 20px;
}

.progress-bar {
  height: 6px;
  background: rgba(0, 234, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00a0e9 0%, #00f0ff 100%);
  transition: width 0.3s ease;
}

.progress-fill.active {
  background: linear-gradient(90deg, #00ff9d 0%, #00ffd5 100%);
  box-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
}

.catogory {
  background: rgba(37, 117, 252, 0.1);
  border: 2px solid #2575fc;
  box-shadow: 0 0 15px rgba(37, 117, 252, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 15px;
  flex-shrink: 0;
}

.box-label {
  font-size: 12px;
  color: rgb(93, 220, 255);
  white-space: nowrap;
}

.progress-label {
  font-size: 12px;
  white-space: nowrap;       /* 不换行 */
  overflow: hidden;          /* 隐藏超出部分 */
  text-overflow: ellipsis;   /* 用省略号代替 */
  max-width: 80px;           /* 👈 限制最大宽度（根据实际 UI 微调） */
}


.progress-value {
  font-size: 12px;
}

.progress-input :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: 1px solid rgba(0, 234, 255, 0.3) !important;
  padding: 0 4px !important;
}

.progress-input :deep(.el-input__inner) {
  color: white !important;
  font-size: 12px !important;
  text-align: right !important;
  padding: 0 !important;
  height: 20px !important;
}

.progress-input :deep(.el-input__inner:focus) {
  box-shadow: 0 0 8px rgba(0, 234, 255, 0.5) !important;
}

.progress-input :deep(.el-input__inner::-webkit-inner-spin-button),
.progress-input :deep(.el-input__inner::-webkit-outer-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}


@keyframes glowing {
  0% { box-shadow: 0 0 15px rgba(37, 117, 252, 0.3); }
  50% { box-shadow: 0 0 25px rgba(37, 117, 252, 0.5); }
  100% { box-shadow: 0 0 15px rgba(37, 117, 252, 0.3); }
}
</style>