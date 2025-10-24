<template>
    <div class="left-panel h-[30vh]">
        <dv-border-box13 class="w-full h-full">
            <div class="p-4 h-full flex flex-col">
                <!-- 标题 -->
                <div class="text-center mb-4">
                    <h3 class="title-text">研发升级计划达成情况</h3>
                </div>
                
                <!-- 内容区域 -->
                <div class="flex-1 flex flex-col justify-center">
                    <div class="metrics-grid">
                        <!-- 本月计划数 -->
                        <div class="metric-card plan-card">
                            <div class="metric-header">
                                <div class="metric-icon">📋</div>
                                <div class="metric-label">本月计划数</div>
                            </div>
                            <div class="metric-value">{{ data.total || '--' }}</div>
                        </div>
                        
                        <!-- 按时完成数 -->
                        <div class="metric-card complete-card">
                            <div class="metric-header">
                                <div class="metric-icon">✅</div>
                                <div class="metric-label">按时完成数</div>
                            </div>
                            <div class="metric-value">{{ data.completeCount || '--' }}</div>
                        </div>
                        
                        <!-- 按时完成数 (到期3天内) -->
                        <div class="metric-card pending-card">
                            <div class="metric-header">
                                <div class="metric-icon">⏰</div>
                                <div class="metric-label">按时完成数 (到期3天内)</div>
                            </div>
                            <div class="metric-value">{{ data.completeCount3 || '--' }}</div>
                        </div>
                        
                        <!-- 研发升级计划达成率 -->
                        <div class="metric-card rate-card">
                            <div class="metric-header">
                                <div class="metric-icon">📊</div>
                                <div class="metric-label">研发升级计划达成率</div>
                            </div>
                            <div class="metric-value">{{ completionRate }}%</div>
                        </div>
                        
                        <!-- 到期3天内达成率 -->
                        <div class="metric-card pending-rate-card">
                            <div class="metric-header">
                                <div class="metric-icon">⏳</div>
                                <div class="metric-label">到期3天内达成率</div>
                            </div>
                            <div class="metric-value">{{ pendingCompletionRate }}%</div>
                        </div>
                    </div>
                </div>
            </div>
        </dv-border-box13>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getProjectOverdueMainCountInfo } from '@/api/getPMLinfo'

// 响应式数据
const data = ref({
  total: 0,
  completeCount: 0,
  completeCount3: 0
})

// 计算达成率
const completionRate = computed(() => {
  if (data.value.total === 0) return '--'
  const rate = (data.value.completeCount / data.value.total) * 100
  return rate.toFixed(1)
})

// 计算到期3天内达成率
const pendingCompletionRate = computed(() => {
  if (data.value.total === 0) return '--'
  const rate = (data.value.completeCount3 / data.value.total) * 100
  return rate.toFixed(1)
})

// 获取数据
const fetchData = async () => {
  try {
    const response = await getProjectOverdueMainCountInfo()
    if (response.code === 200) {
      data.value = response.data
    }
  } catch (error) {
    console.error('获取研发升级计划数据失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchData()
  // 设置定时刷新，每30秒更新一次
  setInterval(fetchData, 30000)
})
</script>

<style scoped>
/* 左侧面板容器 */
.left-panel {
    width: 100%;
    display: flex;
    flex-direction: column;
}

/* 标题样式 */
.title-text {
    color: #00eeff;
    font-size: 18px;
    font-weight: 600;
    text-shadow: 0 0 10px rgba(0, 238, 255, 0.3);
    margin: 0;
}

/* 指标网格布局 */
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    flex: 1;
}

/* 第5个卡片居中显示 */
.pending-rate-card {
    grid-column: 2 / 3;
}

/* 指标卡片基础样式 */
.metric-card {
    background: linear-gradient(135deg, rgba(0, 238, 255, 0.08), rgba(0, 102, 255, 0.08));
    border: 1px solid rgba(0, 238, 255, 0.3);
    border-radius: 8px;
    padding: 12px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    min-height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
}

.metric-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #00eeff, #0066ff);
}

.metric-card:hover {
    border-color: rgba(0, 238, 255, 0.4);
    box-shadow: 0 4px 20px rgba(0, 238, 255, 0.1);
    transform: translateY(-2px);
}

/* 卡片头部 */
.metric-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    gap: 6px;
    flex-shrink: 0;
}

.metric-icon {
    font-size: 16px;
    opacity: 0.8;
}

.metric-label {
    color: #ffffff;
    font-size: 12px;
    opacity: 0.9;
    font-weight: 500;
    line-height: 1.2;
}

