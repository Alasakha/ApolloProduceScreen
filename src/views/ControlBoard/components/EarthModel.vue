<template>
  <div ref="container" class="earth-container">
    <!-- 添加模型切换按钮 -->
    <div class="model-switcher">
      <button 
        @click="switchToEarth" 
        :class="{ active: currentModelType === 'earth' }"
        class="switch-btn"
      >
        地球模型
      </button>
      <button 
        @click="switchToMotorcycle" 
        :class="{ active: currentModelType === 'motorcycle' }"
        class="switch-btn"
      >
        摩托车模型
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import THREE, { STLLoader, OrbitControls } from '@/utils/threejsManager.js'
// import earthTextureUrl from '../../../assets/earth.png'
import appoloEarthTextureUrl from '../../../assets/appoloEarth.png'
// 光环贴图 - 如果没有专门的图片，可以使用一个简单的径向渐变
const glowTextureUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyYWRpYWxHcmFkaWVudCBpZD0iZ3JhZGllbnQiIGN4PSIxMjgiIGN5PSIxMjgiIHI9IjEyOCI+CjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzAwRkZGRiIgc3RvcC1vcGFjaXR5PSIwLjgiLz4KPHN0b3Agb2Zmc2V0PSIwLjMiIHN0b3AtY29sb3I9IiMwMEZGRkYiIHN0b3Atb3BhY2l0eT0iMC40Ii8+CjxzdG9wIG9mZnNldD0iMC42IiBzdG9wLWNvbG9yPSIjMDBGRkZGIiBzdG9wLW9wYWNpdHk9IjAuMiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMEZGRkYiIHN0b3Atb3BhY2l0eT0iMCIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8Y2lyY2xlIGN4PSIxMjgiIGN5PSIxMjgiIHI9IjEyOCIgZmlsbD0idXJsKCNncmFkaWVudCkiLz4KPC9zdmc+'

// 定义props
const props = defineProps({
  modelType: {
    type: String,
    default: 'earth',
    validator: (value) => ['earth', 'motorcycle'].includes(value)
  }
})

const container = ref(null)
let scene, camera, renderer, earth, clouds, motorcycle
let tradeLines = [], cityMarkers = [], particles = []
let animationId = null
let mouseX = 0, mouseY = 0
let controls

// 鼠标拖拽控制变量
let isMouseDown = false
let mouseDownX = 0, mouseDownY = 0
let earthRotationX = 0, earthRotationY = 0
let targetRotationX = 0, targetRotationY = 0

// 当前模型类型
const currentModelType = ref(props.modelType)

// 固定地球大小 - 设置为占据画面75%
const earthScale = 2.5

// 摩托车缩放比例
const motorcycleScale = 0.15

// 模型切换函数
const switchToEarth = () => {
  currentModelType.value = 'earth'
  switchModel('earth')
}

const switchToMotorcycle = () => {
  currentModelType.value = 'motorcycle'
  switchModel('motorcycle')
}

// 模型切换逻辑
const switchModel = (type) => {
  console.log(`切换到模型类型: ${type}`)
  
  if (type === 'earth') {
    console.log('切换到地球模型...')
    // 隐藏摩托车，显示地球
    if (motorcycle) {
      motorcycle.visible = false
      console.log('隐藏摩托车模型')
    }
    if (earth) {
      earth.visible = true
      console.log('显示地球模型')
    }
    // 重新创建地球相关元素
    createTradeLines()
    createCityMarkers()
    createStarField()
    // 调整相机到地球视角
    camera.position.set(0, 0, 8)
    camera.lookAt(0, 0, 0)
    // 重置OrbitControls
    if (controls) {
      controls.reset()
    }
    console.log('相机调整到地球视角')
  } else {
    console.log('切换到摩托车模型...')
    // 隐藏地球，显示摩托车
    if (earth) {
      earth.visible = false
      console.log('隐藏地球模型')
    }
    
    // 如果摩托车不存在，创建它
    if (!motorcycle) {
      console.log('摩托车模型不存在，开始创建...')
      createMotorcycle()
    } else {
      motorcycle.visible = true
      console.log('显示已存在的摩托车模型')
    }
    
    // 清除地球相关元素
    clearEarthElements()
    
    // 调整相机到摩托车视角，让模型在画面中央
    camera.position.set(0, 2, 6)
    camera.lookAt(0, 0, 0)
    // 重置OrbitControls
    if (controls) {
      controls.reset()
    }
    console.log('相机调整到摩托车视角')
  }
  
  // 打印调试信息
  setTimeout(() => {
    debugScene()
  }, 100)
}

