<template>
  <div class="global-days-selector">
    <!-- 注释掉天数间隔功能 -->
    <!-- <el-select
      v-model="selectedDays"
      placeholder="选择天数"
      size="small"
      style="width: 120px;"
      @change="handleDaysChange"
    >
      <el-option
        v-for="days in presetDays"
        :key="days"
        :label="`${days}天`"
        :value="days"
      />
    </el-select>
    
    <div class="days-info">
      <span class="info-text">
        当前选择: {{ selectedDays }}天
      </span>
      <span class="date-range">
        {{ startDate }} 至 {{ endDate }}
      </span>
    </div> -->
  </div>
</template>

<script setup lang="ts">

// import { useDateConfigStore } from '@/store/dateConfig'; // 注释掉天数间隔功能

// const dateConfigStore = useDateConfigStore(); // 注释掉天数间隔功能

// 当前选择的天数


// 获取预设天数选项 - 注释掉天数间隔功能
// const presetDays = computed(() => dateConfigStore.getPresetDays());

// 计算日期范围显示 - 注释掉天数间隔功能
// const startDate = computed(() => {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, '0');
//   const day = '01';
//   return `${year}-${month}-${day}`;
// });

// const endDate = computed(() => dateConfigStore.endDate);

// 处理天数变化 - 注释掉天数间隔功能
// const handleDaysChange = (days: number) => {
//   dateConfigStore.setGlobalDays(days);
//   // 触发全局事件，通知其他组件更新数据
//   window.dispatchEvent(new CustomEvent('globalDaysChanged', { detail: { days } }));
// };

// 组件挂载时同步store中的天数 - 注释掉天数间隔功能
// onMounted(() => {
//   selectedDays.value = dateConfigStore.getGlobalDays();
// });
</script>

<style scoped>
.global-days-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.days-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-text {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.date-range {
  font-size: 11px;
  color: #999;
  font-family: monospace;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .global-days-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .days-info {
    flex-direction: row;
    gap: 12px;
  }
}
</style> 