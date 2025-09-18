<template>
    <div class="quality-container w-full h-full p-2">
        <div class="text-lg font-bold text-white mb-2 text-center" style="letter-spacing: 2px;">
            今日质量TOP问题
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
                :empty-text="chartData && chartData.length > 0 ? '' : '→ 暂无数据'"
                :empty-text-color="'#00ff00'"
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
import { ref, onMounted, computed,onUnmounted  } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import EChartsPieChart from '@/components/EChartsPieChart.vue'
import type { PieChartItem } from '@/components/EChartsPieChart.vue'
import { getTodayBadIssues, type TodayBadIssues } from '@/api/getStampWeldinfo'
import { useRoute } from 'vue-router'

const route = useRoute()
const prodLine = route.query.prodLine as string

// 图表引用
const pieChartRef = ref()

// Dialog控制
const dialogVisible = ref(false)
const detailData = ref<any[]>([])
const loading = ref(false)
const errorMessage = ref('')



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
        console.log('开始获取今日不良TOP问题数据，生产线:', prodLine)
        
        const response = await getTodayBadIssues(prodLine)
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
    console.log('🎯 Paint组件收到图表点击事件:', params)
    console.log('点击参数详情:', {
        name: params.name,
        value: params.value,
        dataIndex: params.dataIndex,
        seriesName: params.seriesName,
        seriesType: params.seriesType
    })
    
    if (params.name) {
        console.log('✅ 有效点击，准备打开明细Dialog，类别:', params.name)
        openDetailDialog(params.name)
    } else {
        console.warn('⚠️ 点击事件缺少name参数:', params)
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
        
        // 暂时使用测试数据，验证Dialog功能
        detailData.value = [
            {
                date: '2024-01-15',
                workOrder: 'WO-2024-001',
                partNo: 'P001',
                customerOrder: 'CO-2024-001',
                type: category,
                defectCode: 'DEF001',
                defectName: '表面缺陷',
                department: '质检部',
                responsible: '张三',
                count: 5
            },
            {
                date: '2024-01-15',
                workOrder: 'WO-2024-002',
                partNo: 'P002',
                customerOrder: 'CO-2024-002',
                type: category,
                defectCode: 'DEF002',
                defectName: '尺寸偏差',
                department: '生产部',
                responsible: '李四',
                count: 3
            }
        ]
        
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

// 定时刷新数据
let refreshTimer: NodeJS.Timeout | null = null

// 启动定时刷新
const startAutoRefresh = () => {
    refreshTimer = setInterval(() => {
        
        fetchTodayBadIssues()
    }, 60000) // 每分钟刷新一次
}

// 停止定时刷新
const stopAutoRefresh = () => {
    if (refreshTimer) {
        clearInterval(refreshTimer)
        refreshTimer = null
    }
}

onMounted(async () => {
    // 初始加载数据
    await fetchTodayBadIssues()
    
    // 启动自动刷新
    startAutoRefresh()
})

// 组件卸载时清理定时器
onUnmounted(() => {
    stopAutoRefresh()
})

// 监听生产线变化
// watch(prodLine, () => {
//     fetchTodayBadIssues()
// })


</script>

<style scoped>
.quality-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(34, 211, 238, 0.3);
    overflow: hidden; /* 防止内容溢出 */
    box-sizing: border-box;
}

.chart-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 0; /* 允许容器收缩 */
    padding: 8px;
    box-sizing: border-box;

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