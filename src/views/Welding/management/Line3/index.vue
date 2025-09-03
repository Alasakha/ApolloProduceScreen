<template>
    <div class="line3-container  flex w-full">
        <div class="abnormal-section">
            <Abnormal />
        </div>
        <div class="quality-section">
            <Quality />
        </div>
    </div>  
</template>

<script setup lang="ts">
// import OneProdLine from './oneProdLine.vue';
// import TwoProdLine from './twoProdLine.vue';
// import Abnormal from './abnormal.vue';
import Quality from './qualityQues.vue';
import Abnormal from '../Line2/Abnormal.vue'
</script>

<style scoped>
.line3-container {
    display: flex;
    width: 100%;
    height: 27%;
    gap: 8px;
}

.abnormal-section {
    flex: 2;
    min-width: 0; /* 防止内容溢出 */
}

.quality-section {
    flex: 1;
    min-width: 0; /* 防止内容溢出 */
}
</style>