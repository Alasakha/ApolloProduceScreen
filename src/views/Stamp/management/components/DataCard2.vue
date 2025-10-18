<template>
  <div class="relative w-full h-full flex flex-col bg-white/10 rounded-2xl shadow-xl border-2 border-blue-500 overflow-visible">
    <!-- 标题 -->
    <div class="w-full h-7 flex items-center justify-center text-white text-lg font-bold tracking-wider bg-gradient-to-r from-blue-600 to-cyan-400 rounded-t-2xl shadow-md relative z-10">
      <span class="truncate">{{ orderName }}</span>
      <span class="absolute left-2 text-xs text-white">设备编号: {{ workNo }}</span>
    </div>
    <!-- 右上角角标 -->
    <div v-if="status" :class="statusColorClass" class="absolute top-2 right-4 text-white font-bold text-xs px-3 py-1 rounded-lg shadow rotate-6 border z-20">
      {{ status }}
    </div>
    <!-- 主体内容 -->
    <div class="flex-1 flex flex-row gap-4  p-3 min-h-0 min-w-0">
      <!-- 左侧数量区块 -->
      <div class="flex flex-col justify-around items-center gap-4 w-24 min-w-[5rem]">
        <div class="flex flex-col items-center bg-blue-900/60 border border-blue-400 rounded-lg px-2 py-1 w-full ">
          <div class="text-sm text-blue-200 3xl:text-[12px] 2xl:text-[10px] 1xl:text[8px]">任务总数量</div>
          <div class="text-xl font-bold text-white drop-shadow 3xl:text-[12px] 2xl:text-[10px] xl:text[8px]">{{ totalQty }}</div>
        </div>
        <div class="flex flex-col items-center bg-blue-900/60 border border-blue-400 rounded-lg px-2 py-1 w-full">
          <div class="text-sm text-blue-200 3xl:text-[12px] 2xl:text-[10px] 1xl:text[8px]">已完成数量</div>
          <div class="text-xl font-bold text-white drop-shadow 3xl:text-[12px] 2xl:text-[10px] xl:text[8px]">{{ doneQty }}</div>
        </div>
      </div>
      <!-- 右侧详细信息 -->
      <div class="flex flex-col min-w-0 h-full flex-1">
        <!-- 工单信息 - 四宫格布局 -->
        <div class="flex-1 flex flex-col justify-between py-2">
          <div class="grid grid-cols-2 gap-3 text-sm text-white mb-4">
            <div class="flex flex-col space-y-1">
              <span class="text-blue-200 text-xs">品号</span>
              <span class="text-white truncate">{{ ta006 || '暂无数据' }}</span>
            </div>
            <div class="flex flex-col space-y-1">
              <span class="text-blue-200 text-xs">品名</span>
              <span class="text-white truncate">{{ spec || '暂无数据' }}</span>
            </div>
            <div class="flex flex-col space-y-1">
              <span class="text-blue-200 text-xs">规格</span>
              <span class="text-white truncate">{{ spen || '暂无数据' }}</span>
            </div>
            <div class="flex flex-col space-y-1">
              <span class="text-blue-200 text-xs">上机人员</span>
              <span class="text-white truncate">{{ peopleName || '暂无数据' }}</span>
            </div>
          </div>
          
          <!-- 工单数单独显示 -->
          <!-- <div v-if="gdNum" class="mb-4 text-center">
            <span class="text-blue-200 text-sm">工单数：</span>
            <span class="text-white text-lg font-bold">{{ gdNum }}</span>
          </div> -->
          
          <!-- 进度条单独一行 -->
          <div class="flex items-center gap-3">
            <div class="flex-1 h-3 bg-blue-300/30 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500 ease-out" 
                :style="{ width: progress + '%' }"
              ></div>
            </div>
            <span class="text-white text-sm font-bold min-w-[3rem] text-right">{{ progress }}%</span>
          </div>
        </div>
        <!-- 参数区块 -->
        <!-- <div class="grid grid-cols-1 gap-x-4 gap-y-1 text-sm text-white h-[60%] ">
          <div class="flex justify-between items-center">
            <span class="text-blue-200"> 激光功率</span>
            <span class="text-yellow-300">标准: {{ stdTemperature ?? '暂无' }}</span>
            <span class="text-cyan-300">实际: {{ temperature ?? '暂无' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-blue-200">切割速度</span>
            <span class="text-yellow-300">标准: {{ stdMaxspeed ?? '暂无' }}</span>
            <span class="text-cyan-300">实际: {{ maxspeed ?? '暂无' }}</span>
          </div>

        </div> -->
        <!-- 能耗监控 -->
        <!-- <div v-if="device && device.hourBetween && device.power" class="bg-blue-900/70 rounded p-2 text-xs text-blue-100 ">
          <div class="font-bold text-cyan-300 mb-1">能耗监控</div>  
          <div class="gird grid grid-cols-2 grid-rows-2">
            <div>开机时长: {{ device.hourBetween }}h</div>
          <div>设备功耗: {{ device.power }}</div>
          <div>标准耗电量: {{ (Number(device.power.replace('kw', '')) * Number(device.hourBetween)).toFixed(2) }} kw·h</div>
          <div>实际耗电量: --</div>
        </div>
        </div> -->
      </div>
    </div>
    <!-- 警告区域 -->
    <!-- <div v-if="allWarnings.length > 0" class="absolute left-2 top-2 bg-yellow-100/80 border border-yellow-400 rounded-lg px-3 py-2 text-yellow-800 text-xs z-30 shadow">
      <div class="font-bold mb-1 flex items-center gap-1"><span>⚠</span>警告</div>
      <ul class="list-disc pl-4">
        <li v-for="(warning, index) in allWarnings" :key="index">{{ warning }}</li>      </ul>
    </div> -->
  </div>
</template>

<script setup>
import { watch } from "vue";
import { computed, ref } from "vue";

const props = defineProps({
  orderName: {
    type: String,
    default: ""
  },
  totalQty: {
    type: [Number, String],
    default: 0
  },
  doneQty: {
    type: [Number, String],
    default: 0
  },
  finishDate: String,
  storage: String,
  spec: {
    type: String,
    default: ""
  },
  progress: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: ""
  },
  category: String,
  temperature: {
    type: [Number, String],
    default: null
  },
  pressure: {
    type: [Number, String],
    default: null
  },
  maxspeed: {
    type: [Number, String],
    default: null
  },
  keeptime: {
    type: [Number, String],
    default: null
  },
  // 添加标准参数
  stdTemperature: {
    type: [Number, String],
    default: "暂无"
  },
  stdPressure: {
    type: [Number, String],
    default: null
  },
  stdMaxspeed: {
    type: [Number, String],
    default: "暂无"
  },
  stdKeeptime: {
    type: [Number, String],
    default: "暂无"
  },
  macName: {
    type: [String],
    default: "暂无"
  },
  spen: {
    type: String,
    default: "暂无"
  },
  dayRunTime: {
    type: [Number, String],
    default: "暂无"
  },
  power: {
    type: [Number, String],
    default: "暂无"
  },
  dayPower: {
    type: [Number, String],
    default: "暂无"
  },
  ta006: {
    type: [Number, String],
    default: "暂无"
  },
  gdNum: {
    type: [Number, String],
    default: "暂无"
  },
  device: {
    type: Object,
    default: () => ({})
  },
  workNo: {
    type: [Number, String],
    default: "暂无"
  },
  peopleName: {
    type: String,
    default: "暂无"
  }
});

// 状态颜色计算属性
const statusColorClass = computed(() => {
  switch (props.status) {
    case '闲置':
      return 'bg-yellow-400 border-yellow-100';
    case '运行中':
      return 'bg-green-500 border-green-100';
    case '维修中':
      return 'bg-red-500 border-red-100';
    default:
      return 'bg-gray-400 border-gray-100';
  }
});

// // 改用计算属性
// const allWarnings = computed(() => {
//   const warnings = [];
  
//   // 检查激光功率
//   if (props.stdTemperature === "暂无") {
//     warnings.push("激光功率：暂无标准");
//   } else if (props.temperature && props.stdTemperature) {
//     const diff = Math.abs(Number(props.temperature) - Number(props.stdTemperature));
//     if (diff > 20) {
//       warnings.push(`激光功率超出偏差 (偏差: ${diff.toFixed(1)}℃)`);
//     }
//   }
  
//   // 检查切割速度
//   if (props.stdMaxspeed === "暂无") {
//     warnings.push("切割速度：暂无标准");
//   } else if (props.maxspeed && props.stdMaxspeed) {
//     const diff = Math.abs(Number(props.maxspeed) - Number(props.stdMaxspeed));
//     if (diff > 20) {
//       warnings.push(`切割速度超出偏差 (偏差: ${diff.toFixed(1)}mm/s)`);
//     }
//   }
  
//   return warnings;
// });
</script>

