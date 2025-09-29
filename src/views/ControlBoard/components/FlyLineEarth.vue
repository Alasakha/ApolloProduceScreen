<template>
  <div class="fly-line-earth">
    <!-- 标题栏 -->
    <!-- <div class="title-bar">
      <div class="title-content px-3 py-2 lg:px-6 lg:py-4">
        <h1 class="main-title text-lg lg:text-xl xl:text-2xl">中控大屏看板</h1>
      </div>
    </div> -->
    
    <div ref="earthContainer" class="earth-container" id="container"></div>
    
    <!-- 加载进度条 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="progress-bar">
          <div class="progress" :style="{ width: loadingProgress + '%' }"></div>
        </div>
        <div class="loading-text">加载中... {{ Math.round(loadingProgress) }}%</div>
      </div>
    </div>
    
    <!-- 控制面板 -->
    <div v-if="showControls" class="controls-panel">
      <div class="control-group">
        <label>自动旋转: {{ autoRotate ? '开启' : '关闭' }}</label>
        <input 
          type="checkbox" 
          v-model="autoRotate"
          @change="updateAutoRotate"
        />
      </div>
      
      <div class="control-group">
        <label>星空背景: {{ showStars ? '开启' : '关闭' }}</label>
        <input 
          type="checkbox" 
          v-model="showStars"
          @change="updateStarBackground"
        />
      </div>
      
      <div class="control-group">
        <label>聚焦中国: {{ zoomChina ? '开启' : '关闭' }}</label>
        <input 
          type="checkbox" 
          v-model="zoomChina"
          @change="updateZoomChina"
        />
      </div>
      
      <button @click="toggleControls" class="toggle-btn">
        {{ showControls ? '隐藏控制' : '显示控制' }}
      </button>
    </div>
    
    <!-- 控制按钮 -->
    <button @click="toggleControls" class="control-toggle">
      ⚙️
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Earth from '3d-earth'

const earthContainer = ref(null)
let earthInstance = null

// 加载状态
const loading = ref(true)
const loadingProgress = ref(0)
const showControls = ref(false)

// 控制参数
const autoRotate = ref(true)
const showStars = ref(true)
const zoomChina = ref(true)

// 城市列表（来自业务系统）
const cityList = {
  宁波: { name: "宁波", longitude: 121.5, latitude: 29.9 },
  泰国: { name: "泰国", longitude: 100.5, latitude: 13.7 },
  澳大利亚: { name: "澳大利亚", longitude: 133.8, latitude: -25.3 },
  以色列: { name: "以色列", longitude: 34.8, latitude: 31.0 },
  意大利: { name: "意大利", longitude: 12.6, latitude: 41.9 },
  法国: { name: "法国", longitude: 2.2, latitude: 48.5 },
  美国: { name: "美国", longitude: -95.7, latitude: 37.1 },
 
}

// 城市之间的连线，可以定义颜色（数据来自业务系统）
const bizLines = [
{
    from: "宁波",
    to: [
      "泰国",
      "澳大利亚", 
      "以色列",
      "意大利",
      "法国",
      "美国"
    ],
    color: `rgba(255, 147, 0, 1)`,
  },
  
  // {
  //   from: "西安",
  //   to: ["北京", "上海", "成都", "广州", "乌鲁木齐", "海口"],
  //   color: `rgba(255, 147, 0, 1)`,
  // },
  // {
  //   from: "成都",
  //   to: ["北京", "上海", "广州", "武汉", "海口", "纽约", "悉尼"],
  //   color: `rgba(255, 147, 0, 1)`,
  // },
  // {
  //   from: "乌鲁木齐",
  //   to: ["北京", "上海", "西安"],
  //   color: `rgba(255, 147, 0, 1)`,
  // },
  // {
  //   from: "广州",
  //   to: [
  //     "北京",
  //     "上海",
  //     "成都",
  //     "拉萨",
  //     "武汉",
  //     "海口",
  //     "纽约",
  //     "伦敦",
  //     "巴黎",
  //     "悉尼",
  //     "东京",
  //     "里约热内卢",
  //   ],
  //   color: `rgba(255, 147, 0, 1)`,
  // },
  // { from: "哈尔滨", to: ["北京", "沈阳"], color: `rgba(255, 147, 0, 1)` },
  // { from: "沈阳", to: ["北京", "哈尔滨"], color: `rgba(255, 147, 0, 1)` },
  // {
  //   from: "海口",
  //   to: ["北京", "上海", "成都", "广州"],
  //   color: `rgba(255, 147, 0, 1)`,
  // },
  // {
  //   from: "纽约",
  //   to: ["北京", "上海", "成都", "广州"],
  //   color: `rgba(255, 147, 0, 1)`,
  // },
  // {
  //   from: "伦敦",
  //   to: ["北京", "上海", "广州"],
  //   color: `rgba(255, 147, 0, 1)`,
  // },
  // {
  //   from: "巴黎",
  //   to: ["北京", "上海", "广州"],
  //   color: `rgba(255, 147, 0, 1)`,
  // },
  // { from: "开普敦", to: ["北京", "上海"], color: `rgba(255, 147, 0, 1)` },
  // {
  //   from: "悉尼",
  //   to: ["北京", "上海", "成都", "广州"],
  //   color: `rgba(255, 147, 0, 1)`,
  // },
  // {
  //   from: "东京",
  //   to: ["北京", "上海", "广州"],
  //   color: `rgba(255, 147, 0, 1)`,
  // },
  // {
  //   from: "里约热内卢",
  //   to: ["北京", "上海", "广州"],
  //   color: `rgba(255, 147, 0, 1)`,
  // },
]

