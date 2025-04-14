<template>
  <div class='pl-5 pt-1'>
    <div class='flex justify-center items-center text-lg text-cyan-300 '>
      <p class="tracking-widest" >保养看板</p>
    </div>
    
    <dv-scroll-board :config="config" style="width:45vw;height:19vh;"/>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted,onBeforeUnmount } from 'vue'
import { getMaintanceInfo } from '@/api/getInjection'
import { eventBus } from '@/utils/eventbus';
// 初始化配置对象
const config = reactive({
  header: ['机器编号', '机器名称', '状态','责任人','点检时间','二级保养时间','三级保养时间'], // 表头
  data: [], // 数据
  index: true,
  align: ['center'],
  rowNum: 4,
  columnWidth: [50, 150, 150, 100,70,150,110],
  headerHeight: 20
})

// 获取数据
const fetchData = async () => {
  try {
    const res = await getMaintanceInfo(); // 获取接口数据
    // 假设返回的数据格式是数组，每个元素包含 { macNo, isFinish, guZhangTypeName, dutyDeptName }
    if (res && res.data) {
      // 转换数据格式以适应表格
      config.data = res.data.map(item => [
        item.te011, // 型号
        item.te012, // 责任人
        item.te019 === '0' ? '未保养' : item.te019 === '1' ? '已点检' : '未知', // 当前状态（添加默认值）
        item.employee_name ,// 添加逗号
        item.modi_DATE.slice(0,16), // 点检时间
        item.lvTwoLastMaintenanceDay,
        item.lvThreeLastMaintenanceDay,
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