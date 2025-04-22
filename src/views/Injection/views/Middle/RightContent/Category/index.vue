
<template>
  <!-- 如果正在加载，显示 loading -->
  <div v-show="!isLoading" class="h-[100%] w-full">
  <div v-if="isLoading" class="loading-container">
         <dv-loading>Loading...</dv-loading>
       </div>
         <!-- 自定义图例 -->
    <div v-show="!isLoading" class="custom-legend flex justify-center items-center gap-2 mb-2 text-white">
      <div v-for="(category, index) in legendData" :key="index" class="legend-item">
        <div :style="{ backgroundColor: category.color }" class="legend-color-box"></div>
        <span>{{ category.name }}</span>
      </div>
    </div>
       <!-- 数据加载完成且非空时显示图表 -->
       <div v-show="!isLoading" ref="dailyIndicators" class="charts h-[25vh] w-[30vw]" ></div>
     </div>a
 </template>
 
 <script setup>
 import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
 import * as echarts from 'echarts';
 import { getBadCategory } from '@/api/getInjection';
 import { eventBus } from '@/utils/eventbus';
 import { formatPieChartData } from '@/utils/map';
 import { getColorByType } from '@/utils/color';
 
 const BadCategoryIndicators = ref(null);
 const isLoading = ref(true);
 const isDataEmpty = ref(false);
 const Data = ref({ faultType: [] });
 const total = ref([]);
 const legendData = ref([]);  // 用来存储自定义图例数据
 const dailyIndicators = ref(null);
 // Loading 和 数据为空的状态
 // 固定的异常类别
const fixedCategories = ['质量异常', '设备异常', '缺料异常'];

 const drawDailyIndicators = (formattedData) => {
   const dailyIndicatorsElement = echarts.init(dailyIndicators.value);
   console.log('dailyIndicators:', dailyIndicators.value);
   const option = {
   tooltip: {
     trigger: 'item'
   },
   grid: {
    top: '215%',  // 设置图表的上边距为5%（你可以根据需要调整此值）
    left: 'center',
    right: '5%',
    bottom: '5%'
  },
   legend: false,  // 不显示图例
   series: [
     {
       name: '本日生产异常数量',
       type: 'pie',
       radius: ['40%', '70%'],
       avoidLabelOverlap: false,
       padAngle: 5,
       itemStyle: {
         borderRadius: 10
       },
       label: {
         show: true,
         position: 'outside', // 标签显示在外侧
         formatter: '{b}:{c}', // 格式化标签内容，显示名称、数值和百分比
         fontSize: 12, // 设置标签字体大小
         color: '#fff' // 设置标签字体颜色
       },
       emphasis: {
         label: {
           show: true,
           fontSize: 10,
           fontWeight: 'bold'
         }
       },
       labelLine: {
         show: true,      // 使线条显示
         length: 8,      // 设置线条的第一段长度
         length2: 4,     // 设置线条的第二段长度
         lineStyle: {
           color: '#fff', // 设置线条颜色
           width: 1,      // 设置线条宽度
           type: 'solid'  // 设置线条类型
         }
       },
       data: formattedData // 使用传递过来的数据
     }
   ]
 };
 
 
   dailyIndicatorsElement.setOption(option);
 };
 
 const processData = (data) => {
   let formattedData = formatPieChartData(data, 'guZhangTypeName', 'total');
   formattedData = formattedData.map((item) => ({
   ...item,
   value: parseInt(item.value, 10), // 将字符串转换为整数
 }));
   console.log('formattedData1',formattedData);
   if (formattedData.length === 0) {
     isDataEmpty.value = true;  // 如果没有数据，设置为空数据状态
     formattedData = [{ value: 0, name: '暂无异常', itemStyle: { color: '#009966' } }]; // 设置一个绿色的数据点
   } else {
     isDataEmpty.value = false;
   }
    // 为每个数据项设置颜色
    formattedData.forEach(item => {
       item.itemStyle = {
         color: getColorByType(item.name)  // 根据名称设置颜色
       };
     });

 // 打印 legendData
 console.log('legendData:', legendData.value);

   nextTick(() => {
     if (dailyIndicators.value) {
       drawDailyIndicators(formattedData);
     } else {
     }
   });
 };
   // 更新自定义图例的数据
   legendData.value = fixedCategories.map((category) => ({
    name: category,
    color: getColorByType(category), // 获取每个异常类型对应的颜色
  }));
 const fetchData = () => {
   getBadCategory()
     .then(res => {
       isLoading.value = false;   // 加载完成，关闭 loading 状态
       processData(res.data.faultType);  // 处理数据
       console.log(isDataEmpty.value);
     })
     .catch(() => {
       isLoading.value = false;
       isDataEmpty.value = true;  // 如果请求失败，设置为空数据状态
       processData([]); // 处理空数据
     });
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
 
 <style scoped>
 .box1 {
   position: relative;
   width: 35%;
   height: 85%;
   display: flex;
   justify-content: center;
   align-items: center;
   font-size: 18px;
   color: aliceblue;
   padding: 20px;
 }
 
 h2 {
   position: absolute;
   top: 0.5vh;
   left: 1vw;
   margin: 0;
   font-size: 1vw;
   font-weight: bold;
   margin-bottom: 10px;
 }
 
 .wrapper {
   width: 100%;
   height: 100%;
   display: flex;
   flex-direction: column; /* 让 h2 和图表上下排列 */
   align-items: center;
   justify-content: center; /* 居中饼图 */
 }
 
 .wrapper div {
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
 }
 
 .loading-container,
 .empty-container {
   display: flex;
   justify-content: center;
   align-items: center;
   width: 100%;
   height: 100%; 
   font-size: 2vw; 
   letter-spacing: 0.2vw;
 }
 .custom-legend {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;

}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.legend-color-box {
  width: 12px;
  height: 12px;
  margin-right: 5px;
  border-radius: 50%;
}
 </style>