<template>
    <div class="line2-container w-full h-full flex flex-col">
        <div class="yield-section flex-1">
            <SprayingYield />
        </div>
        <div class="yield-section flex-1">
            <RoughYield />
        </div>
    </div>
</template>

<script setup lang="ts">
import SprayingYield from './sprayingYield.vue';
import RoughYield from './roughYield.vue';
</script>

<style scoped>
.line2-container {
    gap: 8px;
    padding: 8px;
    background: linear-gradient(135deg, rgba(52, 152, 219, 0.05), rgba(41, 128, 185, 0.05));
    border-radius: 8px;
}

.yield-section {
    transition: all 0.3s ease;
}

.yield-section:hover {
    transform: translateY(-2px);
}
</style>