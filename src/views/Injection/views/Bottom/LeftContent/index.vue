<template>
  <div class='pl-5 pt-1'>
<div class="flex justify-center items-center text-lg text-white font-bold">
  <p class="tracking-widest text-xl ">原材料监控</p>
</div>
    
    <ScrollBoard :config="config" style="width:47vw;height:19vh;"/>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted,onBeforeUnmount } from 'vue'
import { getrawMaterialMonitoring } from '@/api/getInjection'
import { eventBus } from '@/utils/eventbus';
// 初始化配置对象
const config = reactive({
  header: ['机台号','计划成品产出数','计划原材料用量','计划原材料损耗', '实际产出数','实际原材料用量/kg','实际损耗量','原材料使用率'], // 表头
  data: [], // 数据
  index: true,
  align: ['center','center','center','center','center','center','center','center'],
  rowNum: 5,
  columnWidth: [50],
  headerHeight: 20
})

// 获取数据
const fetchData = async () => {
  try {
    const res = await getrawMaterialMonitoring(); // 获取接口数据
    // 假设返回的数据格式是数组，每个元素包含 { macNo, isFinish, guZhangTypeName, dutyDeptName }
    if (res && res.data) {
      // 转换数据格式以适应表格
    config.data = res.data.map(item => [
    item.ty009, // 机台号
    item.planOutput,
    Math.round(item.expectedUsage)+'kg',
    Math.round(item.planLoss)+'kg', 
    item.actualOutput,
    Math.round(item.actualOutput2)+'kg',
    Math.round(item.actualLoss)+'kg',
    item.useRate+'%'
]);
    }
  } catch (error) {
    console.error('数据获取失败:', error);
  }
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
:deep(.ScrollBoard .header) {
  display: flex;
  flex-direction: row;
  font-size: 0.6vw;
}

:deep(.ScrollBoard .rows .row-item){
  font-size: 0.5vw;
}

</style>