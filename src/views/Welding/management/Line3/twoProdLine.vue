<template>
    <div class="prod-line-container">
        <div class="prod-line-title flex justify-center items-center">
            <h3 class>自动焊二线当日小时产量</h3>
            <el-button type="primary" size="small" @click="openFillinDialog">填写计划产能</el-button>
        </div>
        <div class="prod-line-content">
            <!-- 折线图展示 -->
            <div class="chart-container">
                <div ref="chartRef" class="chart"></div>
            </div>
            
            <!-- 当前产能汇总 -->
            <div class="capacity-summary">
                <div class="summary-item">
                    <span class="summary-label">计划产能:</span>
                    <span class="summary-value">{{ totalPlanCapacity }}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">实际产能:</span>
                    <span class="summary-value">{{ totalCapacity }}</span>
                </div>
            </div>
        </div>

        <!-- 产能填写对话框 -->
        <el-dialog
            v-model="fillinDialogVisible"
            title="填写计划产能"
            width="80%"
            :modal="true"
            :append-to-body="true"
            :lock-scroll="true"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="handleClose"
            class="capacity-fillin-dialog"
        >
            <div class="fillin-content">
                <div class="hour-inputs">
                    <div v-for="hour in 24" :key="hour" class="hour-row">
                        <span class="hour-label">{{ hour }}时</span>
                        <div class="input-group">
                            <label>计划产能:</label>
                            <el-input-number 
                                v-model="planData[hour-1].cl" 
                                :min="0" 
                                size="small" 
                                placeholder="计划产能"
                                class="capacity-input"
                            />
                        </div>
                        <div class="input-group">
                            <label>实际产能:</label>
                            <el-input-number 
                                :model-value="hourData[hour-1].total" 
                                :min="0" 
                                size="small" 
                                placeholder="实际产能"
                                class="capacity-input readonly"
                                :disabled="true"
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="fillinDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitCapacity" :loading="submitting">
                        提交
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, onUnmounted } from 'vue'
import { getRuisongHourCl, getAutomaticWelding, automaticWeldingFillin} from '@/api/getStampWeldinfo'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'

// 响应式数据
const chartRef = ref<HTMLElement>()
const chart = ref<echarts.ECharts>()
const fillinDialogVisible = ref(false)
const submitting = ref(false)

// 计划产能数据
const planData = ref(Array.from({ length: 24 }, (_, i) => ({
    hour: i + 1,
    cl: 0
})))

// 小时产能数据
const hourData = ref(Array.from({ length: 24 }, (_, i) => ({
    hour: i + 1,
    total: 0
})))

// 当前产能汇总
const totalCapacity = computed(() => {
    return hourData.value.reduce((sum, item) => sum + item.total, 0)
})

// 计划产能汇总
const totalPlanCapacity = computed(() => {
    return planData.value.reduce((sum, item) => sum + item.cl, 0)
})

// 打开填写对话框
const openFillinDialog = () => {
    // 确保在下一个tick后打开dialog，避免闪烁
    nextTick(() => {
        fillinDialogVisible.value = true
    })
}

// 关闭对话框
const handleClose = () => {
    fillinDialogVisible.value = false
}

