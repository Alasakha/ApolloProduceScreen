# 喷涂直通率功能优化说明

## 🎯 优化目标
- 在编辑问题点时，同时可以编辑合格数量
- 在外部表格中展示问题点和责任人，类似Excel格式
- 提供更好的用户体验和数据管理

## ✨ 新增功能

### 1. 问题点Excel格式展示
在表格中新增"问题点"列，以类似Excel的格式展示：
```
问题点1 (责任人1)
问题点2 (责任人2)
问题点3 (责任人3)
```

### 2. 编辑对话框数量管理
在编辑问题点的对话框中，新增数量编辑区域：
- 送检数量（只读）
- 合格数量（可编辑）
- 不合格数量（自动计算）

### 3. 双重编辑方式
- **方式1**：直接在表格中修改合格数量
- **方式2**：点击"编辑问题"按钮，在对话框中同时编辑数量和问题点

## 🔧 技术实现

### 类型定义优化
```typescript
// 扩展SprayFty类型，添加unqualifiedCount属性
const sprayData = ref<(SprayFty & { unqualifiedCount: number })[]>([])
const currentItem = ref<(SprayFty & { unqualifiedCount: number }) | null>(null)
```

### 新增函数
```typescript
// 编辑时计算不合格数量
const calculateUnqualifiedEdit = () => {
    if (currentItem.value) {
        const inventoryQty = parseInt(currentItem.value.inventory_qty)
        currentItem.value.unqualifiedCount = inventoryQty - currentItem.value.okCount
    }
}
```

### 样式优化
- 数量编辑区域：灰色背景，清晰的分组
- 问题点显示：红色问题点 + 蓝色责任人
- 表格布局：优化列宽，确保内容完整显示

## 📊 界面布局

### 主表格列结构
1. 检验单号
2. 客户单号  
3. 品号
4. 品名
5. 送检数量
6. 合格数量（可编辑）
7. 不合格数量（自动计算）
8. 问题点（Excel格式展示）
9. 操作

### 编辑对话框布局
1. 产品信息头部
2. 数量编辑区域（送检/合格/不合格）
3. 问题点列表（可添加/删除/编辑）
4. 操作按钮

## 🎨 样式特点

### 颜色方案
- 问题点：红色 (#e74c3c)
- 责任人：蓝色 (#3498db)
- 无问题点：灰色 (#95a5a6)
- 数量编辑区域：浅灰背景 (#f8f9fa)

### 交互效果
- 悬停高亮
- 平滑过渡动画
- 清晰的视觉层次

## 🧪 测试要点

### 功能测试
1. ✅ 表格中直接修改合格数量
2. ✅ 问题点Excel格式展示
3. ✅ 编辑对话框中修改数量
4. ✅ 问题点和责任人管理
5. ✅ 数据保存和回写

### 界面测试
1. ✅ 对话框层级正确
2. ✅ 样式美观统一
3. ✅ 响应式布局
4. ✅ 交互流畅自然

## 🚀 使用流程

1. 点击"喷涂直通率"组件
2. 在表格中查看所有检验记录
3. 选择编辑方式：
   - 直接在表格中修改合格数量
   - 点击"编辑问题"进行详细编辑
4. 在编辑对话框中：
   - 修改合格数量
   - 添加/编辑问题点和责任人
5. 保存数据
6. 查看更新后的表格展示

## 💡 优化亮点

- **双重编辑方式**：提供灵活的数据输入方式
- **Excel格式展示**：清晰直观的问题点展示
- **实时计算**：自动计算不合格数量
- **统一管理**：在一个对话框中管理所有相关数据
- **美观界面**：现代化的UI设计和交互体验
- **💾 逐条保存优化**：每条数据编辑完成后立即保存并刷新

## 🔧 保存逻辑优化

### 逐条保存接口
```typescript
// 单条数据保存接口
export const getSprayFtyFillin = (data: SprayFty): Promise<{data: SprayFty}>

// 使用方式
const saveData: SprayFty = {
    po_arrival_inspection_id: item.po_arrival_inspection_id,
    inventory_qty: item.inventory_qty,
    item_description: item.item_description,
    item_code: item.item_code,
    doc_no: item.doc_no,
    udf021: item.udf021,
    okCount: item.okCount,
    firstOkCount: item.firstOkCount,
    issueList: item.issueList
}

await getSprayFtyFillin(saveData)
```

### 优化特点
- **实时保存**：每条数据编辑完成后立即保存
- **即时反馈**：保存成功后立即刷新显示
- **错误处理**：单条数据保存失败不影响其他数据
- **用户体验**：操作简单，无需等待所有数据填完 