// 清除地球相关元素
const clearEarthElements = () => {
  // 清除贸易飞线
  tradeLines.forEach(line => {
    if (line.parent) {
      line.parent.remove(line)
    }
  })
  tradeLines = []
  
  // 清除城市标记
  cityMarkers.forEach(marker => {
    if (marker.parent) {
      marker.parent.remove(marker)
    }
  })
  cityMarkers = []
  
  // 清除粒子系统
  particles.forEach(particle => {
    if (particle.parent) {
      particle.parent.remove(particle)
    }
  })
  particles = []
}

 // 贸易路线数据 - 统一使用蓝色
  const tradeRoutes = [
   {
     from: { lat: 30.2741, lng: 120.1551, name: '杭州' },
     to: { lat: 40.7128, lng: -74.0060, name: '纽约' },
     color: 0x0080ff, // 🔵 贸易路线颜色 - 可调整（当前为蓝色）
     intensity: 1.0
   },
  //  {
  //    from: { lat: 30.2741, lng: 120.1551, name: '杭州' },
  //    to: { lat: 51.5074, lng: -0.1278, name: '伦敦' },
  //    color: 0x0080ff, // 🔵 贸易路线颜色 - 可调整（当前为蓝色）
  //    intensity: 1.0
  //  },
  //  {
  //    from: { lat: 30.2741, lng: 120.1551, name: '杭州' },
  //    to: { lat: 35.6762, lng: 139.6503, name: '东京' },
  //    color: 0x0080ff, // 🔵 贸易路线颜色 - 可调整（当前为蓝色）
  //    intensity: 1.0
  //  },
  //  {
  //    from: { lat: 30.2741, lng: 120.1551, name: '杭州' },
  //    to: { lat: -33.8688, lng: 151.2093, name: '悉尼' },
  //    color: 0x0080ff, // 🔵 贸易路线颜色 - 可调整（当前为蓝色）
  //    intensity: 1.0
  //  },
  //  {
  //    from: { lat: 30.2741, lng: 120.1551, name: '杭州' },
  //    to: { lat: -23.5505, lng: -46.6333, name: '圣保罗' },
  //    color: 0x0080ff, // 🔵 贸易路线颜色 - 可调整（当前为蓝色）
  //    intensity: 1.0
  //  }
 ]

// 初始化Three.js场景
const initThree = () => {
  // 创建场景
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x000000, 50, 200)
  
     // 创建相机
  camera = new THREE.PerspectiveCamera(
    60,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 8) // 调整相机距离，适应固定地球大小
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance"
  })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setClearColor(0x000000, 0)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  container.value.appendChild(renderer.domElement)
  
  // 创建OrbitControls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true // 启用阻尼效果
  controls.dampingFactor = 0.05
  controls.enableZoom = true // 启用缩放
  controls.enablePan = true // 启用平移
  controls.enableRotate = true // 启用旋转
  controls.autoRotate = false // 禁用自动旋转
  controls.autoRotateSpeed = 2.0
  controls.minDistance = 2 // 最小距离
  controls.maxDistance = 20 // 最大距离
  
  // 创建光照系统
  createLighting()
  
  // 根据当前模型类型创建相应的模型
  if (currentModelType.value === 'earth') {
    createRealEarth()
    createTradeLines()
    createCityMarkers()
    createStarField()
  } else {
    // 确保摩托车模型被创建
    createMotorcycle()
  }
  
  // 初始化元素位置
  initializeElementPositions()
  
  // 添加鼠标交互
  addMouseInteraction()
  
  // 开始动画
  animate()
  
  // 添加窗口大小调整监听
  window.addEventListener('resize', onWindowResize)
}

// 创建光照系统
const createLighting = () => {
  // 环境光
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
  scene.add(ambientLight)
  
  // 主光源（太阳）
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.2)
  sunLight.position.set(20, 20, 20)
  sunLight.castShadow = true
  sunLight.shadow.mapSize.width = 2048
  sunLight.shadow.mapSize.height = 2048
  sunLight.shadow.camera.near = 0.5
  sunLight.shadow.camera.far = 50
  sunLight.shadow.camera.left = -10
  sunLight.shadow.camera.right = 10
  sunLight.shadow.camera.top = 10
  sunLight.shadow.camera.bottom = -10
  scene.add(sunLight)
  
  // 点光源
  const pointLight = new THREE.PointLight(0x00ffff, 0.8, 100)
  pointLight.position.set(-10, 10, -10)
  scene.add(pointLight)
  
  // 半球光
  const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x000000, 0.3)
  scene.add(hemisphereLight)
}

// 创建真实地球
const createRealEarth = () => {
  // 使用固定的地球大小
  const earthRadius = earthScale
  const geometry = new THREE.SphereGeometry(earthRadius, 128, 128)
  
  // 使用真实的地球贴图
  const textureLoader = new THREE.TextureLoader()
  // const earthTexture = textureLoader.load(earthTextureUrl) // 注释掉原来的贴图
  const earthTexture = textureLoader.load(appoloEarthTextureUrl) // 使用新的 appoloEarth 贴图
  
     // 创建地球材质
   const earthMaterial = new THREE.MeshPhongMaterial({
     map: earthTexture,
     transparent: false,
     shininess: 100,
     specular: 0x222222,
     // 添加材质优化，减少接缝线
     side: THREE.FrontSide,
     // 调整材质参数，减少接缝线
     bumpScale: 0.1
   })
  
  earth = new THREE.Mesh(geometry, earthMaterial)
  earth.castShadow = true
  earth.receiveShadow = true
  scene.add(earth)
  
     // 添加地球光环效果
   // earthGlow = createEarthGlow()
  
     // 添加地球大气层效果
   // const atmosphereGeometry = new THREE.SphereGeometry(2.3, 128, 128)
   // const atmosphereMaterial = new THREE.MeshBasicMaterial({
   //   color: 0x87ceeb,
   //   transparent: true,
   //   opacity: 0.05,
   //   side: THREE.BackSide
   // })
   // const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
   // scene.add(atmosphere)
  
     // 添加地球网格线
   // createEarthGrid()
}

