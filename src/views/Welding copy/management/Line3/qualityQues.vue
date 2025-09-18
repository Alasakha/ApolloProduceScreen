<template>
    <div class="quality-container">
        <div class="quality-title">
            <h3>今日质量TOP问题</h3>
        </div>
        <div class="chart-container">
            <EChartsPieChart
                :data="chartData"
                :title="chartConfig.title"
                :radius="chartConfig.radius"
                :center="chartConfig.center"
                :show-label="chartConfig.showLabel"
                :show-value="chartConfig.showValue"
                :show-pointer="chartConfig.showPointer"
                theme="dark"
                @click="handleChartClick"
                ref="pieChartRef"
            />
        </div>

        
        <!-- 明细Dialog -->
        <el-dialog
            v-model="dialogVisible"
            title="质量问题明细"
            width="80%"
            :before-close="handleClose"
            class="detail-dialog"
            :close-on-click-modal="false"
            :close-on-press-escape="true"
            :append-to-body="true"
            :destroy-on-close="true"
        >
            <div class="detail-content">
                <div v-if="loading" class="loading-container">
                    <el-icon class="is-loading"><Loading /></el-icon>
                    <span>数据加载中...</span>
                </div>
                
                <el-table 
                    v-else 
                    :data="detailData" 
                    border 
                    style="width: 100%"
                    :empty-text="errorMessage || '暂无数据'"
                >
                    <el-table-column prop="date" label="日期" width="120" />
                    <el-table-column prop="workOrder" label="工单号" width="150" />
                    <el-table-column prop="partNo" label="品号" width="120" />
                    <el-table-column prop="customerOrder" label="客户单号" width="150" />
                    <el-table-column prop="type" label="类型" width="100" />
                    <el-table-column prop="defectCode" label="不合格代码" width="120" />
                    <el-table-column prop="defectName" label="不合格名称" width="150" />
                    <el-table-column prop="department" label="责任部门" width="120" />
                    <el-table-column prop="responsible" label="责任人" width="100" />
                    <el-table-column prop="count" label="数量" width="80" />
                </el-table>
                

            </div>
            
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">关闭</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch,onBeforeUnmount  } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import EChartsPieChart from '@/components/EChartsPieChart.vue'
import type { PieChartItem } from '@/components/EChartsPieChart.vue'
import { getTodayBadIssues, type TodayBadIssues } from '@/api/getStampWeldinfo'
import { eventBus } from '@/utils/eventbus'
// 图表引用
const pieChartRef = ref()

// Dialog控制
const dialogVisible = ref(false)
const detailData = ref<any[]>([])
const loading = ref(false)
const errorMessage = ref('')

// 生产线参数（根据实际情况调整）
const prodLine = ref('2003') // 或者从props传入

// 真实API数据
const apiData = ref<TodayBadIssues[]>([])

// 图表数据 - 从API数据转换
const chartData = computed((): PieChartItem[] => {
    if (!apiData.value || apiData.value.length === 0) {
        return []
    }
    
    // 将API数据转换为图表数据格式
    return apiData.value.map((item, index) => ({
        name: item.ngName,
        value: item.total,
        color: getDefaultColor(index)
    }))
})

// 获取默认颜色
const getDefaultColor = (index: number): string => {
    const colors = [
        '#4A90E2', '#7B68EE', '#9370DB', '#8A2BE2', 
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
        '#FFEAA7', '#DDA0DD', '#98D8E8', '#F7DC6F'
    ]
    return colors[index % colors.length]
}

// 图表配置 - 优化字体颜色和可读性
const chartConfig = computed(() => ({
    title: '质量TOP问题分布',
    radius: '70%',
    center: ['50%', '50%'] as [string, string],
    showLabel: true,
    showValue: true,
    showPointer: true,
    theme: 'dark',
    // 自定义颜色配置，确保高对比度
    colors: [
        '#FF6B6B', // 红色 - 高对比度
        '#4ECDC4', // 青色 - 高对比度
        '#45B7D1', // 蓝色 - 高对比度
        '#96CEB4', // 绿色 - 高对比度
        '#FFC53D', // 黄色 - 高对比度
        '#B37FEB'  // 紫色 - 高对比度
    ]
}))

// 获取今日不良TOP问题数据
const fetchTodayBadIssues = async () => {
    try {
        console.log('开始获取今日不良TOP问题数据，生产线:', prodLine.value)
        
        const response = await getTodayBadIssues(prodLine.value)
        console.log('API响应数据:', response)
        
        if (response && response.data) {
            apiData.value = response.data
            console.log('今日不良TOP问题数据:', apiData.value)
        } else {
            console.warn('API返回数据为空')
            apiData.value = []
        }
        
    } catch (error) {
        console.error('获取今日不良TOP问题数据失败:', error)
        apiData.value = []
    }
}

// 处理图表点击
const handleChartClick = (params: any) => {
    console.log('点击了图表项:', params)
    if (params.name) {
        openDetailDialog(params.name)
    }
}

// 打开明细Dialog
const openDetailDialog = (category: string) => {
    console.log('打开明细Dialog，类别:', category)
    dialogVisible.value = true
    fetchDetailData(category)
}

// 获取明细数据
const fetchDetailData = async (category: string) => {
    loading.value = true
    errorMessage.value = ''
    
    try {
        console.log('开始获取明细数据，类别:', category)
        
        // TODO: 调用真实API获取明细数据
        // const response = await getDetailData(prodLine.value, category)
        // detailData.value = response.data || []
        
        // 暂时设置为空数据，等待真实API实现
        detailData.value = []
        console.log('明细数据加载完成:', detailData.value)
        
    } catch (error) {
        console.error('获取明细数据失败:', error)
        errorMessage.value = `数据加载失败: ${error.message || '未知错误'}`
        detailData.value = []
    } finally {
        loading.value = false
    }
}

// 关闭Dialog
const handleClose = () => {
    dialogVisible.value = false
    detailData.value = []
    errorMessage.value = ''
}





onMounted(async () => {
    // 初始加载数据
    await fetchTodayBadIssues()
    
    eventBus.on('refreshData', fetchTodayBadIssues)
})
onBeforeUnmount(() => {
    eventBus.off('refreshData', fetchTodayBadIssues)
})



    // 监听生产线变化
    watch(prodLine, () => {
    fetchTodayBadIssues()
})


</script>

<style scoped>
.quality-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin: 0;
    width: 100%;
    box-sizing: border-box;
}

.quality-title {
    background: linear-gradient(135deg, #87CEEB, #98D8E8);
    padding: 8px 16px;
    border-radius: 6px;
    margin-bottom: 16px;
}

.quality-title h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
}

.chart-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
    width: 100%;
    min-height: 300px;
}

.description-box {
    background: rgba(135, 206, 235, 0.2);
    padding: 12px;
    border-radius: 6px;
    border: 1px solid rgba(135, 206, 235, 0.3);
}

.description-box p {
    margin: 0;
    font-size: 12px;
    color: #2c3e50;
    line-height: 1.4;
    text-align: center;
}

/* Dialog样式 */
.detail-dialog {
    background: rgba(0, 0, 0, 0.8);
}

.detail-content {
    max-height: 60vh;
    overflow-y: auto;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: #909399;
}

.loading-container .el-icon {
    font-size: 24px;
    margin-bottom: 12px;
}

.dialog-footer {
    text-align: right;
}


</style>