<template>
  <div class="grid gap-4 h-full w-full overflow-auto flex justify-center items-center">
<custom-table :tableData="tableDataC02" :tableTitle="titleC02" :productLabel="productLabelC02" />
<custom-table :tableData="tableDataC01" :tableTitle="titleC01" :productLabel="productLabelC01"/>
<custom-table :tableData="tableDataC04" :tableTitle="titleC04" :productLabel="productLabelC04"/>
<custom-table :tableData="tableDataC03" :tableTitle="titleC03" :productLabel="productLabelC03"/> 
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

const titleC02 = ref('A机台');
const titleC01 = ref('B机台');
const titleC03 = ref('C机台');
const titleC04 = ref('D机台');

const productLabelC01 = ref('加工品号'); // 默认值
const productLabelC02 = ref('加工品号'); // 默认值
const productLabelC03 = ref('加工品号'); // 默认值
const productLabelC04 = ref('加工品号'); // 默认值
// 格式化数据函数

const formatData = (deviceData) => {
  const formatValue = (value) => {
    if (value === null || value === undefined) return '暂无数据';
    const num = parseFloat(value);
    return num % 1 === 0 ? num.toFixed(0) : num.toFixed(1); // 判断是否有小数部分
  };

  return [
    { name: '温度', real: formatValue(deviceData.et1)  },
    { name: '压力', real: formatValue(deviceData.esipp) },
    { name: '最大射速', real: formatValue(deviceData.eivm) },
    { name: '保压时间', real: formatValue(deviceData.esipt) },
 
  ];
};

// 获取并处理数据
const fetchData = async () => {
  try {
    const res = await getInvokeDeviceList();

    const { data } = res;
    console.log('获取到的数据:', data);
    // 将数据格式化并赋值给对应的表格数据
    tableDataC02.value = formatData(data.c02);
    tableDataC01.value = formatData(data.c01);
    tableDataC04.value = formatData(data.c04);
    tableDataC03.value = formatData(data.c03);

    titleC02.value = data.c02.deviceCode || 'C02机台';
    titleC01.value = data.c01.deviceCode || 'C01机台';
    titleC04.value = data.c04.deviceCode || 'C04机台';
    titleC03.value = data.c03.deviceCode || 'C03机台';

    productLabelC02.value = data.c02.ta006 || '加工品号';
    productLabelC03.value = data.c03.ta006 || '加工品号';
    productLabelC04.value = data.c04.ta006 || '加工品号';
    productLabelC01.value = data.c01.ta006 || '加工品号';

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
