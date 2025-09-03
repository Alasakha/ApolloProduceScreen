<template>
  <div class="beautiful-earth">
    <!-- 标题栏 -->
    <div class="title-bar">
      <div class="title-content">
        <h1 class="main-title">中控大屏看板</h1>
        <p class="sub-title">若要退出全屏,请将鼠标移动到屏幕顶部或长按 Esc</p>
      </div>
    </div>
    
    <div ref="threeContainer" class="three-container"></div>
    
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
        <label>太阳强度: {{ params.sunIntensity.toFixed(1) }}</label>
        <input 
          type="range" 
          v-model="params.sunIntensity" 
          min="0.0" 
          max="5.0" 
          step="0.1"
          @input="updateSunIntensity"
        />
      </div>
      
      <div class="control-group">
        <label>海洋金属度: {{ params.metalness.toFixed(2) }}</label>
        <input 
          type="range" 
          v-model="params.metalness" 
          min="0.0" 
          max="1.0" 
          step="0.05"
          @input="updateMetalness"
        />
      </div>
      
      <div class="control-group">
        <label>旋转速度: {{ params.speedFactor.toFixed(1) }}</label>
        <input 
          type="range" 
          v-model="params.speedFactor" 
          min="0.1" 
          max="20.0" 
          step="0.1"
          @input="updateSpeedFactor"
        />
      </div>
      
      <div class="control-group">
        <label>大气透明度: {{ params.atmOpacity.value.toFixed(2) }}</label>
        <input 
          type="range" 
          v-model="params.atmOpacity.value" 
          min="0.0" 
          max="1.0" 
          step="0.05"
        />
      </div>
      
      <div class="control-group">
        <label>大气强度: {{ params.atmPowFactor.value.toFixed(1) }}</label>
        <input 
          type="range" 
          v-model="params.atmPowFactor.value" 
          min="0.0" 
          max="20.0" 
          step="0.1"
        />
      </div>
      
      <div class="control-group">
        <label>大气倍数: {{ params.atmMultiplier.value.toFixed(1) }}</label>
        <input 
          type="range" 
          v-model="params.atmMultiplier.value" 
          min="0.0" 
          max="20.0" 
          step="0.1"
        />
      </div>
      
      <!-- 光圈坐标控制 -->
      <div class="control-group">
        <label>光圈大小: {{ params.markerSize.value.toFixed(1) }}</label>
        <input 
          type="range" 
          v-model="params.markerSize.value" 
          min="0.5" 
          max="5.0" 
          step="0.1"
        />
      </div>
      
      <div class="control-group">
        <label>光圈透明度: {{ params.markerOpacity.value.toFixed(2) }}</label>
        <input 
          type="range" 
          v-model="params.markerOpacity.value" 
          min="0.1" 
          max="1.0" 
          step="0.05"
        />
      </div>
      
      <div class="control-group">
        <label>脉动速度: {{ params.markerPulseSpeed.value.toFixed(3) }}</label>
        <input 
          type="range" 
          v-model="params.markerPulseSpeed.value" 
          min="0.001" 
          max="0.1" 
          step="0.001"
        />
      </div>
      
      <div class="control-group">
        <label>脉动强度: {{ params.markerPulseIntensity.value.toFixed(2) }}</label>
        <input 
          type="range" 
          v-model="params.markerPulseIntensity.value" 
          min="0.0" 
          max="1.0" 
          step="0.05"
        />
      </div>
      
      <!-- 坐标标记控制 -->
      <div class="control-group">
        <label>坐标标记透明度: {{ params.coordinateMarkerOpacity.value.toFixed(2) }}</label>
        <input 
          type="range" 
          v-model="params.coordinateMarkerOpacity.value" 
          min="0.0" 
          max="1.0" 
          step="0.05"
        />
      </div>
      
      <div class="control-group">
        <label>坐标标记脉动速度: {{ params.coordinateMarkerPulseSpeed.value.toFixed(2) }}</label>
        <input 
          type="range" 
          v-model="params.coordinateMarkerPulseSpeed.value" 
          min="0.01" 
          max="0.2" 
          step="0.01"
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
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { vertexShader, fragmentShader } from './earth-shaders.js'

