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
import { ref, computed, onMounted } from 'vue'
import { useTopIssueWorkshopStore } from '@/store/modules/topIssueWorkshop'

const topIssueStore = useTopIssueWorkshopStore()

// 计算总问题数，用于计算百分比
const calculateIssuesWithPercentage = (issues) => {
  if (!issues || issues.length === 0) return []
  
  return issues.map(issue => {
    // 直接使用接口返回的ratio字段，转换为百分比
    const percentage = issue.ratio ? (issue.ratio * 100).toFixed(1) : 0
    // 根据问题数量判断严重程度
    const status = issue.total > 20 ? 'major' : 'minor'
    
    return {
      name: issue.ngName,
      status: status,
      percentage: parseFloat(percentage)
    }
  })
}

// 计算数据
const regularData = computed(() => {
  const workshop1004 = topIssueStore.workshop1004Data
  const workshop2004 = topIssueStore.workshop2004Data
  
  // 根据问题数量判断直通率状态
  const getPressRateStatus = (issues) => {
    if (!issues || issues.length === 0) return 'meet_target'
    return issues.some(issue => issue.total > 15) ? 'below_target' : 'meet_target'
  }

  return {
    // 涂装部门直通率状态 - 使用模拟数据
    painting: {
      passRateStatus: 'below_target' // 直通率未达标
    },
    // 总装一课直通率状态 - 基于1004工作中心数据
    assemblyCourse1: {
      passRateStatus: getPressRateStatus(workshop1004?.常规类)
    },
    // 总装二课直通率状态 - 基于2004工作中心数据
    assemblyCourse2: {
      passRateStatus: getPressRateStatus(workshop2004?.常规类)
    },
    
    // 常规一部涂装TOP前三问题占比 - 使用模拟数据
    paintingIssues: [
      { name: '涂层厚度不均', status: 'major', percentage: 28.5 },
      { name: '颜色偏差', status: 'minor', percentage: 15.2 },
      { name: '表面缺陷', status: 'minor', percentage: 12.8 }
    ],
    
    // 常规总装一课TOP前三问题占比 - 使用1004工作中心的常规类数据
    assemblyCourse1Issues: calculateIssuesWithPercentage(workshop1004?.常规类?.slice(0, 3) || []),
    
    // 常规总装二课TOP前三问题占比 - 使用2004工作中心的常规类数据
    assemblyCourse2Issues: calculateIssuesWithPercentage(workshop2004?.常规类?.slice(0, 3) || [])
  }
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

// 组件挂载时获取数据
onMounted(async () => {
  await topIssueStore.fetchTopIssueWorkshopData()
})
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

/* .issue-warning::before {
  content: '⚠';
  position: absolute;
  left: -15px;
  top: 50%;
  transform: translateY(-50%);
  color: #ff4444;
  font-size: 16px;
  animation: warning-blink 1s infinite;
} */

/* @keyframes warning-blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0.3;
  }
} */

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