<template>
  <div class="row3-container flex-1">
    <!-- 订单准交监控（月） -->
    <div class="departments-content">
      <div class="issues-section">
        <div class="section-title text-[12px]">A类订单准交（月）</div>
        <div class="issues-grid">
          <div class="issue-item">
            <div class="issue-name">目标</div>
            <div class="issue-percentage">{{ monthData.A.target !== null ? (monthData.A.target * 100).toFixed(1) + '%' : '--' }}</div>
          </div>
          <div class="issue-item">
            <div class="issue-name">本月已入库工单数</div>
            <div class="issue-percentage">{{ monthData.A.total }}</div>
          </div>
          <div class="issue-item">
            <div class="issue-name">本月准交工单数</div>
            <div class="issue-percentage">{{ monthData.A.ontime }}</div>
          </div>
          <div class="issue-item">
            <div class="issue-name">准交率</div>
            <div class="issue-percentage">{{ monthData.A.rate !== null ? (monthData.A.rate * 100).toFixed(1) + '%' : '--' }}</div>
          </div>
        </div>
      </div>

      <div class="issues-section">
        <div class="section-title text-[12px]">常规类订单准交（月）</div>
        <div class="issues-grid">
          <div class="issue-item">
            <div class="issue-name">目标</div>
            <div class="issue-percentage">{{ monthData.regular.target !== null ? (monthData.regular.target * 100).toFixed(1) + '%' : '--' }}</div>
          </div>
          <div class="issue-item">
            <div class="issue-name">本月已入库工单数</div>
            <div class="issue-percentage">{{ monthData.regular.total }}</div>
          </div>
          <div class="issue-item">
            <div class="issue-name">本月准交工单数</div>
            <div class="issue-percentage">{{ monthData.regular.ontime }}</div>
          </div>
          <div class="issue-item">
            <div class="issue-name">准交率</div>
            <div class="issue-percentage">{{ monthData.regular.rate !== null ? (monthData.regular.rate * 100).toFixed(1) + '%' : '--' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useManufacturingStore } from '@/stores/manufacturing'

const m = useManufacturingStore()

// 月度准交监控：A类与常规类
const monthData = computed(() => {
  const d = m.onTimeMonthRaw || {}
  return {
    A: {
      target: d['A类订单准交目标'] ?? null,
      total: d['A类订单总数'] ?? 0,
      ontime: d['A类订单准交数'] ?? 0,
      rate: d['A类订单准交率实际'] ?? null
    },
    regular: {
      target: d['常规类订单准交目标'] ?? null,
      total: d['常规类订单总数'] ?? 0,
      ontime: d['常规类订单准交数'] ?? 0,
      rate: d['常规类订单准交率实际'] ?? null
    }
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
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 8px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 4px;
}

.departments-content {
  /* 更紧凑：使用两列网格，减少纵向占用 */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  height: 100%; /* 确保撑满父级 */
  width: 100%;
}

.issues-section {
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 6px;
  padding: 6px 8px;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow: hidden;
  flex: 1; /* 让两个卡片纵向撑开 */
  justify-content: space-between; /* 标题和网格拉开距离 */

}

.issues-section .section-title {
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 6px;
  text-align: left;
  border-bottom: none;
  padding-bottom: 0;
  font-size: 12px;
}

.issues-grid {
  /* 每个 section 内部改为两列，减少纵向高度 */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px; /* 稍微加大间距更美观 */
  flex: 1; /* 关键：占据剩余高度 */
  align-content: stretch; /* 关键：让行内容铺满 */
}

.issue-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
  position: relative;
  font-size: 12px;
  line-height: 1;
  height: 100%; /* 让每个小方块填满网格单元格 */
  min-height: unset; /* 移除最小高度限制 */
  padding: 8px 12px; /* 适当增加内边距提升呼吸感 */
}

.issue-item:hover {
  background: rgba(0, 0, 0, 0.18);
  transform: none;
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