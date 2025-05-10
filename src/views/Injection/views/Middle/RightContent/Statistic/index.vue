<template>
  <div class="grid gap-4 h-full w-full overflow-auto flex justify-center items-center">
    <custom-table :tableData="tableDataC02" />
    <custom-table :tableData="tableDataC01" />
    <custom-table :tableData="tableDataC04" />
    <custom-table :tableData="tableDataC03" />
  </div>
</template>

<script setup>
import CustomTable from '@/components/injection/Table.vue';
import { ref, onMounted } from 'vue';
import { getInvokeDeviceList } from '@/api/getInjection';

// 初始化表格数据
const tableDataC02 = ref([]);
const tableDataC01 = ref([]);
const tableDataC04 = ref([]);
const tableDataC03 = ref([]);

// 格式化数据函数
// 格式化数据函数
const formatData = (deviceData) => {
  const formatValue = (value) => {
    if (value === null || value === undefined) return '暂无数据';
    const num = parseFloat(value);
    return num % 1 === 0 ? num.toFixed(0) : num.toFixed(1); // 判断是否有小数部分
  };

  return [
    { name: '温度', real: formatValue(deviceData.et1) },
    { name: '压力', real: formatValue(deviceData.esipp) },
    { name: '最大射速', real: formatValue(deviceData.eivm) },
    { name: '保压时间', real: formatValue(deviceData.esipt) },
  ];
};


// 获取并处理数据
const fetchData = async () => {
  try {
    const res = await getInvokeDeviceList();
    console.log('获取到的数据:', res);
    const { data } = res;

    // 将数据格式化并赋值给对应的表格数据
    tableDataC02.value = formatData(data.c02);
    tableDataC01.value = formatData(data.c01);
    tableDataC04.value = formatData(data.c04);
    tableDataC03.value = formatData(data.c03);
  } catch (error) {
    console.error('数据获取失败', error);
  }
};

// 页面加载时获取数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.grid {
  display: grid;
  gap: 1vw;  
  grid-template-columns: 1fr; /* 默认为单列 */
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* 屏幕宽度大于 768px 时使用两列 */
  }
}
</style>
