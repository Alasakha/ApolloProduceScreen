<template>
    <div class="w-full h-full">
        <dv-border-box-13 class="h-full p-4">
            <div class="flex flex-col h-full">
                <!-- 标题栏 -->
                <div class="title-bar flex items-center h-[40px] text-white text-xl font-bold pl-4 mb-4">
                    <div class="flex items-center">
                        <div class="w-2 h-6 bg-blue-400 mr-2"></div>
                        <span>账务及时率（前一日入库）</span>
                    </div>
                </div>
                
                <!-- 内容区 -->
                <div class="content-area flex-1 flex justify-around items-center">
                    <!-- 应入 -->
                    <div class="metric-box">
                        <div class="label text-gray-300 mb-2">应入</div>
                        <div class="value-container">
                            <dv-digital-flop 
                                :config="{
                                    number: [total],
                                    style: {
                                        fontSize: 50,
                                        fill: '#4d9eff'
                                    }
                                }"
                            />
                        </div>
                    </div>

                    <!-- 实际 -->
                    <div class="metric-box">
                        <div class="label text-gray-300 mb-2">实际</div>
                        <div class="value-container">
                            <dv-digital-flop 
                                :config="{
                                    number: [jsNum],
                                    style: {
                                        fontSize: 50,
                                        fill: '#45d266'
                                    }
                                }"
                            />
                        </div>
                    </div>

                    <!-- 及时率 -->
                    <div class="metric-box">
                        <div class="label text-gray-300 mb-2">及时率</div>
                        <div class="value-container">
                            <dv-digital-flop 
                                :config="{
                      number: [rateNum],
                                    toFixed: 1,
                                    content: '{nt}%',
                                    style: {
                                        fontSize: 50,
                                        fill: '#ffd700'
                                    }
                                }"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </dv-border-box-13>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getInRate } from '@/api/getPmcinfo'
import { eventBus } from '@/utils/eventbus'
const total = ref(0)
const jsNum = ref(0)
const rateNum = ref(0)

// 获取数据
const fetchData = async () => {
    try {
        const res = await getInRate()
        if (res.code === 200) {
            total.value = res.data.total
            jsNum.value = res.data.jsNum
            // 将百分比字符串转换为数字
            rateNum.value = parseFloat(res.data.rate.replace('%', ''))
        } else {
            console.error('获取入库及时率数据失败:', res.message)
        }
    } catch (error) {
        console.error('获取入库及时率数据出错:', error)
    }
}

onMounted(() => {
    fetchData()
    // 监听数据刷新事件
    eventBus.on('refreshData', fetchData)
})

onBeforeUnmount(() => {
    // 移除事件监听
    eventBus.off('refreshData', fetchData)
})
</script>

<style scoped>
.metric-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 0.5vw;
    min-width: 10vw;
    backdrop-filter: blur(2px);
}

.label {
    font-size: 1vw;
    letter-spacing: 0.1vw;
    color: #fff;
}

.value-container {
    min-height: 5vh;
    display: flex;
    align-items: center;
}

.title-bar {
    font-size: 0.8vw !important;
}
</style>

