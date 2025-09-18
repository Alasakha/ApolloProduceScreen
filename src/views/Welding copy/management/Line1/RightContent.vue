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
              <div 
                ref="Indicators2" 
                class="w-full h-[100%] cursor-pointer"
                @click="openAttendanceDialog"
              ></div>
            </div>
            <!-- 晚班人数 -->
             <div class="peizhi flex-1">
              <div ref="Indicators5" class="w-full h-[100%]"></div>
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

      <!-- 出勤人员信息弹窗 -->
      <el-dialog v-model="attendanceDialogVisible" title="出勤人员信息" width="70%" :z-index="99999999">
        <div v-if="attendanceLoading" class="text-center py-8">
          <dv-loading>Loading...</dv-loading>
        </div>
        <div v-else-if="attendanceData.length === 0" class="text-center py-8 text-gray-500">
          暂无出勤人员数据
        </div>
        <div v-else class="attendance-list">
          <div class="attendance-header mb-4 p-3 bg-gray-100 rounded">
            <span class="font-bold">生产线：{{ prodLine }}</span>
            <span class="ml-4 font-bold">白班人数：{{ attendanceData.length }}人</span>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            <div 
              v-for="(member, index) in attendanceData" 
              :key="index"
              class="attendance-item p-3 border rounded hover:bg-gray-50 text-center"
            >
              <div class="flex flex-col items-center space-y-2">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
                  {{ member.name ? member.name.charAt(0) : '?' }}
                </div>
                <div class="text-center">
                  <div class="font-medium text-gray-800">{{ member.name || '未知姓名' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, reactive, nextTick, computed } from 'vue';
import { getEfficiencyToday, getEfficiencyBelowAdd, getSignInMember } from '@/api/getProduceinfo';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
import { createGaugeOption } from './gaugeChart';
import { useEcharts } from '@/utils/useEcharts.js';
// import { WarningFilled } from '@element-plus/icons-vue'

const EfficentData = reactive({
  standardEfficiency: null,
  efficiency: null,
  total: null,
  clTotal: null,
  scanNum: null,
  stanardNum: null,
  nightNum: null, // 晚班人数
  warning: 0,
  reason: '',
});

const showWarning = computed(() => EfficentData.warning === 1);

const Indicators1 = ref(null);
const Indicators2 = ref(null);
const Indicators3 = ref(null);
const Indicators4 = ref(null);
const Indicators5 = ref(null);
const route = useRoute();
const prodLine = route.query.prodLine;
const isLoading = ref(true);

// 出勤人员对话框相关状态
const attendanceDialogVisible = ref(false);
const attendanceLoading = ref(false);
const attendanceData = ref([]);

const chart1 = useEcharts(Indicators1);
const chart2 = useEcharts(Indicators2);
const chart3 = useEcharts(Indicators3);
const chart4 = useEcharts(Indicators4);
const chart5 = useEcharts(Indicators5);

const drawChart = () => {
  const option1 = createGaugeOption({
    text: "配置人数",
    data: EfficentData.stanardNum,
    max: EfficentData.stanardNum
  });

  const option2 = createGaugeOption({
    text: "白班人数",
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

  const option5 = createGaugeOption({
    text: "晚班人数",
    data: EfficentData.nightNum || 0,
    max: EfficentData.stanardNum || 100
  });

  chart1.setOption(option1);
  chart2.setOption(option2);
  chart3.setOption(option3);
  chart4.setOption(option4);
  chart5.setOption(option5);
};

const fetchData = async () => {
  const res = await getEfficiencyToday(prodLine);
  console.log('res:', res);
  
  EfficentData.standardEfficiency = Number(res.data.standardEfficiency) || 0;
  EfficentData.efficiency = Number(res.data.efficiency) || 0;
  EfficentData.total = res.data.total ?? 0;
  EfficentData.clTotal = res.data.clTotal ?? 0;
  EfficentData.scanNum = Number(res.data.scanNum) ?? 0;
  EfficentData.stanardNum = Number(res.data.stanardNum) ?? 0;
  EfficentData.nightNum = Number(res.data.nightNum) ?? 0;
  EfficentData.warning = res.data.warning ?? 0;
  EfficentData.reason = res.data.reason || '';
  
  isLoading.value = false;
  nextTick(() => {
    chart1.initChart();
    chart2.initChart();
    chart3.initChart();
    chart4.initChart();
    chart5.initChart();
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

// 打开出勤人员弹窗
async function openAttendanceDialog() {
  attendanceDialogVisible.value = true;
  attendanceLoading.value = true;
  
  try {
    const res = await getSignInMember(prodLine);
    console.log('出勤人员接口原始响应:', res);
    
    // 根据新的接口格式，人员信息在 res.data.daytime 中
    let memberList = [];
    if (res.data && res.data.daytime) {
      memberList = res.data.daytime;
    }
    
    console.log('提取的成员列表:', memberList);
    
    if (memberList.length > 0) {
      // 将姓名数组转换为标准格式
      attendanceData.value = memberList.map(name => ({
        name: name,
        employeeId: '未知工号',
        department: '未知部门'
      }));
    } else {
      attendanceData.value = [];
    }
    
    console.log('处理后的出勤数据:', attendanceData.value);
  } catch (error) {
    console.error('获取出勤人员信息失败:', error);
    attendanceData.value = [];
  } finally {
    attendanceLoading.value = false;
  }
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