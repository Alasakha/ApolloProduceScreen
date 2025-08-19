# ECharts饼图组件使用说明

## 概述

这是一个基于ECharts的Vue 3 + TypeScript饼图组件封装，提供了完整的类型支持和丰富的配置选项。

## 文件结构

```
src/
├── components/
│   ├── EChartsPieChart.vue          # 主组件
│   └── EChartsPieChartExample.vue   # 使用示例
├── utils/
│   └── echartsConfig.ts             # 配置工具和类型定义
└── views/
    └── Welding/management/Line3/
        └── qualityQues.vue          # 实际使用示例
```

## 安装依赖

确保已安装ECharts：

```bash
npm install echarts
# 或
yarn add echarts
```

## 基本使用

### 1. 导入组件

```vue
<template>
  <EChartsPieChart
    :data="chartData"
    :config="chartConfig"
    @click="handleChartClick"
  />
</template>

<script setup lang="ts">
import EChartsPieChart from '@/components/EChartsPieChart.vue'
import type { PieChartItem } from '@/utils/echartsConfig'

// 数据
const chartData = ref<PieChartItem[]>([
  { name: '焊接缺陷', value: 25, color: '#4A90E2' },
  { name: '尺寸偏差', value: 32, color: '#7B68EE' },
  { name: '表面缺陷', value: 24, color: '#9370DB' },
  { name: '材料问题', value: 19, color: '#8A2BE2' }
])

// 配置
const chartConfig = {
  title: '质量TOP问题分布',
  radius: '70%',
  showLabel: true,
  showValue: true,
  showPointer: true,
  theme: 'light'
}

// 点击事件
const handleChartClick = (params: any) => {
  console.log('点击了:', params.name, '值:', params.value)
}
</script>
```

### 2. 数据格式

```typescript
interface PieChartItem {
  name: string      // 显示名称
  value: number     // 数值
  color?: string    // 可选的颜色（不指定则使用默认颜色）
}
```

### 3. 配置选项

```typescript
interface PieChartConfig {
  title?: string                    // 图表标题
  radius?: string | number         // 饼图半径
  center?: [string, string]        // 饼图中心位置
  showLabel?: boolean              // 是否显示标签
  showValue?: boolean              // 是否显示数值
  showPointer?: boolean            // 是否显示指示线
  theme?: 'light' | 'dark'        // 主题
  colors?: string[]                // 自定义颜色数组
}
```

## 高级功能

### 1. 环形图

```typescript
const donutConfig = {
  radius: ['40%', '70%'],  // 内半径和外半径
  // ... 其他配置
}
```

### 2. 带中心文字

```typescript
import { createCenterTextPieChartOption } from '@/utils/echartsConfig'

const option = createCenterTextPieChartOption(data, '中心文字', config)
```

### 3. 响应式配置

```typescript
import { getResponsiveConfig } from '@/utils/echartsConfig'

const responsiveConfig = getResponsiveConfig('dark')
```

## 事件处理

### 点击事件

```vue
<EChartsPieChart
  @click="handleClick"
  @legendselectchanged="handleLegendChange"
/>
```

```typescript
const handleClick = (params: any) => {
  // params 包含点击的数据项信息
  console.log('名称:', params.name)
  console.log('数值:', params.value)
  console.log('百分比:', params.percent)
}
```

## 样式定制

### 1. 自定义颜色

```typescript
const customColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']

const config = {
  colors: customColors,
  // ... 其他配置
}
```

### 2. 主题切换

```typescript
const config = computed(() => ({
  theme: isDark.value ? 'dark' : 'light',
  // ... 其他配置
}))
```

## 性能优化

### 1. 数据更新

```typescript
// 使用 nextTick 确保DOM更新后再更新图表
watch(() => chartData.value, () => {
  nextTick(() => {
    // 图表会自动更新
  })
}, { deep: true })
```

### 2. 窗口大小变化

组件自动监听窗口大小变化并调整图表尺寸，无需手动处理。

## 常见问题

### 1. 图表不显示

- 检查容器是否有高度
- 确保数据不为空
- 检查ECharts是否正确安装

### 2. 标签重叠

- 调整 `radius` 参数
- 使用 `labelLine` 配置指示线
- 考虑使用环形图

### 3. 颜色不生效

- 确保颜色值格式正确（十六进制）
- 检查 `colors` 数组长度是否足够

## 完整示例

参考 `EChartsPieChartExample.vue` 文件，包含了各种使用场景的完整示例。

## 类型支持

所有组件和工具函数都包含完整的TypeScript类型定义，支持IDE自动补全和类型检查。

## 浏览器兼容性

- 支持所有现代浏览器
- 需要ES6+支持
- 建议使用Chrome 60+、Firefox 55+、Safari 12+ 