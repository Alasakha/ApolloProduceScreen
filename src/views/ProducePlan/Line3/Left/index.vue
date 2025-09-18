<template>
    <div class="left  h-full flex-col flex">
      <dv-border-box12>
        <div dv-bg class="day-title">
          订单准交率
        </div>

        <!-- 加载中遮罩 -->
        <div v-if="productionStore.loading" class="loading-overlay">
          <div class="spinner"></div>
          <div class="loading-text">加载中...</div>
        </div>


    <div class="flex justify-end">
      <dv-button
        class=" text-white text-lg font-semibold tracking-wide"
        :bg="false"
        @click="openDialog('detail')"
        color="#00eaff"
      >
        详细信息
      </dv-button>
    </div>

    <!-- A类/常规客户订单准交率（移植自制造绩效看板Line4，适配紧凑布局） -->
    <div class="metrics-content">
      <div class="part-section">
        <div class="section-title">A类客户订单准交率</div>
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label">本月目标</div>
            <div class="metric-value target">{{ deliveryData.aCustomer.target }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">本月已入库工单数</div>
            <div class="metric-value">{{ deliveryData.aCustomer.stockOrders }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">本月准交工单数</div>
            <div class="metric-value">{{ deliveryData.aCustomer.onTimeOrders }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">本月准交率</div>
            <div class="metric-value" :class="getDeliveryClass(deliveryData.aCustomer.onTimeRate)">{{ deliveryData.aCustomer.onTimeRate.toFixed(1) }}%</div>
          </div>
        </div>
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label">今日计划准交数</div>
            <div class="metric-value">{{ deliveryData.aCustomer.plannedToday }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">实际准交数</div>
            <div class="metric-value">{{ deliveryData.aCustomer.actualToday }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">今日准交率</div>
            <div class="metric-value" :class="getDeliveryClass(deliveryData.aCustomer.todayRate)">{{ deliveryData.aCustomer.todayRate.toFixed(1) }}%</div>
          </div>
        </div>
      </div>

      <div class="part-section">
        <div class="section-title">常规客户订单准交率</div>
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label">本月目标</div>
            <div class="metric-value target">{{ deliveryData.regularCustomer.target }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">本月已入库工单数</div>
            <div class="metric-value">{{ deliveryData.regularCustomer.stockOrders }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">本月准交工单数</div>
            <div class="metric-value">{{ deliveryData.regularCustomer.onTimeOrders }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">本月准交率</div>
            <div class="metric-value" :class="getDeliveryClass(deliveryData.regularCustomer.onTimeRate)">{{ deliveryData.regularCustomer.onTimeRate.toFixed(1) }}%</div>
          </div>
        </div>
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label">今日计划准交数</div>
            <div class="metric-value">{{ deliveryData.regularCustomer.plannedToday }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">实际准交数</div>
            <div class="metric-value">{{ deliveryData.regularCustomer.actualToday }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">今日准交率</div>
            <div class="metric-value" :class="getDeliveryClass(deliveryData.regularCustomer.todayRate)">{{ deliveryData.regularCustomer.todayRate.toFixed(1) }}%</div>
          </div>
        </div>
      </div>

      <!-- 新增：接口 onTimePart 汇总（customer=1 常规；customer=2 A类） -->
      <div class="part-section">
        <div class="section-title relative" style="display: flex; justify-content: center; align-items: center;">
          <span style="flex:1; text-align: center;">当月散件准交率</span>
          <span style="font-size: 0.8vw; color: #8cc8ff; margin-left: 1vw; white-space: nowrap;" class="absolute right-0.5 ">点击卡片可查看详细信息</span>
        </div>
        <div class="metrics-row compact-row">
          <div class="metric-item compact" @click="openDialog('1')" style="cursor:pointer;">
            <div class="metric-label">A类客户-当月总数</div>
            <div class="metric-value value-large">{{ onTimePartData.a.total }}</div>
            <div class="metric-subtext">
              准交 {{ onTimePartData.a.zjNum }}｜<span :class="getDeliveryClass(onTimePartRates.a)">{{ onTimePartRates.a.toFixed(1) }}%</span>
            </div>
          </div>
          <div class="metric-item compact" @click="openDialog('2')" style="cursor:pointer;">
            <div class="metric-label">常规客户-当月总数</div>
            <div class="metric-value value-large">{{ onTimePartData.normal.total }}</div>
            <div class="metric-subtext">
              准交 {{ onTimePartData.normal.zjNum }}｜<span :class="getDeliveryClass(onTimePartRates.normal)">{{ onTimePartRates.normal.toFixed(1) }}%</span>
            </div>
          </div>
          <div class="metric-item compact" @click="openDialog('1')" style="cursor:pointer;">
            <div class="metric-label">A类客户-准交数</div>
            <div class="metric-value value-large">{{ onTimePartData.a.zjNum }}</div>
            <div class="metric-subtext">占比 <span :class="getDeliveryClass(onTimePartRates.a)">{{ onTimePartRates.a.toFixed(1) }}%</span></div>
          </div>
          <div class="metric-item compact" @click="openDialog('2')" style="cursor:pointer;">
            <div class="metric-label">常规客户-准交数</div>
            <div class="metric-value value-large">{{ onTimePartData.normal.zjNum }}</div>
            <div class="metric-subtext">占比 <span :class="getDeliveryClass(onTimePartRates.normal)">{{ onTimePartRates.normal.toFixed(1) }}%</span></div>
          </div>

        </div>
      </div>
    </div>

           <!-- 弹窗 -->
     <TableDialog
    v-model="dialogVisible"
    :title= dialogTitle
    width="60vw"
    :tableData="gridData"
    :columns="gridColumns"
  />
      </dv-border-box12>
    </div>


  </template>
  

  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useProductionDataStore } from '@/store/productionData'
  import TableDialog from './dialog.vue'
  import {getAbnormalUnfinishedList } from '@/api/getPmcinfo'
  import { getOnTimePart, type OnTimePartResponse } from '@/api/produceperformance'
  import { getOnTimePartDetail } from '@/api/produceperformance'

  // 生产数据 store
  const productionStore = useProductionDataStore()

  // 启动/停止自动刷新
  onMounted(() => {
    productionStore.startAutoRefresh()
  })
  onUnmounted(() => {
    productionStore.stopAutoRefresh()
  })

      // 准交率数据（A类/常规）
    const deliveryData = computed(() => ({
      aCustomer: {
        target: 95.0,
        stockOrders: productionStore.onTimeMonthlyData?.a?.total || 0,
        onTimeOrders: productionStore.onTimeMonthlyData?.a?.completeNum || 0,
        onTimeRate: productionStore.onTimeMonthlyData?.a?.total ? (productionStore.onTimeMonthlyData.a.completeNum / productionStore.onTimeMonthlyData.a.total * 100) : 0,
        plannedToday: productionStore.onTimeDailyData?.a?.total || 0,
        actualToday: productionStore.onTimeDailyData?.a?.completeNum || 0,
        todayRate: productionStore.onTimeDailyData?.a?.total ? (productionStore.onTimeDailyData.a.completeNum / productionStore.onTimeDailyData.a.total * 100) : 0,
      },
      regularCustomer: {
        target: 90.0,
        stockOrders: productionStore.onTimeMonthlyData?.normal?.total || 0,
        onTimeOrders: productionStore.onTimeMonthlyData?.normal?.completeNum || 0,
        onTimeRate: productionStore.onTimeMonthlyData?.normal?.total ? (productionStore.onTimeMonthlyData.normal.completeNum / productionStore.onTimeMonthlyData.normal.total * 100) : 0,
        plannedToday: productionStore.onTimeDailyData?.normal?.total || 0,
        actualToday: productionStore.onTimeDailyData?.normal?.completeNum || 0,
        todayRate: productionStore.onTimeDailyData?.normal?.total ? (productionStore.onTimeDailyData.normal.completeNum / productionStore.onTimeDailyData.normal.total * 100) : 0,
      },
    }))

  const getDeliveryClass = (value: number) => {
    if (value >= 95) return 'delivery-excellent'
    if (value >= 90) return 'delivery-good'
    if (value >= 85) return 'delivery-normal'
    return 'delivery-warning'
  }

  // 新增：接口 onTimePart 数据
  const onTimePartData = ref<{ normal: { total: number; zjNum: number }; a: { total: number; zjNum: number } }>({
    normal: { total: 0, zjNum: 0 },
    a: { total: 0, zjNum: 0 }
  })

  const onTimePartRates = computed(() => ({
    normal: onTimePartData.value.normal.total ? (onTimePartData.value.normal.zjNum / onTimePartData.value.normal.total * 100) : 0,
    a: onTimePartData.value.a.total ? (onTimePartData.value.a.zjNum / onTimePartData.value.a.total * 100) : 0
  }))

  const fetchOnTimePart = async () => {
    try {
      const [normalRes, aRes] = await Promise.all([
        getOnTimePart('2') as Promise<OnTimePartResponse>,
        getOnTimePart('1') as Promise<OnTimePartResponse>
      ])
      onTimePartData.value.normal.total = normalRes.data?.total ?? 0
      onTimePartData.value.normal.zjNum = normalRes.data?.zjNum ?? 0
      onTimePartData.value.a.total = aRes.data?.total ?? 0
      onTimePartData.value.a.zjNum = aRes.data?.zjNum ?? 0
    } catch (e) {
      // 静默失败，避免打断页面
      console.error('获取 onTimePart 失败', e)
    }
  }

  // 初次加载
  fetchOnTimePart()

  // 弹窗与表格（沿用原有）
  const dialogVisible = ref(false)
  const dialogTitle = ref('订单准交率')
  const gridData = ref<any[]>([])
  // 准交率详细数据的列定义
  const onTimeColumns = [
    { prop: 'doc_no', label: '采购单号', width: '260' },
    { prop: 'customer_order_no', label: '客户单号', width: '260' },
    { prop: 'plan_delivery_date', label: '预到货数量', width: '260' },
    { prop: 'business_qty', label: '业务总数量', width: '260' },
    { prop: 'transaction_date2', label: '调拨单最大交易日期', width: '260' },
    { prop: 'business_qty2', label: '调拨单业务总数量', width: '260' },
  ]

  // 日期格式化函数
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return ''
    // 将 2025-09-08 00:00:00.0000000 格式化为 2025-09-08 00:00:00
    return dateStr.split('.')[0]
  }

  // 工单异常数据的列定义
  const abnormalColumns = [
    { prop: 'docNo', label: '工单单号', width: '220' },
    { prop: 'customerOrderNo', label: '客户单号', width: '250' },
    { prop: 'item_code', label: '品号', width: '250' },
    { prop: 'planDate', label: '计划完成日期', width: '500', formatter: formatDateTime },
    { prop: 'completeDate', label: '实际完成日期', width: '300', formatter: formatDateTime },
  ]

  // 当前使用的列定义
  const gridColumns = ref(onTimeColumns)

  const openDialog = (customerType: string) => {
    dialogVisible.value = true
    if (customerType === '1' || customerType === '2') {
      // 点击卡片时调用 getOnTimePartDetail
      dialogTitle.value = customerType === '2' ? '常规客户准交率详情' : 'A类客户准交率详情'
      gridColumns.value = onTimeColumns
      getOnTimePartDetail(customerType).then((res: any) => {
        gridData.value = Array.isArray(res.data) ? res.data : []
      })
    } else {
      // 详细按钮调用 getAbnormalUnfinishedList
      dialogTitle.value = '工单异常详情'
      gridColumns.value = abnormalColumns
      getAbnormalUnfinishedList().then((res: any) => {
        gridData.value = Array.isArray(res.data) ? res.data : []
      })
    }
  }
  </script>
  
  <style scoped>
  .left {
    position: relative;
  }
  .day-title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    text-align: center;
    font-size: 1vw;
    font-weight: bold;
    color: #fff;
    letter-spacing: 0.3vw;
    text-shadow: 0 0.3vh 1vw #000, 0 0 0.2vw #00bfff;
    border-bottom: 0.4vh solid #00bfff;
    padding:0.5vh 0  0vh 0;
  }
  /* 准交率指标样式 */
  .metrics-content {
    display: flex;
    flex-direction: column;
    gap: 0.5vh;
    padding: 0.5vh 1vw;
  }
  .part-section {
    background: rgba(0,32,64,0.25);
    border: 1px solid rgba(0,191,255,0.3);
    border-radius: 0.6vw;
    padding: 0.6vh 0.8vw;
    display: flex;
    flex-direction: column;
    gap: 0.6vh;
  }
  .section-title {
    font-size: 0.9vw;
    font-weight: bold;
    color: #00d4ff;
    text-align: center;
    border-bottom: 1px solid rgba(0,191,255,0.3);
    padding-bottom: 0.4vh;
  }
  .metrics-row {
    display: flex;
    gap: 0.5vw;
  }
  .metric-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.6vh 0.4vw;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0.4vw;
    border-left: 0.2vw solid #00d4ff;
  }
  .metric-label {
    font-size: 0.7vw;
    color: #8cc8ff;
    margin-bottom: 0.2vh;
    text-align: center;
    line-height: 1.2;
  }
  .metric-value {
    font-size: 0.9vw;
    font-weight: bold;
    color: #fff;
    text-align: center;
    line-height: 1.1;
  }
  .metric-value.target {
    color: #00d4ff;
  }
  .delivery-excellent { color: #00ff88; }
  .delivery-good { color: #00d4ff; }
  .delivery-normal { color: #ffffff; }
  .delivery-warning { color: #ff4444; }
  
  /* 加载遮罩与指示器 */
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9;
  }
  .spinner {
    width: 3.2vw;
    height: 3.2vw;
    border: 0.35vw solid rgba(0, 191, 255, 0.25);
    border-top-color: #00eaff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    box-shadow: 0 0 1vw rgba(0, 191, 255, 0.3);
  }
  .loading-text {
    margin-top: 1vh;
    color: #00eaff;
    font-size: 0.9vw;
    letter-spacing: 0.1vw;
    text-shadow: 0 0.3vh 0.8vh #003366;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .desc2 {
    font-size: 0.8vw;
    color: #00eaff;
    text-align: left;
    margin:0.5vh 0 0.5vh 2vw;
    font-weight: bold;
    letter-spacing: 0.1vw;
  }
  .bar-chart {
    width: 96%;
    height: 35%;
    background: rgba(0,32,64,0.25);
    border-radius: 1vw;
    box-shadow: 0 0 2vw #003366 inset;
  }
  .rate-row {
    text-align: left;
    font-size: 1vw;
    color: #00eaff;
    margin: 1vh 0 1vh 2vw;
    font-weight: bold;
    text-shadow: 0 0 1vw #003366;
    letter-spacing: 0.1vw;
  }

  /* 紧凑视图样式 */
  .compact-row { gap: 0.4vw; }
  .metric-item.compact { padding: 0.4vh 0.3vw; }
  .value-large { font-size: 1.2vw; }
  .metric-subtext { font-size: 0.65vw; color: #8cc8ff; margin-top: 0.2vh; }
  
  </style>