<template>
  <div class='pl-5 pt-1'>
    <div class='flex justify-center items-center text-lg text-cyan-300 '>
      <p class="tracking-widest" >原材料监控</p>
    </div>
    
    <dv-scroll-board :config="config" style="width:45vw;height:19vh;"/>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted,onBeforeUnmount } from 'vue'
import { getrawMaterialMonitoring } from '@/api/getInjection'
import { eventBus } from '@/utils/eventbus';
// 初始化配置对象
const config = reactive({
  header: ['机台号','计划产出数','计划用量','实际产出数','需领用量', '已领用量','未领用量'], // 表头
  data: [], // 数据
  index: true,
  align: ['center','center','center','center','center','center','center','center'],
  rowNum: 5,
  columnWidth: [50, 150, 100, 100,100,100,100,100],
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
  item.ty009, // 假设这个字段无须处理
    item.planOutput,
  parseFloat(item.expectedUsage).toFixed(0), // 确保是数字并去掉小数点
  item.actualOutput,
  parseFloat(item.requiredUsage).toFixed(0) ,
  parseFloat(item.receivedUsage).toFixed(0), // 去掉小数点
  parseFloat(item.unclaimedUsage).toFixed(0) // 去掉小数点
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
:deep(.dv-scroll-board .header) {
  display: flex;
  flex-direction: row;
  font-size: 0.8vw;

}

:deep(.dv-scroll-board .rows .row-item){
  font-size: 0.7vw;
}

</style>