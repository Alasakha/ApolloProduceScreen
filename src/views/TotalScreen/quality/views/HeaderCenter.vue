<template>
  <div class="container">
    <div class="title title-main">{{handleTitle(prodLine)}}质量管理看板</div>
    <div class="title">合格率目标：{{ cumulativePassRate.target }}</div>
    <div class="title">本月累计合格率：{{ cumulativePassRate.passPercent }}%</div>
  </div>
</template>

<script setup>  
import { ref, onMounted ,onBeforeUnmount} from 'vue';
import { getcumulativePassRate } from '@/api/getQuiltyinfo';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';

const route = useRoute();
const prodLine = route.query.prodLine; // 通过 query 获取参数

const cumulativePassRate = ref({})

const fetchData = () => {
  getcumulativePassRate(prodLine).then(res => {
    console.log(res.data);
    const data = res.data || {}; // 确保 data 不为 undefined
    cumulativePassRate.value = {
      passTotal: data.passTotal || 0,
      passPercent: data.passPercent ? parseFloat(data.passPercent).toFixed(1) : '0.0', // 保留一位小数
      target: data.target || 0,
    };
  });
  console.log(cumulativePassRate.value);
};

const handleTitle = (prodLine) => {
  if (/^1/.test(prodLine)) {
    return '一课'
  } else if (/^2/.test(prodLine)) {
    return '二课'
  } else {
    return null
  }
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
.container {
  display: flex;
  flex-direction: column; /* 纵向排列 */  
  align-items: center; /* 默认左对齐，你也可以选择 center 来居中对齐 */
  justify-content: start; /* 垂直居中 */
  width: 80%;
}

.title {
  font-size: 1.5vw;
  color: white;
}

.title-main {
  font-size: 2vw; /* 设置标题行的字体更大 */
  font-weight: bold; /* 设置标题为加粗 */
  letter-spacing: 0.5vw ; /* 增加字间距 */
}
</style>