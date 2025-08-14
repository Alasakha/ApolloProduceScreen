<template>
  <div ref="earthContainer" class="earth-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const earthContainer = ref(null)
let scene, camera, renderer, earthMesh, stars, moon, moonRing
let animationId = null
let clock = 0

// 贸易路线数据
const tradeRoutes = [
  {
    from: { lat: 30.2741, lng: 120.1551, name: '杭州' },
    to: { lat: 40.7128, lng: -74.0060, name: '纽约' },
    color: 0xff6b6b,
    intensity: 0.8
  },
  {
    from: { lat: 30.2741, lng: 120.1551, name: '杭州' },
    to: { lat: 51.5074, lng: -0.1278, name: '伦敦' },
    color: 0x4ecdc4,
    intensity: 0.6
  },
  {
    from: { lat: 30.2741, lng: 120.1551, name: '杭州' },
    to: { lat: 35.6762, lng: 139.6503, name: '东京' },
    color: 0x45b7d1,
    intensity: 0.9
  },
  {
    from: { lat: 30.2741, lng: 120.1551, name: '杭州' },
    to: { lat: -33.8688, lng: 151.2093, name: '悉尼' },
    color: 0x96ceb4,
    intensity: 0.7
  },
  {
    from: { lat: 30.2741, lng: 120.1551, name: '杭州' },
    to: { lat: -23.5505, lng: -46.6333, name: '圣保罗' },
    color: 0xfeca57,
    intensity: 0.5
  }
]

// 经纬度转换函数
const lon2xyz = (R, longitude, latitude) => {
  let lon = (longitude * Math.PI) / 180 // 转弧度值
  const lat = (latitude * Math.PI) / 180 // 转弧度值
  lon = -lon // js坐标系z坐标轴对应经度-90度，而不是90度
  
  // 经纬度坐标转球面坐标计算公式
  const x = R * Math.cos(lat) * Math.cos(lon)
  const y = R * Math.sin(lat)
  const z = R * Math.cos(lat) * Math.sin(lon)
  // 返回球面坐标
  return new THREE.Vector3(x, y, z)
}

// 初始化Three.js场景
const initThree = () => {
  const width = earthContainer.value.clientWidth
  const height = earthContainer.value.clientHeight

  // 创建场景
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x020924, 200, 1000)

  // 创建相机
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.set(0, 50, 100)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true 
  })
  renderer.setSize(width, height)
  renderer.setClearColor(0x000520, 0) // 透明背景
  earthContainer.value.appendChild(renderer.domElement)

  // 创建光照系统
  createLighting()

  // 创建地球
  createEarth()

  // 创建星空背景
  createStarField()

  // 创建月球和环形
  createMoonAndRing()

  // 创建光柱效果
  createLightPillars()

  // 创建贸易飞线
  createTradeLines()

  // 创建城市标记
  createCityMarkers()

  // 添加鼠标控制
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

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
  scene.add(sunLight)
  
  // 点光源
  const pointLight = new THREE.PointLight(0x00ffff, 0.8, 100)
  pointLight.position.set(-10, 10, -10)
  scene.add(pointLight)
}

// 创建地球
const createEarth = () => {
  // 创建程序化地球纹理
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  
  // 绘制海洋背景
  const oceanGradient = ctx.createLinearGradient(0, 0, 0, 512)
  oceanGradient.addColorStop(0, '#001122')
  oceanGradient.addColorStop(0.5, '#0066cc')
  oceanGradient.addColorStop(1, '#001122')
  ctx.fillStyle = oceanGradient
  ctx.fillRect(0, 0, 1024, 512)
  
  // 绘制大陆轮廓
  const continents = [
    { x: 600, y: 160, width: 240, height: 120, color: '#8B4513' },
    { x: 500, y: 140, width: 80, height: 60, color: '#8B4513' },
    { x: 500, y: 200, width: 100, height: 160, color: '#8B4513' },
    { x: 200, y: 140, width: 160, height: 120, color: '#8B4513' },
    { x: 300, y: 240, width: 80, height: 140, color: '#8B4513' },
    { x: 800, y: 300, width: 120, height: 60, color: '#8B4513' }
  ]
  
  continents.forEach(continent => {
    ctx.fillStyle = continent.color
    ctx.fillRect(continent.x, continent.y, continent.width, continent.height)
    
    ctx.fillStyle = '#228B22'
    ctx.fillRect(continent.x + 10, continent.y + 10, continent.width - 20, continent.height - 20)
  })
  
  // 添加极地冰盖
  const iceGradient = ctx.createLinearGradient(0, 0, 0, 512)
  iceGradient.addColorStop(0, '#F0F8FF')
  iceGradient.addColorStop(0.1, '#E6E6FA')
  iceGradient.addColorStop(0.9, '#E6E6FA')
  iceGradient.addColorStop(1, '#F0F8FF')
  ctx.fillStyle = iceGradient
  ctx.fillRect(0, 0, 1024, 40)
  ctx.fillRect(0, 472, 1024, 40)
  
  const earthTexture = new THREE.CanvasTexture(canvas)
  earthTexture.wrapS = THREE.RepeatWrapping
  earthTexture.wrapT = THREE.RepeatWrapping
  earthTexture.repeat.set(1, 1)
  
  const geometry = new THREE.SphereGeometry(50, 128, 128)
  const material = new THREE.MeshPhongMaterial({ 
    map: earthTexture,
    shininess: 100,
    specular: 0x222222
  })
  
  earthMesh = new THREE.Mesh(geometry, material)
  earthMesh.castShadow = true
  earthMesh.receiveShadow = true
  scene.add(earthMesh)
}

