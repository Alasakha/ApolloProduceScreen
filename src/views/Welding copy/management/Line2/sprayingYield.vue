<template>
    <div class="yield-container" @click="openDialog">
        <div class="yield-title">
            <h3>喷涂直通率</h3>
            <!-- <span class="click-note ">(点击进入可以查看和编辑不合格问题明细)</span> -->
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
import { getPaintingPassRate } from '@/api/getStampWeldinfo'
import type { PaintingPassRate } from '@/api/getStampWeldinfo'
import SprayYieldDialog from './SprayYieldDialog.vue'
import { eventBus } from '@/utils/eventbus'

// 响应式数据
const dialogVisible = ref(false)
const sprayData = ref<PaintingPassRate[]>([])

// 计算属性 - 各部件数据
const frameData = computed(() => {
    // 车架数据使用 cj 开头的字段
    const data = sprayData.value[0] // 取第一条数据
    if (!data) {
        return {
            inspectionCount: '0',
            firstPassCount: '0',
            firstPassRate: '0%',
            qualifiedCount: '0',
            qualifiedRate: '0%'
        }
    }
    
    const inspectionCount = data.cjTotal
    const firstPassCount = data.cjTotal - data.cjFirstNg // 一次合格数 = 总检验数 - 一次不合格数
    const qualifiedCount = data.cjHg // 合格数
    const firstPassRate = inspectionCount > 0 ? ((firstPassCount / inspectionCount) * 100).toFixed(1) + '%' : '0%'
    const qualifiedRate = inspectionCount > 0 ? ((qualifiedCount / inspectionCount) * 100).toFixed(1) + '%' : '0%'
    
    return {
        inspectionCount: inspectionCount.toString(),
        firstPassCount: firstPassCount.toString(),
        firstPassRate: firstPassRate,
        qualifiedCount: qualifiedCount.toString(),
        qualifiedRate: qualifiedRate
    }
})

const rearForkData = computed(() => {
    // 后叉数据使用 hch 开头的字段
    const data = sprayData.value[0] // 取第一条数据
    if (!data) {
        return {
            inspectionCount: '0',
            firstPassCount: '0',
            firstPassRate: '0%',
            qualifiedCount: '0',
            qualifiedRate: '0%'
        }
    }
    
    const inspectionCount = data.hchTotal
    const firstPassCount = data.hchTotal - data.hchFirstNg // 一次合格数 = 总检验数 - 一次不合格数
    const qualifiedCount = data.hchHg // 合格数
    const firstPassRate = inspectionCount > 0 ? ((firstPassCount / inspectionCount) * 100).toFixed(1) + '%' : '0%'
    const qualifiedRate = inspectionCount > 0 ? ((qualifiedCount / inspectionCount) * 100).toFixed(1) + '%' : '0%'
    
    return {
        inspectionCount: inspectionCount.toString(),
        firstPassCount: firstPassCount.toString(),
        firstPassRate: firstPassRate,
        qualifiedCount: qualifiedCount.toString(),
        qualifiedRate: qualifiedRate
    }
})

// const tailFrameData = computed(() => {
//     // 尾架数据使用 wj 开头的字段
//     const data = sprayData.value[0] // 取第一条数据
//     if (!data) {
//         return {
//             inspectionCount: '0',
//             firstPassCount: '0',
//             firstPassRate: '0%',
//             qualifiedCount: '0',
//             qualifiedRate: '0%'
//         }
//     }
//     
//     const inspectionCount = data.wjTotal
//     const firstPassCount = data.wjTotal - data.wjFirstNg // 一次合格数 = 总检验数 - 一次不合格数
//     const qualifiedCount = data.wjHg // 合格数
//     const firstPassRate = inspectionCount > 0 ? ((firstPassCount / inspectionCount) * 100).toFixed(1) + '%' : '0%'
//     const qualifiedRate = inspectionCount > 0 ? ((qualifiedCount / inspectionCount) * 100).toFixed(1) + '%' : '0%'
//     
//     return {
//         inspectionCount: inspectionCount.toString(),
//         firstPassCount: firstPassCount.toString(),
//         firstPassRate: firstPassRate,
//         qualifiedCount: qualifiedCount.toString(),
//         qualifiedRate: qualifiedRate
//     }
// })

// 打开对话框
const openDialog = () => {
    dialogVisible.value = true
}

// 加载喷涂数据
const loadSprayData = async () => {
    try {
        const response = await getPaintingPassRate()
        sprayData.value = response.data
    } catch (error) {
        console.error('加载喷涂数据失败:', error)
    }
}

// 组件挂载时加载数据
onMounted(() => {
    loadSprayData()
    eventBus.on('refreshData', loadSprayData)
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