<template>
    <div class="content w-full h-full">
      <dv-border-box8 :dur="5">
        <!-- 标题和提示 -->
        <div class="flex items-center">
          <!-- <GlobalTitle title="检验信息(超时)" /> -->
          <!-- <TooltipInfo
            class="ml-2"
            tooltip-content="显示各采购员的来料不合格情况统计"
            :detail-content="tooltipDetailContent"
            dialog-title="指标说明"
            placement="right"
          >
            <template #detail>
              <div class="detail-content">
                <h3 class="text-lg font-bold mb-4">数据说明</h3>
                <ul class="list-disc pl-4 space-y-2">
                  <li>统计周期：每月更新</li>
                  <li>数据来源：质检部门检验记录</li>
                  <li>计算方式：xxxx</li>
                  <li>点击饼图可查看详细记录</li>
                </ul>
              </div>
            </template>
          </TooltipInfo> -->
        </div>
        <!-- 统计卡片 -->
        <div class="stats-container mb-4">
          <div class="stat-card">
            <div class="card-icon">📊</div>
            <div class="card-content">
              <div class="card-label">总数</div>
              <div class="card-value" v-if="!isLoading">{{ totalCount }}</div>
              <div class="loading-skeleton" v-else></div>
            </div>
          </div>
          <div class="stat-card">
            <div class="card-icon">✅</div>
            <div class="card-content">
              <div class="card-label">已检</div>
              <div class="card-value" v-if="!isLoading">{{ checkedCount }}</div>
              <div class="loading-skeleton" v-else></div>
            </div>
          </div>
        </div>
        
        <!-- 图表容器 -->
        <div class="chartsbox w-full h-[80%]">
          <div  ref="chartRef" class="w-full h-full"></div>
        </div>
        <!-- <dv-button :color="'#23a7dc'" class=" w-[6vw] pl-4"  size="small" @click="openDetailDialog">详细数据</dv-button> -->
      </dv-border-box8>
      <!-- 详情弹窗 -->
      <!-- <DetailDialog
        v-model="dialogVisible"
        :title="dialogTitle"
        :loading="tableLoading"
        :data="detailData"
        :columns="tableColumns"
      /> -->
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
  import { getCheckOutTimePie,getCheckOutTime } from '@/api/getQuiltyinfo';
  import { eventBus } from '@/utils/eventbus';
  import { formatPieChartData } from '@/utils/map';
  import { createChartOption } from './data';
  import { useEcharts } from '@/utils/useEcharts';
  // import DetailDialog from '@/components/SCM/DetailDialog/index.vue';
  
  const chartRef = ref(null);
  const { initChart, setOption, onClick, offClick, resizeChart } = useEcharts(chartRef);
  
  const isDataEmpty = ref(false);
  const dialogVisible = ref(false);
  const tableLoading = ref(false);
  const detailData = ref([]);
  const dialogTitle = ref('装配检验超时');
  // const title = ref('装配检验超时');
  const selectedPurchaser = ref('');
  const currentRequestId = ref(0);  
  
  // const tableColumns = [
  // { prop: 'udf021', label: '客户单号' },
  // { prop: 'ta006', label: '品号' },
  // { prop: 'mb002', label: '品名' },
  // { prop: 'mb003', label: '规格' },
  // { prop: 'address', label: '车架码' },
  // { prop: 'workCenterID', label: '车间' },
  // { prop: 'workCenterName', label: '工作中心' },
  // { prop: 'creatTime', label: '送检日期' },
  // { prop: 'ngReason', label: '异常原因' },
  // { prop: 'ngHandle', label: '处理情况' },
  // ];
  
  const rawData = ref([]);
  const isLoading = ref(true);
  const totalCount = ref(0);
  const checkedCount = ref(0);
  
    // 饼图数据加载
  const fetchData = () => {
    isLoading.value = true;
    getCheckOutTimePie('XXJ').then(res => {
      const formatted = formatPieChartData(res.data, 'peopleName', 'total');
      rawData.value = formatted.filter(item => item.value !== 0).sort((a, b) => b.value - a.value);
      
      // 计算总数和已检验数
      totalCount.value = res.data?.length || 0;
      checkedCount.value = rawData.value.reduce((sum, item) => sum + item.value, 0);
      
      isDataEmpty.value = rawData.value.length === 0;
      isLoading.value = false;
      nextTick(() => {
        initChart();
        const option = createChartOption('装配检验超时', rawData.value);
        setOption(option);
        offClick(handleChartClick);
        onClick(handleChartClick);
      });
    }).catch(() => {
      isDataEmpty.value = true;
      isLoading.value = false;
    });
  };
  
  // 饼图点击事件
  const handleChartClick = async (params: any) => {
    if (params && params.name) {
      const requestId = ++currentRequestId.value;
      selectedPurchaser.value = params.name;
      dialogTitle.value = `${params.name}的检验信息`;
      dialogVisible.value = true;
      tableLoading.value = true;
      try {
        const res = await getCheckOutTime('XXJ',selectedPurchaser.value);
        if (requestId === currentRequestId.value) {
          const formatDetailData = (data) => {
            return data.map(item => ({
              ...item,
              ta001ta002:
                (item.ta001 != null && item.ta001 !== '' ? item.ta001 : '') +'-'+(item.ta002 != null && item.ta002 !== '' ? item.ta002 : '')
            }));
          };
          detailData.value = formatDetailData(res.data);
        }
      } catch {
        if (requestId === currentRequestId.value) detailData.value = [];
      } finally {
        if (requestId === currentRequestId.value) tableLoading.value = false;
      }
    }
  };
  
  // 详细数据按钮
  // const openDetailDialog = async () => {
  //   selectedPurchaser.value = '';
  //   dialogTitle.value = pageTitle.value;
  //   dialogVisible.value = true;
  //   tableLoading.value = true;
  //   try {
  //     const res = await getCheckOutTime({ type: 1 });
  //     detailData.value = Array.isArray(res.data) ? res.data : [];
  //   } catch {
  //     detailData.value = [];
  //   } finally {
  //     tableLoading.value = false;
  //   }
  // };
  
  onMounted(() => {
    fetchData();
    window.addEventListener('resize', resizeChart);
    eventBus.on('refreshData', fetchData);
  });
  onBeforeUnmount(() => {
    eventBus.off('refreshData', fetchData);
    window.removeEventListener('resize', resizeChart);
  });
  </script>
  
  <style scoped>
  .content {
    width: 100%;
    height: 100%;
  }
  .chartsbox {
    width: 100%;
    height: 90%;
  }
    .detail-content {
    color: #fff;
  }

  /* 统计卡片样式 */
  .stats-container {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
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
</style>
  
  
  