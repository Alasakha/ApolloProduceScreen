<template>
  <div class="flex-container">
    <custom-table :tableData="tableDataC02" :tableTitle="titleC02" :productLabel="productLabelC02" />
    <custom-table :tableData="tableDataC01" :tableTitle="titleC01" :productLabel="productLabelC01"/>
    <custom-table :tableData="tableDataC04" :tableTitle="titleC04" :productLabel="productLabelC04"/>
    <custom-table :tableData="tableDataC03" :tableTitle="titleC03" :productLabel="productLabelC03"/> 
  </div>
</template>

<script setup>
import CustomTable from '@/components/injection/NativeTable.vue';
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

const productLabelC01 = ref('加工品号');
const productLabelC02 = ref('加工品号');
const productLabelC03 = ref('加工品号');
const productLabelC04 = ref('加工品号');

// 格式化数据函数
const formatData = (deviceData) => {
  const formatValue = (value) => {
    if (value === null || value === undefined) return '暂无数据';
    const num = parseFloat(value);
    return num % 1 === 0 ? num.toFixed(0) : num.toFixed(1);
  };

  return [
    {name: '品号', real: deviceData.ta006 || '暂无数据'},
    {name: '温度', real: formatValue(deviceData.et1)},
    {name: '压力', real: formatValue(deviceData.esipp)},
    {name: '最大射速', real: formatValue(deviceData.eivm)},
    {name: '保压时间', real: formatValue(deviceData.esipt)}
  ];
};

// 获取并处理数据
const fetchData = async () => {
  try {
    const res = await getInvokeDeviceList();
    const { data } = res;
    
    if (data) {
      // 将数据格式化并赋值给对应的表格数据
      if (data.c02) {
        tableDataC02.value = formatData(data.c02);
        titleC02.value = data.c02.deviceCode || 'C02机台';
        productLabelC02.value = data.c02.ta006 || '加工品号';
      }
      
      if (data.c01) {
        tableDataC01.value = formatData(data.c01);
        titleC01.value = data.c01.deviceCode || 'C01机台';
        productLabelC01.value = data.c01.ta006 || '加工品号';
      }
      
      if (data.c04) {
        tableDataC04.value = formatData(data.c04);
        titleC04.value = data.c04.deviceCode || 'C04机台';
        productLabelC04.value = data.c04.ta006 || '加工品号';
      }
      
      if (data.c03) {
        tableDataC03.value = formatData(data.c03);
        titleC03.value = data.c03.deviceCode || 'C03机台';
        productLabelC03.value = data.c03.ta006 || '加工品号';
      }
    }
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
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 1rem;
  height: 100%;
  width: 100%;
}

@media (max-width: 1024px) {
  .flex-container {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
