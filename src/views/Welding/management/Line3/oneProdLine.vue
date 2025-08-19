<template>
    <div class="prod-line-container">
        <div class="prod-line-title">
            <h3>自动焊1线当日小时产能</h3>
        </div>
        <div class="prod-line-content">
            <div class="capacity-item">
                <span class="item-label">车架:</span>
                <span class="item-value">--</span>
            </div>
            <div class="capacity-item">
                <span class="item-label">后叉:</span>
                <span class="item-value">--</span>
            </div>
            <div class="capacity-item">
                <span class="item-label">尾架:</span>
                <span class="item-value">--</span>
            </div>
            <div class="manual-note">
                <span>(手工填写)</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Mock数据

</script>

<style scoped>
.prod-line-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin: 0 8px;
}

.prod-line-title {
    background: linear-gradient(135deg, #98FB98, #90EE90);
    padding: 8px 16px;
    border-radius: 6px;
    margin-bottom: 16px;
}

.prod-line-title h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    line-height: 1.3;
}

.prod-line-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
}

.capacity-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.item-label {
    font-size: 14px;
    color: #2c3e50;
    font-weight: 500;
}

.item-value {
    font-size: 14px;
    color: #7f8c8d;
    font-weight: 400;
}

.manual-note {
    text-align: center;
    margin-top: 8px;
}

.manual-note span {
    font-size: 12px;
    color: #95a5a6;
    font-style: italic;
}
</style>