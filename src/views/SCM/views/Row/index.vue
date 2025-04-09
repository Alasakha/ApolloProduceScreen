<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { getTop3SupplierLastMonth } from '@/api/getScminfo';
import { eventBus } from '@/utils/eventbus';

const DataValue = ref([]);

const config1 = reactive({
  data: [],
  unit: '%',
});


// 映射成 value 和 name 的格式
const mapData = (data) => {
  return data.map((item) => ({
    name: item.supplierName,
    value: parseFloat(item.ratio).toFixed(1),
  }));
};

// 获取数据
const getData = () => {
  getTop3SupplierLastMonth()
    .then((res) => {
      // 获取数据
      DataValue.value = res.data;
      // 映射数据并取前3个
      config1.data = mapData(DataValue.value).slice(0, 3);
    })
    .catch(() => {
      console.log('数据获取失败');
    });
};

// 图表自适应
const resizeChart = () => {
  // 如果有其他图表实例，可以在这里调用它们的 resize 方法
  console.log('窗口大小变化，图表需要调整大小');
};

onMounted(() => {
  eventBus.on('refreshData', getData); // 监听全局刷新事件
  getData();

  // 添加窗口大小变化监听器
  window.addEventListener('resize', resizeChart);
});

onBeforeUnmount(() => {
  // 移除全局事件监听
  eventBus.off('refreshData', getData);

  // 移除窗口大小变化监听器
  window.removeEventListener('resize', resizeChart);
});
</script>

<template>
  <div class="Row h-[15vh] flex justify-center items-center">
    <div class="w-[80%] h-full pb-2">
      <dv-border-box8 :dur="5">
        <div dv-bg class="flex justify-around">
          <div class="flex flex-col items-center w-full pl-10 pr-10">
            <h1 class="text-white font-bold text-2xl  mt-1">月度优秀供应商</h1>
            <dv-scroll-ranking-board :config="config1" style="width:100%;height:17vh" />
          </div>



        </div>
      </dv-border-box8>
    </div>
  </div>
</template>

<style scoped>
.index {
  text-align: center;
  font-family: Arial, sans-serif;
  padding: 20px;
}
button {
  margin-top: 10px;
  padding: 5px 10px;
  font-size: 16px;
}
</style>