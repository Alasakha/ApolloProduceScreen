# 设备组代码映射使用指南

## 📋 概述

本系统实现了基于 Excel 表格的设备组代码映射功能，支持通过设备组代码（如 `WG_ALL`, `YJ_ALL` 等）来筛选和查看对应的设备列表。

## 🏷️ 设备组代码映射

根据提供的截图和 Excel 表格，设备组代码映射如下：

| 代码 | 设备组名称 | 设备数量 | 说明 |
|------|------------|----------|------|
| `WG_ALL` | 弯管设备组 | 3台 | 弯管相关设备 |
| `YJ_ALL` | 压机设备组 | 2台 | 液压机设备 |
| `SG_ALL` | 缩管设备组 | 2台 | 缩管工艺设备 |
| `GH_ALL` | 滚花设备组 | 2台 | 滚花加工设备 |
| `CHH_ALL` | 冲弧设备组 | 4台 | 冲弧工艺设备 |
| `TZ_ALL` | 台钻设备组 | 8台 | 台钻设备 |
| `CHC_ALL` | 冲床设备组 | 12台 | 冲压床设备 |

**总计：33台设备**

## 📂 相关文件

### 主要组件文件

1. **`DeviceGroupDialog.vue`** - 设备组详情对话框
   - 包含完整的设备数据和代码映射
   - 提供设备筛选和查看功能

2. **`rightContent.vue`** - 右侧内容组件
   - 调用设备组对话框
   - 提供外部访问接口

3. **`DeviceGroupTest.vue`** - 测试组件
   - 演示设备组代码映射功能
   - 可视化展示各设备组的设备列表

## 🔧 核心功能

### 1. 设备组代码映射

```typescript
const deviceGroupCodeMap = {
  'WG_ALL': '弯管设备组',
  'YJ_ALL': '压机设备组', 
  'SG_ALL': '缩管设备组',
  'GH_ALL': '滚花设备组',
  'CHH_ALL': '冲弧设备组',
  'TZ_ALL': '台钻设备组',
  'CHC_ALL': '冲床设备组'
}
```

### 2. 设备数据结构

每个设备包含以下信息：
```typescript
{
  groupName: string,      // 设备组名称
  groupCode: string,      // 设备组代码 (WG_ALL, YJ_ALL, 等)
  macNo: string,          // 设备型号 (从Excel表格获取)
  manufacturer: string,   // 设备厂商 (从Excel表格获取)
  storage: string,        // 存放部门 (统一为 1001/2001)
  isRunning: boolean,     // 运行状态
  progress: number,       // 运行进度 (0-100)
  planQty: number,        // 计划数量
  num: number            // 完成数量
}
```

### 3. 核心方法

#### `getDevicesByGroupCode(groupCode: string)`
根据设备组代码获取设备列表
```typescript
// 示例：获取弯管设备组的所有设备
const wgDevices = getDevicesByGroupCode('WG_ALL')
```

#### `getGroupNameByCode(groupCode: string)`
根据设备组代码获取设备组名称
```typescript
// 示例：获取设备组名称
const groupName = getGroupNameByCode('WG_ALL') // 返回: "弯管设备组"
```

#### `viewDevicesByGroupCode(groupCode: string)`
在父组件中调用，打开设备组对话框显示指定组的设备
```typescript
// 示例：查看冲床设备组
viewDevicesByGroupCode('CHC_ALL')
```

## 📊 设备详情

### 弯管设备组 (WG_ALL)
- **SB-39X4A-2S** - 和和机械（张家港）有限公司 (2台)
- **SB-38NC** - 张家港市兵丰机械制造有限公司 (1台)

### 压机设备组 (YJ_ALL)
- **Y32-315T** - 佛山市南海街金鑫液压机械有限公司
- **QC12Y-8*2500** - 安徽中德机床股份有限公司

### 缩管设备组 (SG_ALL)
- **SAM-50** - 广东省东莞市晨麒金属制品有限公司
- **LP-3007** - 常州龙鹏机械有限公司

### 滚花设备组 (GH_ALL)
- **LP-2008** - 常州龙鹏机械有限公司
- **ML-CH502** - 张家港农发科技集团机械科技有限公司

### 冲弧设备组 (CHH_ALL)
- **CN-50** - 张家港市亿格创机械有限公司 (2台)
- **ML-425** - 张家港农发科技集团机械科技有限公司
- **MC-315B** - 永康市志敏机电

### 台钻设备组 (TZ_ALL)
- **Z5040A** - 杭州双龙机械有限公司
- **Z4116/2** - 浙江台康金宝塑机厂
- **Z4116** - 浙江台康金宝塑机厂
- **JZB4120** - 安徽省黄山台钻有限公司 (2台)
- **SWJ-16G** - 浙江西菱股份有限公司 (2台)
- **JS-6.3** - 浙江锦压机械厂

### 冲床设备组 (CHC_ALL)
- **JS-16** - 浙江锦压机械厂 (2台)
- **JB23-40T** - 浙江锦压机械厂
- **J21-80** - 上海机床有限公司 (2台)
- **J21-80** - 上海第二锻压机械厂
- **JB23-63** - 浙江锦压机械厂
- **JF21-100T** - 浙江锦压机械厂
- **JS-6.3** - 浙江锦压机械厂
- **JD23-35** - 浙江锦压机械厂
- **ALP-160V** - 金澳兰

## 🧪 测试和验证

### 使用测试组件
1. 导入 `DeviceGroupTest.vue` 组件
2. 点击不同的设备组代码按钮
3. 查看对应的设备列表显示

### 在实际项目中使用
```vue
<template>
  <div>
    <!-- 设备组对话框 -->
    <DeviceGroupDialog 
      v-model:visible="dialogVisible" 
      ref="deviceGroupRef"
    />
    
    <!-- 按钮触发不同设备组 -->
    <el-button @click="viewWGDevices">查看弯管设备</el-button>
    <el-button @click="viewCHCDevices">查看冲床设备</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dialogVisible = ref(false)
const deviceGroupRef = ref()

const viewWGDevices = () => {
  const devices = deviceGroupRef.value.getDevicesByGroupCode('WG_ALL')
  console.log('弯管设备:', devices)
  dialogVisible.value = true
}

const viewCHCDevices = () => {
  const devices = deviceGroupRef.value.getDevicesByGroupCode('CHC_ALL')
  console.log('冲床设备:', devices)
  dialogVisible.value = true
}
</script>
```

## 🎯 使用场景

1. **设备监控大屏** - 按设备组分类显示设备状态
2. **生产报表** - 按设备组统计生产数据
3. **设备管理** - 快速定位和管理特定类型设备
4. **故障诊断** - 按设备组查看设备运行状态

## 📈 数据特点

- ✅ **真实数据** - 基于提供的 Excel 表格
- ✅ **完整信息** - 包含设备型号、厂商、存放部门等
- ✅ **动态状态** - 模拟设备运行状态和进度
- ✅ **代码映射** - 支持通过简短代码快速访问
- ✅ **可扩展** - 易于添加新的设备组和设备

## 🔄 更新日志

- **v1.0** - 初始实现设备组代码映射功能
- **v1.1** - 添加设备筛选和详情查看功能  
- **v1.2** - 完善设备数据结构，添加计划/完成数量
- **v1.3** - 创建测试组件和使用文档

---

通过这套设备组代码映射系统，您可以轻松地管理和查看 33 台设备的详细信息，实现高效的设备监控和管理。🚀