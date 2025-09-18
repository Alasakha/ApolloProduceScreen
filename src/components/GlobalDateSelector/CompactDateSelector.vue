<template>
  <div class="compact-date-selector">
    <!-- 天数选择 - 注释掉天数间隔功能 -->
    <!-- <el-select
      v-model="selectedDays"
      placeholder="天数"
      size="small"
      style="width: 80px; margin-right: 8px;"
      @change="handleDaysChange"
    >
      <el-option
        v-for="days in presetDays"
        :key="days"
        :label="`${days}天`"
        :value="days"
      />
    </el-select> -->
    
    <!-- 结束日期选择 -->
    <el-date-picker
      v-model="endDate"
      type="date"
      placeholder="结束日期"
      size="small"
      style="width: 120px; margin-right: 8px;"
      format="MM-DD"
      value-format="YYYY-MM-DD"
      @change="handleEndDateChange"
    />
    
    <!-- 重置按钮 -->
    <el-button 
      size="small" 
      type="primary" 
      @click="resetToToday"
      style="width: 60px;"
    >
      今天
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useManufacturingPerformanceStore } from '@/store/manufacturingPerformance';
import { useProductionDataStore } from '@/store/productionData';
import { useTopIssueWorkshopStore } from '@/store/modules/topIssueWorkshop'; // 添加这个导入

const manufacturingStore = useManufacturingPerformanceStore();
const productionDataStore = useProductionDataStore();
const topIssueWorkshopStore = useTopIssueWorkshopStore(); // 添加这个 store



// 当前选择的结束日期
const endDate = ref('');

// 获取预设天数选项 - 注释掉天数间隔功能
// const presetDays = computed(() => manufacturingStore.getPresetDays());

// 处理天数变化 - 注释掉天数间隔功能
// const handleDaysChange = (days: number) => {
//   manufacturingStore.setGlobalDays(days);
//   // 同时触发 productionData store 的更新
//   productionDataStore.updateGlobalDays(days);
//   // 同时触发 topIssueWorkshop store 的更新
//   topIssueWorkshopStore.setGlobalDays(days);
//   // 触发全局事件
//   window.dispatchEvent(new CustomEvent('globalDaysChanged', { detail: { days } }));
// };

// 处理结束日期变化
const handleEndDateChange = (date: string) => {
  if (date) {
    console.log('CompactDateSelector: 处理结束日期变化:', date);
    console.log('CompactDateSelector: 调用 manufacturingStore.setEndDate');
    manufacturingStore.setEndDate(date);
    console.log('CompactDateSelector: 调用 productionDataStore.setEndDate');
    // 同时触发 productionData store 的更新
    productionDataStore.setEndDate(date);
    console.log('CompactDateSelector: 调用 topIssueWorkshopStore.setEndDate');
    // 同时触发 topIssueWorkshop store 的更新
    topIssueWorkshopStore.setEndDate(date);
    // 触发全局事件
    window.dispatchEvent(new CustomEvent('globalEndDateChanged', { detail: { date } }));
  }
};

// 重置为今天
const resetToToday = () => {
  manufacturingStore.resetEndDateToToday();
  productionDataStore.resetEndDateToToday(); // 同时重置
  topIssueWorkshopStore.resetEndDateToToday(); // 同时重置
  endDate.value = manufacturingStore.getSelectedEndDate();
  // 触发全局事件
  window.dispatchEvent(new CustomEvent('globalEndDateChanged', { 
    detail: { date: endDate.value } 
  }));
};

// 组件挂载时同步store中的配置 - 注释掉天数间隔功能
onMounted(() => {
  // selectedDays.value = manufacturingStore.getGlobalDays(); // 注释掉天数间隔功能
  endDate.value = manufacturingStore.getSelectedEndDate();
  
  // 添加调试信息
  console.log('=== CompactDateSelector 初始化调试 ===')
  console.log('当前时间:', new Date().toString())
  console.log('当前UTC时间:', new Date().toISOString())
  console.log('manufacturingStore.getSelectedEndDate():', manufacturingStore.getSelectedEndDate())
  console.log('endDate.value:', endDate.value)
  console.log('=====================================')
});
</script>

<style scoped>
.compact-date-selector {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 自定义下拉框样式 */
:deep(.el-select .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:deep(.el-date-editor .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:deep(.el-button--primary) {
  background: rgba(64, 158, 255, 0.8);
  border: 1px solid rgba(64, 158, 255, 0.3);
}

:deep(.el-button--primary:hover) {
  background: rgba(64, 158, 255, 1);
}
</style> 