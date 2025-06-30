<template>
<div class="w-screen h-[35vh] pl-[2vw] pr-[2vw] pt-[1vw] flex">
    <div class="h-[100%] flex-4"><Left></Left></div>

    <div class="h-[100%] flex-3"><Middle></Middle></div>

    <div class="h-[100%] flex-4"><Right></Right></div>

</div>
</template>

<script setup>
import Left from'./LeftContent/index.vue'
import Middle from './MiddleConetnt/index.vue'  
import Right from './RightContent/index.vue'
</script>


<style scoped >


</style>