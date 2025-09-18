// Three.js 统一管理，避免多实例导入警告
import * as THREE from 'three'

// 检查是否已经存在Three.js实例
if (window.THREE && window.THREE !== THREE) {
  console.warn('Three.js: 检测到多个Three.js实例，使用统一实例')
}

// 设置全局Three.js实例
window.THREE = THREE

// 导出常用组件
export { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
export { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
export { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
export { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
export { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
export { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
export { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'

// 导出Three.js主对象
export default THREE