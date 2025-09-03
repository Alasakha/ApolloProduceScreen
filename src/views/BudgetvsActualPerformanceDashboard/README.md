# 预算vs实际绩效仪表板 - 折线图组件

## 概述

这个仪表板包含三个主要的Line组件，每个组件都展示不同维度的财务数据，并配有相应的折线图可视化。

## 组件结构

### Line1 - 数量维度
- **左侧**: 数据表格，显示数量相关的指标
- **右侧**: 折线图，展示12个月的数量趋势
- **指标**: 
  - 年度挑战预算（数量）/台
  - 年度合理预算（数量）/台
  - 月度预测（数量）/台
  - 实际数量/台

### Line2 - 收入维度
- **左侧**: 数据表格，显示收入相关的指标
- **右侧**: 折线图，展示12个月的收入趋势
- **指标**:
  - 年度挑战预算（收入）/万
  - 年度合理预算（收入）/万
  - 月度预测（收入）/万
  - 实际收入/万

### Line3 - 利润维度
- **左侧**: 数据表格，显示利润相关的指标
- **右侧**: 折线图，展示12个月的利润趋势
- **指标**:
  - 年度挑战值预算（利润）/万
  - 年度合理值预算（利润）/万
  - 月度预测（利润）/万
  - 实际利润/万

## 技术特性

### 数据流
1. 每个Line组件的左侧表格组件从API获取数据
2. 通过`defineExpose`暴露数据和方法给父组件
3. 父组件在挂载后调用子组件的方法获取数据
4. 数据通过props传递给右侧的折线图组件

### 折线图特性
- **响应式设计**: 支持不同屏幕分辨率
- **数据缩放**: 内置缩放功能，支持鼠标滚轮和滑块缩放
- **交互式提示**: 悬停显示详细数据
- **平滑曲线**: 使用贝塞尔曲线实现平滑的线条效果
- **渐变填充**: 每条线都有半透明的渐变填充区域
- **自定义样式**: 每条线使用不同的颜色和符号

### 颜色方案
- 年度挑战预算/值: `#00eeff` (青色)
- 年度合理预算/值: `#00ff9f` (绿色)
- 月度预测: `#ff6b6b` (红色)
- 实际值: `#feca57` (黄色)

## 使用方法

### 基本使用
```vue
<template>
  <div class="flex">
    <LeftContent class="flex-2" ref="leftContentRef"/>
    <RightContent class="flex-1" :tableData="tableData"/>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import LeftContent from './leftcontent.vue';
import RightContent from './rightcontent.vue';

const leftContentRef = ref();
const tableData = ref({
  months: {},
  total: {},
  stage: {}
});

const getData = async () => {
  if (leftContentRef.value) {
    await leftContentRef.value.getFinanceData();
    tableData.value = leftContentRef.value.tableData;
  }
};

onMounted(async () => {
  await nextTick();
  await getData();
});
</script>
```

### 数据格式
每个组件期望的数据格式：
```typescript
interface TableData {
  months: Record<string, MonthData>;
  total: SummaryData;
  stage: SummaryData;
}

interface MonthData {
  budgetQuantity?: number;      // 预算数量
  actualQuantity?: number;      // 实际数量
  monthlyForecast?: number;     // 月度预测
  bgTotal?: number;             // 实际总数
  budgetIncome?: number;        // 预算收入
  reasonableIncome?: number;    // 合理收入
  income?: number;              // 实际收入
  challengeProfit?: number;     // 挑战利润
  reasonableProfit?: number;    // 合理利润
  actualProfit?: number;        // 实际利润
}
```

## 响应式设计

### 断点设置
- **sm**: 640px - 小屏幕
- **md**: 768px - 中等屏幕
- **lg**: 1024px - 大屏幕
- **xl**: 1280px - 超大屏幕
- **2xl**: 1536px - 2倍超大屏幕
- **3xl**: 1850px - 1080p分辨率
- **4xl**: 2500px - 2K分辨率

### 字体大小调整
每个断点都有相应的字体大小和行高优化，确保在不同分辨率下都有良好的可读性。

## 性能优化

- 使用`computed`属性计算图表数据，避免不必要的重复计算
- 使用`watch`监听数据变化，自动更新图表
- 支持数据缩放，可以查看特定时间段的数据
- 使用Vue 3的Composition API，提供更好的性能和类型支持

## 注意事项

1. 确保API接口返回正确的数据格式
2. 数据为空时图表会显示为0，避免显示错误
3. 所有金额数据都会自动转换为"万"为单位
4. 图表组件会自动响应数据变化，无需手动刷新
5. 支持触摸设备的手势操作（缩放、滑动等） 