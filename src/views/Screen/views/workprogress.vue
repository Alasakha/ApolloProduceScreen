<template>
  <!-- 小图表的外边框组件 -->
  <dv-border-box-10 class="box1">
    <div class="workprogress">
    <div class="ranking-title">今日工单完成进度</div>
    <dv-scroll-ranking-board :config="config"
    :style="{ width: '80%' }"
     height="25vh" />
  </div>
  </dv-border-box-10>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, reactive, nextTick } from 'vue';
import { getTodayOrderProgressInfo } from '../../../api/getProduceinfo';
import { useRoute } from 'vue-router';
import { eventBus } from '../../../utils/eventbus';


const route = useRoute();
const prodLine = route.query.prodLine;

const isLoading = ref(true);
const isDataEmpty = ref(false);
const config = reactive({
  data:[],
  unit: '%',
  carousel:"page",
  waitTime:4000,
  color:"#009966"
})

let chartInstance = null;

// 处理数据
const processData = (data) => {
  if (!data || data.length === 0) {
    isDataEmpty.value = true;
    return;
  }

  isDataEmpty.value = false;
// 反转数据顺序
const reversedData = [...data].reverse();  // 使用复制后反转数据

// 格式化数据
const chartData = reversedData.map(item => ({
  name: item.gd,      // 工单号
  value: item.doneRate // 进度
}));

config.data = chartData;
};



// 请求数据
const fetchData = () => {
  getTodayOrderProgressInfo(prodLine)
    .then(res => {
      isLoading.value = false;
      processData(res.data);
    })
    .catch(() => {
      isLoading.value = false;
      isDataEmpty.value = true;
    });
};

onMounted(() => {
  fetchData();
  eventBus.on("refreshData", fetchData);
  window.addEventListener("resize", () => chartInstance?.resize());
});

onBeforeUnmount(() => {
  eventBus.off("refreshData", fetchData);
  window.removeEventListener("resize", () => chartInstance?.resize());
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<style scoped>
.box1 {
  width: 100% !important;
  padding: 0; /* 确保内部没有额外的 padding */
}

.workprogress {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ranking-title{
  color: aliceblue;
  font-size: 1.3vw;
  margin-top: 1vh;
}
:deep(.inside-column) {
  height: 1.5vh !important; /* 这里改成你想要的宽度 */
}
</style>
