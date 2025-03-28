<template>
  <div class='pl-5 pt-1'>
    <div class='flex justify-center items-center text-lg text-cyan-300 '>
      <p>异常看板</p>
    </div>
    
    <dv-scroll-board :config="config" style="width:45vw;height:19vh;"/>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { getabnormalInfo } from '@/api/getInjection'

// 初始化配置对象
const config = reactive({
  header: ['型号', '责任人', '当前状态'], // 表头
  data: [], // 数据
  index: true,
  align: ['start'],
  rowNum: 4,
  columnWidth: [50, 140, 140, 100],
  headerHeight: 20
})

// 获取数据
const fetchData = async () => {
  try {
    const res = await getabnormalInfo(); // 获取接口数据
    // 假设返回的数据格式是数组，每个元素包含 { macNo, isFinish, guZhangTypeName, dutyDeptName }
    if (res && res.data) {
      // 转换数据格式以适应表格
      config.data = res.data.map(item => [
        item.macNo, // 型号
        item.dutyDeptName, // 责任人
        item.isFinish === 'Y' ? '已结束' : item.isFinish === 'X' ? '已响应' : '未响应', // 当前状态
      ]);
    }
  } catch (error) {
    console.error('数据获取失败:', error);
  }
}

// 在组件挂载时获取数据
onMounted(() => {
  fetchData();
});
</script>