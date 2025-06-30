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
        <div dv-bg class="flex justify-around h-full">
          <div class="flex flex-col items-center w-full pl-10 pr-10 h-full">
            <h1 class="text-white font-bold text-2xl  mt-1">月度优秀供应商</h1>
            <!-- <dv-scroll-ranking-board :config="config1" style="width:100%;height:17vh" /> -->
             <div class="flex flex-around items-center w-full h-full pb-4">


      <div class="w-full h-full flex justify-center items-center">
        <div class="flex-1 flex justify-center items-center text-white font-bold text-2xl w-[60%] h-[60%]">
    <img src="@/assets/银牌.svg" alt="Example Icon" class="w-20 h-20  " />
    {{ config1.data[1]?.name || '暂无数据' }}
  </div>
  <!-- <div class="flex-2 flex justify-start items-center text-white font-bold text-2xl">
    
  </div> -->
</div>
<div class="w-full h-full flex justify-center items-center">
<div class="flex-1 flex justify-center items-center text-white font-bold text-4xl ">
    <img src="@/assets/金牌.svg" alt="Example Icon" class="w-35 h-35  " />
    {{ config1.data[0]?.name || '暂无数据' }}
  </div>
</div>

<div class="w-full h-full flex justify-center items-center">
  <div class="flex-1 flex justify-center items-center text-white font-bold text-2xl w-[60%] h-[60%]">
    <img src="@/assets/铜牌.svg" alt="Example Icon" class="w-20 h-20  " />
    {{ config1.data[2]?.name || '暂无数据' }}
  </div>
</div>

             </div>
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