const threeContainer = ref(null)
let scene = null
let camera = null
let renderer = null
let controls = null
let earth = null
let clouds = null
let atmosphere = null
let earthGroup = null
let animationId = null

// 加载状态
const loading = ref(true)
const loadingProgress = ref(0)
const showControls = ref(false)

// 可调参数
const params = reactive({
  sunIntensity: 1.3,
  speedFactor: 0.1, // 修改默认值为0.1
  metalness: 0.1,
  atmOpacity: { value: 0.7 },
  atmPowFactor: { value: 4.1 },
  atmMultiplier: { value: 9.5 },
  markerSize: { value: 1.0 },
  markerOpacity: { value: 0.5 },
  markerPulseSpeed: { value: 0.05 },
  markerPulseIntensity: { value: 0.5 },
  coordinateMarkerOpacity: { value: 0.8 },
  coordinateMarkerPulseSpeed: { value: 0.05 },
})

// 纹理资源
const textures = {
  albedo: null,
  bump: null,
  clouds: null,
  ocean: null,
  nightLights: null,
  gaiaSky: null,
  location: null,  // 添加光圈纹理
  coordinateMarker: null  // 添加坐标标记纹理
}

// 光圈坐标点
const locationMarkers = ref([])
const markerMeshes = ref([])

// 坐标标记点
const coordinateMarkers = ref([])
const coordinateMarkerMeshes = ref([])

// 创建场景
const createScene = () => {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000011)
}

// 创建相机
const createCamera = () => {
  const container = threeContainer.value
  if (!container) return
  
  camera = new THREE.PerspectiveCamera(
    45, 
    container.clientWidth / container.clientHeight, 
    1, 
    1000
  )
  camera.position.set(0, 0, 30)
}

// 创建渲染器
const createRenderer = () => {
  const container = threeContainer.value
  if (!container) return
  
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    powerPreference: 'high-performance',
    failIfMajorPerformanceCaveat: false
  })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 限制像素比
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = false
  container.appendChild(renderer.domElement)
  
  // 添加WebGL上下文丢失处理
  renderer.domElement.addEventListener('webglcontextlost', (event) => {
    console.warn('WebGL上下文丢失，尝试恢复...')
    event.preventDefault()
    // 停止动画循环
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  })
  
  renderer.domElement.addEventListener('webglcontextrestored', () => {
    console.log('WebGL上下文已恢复')
    // 重新初始化场景
    initThreeJS()
  })
}

// 创建控制器
const createControls = () => {
  if (!camera || !renderer) return
  
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.enablePan = true
  controls.enableZoom = true
  controls.enableRotate = true
}

// 创建坐标标记纹理（如果需要程序生成的话）
const createCoordinateMarkerTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  
  const ctx = canvas.getContext('2d')
  
  // 创建圆形标记
  ctx.beginPath()
  ctx.arc(32, 32, 24, 0, 2 * Math.PI)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.fill()
  
  // 添加外圈
  ctx.beginPath()
  ctx.arc(32, 32, 28, 0, 2 * Math.PI)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
  ctx.lineWidth = 2
  ctx.stroke()
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  
  return texture
}

// 加载纹理
const loadTexture = async (url) => {
  return new Promise((resolve, reject) => {
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(
      url, 
      texture => {
        console.log(`纹理加载成功: ${url}`)
        resolve(texture)
      },
      undefined,
      error => {
        console.error(`纹理加载失败: ${url}`, error)
        reject(error)
      }
    )
  })
}

