# DHPlayer 组件使用说明

## 概述

DHPlayer 是一个基于 Vue 3 的视频监控组件，支持实时预览、录像回放、语音对讲、云台控制等功能。该组件专为与 192.168.10.11 摄像头集成而设计。

## 功能特性

- 🎥 **实时预览**: 支持多窗口实时视频流播放
- 📼 **录像回放**: 支持按时间和文件回放录像
- 🎤 **语音对讲**: 与设备进行双向语音通信
- 🎮 **云台控制**: 控制摄像头方向、缩放等
- 🔄 **多码流支持**: 主码流、辅码流切换
- 📱 **响应式设计**: 支持移动端和桌面端

## 安装要求

### 1. 插件安装

确保已安装 64 位 DHPlayer 插件：
- 下载并安装对应的浏览器插件
- 插件支持 Chrome、Firefox、Edge 等主流浏览器

### 2. 项目依赖

```bash
npm install axios
```

## 使用方法

### 1. 基础引入

```vue
<template>
  <DHPlayer
    videoId="camera-001"
    windowType="0"
    :request="ajaxRequest"
    @createSuccess="handleCreateSuccess"
    @realSuccess="handleRealSuccess"
    @realError="handleRealError"
  />
</template>

<script setup>
import DHPlayer from '@/components/DHPlayer/index.vue'
import * as cameraApi from '@/api/dhplayer'

const ajaxRequest = {
  real: cameraApi.fetchRealRtsp,
  talk: cameraApi.fetchTalkRtsp,
  stopTalk: cameraApi.stopTalk,
  setPtzDirection: cameraApi.setPtzDirection,
  setPtzCamera: cameraApi.setPtzCamera
}
</script>
```

### 2. 实时预览

```javascript
// 开始实时预览
const startRealPreview = () => {
  const channels = [{
    channelId: '1000001$1$0$0',
    snum: 0,
    deviceType: 5,
    cameraType: '1',
    capability: '00000000000000000000000000000001',
    streamType: 1
  }]
  
  dhplayerRef.value.startReal(channels)
}
```

### 3. 录像回放

```javascript
// 开始录像回放
const startPlayback = () => {
  const channels = [{
    channelId: '1000001$1$0$0',
    name: '通道1',
    startTime: '2024-01-01 00:00:00',
    endTime: '2024-01-01 23:59:59',
    recordSource: 2,
    streamType: 0,
    snum: 0
  }]
  
  dhplayerRef.value.startPlayback(channels)
}
```

### 4. 云台控制

```javascript
// 云台方向控制
const ptzControl = async (direction) => {
  const params = {
    channelId: '1000001$1$0$0',
    direction: direction,
    speed: 1
  }
  
  await cameraApi.setPtzDirection(params)
}
```

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| videoId | String | - | 唯一标识，必填 |
| windowType | String | '0' | 窗口类型：0-实时预览，3-录像回放 |
| request | Object | - | API 请求配置对象 |
| showPanTilt | Boolean | false | 是否显示云台控制 |

## 事件回调

| 事件名 | 参数 | 说明 |
|--------|------|------|
| createSuccess | - | 组件创建成功 |
| createError | error | 组件创建失败 |
| realSuccess | info | 实时预览成功 |
| realError | info, error | 实时预览失败 |
| talkSuccess | info | 语音对讲成功 |
| talkError | info, error | 语音对讲失败 |
| playbackSuccess | info | 录像回放成功 |
| playbackError | info, error | 录像回放失败 |

## API 方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| startReal | channels[] | 开始实时预览 |
| startPlayback | channels[] | 开始录像回放 |
| startTalk | snum | 开始语音对讲 |
| initPanTilt | containerId | 初始化云台控制 |
| playbackByUrl | params, snum | 通过 URL 播放录像 |
| talkByUrl | params, snum | 通过 URL 进行对讲 |
| realByUrl | params, snum | 通过 URL 实时预览 |

## 摄像头配置

当前组件配置为连接 192.168.10.11 摄像头：

```typescript
const CAMERA_CONFIG = {
  ip: '192.168.10.11',
  port: 9100,
  username: 'admin',
  password: 'admin'
}
```

**注意**: 请根据实际摄像头配置修改以上参数。

## 测试页面

项目已集成摄像头测试页面，可通过以下方式访问：

1. 在 ControlBoard 页面点击"摄像头测试"按钮
2. 测试页面包含完整的摄像头功能测试
3. 支持连接测试、设备信息获取、实时预览、录像回放、云台控制等

## 故障排除

### 常见问题

1. **插件未加载**
   - 检查浏览器插件是否正确安装
   - 确认插件版本与浏览器兼容

2. **连接失败**
   - 检查网络连接
   - 确认摄像头 IP 地址和端口
   - 验证用户名和密码

3. **视频无法播放**
   - 检查 RTSP 流地址是否正确
   - 确认摄像头在线状态
   - 查看浏览器控制台错误信息

### 调试信息

组件会在控制台输出详细的调试信息，包括：
- 连接状态
- API 调用日志
- 错误详情

## 开发说明

### 文件结构

```
src/
├── components/
│   └── DHPlayer/
│       ├── index.vue          # 主组件
│       └── README.md          # 说明文档
├── api/
│   └── dhplayer.ts            # API 接口
└── views/
    └── ControlBoard/
        └── components/
            └── CameraTest.vue  # 测试页面
```

### 扩展开发

如需添加新功能，可以：

1. 在 `DHPlayer/index.vue` 中添加新的方法
2. 在 `api/dhplayer.ts` 中添加对应的 API 接口
3. 在测试页面中添加相应的控制按钮

## 技术支持

如有问题，请检查：
1. 浏览器控制台错误信息
2. 网络连接状态
3. 摄像头设备状态
4. 插件安装状态 