<!-- GlobalTitle.vue -->
<template>
  <div class="relative w-full h-[2vh]">
    <h1
      class="absolute top-[1.2vh] left-[1vw] text-white font-bold tracking-widest drop-shadow-lg"
      :style="{ fontSize: computedFontSize }"
    >
      {{ title }}
    </h1>
    <dv-decoration-10
      class="absolute left-[1vw] top-[4vh]"
      style="width: 92%; height: 0.5vh;"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  size: {
    type: Number,
    default: 1,
  },
})

const computedFontSize = `${props.size}vw`
</script>
