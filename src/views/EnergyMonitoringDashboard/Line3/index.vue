<template>
  <div class="h-[10vh] w-full ">
    <dv-border-box-2 >
        <div class="flex w-full h-full justify-between">
            <div v-for="item in data" class=" flex flex-col items-center justify-center h-full ">
                  <div class="text-[#00eeff] text-base sm:text-lg md:text-xl 3xl:text-xl 4xl:text-lg  flex items-center">
            {{item.category}}
            <span :class="{'text-red-500': item.ratio.startsWith('↑'), 'text-green-500': item.ratio.startsWith('↓')}" class="ml-2">
              {{item.ratio}}
            </span>
          </div>
        <!-- <div class="flex justify-center items-center gap-8 felx-col"> -->
          <div class="flex items-center">
            <span class="text-white  text-sm sm:text-base md:text-lg 3xl:text-sm 4xl:text-lg">标准耗电：</span>
            <dv-digital-flop :config="{
              number: [item.standardConsumption],
              content: '{nt}kW/h',
              style: {
                fontSize: getFontSize(),
                fill: '#00eeff'
              }
            }" />
          </div>
          <div class="flex items-center">
            <span class="text-white  text-sm sm:text-base md:text-lg 3xl:text-sm 4xl:text-lg">实际耗电：</span>
            <dv-digital-flop :config="{
              number: [item.actualConsumption],
              content: '{nt}kW/h',
              style: {
                fontSize: getFontSize(),
                fill: '#00eeff'
              }
            }" />
          </div>
      </div>
        </div>

    </dv-border-box-2>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'

const data = reactive([
  {
    category: '空压机',
    standardConsumption: 0,
    actualConsumption: 0,
    ratio: '='
  },
  {
    category: '注塑',
    standardConsumption: 0,
    actualConsumption: 0,
    ratio: '='
  },
  {
    category: '焊接',
    standardConsumption: 0,
    actualConsumption: 0,
    ratio: '='
  },
  {
    category: '金工一楼',
    standardConsumption: 0,
    actualConsumption: 0,
    ratio: '='
  },
  {
    category: '金工四楼',
    standardConsumption: 0,
    actualConsumption: 0,
    ratio: '='
  },
  {
    category: '冲压',
    standardConsumption: 0,
    actualConsumption: 0,
    ratio: '='
  },
  {
    category: '宿舍',
    standardConsumption: 0,
    actualConsumption: 0,
    ratio: '='
  },
  {
    category: '包装',
    standardConsumption: 0,
    actualConsumption: 0,
    ratio: '='
  },
  {
    category: '装配',
    standardConsumption: 0,
    actualConsumption: 0,
    ratio: '='
  }
])

// 更新数据
const updateData = () => {
  data.forEach(item => {
    item.standardConsumption = Math.floor(Math.random() * 2000)
    item.actualConsumption = Math.floor(Math.random() * 2000)
    item.ratio = item.standardConsumption > item.actualConsumption 
      ? '↑' + (item.standardConsumption - item.actualConsumption).toFixed(1)
      : item.standardConsumption < item.actualConsumption
        ? '↓' + (item.actualConsumption - item.standardConsumption).toFixed(1)
        : '='
  })
}

let timer: number | null = null

// 获取当前窗口宽度
const windowWidth = ref(window.innerWidth)

// 计算数字翻牌器的字体大小
const getFontSize = () => {
  if (windowWidth.value >= 2500) { // 4xl
    return 25
  } else if (windowWidth.value >= 1850) { // 3xl
    return 13
  } else if (windowWidth.value >= 1536) { // 2xl
    return 26
  } else if (windowWidth.value >= 1280) { // xl
    return 24
  } else if (windowWidth.value >= 1024) { // lg
    return 22
  } else if (windowWidth.value >= 768) { // md
    return 20
  } else if (windowWidth.value >= 640) { // sm
    return 18
  } else {
    return 16
  }
}

// 监听窗口大小变化
const updateWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  updateData()
  timer = window.setInterval(updateData, 3000)
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  window.removeEventListener('resize', updateWidth)
})
</script>

<style scoped>
:deep(.dv-digital-flop) {
  width: 140px;
  height: 40px;
}

/* 响应式调整数字翻牌器尺寸 */
@media (min-width: 1850px) {
  :deep(.dv-digital-flop) {
    width: 160px;
    height: 45px;
  }
}

@media (min-width: 2500px) {
  :deep(.dv-digital-flop) {
    width: 180px;
    height: 50px;
  }
}
</style>