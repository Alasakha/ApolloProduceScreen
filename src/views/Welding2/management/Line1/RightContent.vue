<template>
    <div class="efficency w-[25%]">
      <dv-border-box12>
        <div v-if="isLoading" class="w-full h-[85%] text-white">
          <dv-loading>Loading...</dv-loading>
        </div>
        <div v-if="!isLoading" class="w-full h-[95%] p-3 flex justify-start">
          <!-- 左侧两个仪表盘 -->
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

          <!-- 右侧两个仪表盘 -->
          <div class="line flex-2 flex">
            <!-- 标准人效 -->
            <div class="biaozhun flex-1">
              <div ref="Indicators3" class="w-full h-[100%]"></div>
            </div>
            <!-- 实际人效 -->
            <div class="shiji flex-1">
              <div 
                ref="Indicators4" 
                class="w-full h-[100%]"
                @click="openReasonDialog"
                style="cursor: pointer;"
              ></div>
              <!-- 警告图标 -->
              <div v-if="showWarning" class="warning-icon-container">
                <el-tooltip
                  :content="EfficentData.reason || '实际人效低于标准人效，可能原因：出勤人数不足、生产异常等'"
                  placement="left"
                  effect="dark"
                >
                  <svg class="warn-icon" width="38" height="38" viewBox="0 0 24 24">
                    <polygon points="12,3 22,20 2,20" fill="#FFD600" stroke="#FFA000" stroke-width="2"/>
                    <rect x="11" y="9" width="2" height="5" fill="#FFA000"/>
                    <rect x="11" y="16" width="2" height="2" fill="#FFA000"/>
                  </svg>
                </el-tooltip>
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
import { ref, onMounted, onBeforeUnmount, reactive, nextTick, computed } from 'vue';
import { getEfficiencyToday, getEfficiencyBelowAdd } from '@/api/getProduceinfo';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
import { createGaugeOption } from './gaugeChart';
import { useEcharts } from '@/utils/useEcharts';
// import { WarningFilled } from '@element-plus/icons-vue'

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

const showWarning = computed(() => EfficentData.warning === 1);

const Indicators1 = ref(null);
const Indicators2 = ref(null);
const Indicators3 = ref(null);
const Indicators4 = ref(null);

const route = useRoute();
const prodLine = route.query.prodLine;
const isLoading = ref(true);

const chart1 = useEcharts(Indicators1);
const chart2 = useEcharts(Indicators2);
const chart3 = useEcharts(Indicators3);
const chart4 = useEcharts(Indicators4);

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
    text: "标准人效",
    data: EfficentData.standardEfficiency,
    max: Math.max(EfficentData.standardEfficiency, EfficentData.standardEfficiency) || 100
  });

  const option4 = createGaugeOption({
    text: "实际人效",
    data: EfficentData.efficiency,
    max: Math.max(EfficentData.standardEfficiency, EfficentData.efficiency) || 100
  });

  chart1.setOption(option1);
  chart2.setOption(option2);
  chart3.setOption(option3);
  chart4.setOption(option4);
};

const fetchData = async () => {
  const res = await getEfficiencyToday('1003');
  console.log('res:', res);
  
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
    chart3.initChart();
    chart4.initChart();
    drawChart();
  });
};

onMounted(() => {
  fetchData();
  eventBus.on("refreshData", fetchData);
});

onBeforeUnmount(() => {
  eventBus.off("refreshData", fetchData);
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
  fetchData();
}
</script>

<style scoped>
.efficency {
  width: 25%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  font-size: 18px;
  color: aliceblue;
}

.warning-icon-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}

.warn-icon {
  vertical-align: middle;
  margin-left: 4px;
  transform: translateY(-1px);
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

.line {
  position: relative;
}

.shiji {
  position: relative;
}
</style>