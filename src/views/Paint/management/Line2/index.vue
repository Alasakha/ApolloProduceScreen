<template>
    <div class="line2-container w-full h-[50%] flex gap-2 p-2">
        <QualityChart class="flex-1 min-w-0"></QualityChart>

        <rightcontent class="flex-1 min-w-0"></rightcontent>
        <Abnormal class="flex-2 min-w-0"></Abnormal>
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
    height: 47%;
    display: flex;
    gap: 8px; /* 组件间距 */
    padding: 8px;
    box-sizing: border-box;
}

/* 设置组件宽度比例为1:2:1 */
.line2-container .flex-1 {
    flex: 1;
    min-width: 0; /* 防止内容溢出 */
}

.line2-container .flex-2 {
    flex: 2;
    min-width: 0; /* 防止内容溢出 */
}
</style>