// 加载所有纹理
const loadAllTextures = async () => {
  try {
    console.log('开始加载纹理...')
    
    // 加载地球颜色贴图
    textures.albedo = await loadTexture('/earth-assets/Albedo.jpg')
    textures.albedo.colorSpace = THREE.SRGBColorSpace
    await updateLoadingProgress(20)
    console.log('Albedo纹理加载完成')
    
    // 加载凹凸贴图
    textures.bump = await loadTexture('/earth-assets/Bump.jpg')
    await updateLoadingProgress(40)
    console.log('Bump纹理加载完成')
    
    // 加载云层贴图
    textures.clouds = await loadTexture('/earth-assets/Clouds.png')
    await updateLoadingProgress(60)
    console.log('Clouds纹理加载完成')
    
    // 加载海洋贴图
    textures.ocean = await loadTexture('/earth-assets/Ocean.png')
    await updateLoadingProgress(70)
    console.log('Ocean纹理加载完成')
    
    // 加载夜景发光贴图
    textures.nightLights = await loadTexture('/earth-assets/night_lights_modified.png')
    await updateLoadingProgress(80)
    console.log('夜景纹理加载完成')
    
    // 加载星空背景
    textures.gaiaSky = await loadTexture('/earth-assets/Gaia_EDR3_darkened.png')
    textures.gaiaSky.mapping = THREE.EquirectangularReflectionMapping
    await updateLoadingProgress(90)
    console.log('星空背景加载完成')
    
    // 加载光圈纹理
    textures.location = await loadTexture('/earth-assets/location.png')
    await updateLoadingProgress(92)
    console.log('光圈纹理加载完成')
    
    // 加载坐标标记纹理 - 使用光圈纹理作为坐标标记
    textures.coordinateMarker = await loadTexture('/earth-assets/location.png')
    await updateLoadingProgress(95)
    console.log('坐标标记纹理加载完成')
    
    // 设置背景
    scene.background = textures.gaiaSky
    
    await updateLoadingProgress(100)
    console.log('所有纹理加载完成！')
    return true
  } catch (error) {
    console.error('纹理加载失败:', error)
    return false
  }
}

// 更新加载进度
const updateLoadingProgress = async (progress) => {
  loadingProgress.value = progress
  console.log(`加载进度: ${progress}%`)
  // 减少延迟，让进度条更流畅
  await new Promise(resolve => setTimeout(resolve, 50))
}

// 创建地球
const createEarth = () => {
  // 创建地球组
  earthGroup = new THREE.Group()
  // 地球轴向倾斜23.5度
  earthGroup.rotation.z = 23.5 / 360 * 2 * Math.PI
  
  // 地球几何体
  const earthGeometry = new THREE.SphereGeometry(10, 64, 64)
  
  // 地球材质 - 恢复夜景发光效果
  const earthMaterial = new THREE.MeshStandardMaterial({
    map: textures.albedo,
    bumpMap: textures.bump,
    bumpScale: 0.03,
    metalness: params.metalness,
    roughness: 0.8,
    emissiveMap: textures.nightLights,
    emissive: new THREE.Color(0xffff88),
  })
  
  earth = new THREE.Mesh(earthGeometry, earthMaterial)
  earthGroup.add(earth)
  
  // 云层几何体 - 简化版本
  const cloudGeometry = new THREE.SphereGeometry(10.05, 64, 64)
  const cloudMaterial = new THREE.MeshStandardMaterial({
    map: textures.clouds,
    transparent: true,
    opacity: 0.3,
  })
  
  clouds = new THREE.Mesh(cloudGeometry, cloudMaterial)
  earthGroup.add(clouds)
  
  // 设置初始旋转位置
  earth.rotateY(-0.3)
  clouds.rotateY(-0.3)
  
  // 大气层
  const atmosphereGeometry = new THREE.SphereGeometry(12.5, 64, 64)
  const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      atmOpacity: params.atmOpacity,
      atmPowFactor: params.atmPowFactor,
      atmMultiplier: params.atmMultiplier
    },
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
  
  atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
  earthGroup.add(atmosphere)
  
  scene.add(earthGroup)
  
  // 设置云层阴影
  setupCloudShadows(earthMaterial)
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