// 创建地球光环效果
const createEarthGlow = () => {
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load(glowTextureUrl)
  
  // 创建精灵材质对象SpriteMaterial
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture, // 设置精灵纹理贴图
    transparent: true, // 开启透明
    opacity: 0.4, // 可以通过透明度整体调节光圈
    blending: THREE.AdditiveBlending, // 使用加法混合模式，增强发光效果
    depthWrite: false, // 禁用深度写入，确保光环始终可见
    color: 0x00ffff // 设置光环颜色为青色
  })
  
  // 创建表示地球光圈的精灵模型
  const sprite = new THREE.Sprite(spriteMaterial)
  sprite.scale.set(5, 5, 1) // 适当缩放精灵，比地球大一些
  sprite.position.set(0, 0, 0)
  
  scene.add(sprite)
  return sprite
}

// 创建地球网格线
const createEarthGrid = () => {
  // 经线（子午线）
  for (let i = 0; i < 24; i++) {
    const longitude = (i / 24) * Math.PI * 2
    const points = []
    
    for (let j = 0; j <= 128; j++) {
      const latitude = (j / 128) * Math.PI - Math.PI / 2
      const x = earthScale * Math.cos(latitude) * Math.cos(longitude)
      const y = earthScale * Math.sin(latitude)
      const z = earthScale * Math.cos(latitude) * Math.sin(longitude)
      points.push(new THREE.Vector3(x, y, z))
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: 0x444444,
      transparent: true,
      opacity: 0.2
    })
    
    const line = new THREE.Line(geometry, material)
    scene.add(line)
  }
  
  // 纬线（平行线）
  for (let i = 1; i < 16; i++) {
    const latitude = (i / 16) * Math.PI - Math.PI / 2
    const points = []
    
    for (let j = 0; j <= 128; j++) {
      const longitude = (j / 128) * Math.PI * 2
      const x = earthScale * Math.cos(latitude) * Math.cos(longitude)
      const y = earthScale * Math.sin(latitude)
      const z = earthScale * Math.cos(latitude) * Math.sin(longitude)
      points.push(new THREE.Vector3(x, y, z))
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: 0x444444,
      transparent: true,
      opacity: 0.2
    })
    
    const line = new THREE.Line(geometry, material)
    scene.add(line)
  }
}



// 创建贸易飞线
const createTradeLines = () => {
  tradeRoutes.forEach(route => {
    const fromPos = latLngToVector3(route.from.lat, route.from.lng, earthScale + 0.1)
    const toPos = latLngToVector3(route.to.lat, route.to.lng, earthScale + 0.1)
    
    // 创建光柱特效
    const lightBeam = createLightBeam(fromPos, toPos, route.color)
    lightBeam.userData = { originalRoute: route }
    earth.add(lightBeam)
    tradeLines.push(lightBeam)
    
    // 创建专业飞线
    const tradeLine = createAdvancedTradeLine(fromPos, toPos, route.color)
    // 为飞线组中的每个子线条添加用户数据
    tradeLine.line.children.forEach(child => {
      child.userData = { 
        originalRoute: route,
        curve: tradeLine.curve,
        isMainLine: child === tradeLine.line.children[0] // 标记主飞线
      }
    })
    earth.add(tradeLine.line)
    tradeLines.push(tradeLine.line)
    
    // 创建移动光点
    const movingLight = createMovingLight(tradeLine.curve, route.color)
    movingLight.light.userData = {
      curve: tradeLine.curve,
      progress: 0,
      speed: 0.005 + Math.random() * 0.008,
      glow: movingLight.glow,
      originalRoute: route
    }
    movingLight.glow.userData = { originalRoute: route }
    
    earth.add(movingLight.light)
    earth.add(movingLight.glow)
    tradeLines.push(movingLight.light)
    tradeLines.push(movingLight.glow)
  })
}

