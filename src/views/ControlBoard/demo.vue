<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>🚀 阿波罗中控大屏演示</h1>
      <p>浙江阿波罗科技运动有限公司 - 现代化数据看板系统</p>
    </div>
    
    <div class="demo-content">
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">🌍</div>
          <h3>3D地球模型</h3>
          <p>使用Three.js创建的炫酷3D地球，展示全球摩托车贸易业务</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>实时数据监控</h3>
          <p>动态显示订单、生产、设备等关键业务指标</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>现代化UI设计</h3>
          <p>深色科技主题，具有专业的视觉效果和用户体验</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>响应式布局</h3>
          <p>支持多种屏幕尺寸，适配不同显示设备</p>
        </div>
      </div>
      
      <div class="demo-actions">
        <button class="demo-btn primary" @click="openControlBoard">
          🚀 打开中控大屏
        </button>
        <button class="demo-btn secondary" @click="showFeatures">
          📋 查看功能详情
        </button>
      </div>
      
      <div class="demo-info">
        <h2>🎯 主要功能模块</h2>
        <div class="info-grid">
          <div class="info-item">
            <h4>📈 数据展示</h4>
            <ul>
              <li>今日订单数量</li>
              <li>生产进度监控</li>
              <li>设备运行状态</li>
              <li>库存预警信息</li>
            </ul>
          </div>
          
          <div class="info-item">
            <h4>🌍 3D可视化</h4>
            <ul>
              <li>地球自转动画</li>
              <li>云层环绕效果</li>
              <li>摩托车模型展示</li>
              <li>星空背景</li>
            </ul>
          </div>
          
          <div class="info-item">
            <h4>📊 图表分析</h4>
            <ul>
              <li>销售趋势分析</li>
              <li>市场分布统计</li>
              <li>生产线状态</li>
              <li>进度指标</li>
            </ul>
          </div>
          
          <div class="info-item">
            <h4>⚡ 实时更新</h4>
            <ul>
              <li>自动数据刷新</li>
              <li>动态指标变化</li>
              <li>交互式操作</li>
              <li>全屏模式支持</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 功能详情弹窗 -->
    <div v-if="showFeaturesModal" class="modal-overlay" @click="closeFeatures">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>🔍 功能详情</h3>
          <button class="close-btn" @click="closeFeatures">×</button>
        </div>
        <div class="modal-body">
          <div class="feature-detail">
            <h4>🌍 Three.js地球模型</h4>
            <p>中央展示的3D地球模型具有以下特色：</p>
            <ul>
              <li>流畅的自转动画</li>
              <li>半透明云层效果</li>
              <li>摩托车模型展示</li>
              <li>动态光照和阴影</li>
              <li>星空背景环境</li>
            </ul>
          </div>
          
          <div class="feature-detail">
            <h4>📊 数据可视化</h4>
            <p>丰富的数据展示形式：</p>
            <ul>
              <li>折线图：销售趋势分析</li>
              <li>饼图：市场分布统计</li>
              <li>进度条：各项指标完成度</li>
              <li>状态卡片：设备运行情况</li>
            </ul>
          </div>
          
          <div class="feature-detail">
            <h4>🎨 交互体验</h4>
            <p>现代化的用户交互：</p>
            <ul>
              <li>悬停效果和动画</li>
              <li>点击查看详情</li>
              <li>全屏模式支持</li>
              <li>响应式布局适配</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showFeaturesModal = ref(false)

// 打开中控大屏
const openControlBoard = () => {
  router.push('/control-board')
}

// 显示功能详情
const showFeatures = () => {
  showFeaturesModal.value = true
}

// 关闭功能详情
const closeFeatures = () => {
  showFeaturesModal.value = false
}
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  color: #fff;
  padding: 40px 20px;
}

.demo-header {
  text-align: center;
  margin-bottom: 60px;
}

.demo-header h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #00ffff, #00ff96);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.demo-header p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
}

.demo-content {
  max-width: 1200px;
  margin: 0 auto;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.feature-card:hover {
  transform: translateY(-10px);
  border-color: rgba(0, 255, 255, 0.3);
  box-shadow: 0 20px 40px rgba(0, 255, 255, 0.1);
}

.feature-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #00ffff;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.demo-actions {
  text-align: center;
  margin-bottom: 60px;
}

.demo-btn {
  padding: 15px 30px;
  margin: 0 15px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.demo-btn.primary {
  background: linear-gradient(45deg, #00ffff, #00cc7a);
  color: #000;
  box-shadow: 0 8px 25px rgba(0, 255, 255, 0.3);
}

.demo-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(0, 255, 255, 0.4);
}

.demo-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.demo-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-3px);
}

.demo-info {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px;
  backdrop-filter: blur(10px);
}

.demo-info h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 40px;
  color: #00ffff;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.info-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-item h4 {
  color: #00ff96;
  font-size: 1.2rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-item ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-item li {
  color: rgba(255, 255, 255, 0.8);
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  padding-left: 20px;
}

.info-item li::before {
  content: '▶';
  position: absolute;
  left: 0;
  color: #00ffff;
  font-size: 0.8rem;
}

.info-item li:last-child {
  border-bottom: none;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.modal-content {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  color: #00ffff;
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.modal-body {
  padding: 30px;
}

.feature-detail {
  margin-bottom: 30px;
}

.feature-detail h4 {
  color: #00ff96;
  font-size: 1.3rem;
  margin-bottom: 15px;
}

.feature-detail p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
  line-height: 1.6;
}

.feature-detail ul {
  list-style: none;
  padding: 0;
}

.feature-detail li {
  color: rgba(255, 255, 255, 0.7);
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
}

.feature-detail li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #00ff96;
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .demo-header h1 {
    font-size: 2rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .demo-btn {
    display: block;
    margin: 15px auto;
    width: 100%;
    max-width: 300px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
}
</style> 