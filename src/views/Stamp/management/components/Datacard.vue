<template>
    <div class="flex w-full h-full items-center">
  <div class="box-title flex-1 flex flex-col justify-center h-full">
    <div class="text-2xl">{{props.title}}</div>
     <div class="text-sm">{{props.EnlishTitle}}</div>
  </div>
<div class="circle-content-box flex-1 h-full">
 
  <svg viewBox="0 0 120 120" class="ring-svg">
    <circle
      class="ring-bg"
      cx="60" cy="60" r="50"
      fill="none"
      stroke="#02e0fd"
      stroke-width="8"
    />
    <circle
      class="ring-animate"
      cx="60" cy="60" r="50"
      fill="none"
      stroke="url(#gradient)"
      stroke-width="4"
      stroke-dasharray="314"
      stroke-dashoffset="0"
    />
    <defs>
      <linearGradient id="gradient">
        <stop offset="0%" stop-color="#00eaff"/>
        <stop offset="100%" stop-color="#2392f1"/>
      </linearGradient>
    </defs>
  </svg>
  <div class="circle-content">
    <div class="box-value float-updown">{{ props.value }}</div>
  </div>
</div>
</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
title: {
type: String,
default: ''
},
EnlishTitle: {
type: String,
default: ''
},
value: {
type: [String, Number],
default: ''
}
});
</script>

<style scoped>
.circle-content-box {
position: relative;
width: 100%;
height: 100%;
margin: 0 auto;
display: flex;
align-items: center;
justify-content: center;
}

.ring-svg {
position: absolute;
top: 0; left: 0;
width: 100%; height: 100%;
z-index: 0;
filter: drop-shadow(0 0 16px #00eaff88);
pointer-events: none;
}

.circle-content {
position: relative;
z-index: 1;
width: 100%;
height: 100%;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
}

.ring-bg {
opacity: 0.2;
}

.ring-animate {
stroke-linecap: round;
filter: blur(1px);
animation: ring-rotate 2.5s linear infinite;
transform-origin: 60px 60px;
}

@keyframes ring-rotate {
100% { stroke-dashoffset: 314; transform: rotate(360deg);}
}

.box-title {
display: flex;
justify-content: center;
align-items: center;
text-align: center;
font-weight: bold;
color: #fff;
letter-spacing: 0.3vw;
text-shadow: 0 0.3vh 1vw #000, 0 0 0.2vw #00bfff;
}

.box-value {
font-size: 2rem;
font-weight: bold;
color: #fff;
}

.float-updown {
animation: floatUpDown 2.5s cubic-bezier(0.4,0,0.2,1) infinite;
display: inline-block;
}

@keyframes floatUpDown {
0%, 100% { transform: translateY(0); }
50%      { transform: translateY(-5px); }
}
</style>