// 创建光圈坐标点 - 使用正确的球面角度设置
const createLocationMarker = (marker) => {
  if (!textures.location) return
  
  const position = latLngToVector3(marker.lat, marker.lng, 10.1)
  
  // 创建光圈几何体
  const geometry = new THREE.PlaneGeometry(1, 1)
  
  // 创建光圈材质
  const material = new THREE.MeshBasicMaterial({
    map: textures.location,
    transparent: true,
    opacity: params.markerOpacity.value,
    blending: THREE.AdditiveBlending,
    depthWrite: false, // 禁止写入深度缓冲区数据
    side: THREE.DoubleSide
  })
  
  // 创建光圈网格
  const mesh = new THREE.Mesh(geometry, material)
  
  // 设置mesh位置
  mesh.position.set(position.x, position.y, position.z)
  
  // 设置mesh在球面上的法线方向(球心和球面坐标构成的方向向量)
  const coordVec3 = new THREE.Vector3(position.x, position.y, position.z).normalize()
  // mesh默认在XOY平面上，法线方向沿着z轴
  const meshNormal = new THREE.Vector3(0, 0, 1)
  // 计算两个向量之间构成的四元数值
  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3)
  
  // 设置光圈大小
  const size = 5 * 0.04 // 矩形平面Mesh的尺寸
  mesh.scale.set(size, size, size)
  
  mesh.userData = {
    originalMarker: marker,
    pulseTime: Math.random() * Math.PI * 2, // 随机初始相位
    size: size, // 保存原始大小用于动画
    _s: 1.0 // 动画缩放因子
  }
  
  // 添加到地球组，跟随地球旋转
  earthGroup.add(mesh)
  markerMeshes.value.push(mesh)
  
  console.log(`光圈坐标点已创建: ${marker.name} (${marker.lat}, ${marker.lng})`)
}

// 初始化光圈坐标点
const initLocationMarkers = () => {
  // 预置的测试坐标点
  const testMarkers = [
    { name: '北京', lat: 39.9042, lng: 116.4074, color: 0xff0000 },
    { name: '纽约', lat: 40.7128, lng: -74.0060, color: 0x00ff00 },
    { name: '伦敦', lat: 51.5074, lng: -0.1278, color: 0x0000ff },
    { name: '东京', lat: 35.6762, lng: 139.6503, color: 0xffff00 },
    { name: '悉尼', lat: -33.8688, lng: 151.2093, color: 0xff00ff }
  ]
  
  locationMarkers.value = testMarkers
  
  // 创建所有光圈坐标点
  testMarkers.forEach(marker => {
    createLocationMarker(marker)
  })
  
  console.log('光圈坐标点初始化完成')
}

// 创建坐标标记 - 使用正确的球面角度设置
const createCoordinateMarker = (marker) => {
  if (!textures.coordinateMarker) return null
  
  const position = latLngToVector3(marker.lat, marker.lng, 10.1)
  
  // 创建坐标标记几何体
  const geometry = new THREE.PlaneGeometry(0.5, 0.5)
  
  // 创建坐标标记材质
  const material = new THREE.MeshBasicMaterial({
    map: textures.coordinateMarker,
    transparent: true,
    opacity: 0.8,
    depthWrite: false, // 禁止写入深度缓冲区数据
    side: THREE.DoubleSide
  })
  
  const mesh = new THREE.Mesh(geometry, material)
  
  // 设置mesh位置
  mesh.position.set(position.x, position.y, position.z)
  
  // 设置mesh在球面上的法线方向(球心和球面坐标构成的方向向量)
  const coordVec3 = new THREE.Vector3(position.x, position.y, position.z).normalize()
  // mesh默认在XOY平面上，法线方向沿着z轴
  const meshNormal = new THREE.Vector3(0, 0, 1)
  // 计算两个向量之间构成的四元数值
  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3)
  
  // 设置标记大小
  const size = 10 * 0.02 // 坐标标记的尺寸
  mesh.scale.set(size, size, size)
  
  // 添加脉动动画
  mesh.userData = {
    originalMarker: marker,
    pulseTime: Math.random() * Math.PI * 2, // 随机初始相位
    size: size // 保存原始大小用于动画
  }
  
  return mesh
}

