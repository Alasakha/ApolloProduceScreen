# API 500错误排查指南

## 问题描述
Swagger测试成功，但实际调用返回500错误（服务器内部错误）

## 可能的原因分析

### 1. 前端代码问题
- ✅ **已修复**: API接口定义缺少返回类型
- ✅ **已修复**: 函数体语法错误

### 2. 数据格式问题
- 数据类型不匹配（number vs string）
- 数据长度超出限制
- 必填字段缺失

### 3. 后端问题
- 数据库连接失败
- 业务逻辑异常
- 权限验证失败
- 服务器资源不足

### 4. 网络/配置问题
- CORS跨域问题
- 请求头配置错误
- 代理配置问题

## 排查步骤

### 第一步：检查前端代码
```bash
# 1. 检查API接口定义
grep -n "automaticWeldingFillin" src/api/getStampWeldinfo.ts

# 2. 检查组件调用
grep -n "automaticWeldingFillin" src/views/Welding/management/Line3/*.vue
```

### 第二步：浏览器控制台调试
1. 打开浏览器开发者工具
2. 在控制台中运行调试脚本：
```javascript
// 复制 src/views/Welding/management/Line3/debug-api.js 内容到控制台
// 然后运行：
testAPIWithFetch()
```

### 第三步：检查网络请求
1. 打开Network标签页
2. 点击"填写产能"按钮
3. 查看请求详情：
   - Request Headers
   - Request Payload
   - Response Headers
   - Response Body

### 第四步：对比Swagger测试
1. 记录Swagger成功的请求信息
2. 对比实际请求的差异
3. 特别注意：
   - Content-Type
   - 请求体格式
   - 数据字段类型

## 常见解决方案

### 1. 数据格式修复
```typescript
// 确保数据类型正确
const data: AutomaticWeldingFillin = {
  code: 'HJ1', // string
  hourList: hourData.value.map(item => ({
    hour: Number(item.hour),     // 确保是number
    cj: Number(item.cj),         // 确保是number
    hch: Number(item.hch),       // 确保是number
    wj: Number(item.wj)          // 确保是number
  }))
}
```

### 2. 请求头修复
```typescript
// 在API调用中添加必要的请求头
export const automaticWeldingFillin = (data: AutomaticWeldingFillin): Promise<any> => {
  return request({
    url: '/stampingWelding/automaticWeldingFillin',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    },
    data: data
  })
}
```

### 3. 错误处理增强
```typescript
const submitCapacity = async () => {
  submitting.value = true
  try {
    const data: AutomaticWeldingFillin = {
      code: 'HJ1',
      hourList: hourData.value
    }
    
    console.log('发送数据:', data)
    console.log('数据类型:', {
      code: typeof data.code,
      hourList: Array.isArray(data.hourList),
      firstHour: data.hourList[0]
    })
    
    const result = await automaticWeldingFillin(data)
    console.log('API响应:', result)
    
    ElMessage.success('产能数据提交成功')
    fillinDialogVisible.value = false
    await loadCapacityData()
  } catch (error) {
    console.error('提交产能数据失败:', error)
    
    // 详细错误信息
    if (error.response) {
      console.error('响应状态:', error.response.status)
      console.error('响应数据:', error.response.data)
      console.error('响应头:', error.response.headers)
    }
    
    ElMessage.error(`提交失败: ${error.message || '请重试'}`)
  } finally {
    submitting.value = false
  }
}
```

## 调试工具

### 1. 浏览器调试脚本
使用 `src/views/Welding/management/Line3/debug-api.js` 进行API测试

### 2. 网络请求分析
- 使用浏览器Network面板
- 使用Postman等API测试工具
- 使用curl命令行工具

### 3. 日志分析
- 前端console.log
- 后端服务器日志
- 浏览器控制台错误

## 预防措施

### 1. 数据验证
```typescript
// 在提交前验证数据
const validateData = (data: AutomaticWeldingFillin): boolean => {
  if (!data.code || !Array.isArray(data.hourList)) {
    return false
  }
  
  return data.hourList.every(item => 
    typeof item.hour === 'number' &&
    typeof item.cj === 'number' &&
    typeof item.hch === 'number' &&
    typeof item.wj === 'number' &&
    item.hour >= 1 && item.hour <= 24
  )
}
```

### 2. 类型检查
```typescript
// 使用TypeScript严格模式
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 3. 错误边界
```typescript
// 在组件中添加错误边界
onErrorCaptured((error, instance, info) => {
  console.error('组件错误:', error)
  console.error('错误信息:', info)
  return false // 阻止错误继续传播
})
```

## 联系支持

如果问题仍然存在，请提供以下信息：
1. 完整的错误日志
2. 请求和响应详情
3. 浏览器控制台输出
4. 网络请求截图
5. 后端服务器日志

## 相关文件
- `src/api/getStampWeldinfo.ts` - API接口定义
- `src/views/Welding/management/Line3/oneProdLine.vue` - 自动焊1线组件
- `src/views/Welding/management/Line3/twoProdLine.vue` - 自动焊2线组件
- `src/views/Welding/management/Line3/debug-api.js` - 调试脚本
- `src/utils/request.ts` - 请求工具 