<template>
  <div class="line1-container">
    <div class="grid grid-cols-3 gap-4">
      <dv-border-box-12 class="data-box ">
        <div class="flex w-full h-full">
          <div class="box-title flex-1 flex-col">
            <div>今日计划总数</div>
             <div class="text-xl">TodayPlanned</div>
          </div>
        <div class="circle-content-box flex-1">
         
          <svg viewBox="0 0 120 120" class="ring-svg">
            <circle
              class="ring-bg"
              cx="60" cy="60" r="50"
              fill="none"
              stroke="#02e0fd"
              stroke-width="8"
            />
            <circle
              class="ring-animate"
              cx="60" cy="60" r="50"
              fill="none"
              stroke="url(#gradient)"
              stroke-width="4"
              stroke-dasharray="314"
              stroke-dashoffset="0"
            />
            <defs>
              <linearGradient id="gradient">
                <stop offset="0%" stop-color="#00eaff"/>
                <stop offset="100%" stop-color="#2392f1"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="circle-content">
            <!-- <div class="box-title">今日总排产</div> -->
            <div class="box-value float-updown">{{ productionData.pcTotal }}</div>
          </div>
        </div>
        </div>
        
      </dv-border-box-12>

      <!-- <dv-border-box-12 class="data-box">
        <div class="circle-content-box">
          <svg viewBox="0 0 120 120" class="ring-svg">
            <circle
              class="ring-bg"
              cx="60" cy="60" r="50"
              fill="none"
              stroke="#00eaff33"
              stroke-width="8"
            />
            <circle
              class="ring-animate"
              cx="60" cy="60" r="50"
              fill="none"
              stroke="url(#gradient)"
              stroke-width="4"
              stroke-dasharray="314"
              stroke-dashoffset="0"
            />
            <defs>
              <linearGradient id="gradient">
                <stop offset="0%" stop-color="#00eaff"/>
                <stop offset="100%" stop-color="#00ffb0"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="circle-content">
            <div class="box-title">今日已生产</div>
            <div class="box-value">{{ productionData.done }}</div>
          </div>
        </div>
      </dv-border-box-12> -->
      <dv-border-box-12 class="data-box ">
        <div class="flex w-full h-full">
          <div class="box-title flex-1 flex-col">
            <div>今日已生产</div>
             <div class="text-xl">ProducedToday</div>
          </div>
        <div class="circle-content-box flex-1">
         
          <svg viewBox="0 0 120 120" class="ring-svg">
            <circle
              class="ring-bg"
              cx="60" cy="60" r="50"
              fill="none"
              stroke="#02e0fd"
              stroke-width="8"
            />
            <circle
              class="ring-animate"
              cx="60" cy="60" r="50"
              fill="none"
              stroke="url(#gradient)"
              stroke-width="4"
              stroke-dasharray="314"
              stroke-dashoffset="0"
            />
            <defs>
              <linearGradient id="gradient">
                <stop offset="0%" stop-color="#00eaff"/>
                <stop offset="100%" stop-color="#2392f1"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="circle-content">
            <!-- <div class="box-title">今日总排产</div> -->
            <div class="box-value float-updown">{{ productionData.done }}</div>
          </div>
        </div>
        </div>
        
      </dv-border-box-12>

      <dv-border-box-12 class="data-box ">
        <div class="flex w-full h-full">
          <div class="box-title flex-1 flex-col">
            <div>今日待生产</div>
             <div class="text-xl">To Be Produced Today</div>
          </div>
        <div class="circle-content-box flex-1">
         
          <svg viewBox="0 0 120 120" class="ring-svg">
            <circle
              class="ring-bg"
              cx="60" cy="60" r="50"
              fill="none"
              stroke="#02e0fd"
              stroke-width="8"
            />
            <circle
              class="ring-animate"
              cx="60" cy="60" r="50"
              fill="none"
              stroke="url(#gradient)"
              stroke-width="4"
              stroke-dasharray="314"
              stroke-dashoffset="0"
            />
            <defs>
              <linearGradient id="gradient">
                <stop offset="0%" stop-color="#00eaff"/>
                <stop offset="100%" stop-color="#2392f1"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="circle-content">
            <!-- <div class="box-title">今日总排产</div> -->
            <div class="box-value float-updown">{{ productionData.undone }}</div>
          </div>
        </div>
        </div>
        
      </dv-border-box-12>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getTodayProduction, type TodayProduction } from '@/api/getStampWeldinfo'
import { useRoute } from 'vue-router'
import { eventBus } from '@/utils/eventbus'
import * as THREE from 'three'

const route = useRoute()
const prodLine = route.query.prodLine as string

