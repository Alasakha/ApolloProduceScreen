<template>
    <!-- <div class="example-container">
        <h2>ECharts饼图组件使用示例</h2> -->
        
        <!-- 基础饼图 -->
        <!-- <div class="chart-section">
            <h3>基础饼图</h3>
            <EChartsPieChart
                :data="basicData"
                :config="basicConfig"
                @click="handleBasicClick"
            />
        </div> -->
        
        <!-- 环形图 -->
        <!-- <div class="chart-section">
            <h3>环形图</h3>
            <EChartsPieChart
                :data="donutData"
                :config="donutConfig"
                @click="handleDonutClick"
            />
        </div> -->
        
        <!-- 带中心文字的饼图 -->
        <!-- <div class="chart-section">
            <h3>带中心文字的饼图</h3>
            <EChartsPieChart
                :data="centerTextData"
                :config="centerTextConfig"
                @click="handleCenterTextClick"
            />
        </div> -->
        
        <!-- 暗色主题饼图 -->
        <!-- <div class="chart-section dark-theme">
            <h3>暗色主题饼图</h3>
            <EChartsPieChart
                :data="darkThemeData"
                :config="darkThemeConfig"
                @click="handleDarkThemeClick"
            />
        </div> -->
        
        <!-- 控制面板 -->
        <!-- <div class="control-panel">
            <h3>控制面板</h3>
            <div class="controls">
                <el-button @click="updateData" type="primary">更新数据</el-button>
                <el-button @click="toggleTheme" type="success">切换主题</el-button>
                <el-button @click="resetData" type="warning">重置数据</el-button>
            </div>
            
            <div class="data-display">
                <h4>当前数据:</h4>
                <pre>{{ JSON.stringify(currentData, null, 2) }}</pre>
            </div>
        </div>
    </div> -->
</template>

<script setup lang="ts">
// import { ref, computed } from 'vue'
// import EChartsPieChart from './EChartsPieChart.vue'
// import { ElMessage } from 'element-plus'




// // 基础饼图配置
// const basicConfig = computed(() => ({
//     title: '基础饼图示例',
//     radius: '70%',
//     center: ['50%', '50%'],
//     showLabel: true,
//     showValue: true,
//     showPointer: true,
//     theme: 'light'
// }))



// // 环形图配置
// const donutConfig = computed(() => ({
//     title: '环形图示例',
//     radius: ['40%', '70%'],
//     center: ['50%', '50%'],
//     showLabel: true,
//     showValue: true,
//     showPointer: true,
//     theme: 'light'
// }))



// // 带中心文字的配置
// const centerTextConfig = computed(() => ({
//     title: '带中心文字的饼图',
//     radius: '60%',
//     center: ['50%', '50%'],
//     showLabel: true,
//     showValue: true,
//     showPointer: true,
//     theme: 'light'
// }))



// // 暗色主题配置
// const darkThemeConfig = computed(() => ({
//     title: '暗色主题饼图',
//     radius: '75%',
//     center: ['50%', '50%'],
//     showLabel: true,
//     showValue: true,
//     showPointer: true,
//     theme: 'dark'
// }))

// // 当前显示的数据
// const currentData = computed(() => basicData.value)

// // 点击事件处理
// const handleBasicClick = (params: any) => {
//     console.log('基础饼图点击:', params)
//     ElMessage.info(`点击了: ${params.name}, 值: ${params.value}`)
// }

// const handleDonutClick = (params: any) => {
//     console.log('环形图点击:', params)
//     ElMessage.info(`点击了: ${params.name}, 值: ${params.value}`)
// }

// const handleCenterTextClick = (params: any) => {
//     console.log('中心文字饼图点击:', params)
//     ElMessage.info(`点击了: ${params.name}, 值: ${params.value}`)
// }

// const handleDarkThemeClick = (params: any) => {
//     console.log('暗色主题饼图点击:', params)
//     ElMessage.info(`点击了: ${params.name}, 值: ${params.value}`)
// }

// // 更新数据
// const updateData = () => {
//     basicData.value = basicData.value.map(item => ({
//         ...item,
//         value: Math.floor(Math.random() * 50) + 10
//     }))
    
//     donutData.value = donutData.value.map(item => ({
//         ...item,
//         value: Math.floor(Math.random() * 40) + 5
//     }))
    
//     centerTextData.value = centerTextData.value.map(item => ({
//         ...item,
//         value: Math.floor(Math.random() * 30) + 5
//     }))
    
//     darkThemeData.value = darkThemeData.value.map(item => ({
//         ...item,
//         value: Math.floor(Math.random() * 35) + 5
//     }))
    
//     ElMessage.success('数据已更新')
// }

// // 切换主题
// const toggleTheme = () => {
//     const newTheme = darkThemeConfig.value.theme === 'dark' ? 'light' : 'dark'
//     darkThemeConfig.value = {
//         ...darkThemeConfig.value,
//         theme: newTheme
//     }
//     ElMessage.success(`主题已切换为: ${newTheme}`)
// }

// // 重置数据
// const resetData = () => {
//     basicData.value = [
//         { name: '焊接缺陷', value: 25, color: '#4A90E2' },
//         { name: '尺寸偏差', value: 32, color: '#7B68EE' },
//         { name: '表面缺陷', value: 24, color: '#9370DB' },
//         { name: '材料问题', value: 19, color: '#8A2BE2' }
//     ]
    
//     donutData.value = [
//         { name: '类别A', value: 30, color: '#FF6B6B' },
//         { name: '类别B', value: 25, color: '#4ECDC4' },
//         { name: '类别C', value: 20, color: '#45B7D1' },
//         { name: '类别D', value: 15, color: '#96CEB4' },
//         { name: '类别E', value: 10, color: '#FFEAA7' }
//     ]
    
//     centerTextData.value = [
//         { name: '优秀', value: 40, color: '#52C41A' },
//         { name: '良好', value: 35, color: '#1890FF' },
//         { name: '一般', value: 20, color: '#FAAD14' },
//         { name: '较差', value: 5, color: '#F5222D' }
//     ]
    
//     darkThemeData.value = [
//         { name: '模块A', value: 28, color: '#FF7875' },
//         { name: '模块B', value: 22, color: '#95DE64' },
//         { name: '模块C', value: 18, color: '#69C0FF' },
//         { name: '模块D', value: 16, color: '#FFC53D' },
//         { name: '模块E', value: 16, color: '#B37FEB' }
//     ]
    
//     ElMessage.success('数据已重置')
// }
</script>

<style scoped>
.example-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.example-container h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 30px;
}

.chart-section {
    margin-bottom: 40px;
    padding: 20px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    background: #fff;
}

.chart-section h3 {
    color: #2c3e50;
    margin-bottom: 20px;
    text-align: center;
}

.chart-section.dark-theme {
    background: #1a1a1a;
    border-color: #333;
}

.chart-section.dark-theme h3 {
    color: #fff;
}

.control-panel {
    margin-top: 40px;
    padding: 20px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    background: #f8f9fa;
}

.control-panel h3 {
    color: #2c3e50;
    margin-bottom: 20px;
}

.controls {
    margin-bottom: 20px;
}

.controls .el-button {
    margin-right: 10px;
}

.data-display {
    background: #fff;
    padding: 15px;
    border-radius: 4px;
    border: 1px solid #e4e7ed;
}

.data-display h4 {
    color: #2c3e50;
    margin-bottom: 10px;
}

.data-display pre {
    background: #f5f5f5;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 12px;
    color: #333;
}
</style> 