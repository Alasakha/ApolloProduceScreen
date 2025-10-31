<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { getWarningNextDay } from '@/api/getScmInfo.js';
import { getNextDay } from './nextday'
import { eventBus } from '@/utils/eventbus';
import DetailTable from '@/components/WMS/DialogAbnormal/index.vue';

const detailDialogVisible = ref(false);

const tableLoading = ref(false);
const rawData = ref([[], []]);  // 使用一个数组来保存两份数据
const name = ref<any[]>([[], []]);  // 使用二维数组
const config1 = reactive({
  header: ['排产时间', '客户单号','供应商代号','品号','品名','采购员','欠料数量'],
  dataForScrollBoard: [],
  dataForElTable: [],
  index: true,
  align: [],
  carousel: 'page',
  waitTime: 5000,
  headerHeight: 25,
  columnWidth:[],
});


const dialogVisible = ref(false);
const selectedItem = ref<any>({});
//   const detailHeaders = [
//   '排产时间',
//   '客户单号',
//   '供应商代号',
//   '品号',
//   '品名',
//   '采购员',
//   '欠料数量',
// ];


// 获取数据并转换
const fetchData = () => {
  getWarningNextDay()
    .then((res) => {
      rawData.value[0] = res.data.zzyk || [];
      rawData.value[1] = res.data.zzek || [];

      const nextday = getNextDay();
      name.value[0] = rawData.value[0].map((item: any) => [
        nextday,
        item.customerOrderNo,
        item.supplierCode,
        item.itemNo,
        item.itemName,
        item.purchaserName,
        Math.round(Number(item.purchaseQuantity))
      ]);

      if (name.value[0].length === 0) {
        config1.dataForScrollBoard = [
          {
            排产时间: '暂无数据',
            客户单号: '暂无数据',
            供应商代号: '暂无数据',
            品号: '暂无数据',
            品名: '暂无数据',
            采购员: '暂无数据',
            欠料数量: '暂无数据'
          }
        ];
      } else {
        config1.dataForScrollBoard = name.value[0];
config1.dataForElTable = name.value[0].map((row) => {
  const obj: any = {};
  config1.header.forEach((key, index) => {
    obj[key] = row[index];
  });
  return obj;
});
      }
    })
    .catch(() => {
      console.log('数据获取失败');
    });
};


onMounted(() => {
  eventBus.on('refreshData', fetchData);
  fetchData();
});

onBeforeUnmount(() => {
  // 移除全局事件监听
  eventBus.off('refreshData', fetchData);
});

const openDialog = () => {
  tableLoading.value = true;
  fetchData();
  detailDialogVisible.value = true;
  tableLoading.value = false;
};

const clickHandler = (row: any) => {
  selectedItem.value = row.row; // 直接保存整行
  dialogVisible.value = true;
};
</script>

<template>
  <div class="qianliao h-[25vh] w-[66%] ml-auto">
    <dv-border-box12>
      <div class="w-full h-full flex gap-3">
        <!-- 左侧：新加三个图表（柱状图） -->
        <!-- <div class="flex-1 h-full">
          <NewChartsPage class="w-full h-full" />
        </div> -->

        <!-- 右侧：次日生产欠料预警 -->
        <div class="w-[100%] h-full">
          <!-- 标题行 -->
          <div class="flex justify-around items-center">
            <h2 class="text-white font-bold text-xl pt-4 flex justify-center items-center">次日生产欠料预警</h2>
            <el-button type="primary" class="mt-4 absolute right-4" @click="openDialog">查看详细</el-button>
          </div>
          <div class='w-full'>
            <ScrollBoard
              class="pl-4 pr-4 pt-2"
              :config="{ ...config1, data: config1.dataForScrollBoard }"
              style="width:100%;height:16vh"
              @click="clickHandler"
            />
          </div>

          <!-- 使用封装的详情表格组件 -->
          <DetailTable
            v-model="detailDialogVisible"
            title="工单异常详情"
            :headers="config1.header"
            :data="config1.dataForElTable"
            :loading="tableLoading"
          />
        </div>
      </div>
    </dv-border-box12>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>