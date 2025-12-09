<template>
    <div class="prod-line-container">
        <div class="prod-line-title">
            <h3>{{ titleText }}</h3>
        </div>
        <div class="prod-line-content">
            <div class="chart-container">
                <div ref="chartRef" class="chart"></div>
            </div>
            <div class="capacity-summary">
                <div class="summary-item">
                    <span class="summary-label">计划:</span>
                    <span class="summary-value">{{ totalCapacity.plan }}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">实际:</span>
                    <span class="summary-value">{{ totalCapacity.done }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, onUnmounted } from 'vue'
import { getWeekData20062007, type WeekData20062007 } from '@/api/getStampWeldinfo'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'

const route = useRoute()
const chartRef = ref<HTMLElement>()
const chart = ref<echarts.ECharts>()
const weekData = ref<WeekData20062007[]>([])
const currentWeekNum = ref<number>(0)

// 格式化日期显示
const formatDate = (dateString: string): string => {
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)
    return `${month}-${day}`
}

const totalCapacity = computed(() => {
    if (weekData.value.length === 0) {
        return { plan: 0, done: 0 }
    }
    return {
        plan: weekData.value.reduce((sum, item) => sum + (item.monthPlan || 0), 0),
        done: weekData.value.reduce((sum, item) => sum + (item.monthDone || 0), 0)
    }
})

const titleText = computed(() => {
    if (currentWeekNum.value > 0) {
        return `第${currentWeekNum.value}周产能`
    }
    return '周产能'
})

const loadWeekData = async () => {
    try {
        // 从路由获取生产线参数，如果没有则使用默认值
        const prodLine = (route.query.prodLine as string) || 'HJ2-1'
        const response = await getWeekData20062007(prodLine)
        console.log('周产能数据响应:', response.data)
        
        // 接口返回的数据结构是 { code: 200, message: "...", data: { weekData: [...], weekNum: 47 } }
        const weekDataArray = response.data.weekData
        
        if (weekDataArray && Array.isArray(weekDataArray) && weekDataArray.length > 0) {
            // 对日期进行排序（按ty003字段升序）
            const sortedData = [...weekDataArray].sort((a, b) => {
                return a.ty003.localeCompare(b.ty003)
            })
            
            weekData.value = sortedData
            
            // 使用接口返回的周数
            currentWeekNum.value = response.data.weekNum
            
            console.log('排序后的周数据:', weekData.value)
            console.log('当前周数:', currentWeekNum.value)
            
            // 更新图表
            updateChart()
        } else {
            console.warn('接口返回的数据为空或格式不正确:', response.data)
            weekData.value = []
            ElMessage.warning('暂无周产能数据')
        }
    } catch (error) {
        console.error('加载周产能数据失败:', error)
        ElMessage.warning('加载周产能数据失败，请检查网络连接')
        weekData.value = []
    }
}

const initChart = () => {
    if (chartRef.value) {
        console.log('初始化图表，容器尺寸:', chartRef.value.offsetWidth, chartRef.value.offsetHeight)
        
        // 确保容器有尺寸
        if (chartRef.value.offsetWidth > 0 && chartRef.value.offsetHeight > 0) {
            chart.value = echarts.init(chartRef.value)
            updateChart()
        } else {
            console.log('容器尺寸为0，延迟初始化')
            setTimeout(initChart, 100)
        }
    }
}

const updateChart = () => {
    if (!chart.value || weekData.value.length === 0) return

    // 准备图表数据
    const dates = weekData.value.map(item => formatDate(item.ty003))
    const planData = weekData.value.map(item => item.monthPlan || 0)
    const doneData = weekData.value.map(item => item.monthDone || 0)

    // 添加调试信息
    console.log('更新图表数据:', { dates, planData, doneData })
    console.log('图表容器尺寸:', chartRef.value?.offsetWidth, chartRef.value?.offsetHeight)

    const option = {
        tooltip: { 
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00eeff',
            textStyle: { color: '#ffffff' }
        },
        legend: {
            data: ['计划', '实际'],
            top: 2,
            right: 10,
            textStyle: { 
                color: '#ffffff',
                fontSize: 11,
                fontFamily: 'Noto Sans SC, sans-serif'
            },
            itemGap: 15,
            itemWidth: 12,
            itemHeight: 8
        },
        grid: {
            left: '3%', 
            right: '3%', 
            bottom: '3%', 
            top: '8%', 
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,  // 柱状图需要边界间距
            data: dates,
            axisLabel: { 
                color: '#00eeff',
                fontSize: 11,
                fontFamily: 'Orbitron, sans-serif',
                rotate: 45  // 日期标签旋转45度，避免重叠
            },
            axisLine: { lineStyle: { color: 'rgba(0, 238, 255, 0.3)' } },
            axisTick: { lineStyle: { color: 'rgba(0, 238, 255, 0.3)' } }
        },
        yAxis: {
            type: 'value',
            axisLabel: { 
                color: '#00eeff',
                fontSize: 11,
                fontFamily: 'Orbitron, sans-serif'
            },
            axisLine: { lineStyle: { color: 'rgba(0, 238, 255, 0.3)' } },
            axisTick: { lineStyle: { color: 'rgba(0, 238, 255, 0.3)' } },
            splitLine: { lineStyle: { color: 'rgba(0, 238, 255, 0.1)' } }
        },
        series: [
            {
                name: '计划',
                type: 'bar',
                data: planData,
                label: {
                    show: true,
                    position: 'top',
                    color: '#ffffff',
                    fontSize: 11,
                    fontFamily: 'Noto Sans SC, sans-serif',
                    formatter: (params: any) => {
                        return params.value || 0
                    }
                }
            },
            {
                name: '实际',
                type: 'bar',
                data: doneData,
                label: {
                    show: true,
                    position: 'top',
                    color: '#ffffff',
                    fontSize: 11,
                    fontFamily: 'Noto Sans SC, sans-serif',
                    formatter: (params: any) => {
                        return params.value || 0
                    }
                }
            }
        ]
    }

    chart.value.setOption(option)
}

