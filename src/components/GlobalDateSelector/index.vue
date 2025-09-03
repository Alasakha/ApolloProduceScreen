<template>
  <div class="global-date-selector">
    <!-- 天数选择 - 注释掉天数间隔功能 -->
    <!-- <div class="days-selector">
      <span class="label">天数:</span>
      <el-select
        v-model="selectedDays"
        placeholder="选择天数"
        size="small"
        style="width: 100px;"
        @change="handleDaysChange"
      >
        <el-option
          v-for="days in presetDays"
          :key="days"
          :label="`${days}天`"
          :value="days"
        />
      </el-select>
    </div> -->
    
    <!-- 结束日期选择 -->
    <div class="end-date-selector">
      <span class="label">结束日期:</span>
      <el-date-picker
        v-model="endDate"
        type="date"
        placeholder="选择结束日期"
        size="small"
        style="width: 140px;"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        @change="handleEndDateChange"
      />
      <el-button 
        size="small" 
        type="primary" 
        @click="resetToToday"
        style="margin-left: 8px;"
      >
        今天
      </el-button>
    </div>
    
    <!-- 当前配置信息 -->
    <div class="config-info">
      <span class="info-text">
        当前配置: {{ selectedDays }}天 | 结束: {{ endDate }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useManufacturingPerformanceStore } from '@/store/manufacturingPerformance';

const manufacturingStore = useManufacturingPerformanceStore();

// 当前选择的天数
const selectedDays = ref(7);

// 当前选择的结束日期
const endDate = ref('');

// 获取预设天数选项 - 注释掉天数间隔功能
// const presetDays = computed(() => manufacturingStore.getPresetDays());

// 处理天数变化 - 注释掉天数间隔功能
// const handleDaysChange = (days: number) => {
//   manufacturingStore.setGlobalDays(days);
//   // 触发全局事件，通知其他组件更新数据
//   window.dispatchEvent(new CustomEvent('globalDaysChanged', { detail: { days } }));
// };

// 处理结束日期变化
const handleEndDateChange = (date: string) => {
  if (date) {
    manufacturingStore.setEndDate(date);
    // 触发全局事件，通知其他组件更新数据
    window.dispatchEvent(new CustomEvent('globalEndDateChanged', { detail: { date } }));
  }
};

// 重置为今天
const resetToToday = () => {
  manufacturingStore.resetEndDateToToday();
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
});
</script>

<style scoped>
.global-date-selector {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.days-selector,
.end-date-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
  white-space: nowrap;
}

.config-info {
  margin-left: auto;
}

.info-text {
  font-size: 11px;
  color: #999;
  font-family: monospace;
  background: rgba(0, 0, 0, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .global-date-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .config-info {
    margin-left: 0;
    align-self: stretch;
  }
  
  .info-text {
    text-align: center;
  }
}
</style> 