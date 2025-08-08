<template>
  <div class="row3-container flex-1">
    <!-- A类TOP前三问题占比 -->
    <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">A类TOP前三问题占比</div>
    <div class="departments-content">
      <!-- A类一部涂装 -->
      <div class="department-section">
        <div class="department-title text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base" :class="{ 'warning': !customerData.painting.passRateReached }">
          A类一部涂装TOP前三问题占比
          <span v-if="!customerData.painting.passRateReached" class="warning-indicator text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs">直通率未达标</span>
        </div>
        <div class="issues-list">
          <div 
            v-for="(issue, index) in customerData.painting.topIssues" 
            :key="index"
            class="issue-item"
            :class="{ 'warning-item': !customerData.painting.passRateReached }"
          >
            <div class="issue-name text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">{{ issue.name }}</div>
            <div class="issue-percentage text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm font-bold">{{ issue.percentage }}%</div>
          </div>
        </div>
      </div>

      <!-- A类总装一课 -->
      <div class="department-section">
        <div class="department-title text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base" :class="{ 'warning': !customerData.assemblyCourse1.passRateReached }">
          A类总装一课TOP前三问题占比
          <span v-if="!customerData.assemblyCourse1.passRateReached" class="warning-indicator text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs">直通率未达标</span>
        </div>
        <div class="issues-list">
          <div 
            v-for="(issue, index) in customerData.assemblyCourse1.topIssues" 
            :key="index"
            class="issue-item"
            :class="{ 'warning-item': !customerData.assemblyCourse1.passRateReached }"
          >
            <div class="issue-name text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">{{ issue.name }}</div>
            <div class="issue-percentage text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm font-bold">{{ issue.percentage }}%</div>
          </div>
        </div>
      </div>

      <!-- A类总装二课 -->
      <div class="department-section">
        <div class="department-title text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base" :class="{ 'warning': !customerData.assemblyCourse2.passRateReached }">
          A类总装二课TOP前三问题占比
          <span v-if="!customerData.assemblyCourse2.passRateReached" class="warning-indicator text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs">直通率未达标</span>
        </div>
        <div class="issues-list">
          <div 
            v-for="(issue, index) in customerData.assemblyCourse2.topIssues" 
            :key="index"
            class="issue-item"
            :class="{ 'warning-item': !customerData.assemblyCourse2.passRateReached }"
          >
            <div class="issue-name text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">{{ issue.name }}</div>
            <div class="issue-percentage text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm font-bold">{{ issue.percentage }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Mock数据
const customerData = ref({
  // A类一部涂装 - 直通率未达标，显示红色警示
  painting: {
    passRateReached: false, // 直通率未达标
    topIssues: [
      { name: '漆面流挂缺陷', percentage: 18.5 },
      { name: '色差问题', percentage: 15.2 },
      { name: '涂层厚度不均', percentage: 12.8 }
    ]
  },
  // A类总装一课 - 直通率达标
  assemblyCourse1: {
    passRateReached: true, // 直通率达标
    topIssues: [
      { name: '零件装配偏差', percentage: 8.3 },
      { name: '螺栓扭矩不足', percentage: 6.7 },
      { name: '密封件老化', percentage: 5.9 }
    ]
  },
  // A类总装二课 - 直通率未达标，显示红色警示
  assemblyCourse2: {
    passRateReached: false, // 直通率未达标
    topIssues: [
      { name: '电气连接故障', percentage: 14.6 },
      { name: '管路泄漏', percentage: 11.4 },
      { name: '传感器失效', percentage: 9.8 }
    ]
  }
})
</script>

<style scoped>
.row3-container {
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 6px;
  padding: 8px;
  backdrop-filter: blur(5px);
  color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.section-title {
  /* font-size: 12px; */
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 8px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 4px;
}

.departments-content {
  display: flex;
  gap: 6px;
  height: calc(100% - 30px);
  flex: 1;
}

.department-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.department-title {
  /* font-size: 9px;     */
  color: #00d4ff;
  text-align: center;
  margin-bottom: 4px;
  font-weight: bold;
  padding: 4px;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.3s ease;
}

.department-title.warning {
  color: #ff4444;
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.3);
  animation: pulse-warning 2s infinite;
}

.warning-indicator {
  display: block;
  /* font-size: 7px; */
  color: #ff4444;
  margin-top: 1px;
  font-weight: normal;
}

@keyframes pulse-warning {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.4);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(255, 68, 68, 0.1);
  }
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.issue-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 6px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  border-left: 2px solid #00d4ff;
  transition: all 0.3s ease;
  flex: 1;
}

.issue-item.warning-item {
  background: rgba(255, 68, 68, 0.1);
  border-left-color: #ff4444;
  border: 1px solid rgba(255, 68, 68, 0.2);
}

.issue-item:hover {
  background: rgba(0, 0, 0, 0.3);
  transform: translateX(2px);
}

.issue-item.warning-item:hover {
  background: rgba(255, 68, 68, 0.15);
}

.issue-name {
  /* font-size: 8px; */
  color: #8cc8ff;
  flex: 1;
  margin-right: 4px;
}

.warning-item .issue-name {
  color: #ffcccc;
}

.issue-percentage {
  /* font-size: 10px; */
  font-weight: bold;
  color: #fff;
  min-width: 35px;
  text-align: right;
}

.warning-item .issue-percentage {
  color: #ff4444;
  font-weight: 900;
}
</style>