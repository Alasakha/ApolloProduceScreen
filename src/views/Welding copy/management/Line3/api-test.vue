<template>
    <div class="api-test-container">
        <h2>API接口测试页面</h2>
        
        <div class="test-section">
            <h3>API调用测试</h3>
            <div class="test-controls">
                <el-select v-model="testCode" placeholder="选择测试代码">
                    <el-option label="自动焊1线 (HJ1)" value="HJ1" />
                    <el-option label="自动焊2线 (HJ2)" value="HJ2" />
                </el-select>
                <el-button type="success" @click="testAPICall" :loading="testing">测试API调用</el-button>
            </div>
        </div>

        <div class="test-section">
            <h3>测试结果</h3>
            <div class="test-results">
                <div v-for="(result, index) in testResults" :key="index" class="result-item">
                    <div class="result-header">
                        <span class="result-time">{{ result.time }}</span>
                        <span :class="['result-status', result.success ? 'success' : 'error']">
                            {{ result.success ? '成功' : '失败' }}
                        </span>
                    </div>
                    <div class="result-content">
                        <div><strong>测试类型:</strong> {{ result.type }}</div>
                        <div><strong>详细信息:</strong> {{ result.message }}</div>
                        <div v-if="result.error" class="result-error">
                            <strong>错误信息:</strong>
                            <pre>{{ result.error }}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { automaticWeldingFillin, type AutomaticWeldingFillin } from '@/api/getStampWeldinfo'

// 测试状态
const testing = ref(false)
const testCode = ref('HJ1')
const testResults = ref<Array<{
    time: string
    type: string
    success: boolean
    message: string
    error?: string
}>>([])

// 添加测试结果
const addTestResult = (type: string, success: boolean, message: string, error?: any) => {
    testResults.value.unshift({
        time: new Date().toLocaleTimeString(),
        type,
        success,
        message,
        error: error ? JSON.stringify(error, null, 2) : undefined
    })
}

// 测试API调用
const testAPICall = async () => {
    testing.value = true
    try {
        console.log('开始API调用测试...')
        
        const data: AutomaticWeldingFillin = {
            code: testCode.value,
            hourList: Array.from({ length: 24 }, (_, i) => ({
                hour: i + 1,
                cj: Math.floor(Math.random() * 10),
                hch: Math.floor(Math.random() * 10),
                wj: Math.floor(Math.random() * 10),
                plan: Math.floor(Math.random() * 10)  // 添加缺失的 plan 属性
            }))
        }
        
        console.log('发送数据:', data)
        
        const result = await automaticWeldingFillin(data)
        console.log('API调用成功:', result)
        
        addTestResult('API调用测试', true, `成功调用${testCode.value}接口`)
        ElMessage.success('API调用测试成功')
        
    } catch (error) {
        console.error('API调用测试失败:', error)
        
        let errorMessage = 'API调用失败'
        if (error.response) {
            errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`
        }
        
        addTestResult('API调用测试', false, errorMessage, error)
        ElMessage.error(errorMessage)
    } finally {
        testing.value = false
    }
}
</script>

<style scoped>
.api-test-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.test-section {
    margin: 20px 0;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.test-section h3 {
    margin-top: 0;
    color: #333;
    border-bottom: 2px solid #409EFF;
    padding-bottom: 8px;
}

.test-controls {
    display: flex;
    gap: 16px;
    align-items: center;
    margin: 16px 0;
}

.test-results {
    max-height: 400px;
    overflow-y: auto;
}

.result-item {
    border: 1px solid #ddd;
    border-radius: 4px;
    margin: 8px 0;
    padding: 12px;
}

.result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.result-time {
    font-size: 12px;
    color: #666;
}

.result-status {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
}

.result-status.success {
    background: #f0f9ff;
    color: #67c23a;
}

.result-status.error {
    background: #fef0f0;
    color: #f56c6c;
}

.result-content {
    font-size: 14px;
    line-height: 1.5;
}

.result-error {
    margin-top: 8px;
    background: #fef0f0;
    padding: 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    max-height: 150px;
    overflow-y: auto;
    color: #f56c6c;
}
</style> 