<template>
    <div class="accounting">
        <dv-border-box10>
            <div class="bc h-[35vh] flex flex-col">
                <div class="text-center text-2xl font-bold text-white">呆滞金额</div>
                <div class="flex-1 table-area">
                    <ScrollBoard v-if="!isLoading" :config="config" class="w-full  pt-0 " />
                    <div v-else class="loading">正在加载......</div>
                </div>
            </div>
        </dv-border-box10>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import {getstagnantAmount} from  '@/api/getWMSinfo'
import { eventBus } from '@/utils/eventbus';

const isLoading = ref(true);
const rawData = ref([]);
const config = reactive({
  header: ['仓位', '呆滞金额'],
  data: [],
  index: true,
  columnWidth: [],
  align: [],
  rowNum: 7,
  headerHeight: 35,
  headerBGC: '#0d47a1',
  oddRowBGC: '#1565c0',
  evenRowBGC: '#1976d2',
  waitTime: 3000,
  carousel: 'single'
});

const fetchData = async () => {
  try {
    isLoading.value = true;
    const res = await getstagnantAmount();
    const transformed = Object.entries(res.data as Record<string, string | number>).map(([key, value]) => [
      key,
      parseFloat(value.toString()).toFixed(2),
    ]);
    rawData.value = transformed;
    config.data = transformed;
    isLoading.value = false;
  } catch (e) {
    console.log('数据获取失败');
    isLoading.value = false;
  }
};

onMounted(() => {
  eventBus.on('refreshData', fetchData);
  fetchData();
});

onBeforeUnmount(() => {
  eventBus.off('refreshData', fetchData);
});
</script>

<style scoped>
.accounting {
    padding-top: 0.5vw;
      padding-bottom: 0.5vw;
    font-family: Arial, sans-serif;
}
</style>

<style scoped>
.accounting {
padding-top: 0.5vw;
padding-bottom: 0.5vw;
font-family: Arial, sans-serif;
}
.table-area {
min-height: 0;
overflow: hidden;
position: relative;
height: 100%;
display: flex;
}
:deep(.ScrollBoard) {
height: 100% !important;
width: 100% !important;
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