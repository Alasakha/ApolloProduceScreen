<template>
  <div class="container">
    <div class="title title-main">生产计划管理看板</div>
    <div class="title">
      本月生产计划总数：
      <span :style="{ color: '#00FFFF' }">{{ MonthlyData.plan }}</span>
    </div>
  </div>  
</template>

<script setup>
import { ref ,onMounted,onBeforeUnmount} from 'vue';
import { useRoute } from 'vue-router';
import { getMonthTotalInfo } from '@/api/getProduceinfo';
import { eventBus } from '@/utils/eventbus';

const route = useRoute();
const prodLine = route.query.prodLine; // 通过 query 获取参数 
const MonthlyData = ref({});  // 确保它是一个对象



const fetchData = () => {
  getMonthTotalInfo(prodLine).then(res => {
    MonthlyData.value = res.data
  })
}
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
.container {
  display: flex;
  flex-direction: column; /* 纵向排列 */
  align-items: center; /* 默认左对齐，你也可以选择 center 来居中对齐 */
  justify-content: center; /* 垂直居中 */
}

.title {
  font-size: 1.5vw;
  color: white;
  z-index: 1000;
}

.title-main {
  font-size:2vw; /* 设置标题行的字体更大 */
  font-weight: bold; /* 设置标题为加粗 */
  letter-spacing: 0.5vw; /* 增加字间距 */

}
</style>