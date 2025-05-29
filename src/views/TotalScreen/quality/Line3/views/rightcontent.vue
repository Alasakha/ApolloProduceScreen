<template>
<dv-border-box10>
  <div class="content w-full h-full">
      <div class="h-[15%]">
        <GlobalTitle title="错漏检累计次数"/>
      </div>
         
      

      <div class="flex justify-center items-center h-[80%]">
         <ScrollBoard :config="config" class="w-full h-[10%] pl-4 pr-6 pt-2"/>
      </div>
</div>
   
</dv-border-box10>

</template>


<script lang="ts" setup>
import { reactive, onMounted,onBeforeUnmount } from 'vue'
import { getMistakesAndOmissions } from '@/api/getQuiltyinfo'
import { eventBus } from '@/utils/eventbus';
  import { useRoute } from 'vue-router'

        const route = useRoute()
        const prodLine = route.query.prodLine as string || ''
// 初始化 配置对象
const config = reactive({
  header: ['车间','故障时间','故障原因', '原因分析','责任单位', '错漏检责任人',], // 表头
  data: ['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据'], // 数据
  index: true,
  align: ['center','center','center','center','center','center','center','center'],
  rowNum: 6,
  columnWidth: [50],
  headerHeight: 20
})

// 获取数据
const fetchData = async () => {
  try {
    const res = await getMistakesAndOmissions(prodLine); // 获取接口数据
    // 假设返回的数据格式是数组，每个元素包含 { macNo, isFinish, guZhangTypeName, dutyDeptName }
    if (res && res.data) {
      // 转换数据格式以适应表格
      config.data = res.data.map(item => [
        item.macNo,
        item.startTime, // 不良原因
        item.guZhangTypeName,
        item.startRemark,
        item.dutyDeptName, // 时间
        item.udf03, // 责任人

        
      ]);
    }else {
      config.data = ['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据'];
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
  });// 在组件挂载时获取数据
onMounted(() => {
  fetchData();
});
</script>