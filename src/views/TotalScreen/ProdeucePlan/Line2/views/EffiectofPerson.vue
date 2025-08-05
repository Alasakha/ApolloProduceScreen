<template>
  <div class="efficency w-[25%]">
    <dv-border-box12>
      <GlobalTitle title="当日人时效率"/>
      <!-- 如果正在加载，显示 loading -->
      <div v-if="isLoading" class="w-full h-[85%] text-white">
        <dv-loading>Loading...</dv-loading>
      </div>
      <!-- 六个图形 - 两列三行布局 -->
      <div v-if="!isLoading" class="w-full h-[95%] p-2">
        <div class="grid grid-cols-2 grid-rows-3 gap-2 h-full">
          <!-- 第一个图形 - 配置人数 -->
          <div class="chart-container  p-2">
            <div ref="Indicators1" class="w-full h-[100%]"></div>
          </div>
          
          <!-- 第二个图形 - 出勤人数 -->
          <div class="chart-container  p-2">
            <div ref="Indicators2" class="w-full h-full"></div>
          </div>
          
          <!-- 第三个图形 - 换型换线时间 -->
          <div class="chart-container  p-2">
            <div 
              ref="Indicators3" 
              class="w-full h-full cursor-pointer"
              @click="openTimeDialog(1)"
            ></div>
          </div>
          
          <!-- 第四个图形 - 计划生产外时间 -->
          <div class="chart-container  p-2">
            <div 
              ref="Indicators4" 
              class="w-full h-full cursor-pointer"
              @click="openTimeDialog(2)"
            ></div>
          </div>
          
          <!-- 第五个图形 - 标准人效 -->
          <div class="chart-container  p-2">
            <div ref="Indicators5" class="w-full h-full"></div>
          </div>
          
          <!-- 第六个图形 - 实际人效 -->
          <div class="chart-container  relative">
            <div 
              ref="Indicators6" 
              class="w-full h-[100%] cursor-pointer"
              @click="openReasonDialog"
            ></div>
            <!-- 警告提示 -->
            <el-tooltip
              v-if="showWarning"
              :content="EfficentData.reason || '实际人效低于标准人效，可能原因：出勤人数不足、生产异常等'"
              placement="top"
              effect="dark"
            >
              <div class="absolute top-1 right-1 text-[#FFA000]">
                <el-icon><WarningFilled /></el-icon>
              </div>
            </el-tooltip>
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

    <!-- 时间详情对话框 -->
    <TimeDetailDialog
      v-model="timeDialogVisible"
      :time-type="currentTimeType"
      :Data="EfficentData"
      :prodLine="prodLineValue"
      @close="handleTimeDialogClose"
    />

  </div>
</template>

<script setup>
import { ref, onMounted,onBeforeUnmount,reactive ,nextTick, computed } from 'vue';
import * as echarts from 'echarts';
import DataCard from "@/components/DataCard.vue"; // 导入封装组件
import EffiectCard from "@/components/EffiectCard.vue"; // 导入封装组件
import { getEfficiencyToday, getEfficiencyBelowAdd } from '@/api/getProduceinfo';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
import BigScreenTitle from '@/components/title.vue'
import { createGaugeOption } from './gaugeChart';
import { useEcharts } from '@/utils/useEcharts';
import { WarningFilled } from '@element-plus/icons-vue'
import TimeDetailDialog from '@/views/Screen/components/TimeDetailDialog.vue'
const prodLineValue = ref('')
// 时间对话框相关状态
const timeDialogVisible = ref(false)
const currentTimeType = ref(1) // '1' 或 '2' 1:换型换线时间,2:计划生产外时间
// 定义数据
const config = reactive({
  value: 66,
})
const diffrentLine = (prodLine) => {
  const prefix = prodLine.slice(0, 4); // 取前4位

  switch (prefix) {
    case '1004':
      return 52;
    case '2004':
      return 30;
    case '1005':
      return 18;
    case '2005':
      return 13;
    default:
      return null; // 未匹配时返回 null 或默认值
  }
};


const EfficentData = reactive({
  standardEfficiency: null,
  efficiency: null,
  total: null,
  clTotal: null,
  scanNum: null,
  stanardNum: null,
  warning: 0,
  reason: '',
  reduceMinute_hx:0, // 换型换线时间
  reduceMinute_jhw:0// 计划生产外时间
});

