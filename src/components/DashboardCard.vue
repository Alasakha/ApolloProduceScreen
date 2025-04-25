<template>
  <div class="dashboard-card  rounded-lg shadow-md border border-sky-800">
    <!-- 标题部分 -->
    <div class="card-header text-lg font-bold text-white border-b border-sky-800 h-[10%] flex justify-center items-center"
      style="background: linear-gradient(to right, rgb(28, 67, 119), rgb(23, 31, 75));">
      <slot name="title" style="color:linear-gradient(to right, rgb(28, 67, 119), rgb(23, 31, 75))"></slot>
    </div>  

    <!-- 主题内容部分 -->
    <div class="card-body" style="background-color: rgba(3, 16, 61, 0.5); height: 90%;">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.card-header {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>
