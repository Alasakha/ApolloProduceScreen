<template>
  <div class="relative w-full h-full flex flex-col bg-gradient-to-br from-blue-600/80 to-blue-800/80 rounded-2xl shadow-xl border-2 border-blue-400 overflow-hidden backdrop-blur-sm">
    <!-- 标题 -->
    <div class="w-full h-8 flex items-center justify-center text-white text-xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 shadow-md relative z-10">
      <span class="truncate">{{ orderName }}</span>
    </div>
    
    <!-- 右上角状态标签 -->
    <!-- <div v-if="status" 
         class="absolute top-3 right-4 px-4 py-2 rounded-full font-bold text-sm shadow-lg z-20 transform rotate-3"
         :class="getStatusClass(status)">
      {{ status }}
    </div> -->
    
    <!-- 主体内容 -->
    <div class="flex-1 flex flex-row gap-4 p-4 min-h-0">
      <!-- 左侧数量区块 - 已注释任务总数和已完成数 -->
      <!-- <div class="flex flex-col justify-center gap-4 w-28">
        <div class="flex flex-col items-center bg-blue-900/60 border-2 border-cyan-400/50 rounded-xl px-3 py-3 shadow-lg cursor-pointer hover:bg-blue-800/70 hover:border-cyan-300/70 transition-all duration-200"
             @click="handleTotalQtyClick">
          <div class="text-sm text-cyan-200 mb-1">任务总数量</div>
          <div class="text-3xl font-bold text-white drop-shadow-lg 3xl:text-xl 2xl:text-xl xl:text-sm">{{ totalQty }}</div>
        </div>
        <div class="flex flex-col items-center bg-blue-900/60 border-2 border-cyan-400/50 rounded-xl px-3 py-3 shadow-lg cursor-pointer hover:bg-blue-800/70 hover:border-cyan-300/70 transition-all duration-200" 
             @click="handleCompletedClick">
          <div class="text-sm text-cyan-200 mb-1">已完成数量</div>
          <div class="text-3xl font-bold text-white drop-shadow-lg  3xl:text-xl  2xl:text-xl xl:text-sm">{{ doneQty }}</div>
        </div>
      </div> -->
      
      <!-- 右侧设备统计区域 -->
      <div class="flex-1 flex flex-col justify-between min-w-0">
        <!-- 设备统计卡片 -->
        <div class="grid grid-cols-3 gap-3 mb-2">
          <!-- 设备组数量 -->
          <div class="bg-blue-700/50 border border-blue-400/50 rounded-lg p-3 text-center cursor-pointer hover:bg-blue-600/60 hover:border-blue-300/70 transition-all duration-200"
               @click="handleDeviceGroupClick">
            <div class="text-cyan-200 text-sm mb-1">设备组数量</div>
            <div class="text-2xl font-bold text-white">{{ deviceGroupCount  }}</div>
          </div>
          
          <!-- 开机数量 -->
          <div class="bg-green-600/50 border border-green-400/50 rounded-lg p-3 text-center cursor-pointer hover:bg-green-500/60 hover:border-green-300/70 transition-all duration-200" 
               @click="handleRunningClick">
            <div class="text-green-200 text-sm mb-1">运行数量</div>
            <div class="text-2xl font-bold text-white">{{ runningCount  }}</div>
          </div>
          
          <!-- 待机数量 -->
          <div class="bg-yellow-600/50 border border-yellow-400/50 rounded-lg p-3 text-center cursor-pointer hover:bg-yellow-500/60 hover:border-yellow-300/70 transition-all duration-200"
               @click="handleWaitingClick">
            <div class="text-yellow-200 text-sm mb-1">待机数量</div>
            <div class="text-2xl font-bold text-white">{{ waitingCount  }}</div>
          </div>

                    <!-- 待机数量 -->
                    <div class="bg-yellow-600/50 border border-yellow-400/50 rounded-lg p-3 text-center cursor-pointer hover:bg-yellow-500/60 hover:border-yellow-300/70 transition-all duration-200"
               @click="handleWaitingClick">
            <div class="text-yellow-200 text-sm mb-1">开机率</div>
            <div class="text-2xl font-bold text-white">{{ Math.round(runningCount/deviceGroupCount*100)   }}%</div>
          </div>
        </div>
        
        <!-- 设备组进度条区域 - 已注释进度条 -->
        <!-- <div class="bg-blue-800/40 border border-blue-400/50 rounded-xl p-4">
          <div class="text-cyan-200 text-center mb-3 font-semibold">设备组进度条</div>
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <span class="text-white text-sm w-12">进度:</span>
              <div class="flex-1 h-4 bg-blue-900/60 rounded-full overflow-hidden border border-blue-400/30">
                <div class="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transition-all duration-500 shadow-sm" 
                     :style="{ width: progress + '%' }"></div>
              </div>
              <span class="text-white text-sm font-bold w-12 text-right">{{ progress }}%</span>
            </div>
          </div>
        </div> -->
        
        <!-- 设备参数已移除 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
})

// 定义事件发射 - 已注释任务总数和已完成数相关事件
const emit = defineEmits(['click-running', 'click-device-group', 'click-waiting'])
// 注释掉的任务总数和已完成数事件: 'click-completed', 'click-total-qty'



// 从data中提取各个字段 - 已注释任务总数、已完成数和进度条相关字段
const orderName = computed(() => props.data.orderName || '未知设备组')
// 注释掉的字段: totalQty, doneQty, progress
// const totalQty = computed(() => props.data.qty_total || 0)
// const doneQty = computed(() => props.data.num_total || 0)
// const progress = computed(() => props.data.progress || 0)
const gdNum = computed(() => props.data.gdNum || 1)
const deviceGroupCount = computed(() => props.data.machine_count || 0)
const runningCount = computed(() => props.data.doing_count || 0)
const waitingCount = computed(() => Math.max(0, (props.data.machine_count || 0) - (props.data.doing_count || 0)))

// 点击事件处理函数 - 已注释任务总数和已完成数相关事件
const handleRunningClick = () => {
  emit('click-running', props.data)
}

// 注释掉的已完成数和任务总数点击事件
// const handleCompletedClick = () => {
//   emit('click-completed', props.data)
// }

// const handleTotalQtyClick = () => {
//   emit('click-total-qty', props.data)
// }

const handleDeviceGroupClick = () => {
  emit('click-device-group', props.data)
}

const handleWaitingClick = () => {
  emit('click-waiting', props.data)
}

// 设备组逻辑已简化
</script>

<style scoped>
/* 添加一些微妙的动画效果 */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* 进度条发光效果 */
.h-3 .bg-gradient-to-r,
.h-2 .bg-gradient-to-r {
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.4);
}

/* 卡片悬停效果 */
.relative:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

/* 状态标签动画 */
.absolute.top-3 {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>