// 创建光柱特效
const createLightBeam = (fromPos, toPos, color) => {
  // 计算光柱长度和方向
  const direction = new THREE.Vector3().subVectors(toPos, fromPos)
  const length = direction.length()
  const height = length * 0.3 // 🔵 光柱高度比例 - 可调整（当前为飞线长度的30%）
  
  // ===== 光柱样式调整位置 =====
  // 根据地球大小调整光柱粗细
  const thickness = Math.max(0.03, earthScale * 0.02) // 🔵 光柱粗细 - 可调整（最小0.03，随地球大小变化）
  
  // 创建光柱几何体
  const plane = new THREE.PlaneGeometry(thickness, height)
  
  // 创建光柱材质
  const material = new THREE.MeshPhongMaterial({
    color: color, // 🔵 光柱颜色 - 继承自贸易路线颜色
    transparent: true,
    opacity: 0.4, // 🔵 光柱透明度 - 可调整
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  })
  
  // 创建两个交叉的光柱网格
  const mesh1 = new THREE.Mesh(plane, material)
  const mesh2 = mesh1.clone().rotateY(Math.PI / 2)
  
  // 创建光柱组
  const lightBeamGroup = new THREE.Group()
  lightBeamGroup.add(mesh1, mesh2)
  
  // ===== 中心光点样式调整位置 =====
  // 添加中心光点，增强光柱效果
  const centerLight = new THREE.Mesh(
    new THREE.SphereGeometry(thickness * 0.5, 8, 8), // 🔵 中心光点大小 - 可调整（当前为光柱粗细的一半）
    new THREE.MeshBasicMaterial({
      color: color, // 🔵 中心光点颜色 - 继承自贸易路线颜色
      transparent: true,
      opacity: 0.8, // 🔵 中心光点透明度 - 可调整
      blending: THREE.AdditiveBlending
    })
  )
  lightBeamGroup.add(centerLight)
  
  // 设置光柱位置和方向 - 修复方向计算
  lightBeamGroup.position.copy(fromPos)
  
  // 计算正确的朝向，确保光柱指向目标点
  const targetDirection = toPos.clone().sub(fromPos).normalize()
  lightBeamGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), targetDirection)
  
  return lightBeamGroup
}

// 创建专业飞线 - 使用分段线条和抬升效果
const createAdvancedTradeLine = (fromPos, toPos, color) => {
  // 计算两个点之间的距离和角度
  const distance = fromPos.distanceTo(toPos)
  const angle = fromPos.angleTo(toPos)
  
  // ===== 飞线曲线样式调整位置 =====
  // 使用分段线条创建飞线，保持抬升效果
  const earthRadius = earthScale
  
  // 创建飞线路径点 - 使用20段分段
  const points = []
  const segments = 20 // 🔵 飞线分段数 - 可调整（当前20段）
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    
    // 使用线性插值计算基础位置
    const basePoint = new THREE.Vector3().lerpVectors(fromPos, toPos, t)
    
    // 计算抬升高度 - 使用正弦函数创建弧形
    const heightMultiplier = 1 + Math.abs(0.4 * Math.sin((Math.PI * i) / segments)) // 🔵 飞线抬升系数 - 可调整（当前0.4）
    
    // 应用抬升效果
    const elevatedPoint = basePoint.clone().multiplyScalar(heightMultiplier)
    
    // 确保飞线不会穿过地球 - 添加最小高度偏移
    const minHeight = earthRadius + 0.2 // 🔵 飞线最小高度 - 可调整（当前地球半径+0.2）
    if (elevatedPoint.length() < minHeight) {
      elevatedPoint.normalize().multiplyScalar(minHeight)
    }
    
    points.push(elevatedPoint)
  }
  
  // 创建线条几何体
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  
  // ===== 飞线材质样式调整位置 =====
  // 创建主飞线材质
  const mainMaterial = new THREE.LineBasicMaterial({
    color: color, // 🔵 飞线颜色 - 继承自贸易路线颜色
    transparent: true,
    opacity: 0.9, // 🔵 飞线透明度 - 可调整
    linewidth: 3 // 🔵 飞线宽度 - 可调整（注意：WebGL中可能不生效）
  })
  
  const mainLine = new THREE.Line(geometry, mainMaterial)
  
  // 创建发光飞线材质 - 使用加法混合，增强发光效果
  const glowMaterial = new THREE.LineBasicMaterial({
    color: color, // 🔵 发光飞线颜色 - 继承自贸易路线颜色
    transparent: true,
    opacity: 0.4, // 🔵 发光飞线透明度 - 可调整
    linewidth: 5, // 🔵 发光飞线宽度 - 可调整
    blending: THREE.AdditiveBlending
  })
  
  const glowLine = new THREE.Line(geometry, glowMaterial)
  
  // 创建飞线组，包含主飞线和发光飞线
  const lineGroup = new THREE.Group()
  lineGroup.add(mainLine)
  lineGroup.add(glowLine)
  
  // 为每个子对象添加用户数据
  lineGroup.children.forEach(child => {
    child.userData = { 
      originalRoute: { color: color }, // 简化用户数据结构
      curve: { 
        getPoints: () => points,
        getPointAt: (t) => {
          // 实现getPointAt方法，用于动画
          const index = Math.floor(t * (points.length - 1))
          const nextIndex = Math.min(index + 1, points.length - 1)
          const localT = (t * (points.length - 1)) - index
          
          if (index === points.length - 1) {
            return points[points.length - 1]
          }
          
          // 线性插值计算中间点
          return new THREE.Vector3().lerpVectors(points[index], points[nextIndex], localT)
        }
      }, // 兼容性处理
      isMainLine: child === mainLine
    }
  })
  
  return { 
    curve: { 
      getPoints: () => points,
      getPointAt: (t) => {
        // 实现getPointAt方法，用于动画
        const index = Math.floor(t * (points.length - 1))
        const nextIndex = Math.min(index + 1, points.length - 1)
        const localT = (t * (points.length - 1)) - index
        
        if (index === points.length - 1) {
          return points[points.length - 1]
        }
        
        // 线性插值计算中间点
        return new THREE.Vector3().lerpVectors(points[index], points[nextIndex], localT)
      }
    }, 
    line: lineGroup 
  }
}

