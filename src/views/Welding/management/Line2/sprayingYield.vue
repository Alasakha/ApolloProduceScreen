<template>
    <div class="yield-container" @click="openDialog">
        <div class="yield-title">
            <h3>喷涂直通率</h3>
            <!-- <div class="click-note 3xl:text-xs ">(点击进入可以查看和编辑不合格问题明细)</div> -->
        </div>
        <div class="yield-content">
            <div class="part-section">
                <div class="part-header">车架</div>
                <div class="metrics-line">
                    <span class="metric-item">
                        <span class="metric-label-inline">今日检验数</span>
                        <span class="metric-value">{{ frameData.inspectionCount }}</span>
                    </span>
                    <span class="metric-item">
                        <span class="metric-label-inline">合格数</span>
                        <span class="metric-value">{{ frameData.qualifiedCount }}</span>
                    </span>
                    <span class="metric-item">
                        <span class="metric-label-inline">合格率</span>
                        <span class="metric-value">{{ frameData.qualifiedRate }}</span>
                    </span>
                </div>
            </div>
            
            <div class="part-section">
                <div class="part-header">后叉</div>
                <div class="metrics-line">
                    <span class="metric-item">
                        <span class="metric-label-inline">今日检验数</span>
                        <span class="metric-value">{{ rearForkData.inspectionCount }}</span>
                    </span>
                    <span class="metric-item">
                        <span class="metric-label-inline">合格数</span>
                        <span class="metric-value">{{ rearForkData.qualifiedCount }}</span>
                    </span>
                    <span class="metric-item">
                        <span class="metric-label-inline">合格率</span>
                        <span class="metric-value">{{ rearForkData.qualifiedRate }}</span>
                    </span>
                </div>
            </div>
            
            <div class="part-section">
                <div class="part-header">尾架</div>
                <div class="metrics-line">
                    <span class="metric-item">
                        <span class="metric-label-inline">今日检验数</span>
                        <span class="metric-value">{{ tailFrameData.inspectionCount }}</span>
                    </span>
                    <span class="metric-item">
                        <span class="metric-label-inline">合格数</span>
                        <span class="metric-value">{{ tailFrameData.qualifiedCount }}</span>
                    </span>
                    <span class="metric-item">
                        <span class="metric-label-inline">合格率</span>
                        <span class="metric-value">{{ tailFrameData.qualifiedRate }}</span>
                    </span>
                </div>
            </div>
        </div>


        <!-- 喷涂直通率详情对话框 -->
        <SprayYieldDialog v-model="dialogVisible" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { eventBus } from '@/utils/eventbus'
import { getPaintingPassRate2 } from '@/api/getStampinfo'
import { type PaintingPassRate2, type PaintingPassRate2Item } from '@/api/getStampinfo'
import SprayYieldDialog from './SprayYieldDialog.vue'
import { useRoute } from 'vue-router'

// 获取路由参数
const route = useRoute()
const prodLine = route.query.prodLine as string

// 响应式数据
const dialogVisible = ref(false)
const sprayData = ref<PaintingPassRate2 | null>(null)

// 计算属性 - 各部件数据
const frameData = computed(() => {
    if (!sprayData.value) {
        return {
            inspectionCount: '--',
            firstPassCount: '--',
            firstPassRate: '--',
            qualifiedCount: '--',
            qualifiedRate: '--'
        }
    }
    return calculateMetrics(sprayData.value.cj) // 车架
})

const rearForkData = computed(() => {
    if (!sprayData.value) {
        return {
            inspectionCount: '--',
            firstPassCount: '--',
            firstPassRate: '--',
            qualifiedCount: '--',
            qualifiedRate: '--'
        }
    }
    return calculateMetrics(sprayData.value.hch) // 后叉
})

const tailFrameData = computed(() => {
    if (!sprayData.value) {
        return {
            inspectionCount: '--',
            firstPassCount: '--',
            firstPassRate: '--',
            qualifiedCount: '--',
            qualifiedRate: '--'
        }
    }
    return calculateMetrics(sprayData.value.wj) // 尾架
})

// 计算指标
const calculateMetrics = (item: PaintingPassRate2Item) => {
    if (!item) {
        return {
            inspectionCount: '--',
            firstPassCount: '--',
            firstPassRate: '--',
            qualifiedCount: '--',
            qualifiedRate: '--'
        }
    }
    
    return {
        inspectionCount: item.qty.toString(),//今日检验数
        firstPassCount: item.udf001.toString(),
        firstPassRate: item.qty > 0 ? ((item.udf001 / item.qty) * 100).toFixed(1) + '%' : '--',
        qualifiedCount: item.pass.toString(),
        qualifiedRate: item.rate.toString()+'%'
    }
}

