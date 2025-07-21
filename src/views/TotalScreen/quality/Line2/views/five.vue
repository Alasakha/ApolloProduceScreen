<template>
    <dv-border-box10>
        <div class="box1"> 
            <div class="w-full h-full">
                <div ref="qualityIndicators" class="chart-container w-full h-[85%]"></div>
              <dv-button class=" w-[6vw] pl-4" :color="'#23a7dc'"  :bg="false" @click="() => opendialog()">详细数据</dv-button>
            </div>
        </div>
    </dv-border-box10>
    <!-- getAtopDayInspector -->

     <!-- 弹窗 -->
    <TableDialog
    v-model="dialogTableVisible"
    :title= dialogTitle
    width="60vw"
    :tableData="gridData"
    :columns="gridColumns"
  />
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { getComplaintPie2 ,getComplaint} from '@/api/getQuiltyinfo'
import { eventBus } from '@/utils/eventbus';
import TableDialog from '../components/dialog.vue';
import { createChartOption } from './data';
import { useEcharts } from '@/utils/useEcharts'; // 引入封装

const dialogTableVisible = ref(false);
const title = ref('客诉关闭及时率');
const dialogTitle = ref('客诉关闭及时率');

const qualityIndicators = ref(null);
const rawData = ref([]);
const isLoading = ref(true);
const isDataEmpty = ref(false);



const { initChart, setOption, resizeChart,onClick } = useEcharts(qualityIndicators); // 使用封装的逻辑

const gridData = ref([]);
const gridColumns = [
  { prop: 'documentName', label: '客户等级' , width: '120'},
  { prop: 'documentValue', label: '单据类型', width: '150' },
  { prop: 'doc_no', label: '订单号',width: '150' },
  { prop: 'description', label: '问题点1',width: '500' },
  { prop: 'udf021', label: '问题点2',width: '300' },
  { prop: 'remark', label: '备注',width: '250' },
  { prop: 'reqTime', label: '单据日期',width: '250' },
  { prop: 'respTime', label: '处理时间' },
  { prop: 'pf', label: '处理情况' },
];



const opendialog = () => {
  dialogTableVisible.value = true;
  dialogTitle.value = title.value;
  getComplaint()
    .then(res => {
      gridData.value = res.data;
    });
};


const fetchData = () => {
    getComplaintPie2( )
    .then(res => {
      
      isLoading.value = false;
     const data = res.data

     const result = [
      { value: data.greenCount, name: '及时处理', itemStyle: { color: '#28a745' } }, // 绿色
      { value: data.yellowCount, name: '客诉响应', itemStyle: { color: '#ffc107' } }, // 黄色
      { value: data.orangeCount, name: '处理预警', itemStyle: { color: '#fd7e14' } }, // 橙色
      { value: data.redCount, name: '未及时处理', itemStyle: { color: '#dc3545' } }  // 红色
    ];

rawData.value=result    
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
  getComplaint(null,isColor(clickedName)) // 假设 API 接口第三个参数是问题名
    .then(res => {
      gridData.value = res.data;
    });
};

const isColor =(name)=>{
    switch (name) {
        case '及时处理':
            return 'green'
        case '客诉响应':
            return 'yellow'
        case '处理预警':
            return 'orange'
        case '未及时处理':
            return 'red'
        default:
            return null
    }
}



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


