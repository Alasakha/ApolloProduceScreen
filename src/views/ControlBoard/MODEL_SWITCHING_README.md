# 模型切换功能说明

## 功能概述

这个组件现在支持在两种3D模型之间切换：
- 🌍 **地球模型**：显示带有贸易路线、城市标记和星空背景的3D地球
- 🏍️ **摩托车模型**：显示从STL文件加载的3D摩托车模型

## 使用方法

### 1. 在父组件中使用

```vue
<template>
  <div>
    <!-- 传递modelType prop来控制显示的模型 -->
    <EarthModel :modelType="currentModelType" />
    
    <!-- 添加切换按钮 -->
    <div class="model-control">
      <button @click="currentModelType = 'earth'">🌍 地球模型</button>
      <button @click="currentModelType = 'motorcycle'">🏍️ 摩托车模型</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import EarthModel from './components/EarthModel.vue'

const currentModelType = ref('earth')
</script>
```

### 2. Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelType | String | 'earth' | 模型类型：'earth' 或 'motorcycle' |

### 3. 模型特性

#### 地球模型 (earth)
- 3D地球球体，使用真实地球贴图
- 贸易路线飞线动画
- 城市标记点
- 星空背景
- 鼠标拖拽控制旋转
- 自动轻微自转

#### 摩托车模型 (motorcycle)
- 从 `/FROG_x_t.stl` 文件加载
- 如果STL文件加载失败，会显示占位符模型
- 轻微摆动动画
- 相机围绕模型摆动
- 支持阴影渲染

## 文件要求

### STL文件
- 将 `FROG_x_t.stl` 文件放在 `public/` 目录下
- 文件路径：`/FROG_x_t.stl`

### 依赖
- Three.js
- STL加载器：`three/examples/jsm/loaders/STLLoader.js`

## 样式定制

### 切换按钮样式
组件包含内置的切换按钮样式，支持：
- 悬停效果
- 激活状态
- 响应式设计
- 毛玻璃效果

### 自定义样式
可以通过CSS变量或覆盖样式来自定义外观：

```css
.switch-btn {
  /* 自定义按钮样式 */
}

.model-switcher {
  /* 自定义容器样式 */
}
```

## 注意事项

1. **性能考虑**：STL文件较大时可能影响加载性能
2. **兼容性**：确保浏览器支持WebGL
3. **文件格式**：目前只支持STL格式，如需其他格式请修改加载器
4. **错误处理**：STL加载失败时会自动显示占位符模型

## 扩展功能

### 添加新模型类型
1. 在 `switchModel` 函数中添加新的case
2. 创建对应的模型创建函数
3. 在动画循环中添加新模型的动画逻辑

### 自定义动画
可以在 `animate` 函数中为每种模型类型添加独特的动画效果。

## 故障排除

### 常见问题

1. **STL文件不显示**
   - 检查文件路径是否正确
   - 确认文件格式是否为STL
   - 查看浏览器控制台错误信息

2. **模型切换不生效**
   - 检查 `modelType` prop 是否正确传递
   - 确认 `currentModelType` 响应式变量是否正确定义

3. **性能问题**
   - 考虑压缩STL文件
   - 减少模型复杂度
   - 优化材质和纹理 