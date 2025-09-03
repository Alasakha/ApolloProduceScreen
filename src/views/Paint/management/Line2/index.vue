<template>
    <div class="line2-container w-full h-[50%] flex gap-2 p-2">
        <QualityChart class="flex-1 min-w-0"></QualityChart>
        <Abnormal class="flex-1 min-w-0"></Abnormal>
        <rightcontent class="flex-1 min-w-0"></rightcontent>
    </div>
</template>


<script setup lang="ts">
import QualityChart from './qualityQues.vue'
import Abnormal from '../ScrollTable/leftcontent.vue'
import rightcontent from './rightContent.vue'
</script>

<style scoped>
.line2-container {
    /* 确保容器占满可用空间 */
    width: 100%;
    height: 50%;
    display: flex;
    gap: 8px; /* 组件间距 */
    padding: 8px;
    box-sizing: border-box;
}

/* 确保子组件平分空间 */
.line2-container > * {
    flex: 1;
    min-width: 0; /* 防止内容溢出 */
    max-width: 50%; /* 确保平分 */
}
</style>