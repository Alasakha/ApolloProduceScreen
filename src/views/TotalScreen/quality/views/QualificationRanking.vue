<template>
  <dv-border-box10 class="ranking-box" title="合格率排行榜">
    <div class="ranking-content">
      <div class="ranking-title">产品合格率排行榜</div>
      <dv-scroll-ranking-board :config="config"  width="40vw" height="25vh"/>
    </div>
  </dv-border-box10>
</template>

<script setup>
import { getProductPassRateRank } from '@/api/getQuiltyinfo';
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { formatPieChartData } from '@/utils/map';
import { eventBus } from '@/utils/eventBus'; 

const route = useRoute();
const prodLine = route.query.prodLine;
const isLoading = ref(true);
const isDataEmpty = ref(false);
const config = reactive({
  data:[],
  unit: '%',
})

const processData = (data) => {
  const formattedData = formatPieChartData(data, 'mb002', 'rate');

  if (formattedData.length === 0) {
    isDataEmpty.value = true; // 如果没有数据，设置为空数据状态
  } else {
    isDataEmpty.value = false;
    config.data = formattedData;
  }
};

const fetchData = () => {
  getProductPassRateRank(prodLine)
    .then(res => {
      isLoading.value = false; // 加载完成，关闭 loading 状态
      processData(res.data.ranking); // 处理数据
    })
    .catch(() => {
      isLoading.value = false;
      isDataEmpty.value = true; // 如果请求失败，设置为空数据状态
    });
};

// 在组件挂载时启动定时获取数据
onMounted(() => {
  fetchData(); // 组件挂载时先请求一次
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});


  // 清理定时器，避免组件卸载后定时器继续执行
  onBeforeUnmount(() => {
    eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
  });

</script>



<style scoped>  
.ranking-box {
  width: 96%;
  height: 100% ;
  display: flex;
}

.ranking-content{
  width: 90%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5%;
  flex-direction: column;
}
.ranking-title{
  color: aliceblue;
  margin-top: 10px;
  font-size: 25px;
  font-weight: bold;
}
:deep(.inside-column) {
  height: 2vh !important; /* 这里改成你想要的宽度 */
}
</style>