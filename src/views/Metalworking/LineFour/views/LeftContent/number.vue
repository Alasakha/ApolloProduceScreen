<script setup>
import { ref } from 'vue';

const total = ref(0);

function increment() {
    total.value++;
}

function decrement() {
    total.value--;
}
</script>

<template>
    <div>
        <h1>Total: {{ total }}</h1>
        <button @click="increment">Increment</button>
        <button @click="decrement">Decrement</button>
    </div>
</template>

<style scoped>
h1 {
    font-size: 24px;
    margin-bottom: 16px;
}

button {
    margin-right: 8px;
    padding: 8px 16px;
    font-size: 16px;
    cursor: pointer;
}
</style>