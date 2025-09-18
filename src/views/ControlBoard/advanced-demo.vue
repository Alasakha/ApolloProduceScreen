<template>
  <div class="advanced-earth-demo">
    <div class="demo-header">
      <h1>🌍 高级3D地球演示</h1>
      <p>真实地球贴图 + 贸易飞线 + 大气层效果</p>
    </div>
    
    <div class="controls">
      <button @click="toggleRotation" class="control-btn">
        {{ isRotating ? '⏸️ 暂停旋转' : '▶️ 开始旋转' }}
      </button>
      <button @click="toggleTradeLines" class="control-btn">
        {{ showTradeLines ? '🚫 隐藏飞线' : '✈️ 显示飞线' }}
      </button>
      <button @click="toggleAtmosphere" class="control-btn">
        {{ showAtmosphere ? '🌫️ 隐藏大气' : '🌍 显示大气' }}
      </button>
    </div>
    
    <div class="earth-container" ref="earthContainer"></div>
    
    <div class="info-panel">
      <div class="info-card">
        <h3>🌍 地球信息</h3>
        <p>使用真实NASA地球贴图</p>
        <p>包含大陆、海洋、云层纹理</p>
        <p>添加大气层和光照效果</p>
      </div>
      
      <div class="info-card">
        <h3>✈️ 贸易飞线</h3>
        <p>显示主要贸易路线</p>
        <p>动态飞线动画效果</p>
        <p>可切换显示/隐藏</p>
      </div>
      
      <div class="info-card">
        <h3>🎮 交互控制</h3>
        <p>鼠标拖拽旋转视角</p>
        <p>滚轮缩放</p>
        <p>按钮控制功能</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import THREE, { OrbitControls } from '@/utils/threejsManager.js'

// 响应式数据
const earthContainer = ref(null)
const isRotating = ref(true)
const showTradeLines = ref(true)
const showAtmosphere = ref(true)

// Three.js 相关变量
let scene, camera, renderer, controls
let earth, atmosphere, tradeLines
let animationId

// 初始化场景
const initScene = () => {
  // 创建场景
  scene = new THREE.Scene()
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    earthContainer.value.clientWidth / earthContainer.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 3)
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(earthContainer.value.clientWidth, earthContainer.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  earthContainer.value.appendChild(renderer.domElement)
  
  // 添加轨道控制
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.autoRotate = isRotating.value
  controls.autoRotateSpeed = 0.5
  
  // 添加星空背景
  addStarfield()
  
  // 创建地球
  createEarth()
  
  // 创建大气层
  if (showAtmosphere.value) {
    createAtmosphere()
  }
  
  // 创建贸易飞线
  if (showTradeLines.value) {
    createTradeLines()
  }
  
  // 添加光照
  addLighting()
  
  // 开始动画循环
  animate()
  
  // 监听窗口大小变化
  window.addEventListener('resize', onWindowResize)
}

// 添加星空背景
const addStarfield = () => {
  const starGeometry = new THREE.BufferGeometry()
  const starCount = 2000
  const positions = new Float32Array(starCount * 3)
  
  for (let i = 0; i < starCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 2000
    positions[i + 1] = (Math.random() - 0.5) * 2000
    positions[i + 2] = (Math.random() - 0.5) * 2000
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    transparent: true,
    opacity: 0.8
  })
  
  const stars = new THREE.Points(starGeometry, starMaterial)
  scene.add(stars)
}

// 创建地球
const createEarth = () => {
  // 创建地球几何体
  const earthGeometry = new THREE.SphereGeometry(1, 64, 64)
  
  // 创建地球材质 - 使用真实贴图
  const earthMaterial = new THREE.MeshPhongMaterial({
    map: createEarthTexture(),
    bumpMap: createBumpTexture(),
    bumpScale: 0.05,
    specularMap: createSpecularTexture(),
    specular: new THREE.Color(0x333333),
    shininess: 5
  })
  
  earth = new THREE.Mesh(earthGeometry, earthMaterial)
  earth.castShadow = true
  earth.receiveShadow = true
  scene.add(earth)
}

