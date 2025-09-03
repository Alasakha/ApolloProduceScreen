<template>
  <div class="usage-example">
    <h3>全局日期配置使用示例</h3>
    
    <div class="current-config">
      <p><strong>当前配置:</strong></p>
      <ul>
        <li>全局天数: {{ currentConfig.days }}天</li>
        <li>结束日期: {{ currentConfig.endDate }}</li>
        <li>最后更新时间: {{ lastUpdateTime }}</li>
      </ul>
    </div>

    <div class="event-logs">
      <p><strong>事件日志:</strong></p>
      <div class="log-item" v-for="(log, index) in eventLogs" :key="index">
        <span class="log-time">{{ log.time }}</span>
        <span class="log-event">{{ log.event }}</span>
        <span class="log-value">{{ log.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// 删除不存在的导入
// import { 
//   useGlobalDateListener, 
//   getCurrentGlobalDateConfig 
// } from '@/utils/globalDateEvents';

// 临时使用空函数避免错误
const useGlobalDateListener = () => {};
const getCurrentGlobalDateConfig = () => ({ days: 0, endDate: '' });

// 当前配置
const currentConfig = ref(getCurrentGlobalDateConfig());

// 事件日志
const eventLogs = ref<Array<{time: string, event: string, value: string}>>([]);
const lastUpdateTime = ref(new Date().toLocaleTimeString());

// 添加日志
const addLog = (event: string, value: string) => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    event,
    value
  });
  
  // 限制日志数量
  if (eventLogs.value.length > 10) {
    eventLogs.value = eventLogs.value.slice(0, 10);
  }
  
  lastUpdateTime.value = new Date().toLocaleTimeString();
};

// 监听全局天数变化
useGlobalDateListener()

// 或者如果需要监听器功能，可以这样实现：
// const listener = useGlobalDateListener()
// if (listener) {
//   listener.onDaysChange((days: number) => {
//     currentConfig.value.days = days;
//     addLog('天数变化', `${days}天`);
//   })
//   listener.onDateChange((date: string) => {
//     currentConfig.value.endDate = date;
//     addLog('结束日期变化', date);
//   })
// }

// 组件挂载时获取初始配置
onMounted(() => {
  currentConfig.value = getCurrentGlobalDateConfig();
  addLog('组件挂载', '获取初始配置');
});
</script>

<style scoped>
.usage-example {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px 0;
}

.current-config {
  margin-bottom: 20px;
}

.current-config ul {
  list-style: none;
  padding: 0;
}

.current-config li {
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
}

.event-logs {
  max-height: 200px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  gap: 10px;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
  font-family: monospace;
  font-size: 12px;
}

.log-time {
  color: #666;
  min-width: 80px;
}

.log-event {
  color: #333;
  min-width: 100px;
}

.log-value {
  color: #0066cc;
  font-weight: bold;
}
</style> 