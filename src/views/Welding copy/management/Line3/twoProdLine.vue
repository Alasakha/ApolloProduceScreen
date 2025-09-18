<template>
    <div class="prod-line-container">
        <div class="prod-line-title">
            <h3>焊接设备组当日小时产能</h3>
            <el-button type="primary" size="small" @click="openFillinDialog">填写产能</el-button>
        </div>
        <div class="prod-line-content">
            <div class="chart-container">
                <div ref="chartRef" class="chart"></div>
            </div>
            <div class="capacity-summary">
                <div class="summary-item">
                    <span class="summary-label">车架:</span>
                    <span class="summary-value">{{ totalCapacity.cj }}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">后叉:</span>
                    <span class="summary-value">{{ totalCapacity.hch }}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">尾架:</span>
                    <span class="summary-value">{{ totalCapacity.wj }}</span>
                </div>
            </div>
        </div>

        <el-dialog 
            v-model="fillinDialogVisible" 
            title="填写焊接设备组小时产能" 
            width="80%" 
            :modal="true"
            :append-to-body="true"
            :lock-scroll="true"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            class="capacity-fillin-dialog"
        >
            <div class="fillin-content">
                <div class="hour-inputs">
                    <div v-for="hour in 18" :key="hour+6" class="hour-row">
                        <span class="hour-label">{{ hour + 6 }}时</span>
                        <el-input-number v-model="hourData[hour + 6 - 1].cj" :min="0" size="small" placeholder="车架" />
                        <el-input-number v-model="hourData[hour + 6 - 1].hch" :min="0" size="small" placeholder="后叉" />
                        <el-input-number v-model="hourData[hour + 6 - 1].wj" :min="0" size="small" placeholder="尾架" />
                    </div>
                </div>
            </div>
            <template #footer>
                <el-button @click="fillinDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitCapacity" :loading="submitting">提交</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, onUnmounted } from 'vue'
import { getAutomaticWelding, automaticWeldingFillin, type AutomaticWeldingFillin } from '@/api/getStampWeldinfo'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'

const chartRef = ref<HTMLElement>()
const chart = ref<echarts.ECharts>()
const fillinDialogVisible = ref(false)
const submitting = ref(false)

// 修改 hourData 初始化，添加 plan 属性
const hourData = ref(Array.from({ length: 24 }, (_, i) => ({
    hour: i + 1,
    cj: 0,
    hch: 0,
    wj: 0,
    plan: 0  // 添加缺失的 plan 属性
})))

const totalCapacity = computed(() => ({
    cj: hourData.value.reduce((sum, item) => sum + item.cj, 0),
    hch: hourData.value.reduce((sum, item) => sum + item.hch, 0),
    wj: hourData.value.reduce((sum, item) => sum + item.wj, 0)
}))

const openFillinDialog = () => {
    // 确保在下一个tick后打开dialog，避免闪烁
    nextTick(() => {
        fillinDialogVisible.value = true
    })
}

const submitCapacity = async () => {
    submitting.value = true
    try {
        const data: AutomaticWeldingFillin = {
            code: 'HJ2-2',
            hourList: hourData.value.map(item => ({
                ...item,
                plan: item.wj  // 使用 wj 值作为 plan
            }))
        }
        
        // 详细日志输出
        console.log('准备提交产能数据...')
        console.log('请求数据:', data)
        console.log('数据类型检查:', {
            code: typeof data.code,
            hourList: Array.isArray(data.hourList),
            hourListLength: data.hourList.length,
            firstHour: data.hourList[0],
            lastHour: data.hourList[data.hourList.length - 1]
        })
        
        // 数据验证
        if (!data.code || !Array.isArray(data.hourList) || data.hourList.length === 0) {
            throw new Error('数据格式无效')
        }
        
        console.log('开始调用API...')
        const result = await automaticWeldingFillin(data)
        console.log('API调用成功，响应:', result)
        
        ElMessage.success('产能数据提交成功')
        fillinDialogVisible.value = false
        await loadCapacityData()
    } catch (error) {
        console.error('提交产能数据失败:', error)
        
        // 详细错误信息
        if (error.response) {
            console.error('HTTP错误详情:')
            console.error('状态码:', error.response.status)
            console.error('状态文本:', error.response.statusText)
            console.error('响应头:', error.response.headers)
            console.error('响应数据:', error.response.data)
        } else if (error.request) {
            console.error('网络请求错误:', error.request)
        } else {
            console.error('其他错误:', error.message)
        }
        
        // 用户友好的错误提示
        let errorMessage = '提交失败，请重试'
        if (error.response?.status === 500) {
            errorMessage = '服务器内部错误，请联系管理员'
        } else if (error.response?.status === 400) {
            errorMessage = '请求数据格式错误，请检查输入'
        } else if (error.response?.status === 401) {
            errorMessage = '权限不足，请重新登录'
        } else if (error.response?.status === 403) {
            errorMessage = '访问被拒绝，请联系管理员'
        } else if (error.response?.status === 404) {
            errorMessage = '接口不存在，请联系开发人员'
        }
        
        ElMessage.error(errorMessage)
    } finally {
        submitting.value = false
    }
}

