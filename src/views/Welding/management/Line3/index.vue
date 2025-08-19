<template>
    <div class="line3-container h-[30%] flex">
        <OneProdLine class="flex-1" />
        <TwoProdLine class="flex-1" />
        <Abnormal class="flex-1" />
        <Quality class="flex-1" />
    </div>  

</template>


<script setup lang="ts">
import OneProdLine from './oneProdLine.vue';
import TwoProdLine from './twoProdLine.vue';
import Abnormal from './abnormal.vue';
import Quality from './qualityQues.vue';

</script>

<style scoped>
.line3-container {
    gap: 8px;
    padding: 16px;
    background: linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(41, 128, 185, 0.1));
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.line3-container > * {
    transition: all 0.3s ease;
}

.line3-container > *:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}
</style>