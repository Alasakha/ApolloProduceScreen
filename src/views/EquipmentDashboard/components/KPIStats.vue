<template>
  <div class="kpi-stats">
    <!-- 待维修 -->
    <div class="kpi-card">
      <div class="kpi-main">
        <div class="kpi-label">待维修:</div>
        <div class="kpi-value">{{ pendingRepair }}</div>
      </div>
      <div class="kpi-sub">
        <div class="sub-label">需点检设备数量:</div>
        <div class="sub-value">{{ needInspection }}</div>
      </div>
    </div>

    <!-- 维修备件等待中 -->
    <div class="kpi-card">
      <div class="kpi-main">
        <div class="kpi-label">维修备件等待中:</div>
        <div class="kpi-value">{{ waitingParts }}</div>
      </div>
      <div class="kpi-sub">
        <div class="sub-label">未点检设备数量:</div>
        <div class="sub-value">{{ notInspected }}</div>
      </div>
    </div>

    <!-- 维修已完成 -->
    <div class="kpi-card">
      <div class="kpi-main">
        <div class="kpi-label">维修已完成:</div>
        <div class="kpi-value">{{ completedRepair }}</div>
      </div>
      <div class="kpi-sub">
        <div class="sub-label">已点检设备数量:</div>
        <div class="sub-value">{{ inspected }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// 定义props
interface Props {
  pendingRepair?: number
  needInspection?: number
  waitingParts?: number
  notInspected?: number
  completedRepair?: number
  inspected?: number
}

withDefaults(defineProps<Props>(), {
  pendingRepair: 0,
  needInspection: 0,
  waitingParts: 0,
  notInspected: 0,
  completedRepair: 0,
  inspected: 0
})

// TODO: 这里可以添加API调用来获取真实数据
onMounted(() => {
  // 初始化数据或调用API
})
</script>

<style scoped>
.kpi-stats {
  display: flex;
  gap: 6px;
  width: 100%;
  margin-bottom: 6px;
}

.kpi-card {
  flex: 1;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 4px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kpi-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.2);
  padding-bottom: 6px;
}

.kpi-label {
  color: #8cc8ff;
  font-size: 12px;
  font-weight: normal;
}

.kpi-value {
  color: #00d4ff;
  font-size: 20px;
  font-weight: bold;
}

.kpi-sub {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sub-label {
  color: #8cc8ff;
  font-size: 11px;
}

.sub-value {
  color: #fff;
  font-size: 14px;
  font-weight: bold;
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .kpi-label {
    font-size: 14px;
  }

  .kpi-value {
    font-size: 24px;
  }

  .sub-label {
    font-size: 13px;
  }

  .sub-value {
    font-size: 16px;
  }

  .kpi-card {
    padding: 10px;
  }
}
</style>