// 初始化坐标标记点
const initCoordinateMarkers = () => {
  // 预置的测试坐标点
  const testMarkers = [
    { name: '上海', lat: 31.2304, lng: 121.4737, color: 0xff0000 },
    { name: '深圳', lat: 22.5431, lng: 114.0579, color: 0x00ff00 },
    { name: '广州', lat: 23.1291, lng: 113.2644, color: 0x0000ff },
    { name: '杭州', lat: 30.2741, lng: 120.1551, color: 0xffff00 },
    { name: '成都', lat: 30.5728, lng: 104.0668, color: 0xff00ff }
  ]
  
  coordinateMarkers.value = testMarkers
  
  // 创建所有坐标标记点
  testMarkers.forEach(marker => {
    const coordinateMarker = createCoordinateMarker(marker)
    if (coordinateMarker) {
      // 添加到地球组，跟随地球旋转
      earthGroup.add(coordinateMarker)
      coordinateMarkerMeshes.value.push(coordinateMarker)
      console.log(`坐标标记点已创建: ${marker.name} (${marker.lat}, ${marker.lng})`)
    }
  })
  
  console.log('坐标标记点初始化完成')
}

// 设置云层阴影 - 简化版本，避免着色器编译错误
const setupCloudShadows = (earthMaterial) => {
  // 暂时禁用复杂的着色器修改，使用简单的材质效果
  console.log('云层阴影设置已简化，避免着色器编译错误')
}

// 创建光照
const createLights = () => {
  // 太阳光
  const directionalLight = new THREE.DirectionalLight(0xffffff, params.sunIntensity)
  directionalLight.position.set(-50, 0, 30)
  scene.add(directionalLight)
  
  // 环境光
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
  scene.add(ambientLight)
}

// 更新太阳强度
const updateSunIntensity = () => {
  const light = scene.children.find(child => child instanceof THREE.DirectionalLight)
  if (light) {
    light.intensity = params.sunIntensity
  }
}

// 更新金属度
const updateMetalness = () => {
  if (earth && earth.material) {
    earth.material.metalness = params.metalness
  }
}

