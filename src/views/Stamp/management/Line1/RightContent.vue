<template>
    <div class="efficency w-[25%]">
      <dv-border-box12>
        <GlobalTitle title="当日人时效率"/>
        <!-- 如果正在加载，显示 loading -->
        <div v-if="isLoading" class="w-full h-[85%] text-white">
          <dv-loading>Loading...</dv-loading>
        </div>
        <!-- 数量 -->
        <div v-if="!isLoading" class="w-full h-[95%] p-4 pt-5 flex flex-col justify-start">
          <div class="line flex-2 flex">
            <!-- 配置人数 -->
            <div class="peizhi flex-1">
              <div ref="Indicators1" class="w-full h-[100%]"></div>
            </div>
            <!-- 出勤人数 -->
            <div class="chuchai flex-1">
              <div ref="Indicators2" class="w-full h-[100%]"></div>
            </div>
          </div>
  
          <div class="line flex-1 flex gap-8 w-full h-full justify-center items-center">
            <!-- 标准人效 -->
            <div class="eff-card flex-1 flex flex-col justify-center items-center rounded-xl p-2 shadow-lg">
              <div class="title text-lg font-bold flex-1">标准人效</div>
              <div class="value flex-1">{{ EfficentData.standardEfficiency || '暂无数据' }}</div>
            </div>
  
            <!-- 实际人效 -->
            <div class="eff-card-wrap flex-1 flex-col items-center">
              <!-- 上方原因提示 -->
              <div
                v-if="EfficentData.reason"
                class="reason-tip mb-1"
              >
                <el-icon style="color:#FFA000;vertical-align:middle;"><WarningFilled /></el-icon>
                <!-- <span class="ml-1">{{ EfficentData.reason }}</span> -->
              </div>
              <!-- 原有卡片内容 -->
              <div
                class="eff-card flex-1 flex flex-row items-center justify-center rounded-xl p-2 shadow-lg"
                :class="{ 'efficiency-low': showWarning }"
                @click="openReasonDialog"
                style="cursor: pointer;"
              >
                <el-tooltip
                  v-if="showWarning"
                  :content="EfficentData.reason || '实际人效低于标准人效，可能原因：出勤人数不足、生产异常等'"
                  placement="left"
                  effect="dark"
                >
                  <div class="warn-icon-box flex items-center justify-center mr-3">
                    <svg class="warn-icon" width="38" height="38" viewBox="0 0 24 24">
                      <polygon points="12,3 22,20 2,20" fill="#FFD600" stroke="#FFA000" stroke-width="2"/>
                      <rect x="11" y="9" width="2" height="5" fill="#FFA000"/>
                      <rect x="11" y="16" width="2" height="2" fill="#FFA000"/>
                    </svg>
                  </div>
                </el-tooltip>
                <div class="flex flex-col items-center justify-center">
                  <div class="title text-lg font-bold">实际人效</div>
                  <div class="value">{{ EfficentData.efficiency || '暂无数据' }}</div>
                </div>
              </div>
            </div>
          </div>
  
        </div>
      </dv-border-box12>
  
      <el-dialog
        v-model="reasonDialogVisible"
        title="实际人效原因说明"
        width="400px"
        :close-on-click-modal="false"
      >
        <div class="mb-2" style="color:#e03030;font-weight:bold;">
          当前原因：{{ EfficentData.reason || '暂无原因' }}
        </div>
        <el-input
          v-model="customReason"
          type="textarea"
          :rows="3"
          placeholder="请填写具体原因（可选）"
        />
        <template #footer>
          <el-button @click="reasonDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReason">确定</el-button>
        </template>
      </el-dialog>
  
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted,onBeforeUnmount,reactive ,nextTick, computed } from 'vue';
  
  import { getEfficiencyToday, getEfficiencyBelowAdd } from '@/api/getProduceinfo';
  import { useRoute } from 'vue-router';
  import { eventBus } from '@/utils/eventbus';
  
  import { createGaugeOption } from './gaugeChart';
  import { useEcharts } from '@/utils/useEcharts';
  import { WarningFilled } from '@element-plus/icons-vue'
  
  // 定义数据
  
  
  
  const EfficentData = reactive({
    standardEfficiency: null,
    efficiency: null,
    total: null,
    clTotal: null,
    scanNum: null,
    stanardNum: null,
    warning: 0,
    reason: '',
  });
  
  // 计算属性：判断实际人效是否低于标准人效
  // const isEfficiencyLow = computed(() => {
  //   return EfficentData.efficiency < EfficentData.standardEfficiency;
  // });
  
  const showWarning = computed(() => EfficentData.warning === 1);
  
  const Indicators1 = ref(null);
  const Indicators2 = ref(null);
  const route = useRoute();
  const prodLine = route.query.prodLine; // 通过 query 获取参数
  const isLoading = ref(true);
  
  
  const chart1 = useEcharts(Indicators1);
  const chart2 = useEcharts(Indicators2);
  
  const drawChart = () => {
    
    const option1 = createGaugeOption({
      text: "配置人数",
      data: EfficentData.stanardNum,
      max: EfficentData.stanardNum
    });
  
    const option2 = createGaugeOption({
      text: "出勤人数",
      data: EfficentData.scanNum, 
      max: EfficentData.stanardNum
    });
  
    chart1.setOption(option1);
    chart2.setOption(option2);
  };
  
  const fetchData = async () => {
    const res = await getEfficiencyToday('1003');
    console.log('res:', res);
    // 分别赋值，保持响应式
    EfficentData.standardEfficiency = Number(res.data.standardEfficiency) || 0;
    EfficentData.efficiency = Number(res.data.efficiency) || 0;
    EfficentData.total = res.data.total ?? 0;
    EfficentData.clTotal = res.data.clTotal ?? 0;
    EfficentData.scanNum = Number(res.data.scanNum) ?? 0;
    EfficentData.stanardNum = Number(res.data.stanardNum) ?? 0;
    EfficentData.warning = res.data.warning ?? 0;
    EfficentData.reason = res.data.reason || '';
    isLoading.value = false;
    nextTick(() => {
      chart1.initChart();
      chart2.initChart();
      drawChart();
    });
  };
  
  
  // 在组件挂载时启动定时获取数据
  onMounted(() => {
    fetchData(); // 组件挂载时先请求一次
   
    eventBus.on("refreshData", fetchData); // 监听全局刷新事件
  });
  
  
    // 清理定时器，避免组件卸载后定时器继续执行
    onBeforeUnmount(() => {
      eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
    });
  
    const reasonDialogVisible = ref(false);
    const customReason = ref('');
  
    function openReasonDialog() {
      reasonDialogVisible.value = true;
      customReason.value = '';
    }
  
    async function submitReason() {
      await getEfficiencyBelowAdd(prodLine, customReason.value);
      reasonDialogVisible.value = false;
      fetchData(); // 提交后刷新数据
    }
  </script>
  
  
  <style scoped>
  .box1 {
    width: 25%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    font-size: 18px;
    color: aliceblue;
  }
  /* :deep(.dv-percent-pond text:has(tspan:contains("%"))) {
    display: none;
  } */
  
  .eff-card {
    /* 或者 */
    width: 100%;
    background: linear-gradient(135deg, #2563eb 0%,#38bdf8 100%);
    color: #fff;
    flex: 1;
  }
  
  
  
  .value {
    font-size: 1.8rem;
    font-weight: bold;
  }
  
  .warning-icon {
    font-size: 1.1em;
    color: #ff4444;
    vertical-align: middle;
  }
  
  .warn-icon {
    vertical-align: middle;
    margin-left: 4px;
    /* 可选：让图标和文字更协调 */
    transform: translateY(-1px);
  }
  
  .warn-icon-box {
    min-width: 38px;
    min-height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .warn-icon {
    display: block;
  }
  
  .reason-tip {
    color: #FFA000;
    font-size: 1em;
    font-weight: bold;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.12);
    border-radius: 6px;
    padding: 2px 10px;
    margin-bottom: 4px;
    max-width: 90%;
    word-break: break-all;
  }
  
  </style>