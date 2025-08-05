<template>
    <div class="line2-container w-full h-[60%] flex">
        <LeftContent class="flex-1"/>
        <div class="h-full w-[1px] bg-[#00eeff] opacity-30 mx-2"></div>
        <RightContent class="flex-2"/>
    </div>
</template>


<script setup lang="ts">
import LeftContent from './LeftContent.vue';
import RightContent from './rightContent.vue';
</script>