// 更新加载进度
const updateLoadingProgress = async (progress) => {
  loadingProgress.value = progress
  await new Promise(resolve => setTimeout(resolve, 50))
}

// 初始化3D地球
const initEarth = async () => {
  try {
    loading.value = true
    await updateLoadingProgress(20)
    
    if (!earthContainer.value) {
      console.error('地球容器未找到')
      return
    }
    
    await updateLoadingProgress(40)
    
    // 等待DOM更新
    await new Promise(resolve => setTimeout(resolve, 100))
    
    await updateLoadingProgress(60)
    
    // 创建3D地球实例
    earthInstance = new Earth("container", cityList, bizLines, {
      autoRotate: autoRotate.value,
      zoomChina: zoomChina.value,
      starBackground: showStars.value
    })
    
    await updateLoadingProgress(80)
    
    // 加载地球
    earthInstance.load()
    
    await updateLoadingProgress(100)
    loading.value = false
    
    console.log('3D地球初始化完成')
  } catch (error) {
    console.error('3D地球初始化失败:', error)
    loading.value = false
  }
}

// 更新自动旋转
const updateAutoRotate = () => {
  if (earthInstance) {
    console.log('Auto rotate updated:', autoRotate.value)
    // 使用防抖来避免频繁重新初始化
    debouncedReinitialize()
  }
}

// 更新星空背景
const updateStarBackground = () => {
  if (earthInstance) {
    console.log('Star background updated:', showStars.value)
    // 使用防抖来避免频繁重新初始化
    debouncedReinitialize()
  }
}

// 更新聚焦中国
const updateZoomChina = () => {
  if (earthInstance) {
    console.log('Zoom China updated:', zoomChina.value)
    // 使用防抖来避免频繁重新初始化
    debouncedReinitialize()
  }
}

// 防抖重新初始化
let reinitializeTimeout = null
const debouncedReinitialize = () => {
  if (reinitializeTimeout) {
    clearTimeout(reinitializeTimeout)
  }
  reinitializeTimeout = setTimeout(() => {
    reinitializeEarth()
  }, 500) // 500ms防抖
}

// 重新初始化地球
const reinitializeEarth = async () => {
  if (earthInstance) {
    try {
      // 清理现有实例
      if (earthInstance.destroy) {
        earthInstance.destroy()
      }
    } catch (error) {
      console.warn('清理地球实例时出错:', error)
    }
  }
  
  // 重新初始化
  await initEarth()
}

// 切换控制面板
const toggleControls = () => {
  showControls.value = !showControls.value
}

// 清理资源
const cleanup = () => {
  // 清理定时器
  if (reinitializeTimeout) {
    clearTimeout(reinitializeTimeout)
    reinitializeTimeout = null
  }
  
  if (earthInstance) {
    try {
      if (earthInstance.destroy) {
        earthInstance.destroy()
      }
    } catch (error) {
      console.warn('清理地球实例时出错:', error)
    }
  }
}

onMounted(() => {
  // 确保容器存在后再初始化
  setTimeout(() => {
    initEarth()
  }, 200)
})

onBeforeUnmount(() => {
  cleanup()
})
</script>

<style scoped>
.fly-line-earth {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.earth-container {
  width: 100%;
  height: 100%;
  background: black;
  position: relative;
}

/* 标题栏 */
.title-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-content {
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid var(--border-secondary);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.main-title {
  font-weight: 600;
  color: white;
  margin: 0 0 6px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  letter-spacing: 1px;
}

.sub-title {
  color: #b0b0b0;
  margin: 0;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
  opacity: 0.9;
}

/* 加载覆盖层 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-content {
  text-align: center;
  color: white;
}

.progress-bar {
  width: 200px;
  height: 8px;
  background: var(--border-secondary);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  transition: width 0.3s ease;
}

.loading-text {
  font-size: 14px;
  color: #ccc;
}

/* 控制面板 */
.controls-panel {
  position: absolute;
  top: 100px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 12px;
  color: white;
  min-width: 250px;
  backdrop-filter: blur(10px);
  z-index: 5;
}

.control-group {
  margin-bottom: 16px;
}

.control-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  color: #ccc;
}

.control-group input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  cursor: pointer;
}

.toggle-btn {
  width: 100%;
  padding: 8px;
  background: #4facfe;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 12px;
}

.toggle-btn:hover {
  background: #3a8bfe;
}

/* 控制按钮 */
.control-toggle {
  position: absolute;
  top: 100px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 18px;
  cursor: pointer;
  z-index: 5;
  backdrop-filter: blur(10px);
}

.control-toggle:hover {
  background: rgba(0, 0, 0, 0.8);
}
</style>