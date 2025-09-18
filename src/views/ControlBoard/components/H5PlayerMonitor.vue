<template>
  <div style="display: inline-flex;align-items: flex-start;justify-content: center; width: 100%; height: 100%;">
    <div style="width: 100%; height: 100%;">
      <!-- <input id="play" type="button" value="play" @click="playerPlay" /> -->
      <br/>
       <canvas ref="canvasElement" class="video-canvas"></canvas>
       <div>
           <video ref="videoElement" class="video-element"></video>
       </div>
    </div>
    <!-- <fieldset class="h5-fieldset-wrap"> -->
      <!-- <legend>云台控制</legend> -->
      <!-- <div class="h5-step-wrap">
        <span>步长(1-8):</span>
        <select style="width: 130px;" v-model="step">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
        </select>
      </div> -->
      <!-- <div class="h5-ptz-wrap" title="云台按钮操作界面">
        <input type="button" class="h5-button" value="左上" @mousedown="onHandlePTZ('LeftUp', false)" @mouseup="onHandlePTZ('LeftUp', true)">
        <input type="button" class="h5-button" value="上" @mousedown="onHandlePTZ('Up', false)" @mouseup="onHandlePTZ('Up', true)">
        <input type="button" class="h5-button" value="右上" @mousedown="onHandlePTZ('RightUp', false)" @mouseup="onHandlePTZ('RightUp', true)">
        <input type="button" class="h5-button" value="左" @mousedown="onHandlePTZ('Left', false)" @mouseup="onHandlePTZ('Left', true)">
        <input type="button" class="h5-button" value="自动" @mousedown="onHandlePTZ('Auto', false)" @mouseup="onHandlePTZ('Auto', true)">
        <input type="button" class="h5-button" value="右" @mousedown="onHandlePTZ('Right', false)" @mouseup="onHandlePTZ('Right', true)">
        <input type="button" class="h5-button" value="左下" @mousedown="onHandlePTZ('LeftDown', false)" @mouseup="onHandlePTZ('LeftDown', true)">
        <input type="button" class="h5-button" value="下"  @mousedown="onHandlePTZ('Down', false)" @mouseup="onHandlePTZ('Down', true)">
        <input type="button" class="h5-button" value="右下" @mousedown="onHandlePTZ('RightDown', false)" @mouseup="onHandlePTZ('RightDown', true)">
      </div> -->
      <!-- <div class="h5-zoomfocus-wrap" title="变倍聚焦操作界面">
        <input type="button" class="h5-button" value="变倍-" @mousedown="onHandlePTZ('ZoomWide', false)" @mouseup="onHandlePTZ('ZoomWide', true)">
        <input type="button" class="h5-button" value="变倍+" @mousedown="onHandlePTZ('ZoomTele', false)" @mouseup="onHandlePTZ('ZoomTele', true)">
        <input type="button" class="h5-button" value="聚焦-" @mousedown="onHandlePTZ('FocusFar', false)" @mouseup="onHandlePTZ('FocusFar', true)">
        <input type="button" class="h5-button" value="聚焦+" @mousedown="onHandlePTZ('FocusNear', false)" @mouseup="onHandlePTZ('FocusNear', true)">
        <input type="button" class="h5-button" value="光圈-" @mousedown="onHandlePTZ('IrisSmall', false)" @mouseup="onHandlePTZ('IrisSmall', true)">
        <input type="button" class="h5-button" value="光圈+" @mousedown="onHandlePTZ('IrisLarge', false)" @mouseup="onHandlePTZ('IrisLarge', true)">
      </div> -->
    <!-- </fieldset> -->
  </div>
</template>

