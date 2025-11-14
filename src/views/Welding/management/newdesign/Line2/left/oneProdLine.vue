<template>
    <div class="prod-line-container">
        <div class="prod-line-title">
            <h3>自动焊一线当日小时产能</h3>
        </div>
        <div class="prod-line-content">
            <div class="chart-container">
                <div ref="chartRef" class="chart"></div>
            </div>
            <div class="capacity-summary">
                <div class="summary-item">
                    <span class="summary-label">实际产出:</span>
                    <span class="summary-value">{{ totalActual }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, onUnmounted } from 'vue'
import { getAnchuanHourCl, type AnchuanHourCl } from '@/api/getStampWeldinfo'
import * as echarts from 'echarts'

const chartRef = ref<HTMLElement>()
const chart = ref<echarts.ECharts>()
const resizeObserver = ref<ResizeObserver>()

const hourData = ref(Array.from({ length: 24 }, (_, i) => ({
    hour: i + 1,
    actual: 0
})))

const totalActual = computed(() => hourData.value.reduce((sum, item) => sum + item.actual, 0))

const loadCapacityData = async () => {
    try {
        const response = await getAnchuanHourCl()
        console.log('安川小时产能响应:', response.data)
        
        if (Array.isArray(response.data)) {
            const dataMap = new Map<number, number>()
            response.data.forEach((item: AnchuanHourCl) => {
                if (item.hour2 != null) {
                    const value = Number(item.total ?? item.cl ?? 0)
                    dataMap.set(Number(item.hour2), Number.isFinite(value) ? value : 0)
                }
            })

            hourData.value = Array.from({ length: 24 }, (_, i) => {
                const hour = i + 1
                return {
                    hour,
                    actual: dataMap.get(hour) ?? 0
                }
            })
        } else {
            console.warn('安川小时产能返回的数据结构不符合预期:', response.data)
        }

        updateChart()
    } catch (error) {
        console.error('加载产能数据失败:', error)
        // 发生错误时，保持默认的24小时结构
        hourData.value = Array.from({ length: 24 }, (_, i) => ({
            hour: i + 1,
            actual: 0
        }))
    }
}

const initChart = () => {
    if (chartRef.value) {
        console.log('初始化图表，容器尺寸:', chartRef.value.offsetWidth, chartRef.value.offsetHeight)
        
        // 确保容器有尺寸
        if (chartRef.value.offsetWidth > 0 && chartRef.value.offsetHeight > 0) {
            chart.value = echarts.init(chartRef.value)
            updateChart()
            
            // 设置ResizeObserver监听容器大小变化
            setupResizeObserver()
        } else {
            console.log('容器尺寸为0，延迟初始化')
            setTimeout(initChart, 100)
        }
    }
}

const setupResizeObserver = () => {
    if (chartRef.value && window.ResizeObserver) {
        resizeObserver.value = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect
                console.log('容器尺寸变化:', width, height)
                
                // 延迟调整图表大小，确保DOM更新完成
                nextTick(() => {
                    try {
                        if (chart.value && !chart.value.isDisposed()) {
                            chart.value.resize()
                        }
                    } catch (error) {
                        console.error('ResizeObserver resize失败:', error)
                        // 如果resize失败，尝试重新初始化图表
                        if (chartRef.value) {
                            initChart()
                        }
                    }
                })
            }
        })
        
        resizeObserver.value.observe(chartRef.value)
    }
}

const updateChart = () => {
    if (!chart.value) return

    // 确保hourData数组完整且有效
    if (!hourData.value || hourData.value.length !== 24) {
        console.warn('hourData数据不完整，重新初始化')
        hourData.value = Array.from({ length: 24 }, (_, i) => ({
            hour: i + 1,
            actual: 0
        }))
    }

    // 过滤掉undefined的项，确保数据完整性
    const validHourData = hourData.value.filter(item => item && typeof item === 'object')
    
    if (validHourData.length !== 24) {
        console.warn('检测到无效数据项，重新初始化')
        hourData.value = Array.from({ length: 24 }, (_, i) => ({
            hour: i + 1,
            actual: 0
        }))
    }

    const hours = hourData.value.map(item => item?.hour || 0)
    const actualData = hourData.value.map(item => item?.actual || 0)

    // 添加调试信息
    console.log('更新图表数据:', { hours, actualData })
    console.log('图表容器尺寸:', chartRef.value?.offsetWidth, chartRef.value?.offsetHeight)

    const option = {
        // title: {
        //     text: '24小时产能趋势',
        //     textStyle: { 
        //         color: '#00eeff', 
        //         fontSize: 16,
        //         fontFamily: 'Noto Sans SC, sans-serif',
        //         fontWeight: 'bold'
        //     },
        //     left: 'center',
        //     top: 10
        // },
        tooltip: { 
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00eeff',
            textStyle: { color: '#ffffff' }
        },
        legend: {
            data: ['车架', '后叉', '尾架', '计划产量'],
            top: 0,
            right: 0,
            textStyle: { 
                color: '#ffffff',
                fontSize: 12,
                fontFamily: 'Noto Sans SC, sans-serif'
            },
            itemGap: 20
        },
        grid: {
            left: '5%', 
            right: '5%', 
            bottom: '0', 
            top: '15%', 
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: hours,
            axisLabel: { 
                color: '#00eeff',
                fontSize: 11,
                fontFamily: 'Orbitron, sans-serif'
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
                name: '实际产出',
                type: 'line',
                data: actualData,
                smooth: true,
                lineStyle: { 
                    color: '#00eeff', 
                    width: 3,
                    shadowColor: 'rgba(0, 238, 255, 0.5)',
                    shadowBlur: 10
                },
                itemStyle: { 
                    color: '#00eeff',
                    borderColor: '#ffffff',
                    borderWidth: 2
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 238, 255, 0.3)' },
                            { offset: 1, color: 'rgba(0, 238, 255, 0.05)' }
                        ]
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}',
                    fontSize: 12,
                    color: '#00eeff',
                    fontWeight: 'bold',
                    textShadowColor: 'rgba(0, 0, 0, 0.8)',
                    textShadowBlur: 2
                }
            }
        ]
    }

    chart.value.setOption(option)
}

