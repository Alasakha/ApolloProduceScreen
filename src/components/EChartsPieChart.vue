<template>
    <div class="echarts-pie-chart">
        <div ref="chartRef" class="chart-container"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, ECharts } from 'echarts'

// 定义数据项接口
export interface PieChartItem {
    name: string
    value: number
    color?: string
}

// 定义组件属性
interface Props {
    data: PieChartItem[]
    title?: string
    radius?: string | number
    center?: [string | number, string | number]
    showLabel?: boolean
    showValue?: boolean
    showPointer?: boolean
    emptyText?: string
    emptyTextColor?: string
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    radius: '70%',
    center: () => ['50%', '50%'],
    showLabel: true,
    showValue: true,
    showPointer: true,
    emptyText: '暂无数据',
    emptyTextColor: '#909399'
})

// 定义事件
const emit = defineEmits<{
    click: [params: any]
}>()

// 图表引用
const chartRef = ref<HTMLElement>()
let chartInstance: ECharts | null = null

// 默认颜色配置
const defaultColors = [
    '#4A90E2', '#7B68EE', '#9370DB', '#8A2BE2', 
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8E8', '#F7DC6F'
]

// 初始化图表
const initChart = () => {
    if (!chartRef.value) return
    
    // 销毁旧实例
    if (chartInstance) {
        chartInstance.dispose()
    }
    
    // 创建新实例
    chartInstance = echarts.init(chartRef.value)
    
    // 设置配置项
    const option: EChartsOption = getChartOption()
    chartInstance.setOption(option)
    
    // 绑定点击事件
    chartInstance.on('click', (params: any) => {
        console.log('ECharts点击事件:', params)
        emit('click', params)
    })
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
}

// 获取图表配置
const getChartOption = (): EChartsOption => {
    // 检查是否有数据
    const hasData = props.data && props.data.length > 0 && props.data.some(item => item.value > 0)

// 当没有有效数据时，创建一个默认的"暂无数据"项
const chartData = computed(() => {
    if (hasData) {
        return props.data
    } else {
        return [{
            name: '暂无数据',
            value: 0,
            color: '#3b7032' // 环保绿色
        }]
    }
})
    
    return {
        title: props.title ? {
            // text: props.title,
            left: 'center',
            top: '5%',
            textStyle: {
                color: '#ffff',
                fontSize: 16,
                fontWeight: 'bold'
            }
        } : undefined,
        
        tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
                return `${params.name}: ${params.value}(${params.percent}%)`
            },
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderColor: '#ddd',
            textStyle: {
                color: '#fff',
                fontSize: 14,
                fontWeight: 'bold'
            }
        },
        
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'middle',
            textStyle: {
                color: '#fff',
                fontSize: 12,
                fontWeight: 'bold'
            },
            itemGap: 8,
            itemWidth: 14,
            itemHeight: 14
        },
        
        series: [
            {
                name: '质量TOP问题',
                type: 'pie',
                radius: props.radius,
                center: props.center,
                data: chartData.value.map((item, index) => ({
                    name: item.name,
                    value: item.value,
                    itemStyle: {
                        color: item.color || defaultColors[index % defaultColors.length]
                    }
                })),
                
                // 标签配置 - 优化字体颜色和可读性
                label: {
                    show: props.showLabel,
                    position: 'outside',
                    formatter: (params: any) => {
                        if (props.showValue && props.showPointer) {
                            return `${params.name}\n${params.value}(${params.percent}%)`
                        } else if (props.showValue) {
                            return `${params.value}`
                        } else if (props.showPointer) {
                            return `${params.name}`
                        }
                        return ''
                    },
                    fontSize: 13,
                    // fontWeight: 'bold',
                    // 使用白色字体
                    color: '#fff',
                    // 添加文字阴影，提高可读性
                    textShadowColor: 'rgba(0, 0, 0, 0.8)',
                    textShadowBlur: 2,
                    textShadowOffsetX: 1,
                    textShadowOffsetY: 1
                },
                
                // 标签线配置
                labelLine: {
                    show: props.showLabel && props.showPointer,
                    length: 15,
                    length2: 10,
                    smooth: true,
                    lineStyle: {
                        color: '#666',
                        width: 2
                    }
                },
                
                // 高亮效果
                emphasis: {
                    itemStyle: {
                        shadowBlur: 15,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.6)'
                    },
                    label: {
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: '#fff',
                        textShadowColor: 'rgba(0, 0, 0, 1)',
                        textShadowBlur: 3,
                        textShadowOffsetX: 1,
                        textShadowOffsetY: 1
                    }
                },
                
                // 动画配置
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: (idx: number) => idx * 200
            }
        ],
        
        // 空数据时的处理
        graphic: hasData ? undefined : [
            {
                type: 'text',
                left: 'center',
                top: 'middle',
                style: {
                    text: props.emptyText,
                    fontSize: 16,
                    fontWeight: 'bold',
                    fill: props.emptyTextColor
                }
            }
        ]
    }
}

// 更新图表数据
const updateChart = () => {
    if (chartInstance) {
        const option = getChartOption()
        chartInstance.setOption(option, true)
    }
}

// 处理窗口大小变化
const handleResize = () => {
    if (chartInstance) {
        chartInstance.resize()
    }
}

// 监听数据变化
watch(() => props.data, () => {
    nextTick(() => {
        updateChart()
    })
}, { deep: true })



// 组件挂载
onMounted(() => {
    nextTick(() => {
        initChart()
    })
})

// 组件卸载
onUnmounted(() => {
    if (chartInstance) {
        chartInstance.dispose()
        chartInstance = null
    }
    window.removeEventListener('resize', handleResize)
})

// 暴露方法给父组件
defineExpose({
    getChartInstance: () => chartInstance,
    resize: handleResize,
    updateChart
})
</script>

<style scoped>
.echarts-pie-chart {
    width: 100%;
    height: 100%;
}

.chart-container {
    width: 100%;
    height: 100%;
    min-height: 300px;
}
</style> 