onMounted(async () => {
    await loadWeekData()
    await nextTick()
    
    // 延迟初始化图表，确保 DOM 完全渲染
    setTimeout(() => {
        initChart()
    }, 200)
    
    // 添加窗口大小变化监听器
    window.addEventListener('resize', handleResize)
    
    // 添加全屏变化监听器
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    
    // 移除全屏变化监听器
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
    document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    
    if (chart.value) {
        chart.value.dispose()
    }
})

const handleResize = () => {
    if (chart.value) {
        chart.value.resize()
    }
}

const handleFullscreenChange = () => {
    // 延迟执行，确保全屏状态完全切换
    setTimeout(() => {
        if (chart.value) {
            console.log('全屏状态变化，重新调整图表尺寸')
            chart.value.resize()
            
            // 重新设置图表选项以确保最佳显示效果
            updateChart()
        }
    }, 100)
}
</script>

<style scoped>
/* 引入科技感字体 */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100;300;400;500;700;900&display=swap');

.prod-line-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 2px;
    background: linear-gradient(135deg, 
        rgba(0, 0, 0, 0.9) 0%, 
        rgba(0, 20, 40, 0.8) 50%, 
        rgba(0, 0, 0, 0.9) 100%);
    border-radius: 12px;
    margin: 0 8px;
    border: 2px solid rgba(0, 238, 255, 0.3);
    box-shadow: 
        0 0 20px rgba(0, 238, 255, 0.1),
        inset 0 0 20px rgba(0, 238, 255, 0.05);
    position: relative;
    overflow: hidden;
    width: 100%;
}

/* 添加网格背景 */
.prod-line-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
        linear-gradient(rgba(0, 238, 255, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 238, 255, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: 0;
}

/* 添加发光边框动画 */
.prod-line-container::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, 
        rgba(0, 238, 255, 0.8), 
        rgba(0, 102, 255, 0.8), 
        rgba(0, 238, 255, 0.8));
    border-radius: 14px;
    z-index: -1;
    animation: borderGlow 3s ease-in-out infinite;
}

@keyframes borderGlow {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
}

.prod-line-title {
    background: linear-gradient(135deg, 
        rgba(0, 238, 255, 0.9) 0%, 
        rgba(0, 102, 255, 0.9) 100%);
    padding: 6px 12px;
    border-radius: 8px;
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 
        0 4px 20px rgba(0, 238, 255, 0.4),
        0 0 30px rgba(0, 238, 255, 0.2);
    position: relative;
    z-index: 1;
    border: 1px solid rgba(255, 255, 255, 0.2);
    flex-shrink: 0; /* 不允许缩小 */
}

.prod-line-title h3 {
    margin: 0;
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Noto Sans SC', sans-serif;
    text-shadow: 
        0 0 10px rgba(255, 255, 255, 0.8),
        0 0 20px rgba(0, 238, 255, 0.6);
    letter-spacing: 1px;
}

.prod-line-content {
    flex: 1;
    display: flex;
    /* flex-direction: column; */
    gap: 6px;
    position: relative;
    z-index: 1;
    min-height: 0; /* 允许 flex 子元素缩小 */
}

