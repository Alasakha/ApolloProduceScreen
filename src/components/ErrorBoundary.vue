<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <div class="error-icon">⚠️</div>
      <h3>组件加载失败</h3>
      <p>{{ errorMessage }}</p>
      <button @click="retry" class="retry-btn">重试</button>
      <button @click="reset" class="reset-btn">重置</button>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, nextTick } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')
const error = ref<Error | null>(null)

// 捕获子组件错误
onErrorCaptured((err, instance, info) => {
  console.error('错误边界捕获到错误:', err, instance, info)
  
  hasError.value = true
  error.value = err
  errorMessage.value = err.message || '未知错误'
  
  // 阻止错误继续传播
  return false
})

// 重试加载
const retry = async () => {
  hasError.value = false
  error.value = null
  errorMessage.value = ''
  
  // 等待下一个tick后重新渲染
  await nextTick()
}

// 重置组件
const reset = () => {
  hasError.value = false
  error.value = null
  errorMessage.value = ''
  
  // 强制重新挂载
  window.location.reload()
}
</script>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: rgba(255, 0, 0, 0.1);
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
}

.error-content {
  text-align: center;
  color: #fff;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-content h3 {
  color: #ff6b6b;
  margin: 0 0 12px 0;
}

.error-content p {
  color: #ccc;
  margin: 0 0 20px 0;
  max-width: 300px;
}

.retry-btn,
.reset-btn {
  padding: 8px 16px;
  margin: 0 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.retry-btn {
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
  border: 1px solid rgba(0, 255, 0, 0.3);
}

.retry-btn:hover {
  background: rgba(0, 255, 0, 0.3);
  border-color: #00ff00;
}

.reset-btn {
  background: rgba(255, 0, 0, 0.2);
  color: #ff6b6b;
  border: 1px solid rgba(255, 0, 0, 0.3);
}

.reset-btn:hover {
  background: rgba(255, 0, 0, 0.3);
  border-color: #ff6b6b;
}
</style> 