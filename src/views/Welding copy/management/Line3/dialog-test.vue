<template>
    <div class="dialog-test-container">
        <h2>Dialog闪烁问题测试页面</h2>
        
        <div class="test-buttons">
            <el-button type="primary" @click="testOneLineDialog">测试自动焊1线Dialog</el-button>
            <el-button type="success" @click="testTwoLineDialog">测试自动焊2线Dialog</el-button>
        </div>

        <!-- 自动焊1线组件 -->
        <div class="component-wrapper">
            <h3>自动焊1线组件</h3>
            <oneProdLine />
        </div>

        <!-- 自动焊2线组件 -->
        <div class="component-wrapper">
            <h3>自动焊2线组件</h3>
            <twoProdLine />
        </div>
    </div>
</template>

<script setup lang="ts">
import oneProdLine from './oneProdLine.vue'
import twoProdLine from './twoProdLine.vue'

const testOneLineDialog = () => {
    console.log('测试自动焊1线Dialog')
}

const testTwoLineDialog = () => {
    console.log('测试自动焊2线Dialog')
}
</script>

<style scoped>
.dialog-test-container {
    padding: 20px;
    background: #f5f5f5;
    min-height: 100vh;
}

.test-buttons {
    margin: 20px 0;
    display: flex;
    gap: 16px;
}

.component-wrapper {
    margin: 20px 0;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.component-wrapper h3 {
    margin-top: 0;
    color: #333;
    border-bottom: 2px solid #409EFF;
    padding-bottom: 8px;
}
</style> 