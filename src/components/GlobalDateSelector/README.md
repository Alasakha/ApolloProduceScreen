# 全局日期控制系统

这个系统允许您在整个应用中统一控制日期配置，包括天数和结束日期的选择。

## 功能特性

- 🌍 **全局控制**: 在主页标题右边设置一次，整个应用生效
- 📅 **灵活配置**: 支持1天到90天的预设选项
- 🎯 **智能日期**: 自动计算月份和年度的起始日期
- 📡 **事件驱动**: 通过事件系统通知所有相关组件
- 🔄 **实时同步**: 所有组件自动同步最新的日期配置

## 组件结构

```
src/components/GlobalDateSelector/
├── index.vue              # 完整版日期选择器（用于详情页面）
├── CompactDateSelector.vue # 紧凑版日期选择器（用于主页标题）
├── UsageExample.vue       # 使用示例组件
└── README.md              # 本文档
```

## 使用方法

### 1. 在主页添加全局控制

```vue
<template>
  <div class="title">
    <h1>阿波罗管理看板</h1>
    <h2>请选择看板</h2>
    <!-- 全局日期选择器 -->
    <div class="global-date-control">
      <CompactDateSelector />
    </div>
  </div>
</template>

<script setup>
import CompactDateSelector from '../components/GlobalDateSelector/CompactDateSelector.vue';
</script>
```

### 2. 在其他组件中监听变化

```vue
<script setup>
import { useGlobalDateListener } from '@/utils/globalDateEvents';

// 监听天数变化
useGlobalDateListener(
  (days) => {
    console.log('天数变化:', days);
    // 重新获取数据或更新UI
  },
  (endDate) => {
    console.log('结束日期变化:', endDate);
    // 重新获取数据或更新UI
  }
);
</script>
```

### 3. 获取当前配置

```vue
<script setup>
import { getCurrentGlobalDateConfig } from '@/utils/globalDateEvents';

const currentConfig = getCurrentGlobalDateConfig();
console.log('当前天数:', currentConfig.days);
console.log('当前结束日期:', currentConfig.endDate);
</script>
```

## Store 接口

### 状态字段

```typescript
interface ManufacturingPerformanceState {
  // ... 其他字段
  globalDays: number;           // 全局天数选择（默认7天）
  selectedEndDate: string;      // 手动选择的结束日期（默认今天）
}
```

### 方法

```typescript
// 获取配置
getGlobalDays(): number                    // 获取当前选择的全局天数
getSelectedEndDate(): string               // 获取当前选择的结束日期
getPresetDays(): number[]                 // 获取预设天数选项 [1,3,7,15,30,60,90]

// 设置配置
setGlobalDays(days: number): void         // 设置全局天数
setEndDate(date: string): void            // 设置结束日期
resetEndDateToToday(): void               // 重置结束日期为今天
```

## 事件系统

### 监听事件

```typescript
// 天数变化事件
window.addEventListener('globalDaysChanged', (event) => {
  const { days } = event.detail;
  // 处理天数变化
});

// 结束日期变化事件
window.addEventListener('globalEndDateChanged', (event) => {
  const { date } = event.detail;
  // 处理结束日期变化
});
```

### 触发事件

```typescript
import { triggerGlobalDaysChange, triggerGlobalEndDateChange } from '@/utils/globalDateEvents';

// 手动触发事件（用于测试或特殊情况）
triggerGlobalDaysChange(15);
triggerGlobalEndDateChange('2024-01-20');
```

## 日期逻辑

### 月份选择
- **起始日期**: 当前年份的当前月份1号
- **结束日期**: 用户选择的结束日期（或今天）

### 年度选择
- **起始日期**: 当前年份的1月1号
- **结束日期**: 用户选择的结束日期（或今天）

### 示例
如果用户选择结束日期为 `2024-01-20`：
- 月度范围: `2024-01-01` 到 `2024-01-20`
- 年度范围: `2024-01-01` 到 `2024-01-20`

## 样式定制

### 紧凑版样式
```css
.compact-date-selector {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### 完整版样式
```css
.global-date-selector {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

## 最佳实践

1. **统一入口**: 只在主页设置全局日期配置
2. **事件监听**: 使用提供的事件监听工具，避免直接操作DOM
3. **响应式更新**: 在日期变化时自动更新相关数据和UI
4. **错误处理**: 在API调用失败时提供友好的错误提示
5. **性能优化**: 避免在每次日期变化时重复请求相同的数据

## 注意事项

- 确保所有使用日期的组件都正确监听了全局事件
- 日期格式统一使用 `YYYY-MM-DD` 格式
- 时区处理：系统使用本地时区
- 默认值：天数默认为7天，结束日期默认为今天

## 故障排除

### 常见问题

1. **日期不更新**: 检查是否正确监听了全局事件
2. **API调用失败**: 检查网络连接和API参数
3. **样式异常**: 检查Element Plus是否正确引入
4. **事件不触发**: 检查事件名称和参数是否正确

### 调试技巧

```typescript
// 在控制台查看当前配置
const store = useManufacturingPerformanceStore();
console.log('Store状态:', store.state);

// 手动触发事件进行测试
window.dispatchEvent(new CustomEvent('globalDaysChanged', { detail: { days: 15 } }));
``` 