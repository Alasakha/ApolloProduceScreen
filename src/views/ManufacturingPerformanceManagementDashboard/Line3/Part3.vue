<template>
  <div class="part3-container">
    <!-- 常规一部涂装TOP前三问题占比 -->
    <div class="issues-section">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">常规一部涂装TOP前三问题占比</div>
      <div class="issues-grid">
        <div 
          v-for="(issue, index) in regularData.paintingIssues" 
          :key="index"
          class="issue-item"
          :class="getIssueClass(issue.status, regularData.painting.passRateStatus)"
        >
          <div class="issue-name text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">{{ issue.name }}</div>
          <div class="issue-percentage text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm font-bold">{{ issue.percentage }}%</div>
        </div>
      </div>
    </div>

    <!-- 常规总装一课TOP前三问题占比 -->
    <div class="issues-section">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">常规总装一课TOP前三问题占比</div>
      <div class="issues-grid">
        <div 
          v-for="(issue, index) in regularData.assemblyCourse1Issues" 
          :key="index"
          class="issue-item"
          :class="getIssueClass(issue.status, regularData.assemblyCourse1.passRateStatus)"
        >
          <div class="issue-name text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">{{ issue.name }}</div>
          <div class="issue-percentage text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm font-bold">{{ issue.percentage }}%</div>
        </div>
      </div>
    </div>

    <!-- 常规总装二课TOP前三问题占比 -->
    <div class="issues-section">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">常规总装二课TOP前三问题占比</div>
      <div class="issues-grid">
        <div 
          v-for="(issue, index) in regularData.assemblyCourse2Issues" 
          :key="index"
          class="issue-item"
          :class="getIssueClass(issue.status, regularData.assemblyCourse2.passRateStatus)"
        >
          <div class="issue-name text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">{{ issue.name }}</div>
          <div class="issue-percentage text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm font-bold">{{ issue.percentage }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Mock数据
const regularData = ref({
  // 涂装部门直通率状态
  painting: {
    passRateStatus: 'below_target' // 直通率未达标
  },
  // 总装一课直通率状态
  assemblyCourse1: {
    passRateStatus: 'meet_target' // 直通率达标
  },
  // 总装二课直通率状态
  assemblyCourse2: {
    passRateStatus: 'below_target' // 直通率未达标
  },
  
  // 常规一部涂装TOP前三问题占比
  paintingIssues: [
    { name: '涂层厚度不均', status: 'major', percentage: 28.5 },
    { name: '颜色偏差', status: 'minor', percentage: 15.2 },
    { name: '表面缺陷', status: 'minor', percentage: 12.8 }
  ],
  
  // 常规总装一课TOP前三问题占比
  assemblyCourse1Issues: [
    { name: '零件装配精度', status: 'minor', percentage: 18.3 },
    { name: '螺栓扭矩不足', status: 'minor', percentage: 14.7 },
    { name: '密封件老化', status: 'minor', percentage: 11.2 }
  ],
  
  // 常规总装二课TOP前三问题占比
  assemblyCourse2Issues: [
    { name: '电气连接问题', status: 'major', percentage: 25.6 },
    { name: '功能测试失败', status: 'major', percentage: 19.4 },
    { name: '外观检查不合格', status: 'minor', percentage: 13.8 }
  ]
})

// 获取问题状态样式类
const getIssueClass = (issueStatus, passRateStatus) => {
  // 如果直通率未达标，所有问题都显示红色警示
  if (passRateStatus === 'below_target') {
    return 'issue-warning'
  }
  
  // 如果直通率达标，根据问题严重程度显示颜色
  return issueStatus === 'major' ? 'issue-major' : 'issue-normal'
}
</script>

<style scoped>
.part3-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  color: #fff;
}

.issues-section {
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
  /* font-size: 10px; */
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 4px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 3px;
}

.issues-grid {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.issue-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
}

.issue-item:hover {
  background: rgba(0, 0, 0, 0.3);
  transform: translateX(3px);
}

/* 正常状态 */
.issue-normal {
  border-left: 3px solid #00d4ff;
}

/* 重大问题 */
.issue-major {
  border-left: 3px solid #ffa500;
  background: rgba(255, 165, 0, 0.1);
}

/* 警告状态（直通率未达标时的红色警示） */
.issue-warning {
  border-left: 3px solid #ff4444;
  background: rgba(255, 68, 68, 0.15);
  animation: warning-pulse 2s infinite;
}

/* 警示动画 */
@keyframes warning-pulse {
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 68, 68, 0.3);
  }
  50% {
    box-shadow: 0 0 15px rgba(255, 68, 68, 0.6);
  }
}

.issue-warning::before {
  content: '⚠';
  position: absolute;
  left: -15px;
  top: 50%;
  transform: translateY(-50%);
  color: #ff4444;
  /* font-size: 16px; */
  animation: warning-blink 1s infinite;
}

@keyframes warning-blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0.3;
  }
}

.issue-name {
  /* font-size: 9px; */
  color: #8cc8ff;
  flex: 1;
}

.issue-warning .issue-name {
  color: #ffcccc;
  font-weight: bold;
}

.issue-percentage {
  /* font-size: 11px; */
  font-weight: bold;
  color: #fff;
}

.issue-warning .issue-percentage {
  color: #ff8888;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .section-title {
    /* font-size: 12px; */
  }
  
  .issue-name {
    /* font-size: 10px; */
  }
  
  .issue-percentage {
    /* font-size: 13px; */
  }
}
</style>