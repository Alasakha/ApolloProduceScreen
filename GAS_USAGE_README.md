# 气表数据功能说明

## 概述
在 `src/store/energy.ts` 中新增了气表数据的计算功能，支持从 `getElectricPower` 接口返回的数据中提取气表信息，并自动计算平均每台设备的日气量和月气量。

## 新增字段

### EnergyData 接口扩展
```typescript
export interface EnergyData {
  // ... 原有字段 ...
  doneMonth?: number; // 月产量
  doneDay?: number;   // 日产量
}
```

### Store 状态
```typescript
state: () => ({
  // ... 原有状态 ...
  averageMonGasPower: 0, // 平均每台月气量
  averageDaGasPower: 0,  // 平均每台日气量
})
```

## 新增方法

### 1. 计算气表平均值
- `calculateDailyGasAverage()` - 从当日数据中计算平均每台日气量
- `calculateMonthlyGasAverage()` - 从当月数据中计算平均每台月气量

### 2. 计算逻辑
```typescript
// 平均每台日气量 = 日气量 ÷ 日产量
this.averageDaGasPower = Number(gasData.numberPower) / gasData.doneDay;

// 平均每台月气量 = 月气量 ÷ 月产量  
this.averageMonGasPower = Number(gasData.numberPower) / gasData.doneMonth;
```

### 3. 数据获取器
- `dailyGasData()` - 获取当日气表数据
- `monthlyGasData()` - 获取当月气表数据
- `getAverageDailyGasPower()` - 获取平均每台日气量
- `getAverageMonthlyGasPower()` - 获取平均每台月气量

## 使用示例

### 在组件中使用
```vue
<script setup>
import { useEnergyStore } from '@/store/energy'

const energyStore = useEnergyStore()

// 获取平均气量数据
const avgDailyGas = energyStore.getAverageDailyGasPower
const avgMonthlyGas = energyStore.getAverageMonthlyGasPower

// 获取气表数据
const dailyGas = energyStore.dailyGasData
const monthlyGas = energyStore.monthlyGasData
</script>
```

### 手动计算气表平均值
```typescript
// 计算当日气表平均值
energyStore.calculateDailyGasAverage()

// 计算当月气表平均值
energyStore.calculateMonthlyGasAverage()
```

## 数据来源

气表数据来源于 `getElectricPower` 接口返回的数据中，通过 `MACHINE_CODES.GAS` 标识的气表设备。接口返回的数据结构包含：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "monthDay": "2025-08-12",
      "number": "1297.89",
      "machCode": "000025061899",
      "machName": "公司用气总表",
      "tipNumber": "0.0",
      "peakNumber": "0.0",
      "flatNumber": "1297.89",
      "valleyNumber": "0.0",
      "numberPower": 39.57,
      "doneMonth": 2594,    // 月产量
      "doneDay": 105        // 日产量
    }
    // ... 其他设备数据
  ]
}
```

## 自动初始化

在 `initializeData()` 方法中，系统会自动：
1. 获取当日和当月数据（包含电表和气表）
2. 从当日数据中计算平均每台设备的日气量
3. 从当月数据中计算平均每台设备的月气量
4. 缓存数据以提高性能

## 注意事项

1. **产量数据验证**: 系统会检查 `doneMonth` 和 `doneDay` 是否有效（大于0）
2. **错误处理**: 如果产量数据无效，对应的平均值会被设置为0
3. **数据依赖**: 气表平均值计算依赖于 `getElectricPower` 接口返回的数据
4. **数据缓存**: 相同日期的数据会被缓存，避免重复请求

## 调试功能

使用 `testGasCalculation()` 方法可以测试气表数据的计算逻辑：
```typescript
energyStore.testGasCalculation()
```

这将输出当前状态和模拟计算过程，帮助调试数据计算问题。 