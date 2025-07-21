<template>
  <div class="relative w-full h-full flex flex-col bg-white/10 rounded-2xl shadow-xl border-2 border-blue-500 overflow-visible">
    <!-- 标题 -->
    <div class="w-full h-10 flex items-center justify-center text-white text-lg font-bold tracking-wider bg-gradient-to-r from-blue-600 to-cyan-400 rounded-t-2xl shadow-md relative z-10">
      <span class="truncate">{{ orderName }}</span>
    </div>
    <!-- 右上角角标 -->
    <div v-if="status" class="absolute top-2 right-4 bg-yellow-400 text-white font-bold text-xs px-3 py-1 rounded-lg shadow rotate-6 border border-yellow-100 z-20">
      {{ status }}
    </div>
    <!-- 主体内容 -->
    <div class="flex-1 flex flex-row gap-4  p-3 min-h-0 min-w-0">
      <!-- 左侧数量区块 -->
      <div class="flex flex-col justify-around items-center gap-4 w-24 min-w-[5rem]">
        <div class="flex flex-col items-center bg-blue-900/60 border border-blue-400 rounded-lg px-2 py-1 w-full">
          <div class="text-sm text-blue-200">任务总数量</div>
          <div class="text-2xl font-bold text-white drop-shadow">{{ totalQty }}</div>
        </div>
        <div class="flex flex-col items-center bg-blue-900/60 border border-blue-400 rounded-lg px-2 py-1 w-full">
          <div class="text-sm text-blue-200">已完成数量</div>
          <div class="text-2xl font-bold text-white drop-shadow">{{ doneQty }}</div>
        </div>
      </div>
      <!-- 右侧详细信息 -->
      <div class="flex-1 flex flex-col  min-w-0">
        <!-- 工单信息和进度条 -->
        <div class="mb-2 h-[40%] flex flex-col justify-around">
          <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-white mb-1 h-[70%]" >
            <span>品号：{{ ta006 || '暂无数据' }}</span>
            <span>品名：{{ spec }}</span>
            <span>规格：{{ spen }}</span>
            <span v-if="gdNum">工单数：{{ gdNum }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex-1 h-2 bg-blue-300 rounded h-[30%]">
              <div class="h-2 bg-yellow-400 rounded transition-all duration-500 " :style="{ width: progress + '%' }"></div>
            </div>
            <span class="text-white text-sm font-bold w-12 text-right">{{ progress }}%</span>
          </div>
        </div>
        <!-- 参数区块 -->
        <div class="grid grid-cols-1 gap-x-4 gap-y-1 text-sm text-white h-[60%] ">
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

        </div>
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
    <div v-if="allWarnings.length > 0" class="absolute left-2 top-2 bg-yellow-100/80 border border-yellow-400 rounded-lg px-3 py-2 text-yellow-800 text-xs z-30 shadow">
      <div class="font-bold mb-1 flex items-center gap-1"><span>⚠</span>警告</div>
      <ul class="list-disc pl-4">
        <li v-for="(warning, index) in allWarnings" :key="index">{{ warning }}</li>      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

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
    default: null
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
  }
});

//判断是否有数据
// 判断是否有标准数据
const hasStrandData = value => {
  const num = Number(value);
  if (!num) return "暂无标准";
  return "标准：" + num.toFixed(1);
};

// 判断是否有实际数据
const hasActualData = value => {
  const num = Number(value);
  if (!num) return "暂无数据";
  return "实际值：" + num.toFixed(1);
};

// 合并的警告逻辑
const allWarnings = computed(() => {
  if (props.status !== "加工中") {
    return [];
  }

  const warnings = [];

  // 检查温度
  if (hasStrandData(props.stdTemperature) === "暂无标准") {
    warnings.push("温度：暂无标准");
  } else if (props.temperature) {
    const diff = Math.abs(Number(props.temperature) - Number(props.stdTemperature));
    if (diff > 20) {
      warnings.push(`温度超出偏差 (偏差: ${diff.toFixed(1)}℃)`);
    }
  }

  // 检查压力
  if (hasStrandData(props.stdPressure) === "暂无标准") {
    warnings.push("压力：暂无标准");
  } else if (props.pressure) {
    const diff = Math.abs(Number(props.pressure) - Number(props.stdPressure));
    if (diff > 20) {
      warnings.push(`压力超出偏差 (偏差: ${diff.toFixed(1)}MPa)`);
    }
  }

  // 检查射速
  if (hasStrandData(props.stdMaxspeed) === "暂无标准") {
    warnings.push("射速：暂无标准");
  } else if (props.maxspeed) {
    const diff = Math.abs(Number(props.maxspeed) - Number(props.stdMaxspeed));
    if (diff > 20) {
      warnings.push(`射速超出偏差 (偏差: ${diff.toFixed(1)}mm/s)`);
    }
  }

  // 检查保压时间
  if (hasStrandData(props.stdKeeptime) === "暂无标准") {
    warnings.push("保压时间：暂无标准");
  } else if (props.keeptime) {
    const diff = Math.abs(Number(props.keeptime) - Number(props.stdKeeptime));
    if (diff > 20) {
      warnings.push(`保压时间超出偏差 (偏差: ${diff.toFixed(1)}s)`);
    }
  }
  return warnings;
});
</script>