// 计算属性：判断实际人效是否低于标准人效
const isEfficiencyLow = computed(() => {
  return EfficentData.efficiency < EfficentData.standardEfficiency;
});

const showWarning = computed(() => EfficentData.warning === 1);

const Indicators1 = ref(null);
const Indicators2 = ref(null);
const Indicators3 = ref(null);
const Indicators4 = ref(null);
const Indicators5 = ref(null);
const Indicators6 = ref(null);
const route = useRoute();
const prodLine = route.query.prodLine; // 通过 query 获取参数
prodLineValue.value = prodLine
const isLoading = ref(true);


const chart1 = useEcharts(Indicators1);
const chart2 = useEcharts(Indicators2);
const chart3 = useEcharts(Indicators3);
const chart4 = useEcharts(Indicators4);
const chart5 = useEcharts(Indicators5);
const chart6 = useEcharts(Indicators6);

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

  const option3 = createGaugeOption({
    text: "换型换线时间",
    data: EfficentData.reduceMinute_hx,
    max: Math.max(EfficentData.reduceMinute_hx * 1.5, 60) || 60, // 默认最大值60分钟
    unit: "分钟"
  });

  const option4 = createGaugeOption({
    text: "计划生产外时间",
    data: EfficentData.reduceMinute_jhw,
    max: Math.max(EfficentData.reduceMinute_jhw * 1.5, 60) || 60, // 默认最大值60分钟
    unit: "分钟"
  });

  const option5 = createGaugeOption({
    text: "标准人效",
    data: EfficentData.standardEfficiency,
    max: Math.max(EfficentData.standardEfficiency, EfficentData.efficiency)  || 0
  });

  const option6 = createGaugeOption({
    text: "实际人效",
    data: EfficentData.efficiency,
    max: Math.max(EfficentData.standardEfficiency, EfficentData.efficiency)  || 0
  });


  chart1.setOption(option1);
  chart2.setOption(option2);
  chart3.setOption(option3);
  chart4.setOption(option4);
  chart5.setOption(option5);
  chart6.setOption(option6);
};

const fetchData = async () => {

  const res = await getEfficiencyToday(prodLine);
  
  // 分别赋值，保持响应式
  EfficentData.standardEfficiency = Number(res.data.standardEfficiency) || 0;
  EfficentData.efficiency = Number(res.data.efficiency) || 0;
  
  EfficentData.total = res.data.total ?? 0;
  EfficentData.clTotal = res.data.clTotal ?? 0;
  EfficentData.scanNum = Number(res.data.scanNum) ?? 0;
  EfficentData.stanardNum = Number(res.data.stanardNum) ?? 0;
  EfficentData.warning = res.data.warning ?? 0;
  EfficentData.reason = res.data.reason || '';
  // 新增字段，如果API没有返回则使用模拟数据
  EfficentData.reduceMinute_hx = Number(res.data.reduceMinute_hx) ?? 0 ; 
  EfficentData.reduceMinute_jhw = Number(res.data.reduceMinute_jhw) ?? 0;
  EfficentData.reduceMinute_hx_reason = res.data.reduceMinute_hx_reason || '';
  EfficentData.reduceMinute_jhw_reason = res.data.reduceMinute_jhw_reason || '';
  isLoading.value = false;
  nextTick(() => {
    chart1.initChart();
    chart2.initChart();
    chart3.initChart();
    chart4.initChart();
    chart5.initChart();
    chart6.initChart();
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

  // 打开时间详情对话框
  function openTimeDialog(type) {
    currentTimeType.value = type;
    timeDialogVisible.value = true;
  }

  // 关闭时间详情对话框
  function handleTimeDialogClose() {
    timeDialogVisible.value = false;
  }


  // 获取当前时间值
  function getCurrentTimeValue() {
    if (currentTimeType.value === 1) {
      // 返回换型换线时间的当前值，这里可以从 EfficentData 中获取
      return EfficentData.reduceMinute_hx || 85;
    } else {
      // 返回计划生产外时间的当前值
      return EfficentData.reduceMinute_jhw || 45;
    }
  }
</script>


<style scoped>
.box1 {
  width: 25%;
  height: 20vw;
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