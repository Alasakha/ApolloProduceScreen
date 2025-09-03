# BeautifulEarth 组件

这是一个完整的Three.js地球模型组件，移植自专业的Three.js地球项目。

## ✨ 功能特性

- 🌍 **真实地球纹理**：包含Albedo、凹凸、海洋、夜景发光等高质量纹理
- ☁️ **动态云层效果**：半透明云层，与地球同步旋转
- 🌅 **大气层渲染**：使用自定义着色器实现真实大气层效果
- 🌃 **夜景城市发光**：夜晚城市灯光效果，只在背光面显示
- ☀️ **太阳光照系统**：可调节的太阳光强度
- 🔄 **地球自转和云层旋转**：云层旋转速度是地球的2倍
- 🎛️ **实时参数调节**：支持太阳强度、海洋金属度、旋转速度等参数调节
- 📱 **响应式设计**：支持窗口大小调整
- 🎮 **交互控制**：鼠标拖拽、缩放、旋转等操作

## 🚀 使用方法

### 1. 基本使用

```vue
<template>
  <div class="earth-wrapper">
    <BeautifulEarth />
  </div>
</template>

<script setup>
import BeautifulEarth from './components/BeautifulEarth.vue'
</script>

<style scoped>
.earth-wrapper {
  width: 100%;
  height: 600px;
}
</style>
```

### 2. 在控制面板中使用

```vue
<template>
  <div class="control-board">
    <div class="earth-section">
      <BeautifulEarth />
    </div>
    <!-- 其他控制面板内容 -->
  </div>
</template>
```

## 🎛️ 可调参数

组件提供了以下可调节参数：

- **太阳强度** (0.0 - 5.0)：控制太阳光照强度
- **海洋金属度** (0.0 - 1.0)：控制海洋的金属质感
- **旋转速度** (0.1 - 20.0)：控制地球和云层的旋转速度
- **大气透明度** (0.0 - 1.0)：控制大气层的透明度
- **大气强度** (0.0 - 20.0)：控制大气层的强度
- **大气倍数** (0.0 - 20.0)：控制大气层的倍数

## 🔧 技术实现

### 核心组件

1. **地球几何体**：使用SphereGeometry创建，精度64x64
2. **地球材质**：MeshStandardMaterial，支持多种贴图
3. **云层系统**：独立的球体几何体，使用alpha贴图
4. **大气层**：自定义着色器实现的大气散射效果
5. **光照系统**：DirectionalLight模拟太阳光

### 着色器

- **顶点着色器**：处理法线和视线向量
- **片段着色器**：实现大气层散射和云层阴影

### 纹理资源

- `Albedo.jpg` - 地球颜色贴图
- `Bump.jpg` - 凹凸贴图
- `Clouds.png` - 云层贴图
- `Ocean.png` - 海洋贴图
- `night_lights_modified.png` - 夜景发光贴图
- `Gaia_EDR3_darkened.png` - 星空背景

## 📁 文件结构

```
components/
├── BeautifulEarth.vue          # 主组件
├── earth-shaders.js           # 着色器代码
└── earth-assets/              # 纹理资源
    ├── Albedo.jpg
    ├── Bump.jpg
    ├── Clouds.png
    ├── Ocean.png
    ├── night_lights_modified.png
    └── Gaia_EDR3_darkened.png
```

## 🎯 性能优化

- 使用适当的几何体精度（64x64）
- 纹理压缩和优化
- 高效的着色器实现
- 合理的动画帧率控制

## 🐛 故障排除

### 常见问题

1. **纹理加载失败**：检查earth-assets文件夹是否存在
2. **组件不显示**：确保容器有明确的宽高
3. **性能问题**：降低几何体精度或关闭抗锯齿

### 调试模式

组件包含详细的错误日志，可以在浏览器控制台查看。

## 📚 相关文档

- [Three.js 官方文档](https://threejs.org/docs/)
- [Vue 3 组合式API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [WebGL 着色器基础](https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html)

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个组件！

## 📄 许可证

本项目采用MIT许可证。 