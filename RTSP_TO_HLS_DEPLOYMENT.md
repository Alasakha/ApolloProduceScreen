# RTSP → HLS → 大屏展示 完整部署方案

## 🎯 方案概述

将摄像头的RTSP流转换为HLS格式，在Vue大屏中实时播放监控画面。

## 📋 前置要求

- Linux服务器（Ubuntu 20.04+ 或 CentOS 7+）
- 摄像头支持RTSP协议
- 摄像头网络可达

## 🚀 快速部署

### 1. 安装FFmpeg

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install ffmpeg

# CentOS/RHEL
sudo yum install epel-release
sudo yum install ffmpeg

# 验证安装
ffmpeg -version
```

### 2. 创建HLS转码脚本

创建 `start_camera_streams.sh`：

```bash
#!/bin/bash

# 摄像头配置
CAMERA1_IP="192.168.10.11"
CAMERA1_USER="admin"
CAMERA1_PASS="admin123"
CAMERA1_PORT="554"
CAMERA1_STREAM="stream1"

CAMERA2_IP="192.168.10.12"
CAMERA2_USER="admin"
CAMERA2_PASS="admin123"
CAMERA2_PORT="554"
CAMERA2_STREAM="stream1"

CAMERA3_IP="192.168.10.13"
CAMERA3_USER="admin"
CAMERA3_PASS="admin123"
CAMERA3_PORT="554"
CAMERA3_STREAM="stream1"

# 输出目录
OUTPUT_DIR="/var/www/html/cameras"
mkdir -p $OUTPUT_DIR

# 停止现有进程
pkill -f "ffmpeg.*camera"

# 启动摄像头1
ffmpeg -i "rtsp://${CAMERA1_USER}:${CAMERA1_PASS}@${CAMERA1_IP}:${CAMERA1_PORT}/${CAMERA1_STREAM}" \
  -c:v copy \
  -c:a aac \
  -f hls \
  -hls_time 2 \
  -hls_list_size 3 \
  -hls_flags delete_segments \
  -hls_segment_filename "${OUTPUT_DIR}/camera1_%03d.ts" \
  "${OUTPUT_DIR}/camera1.m3u8" &

# 启动摄像头2
ffmpeg -i "rtsp://${CAMERA2_USER}:${CAMERA2_PASS}@${CAMERA2_IP}:${CAMERA2_PORT}/${CAMERA2_STREAM}" \
  -c:v copy \
  -c:a aac \
  -f hls \
  -hls_time 2 \
  -hls_list_size 3 \
  -hls_flags delete_segments \
  -hls_segment_filename "${OUTPUT_DIR}/camera2_%03d.ts" \
  "${OUTPUT_DIR}/camera2.m3u8" &

# 启动摄像头3
ffmpeg -i "rtsp://${CAMERA3_USER}:${CAMERA3_PASS}@${CAMERA3_IP}:${CAMERA3_PORT}/${CAMERA3_STREAM}" \
  -c:v copy \
  -c:a aac \
  -f hls \
  -hls_time 2 \
  -hls_list_size 3 \
  -hls_flags delete_segments \
  -hls_segment_filename "${OUTPUT_DIR}/camera3_%03d.ts" \
  "${OUTPUT_DIR}/camera3.m3u8" &