const productionData = ref<TodayProduction>({
  pcGdTotal: 0  , // 排产工单数
  gdPg: 0   ,       // 工单派工数
  rate: 0    ,      // 达成率
  gdRate: 0  ,     // 工单达成率
  pg: 0     ,      // 派工数
  gdDone: 0  ,   // 工单报工数
  pcTotal: 0,  // 排产数
  done: 0    ,     // 报工数
  undone: 0  ,   // 未报工数
})

const threeBox1 = ref()
const threeBox2 = ref()
const threeBox3 = ref()
let renderers: THREE.WebGLRenderer[] = []
let animationIds: number[] = []

function createParticleEffect(container: HTMLElement) {
  const width = container.clientWidth
  const height = container.clientHeight
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ alpha: true })
  renderer.setSize(width, height)
  container.appendChild(renderer.domElement)

  // 粒子参数
  const particles = 120
  const geometry = new THREE.BufferGeometry()
  const positions = []
  const colors = []
  const color = new THREE.Color()

  for (let i = 0; i < particles; i++) {
    // 环形分布
    const angle = (i / particles) * Math.PI * 2
    const radius = 1 + Math.random() * 0.2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    const z = (Math.random() - 0.5) * 0.2
    positions.push(x, y, z)
    // 颜色渐变
    color.setHSL(i / particles, 1.0, 0.6)
    colors.push(color.r, color.g, color.b)
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  camera.position.z = 3

  function animate() {
    points.rotation.z += 0.005
    points.rotation.x += 0.002
    renderer.render(scene, camera)
    const id = requestAnimationFrame(animate)
    animationIds.push(id)
  }
  animate()
  renderers.push(renderer)
}

const fetchData = async (prodLine) => {
  try {
    const getLine = () => {
      if (prodLine === 'CY') {
        return '1001'
      } else if (prodLine === 'HJ') {
        return '1003'
      }
      return prodLine
    }
    
    const lineValue = getLine()
    console.log('生产线值:', lineValue)
    console.log('请求参数:', { prodLine: lineValue })
    const res = await getTodayProduction(lineValue)
    console.log('API响应:', res)
    
    if (res.code === 200) {
      console.log('原始数据:', res.data)
      // 格式化数据,去除小数点
      productionData.value = {
        ...res.data,
        pcTotal: Math.round(res.data.pcTotal),
        done: Math.round(res.data.done),
        undone: String(Math.round(Number(res.data.undone))),
        // 达成率 = (已完成/计划) * 100,取整
        rate: res.data.pcTotal ? Math.round((res.data.done / res.data.pcTotal) * 100) : 0
      }
      console.log('处理后的数据:', productionData.value)
    }
  } catch (error) {
    console.error('获取今日生产数据失败:', error)
  }
}

onMounted(() => {
  fetchData(prodLine)
  // 订阅刷新事件
  eventBus.on('refreshData', () => fetchData(prodLine))
  if (threeBox1.value) createParticleEffect(threeBox1.value)
  if (threeBox2.value) createParticleEffect(threeBox2.value)
  if (threeBox3.value) createParticleEffect(threeBox3.value)
})

onBeforeUnmount(() => {
  // 清理three.js渲染器和动画
  renderers.forEach(r => {
    r.dispose && r.dispose()
    r.domElement && r.domElement.remove()
  })
  animationIds.forEach(id => cancelAnimationFrame(id))
})
</script>

<style scoped>
.line1-container {
  /* padding: 0.5rem; */
}

.data-box {
  height: 15vh;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.circle-content-box {
  position: relative;
  width: 100%;  /* 可根据内容调整 */
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-svg {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 0;
  filter: drop-shadow(0 0 16px #00eaff88);
  pointer-events: none;
}

.circle-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  /* 居中内容 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ring-bg {
  opacity: 0.2;
}
.ring-animate {
  stroke-linecap: round;
  filter: blur(1px);
  animation: ring-rotate 2.5s linear infinite;
  transform-origin: 60px 60px;
}
@keyframes ring-rotate {
  100% { stroke-dashoffset: 314; transform: rotate(360deg);}
}
.box-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95%;
  text-align: center;
  font-size: 1.5vw;
  font-weight: bold;
  margin: 1vh 0 0.5vh 0;
  color: #fff;
  letter-spacing: 0.3vw;
  text-shadow: 0 0.3vh 1vw #000, 0 0 0.2vw #00bfff;
  padding-bottom: 0.5vh;
}
.box-value {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
}

.three-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0;
  pointer-events: none;
}

.data-box {
  position: relative;
  overflow: hidden;
}

.box-content {
  position: relative;
  z-index: 1;
}

.float-updown {
  animation: floatUpDown 2.5s cubic-bezier(0.4,0,0.2,1) infinite;
  display: inline-block;
}

@keyframes floatUpDown {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-5px); }
}
</style> 