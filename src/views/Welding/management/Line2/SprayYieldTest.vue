<template>
    <div class="test-container">
        <h2>喷涂直通率功能测试</h2>
        
        <!-- 测试说明 -->
        <div class="test-info">
            <h3>Bug修复说明：</h3>
            <ul>
                <li>✅ 修复了对话框同时出现在组件中和全局中的问题</li>
                <li>✅ 修复了对话框层级混乱的问题</li>
                <li>✅ 确保对话框正确附加到body元素</li>
                <li>✅ 设置了正确的z-index层级</li>
                <li>✅ 添加了模态背景锁定滚动</li>
            </ul>
        </div>
        
        <!-- 喷涂直通率组件 -->
        <div class="component-wrapper">
            <h3>测试组件：</h3>
            <SprayingYield />
        </div>
        
                 <!-- 功能说明 -->
         <div class="test-info">
             <h3>功能说明：</h3>
             <ul>
                 <li>✅ 点击"喷涂直通率"组件可以打开详情对话框</li>
                 <li>✅ 在对话框中可以查看所有检验记录</li>
                 <li>✅ 可以直接在表格中修改合格数量</li>
                 <li>✅ 问题点以Excel表格形式展示（问题点+责任人）</li>
                 <li>✅ 点击"编辑问题"可以同时编辑合格数量和问题点</li>
                 <li>✅ 支持动态添加/删除问题点和责任人</li>
                 <li>✅ 数据具有回写功能，会覆盖原有数据</li>
                 <li>💾 逐条保存：每条数据编辑完成后立即保存并刷新</li>
             </ul>
         </div>
        
                 <!-- 测试步骤 -->
         <div class="test-steps">
             <h3>测试步骤：</h3>
             <ol>
                 <li>点击"喷涂直通率"组件</li>
                 <li>验证对话框是否只出现一次</li>
                 <li>验证对话框是否在正确的层级</li>
                 <li>在表格中直接修改合格数量</li>
                 <li>查看问题点列，验证Excel格式展示</li>
                 <li>点击"编辑问题"按钮</li>
                 <li>在编辑对话框中修改合格数量</li>
                 <li>添加/编辑问题点和责任人</li>
                 <li>保存并验证数据更新</li>
                 <li>关闭所有对话框，验证组件状态</li>
             </ol>
         </div>
    </div>
</template>

<script setup lang="ts">
import SprayingYield from './sprayingYield.vue'
</script>

<style scoped>
.test-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    background: #f9f9f9;
    min-height: 100vh;
}

.component-wrapper {
    margin: 20px 0;
    height: 300px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.component-wrapper h3 {
    margin-top: 0;
    color: #333;
    margin-bottom: 15px;
}

.test-info, .test-steps {
    background: white;
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.test-info h3, .test-steps h3 {
    margin-top: 0;
    color: #333;
    border-bottom: 2px solid #1e90ff;
    padding-bottom: 10px;
}

.test-info ul, .test-steps ol {
    margin: 15px 0;
    padding-left: 20px;
}

.test-info li, .test-steps li {
    margin: 8px 0;
    color: #666;
    line-height: 1.6;
}

.test-steps ol {
    counter-reset: step-counter;
}

.test-steps li {
    counter-increment: step-counter;
    position: relative;
    padding-left: 30px;
}

.test-steps li::before {
    content: counter(step-counter);
    position: absolute;
    left: 0;
    top: 0;
    background: #1e90ff;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
}
</style> 