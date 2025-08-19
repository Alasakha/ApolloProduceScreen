<template>
  <div class="part2-container">
    <!-- 常规客户金工一部涂装直通率 -->
    <div class="department-section">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">常规客户金工一部涂装</div>
      <div class="metrics-row">
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">目标</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ regularData.painting.target }}%</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ regularData.painting.actual }}%</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">达成率</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(regularData.painting.achievement)">
            {{ regularData.painting.achievement }}%
          </div>
        </div>
      </div>
      <!-- <div class="action-buttons">
        <button class="reason-btn" @click="showReasonDialog('painting')">
          填写原因/对策
        </button>
      </div> -->
    </div>

    <!-- 常规客户总装一课直通率 -->
    <div class="department-section">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">常规客户总装一课</div>
      <div class="metrics-row">
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">目标</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ regularData.assemblyCourse1.target }}%</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ regularData.assemblyCourse1.actual }}%</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">达成率</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(regularData.assemblyCourse1.achievement)">
            {{ regularData.assemblyCourse1.achievement }}%
          </div>
        </div>
      </div>
      <!-- <div class="action-buttons">
        <button class="reason-btn" @click="showReasonDialog('assembly1')">
          填写原因/对策
        </button>
      </div> -->
    </div>

    <!-- 常规客户总装二课直通率 -->
    <div class="department-section">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">常规客户总装二课</div>
      <div class="metrics-row">
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">目标</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ regularData.assemblyCourse2.target }}%</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ regularData.assemblyCourse2.actual }}%</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">达成率</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(regularData.assemblyCourse2.achievement)">
            {{ regularData.assemblyCourse2.achievement }}%
          </div>
        </div>
      </div>
      <!-- <div class="action-buttons">
        <button class="reason-btn" @click="showReasonDialog('assembly2')">
          填写原因/对策
        </button> -->
      </div>
    </div>
    
    <!-- 填写原因对话框 -->
    <ReasonDialog
      :visible="reasonDialogVisible"
      :metric-info="currentMetricInfo"
      @close="reasonDialogVisible = false"
      @submit="handleReasonSubmit"
    />

</template>

<script setup>
import { ref } from 'vue'
import ReasonDialog from '@/components/ReasonDialog.vue'

// Mock数据
const regularData = ref({
  // 常规客户金工一部涂装直通率
  painting: {
    target: 93.5,
    actual: 91.2,
    achievement: 97.5
  },
  // 常规客户总装一课直通率
  assemblyCourse1: {
    target: 94.0,
    actual: 92.1,
    achievement: 98.0
  },
  // 常规客户总装二课直通率
  assemblyCourse2: {
    target: 93.0,
    actual: 90.8,
    achievement: 97.6
  }
})

// 获取达成率样式类
const getAchievementClass = (value) => {
  if (value >= 100) return 'achievement-excellent'
  if (value >= 98) return 'achievement-good'
  if (value >= 95) return 'achievement-normal'
  return 'achievement-warning'
}

// 填写原因对话框状态
const reasonDialogVisible = ref(false)
const currentMetricInfo = ref({})

// 显示填写原因对话框
const showReasonDialog = (type) => {
  let data, name
  
  switch (type) {
    case 'painting':
      data = regularData.value.painting
      name = '常规客户金工一部涂装'
      break
    case 'assembly1':
      data = regularData.value.assemblyCourse1
      name = '常规客户总装一课'
      break
    case 'assembly2':
      data = regularData.value.assemblyCourse2
      name = '常规客户总装二课'
      break
  }
  
  currentMetricInfo.value = {
    name: `${name}直通率`,
    period: '月度',
    target: data.target,
    actual: data.actual,
    achievement: data.achievement
  }
  
  reasonDialogVisible.value = true
}

// 处理原因提交
const handleReasonSubmit = (data) => {
  console.log('提交的原因/对策数据:', data)
  // 这里可以调用API保存数据
  // 可以显示成功提示
}
</script>

<style scoped>
.part2-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  color: #fff;
}

.department-section {
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 6px;
  padding: 6px;
  backdrop-filter: blur(5px);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-title {
  /* font-size: 11px; */
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 4px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 3px;
}

.metrics-row {
  display: flex;
  gap: 4px;
  flex: 1;
}

.metric-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  border-left: 3px solid #00d4ff;
  transition: all 0.3s ease;
}

.metric-item:hover {
  background: rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.metric-label {
  /* font-size: 9px; */
  color: #8cc8ff;
  margin-bottom: 2px;
  text-align: center;
}

.metric-value {
  /* font-size: 12px; */
  font-weight: bold;
  color: #fff;
  text-align: center;
}

/* 达成率颜色样式 */
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

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 4px;
}

.reason-btn {
  padding: 2px 6px;
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  color: #fff;
  border: none;
  border-radius: 3px;
  font-size: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.reason-btn:hover {
  background: linear-gradient(135deg, #00b8e6 0%, #0088b3 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 212, 255, 0.3);
}
</style>