// 辅助函数：计算指定长度的向量
const getLenVector = (start, end, length) => {
  const direction = new THREE.Vector3().subVectors(end, start).normalize()
  return start.clone().add(direction.multiplyScalar(length))
}

// 创建移动光点
const createMovingLight = (curve, color) => {
  // ===== 移动光点样式调整位置 =====
  // 根据地球大小调整光点大小
  const lightSize = Math.max(0.015, earthScale * 0.01) // 🔵 移动光点大小 - 可调整（最小0.015，随地球大小变化）
  const glowSize = lightSize * 2 // 🔵 光晕大小倍数 - 可调整（当前为光点的2倍）
  
  const lightGeometry = new THREE.SphereGeometry(lightSize, 8, 8)
  const lightMaterial = new THREE.MeshBasicMaterial({
    color: color, // 🔵 移动光点颜色 - 继承自贸易路线颜色
    transparent: true,
    opacity: 0.9 // 🔵 移动光点透明度 - 可调整
  })
  
  const light = new THREE.Mesh(lightGeometry, lightMaterial)
  
  // ===== 移动光点光晕样式调整位置 =====
  // 添加光晕
  const glowGeometry = new THREE.SphereGeometry(glowSize, 8, 8)
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: color, // 🔵 光晕颜色 - 继承自贸易路线颜色
    transparent: true,
    opacity: 0.4 // 🔵 光晕透明度 - 可调整
  })
  
  const glow = new THREE.Mesh(glowGeometry, glowMaterial)
  
  return { light, glow, curve }
}

// 辅助函数：获取两个向量的中心点
const getVCenter = (v1, v2) => {
  return v1.clone().add(v2).divideScalar(2)
}

