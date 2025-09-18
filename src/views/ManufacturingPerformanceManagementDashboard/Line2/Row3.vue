<template>
  <div class="row3-container flex-1">
    <!-- A类TOP前三问题占比 -->
    <!-- <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">A类TOP前三问题占比</div> -->
    <div class="departments-content">
      <!-- A类一部涂装 -->
      <div class="issues-section">
        <div class="section-title text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">A类一部涂装TOP前三问题占比</div>
        <div class="issues-grid">
          <div 
            v-if="customerData.painting.topIssues.length > 0"
            v-for="(issue, index) in customerData.painting.topIssues" 
            :key="index"
            class="issue-item"
            :class="getIssueClass(issue.status, customerData.painting.passRateReached)"
          >
            <div class="issue-name text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">{{ issue.name }}</div>
            <div class="issue-percentage text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm font-bold">{{ issue.percentage }}%</div>
          </div>
          <div v-else class="no-issues-item">
            <div class="no-issues-text text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">暂无问题点</div>
          </div>
        </div>
      </div>

      <!-- A类总装一课 -->
      <div class="issues-section">
        <div class="section-title text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">A类总装一课TOP前三问题占比</div>
        <div class="issues-grid">
          <div 
            v-if="customerData.assemblyCourse1.topIssues.length > 0"
            v-for="(issue, index) in customerData.assemblyCourse1.topIssues" 
            :key="index"
            class="issue-item"
            :class="getIssueClass(issue.status, customerData.assemblyCourse1.passRateReached)"
          >
            <div class="issue-name text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">{{ issue.name }}</div>
            <div class="issue-percentage text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm font-bold">{{ issue.percentage }}%</div>
          </div>
          <div v-else class="no-issues-item">
            <div class="no-issues-text text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">暂无问题点</div>
          </div>
        </div>
      </div>

      <!-- A类总装二课 -->
      <div class="issues-section">
        <div class="section-title text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">A类总装二课TOP前三问题占比</div>
        <div class="issues-grid">
          <div 
            v-if="customerData.assemblyCourse2.topIssues.length > 0"
            v-for="(issue, index) in customerData.assemblyCourse2.topIssues" 
            :key="index"
            class="issue-item"
            :class="getIssueClass(issue.status, customerData.assemblyCourse2.passRateReached)"
          >
            <div class="issue-name text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">{{ issue.name }}</div>
            <div class="issue-percentage text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm font-bold">{{ issue.percentage }}%</div>
          </div>
          <div v-else class="no-issues-item">
            <div class="no-issues-text text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">暂无问题点</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTopIssueWorkshopStore } from '@/store/modules/topIssueWorkshop'
import { useProductionDataStore } from '@/store/productionData'

const topIssueStore = useTopIssueWorkshopStore()
const productionStore = useProductionDataStore()

// 计算总问题数，用于计算百分比
const calculatePercentage = (issues) => {
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

// 计算涂装问题数据
const calculatePaintingIssues = (paintingData) => {
  if (!paintingData || !paintingData.length) return []
  
  return paintingData.map(issue => {
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
const customerData = computed(() => {
  const workshop1004 = topIssueStore.workshop1004Data
  const workshop2004 = topIssueStore.workshop2004Data
  const paintingATypeData = productionStore.paintingProblemATypeData
  
  return {
    // A类一部涂装 - 使用涂装问题API的A类数据
    painting: {
      passRateReached: !(paintingATypeData?.some(issue => issue.total > 15)), // 有高严重问题说明未达标
      topIssues: calculatePaintingIssues(paintingATypeData?.slice(0, 3) || [])
    },
    // A类总装一课 - 使用1004工作中心的真实数据
    assemblyCourse1: {
      passRateReached: !(workshop1004?.A类?.some(issue => issue.total > 15)), // 有高严重问题说明未达标
      topIssues: calculatePercentage(workshop1004?.A类?.slice(0, 3) || [])
    },
    // A类总装二课 - 使用2004工作中心的真实数据
    assemblyCourse2: {
      passRateReached: !(workshop2004?.A类?.some(issue => issue.total > 15)), // 有高严重问题说明未达标
      topIssues: calculatePercentage(workshop2004?.A类?.slice(0, 3) || [])
    }
  }
})

// 获取问题状态样式类
const getIssueClass = (issueStatus, passRateReached) => {
  // 如果直通率未达标，所有问题都显示红色警示
  if (!passRateReached) {
    return 'issue-warning'
  }
  
  // 如果直通率达标，根据问题严重程度显示颜色
  return issueStatus === 'major' ? 'issue-major' : 'issue-normal'
}

// 组件挂载时获取数据
onMounted(async () => {
  await Promise.all([
    topIssueStore.fetchTopIssueWorkshopData(),
    productionStore.fetchProductionData()
  ])
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
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 8px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 4px;
}

.departments-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: calc(100% - 30px);
  flex: 1;
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

.issues-section .section-title {
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

/* 暂无问题点样式 */
.no-issues-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-left: 3px solid #666;
}

.no-issues-text {
  color: #888;
  font-style: italic;
}

/* .issue-warning::before {
  content: '⚠';
  position: absolute;
  left: -15px;
  top: 50%;
  transform: translateY(-50%);
  color: #ff4444;
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
  color: #8cc8ff;
  flex: 1;
}

.issue-warning .issue-name {
  color: #ffcccc;
  font-weight: bold;
}

.issue-percentage {
  font-weight: bold;
  color: #fff;
}

.issue-warning .issue-percentage {
  color: #ff8888;
}
</style>