// 创建地球贴图（模拟真实地球纹理）
const createEarthTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  
  // 绘制海洋背景
  ctx.fillStyle = '#1e3a8a'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 绘制大陆轮廓（简化版）
  ctx.fillStyle = '#16a34a'
  
  // 亚洲
  ctx.beginPath()
  ctx.ellipse(700, 200, 120, 80, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // 欧洲
  ctx.beginPath()
  ctx.ellipse(500, 180, 60, 40, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // 非洲
  ctx.beginPath()
  ctx.ellipse(500, 300, 50, 120, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // 北美洲
  ctx.beginPath()
  ctx.ellipse(200, 200, 80, 60, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // 南美洲
  ctx.beginPath()
  ctx.ellipse(250, 350, 40, 100, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // 澳大利亚
  ctx.beginPath()
  ctx.ellipse(800, 400, 60, 40, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // 添加一些细节
  ctx.fillStyle = '#15803d'
  ctx.globalAlpha = 0.3
  ctx.fillRect(100, 100, 50, 30)
  ctx.fillRect(800, 150, 40, 25)
  ctx.fillRect(300, 250, 35, 20)
  
  ctx.globalAlpha = 1.0
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 1)
  
  return texture
}

// 创建凹凸贴图
const createBumpTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  
  // 创建噪点效果
  const imageData = ctx.createImageData(canvas.width, canvas.height)
  const data = imageData.data
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 255
    data[i] = noise     // R
    data[i + 1] = noise // G
    data[i + 2] = noise // B
    data[i + 3] = 255   // A
  }
  
  ctx.putImageData(imageData, 0, 0)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 1)
  
  return texture
}

// 创建高光贴图
const createSpecularTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  
  // 创建渐变效果
  const gradient = ctx.createRadialGradient(512, 256, 0, 512, 256, 512)
  gradient.addColorStop(0, 'var(--text-primary)fff')
  gradient.addColorStop(0.3, '#cccccc')
  gradient.addColorStop(0.7, '#666666')
  gradient.addColorStop(1, '#000000')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 1)
  
  return texture
}

// 创建大气层
const createAtmosphere = () => {
  const atmosphereGeometry = new THREE.SphereGeometry(1.1, 64, 64)
  const atmosphereMaterial = new THREE.MeshPhongMaterial({
    color: 0x87ceeb,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide
  })
  
  atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
  scene.add(atmosphere)
}

// 创建贸易飞线
const createTradeLines = () => {
  tradeLines = new THREE.Group()
  
  // 定义主要贸易路线
  const tradeRoutes = [
    { from: { lat: 35.8617, lng: 104.1954 }, to: { lat: 40.7128, lng: -74.0060 }, color: 0xff6b6b }, // 中国-美国
    { from: { lat: 35.8617, lng: 104.1954 }, to: { lat: 51.5074, lng: -0.1278 }, color: 0x4ecdc4 },   // 中国-英国
    { from: { lat: 35.8617, lng: 104.1954 }, to: { lat: 35.6762, lng: 139.6503 }, color: 0x45b7d1 }, // 中国-日本
    { from: { lat: 40.7128, lng: -74.0060 }, to: { lat: 51.5074, lng: -0.1278 }, color: 0x96ceb4 }, // 美国-英国
    { from: { lat: 40.7128, lng: -74.0060 }, to: { lat: 35.6762, lng: 139.6503 }, color: 0xfeca57 }, // 美国-日本
    { from: { lat: 51.5074, lng: -0.1278 }, to: { lat: 35.6762, lng: 139.6503 }, color: 0xff9ff3 }, // 英国-日本
  ]
  
  tradeRoutes.forEach((route, index) => {
    const line = createTradeLine(route.from, route.to, route.color, index)
    tradeLines.add(line)
  })
  
  scene.add(tradeLines)
}

// 创建单条贸易飞线
const createTradeLine = (from, to, color, index) => {
  // 将经纬度转换为3D坐标
  const fromPos = latLngToVector3(from.lat, from.lng, 1.0)
  const toPos = latLngToVector3(to.lat, to.lng, 1.0)
  
  // 创建曲线路径
  const curve = new THREE.CubicBezierCurve3(
    fromPos,
    new THREE.Vector3(
      fromPos.x + (toPos.x - fromPos.x) * 0.5,
      fromPos.y + (toPos.y - fromPos.y) * 0.5 + 0.3,
      fromPos.z + (toPos.z - fromPos.z) * 0.5
    ),
    new THREE.Vector3(
      fromPos.x + (toPos.x - fromPos.x) * 0.5,
      fromPos.y + (toPos.y - fromPos.y) * 0.5 + 0.3,
      fromPos.z + (toPos.z - fromPos.z) * 0.5
    ),
    toPos
  )
  
  const points = curve.getPoints(50)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  
  const material = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.8,
    linewidth: 2
  })
  
  const line = new THREE.Line(geometry, material)
  
  // 添加飞线动画
  line.userData = {
    originalGeometry: geometry.clone(),
    animationOffset: index * 0.2,
    speed: 0.01
  }
  
  return line
}

