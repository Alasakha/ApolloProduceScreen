<template>
    <div class="echarts-pie-chart">
        <div ref="chartRef" class="chart-container"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import * as echarts from 'echarts/core'
import {
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    GraphicComponent,
    type TooltipComponentOption,
    type LegendComponentOption,
    type TitleComponentOption,
    type GraphicComponentOption
} from 'echarts/components'
import { PieChart, type PieSeriesOption } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import type { ComposeOption, ECharts } from 'echarts/core'
import { GLOBAL_PIE_CHART_COLORS } from '@/utils/pieChartColors'

echarts.use([
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    GraphicComponent,
    PieChart,
    CanvasRenderer
])

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
    radius?: string | number | [string | number, string | number]
    center?: [string | number, string | number]
    showLabel?: boolean
    showValue?: boolean
    showPointer?: boolean
    emptyText?: string
    emptyTextColor?: string
    emptyTextPosition?: [string | number, string | number]
    startAngle?: number
    endAngle?: number
    showLegend?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    radius: '70%',
    center: () => ['50%', '50%'],
    showLabel: true,
    showValue: true,
    showPointer: true,
    emptyText: '暂无数据',
    emptyTextColor: '#009944',
    emptyTextPosition: () => ['45%', '80%'],
    startAngle: undefined,
    endAngle: undefined,
    showLegend: true
})

// 定义事件
const emit = defineEmits<{
    click: [params: any]
}>()

// 图表引用
const chartRef = ref<HTMLElement>()
let chartInstance: ECharts | null = null

// 默认颜色配置
const defaultColors = GLOBAL_PIE_CHART_COLORS

type PieChartOption = ComposeOption<
    TooltipComponentOption |
    LegendComponentOption |
    TitleComponentOption |
    GraphicComponentOption |
    PieSeriesOption
>

// 判断是否有真实数据
const hasRealData = computed(() => {
    return props.data && props.data.length > 0 && props.data.some(item => item.value > 0)
})

// 处理图表数据 - 无数据时创建默认数据
const processedData = computed(() => {
    if (hasRealData.value) {
        return props.data
    } else {
        // 无数据时，创建一个完整的绿色饼图
        return [{
            name: '暂无数据',
            value: 100,
            color: props.emptyTextColor || '#00ff00'
        }]
    }
})

// 初始化图表
const initChart = () => {
    if (!chartRef.value) return
    
    const width = chartRef.value.clientWidth
    const height = chartRef.value.clientHeight
    if (width === 0 || height === 0) {
        setTimeout(() => initChart(), 100)
        return
    }
    
    if (chartInstance) {
        chartInstance.dispose()
    }
    
    chartInstance = echarts.init(chartRef.value)
    updateChart()
    
    chartInstance.on('click', (params: any) => {
        emit('click', params)
    })
    
    window.addEventListener('resize', handleResize)
}

// 获取图表配置
const getChartOption = (): PieChartOption => {
    const isNoData = !hasRealData.value
    
    return {
        title: props.title ? {
            left: 'center',
            top: '5%',
            textStyle: {
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold'
            }
        } : undefined,
        
        tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
                if (isNoData) {
                    return '暂无数据'
                }
                return `${params.name}: ${params.value}(${params.percent}%)`
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#333',
            textStyle: {
                color: '#fff',
                fontSize: 14
            }
        },
        
        legend: (props.showLegend && !isNoData) ? {
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
        } : undefined,
        
        series: [
            {
                name: '质量TOP问题',
                type: 'pie',
                radius: props.radius,
                center: props.center,
                startAngle: props.startAngle,
                endAngle: props.endAngle,
                avoidLabelOverlap: false,
                minAngle: 0,
                data: processedData.value.map((item, index) => ({
                    name: item.name,
                    value: item.value,
                    itemStyle: {
                        color: item.color || defaultColors[index % defaultColors.length]
                    }
                })),
                labelLine: {
                    show: !isNoData && props.showLabel && props.showPointer,
                    length: 15,
                    length2: 10,
                    smooth: true,
                    lineStyle: {
                        color: '#666',
                        width: 2
                    }
                },
                label: {
                    show: !isNoData && props.showLabel,
                    position: 'outside',
                    formatter: (params: any) => {
                        if (isNoData) return ''
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
                    color: '#fff',
                    textShadowColor: 'rgba(0, 0, 0, 0.8)',
                    textShadowBlur: 2,
                    textShadowOffsetX: 1,
                    textShadowOffsetY: 1
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 15,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.6)'
                    },
                    label: {
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: '#fff'
                    }
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: (idx: number) => idx * 200
            }
        ],
        
        // 无数据时在中心显示文字
        graphic: isNoData ? [
            {
                type: 'text',
                left: props.emptyTextPosition[0],
                top: props.emptyTextPosition[1],
                z: 100,
                style: {
                    text: props.emptyText,
                    fontSize: 18,
                    fontWeight: 'bold',
                    fill: props.emptyTextColor || '#00ff00'
                }
            }
        ] : undefined
    }
}

// 更新图表
const updateChart = () => {
    if (!chartInstance) return
    
        const option = getChartOption()
        chartInstance.setOption(option, true)
    
    nextTick(() => {
        if (chartInstance) {
            chartInstance.resize()
    }
    })
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

// 暴露方法
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
}
</style> 