// 创建星空背景
const createStarField = () => {
  const starsMaterial = new THREE.PointsMaterial({
    size: 1,
    transparent: true,
    opacity: 1,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  })
  
  const starsGeometry = new THREE.BufferGeometry()
  const positions = []
  const sizes = []
  const colors = []
  
  for (let i = 0; i < 10000; i++) {
    const vertex = new THREE.Vector3()
    vertex.x = Math.random() * 2 - 1
    vertex.y = Math.random() * 2 - 1
    vertex.z = Math.random() * 2 - 1
    positions.push(vertex.x, vertex.y, vertex.z)
    
    const randomSize = Math.random() * 2.5 + 0.5
    sizes.push(randomSize)
    
    const color = new THREE.Color()
    color.setHSL(Math.random() * 0.2 + 0.5, 0.55, Math.random() * 0.25 + 0.55)
    colors.push(color.r, color.g, color.b)
  }
  
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  starsGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
  
  stars = new THREE.Points(starsGeometry, starsMaterial)
  stars.scale.set(500, 500, 500)
  scene.add(stars)
}

// 创建月球和环形
const createMoonAndRing = () => {
  // 创建月球环
  const radius = 65
  const moonRingGeometry = new THREE.RingGeometry(radius - 2, radius + 2, 64)
  const moonRingMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
    opacity: 0.5,
  })
  
  moonRing = new THREE.Mesh(moonRingGeometry, moonRingMaterial)
  moonRing.rotation.x = -Math.PI / 2
  scene.add(moonRing)
  
  // 创建月球
  const moonGeometry = new THREE.SphereGeometry(2, 32, 32)
  const moonMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.2
  })
  
  moon = new THREE.Mesh(moonGeometry, moonMaterial)
  moon.position.set(radius, 0, 0)
  scene.add(moon)
}

// 创建光柱效果
const createLightPillars = () => {
  for (let i = 0; i < 30; i++) {
    const lightPillarGeometry = new THREE.PlaneGeometry(1, 20)
    const lightPillarMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    
    const lightPillar = new THREE.Mesh(lightPillarGeometry, lightPillarMaterial)
    lightPillar.add(lightPillar.clone().rotateY(Math.PI / 2))
    
    // 设置光柱的位置
    const lat = Math.random() * 180 - 90
    const lon = Math.random() * 360 - 180
    const position = lon2xyz(60, lon, lat)
    lightPillar.position.set(position.x, position.y, position.z)
    
    lightPillar.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      position.clone().normalize()
    )
    scene.add(lightPillar)
    
    // 创建波纹扩散效果
    const circlePlane = new THREE.PlaneGeometry(6, 6)
    const circleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    
    const circleMesh = new THREE.Mesh(circlePlane, circleMaterial)
    circleMesh.rotation.x = -Math.PI / 2
    circleMesh.position.set(0, -7, 0)
    
    lightPillar.add(circleMesh)
    
    gsap.to(circleMesh.scale, {
      duration: 1 + Math.random() * 0.5,
      x: 2,
      y: 2,
      z: 2,
      repeat: -1,
      delay: Math.random() * 0.5,
      yoyo: true,
      ease: "power2.inOut",
    })
  }
}

