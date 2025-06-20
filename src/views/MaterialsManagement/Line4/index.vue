<template>
    <div class="accounting ">
        <dv-border-box10 >
            <div class="bc h-full flex flex-col">
                <div class="flex-1 chart-area v-[80%]"  v-show="!isLoading">
                    <div ref="chartRef" class="w-full h-full" style="min-height: 300px;"></div>
                </div>
                <div v-show="isLoading" class="loading flex-1">正在加载......</div>
            </div>
        </dv-border-box10>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { getstagnantAmount } from '@/api/getWMSinfo';
import { eventBus } from '@/utils/eventbus';
import * as echarts from 'echarts';

const isLoading = ref(true);
const chartRef = ref();
let chart: echarts.ECharts | null = null;

interface StagnantData {
    [key: string]: string | number;
}

const formatValue = (value: number) => {
    if (value >= 10000) {
        return (value / 10000).toFixed(2) + '万';
    }
    return value.toFixed(2);
};

const initChart = async (data: StagnantData) => {
    try {
        await nextTick();
        
        if (!chartRef.value) {
            console.log('chartRef is still null after nextTick');
            return;
        }

        if (!chart) {
            console.log('Initializing chart...');
            chart = echarts.init(chartRef.value);
        }

        // 过滤掉"合计"项，并转换数据格式
        const items = Object.entries(data)
            .filter(([key]) => key !== '合计')
            .map(([key, value]) => ({
                name: key.split('-')[0], // 只显示仓库名称
                value: parseFloat(value.toString()),
                fullName: key // 完整名称用于tooltip
            }))
            .sort((a, b) => b.value - a.value); // 按金额从大到小排序

        console.log('Processed data:', items);

        const option = {
            title: {
                text: '呆滞物料处理',
                left: 'center',
                textStyle: {
                    color: '#fff',
                    fontSize: 24
                }
            },
            
            grid: {
                top: '15%',
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    const item = params[0];
                    const fullName = items[item.dataIndex].fullName;
                    return `${fullName}<br/>金额：${formatValue(item.value)}`;
                },
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: items.map(item => item.name),
                axisLabel: {
                    color: '#fff',
                    fontSize: 16,
                    interval: 0
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff',
                        width: 2
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: '金额（万元）',
                nameTextStyle: {
                    color: '#fff',
                    fontSize: 16,
                    padding: [0, 0, 0, 40]
                },
                axisLabel: {
                    color: '#fff',
                    fontSize: 16,
                    formatter: (value: number) => {
                        return (value / 10000).toFixed(1);
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,0.1)'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff',
                        width: 2
                    }
                }
            },
            series: [{
                type: 'bar',
                data: items.map(item => item.value),
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#00f2fe' },
                        { offset: 0.5, color: '#1890ff' },
                        { offset: 1, color: '#46a6ff' }
                    ])
                },
                emphasis: {
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#1890ff' },
                            { offset: 0.7, color: '#46a6ff' },
                            { offset: 1, color: '#00f2fe' }
                        ])
                    }
                },
                barWidth: '45%',
                label: {
                    show: true,
                    position: 'top',
                    color: '#fff',
                    fontSize: 16,
                    formatter: (params: any) => {
                        return formatValue(params.value);
                    }
                }
            }]
        };
        
        console.log('Setting chart option...');
        chart.setOption(option);
        console.log('Chart initialized successfully');
    } catch (error) {
        console.error('Error initializing chart:', error);
    }
};

const handleResize = () => {
    chart?.resize();
};

const fetchData = async () => {
    try {
        isLoading.value = true;
        const res = await getstagnantAmount(1);
        console.log('Fetched data:', res.data);
        isLoading.value = false;
        await initChart(res.data);
    } catch (e) {
        console.error('数据获取失败:', e);
        isLoading.value = false;
    }
};

onMounted(async () => {
    eventBus.on('refreshData', fetchData);
    await fetchData();
    window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
    eventBus.off('refreshData', fetchData);
    window.removeEventListener('resize', handleResize);
    chart?.dispose();
    chart = null;
});
</script>

<style scoped>
.accounting {
    padding-top: 0.5vw;
    padding-bottom: 0.5vw;
    font-family: Arial, sans-serif;
}

.chart-area {
    min-height: 300px;
    overflow: hidden;
    position: relative;
    height: 100%;
    display: flex;
}

.loading {
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
}
</style>