.chart-container {
    flex: 1;
    min-width: 0; /* 允许 flex 子元素缩小 */
    min-height: 150px;
    background: linear-gradient(135deg, 
        rgba(0, 238, 255, 0.05) 0%, 
        rgba(0, 102, 255, 0.05) 100%);
    border-radius: 8px;
    padding: 4px;
    border: 1px solid rgba(0, 238, 255, 0.3);
    box-shadow: 
        0 0 20px rgba(0, 238, 255, 0.1),
        inset 0 0 20px rgba(0, 238, 255, 0.05);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* 图表容器发光效果 */
.chart-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
        transparent 30%, 
        rgba(0, 238, 255, 0.1) 50%, 
        transparent 70%);
    animation: chartGlow 4s ease-in-out infinite;
    pointer-events: none;
}

@keyframes chartGlow {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
}

.chart {
    width: 100%;
    height: 100%;
    min-height: 200px; /* 确保图表有最小高度 */
    position: relative;
    z-index: 1;
    flex: 1; /* 占据剩余空间 */
    margin: 0; /* 移除任何默认边距 */
}

.capacity-summary {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    gap: 16px;
    padding: 12px;
    background: linear-gradient(135deg, 
        rgba(0, 0, 0, 0.8) 0%, 
        rgba(0, 20, 40, 0.6) 100%);
    border-radius: 12px;
    border: 2px solid rgba(0, 238, 255, 0.5);
    box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 20px rgba(0, 238, 255, 0.2);
    position: relative;
    overflow: hidden;
    flex-shrink: 0; /* 不允许缩小 */
    width: 140px; /* 固定宽度，让图表占据更多空间 */
    min-width: 120px; /* 最小宽度 */
}

/* 汇总区域发光边框 */
.capacity-summary::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, 
        rgba(0, 238, 255, 0.8), 
        rgba(0, 102, 255, 0.8), 
        rgba(0, 238, 255, 0.8));
    border-radius: 14px;
    z-index: -1;
    animation: summaryGlow 2s ease-in-out infinite;
}

@keyframes summaryGlow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
}

.summary-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: linear-gradient(135deg, 
        rgba(0, 238, 255, 0.1) 0%, 
        rgba(0, 102, 255, 0.1) 100%);
    border-radius: 8px;
    min-width: 0;
    border: 1px solid rgba(0, 238, 255, 0.3);
    box-shadow: 0 4px 16px rgba(0, 238, 255, 0.1);
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
}

.summary-item:hover {
    transform: translateY(-2px);
    box-shadow: 
        0 8px 24px rgba(0, 238, 255, 0.2),
        0 0 20px rgba(0, 238, 255, 0.1);
    border-color: rgba(0, 238, 255, 0.6);
}

.summary-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
    font-family: 'Noto Sans SC', sans-serif;
    text-shadow: 0 0 10px rgba(0, 238, 255, 0.5);
    letter-spacing: 0.5px;
}

.summary-value {
    font-size: 24px;
    color: #00eeff;
    font-weight: 700;
    font-family: 'Orbitron', sans-serif;
    text-shadow: 
        0 0 10px rgba(0, 238, 255, 0.8),
        0 0 20px rgba(0, 238, 255, 0.4);
    animation: valueGlow 2s ease-in-out infinite;
}

@keyframes valueGlow {
    0%, 100% { text-shadow: 0 0 10px rgba(0, 238, 255, 0.8), 0 0 20px rgba(0, 238, 255, 0.4); }
    50% { text-shadow: 0 0 15px rgba(0, 238, 255, 1), 0 0 30px rgba(0, 238, 255, 0.6); }
}

.fillin-content {
    max-height: 60vh;
    overflow-y: auto;
    /* background: linear-gradient(135deg, 
        rgba(0, 0, 0, 0.9) 0%, 
        rgba(0, 20, 40, 0.8) 100%); */
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(0, 238, 255, 0.3);
}

.hour-inputs {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
}

.hour-row {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    padding: 16px;
    background: linear-gradient(135deg, 
        rgba(0, 238, 255, 0.08) 0%, 
        rgba(0, 102, 255, 0.08) 100%);
    border-radius: 8px;
    border: 1px solid rgba(0, 238, 255, 0.2);
    transition: all 0.3s ease;
}

.hour-row:hover {
    background: linear-gradient(135deg, 
        rgba(0, 238, 255, 0.12) 0%, 
        rgba(0, 102, 255, 0.12) 100%);
    border-color: rgba(0, 238, 255, 0.4);
    box-shadow: 0 4px 16px rgba(0, 238, 255, 0.1);
}

.hour-label {
    font-size: 14px;
    color: rgba(0, 166, 243, 0.9);
    font-weight: 600;
    font-family: 'Noto Sans SC', sans-serif;
    text-shadow: 0 0 8px rgba(0, 238, 255, 0.4);
}

.capacity-input {
    width: 90px;
}