<script setup>

  import { ref,onMounted } from 'vue';

  const props = defineProps({
    ip: {
      type: String,
      default: ''
    }
  });


  const canvasElement = ref();
  const videoElement = ref();

  const step = ref(1);
  const presetNum = ref();
  const channel = ref(0);

  let player;

  function playerStop() {
    player?.close();
  }

  function playerPause() {
    player?.pause();
  }

  function playerContinue() {
    player?.play();
  }

  function playerCapture() {
    player?.capture('test');
  }

  function playerPlay() {
    // 清理之前的播放器
    if (player) {
      try {
        player.close();
      } catch (e) {
        // 忽略清理错误
      }
    }

    var options = {
      wsURL: props.ip ? `ws://${props.ip}/rtspoverwebsocket` : 'ws://192.168.10.11/rtspoverwebsocket',
      rtspURL: props.ip ? `rtsp://${props.ip}/cam/realmonitor?channel=1&subtype=0&proto=Private3` : 'rtsp://172.3.101.2/cam/realmonitor?channel=1&subtype=0&proto=Private3',
      username: 'admin',
      password: 'admin123',
      // 性能优化配置
      bufferSize: 1024 * 1024, // 1MB缓冲区
      maxBufferSize: 5 * 1024 * 1024, // 5MB最大缓冲区
      frameRate: 25, // 限制帧率
      quality: 'medium', // 中等质量
      hardwareAcceleration: true, // 启用硬件加速
      lowLatency: true // 低延迟模式
    };
    
    try {
      player = new window.PlayerControl(options);
      
      // 优化事件处理，减少不必要的日志输出
      player.on('WorkerReady', function(){
        player.connect();  
      });
      
      player.on('DecodeStart', function(rs){
        if (import.meta.env.DEV) {
          console.log('H5Player: 开始解码', rs);
        }
      });
      
      player.on('PlayStart', function(rs){
        if (import.meta.env.DEV) {
          console.log('H5Player: 开始播放', rs);
        }
      });
      
      player.on('Error', function(rs){
        console.warn('H5Player: 播放错误', rs);
      });
      
      player.on('FileOver', function(rs){
        if (import.meta.env.DEV) {
          console.log('H5Player: 录制播放结束', rs);
        }
      });
      
      player.on('MSEResolutionChanged', function(rs){
        if (import.meta.env.DEV) {
          console.log('H5Player: 分辨率改变', rs);
        }
      });
      
      player.on('FrameTypeChange', function(rs){
        if (import.meta.env.DEV) {
          console.log('H5Player: 视频编码模式改变', rs);
        }
      });
      
      player.on('audioChange', function(rs){
        if (import.meta.env.DEV) {
          console.log('H5Player: 音频编码改变', rs);
        }
      });
      
      player.init(canvasElement.value, videoElement.value);
      window.__player = player;
      
    } catch (e) {
      console.error('H5Player: 播放器初始化失败', e);
    }
  }

  function login() {
    const target = '172.3.101.2:80';
    setIP(target);
    RPC.login('admin', 'admin123', false).then((res) => {
        setCookie('DWebClientSessionID', '', -1);
        setCookie('DhWebClientSessionID', '', -1);
        /**
         * RPC.keepAlive 保活
         */
        _setSession(res.session);
        RPC.keepAlive(300, 60000, _getSession(), target, 0);
    }).catch((err) => {
        console.log(err);
    });
  }

  function onHandlePTZ(type, isStop) {
      let arg2 = 0;
      let arg2Arr = ['LeftUp', 'RightUp', 'LeftDown', 'RightDown'];
      let presetArr = ['GotoPreset','SetPreset', 'ClearPreset'];
      if(arg2Arr.indexOf(type) > -1) {
          arg2 = step.value;
      }
      if(!isStop) {
          if(presetArr.indexOf(type) > -1) {
              /**
               * RPC.PTZManager 云台相关
               * @param {string} 方法
               * @param {number} channel 通道
               * @param {object} 参数集合
               */
              RPC.PTZManager('start', channel.value, { 'code': type, 'arg1': presetNum.value, 'arg2': 0, 'arg3': 0 });
          } else {
              RPC.PTZManager('start', channel.value, { 'code': type, 'arg1': step.value, 'arg2': arg2, 'arg3': 0 });
          }
      } else {
          RPC.PTZManager('stop', channel.value, { 'code': type, 'arg1': step.value, 'arg2': arg2, 'arg3': 0 });
      }
    };

onMounted(() => {
  setTimeout(() => {
    playerPlay();
  }, 5000);
}
);
</script>

<style scoped>
/* 视频渲染优化 */
.video-canvas,
.video-element {
  background-color: #000;
  width: 100%;
  height: 300px;
  /* 硬件加速优化 */
  transform: translateZ(0);
  will-change: transform;
  /* 减少重绘 */
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  /* 优化渲染 */
  image-rendering: optimizeSpeed;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: optimize-contrast;
  /* 禁用用户选择 */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  /* 平滑缩放 */
  object-fit: cover;
}

/* 容器优化 */
.video-container {
  position: relative;
  overflow: hidden;
  /* 启用硬件加速 */
  transform: translateZ(0);
  will-change: transform;
}

 #app {
   font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

/* 按钮样式 */
input[type="button"], button {
  padding: 8px 16px;
  margin: 4px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 80px;
  display: inline-block;
}

input[type="button"]:hover, button:hover {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

input[type="button"]:active, button:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}

/* 不同按钮的颜色区分 */
#play {
  background: #2196F3;
}

#play:hover {
  background: #1976D2;
}

#pause {
  background: #FF9800;
}

#pause:hover {
  background: #F57C00;
}

#continue {
  background: #4CAF50;
}

#continue:hover {
  background: #45a049;
}

#stop {
  background: #f44336;
}

#stop:hover {
  background: #d32f2f;
}

#capture {
  background: #9C27B0;
}

#capture:hover {
  background: #7B1FA2;
}

/* 登入按钮特殊样式 */
button[onclick="login"] {
  background: #607D8B;
}

button[onclick="login"]:hover {
  background: #455A64;
}

/* 按钮容器样式 */
.h5-fieldset-wrap {
  margin-left: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

/* 确保按钮在容器中正确显示 */
div {
  margin-bottom: 10px;
}
</style>
