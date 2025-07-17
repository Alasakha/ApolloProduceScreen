<template>
    <div class="bottom">
        <dv-border-box12>  
            <div class="title">呆滞物料处理</div>
            <div class="flex-1 table-area">
                    <ScrollBoard v-if="!isLoading" :config="config" class="w-full  pt-0 " />
                    <div v-else class="loading">正在加载......</div>
                </div>
        </dv-border-box12>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import {getStagnantAmount} from  '@/api/getPmcinfo'
import { eventBus } from '@/utils/eventbus';

const isLoading = ref(true);
const rawData = ref([]);
const config = reactive({
  header: ['仓库名称', '呆滞金额', '计划金额', '实际金额','达成率'],
  data: [],
  index: true,
  columnWidth: [50],
  align: ['center', 'center', 'center', 'center', 'center'],
  rowNum: 7,
  headerHeight: 35,
  headerFontSize: 14,
  headerBGC: '#0d47a1',
  oddRowBGC: '#1565c0',
  evenRowBGC: '#1976d2',
  waitTime: 3000,
  carousel: 'single',
  showTooltip: true
});

const fetchData = async () => {
  try {
    isLoading.value = true;
    const res = await getStagnantAmount(1);
    console.log(res)
    if (res.data && Array.isArray(res.data)) {
      const transformed = res.data.map(item => [
        item.warehouse_name +'-' + item.warehouseKeeper || '暂无数据',
        item.amt ? Math.round(Number(item.amt)) : '暂无数据',
        item.planAmt ? Math.round(Number(item.planAmt)) : '暂无数据',
        item.actualAmt ? Math.round(Number(item.actualAmt)) : '暂无数据',
        item.planAmt && item.actualAmt ? Math.round((item.actualAmt / item.planAmt) * 100) + '%' : '暂无数据'
      ]);
      rawData.value = transformed;
      config.data = transformed.length > 0 ? transformed : [['暂无数据', '暂无数据', '暂无数据', '暂无数据','暂无数据']];
    } else {
      config.data = [['暂无数据', '暂无数据', '暂无数据', '暂无数据','暂无数据']];
    }
    isLoading.value = false;
  } catch (e) {
    console.log('数据获取失败');
    config.data = [['暂无数据', '暂无数据', '暂无数据', '暂无数据','暂无数据']];
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

::v-deep .ScrollBoard .header {
  font-size: 0.5vw !important;

}
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  font-size: 1vw;
  font-weight: bold;
  color: #fff;
  letter-spacing: 0.3vw;
  text-shadow: 0 0.3vh 1vw #000, 0 0 0.2vw #00bfff;
  border-bottom: 0.3vh solid #00bfff;
  margin-bottom: 1vh;
}
</style>