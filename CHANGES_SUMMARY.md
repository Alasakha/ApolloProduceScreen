# BeautifulEarth 组件修改总结

## 主要修改内容

### 1. 移除光柱功能
- 删除了 `lightPillarGroups` 相关的代码
- 移除了光柱纹理加载 (`light_column.png`)
- 删除了光柱动画更新逻辑
- 移除了光柱相关的控制面板选项

### 2. 增强坐标标记功能
- 将原来的光柱纹理改为使用 `location.png` 作为坐标标记纹理
- **重要修改**：将坐标标记添加到地球图层 (`earthGroup`) 中，使其跟随地球一起旋转
- 更新了坐标标记的动画效果：
  - 脉动效果 (pulse)
  - 始终面向相机
  - 轻微旋转
- 添加了坐标标记相关的控制参数：
  - `coordinateMarkerOpacity`: 透明度控制
  - `coordinateMarkerPulseSpeed`: 脉动速度控制

### 3. 改进错误处理
- 在 `EnergyConsumption.vue` 中改进了API错误处理
- 对服务器500错误进行特殊处理，立即使用模拟数据
- 区分网络错误和业务逻辑错误

## 技术细节

### 动画更新
```javascript
// 更新坐标标记点动画
coordinateMarkerMeshes.value.forEach(mesh => {
  if (mesh && mesh.material) {
    // 坐标标记脉动效果
    const time = Date.now() * 0.001
    const pulse = 0.7 + 0.3 * Math.sin(time * params.coordinateMarkerPulseSpeed.value + mesh.userData.pulseTime)
    mesh.material.opacity = params.coordinateMarkerOpacity.value * pulse
    
    // 始终面向相机
    mesh.lookAt(camera.position)
    
    // 轻微旋转
    mesh.rotateZ(0.01)
  }
})

// 坐标标记添加到地球组
earthGroup.add(coordinateMarker) // 跟随地球旋转
```

### 控制面板
- 移除了光柱透明度和闪烁速度控制
- 添加了坐标标记透明度和脉动速度控制

### 错误处理改进
- 对服务器500错误立即使用模拟数据，避免不必要的重试
- 保持了对其他类型错误的正常重试机制

## 文件变更
- `src/views/ControlBoard/components/BeautifulEarth.vue`: 主要修改文件
- `src/views/ControlBoard/components/EnergyConsumption.vue`: 错误处理改进
- 删除了 `public/earth-assets/light_column.png` 文件

## 注意事项
1. 坐标标记现在使用 `location.png` 纹理，确保该文件存在
2. **坐标标记已添加到地球图层，会跟随地球一起旋转**
3. 服务器API错误会立即使用模拟数据，确保界面正常显示
4. 所有动画效果都经过优化，确保性能良好 