// 初始化元素位置 - 由于地球大小固定，只需要初始化一次
const initializeElementPositions = () => {
  // 初始化城市标记位置和大小
  cityMarkers.forEach((marker, index) => {
    if (index % 2 === 0) { // 只更新主标记，跳过光晕
      const cityIndex = Math.floor(index / 2)
      const city = [
        { lat: 30.2741, lng: 120.1551, name: '杭州' },
        { lat: 40.7128, lng: -74.0060, name: '纽约' },
        { lat: 51.5074, lng: -0.1278, name: '伦敦' },
        { lat: 35.6762, lng: 139.6503, name: '东京' },
        { lat: -33.8688, lng: 151.2093, name: '悉尼' },
        { lat: -23.5505, lng: -46.6333, name: '圣保罗' }
      ][cityIndex]
      
      if (city) {
        const pos = latLngToVector3(city.lat, city.lng, earthScale + 0.05)
        marker.position.copy(pos)
        
        // 设置城市标记大小
        const markerSize = Math.max(0.025, earthScale * 0.017)
        marker.geometry.dispose()
        marker.geometry = new THREE.SphereGeometry(markerSize, 8, 8)
        
        // 同时设置光晕位置和大小
        if (cityMarkers[index + 1]) {
          const glow = cityMarkers[index + 1]
          glow.position.copy(pos)
          glow.geometry.dispose()
          glow.geometry = new THREE.SphereGeometry(markerSize + 0.008, 8, 8)
        }
      }
    }
  })
  
  // 初始化贸易飞线位置和大小
  tradeLines.forEach((line, index) => {
    const routeIndex = Math.floor(index / 4)
    const route = tradeRoutes[routeIndex]
    if (!route) return
    
    const fromPos = latLngToVector3(route.from.lat, route.from.lng, earthScale + 0.1)
    const toPos = latLngToVector3(route.to.lat, route.to.lng, earthScale + 0.1)
    
    if (index % 4 === 0) { // 光柱
      // 设置光柱位置和方向
      line.position.copy(fromPos)
      const targetDirection = toPos.clone().sub(fromPos).normalize()
      line.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), targetDirection)
      
      // 设置光柱长度和粗细
      const distance = fromPos.distanceTo(toPos)
      const height = distance * 0.3 // 光柱高度为飞线长度的30%
      const thickness = Math.max(0.03, earthScale * 0.02) // 光柱粗细
      
      // 设置光柱几何体
      line.children.forEach((mesh, meshIndex) => {
        if (meshIndex < 2) { // 前两个是光柱平面
          mesh.geometry.dispose()
          mesh.geometry = new THREE.PlaneGeometry(thickness, height)
        } else if (meshIndex === 2) { // 第三个是中心光点
          mesh.geometry.dispose()
          mesh.geometry = new THREE.SphereGeometry(thickness * 0.5, 8, 8)
        }
      })
    } else if (index % 4 === 1) { // 飞线
      // 设置飞线
      if (line.userData && line.userData.originalRoute) {
        const newCurve = createAdvancedTradeLine(fromPos, toPos, route.color)
        line.geometry.dispose()
        line.geometry = newCurve.line.geometry
        line.userData.curve = newCurve.curve
      }
    } else if (index % 4 === 2 || index % 4 === 3) { // 移动光点和光晕
      // 设置移动光点大小
      const lightSize = Math.max(0.015, earthScale * 0.01)
      const glowSize = lightSize * 2
      
      if (index % 4 === 2) { // 移动光点
        line.geometry.dispose()
        line.geometry = new THREE.SphereGeometry(lightSize, 8, 8)
      } else { // 光晕
        line.geometry.dispose()
        line.geometry = new THREE.SphereGeometry(glowSize, 8, 8)
      }
      
      // 设置曲线
      if (line.userData && line.userData.curve) {
        const newCurve = createAdvancedTradeLine(fromPos, toPos, route.color)
        line.userData.curve = newCurve.curve
      }
    }
  })
}

       // 创建城市标记 - 重新设计为蓝色荧光点
   const createCityMarkers = () => {
     const cities = [
       { lat: 30.2741, lng: 120.1551, name: '杭州', size: 0.04 },
       { lat: 40.7128, lng: -74.0060, name: '纽约', size: 0.04 },
       { lat: 51.5074, lng: -0.1278, name: '伦敦', size: 0.04 },
       { lat: 35.6762, lng: 139.6503, name: '东京', size: 0.04 },
       { lat: -33.8688, lng: 151.2093, name: '悉尼', size: 0.04},
       { lat: -23.5505, lng: -46.6333, name: '圣保罗', size: 0.04 }
     ]
    
        cities.forEach(city => {
       const pos = latLngToVector3(city.lat, city.lng, earthScale + 0.05)
      
            // ===== 城市标记样式调整位置 =====
       // 根据地球大小调整城市标记大小
       const markerSize = Math.max(0.025, earthScale * 0.017) // 最小0.025，随地球大小变化
       const geometry = new THREE.SphereGeometry(markerSize, 8, 8)
       const material = new THREE.MeshBasicMaterial({
         color: 0x0080ff, // 🔵 城市标记颜色 - 可调整
         transparent: true,
         opacity: 1 // 🔵 城市标记透明度 - 可调整
       })
       
       const marker = new THREE.Mesh(geometry, material)
       marker.position.copy(pos)
       
       // 将城市标记添加为地球的子对象，跟随地球旋转
       earth.add(marker)
       cityMarkers.push(marker)
       
       // ===== 城市光晕样式调整位置 =====
       // 添加城市光晕 - 也变小
       const glowGeometry = new THREE.SphereGeometry(markerSize + 0.008, 8, 8) // 🔵 光晕大小偏移量 - 可调整
       const glowMaterial = new THREE.MeshBasicMaterial({
         color: 0x0080ff, // 🔵 光晕颜色 - 可调整
         transparent: true,
         opacity: 1 // 🔵 光晕透明度 - 可调整
       })
      
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.position.copy(pos)
      
      // 将城市光晕也添加为地球的子对象
      earth.add(glow)
      cityMarkers.push(glow)
    })
  }

// 经纬度转换为3D坐标
const latLngToVector3 = (lat, lng, radius) => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = (radius * Math.sin(phi) * Math.sin(theta))
  const y = (radius * Math.cos(phi))
  
  return new THREE.Vector3(x, y, z)
}

// 创建云层
const createClouds = () => {
  const cloudGeometry = new THREE.SphereGeometry(2.15, 64, 64)
  const cloudMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2
  })
  
  clouds = new THREE.Mesh(cloudGeometry, cloudMaterial)
  scene.add(clouds)
}



// 创建淡蓝色星空背景
const createStarField = () => {
  // ===== 星空样式调整位置 =====
  const starsCount = 800 // 🔵 星星数量 - 可调整
  const stars = new THREE.Group()
  
  for (let i = 0; i < starsCount; i++) {
    // 创建圆形精灵几何体
    const starGeometry = new THREE.CircleGeometry(0.08 + Math.random() * 0.03, 8) // 🔵 星星大小范围 - 可调整（当前0.08-0.11）
    
    // 创建淡蓝色材质
    const starMaterial = new THREE.MeshBasicMaterial({
      color: 0x87CEEB, // 🔵 星星颜色 - 可调整（当前为淡蓝色）
      transparent: true,
      opacity: 0.3 + Math.random() * 0.4, // 🔵 星星透明度范围 - 可调整（当前0.3-0.7）
      side: THREE.DoubleSide
    })
    
    const star = new THREE.Mesh(starGeometry, starMaterial)
    
    // 随机位置 - 确保在地球后面
    const radius = 15 + Math.random() * 20 // 🔵 星空距离范围 - 可调整（当前距离地球15-35单位）
    const theta = Math.random() * Math.PI * 2 // 随机角度
    const phi = Math.random() * Math.PI // 随机仰角
    
    star.position.x = radius * Math.sin(phi) * Math.cos(theta)
    star.position.y = radius * Math.cos(phi)
    star.position.z = radius * Math.sin(phi) * Math.sin(theta)
    
    // 随机旋转
    star.rotation.z = Math.random() * Math.PI * 2
    
    stars.add(star)
  }
  
  // 将星空添加到场景，确保在地球后面
  scene.add(stars)
  particles.push(stars) // 添加到粒子数组以便动画
}

