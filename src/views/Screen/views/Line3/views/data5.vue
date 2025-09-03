今日其他不良
const reasonType = 2
// import { getResponsityRank } from '@/api/getQuiltyinfo';
const formattedData = formatPieChartData(data, 'ngName', 'total');

<template>
  <div v-if="prodLine === '1004A'" class="efficency w-[25%] ">
    <dv-border-box12>
      <h1 class="text-white text-2xl font-bold ml-2 w-full flex justify-center items-cneter pt-4 5xl:text-4xl">上线检验数</h1>
      <div class="w-full h-full p-4" >
        <div class="cards-container flex-col">
          <div class="stat-card">
            <div class="card-icon">📊</div>
            <div class="card-content">
              <div class="card-label">总数</div>
              <div class="card-value" v-if="!isLoading">{{ total }}</div>
              <div class="loading-skeleton" v-else></div>
            </div>
          </div>
          <div class="stat-card">
            <div class="card-icon">✅</div>
            <div class="card-content">
              <div class="card-label">已检</div>
              <div class="card-value" v-if="!isLoading">{{ checkTotal }}</div>
              <div class="loading-skeleton" v-else></div>
            </div>
          </div>
        </div>
        
        <!-- 全局加载遮罩 -->
        <div class="loading-overlay" v-if="isLoading">
          <div class="loading-spinner">
            <div class="spinner"></div>
            <div class="loading-text">加载中...</div>
          </div>
        </div>
      </div>
      <div class="w-full h-full">
        <div ref="qualityIndicators" class="chart-container w-full  h-[80%]"></div>
        <dv-button class="w-[11vw] pl-4" :color="'#23a7dc'" :bg="false"  @click="() => opendialog()" >详细数据</dv-button>
      </div>
      </dv-border-box12>
  </div>

  <!-- 弹窗 -->
  <TableDialog
  v-model="dialogTableVisible"
  :title= title
  width="800px"
  :tableData="gridData"
  :columns="gridColumns"
  @refresh="refreshDialogData"
/>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, reactive, computed,watch,nextTick } from 'vue';
import { getCheckTotalDoneJcx } from '@/api/getQuiltyinfo';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';


// import { getResponsityRank } from '@/api/getQuiltyinfo';
import * as echarts from 'echarts';
import { createChartOption } from './data.ts';
import { useEcharts } from '@/utils/useEcharts'; // 引入封装


const route = useRoute();
const prodLine = route.query.prodLine;
// Loading 和 数据为空的状态
const isLoading = ref(true);
const total = ref(0)
const checkTotal = ref(0)

const rawData = ref([]);

// 添加缺失的变量定义
const gridData = ref([]);
const gridColumns = ref([]);
const dialogTableVisible = ref(false);
const title = ref('详细数据');
const chartInstance = ref(null);

// 添加缺失的函数定义
const opendialog = () => {
  dialogTableVisible.value = true;
};

const refreshDialogData = () => {
  fetchData();
};

const processData = (data) => {
  // 处理数据的逻辑
  console.log('处理数据:', data);
};

const resizeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.resize();
  }
};


const fetchData = () => {
    getCheckTotalDoneJcx()
  .then(res => {
    gridData.value = res.data;
    console.log(gridData.value)
    isLoading.value = false;
    total.value = Number(res?.data?.total ?? 0)
    checkTotal.value = Number(res?.data?.checkTotal ?? 0)
    processData(res.data);
  })
  .catch(() => {
    isLoading.value = false;
  });
};












// 8. 页面挂载时获取数据
onMounted(() => {
  
  if (prodLine === '1004A') {

    fetchData()
  }
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});

// 9. 组件卸载时移除监听事件并销毁图表
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose(); // 销毁图表实例
  }
  window.removeEventListener('resize', resizeChart); // 移除监听器
});



  </script>
  
  
  <style scoped>
  .cards-container {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
    height: 80%;
    padding: 0.5rem;
    flex-direction: column;
    width: 100%;
  }

  .stat-card {
    flex: 1;
    background: linear-gradient(135deg, rgba(35, 167, 220, 0.1) 0%, rgba(35, 167, 220, 0.05) 100%);
    border: 1px solid rgba(35, 167, 220, 0.3);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(35, 167, 220, 0.1);
    width: 80%;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(35, 167, 220, 0.2);
    border-color: rgba(35, 167, 220, 0.5);
  }

  .card-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    opacity: 0.8;
  }

  .card-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .card-label {
    font-size: 0.9rem;
    color: rgba(240, 248, 255, 0.8);
    font-weight: 500;
    letter-spacing: 0.05em;
  }

  .card-value {
    font-size: 2rem;
    font-weight: bold;
    color: #23a7dc;
    text-shadow: 0 0 10px rgba(35, 167, 220, 0.3);
  }

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
    /* font-size: 1.5vw; */
    color:aliceblue;
    /* letter-spacing: 0.5vw; */
  }

  :deep(.inside-column) {
    height: 2vh !important; /* 这里改成你想要的宽度 */
  }

  /* 加载骨架屏样式 */
  .loading-skeleton {
    width: 60px;
    height: 2rem;
    background: linear-gradient(90deg, rgba(35, 167, 220, 0.2) 25%, rgba(35, 167, 220, 0.4) 50%, rgba(35, 167, 220, 0.2) 75%);
    background-size: 200% 100%;
    border-radius: 4px;
    animation: skeleton-loading 1.5s infinite;
  }

  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  /* 全局加载遮罩 */
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    border-radius: 12px;
  }

  .loading-spinner {
    text-align: center;
    color: #23a7dc;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(35, 167, 220, 0.3);
    border-top: 3px solid #23a7dc;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading-text {
    font-size: 0.9rem;
    color: #23a7dc;
    font-weight: 500;
  }
</style>


