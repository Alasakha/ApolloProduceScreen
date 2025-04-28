<template>
  <div class="box1">
    <h1>其他问题</h1>
    <dv-scroll-ranking-board :config="otherconfig" style="width:90%;height:100%" />
  </div>
  </template>
  
  <script setup>
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue';
import { getResponsityRank } from '@/api/getQuiltyinfo';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
import { formatPieChartData } from '@/utils/map';

const route = useRoute();
const prodLine = route.query.prodLine;
// Loading 和 数据为空的状态
const isLoading = ref(true);
const isDataEmpty = ref(false);
const otherreasonType = 2
const otherconfig = reactive({
    waitTime:5000,
    fontSize:15,
    data: [],
    unit: '个',
  })

  const processData = (data, targetConfig) => {
  const formattedData = formatPieChartData(data, 'ngName', 'total');

  if (formattedData.length === 0) {
    isDataEmpty.value = true;  // 没数据，置空
  } else {
    isDataEmpty.value = false;
    targetConfig.data = formattedData;  // 这里赋值给指定的 config
  }
};


const fetchotherData = () => {
  getResponsityRank(prodLine, otherreasonType).then(res => {
    console.log('责任性问题数据', res.data);
    isLoading.value = false;
    processData(res.data, otherconfig); // 传入 otherconfig
  }).catch(() => {
    isLoading.value = false;
    isDataEmpty.value = true;
  });
};
  onMounted(() => {
    fetchotherData()
    eventBus.on("refreshData", fetchotherData); // 监听全局刷新事件
    });

 // 清理定时器，避免组件卸载后定时器继续执行
 onBeforeUnmount(() => {
    eventBus.off("refreshData", fetchotherData); // 组件销毁时取消监听
  });
  

  </script>
  
  
  <style scoped>
  .box1{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: start;
    color:aliceblue;

  }
  h1{
    font-size: 1vw;
    color:aliceblue;
    font-weight: bold;
  }
  :deep(.inside-column) {
  height: 0.8vh !important; /* 这里改成你想要的宽度 */
}
</style>