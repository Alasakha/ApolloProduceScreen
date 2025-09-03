<template>
  <div class="blue-panel">
    <div class="blue-panel__header" v-if="title">
      <span class="blue-panel__title">{{ title }}</span>
      <span class="blue-panel__subtitle" v-if="subtitle">{{ subtitle }}</span>
    </div>
    <div class="blue-panel__body">
      <slot />
    </div>
  </div>
  
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<style scoped>
.blue-panel {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: radial-gradient(120% 120% at 0% 0%, rgba(14, 72, 128, 0.85) 0%, rgba(8, 28, 60, 0.92) 60%),
              linear-gradient(180deg, rgba(6, 26, 54, 0.95) 0%, rgba(6, 26, 54, 0.9) 100%);
  border: 1px solid rgba(0, 178, 255, 0.6);
  box-shadow: 0 0 0 1px rgba(0, 178, 255, 0.35) inset, 0 10px 30px rgba(0, 0, 0, 0.35);
  position: relative;
  padding: 14px 16px;
  overflow: hidden;
}

.blue-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 14px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(0, 157, 255, 0.65), rgba(0, 255, 255, 0.2));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.blue-panel__header {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e8f6ff;
  margin-bottom: 10px;
}

.blue-panel__title {
  font-weight: 800;
  letter-spacing: 1px;
  font-size: 18px;
  text-shadow: 0 2px 8px rgba(0, 156, 255, 0.35);
}

.blue-panel__subtitle {
  opacity: 0.8;
  font-size: 13px;
}

.blue-panel__body {
  width: 100%;
  height: calc(100% - 28px);
  color: #e8f6ff;
  font-size: 16px;
}
</style>

