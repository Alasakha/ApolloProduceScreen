# 文件导出功能使用说明

## 概述

本项目新增了专门处理文件流下载的功能，可以正确处理服务器返回的Excel文件流并触发浏览器下载。

## 文件结构

- `src/utils/download.js` - 文件下载工具函数
- `src/api/mes.ts` - 生产排程导出API接口
- `src/components/ExportButton.vue` - 导出按钮组件

## 使用方法

### 1. 直接使用API接口

```javascript
import { exportProductionScheduling } from '@/api/mes'

// 基础用法
const handleExport = async () => {
  try {
    const success = await exportProductionScheduling()
    if (success) {
      console.log('导出成功')
    }
  } catch (error) {
    console.error('导出失败:', error)
  }
}
```

### 2. 使用导出按钮组件

```vue
<template>
  <ExportButton 
    type="primary" 
    text="导出Excel" 
    filename="生产排程.xlsx"
    @success="handleSuccess"
    @error="handleError"
  />
</template>

<script setup>
import ExportButton from '@/components/ExportButton.vue'

const handleSuccess = () => {
  console.log('导出成功')
}

const handleError = (error) => {
  console.error('导出失败:', error)
}
</script>
```

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| type | String | 'primary' | 按钮类型 (primary/success/warning/danger/info) |
| size | String | 'small' | 按钮大小 (large/default/small) |
| text | String | '导出Excel' | 按钮文本 |
| icon | String | 'Download' | 图标名称 |
| disabled | Boolean | false | 是否禁用 |
| filename | String | '生产排程导出.xlsx' | 下载文件名 |
| confirmText | String | '确认要导出数据吗？' | 确认对话框文本 |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| success | - | 导出成功时触发 |
| error | error | 导出失败时触发，参数为错误信息 |

## 特性

1. **自动处理文件流**: 正确处理服务器返回的blob数据
2. **智能文件名**: 优先使用服务器返回的文件名，否则使用默认名称
3. **错误处理**: 完善的错误处理和用户提示
4. **加载状态**: 导出过程中显示加载状态
5. **确认对话框**: 防止误操作
6. **Token认证**: 自动携带认证信息

## 注意事项

1. 确保服务器接口返回正确的文件流和响应头
2. 文件名编码问题：如果文件名包含中文，服务器需要正确设置Content-Disposition头
3. 大文件下载：设置了较长的超时时间(5分钟)，适合大文件下载
4. 浏览器兼容性：使用了现代浏览器的Blob API

## 扩展其他导出接口

如果需要添加其他导出接口，可以参考以下模式：

```javascript
// 在 src/api/mes.ts 中添加新接口
export const exportOtherData = async (filename = '其他数据导出.xlsx') => {
  return await downloadFile('/other/export', filename)
}

// 在组件中使用
<ExportButton 
  text="导出其他数据" 
  filename="其他数据.xlsx"
  @click="exportOtherData"
/>
``` 