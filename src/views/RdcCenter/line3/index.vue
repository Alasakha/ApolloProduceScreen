<template>
    <div class="line1-container">
        <Leftcontent></Leftcontent>
        <Rightcontent></Rightcontent>
    </div>
</template>

<script setup>
import Leftcontent from './leftcontent.vue'
import Rightcontent from './rightcontent.vue'
</script>

<style scoped>
/* 整体容器样式 */
.line1-container {
    width: 100%;
    display: flex;
    gap: 8px;
}

/* 左侧面板 - 占1/3宽度 */
.line1-container > :first-child {
    flex: 1;
    min-width: 0;
}

/* 右侧面板 - 占2/3宽度 */
.line1-container > :last-child {
    flex: 2;
    min-width: 0;
}

/* 响应式布局调整 */
@media (min-width: 1921px) and (max-width: 2560px) {
    .line1-container {
        gap: 12px;
        padding: 0 8px;
    }
}

@media (min-width: 1600px) and (max-width: 1920px) {
    .line1-container {
        gap: 8px;
        padding: 0 4px;
    }
}

@media (min-width: 1200px) and (max-width: 1599px) {
    .line1-container {
        gap: 6px;
        padding: 0 2px;
    }
}

@media (min-width: 768px) and (max-width: 1199px) {
    .line1-container {
        flex-direction: column;
        gap: 8px;
        height: auto;
        min-height: 30vh;
    }
}

@media (max-width: 767px) {
    .line1-container {
        flex-direction: column;
        gap: 6px;
        height: auto;
        min-height: 30vh;
    }
}
</style>