// 更新旋转速度
const updateSpeedFactor = () => {
  // 旋转速度已经在动画循环中实时使用，无需额外处理
  console.log('旋转速度已更新:', params.speedFactor)
}

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  if (earth) {
    earth.rotateY(0.005 * params.speedFactor)
  }
  
  if (clouds) {
    clouds.rotateY(0.01 * params.speedFactor)
  }
  
  // 更新光圈坐标点动画 - 使用参考代码的动画效果
  markerMeshes.value.forEach(mesh => {
    if (mesh && mesh.userData) {
      // 使用参考代码的动画逻辑
      mesh.userData._s += 0.007
      mesh.scale.set(mesh.userData.size * mesh.userData._s, mesh.userData.size * mesh.userData._s, mesh.userData.size * mesh.userData._s)
      
      if (mesh.userData._s <= 1.5) {
        // mesh._s=1，透明度=0 mesh._s=1.5，透明度=1
        mesh.material.opacity = (mesh.userData._s - 1) * 2 * params.markerOpacity.value
      } else if (mesh.userData._s > 1.5 && mesh.userData._s <= 2) {
        // mesh._s=1.5，透明度=1 mesh._s=2，透明度=0
        mesh.material.opacity = (1 - (mesh.userData._s - 1.5) * 2) * params.markerOpacity.value
      } else {
        mesh.userData._s = 1.0
      }
      
      // 调试信息：检查光圈坐标点是否跟随地球旋转（仅在需要时启用）
      // if (import.meta.env.DEV && mesh.userData.originalMarker) {
      //   const worldPosition = mesh.getWorldPosition(new THREE.Vector3())
      //   console.log(`光圈坐标点 ${mesh.userData.originalMarker.name} 世界位置:`, worldPosition)
      // }
    }
  })
  
  // 更新坐标标记点动画 - 简化脉动效果
  coordinateMarkerMeshes.value.forEach(mesh => {
    if (mesh && mesh.material) {
      // 坐标标记脉动效果
      const time = Date.now() * 0.001
      const pulse = 0.7 + 0.3 * Math.sin(time * 2 + mesh.userData.pulseTime)
      mesh.material.opacity = params.coordinateMarkerOpacity.value * pulse
      
      // 轻微缩放效果
      const scalePulse = 1 + 0.1 * Math.sin(time * 3 + mesh.userData.pulseTime)
      mesh.scale.setScalar(mesh.userData.size * scalePulse)
      
      // 调试信息：检查坐标标记是否跟随地球旋转（仅在需要时启用）
      // if (import.meta.env.DEV && mesh.userData.originalMarker) {
      //   const worldPosition = mesh.getWorldPosition(new THREE.Vector3())
      //   console.log(`坐标标记 ${mesh.userData.originalMarker.name} 世界位置:`, worldPosition)
      // }
    }
  })
  
  if (controls) {
    controls.update()
  }
  
  if (renderer && scene && camera) {
    try {
      renderer.render(scene, camera)
      
      // 记录帧数用于性能监控
      if (import.meta.env.DEV) {
        import('@/utils/performanceMonitor').then(({ performanceMonitor }) => {
          performanceMonitor.recordFrame()
        })
      }
    } catch (error) {
      console.warn('渲染错误，可能是WebGL上下文问题:', error)
      // 如果渲染失败，停止动画循环
      if (animationId) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
    }
  }
}

// 窗口大小调整
const onWindowResize = () => {
  if (!camera || !renderer || !threeContainer.value) return
  
  const container = threeContainer.value
  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.clientWidth, container.clientHeight)
}

// 切换控制面板
const toggleControls = () => {
  showControls.value = !showControls.value
}

// 初始化Three.js
const initThreeJS = async () => {
  try {
    createScene()
    createCamera()
    createRenderer()
    createControls()
    createLights()
    
    // 加载纹理
    const texturesLoaded = await loadAllTextures()
    if (texturesLoaded) {
      createEarth()
      initLocationMarkers() // 初始化光圈坐标点
      initCoordinateMarkers() // 初始化坐标标记点
      animate()
      loading.value = false
    }
  } catch (error) {
    console.error('Three.js初始化失败:', error)
    loading.value = false
  }
}

// 清理资源
const cleanup = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
  if (controls) {
    controls.dispose()
  }
}

onMounted(() => {
  initThreeJS()
  window.addEventListener('resize', onWindowResize)
})

onBeforeUnmount(() => {
  cleanup()
  window.removeEventListener('resize', onWindowResize)
})
</script>

<style scoped>
.beautiful-earth {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.three-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0c1445 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
}

.three-container canvas {
  border-radius: 12px;
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
  padding: 16px 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.main-title {
  font-size: 28px;
  font-weight: 600;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  letter-spacing: 2px;
}

.sub-title {
  font-size: 12px;
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

.control-group input[type="range"] {
  width: 100%;
  height: 4px;
  background: var(--border-secondary);
  border-radius: 2px;
  outline: none;
}

.control-group input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #4facfe;
  border-radius: 50%;
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