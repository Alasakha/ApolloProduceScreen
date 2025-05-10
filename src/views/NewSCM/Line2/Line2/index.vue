

<template>
    <dv-border-box8 :dur="5">
      <GlobalTitle title="当日来料质量异常问题统计"/>
        <dv-scroll-board  class="pt-6 pb-1"
        :config="config" style="width: 94%; height:82%;  margin-left: 1vw;" @mouseover="mouseoverHandler" @click="clickHandler" />
    
      </dv-border-box8>
    </template>
    
    <script lang="ts" setup>
    import {  reactive, onMounted } from 'vue'
    import { getAbnormalQualityToday } from '@/api/getnewInjection'
    
    const getYesterday = () => {
      const date = new Date();
      date.setDate(date.getDate());
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };
    
    const queryDate = getYesterday(); // 昨天的日期
    // 表格配置
    const config = reactive({
      header: ['采购内勤', '供应商', '检验日期', '问题点', '处理完成时间',  '处理结果', '处理时长'],
      data: [],
      index: true,
      columnWidth: [50, 150, 150, 150, 150,150,150,150],
      align: ['center'],
      rowNum: 7
    })
    
    function formatDate(dateStr?: string): string {
      if (!dateStr) return '--'
      const date = new Date(dateStr)
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${month}月${day}日`
    }
    
    function getResultLabel(item: any): string {
      if (parseFloat(item.accepted_business_qty) > 0) return '允收'
      if (parseFloat(item.sp_receipt_business_qty) > 0) return '特采'
      if (parseFloat(item.scrap_business_qty) > 0) return '报废'
      if (parseFloat(item.return_business_qty) > 0) return '拒收'
      return '--'
    }
    
    // 获取接口数据并处理
    onMounted(async () => {
      try {
        const res = await getAbnormalQualityToday(queryDate)
        const rawData = res?.data || []
    
        config.data = rawData.map(item => [
      item.purchaserName || '--',
      (item.supplierName || '').trim(),
      formatDate(item.startTime),
      item.description || '--',
      formatDate(item.endTime),
      getResultLabel(item),
      item.hourNum ? `${item.hourNum} 小时` : '--'
    ])
      } catch (error) {
        console.error('获取异常数据失败', error)
      }
    })
    
    const mouseoverHandler = (e: any) => {
      console.log(e)
    }
    
    const clickHandler = (e: any) => {
      console.log(e)
    }
    </script>