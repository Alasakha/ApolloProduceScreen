<template>
    <div class="w-full h-[27vh] min-h-[200px] p-4">
        <div class="h-full min-h-[200px]" ref="chartRef">
            <v-chart :option="chartOption" autoresize />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, DataZoomComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import * as echarts from 'echarts/core';

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent, DataZoomComponent]);

// 定义props接口
interface Props {
    tableData?: {
        months: Record<string, any>;
        total: any;
        stage: any;
    };
}

const props = withDefaults(defineProps<Props>(), {
    tableData: () => ({
        months: {},
        total: {},
        stage: {}
    })
});

const chartRef = ref(null);

// 月份标签
const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

// 计算图表数据
const chartData = computed(() => {
    const data = {
        budgetQuantity: [], // 年度挑战预算（数量）/台
        actualQuantity: [], // 年度合理预算（数量）/台
        monthlyForecast: [], // 月度预测（数量）/台
        bgTotal: [] // 实际数量/台
    };

    months.forEach(month => {
        const monthData = props.tableData.months[month];
        if (monthData) {
            data.budgetQuantity.push(monthData.budgetQuantity || 0);
            data.actualQuantity.push(monthData.actualQuantity || 0);
            data.monthlyForecast.push(monthData.monthlyForecast || 0);
            data.bgTotal.push(monthData.bgTotal || 0);
        } else {
            data.budgetQuantity.push(0);
            data.actualQuantity.push(0);
            data.monthlyForecast.push(0);
            data.bgTotal.push(0);
        }
    });

    return data;
});

// 图表配置
const chartOption = computed(() => ({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        },
        backgroundColor: 'rgba(0, 19, 47, 0.9)',
        borderColor: '#00eeff',
        borderWidth: 1,
        textStyle: {
            color: '#00eeff'
        }
    },
    legend: {
        data: ['年度挑战预算', '年度合理预算', '月度预测', '实际数量'],
        textStyle: {
            color: '#00eeff',
            fontSize: 12
        },
        top: 10,
        right: 10
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '20%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: months,
        axisLine: {
            lineStyle: {
                color: '#00eeff'
            }
        },
        axisLabel: {
            color: '#00eeff',
            fontSize: 10,
            rotate: 45
        },
        axisTick: {
            lineStyle: {
                color: '#00eeff'
            }
        }
    },
    yAxis: {
        type: 'value',
        name: '数量/台',
        nameTextStyle: {
            color: '#00eeff'
        },
        axisLine: {
            lineStyle: {
                color: '#00eeff'
            }
        },
        axisLabel: {
            color: '#00eeff',
            fontSize: 10
        },
        splitLine: {
            lineStyle: {
                color: 'rgba(0,238,255,0.1)'
            }
        }
    },
    dataZoom: [
        {
            type: 'inside',
            start: 0,
            end: 100
        },
        {
            type: 'slider',
            start: 0,
            end: 100,
            bottom: 10,
            height: 20,
            borderColor: '#00eeff',
            fillerColor: 'rgba(0,238,255,0.1)',
            handleStyle: {
                color: '#00eeff'
            },
            textStyle: {
                color: '#00eeff'
            }
        }
    ],
    series: [
        {
            name: '年度挑战预算',
            type: 'line',
            data: chartData.value.budgetQuantity,
            smooth: true,
            lineStyle: {
                color: '#8A2BE2',
                width: 3
            },
            itemStyle: {
                color: '#8A2BE2',
                borderColor: '#8A2BE2',
                borderWidth: 2
            },
            symbol: 'circle',
            symbolSize: 6,
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(0,238,255,0.3)' },
                    { offset: 1, color: 'rgba(0,238,255,0.05)' }
                ])
            }
        },
        {
            name: '年度合理预算',
            type: 'line',
            data: chartData.value.actualQuantity,
            smooth: true,
            lineStyle: {
                color: '#00ff9f',
                width: 3
            },
            itemStyle: {
                color: '#00ff9f',
                borderColor: '#00ff9f',
                borderWidth: 2
            },
            symbol: 'diamond',
            symbolSize: 6,
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(0,255,159,0.3)' },
                    { offset: 1, color: 'rgba(0,255,159,0.05)' }
                ])
            }
        },
        {
            name: '月度预测',
            type: 'line',
            data: chartData.value.monthlyForecast,
            smooth: true,
            lineStyle: {
                color: '#ff6b6b',
                width: 3
            },
            itemStyle: {
                color: '#ff6b6b',
                borderColor: '#ff6b6b',
                borderWidth: 2
            },
            symbol: 'triangle',
            symbolSize: 6,
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(255,107,107,0.3)' },
                    { offset: 1, color: 'rgba(255,107,107,0.05)' }
                ])
            }
        },
        {
            name: '实际数量',
            type: 'line',
            data: chartData.value.bgTotal,
            smooth: true,
            lineStyle: {
                color: '#feca57',
                width: 3
            },
            itemStyle: {
                color: '#feca57',
                borderColor: '#feca57',
                borderWidth: 2
            },
            symbol: 'rect',
            symbolSize: 6,
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(254,202,87,0.3)' },
                    { offset: 1, color: 'rgba(254,202,87,0.05)' }
                ])
            }
        }
    ]
}));

// 监听数据变化
watch(() => props.tableData, () => {
    // 数据变化时图表会自动更新
}, { deep: true });

onMounted(() => {
    // 组件挂载完成
});
</script>

<style scoped>
:deep(.echarts) {
    width: 100% !important;
    height: 100% !important;
    min-height: 200px;
}
</style>