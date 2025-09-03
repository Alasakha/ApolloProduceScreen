<template>
    <div class="flex">
        <LeftContent class="flex-2" ref="leftContentRef"/>
        <RightContent class="flex-1" :tableData="tableData"/>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue';
import LeftContent from './leftcontent.vue';
import RightContent from './rightcontent.vue';

const leftContentRef = ref();
const tableData = ref({
    months: {},
    total: {},
    stage: {}
});

// 获取数据的方法
const getData = async () => {
    try {
        // 等待leftContent组件挂载完成并获取数据
        if (leftContentRef.value) {
            await leftContentRef.value.getFinanceIncomeData();
            // 从leftContent组件获取实际数据
            tableData.value = leftContentRef.value.tableData;
        }
    } catch (error) {
        console.error('获取数据失败:', error);
    }
};

onMounted(async () => {
    // 等待组件完全挂载后再获取数据
    await nextTick();
    await getData();
});
</script>