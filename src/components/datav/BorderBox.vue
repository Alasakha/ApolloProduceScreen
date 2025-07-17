<template>
  <div class="border-box-wrapper" :style="{ width, height, position: 'relative' }">
    <!-- SVG 边框 -->
    <svg
      class="border-svg"
      width="100%"
      height="100%"
      viewBox="39 39 430 217"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"

      style="position:absolute;left:0;top:0;z-index:1;pointer-events:none;"
    >
      <!-- 流动线条动画 -->
      <path
        d="M79 45L445 45"
        stroke="url(#paint1_linear_0_1)"
        stroke-width="2"
        stroke-dasharray="10 10"
        stroke-dashoffset="0"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;-20"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>

      <!-- 原始 SVG 内容保留 -->
      <path d="M42 40V41H463V40V39H42V40ZM465 42H464V254H465H466V42H465ZM463 256V255H42V256V257H463V256ZM40 254H41V42H40H39V254H40ZM42 256V255C41.4477 255 41 254.552 41 254H40H39C39 255.657 40.3432 257 42 257V256ZM465 254H464C464 254.552 463.552 255 463 255V256V257C464.657 257 466 255.657 466 254H465ZM463 40V41C463.552 41 464 41.4477 464 42H465H466C466 40.3431 464.657 39 463 39V40ZM42 40V39C40.3431 39 39 40.3432 39 42H40H41C41 41.4477 41.4477 41 42 41V40Z" fill="black" fill-opacity="0.1"/>
      <path d="M43 83V194" stroke="url(#paint0_linear_0_1)" stroke-width="2"/>
      <path d="M48.5 123L48 56" stroke="#45C5F9" stroke-width="2"/>
      <g filter="url(#filter0_d_0_1)">
        <path d="M79 45L445 45" stroke="#1769FD" stroke-width="2"/>
      </g>
      <path d="M115 45L108 56" stroke="black" stroke-opacity="0.02"/>
      <path d="M72 56L47 56" stroke="#23BCFB" stroke-width="2"/>
      <path d="M43 205.5V245.5H49.5" stroke="#1F76FC" stroke-width="2"/>
      <path d="M410.5 50H454.5V121" stroke="#1466FD" stroke-opacity="0.8" stroke-width="2"/>
      <path d="M410.5 50H454.5V121" stroke="#22A1FC" stroke-opacity="0.2" stroke-width="2"/>
      <path d="M457 205L457 246H429" stroke="#1E6FFF" stroke-width="2"/>
      <path d="M388.5 246.25L130.5 246.25" stroke="url(#paint2_linear_0_1)" stroke-width="2"/>
      <path d="M113.5 245.5H43" stroke="#1F76FC" stroke-width="2"/>
      <path d="M43 232.5H134.751L153 245.5" stroke="#6193FF" stroke-width="2"/>
      <circle cx="423" cy="246" r="5" stroke="#0B6AFD" stroke-width="2"/>
      <path d="M394.196 242C396.958 242 399.196 244.239 399.196 247C399.196 249.761 396.958 252 394.196 252C391.435 252 389.196 249.761 389.196 247C389.196 244.239 391.435 242 394.196 242Z" stroke="#0B6AFD" stroke-width="2"/>
      <path d="M80 45.5L73 56.5" stroke="#0D99FF" stroke-width="2"/>
      <path d="M72 56H153L160.5 45" stroke="url(#paint3_linear_0_1)" stroke-width="2"/>
      <path d="M101.65 45L95.5 56H109.556M109.556 56L114.827 45M109.556 56H122.734M122.734 56L128.883 45M122.734 56H136.35L142.5 45" stroke="url(#paint4_linear_0_1)" stroke-width="2"/>
      <path d="M460 90V212" stroke="#44B0F8" stroke-width="2"/>
      <path d="M460 90V212" stroke="#206FFD" stroke-opacity="0.8" stroke-width="2"/>
      <!-- 渐变和滤镜定义 -->
      <defs>
        <filter id="filter0_d_0_1" x="75" y="44" width="374" height="10" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="4"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape"/>
        </filter>
        <linearGradient id="paint0_linear_0_1" x1="43.5" y1="83" x2="43.5" y2="194" gradientUnits="userSpaceOnUse">
          <stop stop-color="#45C5F9"/>
          <stop offset="1" stop-color="#1B6FFC"/>
        </linearGradient>
        <linearGradient id="paint1_linear_0_1" x1="79" y1="45.5" x2="445" y2="45.5" gradientUnits="userSpaceOnUse">
          <stop offset="0.034664" stop-color="#17B2FC"/>
          <stop offset="0.454253" stop-color="#1769FD"/>
          <stop offset="1" stop-color="#50DAF7"/>
        </linearGradient>
        <linearGradient id="paint2_linear_0_1" x1="130.5" y1="246.25" x2="388.5" y2="246.25" gradientUnits="userSpaceOnUse">
          <stop stop-color="#1861FC"/>
          <stop offset="0.293269" stop-color="#74D5F4"/>
          <stop offset="1" stop-color="#1B7EFF"/>
        </linearGradient>
        <linearGradient id="paint3_linear_0_1" x1="72" y1="50.5" x2="160.5" y2="50.5" gradientUnits="userSpaceOnUse">
          <stop stop-color="#1DA5FB"/>
          <stop offset="1" stop-color="#3D6AF8"/>
        </linearGradient>
        <linearGradient id="paint4_linear_0_1" x1="95.5" y1="50.5" x2="142.5" y2="50.5" gradientUnits="userSpaceOnUse">
          <stop stop-color="#1DA5FB"/>
          <stop offset="1" stop-color="#1949FB"/>
        </linearGradient>
      </defs>
    </svg>

    <!-- 插槽内容 -->
    <div class="border-box-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '296px' }
})
</script>

<style scoped>
.border-box-wrapper {
  display: block;
}
.border-svg {
  pointer-events: none;
}
.border-box-content {
  padding: 1vw 2vw 2vw 1vw;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
</style>
