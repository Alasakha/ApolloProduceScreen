<template>
    <div class="month">
        <dv-border-box12>
            <div dv-bg class="month-title">
                月度生产计划进度
            </div>
            <div class="month-table-wrap">
                <table class="month-table">
                    <tbody>
                        <tr v-for="(item, idx) in planList" :key="idx" :class="{ 'loading-row': item.loading }">
                            <td class="plan-label">{{ item.name }}</td>
                            <td>计划数：</td>
                            <td class="plan-value">{{ item.loading ? '加载中...' : item.plan }}</td>
                            <td>完成数：</td>
                            <td class="plan-value">{{ item.loading ? '加载中...' : item.done }}</td>
                            <td>完成率：</td>
                            <td class="plan-value">{{ item.loading ? '加载中...' : item.rate }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </dv-border-box12>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getMonthTotalInfo} from '@/api/getProduceinfo';
import {getMonthProduction } from '@/api/getStampinfo'
import { eventBus } from '@/utils/eventbus';

const planList = ref([
    { name: '一部焊接：', plan: '', done: '', rate: '', loading: false },
    { name: '二部焊接：', plan: '', done: '', rate: '', loading: false },
    { name: '一课总装：', plan: '', done: '', rate: '', loading: false },
    { name: '一课包装：', plan: '', done: '', rate: '', loading: false },
    { name: '二课总装：', plan: '', done: '', rate: '', loading: false },
    { name: '二课包装：', plan: '', done: '', rate: '', loading: false },
]);

const prodLines = {
    '一课包装：': '1005',
    '二课包装：': '2005',
    '二课总装：': '2004',
    '一课总装：': '1004',
    '一部焊接：': '1003',
    '二部焊接：': '2003',
};



const fetchLineData = async (item: any) => {
    const line = prodLines[item.name];
    if (!line) return item;
    
    try {
        if (item.name.includes('焊接')) {
            const res = await getMonthProduction(line);
            return {
                ...item,
                plan: res.data.pcTotal || 0,
                done: res.data.done || 0,
                rate: res.data.rate ? `${res.data.rate.toFixed(1)}%` : '0%',
                loading: false
            };
        } else {
            const res = await getMonthTotalInfo(line);
            return {
                ...item,
                plan: res.data.plan || 0,
                done: res.data.done || 0,
                rate: res.data.done/res.data.plan ? `${(res.data.done/res.data.plan*100).toFixed(1)}`+'%' : '0%',
                loading: false
            };
        }
    } catch (error) {
        console.error(`获取${item.name}数据失败:`, error);
        return {
            ...item,
            loading: false
        };
    }
};

const fetchData = async () => {
    // 为每个产线单独设置加载状态并获取数据
    planList.value.forEach(async (item, index) => {
        // 设置加载状态
        planList.value[index].loading = true;
        
        // 获取数据
        const result = await fetchLineData(item);
        
        // 更新数据
        planList.value[index] = result;
    });
};

onMounted(() => {
    fetchData();
    eventBus.on('refreshData', fetchData);
});

onBeforeUnmount(() => {
    eventBus.off('refreshData', fetchData);
});
</script>

<style scoped>
.month {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.month-title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 95%;
    text-align: center;
    font-size: 1vw;
    font-weight: bold;
    margin: 1vh 0 0.5vh 0;
    color: #fff;
    letter-spacing: 0.3vw;
    text-shadow: 0 0.3vh 1vw #000, 0 0 0.2vw #00bfff;
    border-bottom: 0.3vh solid #00bfff;
    padding-bottom: 0.5vh;
}
.month-table-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
}
.month-table {
    background: rgba(0, 32, 64, 0.55);
    border-radius: 1vw;
    padding: 0.5vh 0.5vw;
    font-size: 1vw;     
    color: #fff;
    min-width: 40vw;
    box-shadow: 0 0.8vh 3vw 0 rgba(0,0,0,0.25);
}
.month-table tr {
    border-bottom: 0.2vh solid rgba(0,191,255,0.18);
    height: 4.5vh;
}
.month-table tr:last-child {
    border-bottom: none;
}
.plan-label {
    font-weight: bold;
    padding-right: 1vw;
    text-align: left;
    white-space: nowrap;
    color: #00eaff;
    font-size: 1.2em;
    text-shadow: 0 0.2vh 1vw #003366;
}
.plan-value {
    min-width: 4vw;
    text-align: left;
    padding-right: 1.5vw;
    color: #fff;
    font-weight: 500;
}
.loading-row {
    opacity: 0.7;
    background: rgba(0, 191, 255, 0.1);
}
.loading-row .plan-value {
    color: #00bfff;
}
</style>