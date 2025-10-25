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
              <div 
                ref="Indicators5" 
                class="w-full h-[100%] cursor-pointer"
                @click="openNighttimeAttendanceDialog"
              ></div>
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



      <!-- 出勤人员信息弹窗 -->
      <el-dialog v-model="daytimeAttendanceDialogVisible" title="出勤人员信息" width="70%" :z-index="99999999">
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <div 
              v-for="(member, index) in attendanceData" 
              :key="index"
              class="attendance-item p-3 border rounded hover:bg-gray-50 text-center cursor-pointer transition-all duration-200 hover:shadow-md"
              @click="openReasonInfoDialog(member)"
            >
              <div class="flex flex-col items-center space-y-2">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
                  {{ member.name ? member.name.charAt(0) : '?' }}
                </div>
                <div class="text-center w-full">
                  <div class="font-medium text-gray-800 mb-2">{{ member.name || '未知姓名' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>

         <!-- 出勤人员信息弹窗 -->
         <el-dialog v-model="nighttimeAttendanceDialogVisible" title="出勤人员信息" width="70%" :z-index="99999999">
        <div v-if="attendanceLoading" class="text-center py-8">
          <dv-loading>Loading...</dv-loading>
        </div>
        <div v-else-if="nighttimeAttendanceData.length === 0" class="text-center py-8 text-gray-500">
          暂无出勤人员数据
        </div>
        <div v-else class="attendance-list">
          <div class="attendance-header mb-4 p-3 bg-gray-100 rounded">
            <span class="font-bold">生产线：{{ prodLine }}</span>
            <span class="ml-4 font-bold">晚班人数：{{ nighttimeAttendanceData.length }}人</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <div 
              v-for="(member, index) in nighttimeAttendanceData" 
              :key="index"
              class="attendance-item p-3 border rounded hover:bg-gray-50 text-center cursor-pointer transition-all duration-200 hover:shadow-md"
              @click="openReasonInfoDialog(member)"
            >
              <div class="flex flex-col items-center space-y-2">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
                  {{ member.name ? member.name.charAt(0) : '?' }}
                </div>
                <div class="text-center w-full">
                  <div class="font-medium text-gray-800 mb-2">{{ member.name || '未知姓名' }}</div>
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
import { getEfficiencyToday, getSignInMember } from '@/api/getProduceinfo';

import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
import { createGaugeOption } from '../newdesign/Line2/component/gaugeChart';
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
  nightNum: null, // 晚班人数
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
const daytimeAttendanceDialogVisible = ref(false);
const nighttimeAttendanceDialogVisible = ref(false);
const attendanceLoading = ref(false);
const attendanceData = ref([]);
const nighttimeAttendanceData = ref([]);

// Reason信息弹窗相关状态
const reasonInfoDialogVisible = ref(false);

const selectedDevice = ref(null);
const newReason = ref('');
const feedbackMessage = ref('');

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
    data: EfficentData.scanNum - EfficentData.nightNum,  
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
    data:  EfficentData.nightNum, 
    max: EfficentData.stanardNum
  });

  chart1.setOption(option1);
  chart2.setOption(option2);
  chart3.setOption(option3);
  chart4.setOption(option4);
  chart5.setOption(option5);
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
  EfficentData.nightNum = res.data.nightNum ?? 0;
  
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

// async function submitReason() {
//   await getEfficiencyBelowAdd(prodLine, customReason.value);
//   reasonDialogVisible.value = false;
//   fetchData();
// }

// 打开出勤人员弹窗
async function openAttendanceDialog() {
  daytimeAttendanceDialogVisible.value = true;
  attendanceLoading.value = true;
  
  try {
    const res = await getSignInMember(prodLine);
    const dayData = res.data.daytime;
    console.log('dayData:', dayData);
    if (dayData && Array.isArray(dayData)) {
      console.log('res.data:', res.data);
      // 将姓名数组转换为对象数组，添加默认值
      attendanceData.value = dayData.map(name => ({
        name: name,
        employeeId: '未知工号',
        department: '未知部门',
        reason: '暂无原因说明', // 添加默认的reason字段
        macNo: name // 使用姓名作为临时的macNo，实际应该从API获取
      }));
    } else {
      attendanceData.value = [];
    }
  } catch (error) {
    console.error('获取出勤人员信息失败:', error);
    attendanceData.value = [];
  } finally {
    attendanceLoading.value = false;
  }
}

// 打开晚班出勤人员弹窗
async function openNighttimeAttendanceDialog() {
  nighttimeAttendanceDialogVisible.value = true;
  attendanceLoading.value = true;
  
  try {
    const res = await getSignInMember(prodLine);
    const nightData = res.data.nighttime;
    console.log('nightData:', nightData);
    if (nightData && Array.isArray(nightData)) {
      console.log('res.data:', res.data);
      // 将姓名数组转换为对象数组，添加默认值
      nighttimeAttendanceData.value = nightData.map(name => ({
        name: name,
        employeeId: '未知工号',
        department: '未知部门',
        reason: '暂无原因说明', // 添加默认的reason字段
        macNo: name // 使用姓名作为临时的macNo，实际应该从API获取
      }));
    } else {
      nighttimeAttendanceData.value = [];
    }
  } catch (error) {
    console.error('获取晚班出勤人员信息失败:', error);
    nighttimeAttendanceData.value = [];
  } finally {
    attendanceLoading.value = false;
  }
}

// 打开Reason信息弹窗
async function openReasonInfoDialog(device) {
  selectedDevice.value = device;
  newReason.value = ''; // 清空新Reason
  feedbackMessage.value = ''; // 清空回写信息
  reasonInfoDialogVisible.value = true;
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

/* Reason信息弹窗样式 */
.reason-info-content {
  color: #333;
}

.info-header {
  background: linear-gradient(135deg, #e0f2fe, #b3e5fc);
  border: 1px solid #81d4fa;
}

.info-section {
  border-left: 4px solid #2196f3;
  padding-left: 16px;
}

.section-title {
  color: #1976d2;
  border-bottom: 2px solid #e3f2fd;
  padding-bottom: 8px;
}

.reason-content {
  background: linear-gradient(135deg, #f5f5f5, #eeeeee);
  border: 1px solid #e0e0e0;
}

.feedback-content {
  background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
  border: 1px solid #a5d6a7;
}

/* 出勤人员卡片样式增强 */
.attendance-item {
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.attendance-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #2196f3;
}

.attendance-item .text-sm {
  font-size: 12px;
  line-height: 1.4;
  word-break: break-word;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>