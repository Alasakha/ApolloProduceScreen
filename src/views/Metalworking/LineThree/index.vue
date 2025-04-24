<template>
    <div class="metalworking h-[30vh] p-4 pt-0 flex gap-4">

        <Rate class="flex-1"></Rate>
        <Responsibility class="flex-1"></Responsibility>
        <Question class="flex-1"></Question>
    </div>
    
</template>

<script setup>
// Add your script logic here
import Rate from './views/rate.vue'
import Responsibility from './views/responsibility.vue'
import Question from './views/question.vue'
</script>

<style scoped>
.metalworking {
    /* Add your styles here */
}
</style>