// 提交计划产能数据
const submitCapacity = async () => {
    submitting.value = true
    try {
        // 准备提交的数据
        const submitData = {
            code: 'HJ1-2', // 或者根据实际需要动态设置
            hourList: planData.value.map(item => ({
                hour: item.hour,
                cj: 0,
                hch: 0,
                wj: item.cl,
                plan: item.cl  // 添加缺失的 plan 属性
            }))
        }
        
        console.log('准备提交计划产能数据...', submitData)
        
        // 调用计划产能填写接口
        await automaticWeldingFillin(submitData)
        
        ElMessage.success('计划产能提交成功')
        fillinDialogVisible.value = false
        // 重新加载数据并更新图表
        await loadCapacityData()
        await loadPlanData()
    } catch (error) {
        console.error('提交计划产能失败:', error)
        
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

// 加载产能数据
const loadCapacityData = async () => {
    try {
        const response = await getRuisongHourCl()
        console.log('产能数据响应:', response.data)
        
        // 检查响应数据结构并更新本地数据
        if (response.data && Array.isArray(response.data)) {
            // 将接口返回的数据更新到本地 hourData
            const dataMap = new Map()
            response.data.forEach(item => {
                dataMap.set(item.hour2, item.total)
            })
            
            hourData.value = hourData.value.map(item => ({
                hour: item.hour,
                total: dataMap.get(item.hour) || 0
            }))
            
            console.log('更新后的本地数据:', hourData.value)
            
            // 更新图表
            updateChart()
        } else {
            console.warn('接口返回的数据结构不符合预期:', response.data)
        }
    } catch (error) {
        console.error('加载产能数据失败:', error)
    }
}


// 计划产能数据加载函数
// 如果你想用 plan 字段，说明你的接口 hourList 结构应该是 { hour, plan }，而不是 { hour, cj, hch, wj }
// 你需要确保 getAutomaticWelding('Hj1-2') 返回的数据结构为 { hour, plan }
// 如果接口返回的还是 { hour, cj, hch, wj }，你需要后端配合修改接口，或者前端只用 cj/hch/wj 之一作为 plan
// 下面代码假设 hourList 结构为 { hour, plan }
const loadPlanData = async () => {
    try {
        const response = await getAutomaticWelding('HJ1-2')
        const planRawData = response.data
        // planData 是 ref 响应式变量
        if (planRawData && Array.isArray(planRawData.hourList)) {
            // 处理 hourList，更新 planData
            const planHourMap = new Map<number, number>()
            planRawData.hourList.forEach(item => {
                // 后端返回结构 {hour, cj, hch, wj}，这里把 wj 作为计划产能使用
                planHourMap.set(item.hour, item.wj)
            })
            // 更新 planData.value 数组
            planData.value = planData.value.map(item => ({
                hour: item.hour,
                cl: planHourMap.get(item.hour) || 0
            }))
            console.log('planData.value:', planData.value)
        } else {
            console.warn('计划产能接口返回的数据结构不符合预期:', planRawData)
        }
    } catch (error) {
        console.error('加载计划产能数据失败:', error)
    }
}

// 初始化图表
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

// 更新图表
const updateChart = () => {
    if (!chart.value) return

    const hours = hourData.value.map(item => item.hour)
    const totalData = hourData.value.map(item => item.total)
    const planData_chart = planData.value.map(item => item.cl)

    const option = {
        // title: {
        //     text: '小时产能趋势',
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
            data: ['计划产能', '实际产能'],
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
            bottom: '0%', 
            top: '3%', 
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
                name: '计划产能',
                type: 'line',
                data: planData_chart,
                smooth: true,
                lineStyle: { 
                    color: '#ff9500', 
                    width: 3,
                    shadowColor: 'rgba(255, 149, 0, 0.5)',
                    shadowBlur: 10
                },
                itemStyle: { 
                    color: '#ff9500',
                    borderColor: '#ffffff',
                    borderWidth: 2
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(255, 149, 0, 0.3)' },
                            { offset: 1, color: 'rgba(255, 149, 0, 0.05)' }
                        ]
                    }
                }
            },
            {
                name: '实际产能',
                type: 'line',
                data: totalData,
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
                }
            }
        ]
    }

    chart.value.setOption(option)
}

// 组件挂载时初始化
onMounted(async () => {
    await loadCapacityData()
    await nextTick()
    await loadPlanData()
    // 延迟初始化图表，确保 DOM 完全渲染
    setTimeout(() => {
        initChart()
    }, 200)
    
    // 添加窗口大小变化监听器
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (chart.value) {
        chart.value.dispose()
    }
})

const handleResize = () => {
    if (chart.value) {
        chart.value.resize()
    }
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
    flex-direction: column;
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
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

.hour-row {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    padding: 16px;
    background: linear-gradient(135deg, 
        rgba(0, 238, 255, 0.08) 0%, 
        rgba(0, 102, 255, 0.08) 100%);
    border-radius: 8px;
    border: 1px solid rgba(0, 238, 255, 0.2);
    transition: all 0.3s ease;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
    width: 100%;
}

.input-group label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
    font-family: 'Noto Sans SC', sans-serif;
    text-shadow: 0 0 6px rgba(0, 238, 255, 0.3);
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

.capacity-input.readonly {
    opacity: 0.7;
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