// 经纬度转3D坐标
const latLngToVector3 = (lat, lng, radius) => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = (radius * Math.sin(phi) * Math.sin(theta))
  const y = (radius * Math.cos(phi))
  
  return new THREE.Vector3(x, y, z)
}

// 添加光照
const addLighting = () => {
  // 环境光
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
  scene.add(ambientLight)
  
  // 主光源（太阳）
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
  directionalLight.position.set(5, 3, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)
  
  // 补光
  const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.3)
  fillLight.position.set(-5, -3, -5)
  scene.add(fillLight)
}

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  // 地球自转
  if (earth && isRotating.value) {
    earth.rotation.y += 0.005
  }
  
  // 大气层旋转
  if (atmosphere && showAtmosphere.value) {
    atmosphere.rotation.y += 0.003
  }
  
  // 贸易飞线动画
  if (tradeLines && showTradeLines.value) {
    tradeLines.children.forEach((line, index) => {
      animateTradeLine(line, index)
    })
  }
  
  // 更新控制器
  if (controls) {
    controls.update()
  }
  
  // 渲染场景
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

// 飞线动画
const animateTradeLine = (line, index) => {
  const userData = line.userData
  if (!userData.originalGeometry) return
  
  const time = Date.now() * userData.speed + userData.animationOffset
  const points = userData.originalGeometry.attributes.position.array
  
  // 创建流动效果
  for (let i = 0; i < points.length; i += 3) {
    const t = i / points.length
    const wave = Math.sin(t * Math.PI * 2 + time) * 0.02
    
    line.geometry.attributes.position.array[i] = points[i] + wave
    line.geometry.attributes.position.array[i + 1] = points[i + 1] + wave
    line.geometry.attributes.position.array[i + 2] = points[i + 2] + wave
  }
  
  line.geometry.attributes.position.needsUpdate = true
}

// 窗口大小变化处理
const onWindowResize = () => {
  if (camera && renderer && earthContainer.value) {
    camera.aspect = earthContainer.value.clientWidth / earthContainer.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(earthContainer.value.clientWidth, earthContainer.value.clientHeight)
  }
}

// 控制函数
const toggleRotation = () => {
  isRotating.value = !isRotating.value
  if (controls) {
    controls.autoRotate = isRotating.value
  }
}

const toggleTradeLines = () => {
  showTradeLines.value = !showTradeLines.value
  if (tradeLines) {
    tradeLines.visible = showTradeLines.value
  }
}

const toggleAtmosphere = () => {
  showAtmosphere.value = !showAtmosphere.value
  if (atmosphere) {
    atmosphere.visible = showAtmosphere.value
  }
}

// 生命周期
onMounted(() => {
  initScene()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  if (renderer) {
    renderer.dispose()
  }
  
  if (earthContainer.value && renderer) {
    earthContainer.value.removeChild(renderer.domElement)
  }
  
  window.removeEventListener('resize', onWindowResize)
})
</script>

<style scoped>
.advanced-earth-demo {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: white;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.demo-header {
  text-align: center;
  margin-bottom: 30px;
}

.demo-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #00d4ff, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.demo-header p {
  font-size: 1.2rem;
  color: #a0a0a0;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.control-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.control-btn:active {
  transform: translateY(0);
}

.earth-container {
  width: 100%;
  height: 60vh;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  margin-bottom: 30px;
}

.info-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.info-card {
  background: var(--border-secondary);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  border: 1px solid var(--border-secondary);
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-card h3 {
  color: #00d4ff;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.info-card p {
  color: #d0d0d0;
  margin-bottom: 8px;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .demo-header h1 {
    font-size: 2rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: center;
  }
  
  .control-btn {
    width: 200px;
  }
  
  .earth-container {
    height: 50vh;
  }
  
  .info-panel {
    grid-template-columns: 1fr;
  }
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--border-secondary);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #00d4ff, #ff6b6b);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #00b8e6, #ff5252);
}
</style> 