#!/usr/bin/env node

/**
 * H5Player启动脚本
 * 用于快速部署和配置H5Player摄像头监控系统
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 H5Player摄像头监控系统启动脚本');
console.log('=====================================\n');

// 检查系统环境
function checkEnvironment() {
  console.log('📋 检查系统环境...');
  
  try {
    // 检查Node.js版本
    const nodeVersion = process.version;
    console.log(`✅ Node.js版本: ${nodeVersion}`);
    
    // 检查npm版本
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`✅ npm版本: ${npmVersion}`);
    
    // 检查是否安装了nginx
    try {
      const nginxVersion = execSync('nginx -v', { encoding: 'utf8' }).trim();
      console.log(`✅ nginx已安装: ${nginxVersion}`);
    } catch (error) {
      console.log('⚠️  nginx未安装，需要手动安装');
    }
    
  } catch (error) {
    console.error('❌ 环境检查失败:', error.message);
    process.exit(1);
  }
}

// 创建必要的目录结构
function createDirectories() {
  console.log('\n📁 创建目录结构...');
  
  const dirs = [
    'public/h5player',
    'nginx',
    'logs'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ 创建目录: ${dir}`);
    } else {
      console.log(`ℹ️  目录已存在: ${dir}`);
    }
  });
}

// 复制配置文件
function copyConfigFiles() {
  console.log('\n📋 复制配置文件...');
  
  try {
    // 检查H5Player SDK文件
    const sdkPath = 'public/h5player/PlayerControl.js';
    if (!fs.existsSync(sdkPath)) {
      console.log('⚠️  H5Player SDK文件不存在，请确保已正确放置');
    } else {
      console.log('✅ H5Player SDK文件已就绪');
    }
    
    // 检查nginx配置
    const nginxConfigPath = 'nginx/nginx.conf';
    if (!fs.existsSync(nginxConfigPath)) {
      console.log('⚠️  nginx配置文件不存在，请确保已正确放置');
    } else {
      console.log('✅ nginx配置文件已就绪');
    }
    
  } catch (error) {
    console.error('❌ 配置文件检查失败:', error.message);
  }
}

// 生成启动说明
function generateReadme() {
  console.log('\n📖 生成启动说明...');
  
  const readmeContent = `# H5Player摄像头监控系统

## 系统要求

- Node.js 16+
- npm 8+
- nginx 1.18+
- 支持WebSocket的现代浏览器

## 快速启动

### 1. 安装依赖
\`\`\`bash
npm install
\`\`\`

### 2. 启动nginx服务
\`\`\`bash
# Windows
cd nginx
start nginx.exe

# Linux/Mac
cd nginx
./nginx
\`\`\`

### 3. 启动Vue应用
\`\`\`bash
npm run dev
\`\`\`

### 4. 访问应用
打开浏览器访问: http://localhost:5173

## 摄像头配置

### 默认摄像头配置
- 生产线摄像头: 192.168.10.11
- 用户名: admin
- 密码: admin123

### 修改摄像头配置
编辑 \`src/views/ControlBoard/index.vue\` 文件中的摄像头配置数组。

## nginx配置

nginx配置文件位于 \`nginx/nginx.conf\`，主要功能：

1. 静态文件服务
2. PTZ控制代理
3. 设备登录代理
4. WebSocket支持
5. 跨域处理

## 故障排除

### 1. 摄像头连接失败
- 检查摄像头IP地址是否正确
- 确认用户名密码是否正确
- 检查网络连接是否正常

### 2. PTZ控制无响应
- 确认已登录设备
- 检查nginx代理配置
- 查看浏览器控制台错误信息

### 3. 视频无法播放
- 检查WebSocket连接状态
- 确认RTSP地址格式正确
- 查看浏览器控制台错误信息

## 技术支持

如有问题，请查看：
1. 浏览器控制台错误信息
2. nginx错误日志
3. 应用运行日志

## 更新日志

- v1.0.0: 初始版本，支持基本视频播放和PTZ控制
`;

  fs.writeFileSync('H5PLAYER_README.md', readmeContent);
  console.log('✅ 启动说明已生成: H5PLAYER_README.md');
}

// 生成nginx启动脚本
function generateNginxScripts() {
  console.log('\n🔧 生成nginx启动脚本...');
  
  // Windows启动脚本
  const windowsStartScript = `@echo off
echo Starting nginx...
cd /d "%~dp0"
nginx.exe
echo nginx started successfully!
pause
`;
  
  // Windows停止脚本
  const windowsStopScript = `@echo off
echo Stopping nginx...
cd /d "%~dp0"
nginx.exe -s stop
echo nginx stopped successfully!
pause
`;
  
  // Linux/Mac启动脚本
  const unixStartScript = `#!/bin/bash
echo "Starting nginx..."
cd "$(dirname "$0")"
./nginx
echo "nginx started successfully!"
`;
  
  // Linux/Mac停止脚本
  const unixStopScript = `#!/bin/bash
echo "Stopping nginx..."
cd "$(dirname "$0")"
./nginx -s stop
echo "nginx stopped successfully!"
`;
  
  try {
    fs.writeFileSync('nginx/start.bat', windowsStartScript);
    fs.writeFileSync('nginx/stop.bat', windowsStopScript);
    fs.writeFileSync('nginx/start.sh', unixStartScript);
    fs.writeFileSync('nginx/stop.sh', unixStopScript);
    
    // 设置Unix脚本可执行权限
    if (process.platform !== 'win32') {
      execSync('chmod +x nginx/start.sh nginx/stop.sh');
    }
    
    console.log('✅ nginx启动脚本已生成');
  } catch (error) {
    console.error('❌ 生成nginx脚本失败:', error.message);
  }
}

// 检查摄像头连接
function checkCameraConnection() {
  console.log('\n🔍 检查摄像头连接...');
  
  const testCamera = {
    ip: '192.168.10.11',
    username: 'admin',
    password: 'admin123'
  };
  
  console.log(`📹 测试摄像头: ${testCamera.ip}`);
  console.log(`👤 用户名: ${testCamera.username}`);
  console.log(`🔑 密码: ${testCamera.password}`);
  
  // 这里可以添加实际的连接测试逻辑
  console.log('ℹ️  请手动测试摄像头连接，确保网络可达');
}

// 主函数
function main() {
  try {
    checkEnvironment();
    createDirectories();
    copyConfigFiles();
    generateReadme();
    generateNginxScripts();
    checkCameraConnection();
    
    console.log('\n🎉 H5Player系统配置完成！');
    console.log('\n📋 下一步操作:');
    console.log('1. 启动nginx服务');
    console.log('2. 启动Vue应用');
    console.log('3. 在浏览器中访问应用');
    console.log('4. 配置摄像头参数');
    
    console.log('\n📚 详细说明请查看: H5PLAYER_README.md');
    
  } catch (error) {
    console.error('\n❌ 配置失败:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main();

// ES模块导出
export {
  checkEnvironment,
  createDirectories,
  copyConfigFiles,
  generateReadme,
  generateNginxScripts,
  checkCameraConnection
}; 