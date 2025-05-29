<template>
  <div class='pl-5 pt-1'>
<div class="flex justify-center items-center text-lg text-white font-bold">
  <p class="tracking-widest text-xl">历史不良信息看板</p>
</div>
    
    <ScrollBoard :config="config" style="width:97%;height:19vh;" />
  </div> 
</template>
<script lang="ts" setup>
import { reactive, onMounted,onBeforeUnmount } from 'vue'
import { getabnormalInfo } from '@/api/getInjection'
import { eventBus } from '@/utils/eventbus';

// 初始化 配置对象
const config = reactive({
  header: ['工单单号','不良原因','责任部门', '责任人','时间', '品名','品号','规格'],
  data: [['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据']],
  index: true,
  align: ['center','center','center','center','center','center','center','center'],
  rowNum: 5,
  columnWidth: [],
  headerHeight: 20,
  showTooltip: true
})

// 获取数据
const fetchData = async () => {
  try {
    const res = await getabnormalInfo(); // 获取接口数据
    if (res && res.data && res.data.length > 0) {
      // 转换数据格式以适应表格
      config.data = res.data.map(item => [
        item.ta002 || '暂无数据',
        item.ngName || '暂无数据',
        item.admin_UNIT_NAME || '暂无数据',
        item.ngResponPeople || '暂无数据',
        item.createDate ? item.createDate.slice(0,16) : '暂无数据',
        item.mb002 || '暂无数据',
        item.ta006 || '暂无数据',
        item.mb003 || '暂无数据'
      ]);
    } else {
      config.data = [['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据']];
    }
  } catch (error) {
    console.error('数据获取失败:', error);
    config.data = [['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据']];
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

<style scoped>
:deep(.ScrollBoard .header) {
  background: rgba(79,142,247,0.3);
  font-size: 0.6vw;
}

:deep(.ScrollBoard .rows .row-item){
  font-size: 0.6vw;
}

</style>