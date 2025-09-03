<template>
  <div class="dhplayer-container">
    <div 
      :id="`dhplayer-${videoId}`" 
      class="dhplayer-video"
      :style="{ width: '100%', height: '100%' }"
    ></div>
    
    <!-- 云台控制容器 -->
    <div v-if="showPanTilt" :id="`dhplayer-pan-tilt-${videoId}`" class="dhplayer-pan-tilt"></div>
    
    <!-- 状态指示器 -->
    <div class="dhplayer-status" :class="playerStatus">
      <span class="status-dot"></span>
      {{ statusText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

interface Props {
  videoId: string
  windowType?: string // 0-实时预览，3-录像回放，7-录像回放(支持倒放)
  request?: any
  showPanTilt?: boolean
}

interface Emits {
  (e: 'createSuccess'): void
  (e: 'createError', error: any): void
  (e: 'realSuccess', info: any): void
  (e: 'realError', info: any, error: any): void
  (e: 'talkSuccess', info: any): void
  (e: 'talkError', info: any, error: any): void
  (e: 'playbackSuccess', info: any): void
  (e: 'playbackError', info: any, error: any): void
  (e: 'playbackFinish', info: any): void
  (e: 'switchStartTime', time: any): void
  (e: 'replay', snum: number): void
}

const props = withDefaults(defineProps<Props>(), {
  windowType: '0',
  showPanTilt: false
})

const emit = defineEmits<Emits>()

const playerStatus = ref('initializing') // initializing, ready, error, playing
const dhplayerInstance = ref<any>(null)

const statusText = computed(() => {
  const statusMap = {
    initializing: '初始化中',
    ready: '就绪',
    error: '错误',
    playing: '播放中'
  }
  return statusMap[props.videoId] || '未知'
})

// 暴露给父组件的方法
const startReal = (channels: any[]) => {
  if (dhplayerInstance.value && playerStatus.value === 'ready') {
    try {
      // 这里应该调用实际的DHPlayer SDK方法
      console.log('开始实时预览:', channels)
      playerStatus.value = 'playing'
      emit('realSuccess', channels[0])
    } catch (error) {
      console.error('实时预览失败:', error)
      emit('realError', channels[0], error)
    }
  }
}

const startPlayback = (channels: any[]) => {
  if (dhplayerInstance.value && playerStatus.value === 'ready') {
    try {
      console.log('开始录像回放:', channels)
      playerStatus.value = 'playing'
      emit('playbackSuccess', channels[0])
    } catch (error) {
      console.error('录像回放失败:', error)
      emit('playbackError', channels[0], error)
    }
  }
}

const startTalk = (snum: number) => {
  if (dhplayerInstance.value && playerStatus.value === 'playing') {
    try {
      console.log('开始语音对讲:', snum)
      emit('talkSuccess', { snum })
    } catch (error) {
      console.error('语音对讲失败:', error)
      emit('talkError', { snum }, error)
    }
  }
}

const initPanTilt = (containerId: string) => {
  if (dhplayerInstance.value) {
    console.log('初始化云台:', containerId)
    // 这里应该调用实际的云台初始化方法
  }
}

const playbackByUrl = (params: any, snum: number) => {
  if (dhplayerInstance.value) {
    console.log('通过URL播放录像:', params, snum)
    // 这里应该调用实际的URL播放方法
  }
}

const talkByUrl = (params: any, snum: number) => {
  if (dhplayerInstance.value) {
    console.log('通过URL进行对讲:', params, snum)
    // 这里应该调用实际的URL对讲方法
  }
}

const realByUrl = (params: any, snum: number) => {
  if (dhplayerInstance.value) {
    console.log('通过URL实时预览:', params, snum)
    // 这里应该调用实际的URL预览方法
  }
}

// 模拟DHPlayer插件初始化
const initDHPlayer = async () => {
  try {
    // 等待DOM更新
    await nextTick()
    
    // 模拟插件加载
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 检查是否加载成功
    if (typeof window !== 'undefined' && (window as any).DHPlayer) {
      dhplayerInstance.value = (window as any).DHPlayer
      playerStatus.value = 'ready'
      emit('createSuccess')
    } else {
      // 模拟成功（实际使用时需要真实的DHPlayer插件）
      dhplayerInstance.value = {
        // 模拟的DHPlayer实例
        startReal: () => console.log('模拟开始实时预览'),
        startPlayback: () => console.log('模拟开始录像回放'),
        startTalk: () => console.log('模拟开始对讲'),
        initPanTilt: () => console.log('模拟初始化云台')
      }
      playerStatus.value = 'ready'
      emit('createSuccess')
    }
  } catch (error) {
    console.error('DHPlayer初始化失败:', error)
    playerStatus.value = 'error'
    emit('createError', error)
  }
}

// 监听windowType变化
watch(() => props.windowType, (newType) => {
  console.log('窗口类型切换:', newType)
})

onMounted(() => {
  initDHPlayer()
})

onUnmounted(() => {
  if (dhplayerInstance.value) {
    // 清理资源
    dhplayerInstance.value = null
  }
})

// 暴露方法给父组件
defineExpose({
  startReal,
  startPlayback,
  startTalk,
  initPanTilt,
  playbackByUrl,
  talkByUrl,
  realByUrl
})
</script>

<style scoped>
.dhplayer-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.dhplayer-video {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8B5CF6;
  font-size: 14px;
}

.dhplayer-pan-tilt {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 200px;
  height: 200px;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
}

.dhplayer-status {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  color: #fff;
  font-size: 12px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00ff00;
}

.dhplayer-status.initializing .status-dot {
  background: #ffaa00;
}

.dhplayer-status.ready .status-dot {
  background: #00ff00;
}

.dhplayer-status.error .status-dot {
  background: #ff0000;
}

.dhplayer-status.playing .status-dot {
  background: #8B5CF6;
}
</style> 