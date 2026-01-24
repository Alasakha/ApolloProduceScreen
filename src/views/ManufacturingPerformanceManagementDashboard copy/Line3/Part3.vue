<template>
  <div class="part3-container">
    <!-- A类订单准交（日） -->
    <div class="issues-section">
      <div class="section-title">A类订单准交（日）</div>
      <div class="issues-grid">
        <div class="issue-item">
          <div class="issue-name">一课包装应入库工单数</div>
          <div class="issue-percentage">{{ dayData.A.one.total }}</div>
        </div>
        <div class="issue-item">
          <div class="issue-name">一课包装实际准交工单数</div>
          <div class="issue-percentage">{{ dayData.A.one.ontime }}</div>
        </div>
        <div class="issue-item">
          <div class="issue-name">一课包装准交率</div>
          <div class="issue-percentage">{{ dayData.A.one.rate !== null ? (dayData.A.one.rate * 100).toFixed(1) + '%' : '--' }}</div>
        </div>

        <div class="issue-item">
          <div class="issue-name">二课包装应入库工单数</div>
          <div class="issue-percentage">{{ dayData.A.two.total }}</div>
        </div>
        <div class="issue-item">
          <div class="issue-name">二课包装实际准交工单数</div>
          <div class="issue-percentage">{{ dayData.A.two.ontime }}</div>
        </div>
        <div class="issue-item">
          <div class="issue-name">二课包装准交率</div>
          <div class="issue-percentage">{{ dayData.A.two.rate !== null ? (dayData.A.two.rate * 100).toFixed(1) + '%' : '--' }}</div>
        </div>

        <div class="issue-item">
          <div class="issue-name">散件包装应入库工单数</div>
          <div class="issue-percentage">{{ dayData.A.scatter.total }}</div>
        </div>
        <div class="issue-item">
          <div class="issue-name">散件包装实际准交工单数</div>
          <div class="issue-percentage">{{ dayData.A.scatter.ontime }}</div>
        </div>
        <div class="issue-item">
          <div class="issue-name">散件包装准交率</div>
          <div class="issue-percentage">{{ dayData.A.scatter.rate !== null ? (dayData.A.scatter.rate * 100).toFixed(1) + '%' : '--' }}</div>
        </div>

        <div class="issue-item">
          <div class="issue-name">合计今日应入库工单数</div>
          <div class="issue-percentage">{{ dayData.A.total.total }}</div>
        </div>
        <div class="issue-item">
          <div class="issue-name">合计今日实际准交工单数</div>
          <div class="issue-percentage">{{ dayData.A.total.ontime }}</div>
        </div>
        <div class="issue-item">
          <div class="issue-name">合计准交率</div>
          <div class="issue-percentage">{{ dayData.A.total.rate !== null ? (dayData.A.total.rate * 100).toFixed(1) + '%' : '--' }}</div>
        </div>
      </div>
    </div>

    <!-- 常规类订单准交（日） -->
    <div class="issues-section">
      <div class="section-title">常规类订单准交（日）</div>
      <div class="issues-grid">
        <div class="issue-item">
          <div class="issue-name">一课包装应入库工单数</div>
          <div class="issue-percentage">{{ dayData.regular.one.total }}</div>
        </div>
        <div class="issue-item">
          <div class="issue-name">一课包装实际准交工单数</div>
          <div class="issue-percentage">{{ dayData.regular.one.ontime }}</div>
        </div>
        <div class="issue-item">
          <div class="issue-name">一课包装准交率</div>
          <div class="issue-percentage">{{ dayData.regular.one.rate !== null ? (dayData.regular.one.rate * 100).toFixed(1) + '%' : '--' }}</div>
        </div>

        <div class="issue-item">
          <div class="issue-name">二课包装应入库工单数</div>
          <div class="issue-percentage">{{ dayData.regular.two.total }}</div>
        </div>
        <div class="issue-item">
          <div class="issue-name">二课包装实际准交工单数</div>
          <div class="issue-percentage">{{ dayData.regular.two.ontime }}</div>
        </div>
        <div class="issue-item">
          <div class="issue-name">二课包装准交率</div>
          <div class="issue-percentage">{{ dayData.regular.two.rate !== null ? (dayData.regular.two.rate * 100).toFixed(1) + '%' : '--' }}</div>
        </div>

        <div class="issue-item">
          <div class="issue-name">散件包装应入库工单数</div>
          <div class="issue-percentage">{{ dayData.regular.scatter.total }}</div>
        </div>
        <div class="issue-item">
          <div class="issue-name">散件包装实际准交工单数</div>
          <div class="issue-percentage">{{ dayData.regular.scatter.ontime }}</div>
        </div>
        <div class="issue-item">
          <div class="issue-name">散件包装准交率</div>
          <div class="issue-percentage">{{ dayData.regular.scatter.rate !== null ? (dayData.regular.scatter.rate * 100).toFixed(1) + '%' : '--' }}</div>
        </div>

        <div class="issue-item">
          <div class="issue-name">合计今日应入库工单数</div>
          <div class="issue-percentage">{{ dayData.regular.total.total }}</div>
        </div>
        <div class="issue-item">
          <div class="issue-name">合计今日实际准交工单数</div>
          <div class="issue-percentage">{{ dayData.regular.total.ontime }}</div>
        </div>
        <div class="issue-item">
          <div class="issue-name">合计准交率</div>
          <div class="issue-percentage">{{ dayData.regular.total.rate !== null ? (dayData.regular.total.rate * 100).toFixed(1) + '%' : '--' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useManufacturingStore } from '@/stores/manufacturing'

const m = useManufacturingStore()

const dayData = computed(() => {
  const d = m.onTimeDayRaw || {}
  const A_one = {
    total: d['一课包装A类总数'] ?? 0,
    ontime: d['一课包装A类准交数'] ?? 0,
    rate: d['一课包装A类准交率'] ?? null
  }
  const A_two = {
    total: d['二课包装A类总数'] ?? 0,
    ontime: d['二课包装A类准交数'] ?? 0,
    rate: d['二课包装A类准交率'] ?? null
  }
  const A_scatter = {
    total: d['散件包装A类总数'] ?? 0,
    ontime: d['散件包装A类准交数'] ?? 0,
    rate: d['散件包装A类准交率'] ?? null
  }
  const A_total_total = A_one.total + A_two.total + A_scatter.total
  const A_total_ontime = A_one.ontime + A_two.ontime + A_scatter.ontime
  const A_total_rate = A_total_total === 0 ? null : (A_total_ontime / A_total_total)

  const R_one = {
    total: d['一课包装常规类总数'] ?? 0,
    ontime: d['一课包装常规类准交数'] ?? 0,
    rate: d['一课包装常规类准交率'] ?? null
  }
  const R_two = {
    total: d['二课包装常规类总数'] ?? 0,
    ontime: d['二课包装常规类准交数'] ?? 0,
    rate: d['二课包装常规类准交率'] ?? null
  }
  const R_scatter = {
    total: d['散件包装常规类总数'] ?? 0,
    ontime: d['散件包装常规类准交数'] ?? 0,
    rate: d['散件包装常规类准交率'] ?? null
  }
  const R_total_total = R_one.total + R_two.total + R_scatter.total
  const R_total_ontime = R_one.ontime + R_two.ontime + R_scatter.ontime
  const R_total_rate = R_total_total === 0 ? null : (R_total_ontime / R_total_total)

  return {
    A: {
      one: A_one,
      two: A_two,
      scatter: A_scatter,
      total: { total: A_total_total, ontime: A_total_ontime, rate: A_total_rate }
    },
    regular: {
      one: R_one,
      two: R_two,
      scatter: R_scatter,
      total: { total: R_total_total, ontime: R_total_ontime, rate: R_total_rate }
    }
  }
})
</script>

<style scoped>
.part3-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
  color: #fff;
}

.issues-section {
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 6px;
  padding: 8px;
  backdrop-filter: blur(5px);
  display: block;
  width: 100%;
  overflow: hidden;
}

.section-title {
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 6px;
  text-align: left;
  font-size: 13px;
}

.issues-grid {
  /* 更紧凑：三列网格展示，减少垂直空间占用 */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  align-items: start;
  width: 100%;
  max-height: calc(100% - 32px);
  overflow: auto;
}

.issue-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 6px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
  position: relative;
  font-size: 12px;
  min-height: 28px;
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

/* 响应式设计 */
@media (max-width: 1200px) {
  .section-title {
    font-size: 12px;
  }
  
  .issue-name {
    font-size: 10px;
  }
  
  .issue-percentage {
    font-size: 13px;
  }
}
</style>