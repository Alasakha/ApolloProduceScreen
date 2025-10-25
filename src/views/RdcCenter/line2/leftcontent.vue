<template>
  <dv-border-box10>
      <!-- <div class="box1"> 
          <div class="w-full h-full">
              <div ref="qualityIndicators" class="chart-container w-full h-[85%]"></div>
            <dv-button class=" w-[6vw] pl-4" :color="'#23a7dc'"  :bg="false" @click="() => opendialog()">详细数据</dv-button>
          </div>
      </div> -->
      <div class="w-full h-full flex justify-center items-center">
        <div ref="qualityIndicators" class="chart-container w-full h-[85%]"></div>
        <!-- <h1>质量改善计划暂未导入4N系统,8月起导入核算达成率</h1> -->
      </div>
  </dv-border-box10>
  <!-- getAtopDayInspector -->

   <!-- 弹窗 -->
     <TableDialog
   v-model="dialogTableVisible"
   :title= dialogTitle
   width="90vw"
   :tableData="gridData"
   :columns="gridColumns"
 />
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { getPlan4nPie,getPlan4n} from '@/api/getQuiltyinfo'
import { eventBus } from '@/utils/eventbus';
import TableDialog from '../components/dialog.vue';
import { createChartOption } from './piecharts';
import { useEcharts } from '@/utils/useEcharts'; // 引入封装

const dialogTableVisible = ref(false);
const title = ref('转产计划达成率');
const dialogTitle = ref('转产计划达成率');

const qualityIndicators = ref(null);
const rawData = ref([]);
const isLoading = ref(true);
const isDataEmpty = ref(false);



const { initChart, setOption, resizeChart,onClick } = useEcharts(qualityIndicators); // 使用封装的逻辑

const gridData = ref([]);
const gridColumns = [
  { prop: 'id', label: 'ID', width: '80' },
  { prop: '计划编号', label: '计划编号', width: '150' },
  { prop: '行动举措', label: '行动举措', width: '' }, // 不设置宽度，自动填充剩余空间
  { prop: '成果要求', label: '成果要求', width: '200' },
  { prop: '状态描述', label: '状态', width: '80' },
  { prop: '负责人名称', label: '负责人', width: '100' },
  { prop: '所属部门', label: '所属部门', width: '120' },
  { prop: '计划完成时间', label: '计划完成时间', width: '120' },
  { prop: '实际完成时间', label: '实际完成时间', width: '120' },
  { prop: '重要紧急等级', label: '重要紧急等级', width: '120' },
  { prop: '建立时间', label: '建立时间', width: '100' }
];



// const opendialog = () => {
// dialogTableVisible.value = true;
// dialogTitle.value = title.value;
// getComplaint()
//   .then(res => {
//     gridData.value = res.data;
//   });
// };


const fetchData = () => {
  getPlan4nPie( )
  .then(res => {
    
    isLoading.value = false;
   const data = res.data
   const chartData = data.map(data =>({
    name: data.状态描述,
    value: data.total
   }))
   rawData.value = chartData

  //  const result = [
  //   { value: data.greenCount, name: '及时处理', itemStyle: { color: '#28a745' } }, // 绿色
  //   { value: data.yellowCount, name: '客诉响应', itemStyle: { color: '#ffc107' } }, // 黄色
  //   { value: data.orangeCount, name: '处理预警', itemStyle: { color: '#fd7e14' } }, // 橙色
  //   { value: data.redCount, name: '未及时处理', itemStyle: { color: '#dc3545' } }  // 红色
  // ];
  })
  .catch(() => {
    isLoading.value = false;
    isDataEmpty.value = true;
  });     
};

// 点击饼图区域，弹出对应信息
const handleChartClick = (params) => {
const clickedName = params.name;
dialogTitle.value = `${clickedName}的详细数据`;
dialogTableVisible.value = true;
  console.log(clickedName)
  getPlan4n(clickedName) // 假设 API 接口第三个参数是问题名
  .then(res => {
    gridData.value = res.data;
  });
};

// const isColor =(name)=>{
//   switch (name) {
//       case '及时处理':
//           return 'green'
//       case '客诉响应':
//           return 'yellow'
//       case '处理预警':
//           return 'orange'
//       case '未及时处理':
//           return 'red'
//       default:
//           return null
//   }
// }



watch(rawData, () => {
nextTick(() => {
  initChart();
  const option = createChartOption(title.value, rawData.value);
  setOption(option);
  onClick(handleChartClick); // ✅ 恢复点击事件绑定
});
}, { deep: true, immediate: true });

onMounted(() => {
fetchData();
resizeChart()
eventBus.on("refreshData", fetchData);
});

onBeforeUnmount(() => {
eventBus.off("refreshData", fetchData); // 避免内存泄漏
});
</script>


<style scoped>
.box1{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: start;
  color:aliceblue;

}
h1{
  font-size: 1.5vw;
  color:aliceblue;
  letter-spacing: 0.5vw;
}
:deep(.inside-column) {
height: 2vh !important; /* 这里改成你想要的宽度 */
}
</style>


