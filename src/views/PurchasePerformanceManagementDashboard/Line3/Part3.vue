<template>
  <div class="part3-container">
    <!-- PLI项目详细明细 -->
    <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">
      PLI项目详细明细
      <span v-if="loading" class="loading-indicator">加载中...</span>
      <span v-if="error" class="error-indicator" :title="error">❌</span>
    </div>
    
    <!-- 项目状态分布 -->
    <div class="status-distribution">
      <div class="status-title text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">项目状态分布</div>
      <div class="status-items">
        <div 
          v-for="status in statusData" 
          :key="status.name"
          class="status-item"
        >
          <div class="status-name text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">{{ status.name }}</div>
          <div class="status-count text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" :class="getStatusClass(status.name)">{{ status.count }}</div>
          <div class="status-bar">
            <div class="status-fill" :style="{ width: `${status.percentage}%` }" :class="getStatusBarClass(status.name)"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 项目列表 -->
    <div class="project-list">
      <div class="list-title text-[9px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">项目明细</div>
      <div class="project-items">
        <div 
          v-for="project in projectsData" 
          :key="project.id"
          class="project-item"
        >
          <div class="project-header">
            <div class="project-id text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">{{ project.id }}</div>
            <div class="project-status text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]" :class="getStatusClass(project.status)">{{ project.status }}</div>
          </div>
          <div class="project-info">
            <div class="project-name text-[7px] 2xl:text-[8px] 3xl:text-[9px] 4xl:text-[10px]">{{ project.name }}</div>
            <div class="project-engineer text-[6px] 2xl:text-[7px] 3xl:text-[8px] 4xl:text-[9px]">负责人: {{ project.engineer }}</div>
          </div>
          <div class="project-dates">
            <div class="date-item">
              <span class="date-label text-[6px] 2xl:text-[7px] 3xl:text-[8px] 4xl:text-[9px]">计划:</span>
              <span class="date-value text-[6px] 2xl:text-[7px] 3xl:text-[8px] 4xl:text-[9px]">{{ project.plannedDate }}</span>
            </div>
            <div class="date-item" v-if="project.actualDate">
              <span class="date-label text-[6px] 2xl:text-[7px] 3xl:text-[8px] 4xl:text-[9px]">实际:</span>
              <span class="date-value text-[6px] 2xl:text-[7px] 3xl:text-[8px] 4xl:text-[9px]">{{ project.actualDate }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 数据状态
const loading = ref(false)
const error = ref(null)

// 项目状态数据
const statusData = ref([
  { name: '已完成', count: 12, percentage: 80.0 },
  { name: '进行中', count: 2, percentage: 13.3 },
  { name: '延期', count: 1, percentage: 6.7 }
])

// 项目详细数据
const projectsData = ref([
  {
    id: 'PLI-2024-001',
    name: '新型运动鞋底材料采购',
    engineer: '张工程师',
    status: '已完成',
    plannedDate: '2024-07-15',
    actualDate: '2024-07-12'
  },
  {
    id: 'PLI-2024-002',
    name: '智能芯片模块采购',
    engineer: '李工程师',
    status: '已完成',
    plannedDate: '2024-07-20',
    actualDate: '2024-07-18'
  },
  {
    id: 'PLI-2024-003',
    name: '环保包装材料采购',
    engineer: '王工程师',
    status: '已完成',
    plannedDate: '2024-07-25',
    actualDate: '2024-07-25'
  },
  {
    id: 'PLI-2024-004',
    name: '新型橡胶材料采购',
    engineer: '张工程师',
    status: '进行中',
    plannedDate: '2024-08-05',
    actualDate: null
  },
  {
    id: 'PLI-2024-005',
    name: '特殊涂层采购',
    engineer: '赵工程师',
    status: '延期',
    plannedDate: '2024-07-30',
    actualDate: null
  },
  {
    id: 'PLI-2024-006',
    name: '高强度纤维采购',
    engineer: '李工程师',
    status: '进行中',
    plannedDate: '2024-08-10',
    actualDate: null
  }
])

// 获取状态样式类
const getStatusClass = (status) => {
  switch (status) {
    case '已完成':
      return 'status-completed'
    case '进行中':
      return 'status-progress'
    case '延期':
      return 'status-delayed'
    default:
      return ''
  }
}

// 获取状态条样式类
const getStatusBarClass = (status) => {
  switch (status) {
    case '已完成':
      return 'bar-completed'
    case '进行中':
      return 'bar-progress'
    case '延期':
      return 'bar-delayed'
    default:
      return ''
  }
}
</script>

<style scoped>
.part3-container {
  height: 100%;
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 6px;
  padding: 8px;
  position: relative;
  backdrop-filter: blur(5px);
  color: #fff;
  display: flex;
  flex-direction: column;
}

.section-title {
  color: #60a5fa;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
  border-bottom: 1px solid rgba(59, 130, 246, 0.3);
  padding-bottom: 4px;
}

/* 状态分布样式 */
.status-distribution {
  background: rgba(0, 30, 60, 0.2);
  border: 1px solid rgba(0, 150, 255, 0.4);
  border-radius: 4px;
  padding: 6px;
  margin-bottom: 8px;
  backdrop-filter: blur(3px);
}

.status-title {
  color: #93c5fd;
  margin-bottom: 4px;
  text-align: center;
}

.status-items {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-name {
  width: 40px;
  color: #cbd5e1;
}

.status-count {
  width: 20px;
  text-align: center;
}

.status-bar {
  flex: 1;
  height: 3px;
  background: rgba(71, 85, 105, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.status-fill {
  height: 100%;
  transition: width 0.3s ease;
}

/* 状态颜色样式 */
.status-completed {
  color: #22c55e;
}

.status-progress {
  color: #3b82f6;
}

.status-delayed {
  color: #ef4444;
}

.bar-completed {
  background: linear-gradient(90deg, #22c55e, #34d399);
}

.bar-progress {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.bar-delayed {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

/* 项目列表样式 */
.project-list {
  flex: 1;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 6px;
  padding: 6px;
  display: flex;
  flex-direction: column;
}

.list-title {
  color: #93c5fd;
  margin-bottom: 4px;
  text-align: center;
}

.project-items {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow-y: auto;
}

.project-item {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(71, 85, 105, 0.2);
  border-radius: 4px;
  padding: 4px;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.project-id {
  color: #93c5fd;
  font-weight: bold;
}

.project-info {
  margin-bottom: 2px;
}

.project-name {
  color: #e2e8f0;
  margin-bottom: 1px;
}

.project-engineer {
  color: #cbd5e1;
}

.project-dates {
  display: flex;
  gap: 8px;
}

.date-item {
  display: flex;
  gap: 2px;
}

.date-label {
  color: #94a3b8;
}

.date-value {
  color: #cbd5e1;
}

.loading-indicator {
  color: #fbbf24;
  font-size: 10px;
  margin-left: 8px;
}

.error-indicator {
  color: #ef4444;
  font-size: 12px;
  margin-left: 8px;
  cursor: help;
}

/* 滚动条样式 */
.project-items::-webkit-scrollbar {
  width: 3px;
}

.project-items::-webkit-scrollbar-track {
  background: rgba(71, 85, 105, 0.2);
  border-radius: 2px;
}

.project-items::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 2px;
}

.project-items::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.7);
}
</style>