<template>
    <div class="stock-view h-[20vh] flex ">
        <LeftContent class="pr-4"/>
        <!-- <RightContent/> -->
        <!-- Add your template content here -->
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import  LeftContent from './views/leftcontent.vue';
import  RightContent from './views/rightcontentq.vue';
// Define your component data
const someData = ref(null);

// Define your methods
function someMethod() {
    // Add your method logic here
}

// Define your computed properties
const someComputed = computed(() => {
    // Add your computed logic here
});
</script>

<style scoped>
.stock-view {
    /* Add your styles here */
    padding-top: 1vh;
}
</style>