// 添加鼠标交互
const addMouseInteraction = () => {
  // 鼠标移动 - 用于相机轻微摆动
  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1
  })
  
  // 鼠标按下 - 开始拖拽
  document.addEventListener('mousedown', (event) => {
    isMouseDown = true
    mouseDownX = event.clientX
    mouseDownY = event.clientY
  })
  
  // 鼠标释放 - 结束拖拽
  document.addEventListener('mouseup', () => {
    isMouseDown = false
  })
  
  // 鼠标拖拽 - 控制地球旋转
  document.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
      const deltaX = event.clientX - mouseDownX
      const deltaY = event.clientY - mouseDownY
      
      // 计算目标旋转角度
      targetRotationY += deltaX * 0.01
      targetRotationX += deltaY * 0.01
      
      // 限制X轴旋转范围，避免地球翻转
      targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX))
      
      // 更新鼠标位置
      mouseDownX = event.clientX
      mouseDownY = event.clientY
    }
  })
  
  // 鼠标离开窗口 - 停止拖拽
  document.addEventListener('mouseleave', () => {
    isMouseDown = false
  })
  
  // 触摸支持 - 移动设备
  document.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1) {
      isMouseDown = true
      mouseDownX = event.touches[0].clientX
      mouseDownY = event.touches[0].clientY
    }
  })
  
  document.addEventListener('touchend', () => {
    isMouseDown = false
  })
  
  document.addEventListener('touchmove', (event) => {
    if (isMouseDown && event.touches.length === 1) {
      event.preventDefault()
      const deltaX = event.touches[0].clientX - mouseDownX
      const deltaY = event.touches[0].clientY - mouseDownY
      
      // 计算目标旋转角度
      targetRotationY += deltaX * 0.01
      targetRotationX += deltaY * 0.01
      
      // 限制X轴旋转范围，避免地球翻转
      targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX))
      
      // 更新触摸位置
      mouseDownX = event.touches[0].clientX
      mouseDownY = event.touches[0].clientY
    }
  })
  
     // 移除滚轮缩放支持 - 地球大小固定
}

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  // 更新OrbitControls
  if (controls) {
    controls.update()
  }
  
  const time = Date.now() * 0.001
  
  // 根据当前模型类型执行不同的动画
  if (currentModelType.value === 'earth') {
    // 地球拖拽旋转 - 平滑过渡
    if (earth && earth.visible) {
      // 平滑过渡到目标旋转角度
      earthRotationX += (targetRotationX - earthRotationX) * 0.1
      earthRotationY += (targetRotationY - earthRotationY) * 0.1
      
      // 应用旋转
      earth.rotation.x = earthRotationX
      earth.rotation.y = earthRotationY
      
      // 地球大小固定，不需要缩放
      earth.scale.setScalar(1)
      
      // 地球完全由用户控制，不自动旋转
    }
    
    // 贸易飞线动画
    tradeLines.forEach(line => {
      if (line.userData && line.userData.curve) {
        // ===== 移动光点动画样式调整位置 =====
        // 移动光点动画 - 沿着贝塞尔曲线移动
        line.userData.progress += line.userData.speed
        if (line.userData.progress > 1) {
          line.userData.progress = 0
        }
        
        const t = line.userData.progress
        const curve = line.userData.curve
        const position = curve.getPointAt(t)
        
        // 更新光点位置
        line.position.copy(position)
        
        // 光点闪烁效果
        line.material.opacity = 0.7 + Math.sin(time * 8) * 0.3 // 🔵 光点闪烁频率和强度 - 可调整
        
        // 光晕也跟随移动
        if (line.userData.glow) {
          line.userData.glow.position.copy(position)
          line.userData.glow.material.opacity = 0.3 + Math.sin(time * 6) * 0.2 // 🔵 光晕闪烁频率和强度 - 可调整
        }
      } else if (line.userData && line.userData.material) {
        // 更新着色器材质的uniforms（保留兼容性）
        line.userData.material.uniforms.time.value = time
      } else if (line.children && line.children.length > 0) {
        // 处理飞线组（包含主飞线和发光飞线）
        if (line.children.length === 2 && line.children[0].userData && line.children[0].userData.curve) {
          // 这是飞线组，为每个子线条添加动画效果
          line.children.forEach((child, childIndex) => {
            if (child.userData && child.userData.curve) {
              // 飞线轻微闪烁效果
              if (child.material) {
                const baseOpacity = childIndex === 0 ? 0.9 : 0.4 // 主飞线0.9，发光飞线0.4
                const flickerIntensity = childIndex === 0 ? 0.05 : 0.1 // 发光飞线闪烁更明显
                child.material.opacity = baseOpacity + Math.sin(time * 3 + childIndex) * flickerIntensity
              }
            }
          })
        } else {
          // ===== 光柱动画样式调整位置 =====
          // 光柱动画效果
          line.children.forEach((mesh, index) => {
            // 光柱轻微旋转
            mesh.rotation.z += 0.001 * (index + 1) // 🔵 光柱旋转速度 - 可调整
            
            // 光柱透明度变化
            if (mesh.material) {
              mesh.material.opacity = 0.3 + Math.sin(time * 2 + index) * 0.1 // 🔵 光柱闪烁频率和强度 - 可调整
            }
            
            // 中心光点闪烁效果
            if (index === 2) { // 第三个子对象是中心光点
              mesh.material.opacity = 0.6 + Math.sin(time * 6) * 0.4 // 🔵 中心光点闪烁频率和强度 - 可调整
            }
          })
        }
      }
    })
    
    // ===== 城市标记动画样式调整位置 =====
    // 城市标记闪烁效果
    cityMarkers.forEach((marker, index) => {
      if (index % 2 === 0) {
        marker.material.opacity = 0.7 + Math.sin(time * 2 + index) * 0.2 // 🔵 城市标记闪烁频率和强度 - 可调整
      }
    })
    
    // 粒子系统动画 - 包括星空
    particles.forEach((particle) => {
      // ===== 星空动画样式调整位置 =====
      // 星空整体缓慢旋转
      particle.rotation.y += 0.0003 // 🔵 星空Y轴旋转速度 - 可调整
      particle.rotation.x += 0.0001 // 🔵 星空X轴旋转速度 - 可调整
      
      // 为每个星星添加闪烁效果
      particle.children.forEach((star, starIndex) => {
        if (star.material) {
          star.material.opacity = 0.3 + Math.sin(time * 1.5 + starIndex * 0.1) * 0.2 // 🔵 星星闪烁频率和强度 - 可调整
        }
      })
    })
    
    // 相机轻微摆动（跟随鼠标）
    camera.position.x = Math.sin(time * 0.5) * 0.3 + mouseX * 0.5
    camera.position.y = Math.cos(time * 0.5) * 0.2 + mouseY * 0.3
    camera.position.z = 8 // 固定相机距离
    camera.lookAt(0, 0, 0)
  } else if (currentModelType.value === 'motorcycle') {
    // 摩托车保持静止，不自动旋转
    // 相机位置保持固定，由 OrbitControls 控制
    if (controls && controls.enabled) {
      // 让 OrbitControls 完全控制相机
      // 不在这里手动设置相机位置
    }
  }
  
  renderer.render(scene, camera)
}

