<template>
    <div class="yield-container" @click="openDialog">
        <div class="yield-title">
            <h3>喷涂直通率</h3>
            <span class="click-note ">(点击进入可以查看和编辑不合格问题明细)</span>
        </div>
        <div class="yield-content">
            <!-- 指标标签行 -->
            <div class="metrics-labels">
                <span class="metric-label">今日检验数</span>
                <span class="metric-label">一次合格数</span>
                <span class="metric-label">直通率</span>
                <span class="metric-label">合格数</span>
                <span class="metric-label">合格率</span>
            </div>
            
            <div class="part-section flex">
                <div class="part-header">车架</div>
                <div class="metrics-line">
                    <span class="metric">{{ frameData.inspectionCount }}</span>
                    <span class="metric">{{ frameData.firstPassCount }}</span>
                    <span class="metric">{{ frameData.firstPassRate }}</span>
                    <span class="metric">{{ frameData.qualifiedCount }}</span>
                    <span class="metric">{{ frameData.qualifiedRate }}</span>
                </div>
            </div>
            
            <div class="part-section flex">
                <div class="part-header">后叉</div>
                <div class="metrics-line">
                    <span class="metric">{{ rearForkData.inspectionCount }}</span>
                    <span class="metric">{{ rearForkData.firstPassCount }}</span>
                    <span class="metric">{{ rearForkData.firstPassRate }}</span>
                    <span class="metric">{{ rearForkData.qualifiedCount }}</span>
                    <span class="metric">{{ rearForkData.qualifiedRate }}</span>
                </div>
            </div>
            
            <!-- <div class="part-section flex">
                <div class="part-header">尾架</div>
                <div class="metrics-line">
                    <span class="metric">{{ tailFrameData.inspectionCount }}</span>
                    <span class="metric">{{ tailFrameData.firstPassCount }}</span>
                    <span class="metric">{{ tailFrameData.firstPassRate }}</span>
                    <span class="metric">{{ tailFrameData.qualifiedCount }}</span>
                    <span class="metric">{{ tailFrameData.qualifiedRate }}</span>
                </div>
            </div> -->
        </div>


        <!-- 喷涂直通率详情对话框 -->
        <SprayYieldDialog v-model="dialogVisible" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { getSprayFty } from '@/api/getStampWeldinfo'
import type { SprayFty } from '@/api/getStampWeldinfo'
import SprayYieldDialog from './SprayYieldDialog.vue'
import { eventBus } from '@/utils/eventbus'

// 响应式数据
const dialogVisible = ref(false)
const sprayData = ref<SprayFty[]>([])

// 计算属性 - 各部件数据
const frameData = computed(() => {
    const frameItems = sprayData.value.filter(item => 
        item.item_description.includes('车架')
    )
    return calculateMetrics(frameItems)
})

const rearForkData = computed(() => {
    const rearForkItems = sprayData.value.filter(item => 
        item.item_description.includes('后叉')
    )
    return calculateMetrics(rearForkItems)
})

// const tailFrameData = computed(() => {
//     const tailFrameItems = sprayData.value.filter(item => 
//         item.item_description.includes('尾架')
//     )
//     return calculateMetrics(tailFrameItems)
// })

// 计算指标
const calculateMetrics = (items: SprayFty[]) => {
    if (items.length === 0) {
        return {
            inspectionCount: '--',
            firstPassCount: '--',
            firstPassRate: '--',
            qualifiedCount: '--',
            qualifiedRate: '--'
        }
    }
    
    const totalInspection = items.reduce((sum, item) => sum + parseInt(item.inventory_qty), 0)
    const totalFirstPass = items.reduce((sum, item) => sum + item.firstOkCount, 0)
    const totalQualified = items.reduce((sum, item) => sum + item.okCount, 0)
    
    return {
        inspectionCount: totalInspection.toString(),
        firstPassCount: totalFirstPass.toString(),
        firstPassRate: totalInspection > 0 ? ((totalFirstPass / totalInspection) * 100).toFixed(1) + '%' : '--',
        qualifiedCount: totalQualified.toString(),
        qualifiedRate: totalInspection > 0 ? ((totalQualified / totalInspection) * 100).toFixed(1) + '%' : '--'
    }
}

// 打开对话框
const openDialog = () => {
    dialogVisible.value = true
}

// 加载喷涂数据
const loadSprayData = async () => {
    try {
        const response = await getSprayFty()
        sprayData.value = response.data
    } catch (error) {
        console.error('加载喷涂数据失败:', error)
    }
}

// 组件挂载时加载数据
onMounted(() => {
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
    padding: 8px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    border: 2px solid #1e90ff;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
}

.yield-container:hover {
    border-color: #00bfff;
    box-shadow: 0 0 15px rgba(30, 144, 255, 0.3);
}

.yield-title {
    background: linear-gradient(135deg, #1e90ff, #4169e1);
    padding: 8px 12px;
    border-radius: 6px;
    margin-bottom: 8px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.click-note {
    color: rgba(255, 255, 255, 0.8);
    font-style: italic;
    padding: 2px 6px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    border: 1px dashed rgba(255, 255, 255, 0.5);
}

.yield-title h3 {
    margin: 0;
    color: white;
    font-size: 16px;
    font-weight: 600;
}

.yield-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.metrics-labels {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    padding: 6px 8px;
    background: rgba(30, 144, 255, 0.1);
    border-radius: 4px;
    border: 1px solid rgba(30, 144, 255, 0.3);
    margin-bottom: 4px;
}

.metric-label {
    font-size: 11px;
    color: #1e90ff;
    font-weight: 600;
    text-align: center;
}

.part-section {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 6px;
    padding: 8px;
    border: 1px solid #1e90ff;
}

.part-header {
    font-size: 14px;
    font-weight: 600;
    color: #1e90ff;
    margin-bottom: 8px;
    text-align: center;
    background: rgba(30, 144, 255, 0.1);
    padding: 4px;
    border-radius: 4px;
}

.metrics-line {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    padding: 6px 8px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    border: 1px solid rgba(30, 144, 255, 0.3);
    width: 90%;
}

.metric {
    font-size: 12px;
    color: #e0e0e0;
    font-weight: 500;
    text-align: center;
}


</style> 