<template>
  <div class="dashboard-card  rounded-lg shadow-md border border-sky-800">
    <!-- 标题部分 -->
    <div class="card-header text-lg font-bold bg-[#171F4B] text-white  border-b border-sky-800 h-[10%]
    flex justify-center items-center">
      <slot name="title"></slot>
    </div>  

    <!-- 主题内容部分 -->
    <div class="card-body text-white bg-[#03103D] h-[90%]">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>


</style>