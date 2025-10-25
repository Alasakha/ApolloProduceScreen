# 日生产计划完成情况表格组件使用说明

## 组件结构

```
Title 组件
├── 标题栏
├── 计划表格区域 (可选)
│   └── PlanTable 组件
└── 内容区域 (slot)
```

## 使用方法

### 1. 在父组件中定义数据

```vue
<script setup lang="ts">
import { ref } from 'vue'

// 定义数据接口
interface DashboardData {
  total: number
  completed: number
  efficiency: number
}

interface TableRowData {
  product: string
  model: string
  plan: number
  actual: number
  difference: number
  completionRate: number
  color: 'orange' | 'blue' | 'green'
}

// 右上角数据卡片数据
const dashboardData = ref<DashboardData>({
  total: 6865,
  completed: 3323,
  efficiency: 48
})

// 表格行数据
const tableData = ref<TableRowData[]>([
  {
    product: '车架',
    model: '34-2',
    plan: 100,
    actual: 100,
    difference: 0,
    completionRate: 100,
    color: 'orange'
  },
  {
    product: '后叉',
    model: '战娃',
    plan: 80,
    actual: 60,
    difference: 20,
    completionRate: 80,
    color: 'blue'
  },
  {
    product: '尾架',
    model: 'BE13',
    plan: 60,
    actual: 60,
    difference: 0,
    completionRate: 100,
    color: 'green'
  }
])
</script>
```

### 2. 使用 Title 组件

```vue
<template>
  <Title 
    title="左内容" 
    :show-plan-table="true"
    :dashboard-data="dashboardData"
    :table-data="tableData"
  >
    <!-- 其他内容 -->
    <div class="other-content">
      <!-- 你的内容 -->
    </div>
  </Title>
</template>
```

### 3. 直接使用 PlanTable 组件

```vue
<template>
  <PlanTable 
    :dashboard-data="dashboardData"
    :table-data="tableData"
  />
</template>
```

## 数据说明

### DashboardData (右上角卡片数据)
- `total`: 总数
- `completed`: 完成数
- `efficiency`: 效率百分比

### TableRowData (表格行数据)
- `product`: 产品名称 (父组件传入，组件内部不写死)
- `model`: 车型 (父组件传入)
- `plan`: 计划数量 (父组件传入)
- `actual`: 实际数量 (父组件传入)
- `difference`: 差额 (父组件传入)
- `completionRate`: 完成率 (父组件传入)
- `color`: 行颜色 ('orange' | 'blue' | 'green') (父组件传入)

**注意**: 组件内部只固定显示"人效"列，其他所有数据都必须由父组件传入！

## 特性

1. **产品列和人效列固定**: 产品列显示传入的产品名称，人效列固定显示"人效"
2. **第二行数据完全由父组件传入**: 车型、计划、实际、差额、完成率等所有数据都必须通过父组件传入，组件内部不写死任何数据
3. **自动样式处理**: 未达标数据自动显示红色
4. **响应式设计**: 支持不同屏幕尺寸
5. **类型安全**: 使用 TypeScript 接口确保数据类型正确

## 注意事项

- 确保传入的 `tableData` 数组中的每个对象都包含所有必需的字段
- `color` 字段必须是 'orange'、'blue' 或 'green' 之一
- 当 `actual < plan` 时，实际数量和差额会自动显示为红色