onMounted(async () => {
    // 确保hourData数组完全初始化
    if (hourData.value.length !== 24) {
        hourData.value = Array.from({ length: 24 }, (_, i) => ({
            hour: i + 1,
            actual: 0
        }))
    }
    
    await loadCapacityData()
    await nextTick()
    
    // 延迟初始化图表，确保 DOM 完全渲染
    setTimeout(() => {
        initChart()
    }, 200)
    
    // 添加窗口大小变化监听器
    window.addEventListener('resize', handleResize)
    
    // 添加全屏状态变化监听器
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
    document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    
    if (resizeObserver.value) {
        resizeObserver.value.disconnect()
    }
    
    if (chart.value) {
        chart.value.dispose()
    }
})

const handleResize = () => {
    if (chart.value) {
        // 延迟调整，确保DOM更新完成
        nextTick(() => {
            try {
                // 确保图表实例仍然有效
                if (chart.value && !chart.value.isDisposed()) {
                    chart.value.resize()
                }
            } catch (error) {
                console.error('图表resize失败:', error)
                // 如果resize失败，尝试重新初始化图表
                if (chartRef.value) {
                    initChart()
                }
            }
        })
    }
}

const handleFullscreenChange = () => {
    // 全屏状态变化时，延迟调整图表大小
    setTimeout(() => {
        try {
            if (chart.value && !chart.value.isDisposed()) {
                chart.value.resize()
            }
        } catch (error) {
            console.error('全屏变化resize失败:', error)
            // 如果resize失败，尝试重新初始化图表
            if (chartRef.value) {
                initChart()
            }
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
    /* padding: 16px; */
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
    padding: 2px 2px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 
        0 4px 20px rgba(0, 238, 255, 0.4),
        0 0 30px rgba(0, 238, 255, 0.2);
    position: relative;
    z-index: 1;
    border: 1px solid rgba(255, 255, 255, 0.2);
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
    flex-direction: column;
    gap: 5px;
    position: relative;
    z-index: 1;
}

.chart-container {
    flex: 1;
    /* min-height: 150px; 改为最小高度，允许自适应 */
    background: linear-gradient(135deg, 
        rgba(0, 238, 255, 0.05) 0%, 
        rgba(0, 102, 255, 0.05) 100%);
    border-radius: 12px;
    /* padding: 16px; */
    border: 1px solid rgba(0, 238, 255, 0.3);
    box-shadow: 
        0 0 20px rgba(0, 238, 255, 0.1),
        inset 0 0 20px rgba(0, 238, 255, 0.05);
    position: relative;
    overflow: hidden;
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
    position: relative;
    z-index: 1;
}

.capacity-summary {
    display: flex;
    justify-content: space-around;
    gap: 20px;
    padding: 4px;
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
    /* flex-direction: column; */
    align-items: center;
    gap: 8px;
    padding: 5px;
    background: linear-gradient(135deg, 
        rgba(0, 238, 255, 0.1) 0%, 
        rgba(0, 102, 255, 0.1) 100%);
    border-radius: 8px;
    min-width: 80px;
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
    font-size: 12px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
    font-family: 'Noto Sans SC', sans-serif;
    text-shadow: 0 0 10px rgba(0, 238, 255, 0.5);
    letter-spacing: 0.5px;
}

.summary-value {
    font-size: 15px;
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

.loading-placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    background: linear-gradient(135deg, 
        rgba(0, 238, 255, 0.05) 0%, 
        rgba(0, 102, 255, 0.05) 100%);
    border-radius: 12px;
    border: 1px solid rgba(0, 238, 255, 0.2);
}
</style> 