.dialog-footer {
    text-align: right;
}

/* 修复dialog闪烁问题的样式 */
:deep(.capacity-fillin-dialog) {
    position: fixed !important;
    z-index: 2000 !important;
}

:deep(.capacity-fillin-dialog .el-dialog) {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    margin: 0 !important;
    z-index: 2001 !important;
    background: linear-gradient(135deg, 
        rgba(0, 0, 0, 0.95) 0%, 
        rgba(0, 20, 40, 0.9) 100%);
    border: 2px solid rgba(0, 238, 255, 0.6);
    border-radius: 16px;
    box-shadow: 
        0 0 40px rgba(0, 238, 255, 0.3),
        0 20px 60px rgba(0, 0, 0, 0.8);
}

:deep(.capacity-fillin-dialog .el-dialog__wrapper) {
    position: fixed !important;
    z-index: 2000 !important;
}

:deep(.capacity-fillin-dialog .el-overlay) {
    position: fixed !important;
    z-index: 1999 !important;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
}

:deep(.capacity-fillin-dialog .el-dialog__header) {
    background: linear-gradient(135deg, 
        rgba(0, 238, 255, 0.9) 0%, 
        rgba(0, 102, 255, 0.9) 100%);
    color: #ffffff;
    border-radius: 16px 16px 0 0;
    border-bottom: 1px solid rgba(0, 238, 255, 0.3);
}

:deep(.capacity-fillin-dialog .el-dialog__title) {
    color: #ffffff;
    font-weight: 700;
    font-family: 'Noto Sans SC', sans-serif;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

:deep(.capacity-fillin-dialog .el-input-number) {
    width: 90px;
}

:deep(.capacity-fillin-dialog .el-input-number .el-input__inner) {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(0, 238, 255, 0.5);
    color: #00eeff;
    border-radius: 6px;
    font-family: 'Orbitron', sans-serif;
    text-align: center;
}

:deep(.capacity-fillin-dialog .el-input-number .el-input__inner:focus) {
    border-color: rgba(0, 238, 255, 0.8);
    box-shadow: 0 0 15px rgba(0, 238, 255, 0.3);
}

:deep(.capacity-fillin-dialog .el-input-number .el-input__inner::placeholder) {
    color: rgba(0, 238, 255, 0.5);
}

:deep(.capacity-fillin-dialog .hour-inputs) {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
}

:deep(.capacity-fillin-dialog .hour-row) {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    padding: 16px;
    background: linear-gradient(135deg, 
        rgba(0, 238, 255, 0.08) 0%, 
        rgba(0, 102, 255, 0.08) 100%);
    border-radius: 8px;
    border: 1px solid rgba(0, 238, 255, 0.2);
}

:deep(.capacity-fillin-dialog .hour-label) {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
    font-family: 'Noto Sans SC', sans-serif;
    text-shadow: 0 0 8px rgba(0, 238, 255, 0.4);
}

:deep(.capacity-fillin-dialog .el-button) {
    background: linear-gradient(135deg, 
        rgba(0, 238, 255, 0.9) 0%, 
        rgba(0, 102, 255, 0.9) 100%);
    border: none;
    color: #ffffff;
    font-weight: 600;
    font-family: 'Noto Sans SC', sans-serif;
    box-shadow: 
        0 4px 16px rgba(0, 238, 255, 0.3),
        0 0 20px rgba(0, 238, 255, 0.1);
    border-radius: 8px;
    transition: all 0.3s ease;
}

:deep(.capacity-fillin-dialog .el-button:hover) {
    background: linear-gradient(135deg, 
        rgba(0, 102, 255, 0.9) 0%, 
        rgba(0, 238, 255, 0.9) 100%);
    transform: translateY(-2px);
    box-shadow: 
        0 8px 24px rgba(0, 238, 255, 0.4),
        0 0 30px rgba(0, 238, 255, 0.2);
}

/* 自定义滚动条 */
:deep(.fillin-content::-webkit-scrollbar) {
    width: 8px;
}

:deep(.fillin-content::-webkit-scrollbar-track) {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
}

:deep(.fillin-content::-webkit-scrollbar-thumb) {
    background: linear-gradient(135deg, 
        rgba(0, 238, 255, 0.6) 0%, 
        rgba(0, 102, 255, 0.6) 100%);
    border-radius: 4px;
}

:deep(.fillin-content::-webkit-scrollbar-thumb:hover) {
    background: linear-gradient(135deg, 
        rgba(0, 238, 255, 0.8) 0%, 
        rgba(0, 102, 255, 0.8) 100%);
}

.hidden-content {
    opacity: 0; /* 完全透明，但保留空间 */
    /* 或者使用 visibility: hidden; 也可以保留空间 */
}
</style> 