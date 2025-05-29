<template>
    <div class="line2 ">
        <dv-border-box-13 class="h-full p-4">
            <div class="flex flex-col h-full">
                <!-- 标题栏 -->
                <div class="title-bar flex items-center  text-white text-xl font-bold pl-4 mb-2">
                    <div class="flex items-center">
                        <div class="w-2 h-6 bg-blue-400 mr-2"></div>
                        <span>到货及时率</span>
                    </div>
                </div>
                
                <!-- 内容区 -->
                <div class="content-area flex-1 flex justify-around items-center ">
                    <!-- 应到 -->
                    <div class="metric-box">
                        <div class="label text-gray-300 text-2xl">应到:</div>
                        <div class="value-container">
                            <dv-digital-flop 
                                :config="{
                                    number: [234],
                                    style: {
                                        fontSize: 50,
                                        fill: '#4d9eff'
                                    }
                                }"
                            />
                        </div>
                    </div>

                    <!-- 实到 -->
                    <div class="metric-box">
                        <div class="label text-gray-300 text-2xl">实到:</div>
                        <div class="value-container">
                            <dv-digital-flop 
                                :config="{
                                    number: [220],
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
                        <div class="label text-gray-300 text-2xl ">及时率:</div>
                        <div class="value-container">
                            <dv-digital-flop 
                                :config="{
                                    number: [94.02],
                                    toFixed: 2,
                                    suffix: '%',
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
import { ref, onMounted } from 'vue'
</script>

<style scoped>
.line2 {
    color: #fff;
}

.metric-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0.5rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    min-width: 1vw;
}

.label {

    letter-spacing: 1px;
}

.value-container {
    min-height: 40px;
    display: flex;
    align-items: center;
}
</style>