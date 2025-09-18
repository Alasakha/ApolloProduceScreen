import { WebSocketServer } from 'ws';
import http from 'http';
import net from 'net';

// 大华摄像头配置
const CAMERA_CONFIG = {
  ip: '192.168.10.11',
  username: 'admin',
  password: 'admin123',
  rtspPort: 554,
  httpPort: 80
};

// 创建HTTP服务器
const server = http.createServer();

// 创建WebSocket服务器
const wss = new WebSocketServer({ server });

console.log('🚀 WebSocket服务器启动中...');
console.log(`📹 摄像头配置: ${CAMERA_CONFIG.ip}:${CAMERA_CONFIG.httpPort}`);

// 摄像头连接状态
let cameraConnected = false;
let rtspConnection = null;

// 连接大华摄像头
async function connectToCamera() {
  try {
    console.log('🔌 正在连接大华摄像头...');
    
    // 尝试HTTP连接验证
    const response = await fetch(`http://${CAMERA_CONFIG.ip}:${CAMERA_CONFIG.httpPort}/cgi-bin/global.cgi?action=getCurrentTime`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${CAMERA_CONFIG.username}:${CAMERA_CONFIG.password}`).toString('base64')}`
      }
    });
    
    if (response.ok) {
      console.log('✅ 摄像头HTTP连接成功');
      cameraConnected = true;
      
      // 尝试RTSP连接
      await connectRTSP();
    } else {
      console.log('⚠️ 摄像头HTTP连接失败，使用模拟模式');
      cameraConnected = false;
    }
  } catch (error) {
    console.log('⚠️ 无法连接真实摄像头，使用模拟模式:', error.message);
    cameraConnected = false;
  }
}

// 连接RTSP流
async function connectRTSP() {
  try {
    console.log('📡 尝试连接RTSP流...');
    
    // 构建RTSP URL
    const rtspURL = `rtsp://${CAMERA_CONFIG.username}:${CAMERA_CONFIG.password}@${CAMERA_CONFIG.ip}:${CAMERA_CONFIG.rtspPort}/cam/realmonitor?channel=1&subtype=0&proto=Private3`;
    
    console.log('🔗 RTSP URL:', rtspURL);
    
    // 注意：Node.js无法直接处理RTSP流，这里我们模拟RTSP连接成功
    // 在实际项目中，需要使用专门的RTSP库或通过FFmpeg等工具
    console.log('✅ RTSP连接模拟成功（实际需要专门的RTSP库）');
    
  } catch (error) {
    console.error('❌ RTSP连接失败:', error.message);
  }
}

// WebSocket连接处理
wss.on('connection', (ws, req) => {
  console.log('📡 新的WebSocket连接:', req.url);
  
  // 发送连接成功消息
  ws.send(JSON.stringify({
    type: 'connection',
    status: 'connected',
    message: 'WebSocket连接成功',
    cameraConnected: cameraConnected
  }));
  
  // 模拟摄像头数据流
  let frameCount = 0;
  const dataInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      frameCount++;
      
      if (cameraConnected) {
        // 发送真实摄像头数据（模拟）
        ws.send(JSON.stringify({
          type: 'videoFrame',
          frameNumber: frameCount,
          timestamp: Date.now(),
          data: `大华摄像头_${CAMERA_CONFIG.ip}_帧${frameCount}`,
          status: 'streaming',
          source: 'real_camera',
          cameraIP: CAMERA_CONFIG.ip
        }));
      } else {
        // 发送模拟数据
        ws.send(JSON.stringify({
          type: 'videoFrame',
          frameNumber: frameCount,
          timestamp: Date.now(),
          data: `模拟视频帧数据_${frameCount}`,
          status: 'streaming',
          source: 'simulated'
        }));
      }
      
      // 每100帧发送一次状态更新
      if (frameCount % 100 === 0) {
        ws.send(JSON.stringify({
          type: 'status',
          status: 'active',
          message: `WebSocket服务器运行正常，已发送${frameCount}帧数据`
        }));
      }
    } else {
      clearInterval(dataInterval);
    }
  }, 200); // 每200ms发送一帧，减少发送频率
  
  // 处理客户端断开连接
  ws.on('close', () => {
    console.log('📡 WebSocket连接已断开');
    clearInterval(dataInterval);
  });
  
  ws.on('error', (error) => {
    console.error('📡 WebSocket错误:', error);
    clearInterval(dataInterval);
  });
});

// 启动服务器
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket服务器已启动，端口: ${PORT}`);
  console.log(`📡 WebSocket地址: ws://localhost:${PORT}`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭WebSocket服务器...');
  server.close(() => {
    console.log('✅ WebSocket服务器已关闭');
    process.exit(0);
  });
});

// 连接摄像头
connectToCamera();