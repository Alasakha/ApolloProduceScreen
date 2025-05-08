<template>
  <div class="relative w-full h-[12%]">
    <h1
      class="absolute top-4 left-4 text-white font-bold tracking-widest drop-shadow-lg"
      :class="`text-${size}`"
    >
      {{ title }}
    </h1>
    <dv-decoration-10 style="width:96%;height:5px;" class="absolute top-13 left-4 "/>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: '2xl' // Tailwind 字号类，如 text-xl、text-2xl
  }
})
</script>