echo "所有摄像头流已启动"
echo "HLS文件保存在: $OUTPUT_DIR"
```

### 3. 配置Nginx

创建 `/etc/nginx/sites-available/cameras`：

```nginx
server {
    listen 8080;
    server_name _;
    root /var/www/html;
    
    # 允许跨域访问
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    
    # HLS流配置
    location ~ \.m3u8$ {
        add_header Cache-Control no-cache;
        add_header Access-Control-Allow-Origin *;
    }
    
    location ~ \.ts$ {
        add_header Cache-Control no-cache;
        add_header Access-Control-Allow-Origin *;
    }
    
    # 静态文件
    location / {
        try_files $uri $uri/ =404;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/cameras /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. 启动服务

```bash
# 给脚本执行权限
chmod +x start_camera_streams.sh

# 启动摄像头流
./start_camera_streams.sh

# 检查进程
ps aux | grep ffmpeg

# 检查HLS文件
ls -la /var/www/html/cameras/
```

## 🔧 调优配置

### 低延迟配置

```bash
ffmpeg -i "rtsp://admin:admin123@192.168.10.11:554/stream1" \
  -c:v libx264 \
  -preset ultrafast \
  -tune zerolatency \
  -c:a aac \
  -f hls \
  -hls_time 1 \
  -hls_list_size 2 \
  -hls_flags delete_segments+append_list \
  -hls_segment_filename "camera1_%03d.ts" \
  camera1.m3u8
```

### 高质量配置

```bash
ffmpeg -i "rtsp://admin:admin123@192.168.10.11:554/stream1" \
  -c:v libx264 \
  -preset medium \
  -crf 23 \
  -c:a aac \
  -b:a 128k \
  -f hls \
  -hls_time 4 \
  -hls_list_size 6 \
  -hls_flags delete_segments \
  -hls_segment_filename "camera1_%03d.ts" \
  camera1.m3u8
```

## 📱 前端配置

### 1. 安装依赖

```bash
npm install hls.js
```

### 2. 组件使用

```vue
<VideoMonitor 
  title="生产线监控" 
  cameraName="摄像头01" 
  status="online"
  hlsUrl="http://192.168.10.11:8080/cameras/camera1.m3u8"
/>
```

## 🚨 故障排除

### 常见问题

1. **RTSP连接失败**
   ```bash
   # 测试RTSP连接
   ffplay "rtsp://admin:admin123@192.168.10.11:554/stream1"
   ```

2. **HLS文件无法访问**
   ```bash
   # 检查文件权限
   sudo chown -R www-data:www-data /var/www/html/cameras/
   sudo chmod -R 755 /var/www/html/cameras/
   ```

3. **跨域问题**
   ```bash
   # 检查Nginx配置
   sudo nginx -t
   sudo systemctl status nginx
   ```

### 日志查看

```bash
# FFmpeg日志
tail -f /var/log/syslog | grep ffmpeg

# Nginx日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔄 自动重启服务

创建systemd服务：

```bash
sudo nano /etc/systemd/system/camera-streams.service
```

```ini
[Unit]
Description=Camera RTSP to HLS Streams
After=network.target

[Service]
Type=forking
User=root
WorkingDirectory=/opt/cameras
ExecStart=/opt/cameras/start_camera_streams.sh
ExecStop=/bin/pkill -f "ffmpeg.*camera"
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

启用服务：

```bash
sudo systemctl enable camera-streams
sudo systemctl start camera-streams
sudo systemctl status camera-streams
```

## 📊 监控脚本

创建 `monitor_streams.sh`：

```bash
#!/bin/bash

OUTPUT_DIR="/var/www/html/cameras"
LOG_FILE="/var/log/camera-streams.log"

check_stream() {
    local camera=$1
    local m3u8_file="${OUTPUT_DIR}/${camera}.m3u8"
    
    if [ ! -f "$m3u8_file" ]; then
        echo "$(date): $camera 流文件不存在，重启服务" >> $LOG_FILE
        systemctl restart camera-streams
        return 1
    fi
    
    # 检查文件更新时间
    local file_age=$(($(date +%s) - $(stat -c %Y "$m3u8_file")))
    if [ $file_age -gt 30 ]; then
        echo "$(date): $camera 流文件过期，重启服务" >> $LOG_FILE
        systemctl restart camera-streams
        return 1
    fi
    
    return 0
}

# 检查所有摄像头
check_stream "camera1"
check_stream "camera2"
check_stream "camera3"
```

添加到crontab：

```bash
# 每5分钟检查一次
*/5 * * * * /opt/cameras/monitor_streams.sh
```

## 🎉 完成！

现在你的摄像头RTSP流已经成功转换为HLS格式，可以在Vue大屏中实时播放了！

### 访问地址

- 摄像头1: `http://192.168.10.11:8080/cameras/camera1.m3u8`
- 摄像头2: `http://192.168.10.11:8080/cameras/camera2.m3u8`
- 摄像头3: `http://192.168.10.11:8080/cameras/camera3.m3u8`

### 下一步

1. 测试HLS流是否正常播放
2. 调整FFmpeg参数优化画质和延迟
3. 配置防火墙和安全策略
4. 设置监控和告警 