const loadCapacityData = async () => {
    try {
        const response = await getAutomaticWelding('HJ2-2')
        console.log('产能数据响应:', response.data)
        
        // 检查响应数据结构并更新本地数据
        if (response.data && response.data.hourList && Array.isArray(response.data.hourList)) {
            // 将接口返回的数据更新到本地 hourData
            hourData.value = response.data.hourList.map(item => ({
                hour: item.hour,
                cj: item.cj || 0,
                hch: item.hch || 0,
                wj: item.wj || 0,
                plan: item.plan || 0  // 添加 plan 属性
            }))
            
            console.log('更新后的本地数据:', hourData.value)
            
            // 更新图表
            updateChart()
        } else {
            console.warn('接口返回的数据结构不符合预期:', response.data)
            // 如果没有数据，保持初始的0值
            ElMessage.warning('暂无产能数据，请先填写产能信息')
        }
    } catch (error) {
        console.error('加载产能数据失败:', error)
        // 错误时显示提示，保持初始的0值
        ElMessage.warning('加载产能数据失败，请检查网络连接')
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
    if (!chart.value) return

    // 只展示7-24小时的数据
    const filteredHourData = hourData.value.filter(item => item.hour >= 7 && item.hour <= 24)
    const hours = filteredHourData.map(item => item.hour)
    const cjData = filteredHourData.map(item => item.cj)
    const hchData = filteredHourData.map(item => item.hch)
    const wjData = filteredHourData.map(item => item.wj)

    // 添加调试信息
    console.log('更新图表数据:', { hours, cjData, hchData, wjData })
    console.log('图表容器尺寸:', chartRef.value?.offsetWidth, chartRef.value?.offsetHeight)

    const option = {
        title: {
            text: '24小时产能趋势',
            textStyle: { 
                color: '#00eeff', 
                fontSize: 16,
                fontFamily: 'Noto Sans SC, sans-serif',
                fontWeight: 'bold'
            },
            left: 'center',
            top: 10
        },
        tooltip: { 
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00eeff',
            textStyle: { color: '#ffffff' }
        },
        legend: {
            data: ['车架', '后叉', '尾架'],
            bottom: 10,
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
            bottom: '20%', 
            top: '20%', 
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
                name: '车架',
                type: 'line',
                data: cjData,
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
            },
            {
                name: '后叉',
                type: 'line',
                data: hchData,
                smooth: true,
                lineStyle: { 
                    color: '#00ff9f', 
                    width: 3,
                    shadowColor: 'rgba(0, 255, 159, 0.5)',
                    shadowBlur: 10
                },
                itemStyle: { 
                    color: '#00ff9f',
                    borderColor: '#ffffff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}',
                    fontSize: 12,
                    color: '#00ff9f',
                    fontWeight: 'bold',
                    textShadowColor: 'rgba(0, 0, 0, 0.8)',
                    textShadowBlur: 2
                }
            },
            {
                name: '尾架',
                type: 'line',
                data: wjData,
                smooth: true,
                lineStyle: { 
                    color: '#ff9f00', 
                    width: 3,
                    shadowColor: 'rgba(255, 159, 0, 0.5)',
                    shadowBlur: 10
                },
                itemStyle: { 
                    color: '#ff9f00',
                    borderColor: '#ffffff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}',
                    fontSize: 12,
                    color: '#ff9f00',
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
    await loadCapacityData()
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
    padding: 16px;
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
    padding: 12px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
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
    gap: 20px;
    position: relative;
    z-index: 1;
}

.chart-container {
    flex: 1;
    min-height: 150px; /* 改为最小高度，允许自适应 */
    background: linear-gradient(135deg, 
        rgba(0, 238, 255, 0.05) 0%, 
        rgba(0, 102, 255, 0.05) 100%);
    border-radius: 12px;
    padding: 16px;
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
    height: 200px; /* 固定高度确保图表有足够的显示空间 */
    position: relative;
    z-index: 1;
}

.capacity-summary {
    display: flex;
    justify-content: space-around;
    gap: 20px;
    padding: 16px;
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
    align-items: center;
    gap: 8px;
    padding: 16px;
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
    background: linear-gradient(135deg, 
        rgba(0, 0, 0, 0.9) 0%, 
        rgba(0, 20, 40, 0.8) 100%);
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
    color: rgba(255, 255, 255, 0.9);
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
</style> 