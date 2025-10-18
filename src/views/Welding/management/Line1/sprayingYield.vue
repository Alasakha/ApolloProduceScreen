<template>
    <div class="yield-container" @click="openDialog">
        <div class="yield-title">
            <h3 class="3xl:text-sm">喷涂直通率</h3>
            <!-- <div class="click-note 3xl:text-xs ">(点击进入可以查看和编辑不合格问题明细)</div> -->
        </div>
        <div class="yield-content">
            <!-- 指标标签行 -->
            <div class="metrics-labels">
                <span class="metric-label">今日检验数</span>
                <span class="metric-label">合格数</span>
                <span class="metric-label">合格率</span>
            </div>
            
            <div class="part-section flex">
                <div class="part-header">车架</div>
                <div class="metrics-line">
                    <span class="metric">{{ frameData.inspectionCount }}</span>
                    <span class="metric">{{ frameData.qualifiedCount }}</span>
                    <span class="metric">{{ frameData.qualifiedRate }}</span>
                </div>
            </div>
            
            <div class="part-section flex">
                <div class="part-header">后叉</div>
                <div class="metrics-line">
                    <span class="metric">{{ rearForkData.inspectionCount }}</span>
                    <span class="metric">{{ rearForkData.qualifiedCount }}</span>
                    <span class="metric">{{ rearForkData.qualifiedRate }}</span>
                </div>
            </div>
            
            <div class="part-section flex">
                <div class="part-header">尾架</div>
                <div class="metrics-line">
                    <span class="metric">{{ tailFrameData.inspectionCount }}</span>
                    <span class="metric">{{ tailFrameData.qualifiedCount }}</span>
                    <span class="metric">{{ tailFrameData.qualifiedRate }}</span>
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

// 计算指标
const calculateMetrics = (item: PaintingPassRate2Item) => {
    if (!item) {
        return {
            inspectionCount: '--',
            qualifiedCount: '--',
            qualifiedRate: '--'
        }
    }
    
    return {
        inspectionCount: item.qty.toString(),//今日检验数
        qualifiedCount: item.pass.toString(),
        qualifiedRate: item.rate.toString()+'%'
    }
}

// 计算属性 - 各部件数据
const frameData = computed(() => {
    if (!sprayData.value) {
        return {
            inspectionCount: '--',
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
            qualifiedCount: '--',
            qualifiedRate: '--'
        }
    }
    return calculateMetrics(sprayData.value.wj) // 尾架
})

// 加载喷涂数据
const loadSprayData = async () => {
    try {
        const response = await getPaintingPassRate2(prodLine)
        sprayData.value = response.data
    } catch (error) {
        console.error('加载喷涂数据失败:', error)
    }
}

// 打开对话框
const openDialog = () => {
    dialogVisible.value = true
}

// 监听事件总线
const handleRefresh = () => {
    loadSprayData()
}

onMounted(() => {
    loadSprayData()
    eventBus.on('refreshSprayData', handleRefresh)
})

onBeforeUnmount(() => {
    eventBus.off('refreshSprayData', handleRefresh)
})
</script>

<style scoped>
.yield-container {
    @apply w-full h-full bg-gradient-to-br from-blue-900/20 to-blue-800/30 rounded-lg border border-blue-500/30 cursor-pointer transition-all duration-300 hover:border-blue-400/50 hover:shadow-lg;
    padding: 12px;
    display: flex;
    flex-direction: column;
}

.yield-title {
    @apply text-white mb-3;
}

.yield-title h3 {
    @apply text-lg font-semibold text-blue-200;
    margin: 0;
}

.click-note {
    @apply text-xs text-blue-300 mt-1;
}

.yield-content {
    @apply flex-1 flex flex-col;
}

.metrics-labels {
    @apply flex text-xs text-blue-300 mb-2;
    font-weight: 500;
}

.metric-label {
    @apply flex-1 text-center;
}

.part-section {
    @apply mb-2 last:mb-0;
}

.part-header {
    @apply text-sm text-blue-200 font-medium w-16 flex-shrink-0;
    display: flex;
    align-items: center;
}

.metrics-line {
    @apply flex flex-1;
}

.metric {
    @apply flex-1 text-center text-white font-semibold text-sm;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 响应式设计 */
@media (max-width: 1920px) {
    .yield-title h3 {
        @apply text-sm;
    }
    
    .metric {
        @apply text-xs;
    }
    
    .part-header {
        @apply text-xs;
    }
}
</style>