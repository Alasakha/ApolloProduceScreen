<template>
    <div class="w-full h-[27vh] p-4">
        <div class="h-full" ref="chartRef">
            <v-chart :option="chartOption" autoresize />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { getFinanceIncome } from '@/api/getIncomingInfo';
import * as echarts from 'echarts/core';

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent]);

const chartData = ref({
    currentMonth: {
        challenge: 0,
        reasonable: 0,
        forecast: 0,
        income: 0
    },
    stage: {
        challenge: 0,
        reasonable: 0,
        forecast: 0,
        income: 0
    }
});

const chartOption = computed(() => ({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        formatter: function(params) {
            let str = params[0].axisValue + '<br/>';
            params.forEach(item => {
                str += item.marker + item.seriesName + ': ' + item.value + '%<br/>';
            });
            return str;
        }
    },
    legend: {
        data: ['当月达成率', '阶段达成率'],
        textStyle: {
            color: '#00eeff'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: ['挑战目标(万)', '合理目标(万)', '预测目标(万)', '实际收入(万)'],
        axisLine: {
            lineStyle: {
                color: '#00eeff'
            }
        },
        axisLabel: {
            color: '#00eeff'
        }
    },
    yAxis: {
        type: 'value',
        axisLine: {
            lineStyle: {
                color: '#00eeff'
            }
        },
        axisLabel: {
            color: '#00eeff',
            formatter: '{value}%'
        },
        splitLine: {
            lineStyle: {
                color: 'rgba(0,238,255,0.1)'
            }
        }
    },
    series: [
        {
            name: '当月达成率',
            type: 'bar',
            data: [
                chartData.value.currentMonth.challenge,
                chartData.value.currentMonth.reasonable,
                chartData.value.currentMonth.forecast,
                chartData.value.currentMonth.income
            ],
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: '#00eeff'
                    }, {
                        offset: 1,
                        color: 'rgba(0,238,255,0.1)'
                    }]
                }
            },
            label: {
                show: true,
                position: 'top',
                formatter: '{c}%',
                color: '#00eeff'
            }
        },
        {
            name: '阶段达成率',
            type: 'bar',
            data: [
                chartData.value.stage.challenge,
                chartData.value.stage.reasonable,
                chartData.value.stage.forecast,
                chartData.value.stage.income
            ],
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#00ff9f' },
                    { offset: 1, color: 'rgba(0,255,159,0.1)' }
                ])
            },
            label: {
                show: true,
                position: 'top',
                formatter: '{c}%',
                color: '#00ff9f'
            }
        }
    ]
}));

const getCurrentMonth = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const getChartData = async () => {
    try {
        const res = await getFinanceIncome();
        const currentMonthData = res.data.find(item => item.monthDay.startsWith(getCurrentMonth()));
        const stageData = res.data.find(item => item.monthDay === '阶段性汇总');
        const totalData = res.data.find(item => item.monthDay === '全年汇总');

        if (currentMonthData && stageData && totalData) {
            // 计算当月达成率
            chartData.value.currentMonth = {
                challenge: Number(((currentMonthData.ysChallengeYear / totalData.ysChallengeYear) * 100).toFixed(1)),
                reasonable: Number(((currentMonthData.ysReasonableYear / totalData.ysReasonableYear) * 100).toFixed(1)),
                forecast: Number(((currentMonthData.ysValueMonth / totalData.ysValueMonth) * 100).toFixed(1)),
                income: Number(((currentMonthData.income / totalData.income) * 100).toFixed(1))
            };

            // 计算阶段达成率
            chartData.value.stage = {
                challenge: Number(((stageData.ysChallengeYear / totalData.ysChallengeYear) * 100).toFixed(1)),
                reasonable: Number(((stageData.ysReasonableYear / totalData.ysReasonableYear) * 100).toFixed(1)),
                forecast: Number(((stageData.ysValueMonth / totalData.ysValueMonth) * 100).toFixed(1)),
                income: Number(((stageData.income / totalData.income) * 100).toFixed(1))
            };
        }
    } catch (error) {
        console.error('获取数据失败:', error);
    }
};

onMounted(() => {
    getChartData();
});
</script>

<style scoped>
:deep(.echarts) {
    width: 100% !important;
    height: 100% !important;
}
</style>