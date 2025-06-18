<template>
  <div class="dashboard-card rounded-lg shadow-md border border-sky-800 flex flex-col">
    <!-- 标题部分 -->
    <div  v-if="isShowtilte" class="card-header text-2xl font-bold text-white border-b border-sky-800 h-12 flex justify-center items-center"
      style="background: linear-gradient(to right, #0288d1, rgb(23, 31, 75));">
      <slot name="title"></slot>
    </div>  

    <!-- 主题内容部分 -->
    <div class="card-body flex-1" style="background-color: rgba(3, 16, 61, 0.5);">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isShowtilte: {
    type: Boolean,
    default: true
  }
})
</script>
<style scoped>
.card-header {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>