// 打开对话框
const openDialog = () => {
    dialogVisible.value = true
}

// 加载喷涂数据
const loadSprayData = async () => {
    try {
        const response = await getPaintingPassRate2(prodLine)
        sprayData.value = response.data
    } catch (error) {
        console.error('加载喷涂数据失败:', error)
    }
}

// 组件挂载时加载数据
onMounted(() => {
    eventBus.on('refreshData', loadSprayData)
    loadSprayData()
})
onBeforeUnmount(() => {
  eventBus.off('refreshData', loadSprayData)
})
</script>

<style scoped>
.yield-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
    overflow: hidden;
}

.yield-container:hover {
    box-shadow: 0 0 15px rgba(39, 159, 39, 0.3);
}

.yield-title {
    background: #279f27;
    padding: 8px 12px;
    border-radius: 0;
    margin-bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.yield-title h3 {
    margin: 0;
    color: white;
    flex: 1;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
}

/* 1080p (1920px) */
/* 1080p (1920px) */
@media (min-width: 1920px) {
    .yield-title {
        padding: 10px 14px;
    }
    
    .yield-title h3 {
        font-size: 16px;
    }
    
    .yield-content {
        padding: 10px;
        gap: 10px;
    }
    
    .part-section {
        padding: 10px;
        gap: 18px;
    }
    
    .part-header {
        font-size: 16px;
    }
    
    .metrics-line {
        gap: 18px;
    }
    
    .metric-item {
        gap: 6px;
    }
    
    .metric-label-inline,
    .metric-value {
        font-size: 14px;
    }
}

/* 2K (2560px) */
@media (min-width: 2060px) {
    .yield-title {
        padding: 12px 16px;
    }
    
    .yield-title h3 {
        font-size: 16px;
    }
    
    .yield-content {
        padding: 12px;
        gap: 12px;
    }
    
    .part-section {
        padding: 12px;
        gap: 20px;
    }
    
    .part-header {
        font-size: 22px;
    }
    
    .metrics-line {
        gap: 20px;
    }
    
    .metric-item {
        gap: 8px;
    }
    
    .metric-label-inline,
    .metric-value {
        font-size: 17px;
    }
}

/* 4K (3840px) */
@media (min-width: 3800px) {
    .yield-title {
        padding: 16px 20px;
    }
    
    .yield-title h3 {
        font-size: 24px;
    }
    
    .yield-content {
        padding: 16px;
        gap: 16px;
    }
    
    .part-section {
        padding: 16px;
        gap: 24px;
    }
    
    .part-header {
        font-size: 29px;
    }
    
    .metrics-line {
        gap: 24px;
    }
    
    .metric-item {
        gap: 10px;
    }
    
    .metric-label-inline,
    .metric-value {
        font-size: 25px;
    }
}

.click-note {
    color: rgba(255, 255, 255, 0.8);
    font-style: italic;
    padding: 2px 6px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    border: 1px dashed rgba(255, 255, 255, 0.5);
    position: absolute;
    right: 12px;
    white-space: nowrap;
}

.yield-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    background: rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.metrics-labels {
    display: none;
}

.metric-label {
    font-size: 11px;
    color: white;
    font-weight: 600;
    text-align: center;
}

.part-section {
    background: transparent;
    border-radius: 0;
    padding: 8px;
    border: 1px solid #279f27;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-height: 0;
}

.part-header {
    /* font-size: 14px; */
    font-weight: 600;
    color: #279f27;
    margin-bottom: 0;
    text-align: left;
    background: transparent;
    padding: 0;
    border-radius: 0;
    white-space: nowrap;
    flex-shrink: 0;
}

.metrics-line {
    display: flex;
    flex-wrap: nowrap;
    gap: 16px;
    padding: 0;
    background: transparent;
    border-radius: 0;
    border: none;
    flex: 1;
    align-items: center;
}

.metric-item {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    justify-content: center;
}

.metric-label-inline {
    /* font-size: 12px; */
    color: white;
    font-weight: 500;
}

.metric-value {
    /* font-size: 12px; */
    color: white;
    /* font-weight: 500; */
}


</style> 