<template>
  <div class="color-test">
    <h2>CSS变量测试</h2>
    
    <div class="test-section">
      <h3>文字颜色测试</h3>
      <div class="text-primary">主文字颜色 (var(--text-primary))</div>
      <div class="text-secondary">次文字颜色 (var(--text-secondary))</div>
      <div class="text-muted">弱化文字颜色 (var(--text-muted))</div>
    </div>
    
    <div class="test-section">
      <h3>主色调测试</h3>
      <div class="primary-blue">主蓝色 (var(--primary-blue))</div>
      <div class="secondary-blue">辅助蓝色 (var(--secondary-blue))</div>
      <div class="deep-blue">深蓝色 (var(--deep-blue))</div>
    </div>
    
    <div class="test-section">
      <h3>状态色测试</h3>
      <div class="success">成功色 (var(--success))</div>
      <div class="warning">警告色 (var(--warning))</div>
      <div class="error">错误色 (var(--error))</div>
    </div>
    
    <div class="test-section">
      <h3>背景色测试</h3>
      <div class="bg-card">卡片背景 (var(--bg-card))</div>
      <div class="bg-primary">主背景 (var(--bg-primary))</div>
    </div>
  </div>
</template>

<script setup>
// 测试组件，用于验证CSS变量是否正常工作
</script>

<style scoped>
.color-test {
  padding: 20px;
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  margin: 20px;
}

.test-section {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid var(--border-secondary);
  border-radius: 8px;
}

.test-section h3 {
  color: var(--primary-blue);
  margin-bottom: 10px;
}

.text-primary {
  color: var(--text-primary);
  font-size: 16px;
  margin: 5px 0;
}

.text-secondary {
  color: var(--text-secondary);
  font-size: 16px;
  margin: 5px 0;
}

.text-muted {
  color: var(--text-muted);
  font-size: 16px;
  margin: 5px 0;
}

.primary-blue {
  color: var(--primary-blue);
  font-size: 16px;
  margin: 5px 0;
}

.secondary-blue {
  color: var(--secondary-blue);
  font-size: 16px;
  margin: 5px 0;
}

.deep-blue {
  color: var(--deep-blue);
  font-size: 16px;
  margin: 5px 0;
}

.success {
  color: var(--success);
  font-size: 16px;
  margin: 5px 0;
}

.warning {
  color: var(--warning);
  font-size: 16px;
  margin: 5px 0;
}

.error {
  color: var(--error);
  font-size: 16px;
  margin: 5px 0;
}

.bg-card {
  background: var(--bg-card);
  color: var(--text-primary);
  padding: 10px;
  border-radius: 4px;
  margin: 5px 0;
}

.bg-primary {
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: 10px;
  border-radius: 4px;
  margin: 5px 0;
}
</style> 