/* 数值显示 */
.metric-value {
    color: #00eeff;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    text-shadow: 0 0 8px rgba(0, 238, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    min-height: 40px;
}

/* 不同类型卡片的特殊样式 */
.plan-card {
    border-color: rgba(0, 238, 255, 0.3);
}

.plan-card::before {
    background: linear-gradient(90deg, #00eeff, #0066ff);
}

.complete-card {
    border-color: rgba(34, 197, 94, 0.3);
}

.complete-card::before {
    background: linear-gradient(90deg, #22c55e, #16a34a);
}

.complete-card .metric-value {
    color: #22c55e;
    text-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
}

.pending-card {
    border-color: rgba(251, 191, 36, 0.3);
}

.pending-card::before {
    background: linear-gradient(90deg, #fbbf24, #f59e0b);
}

.pending-card .metric-value {
    color: #fbbf24;
    text-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
}

.rate-card {
    border-color: rgba(168, 85, 247, 0.3);
}

.rate-card::before {
    background: linear-gradient(90deg, #a855f7, #9333ea);
}

.rate-card .metric-value {
    color: #a855f7;
    text-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
}

/* 到期3天内达成率卡片样式 */
.pending-rate-card {
    border-color: rgba(255, 165, 0, 0.3);
}

.pending-rate-card::before {
    background: linear-gradient(90deg, #ffa500, #ff8c00);
}

.pending-rate-card .metric-value {
    color: #ffa500;
    text-shadow: 0 0 8px rgba(255, 165, 0, 0.5);
}

/* 4K分辨率 (3840x2160) */
@media (min-width: 2561px) {
    .title-text {
        font-size: 28px;
    }
    
    .metrics-grid {
        gap: 24px;
    }
    
    .metric-card {
        padding: 24px;
        min-height: 140px;
    }
    
    .metric-label {
        font-size: 20px;
    }
    
    .metric-value {
        font-size: 32px;
        min-height: 80px;
    }
    
    .metric-icon {
        font-size: 24px;
    }
}

/* 2K分辨率 (2560x1440) */
@media (min-width: 1921px) and (max-width: 2560px) {
    .title-text {
        font-size: 22px;
    }
    
    .metrics-grid {
        gap: 18px;
    }
    
    .metric-card {
        padding: 18px;
        min-height: 110px;
    }
    
    .metric-label {
        font-size: 16px;
    }
    
    .metric-value {
        font-size: 24px;
        min-height: 60px;
    }
    
    .metric-icon {
        font-size: 20px;
    }
}

/* 1080p分辨率 (1920x1080) */
@media (min-width: 1600px) and (max-width: 1920px) {
    .title-text {
        font-size: 18px;
    }
    
    .metrics-grid {
        gap: 12px;
    }
    
    .metric-card {
        padding: 12px;
        min-height: 80px;
    }
    
    .metric-label {
        font-size: 12px;
    }
    
    .metric-value {
        font-size: 16px;
        min-height: 45px;
    }
    
    .metric-icon {
        font-size: 16px;
    }
}

/* 小屏1080p (1366x768) */
@media (min-width: 1200px) and (max-width: 1599px) {
    .title-text {
        font-size: 16px;
    }
    
    .metrics-grid {
        gap: 10px;
    }
    
    .metric-card {
        padding: 10px;
        min-height: 70px;
    }
    
    .metric-label {
        font-size: 11px;
    }
    
    .metric-value {
        font-size: 14px;
        min-height: 40px;
    }
    
    .metric-icon {
        font-size: 14px;
    }
}

/* 平板/小屏 (768px-1199px) */
@media (min-width: 768px) and (max-width: 1199px) {
    .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
    }
    
    .pending-rate-card {
        grid-column: 1 / 3;
    }
    
    .metric-card {
        padding: 12px;
        min-height: 60px;
    }
    
    .metric-label {
        font-size: 12px;
    }
    
    .metric-value {
        font-size: 14px;
        min-height: 35px;
    }
}

/* 移动端 (<768px) */
@media (max-width: 767px) {
    .metrics-grid {
        grid-template-columns: 1fr;
        gap: 8px;
    }
    
    .pending-rate-card {
        grid-column: 1;
    }
    
    .metric-card {
        padding: 10px;
        min-height: 60px;
    }
    
    .metric-label {
        font-size: 11px;
    }
    
    .metric-value {
        font-size: 14px;
        min-height: 35px;
    }
}
</style>