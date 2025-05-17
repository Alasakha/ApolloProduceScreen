import { onMounted, onUnmounted, ref } from 'vue'

export function useZoomClass() {
  const zoomRatio = ref(window.devicePixelRatio)

  const applyZoomClass = () => {
    const ratio = window.devicePixelRatio
    zoomRatio.value = ratio
    console.log('Zoom ratio:', ratio)
    // 清除旧的 zoom 类
    document.body.className = document.body.className
      .split(' ')
      .filter(c => !c.startsWith('zoom-'))
      .join(' ')

    // 添加新的 zoom 类
    if (ratio <= 0.75) {
      document.body.classList.add('zoom-75')
    } else if (ratio <= 1) {
      document.body.classList.add('zoom-100')
    } else if (ratio <= 1.25) {
      document.body.classList.add('zoom-125')
    } else if (ratio <= 1.5) {
      document.body.classList.add('zoom-150')
    } else {
      document.body.classList.add('zoom-200')
    }
  }

  onMounted(() => {
    applyZoomClass()
    window.addEventListener('resize', applyZoomClass)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', applyZoomClass)
  })

  return {
    zoomRatio,
  }
}
