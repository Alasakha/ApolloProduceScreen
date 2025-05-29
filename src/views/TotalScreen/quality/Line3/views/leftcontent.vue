<template>
<dv-border-box10>
    <div class="content w-full h-full">
      <div class="h-[15%]">
            <GlobalTitle title="检验不及时处理进度"/>
      </div>

      <div class="flex justify-center items-center h-[80%]">
         <ScrollBoard :config="config" class="w-full h-[10%] pl-4 pr-6 pt-2"/>
      </div>
   
</div>
    
</dv-border-box10>

</template>


<script lang="ts" setup>
import { reactive, onMounted,onBeforeUnmount } from 'vue'
import { getIncomingInspection2 } from '@/api/getQuiltyinfo'
import { eventBus } from '@/utils/eventbus';
// 初始化 配置对象
const config = reactive({
  header: ['到货单号','供应商','品号', '品名','到货时间', '规格','检验人员','审核时间','到货数'], // 表头
  data: ['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据'], // 数据
  index: true,
  align: ['center','center','center','center','center','center','center','center','center','center','center'],
  rowNum: 6,
  // columnWidth: [50, 100, 100, 100,120,120,100,80,120,100],
  columnWidth:[50],
  headerHeight: 20
})

// 获取数据
const fetchData = async () => {
  try {
    const res = await getIncomingInspection2(); // 获取接口数据
    // 假设返回的数据格式是数组，每个元素包含 { macNo, isFinish, guZhangTypeName, dutyDeptName }
    if (res && res.data) {
      // 转换数据格式以适应表格
      config.data = res.data.map(item => [  
        item.doc_no || '暂无数据',
        item.supplier_full_name || '暂无数据', // 不良原因
        item.item_code || '暂无数据',
        item.itemDescription || '暂无数据',
        item.arrivalTime ? item.arrivalTime.slice(5,16) : '暂无数据', // 时间
        item.item_specification || '暂无数据',
        item.user_name || '暂无数据',
        item.checkTime ? item.checkTime.slice(5,16) : '暂无数据',
        item.arriveNum -item.jsNum

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