// 创建贸易飞线
const createTradeLines = () => {
  tradeRoutes.forEach(route => {
    const fromPos = lon2xyz(50, route.from.lng, route.from.lat)
    const toPos = lon2xyz(50, route.to.lng, route.to.lat)
    
    // 创建飞线几何体
    const curve = new THREE.CubicBezierCurve3(
      fromPos,
      new THREE.Vector3(
        (fromPos.x + toPos.x) / 2 + (Math.random() - 0.5) * 20,
        (fromPos.y + toPos.y) / 2 + (Math.random() - 0.5) * 20,
        (fromPos.x + toPos.z) / 2 + (Math.random() - 0.5) * 20
      ),
      new THREE.Vector3(
        (fromPos.x + toPos.x) / 2 + (Math.random() - 0.5) * 20,
        (fromPos.y + toPos.y) / 2 + (Math.random() - 0.5) * 20,
        (fromPos.x + toPos.z) / 2 + (Math.random() - 0.5) * 20
      ),
      toPos
    )
    
    const points = curve.getPoints(100)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    
    const material = new THREE.LineBasicMaterial({
      color: route.color,
      transparent: true,
      opacity: 0.8
    })
    
    const line = new THREE.Line(geometry, material)
    scene.add(line)
    
    // 创建飞线光点效果
    createFlyingLight(fromPos, toPos, route.color)
  })
}

// 创建飞线光点效果
const createFlyingLight = (fromPos, toPos, color) => {
  const lightGeometry = new THREE.SphereGeometry(0.5, 16, 16)
  const lightMaterial = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.9
  })
  
  const light = new THREE.Mesh(lightGeometry, lightMaterial)
  light.position.copy(fromPos)
  scene.add(light)
  
  light.userData = {
    fromPos: fromPos.clone(),
    toPos: toPos.clone(),
    progress: 0,
    speed: 0.008 + Math.random() * 0.012
  }
}

// 创建城市标记
const createCityMarkers = () => {
  const cities = [
    { lat: 30.2741, lng: 120.1551, name: '杭州', size: 1.8 },
    { lat: 40.7128, lng: -74.0060, name: '纽约', size: 1.5 },
    { lat: 51.5074, lng: -0.1278, name: '伦敦', size: 1.5 },
    { lat: 35.6762, lng: 139.6503, name: '东京', size: 1.5 },
    { lat: -33.8688, lng: 151.2093, name: '悉尼', size: 1.2 },
    { lat: -23.5505, lng: -46.6333, name: '圣保罗', size: 1.2 }
  ]
  
  cities.forEach(city => {
    const pos = lon2xyz(50.5, city.lng, city.lat)
    
    const geometry = new THREE.SphereGeometry(city.size, 32, 32)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.9
    })
    
    const marker = new THREE.Mesh(geometry, material)
    marker.position.copy(pos)
    scene.add(marker)
    
    // 添加城市光晕
    const glowGeometry = new THREE.SphereGeometry(city.size + 0.5, 32, 32)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.3
    })
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    glow.position.copy(pos)
    scene.add(glow)
  })
}

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  const time = Date.now() * 0.001
  
  // 地球自转
  if (earthMesh) {
    earthMesh.rotation.y += 0.002
  }
  
  // 星空背景动画
  if (stars && stars.geometry.attributes.position) {
    const positions = stars.geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += 0.00003
      positions[i + 1] += 0.00003
      positions[i + 2] += 0.00003
    }
    stars.geometry.attributes.position.needsUpdate = true
  }
  
  // 月球绕地球运动
  if (moon) {
    const radius = 65
    const speed = 0.1
    moon.position.x = Math.cos(clock) * radius
    moon.position.z = Math.sin(clock) * radius
    clock += speed
  }
  
  // 飞线光点动画
  scene.children.forEach(child => {
    if (child.userData && child.userData.progress !== undefined) {
      child.userData.progress += child.userData.speed
      if (child.userData.progress > 1) {
        child.userData.progress = 0
      }
      
      const t = child.userData.progress
      const fromPos = child.userData.fromPos
      const toPos = child.userData.toPos
      
      child.position.x = fromPos.x + (toPos.x - fromPos.x) * t
      child.position.y = fromPos.y + (toPos.y - fromPos.y) * t
      child.position.z = fromPos.z + (toPos.z - fromPos.z) * t
      
      child.material.opacity = 0.6 + Math.sin(time * 10) * 0.3
    }
  })
  
  renderer.render(scene, camera)
}

// 窗口大小调整
const onWindowResize = () => {
  if (camera && renderer && earthContainer.value) {
    const width = earthContainer.value.clientWidth
    const height = earthContainer.value.clientHeight
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
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
  
  window.removeEventListener('resize', onWindowResize)
}

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
}

.earth-container canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style> 