// 窗口大小调整
const onWindowResize = () => {
  if (camera && renderer && container.value) {
    camera.aspect = container.value.clientWidth / container.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  }
}

// 清理资源
const cleanup = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  if (controls) {
    controls.dispose()
  }
  
  if (renderer) {
    renderer.dispose()
  }
  
  window.removeEventListener('resize', onWindowResize)
}

// 调试函数：打印场景信息
const debugScene = () => {
  console.log('=== 场景调试信息 ===')
  console.log('当前模型类型:', currentModelType.value)
  console.log('地球模型:', earth)
  console.log('摩托车模型:', motorcycle)
  console.log('场景中的对象数量:', scene.children.length)
  console.log('相机位置:', camera.position)
  console.log('相机朝向:', camera.getWorldDirection(new THREE.Vector3()))
  
  if (motorcycle) {
    console.log('摩托车位置:', motorcycle.position)
    console.log('摩托车可见性:', motorcycle.visible)
    console.log('摩托车缩放:', motorcycle.scale)
  }
  
  if (earth) {
    console.log('地球位置:', earth.position)
    console.log('地球可见性:', earth.visible)
  }
}

// 监听props变化
watch(() => props.modelType, (newType) => {
  if (newType !== currentModelType.value) {
    currentModelType.value = newType
    switchModel(newType)
  }
})

onMounted(() => {
  initThree()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.earth-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: grab;
}

.earth-container::before {
  content: "鼠标拖拽旋转 | 滚轮缩放 | 右键平移";
  position: absolute;
  top: 10px;
  right: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-family: Arial, sans-serif;
  pointer-events: none;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 15px;
  white-space: nowrap;
}

.earth-container:active {
  cursor: grabbing;
}

.earth-container canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* 模型切换按钮样式 */
.model-switcher {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
  display: flex;
  gap: 10px;
}

.switch-btn {
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.switch-btn:hover {
  background: rgba(0, 128, 255, 0.8);
  border-color: rgba(0, 128, 255, 0.8);
  transform: translateY(-2px);
}

.switch-btn.active {
  background: rgba(0, 128, 255, 1);
  border-color: rgba(0, 128, 255, 1);
  box-shadow: 0 0 20px rgba(0, 128, 255, 0.5);
}

.switch-btn:active {
  transform: translateY(0);
}
</style> 