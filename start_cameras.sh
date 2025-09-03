#!/bin/bash

echo "启动摄像头RTSP转HLS流..."

# 停止现有进程
pkill -f "ffmpeg.*camera"

# 创建输出目录
mkdir -p /var/www/html

# 启动摄像头1
ffmpeg -i "rtsp://admin:admin123@192.168.10.11:554/stream1" \
  -c:v copy -c:a aac -f hls \
  -hls_time 2 -hls_list_size 3 \
  -hls_flags delete_segments \
  /var/www/html/camera1.m3u8 &

echo "摄像头1已启动: camera1.m3u8"

# 启动摄像头2
ffmpeg -i "rtsp://admin:admin123@192.168.10.12:554/stream1" \
  -c:v copy -c:a aac -f hls \
  -hls_time 2 -hls_list_size 3 \
  -hls_flags delete_segments \
  /var/www/html/camera2.m3u8 &

echo "摄像头2已启动: camera2.m3u8"

# 启动摄像头3
ffmpeg -i "rtsp://admin:admin123@192.168.10.13:554/stream1" \
  -c:v copy -c:a aac -f hls \
  -hls_time 2 -hls_list_size 3 \
  -hls_flags delete_segments \
  /var/www/html/camera3.m3u8 &

echo "摄像头3已启动: camera3.m3u8"

echo "所有摄像头流已启动完成！"
echo "HLS文件保存在: /var/www/html/"
echo "访问地址: http://服务器IP:8080/camera1.m3u8" 