<script setup>
import { ref, reactive, computed, watch } from 'vue';

const props = defineProps({
  msg: String
});

const emit = defineEmits(['update']);

const state = reactive({
  count: 0
});

const doubleCount = computed(() => state.count * 2);

watch(() => state.count, (newVal) => {
  console.log('Count changed:', newVal);
});

const increment = () => {
  state.count++;
  emit('update', state.count);
};

</script>

<template>
  <div class="index">
    <h1>{{ props.msg }}</h1>
    <p>Count: {{ state.count }}</p>
    <p>Double Count: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<style scoped>
.index {
  text-align: center;
  font-family: Arial, sans-serif;
  padding: 20px;
}
button {
  margin-top: 10px;
  padding: 5px 10px;
  font-size: 16px;
}
</style>