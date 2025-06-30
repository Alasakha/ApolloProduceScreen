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
        <!-- 图表容器 -->
        <div class="chartsbox w-full h-[90%]">
          <div  ref="chartRef" class="w-full h-full"></div>
          <!-- <div v-else class="w-full h-full flex items-center justify-center text-white text-3xl">今日暂无数据</div> -->
        </div>
        <!-- <dv-button :color="'#23a7dc'" class=" w-[6vw] pl-4"  size="small" @click="openDetailDialog">详细数据</dv-button> -->
      </dv-border-box8>
      <!-- 详情弹窗 -->
      <DetailDialog
        v-model="dialogVisible"
        :title="dialogTitle"
        :loading="tableLoading"
        :data="detailData"
        :columns="tableColumns"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
  import { getCheckOutTimePie,getCheckOutTime } from '@/api/getQuiltyinfo';
  import { eventBus } from '@/utils/eventbus';
  import { formatPieChartData } from '@/utils/map';
  import { createChartOption } from './data';
  import { useEcharts } from '@/utils/useEcharts';
  import DetailDialog from '@/components/SCM/DetailDialog/index.vue';
  
  const chartRef = ref(null);
  const { initChart, setOption, onClick, offClick, resizeChart } = useEcharts(chartRef);
  
  const isDataEmpty = ref(false);
  const dialogVisible = ref(false);
  const tableLoading = ref(false);
  const detailData = ref([]);
  const dialogTitle = ref('来料检验超时');
  const selectedPurchaser = ref('');
  const currentRequestId = ref(0);
  
  const tableColumns = [
  { prop: 'ta001', label: '工单单号' },
  { prop: 'ta006', label: '品号' },
  { prop: 'mb002', label: '品名' },
  { prop: 'mb003', label: '规格' },
  { prop: 'address', label: '车架码' },
  { prop: 'workCenterID', label: '车间' },
  { prop: 'workCenterName', label: '工作中心' },
  ];
  
  const rawData = ref([]);
  

  
  // 饼图数据加载
  const fetchData = () => {
    getCheckOutTimePie('CPJ').then(res => {
      const formatted = formatPieChartData(res.data, 'peopleName', 'total');
      rawData.value = formatted.filter(item => item.value !== 0).sort((a, b) => b.value - a.value);
      isDataEmpty.value = rawData.value.length === 0;
      nextTick(() => {
        initChart();
        const option = createChartOption('包装检验超时', rawData.value);
        setOption(option);
        offClick(handleChartClick);
        onClick(handleChartClick);
      });
    }).catch(() => {
      isDataEmpty.value = true;
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
        const res = await getCheckOutTime('CPJ',selectedPurchaser.value);
        if (requestId === currentRequestId.value) {
          detailData.value = Array.isArray(res.data) ? res.data : [];
        }
      } catch {
        if (requestId === currentRequestId.value) detailData.value = [];
      } finally {
        if (requestId === currentRequestId.value) tableLoading.value = false;
      }
    }
  };
  
  // 详细数据按钮
  const openDetailDialog = async () => {
    // selectedPurchaser.value = '';
    // dialogTitle.value = '包装检验超时';
    // dialogVisible.value = true;
    // tableLoading.value = true;
    // try {
    //   const res = await getCheckInfo({ type: 1 });
    //   detailData.value = Array.isArray(res.data) ? res.data : [];
    // } catch {
    //   detailData.value = [];
    // } finally {
    //   tableLoading.value = false;
    // }
  };
  
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
  </style>
  
  
  