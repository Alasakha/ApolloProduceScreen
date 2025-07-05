<template>
  

      <div class="wrapper flex flex-col h-full">
        <div class="title-container">
          <h2>工单异常</h2>
          <el-button 
            type="primary" 
            size="small" 
            @click="handleDetail"
            class="action-btn"
          >
            查看详情
          </el-button>
        </div>
            
       <!-- 如果没有数据，显示暂无数据 -->
       <div v-if="!isLoading && isDataEmpty" class="empty-container">
         暂无数据
       </div>
       
       <!-- 数据加载完成且非空时显示图表 -->
        <div class="tablebox w-full h-[90%]">
           <!-- 如果正在加载，显示 loading -->
         <dv-loading v-if="isLoading" class="text-white">Loading...</dv-loading>
  
          <ScrollBoard v-if="!isLoading && !isDataEmpty" :config="config" @click="clickHandler" />
        </div>
      </div>

  
    <!-- 弹窗部分 -->
  <el-dialog v-model="dialogVisible" title="详细信息" width="50%">
    <div v-for="(label, index) in config.header" :key="index" class="mb-2" :z-index="99999999">
      <strong>{{ label }}：</strong>{{ selectedItem[index+1] }}
    </div>
  </el-dialog>

  <!-- 添加详情表格组件 -->
  <DetailTable
    v-model="detailDialogVisible"
    title="工单异常详情"
    :headers="tableHeaders"
    :data="tableData"
    :loading="tableLoading"
    @update:reason="handleReasonUpdate"
  />
  </template>
  
  <script setup>
  import { ref, onMounted, watch, nextTick ,onBeforeUnmount,reactive} from 'vue';
  import ScrollBoard from '@/components/datav/ScrollBoard.vue'
  import DetailTable from '@/components/totalScreen/DetailTable/index.vue'
  import * as echarts from 'echarts';
  import { fetchClosingRateData } from './fetchMesData';
  import { useRoute } from 'vue-router';
  import { eventBus } from '@/utils/eventbus';
  import { ElMessage } from 'element-plus';
  import { getAbnormalUnfinishedAdd } from '@/api/getProduceinfo.js';
  
  const dialogVisible = ref(false);//弹窗控制
  const detailDialogVisible = ref(false);
  const selectedItem = ref({});
  const route = useRoute();
  const prodLine = route.query.prodLine;
  const monthlyIndicators = ref(null);
  const isLoading = ref(true);
  const isDataEmpty = ref(false);
  const tableLoading = ref(false);
  const rawData = ref([]); // 保存原始数据
  const tableData = ref([]);
  const categories = ref([]); // X 轴数据
  const values = ref([]); // Y 轴数据
  let chartInstance = null;
  const scrollBoardRef = ref(null);

  // 扩展表头，添加原因、责任人和完成期限
  const tableHeaders = ['状态', '客户单号', '工单号', '车型名称', '工单数量', '应完成时间', '欠数', '处理时长', '原因', '责任人', '完成期限'];

  const config = reactive({
    header: ['状态', '客户单号', '工单号', '车型名称', '工单数量', '应完成时间', '欠数', '处理时长', '原因', '责任人', '完成期限'],
    data: [
      ['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']
    ],
    index: true,
    columnWidth: [50, 50],
    align: [],
    rowNum: 6,
    showTooltip: true,
  })


  const fetchData = () => {
    isLoading.value = true; // 设置加载状态
    fetchClosingRateData(prodLine)
      .then((res) => {
        console.log('获取到的原始数据:', res);
        if (res && res.length > 0) {
          rawData.value = res; // 保存原始数据
          config.data = res.map(item => [
            '未完工',
            item.number ?? '无',
            item.workNo ?? '无',
            item.specifications ?? '无',
            Number(item.productionQuantity) ?? '无',
            item.dateTime ?? '无',
            Number(item.productionQuantity) - Number(item.inboundQuantity),
            item.daysBetween + '天' ?? '无',
            item.reason ?? '无',
            item.duty ?? '无',
            item.completeDate ?? '无'
          ]);
          isDataEmpty.value = false;
        } else {
          isDataEmpty.value = true;
          console.log('没有获取到数据');
        }
      })
      .catch((error) => {
        console.error('获取数据失败:', error);
        isDataEmpty.value = true;
        ElMessage.error('获取数据失败，请稍后重试');
      })
      .finally(() => {
        isLoading.value = false;
      });
  };
  
  // 在组件挂载时启动定时获取数据
  onMounted(() => {
    console.log('组件挂载，开始获取数据');
    fetchData();
    eventBus.on("refreshData", fetchData); // 监听全局刷新事件
  });
  
    // 清理定时器，避免组件卸载后定时器继续执行
    onBeforeUnmount(() => {
      eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
    });
  
  
    const clickHandler = (row) => {
    selectedItem.value = row.row; // 直接保存整行
    dialogVisible.value = true;
  };

  // 处理详情按钮点击
  const handleDetail = () => {
    if (isLoading.value) {
      ElMessage.warning('数据加载中，请稍后再试');
      return;
    }
    
    console.log('处理详情按钮点击');
    console.log('当前config.data:', config.data);
    
    tableLoading.value = true;
    try {
      // 确保数据不为空且格式正确
      if (!Array.isArray(config.data) || config.data.length === 0) {
        throw new Error('数据格式错误或为空');
      }

      // 转换数据格式
      tableData.value = config.data.map((row) => {
        if (!Array.isArray(row)) {
          console.error('行数据格式错误:', row);
          return null;
        }

        const rowData = {};
        config.header.forEach((header, index) => {
          rowData[header] = row[index] || '无';
        });
        return rowData;
      }).filter(Boolean); // 过滤掉null值

      if (tableData.value.length === 0) {
        throw new Error('转换后的数据为空');
      }

      console.log('转换后的表格数据:', tableData.value);
      detailDialogVisible.value = true;
    } catch (error) {
      console.error('处理数据失败:', error);
      ElMessage.error('处理数据失败，请刷新后重试');
    } finally {
      tableLoading.value = false;
    }
  };

  // 处理原因更新
  const handleReasonUpdate = async ({ row, reason, duty, completeDate }) => {
    try {
      console.log('传入的行数据:', row);
      console.log('原始数据数组:', rawData.value);

      // 检查数据结构
      if (!row || !rawData.value || !Array.isArray(rawData.value)) {
        console.error('数据结构错误:', { row, rawData: rawData.value });
        ElMessage.error('数据结构错误，请刷新页面重试');
        return;
      }

      // 打印所有可用的匹配字段
      console.log('待匹配的工单号:', row['工单号']);
      console.log('待匹配的客户单号:', row['客户单号']);
      console.log('可用的工单号列表:', rawData.value.map(item => ({
        workNo: item.workNo,
        number: item.number,
        articleNumber: item.articleNumber
      })));

      // 修改查找逻辑，使用更多字段匹配
      const origin = rawData.value.find(item => {
        // 转换为字符串进行比较
        const rowWorkNo = String(row['工单号'] || '').trim();
        const rowCustomerNo = String(row['客户单号'] || '').trim();
        const itemWorkNo = String(item.workNo || '').trim();
        const itemNumber = String(item.number || '').trim();
        
        return (
          (rowWorkNo && (itemWorkNo === rowWorkNo || itemNumber === rowWorkNo)) ||
          (rowCustomerNo && (itemWorkNo === rowCustomerNo || itemNumber === rowCustomerNo))
        );
      });

      if (!origin) {
        console.error('匹配失败，详细信息:', {
          rowData: {
            workNo: row['工单号'],
            customerNo: row['客户单号']
          },
          availableData: rawData.value.map(item => ({
            workNo: item.workNo,
            number: item.number
          }))
        });
        ElMessage.error('数据匹配失败，请检查工单号是否正确');
        return;
      }

      // 组装参数前先检查必要字段
      if (!origin.workCenter && !prodLine) {
        console.error('缺少必要参数 prodLine:', { origin, prodLine });
        ElMessage.error('缺少生产线信息，请检查数据完整性');
        return;
      }

      // 组装参数
      const params = {
        prodLine: origin.workCenter || prodLine,
        doc_no: origin.workNo || origin.number,
        item_code: origin.articleNumber,
        pc_date: origin.dateTime,
        reason,
        duty,
        completeDate
      };

      // 检查参数完整性
      const requiredFields = ['prodLine', 'doc_no', 'item_code', 'pc_date', 'reason', 'duty', 'completeDate'];
      const missingFields = requiredFields.filter(field => !params[field]);
      
      if (missingFields.length > 0) {
        console.error('缺少必要参数:', { missingFields, params });
        ElMessage.error(`缺少必要参数: ${missingFields.join(', ')}`);
        return;
      }

      console.log('准备发送的参数:', params);

      // 调用API
      const res = await getAbnormalUnfinishedAdd(
        params.prodLine,
        params.doc_no,
        params.item_code,
        params.pc_date,
        params.reason,
        params.duty,
        params.completeDate
      );

      if (res && (res.code === 200 || res.status === 200)) {
        ElMessage.success('保存成功');
        
        // 更新本地数据
        const index = config.data.findIndex(item => {
          const itemWorkNo = String(item[2] || '').trim();
          const itemCustomerNo = String(item[1] || '').trim();
          const targetWorkNo = String(row['工单号'] || '').trim();
          const targetCustomerNo = String(row['客户单号'] || '').trim();
          
          return (
            itemWorkNo === targetWorkNo ||
            itemWorkNo === targetCustomerNo ||
            itemCustomerNo === targetWorkNo ||
            itemCustomerNo === targetCustomerNo
          );
        });
        
        if (index !== -1) {
          config.data[index][8] = reason;
          config.data[index][9] = duty;
          config.data[index][10] = completeDate;
          
          // 更新表格数据
          const tableIndex = tableData.value.findIndex(item => {
            const itemWorkNo = String(item['工单号'] || '').trim();
            const itemCustomerNo = String(item['客户单号'] || '').trim();
            const targetWorkNo = String(row['工单号'] || '').trim();
            const targetCustomerNo = String(row['客户单号'] || '').trim();
            
            return (
              itemWorkNo === targetWorkNo ||
              itemWorkNo === targetCustomerNo ||
              itemCustomerNo === targetWorkNo ||
              itemCustomerNo === targetCustomerNo
            );
          });

          if (tableIndex !== -1) {
            tableData.value[tableIndex]['原因'] = reason;
            tableData.value[tableIndex]['责任人'] = duty;
            tableData.value[tableIndex]['完成期限'] = completeDate;
          }
        }
        
        // 刷新数据
        fetchData();
      } else {
        console.error('API响应错误:', res);
        ElMessage.error(res?.message || '保存失败，请重试');
      }
    } catch (error) {
      console.error('处理异常:', error);
      ElMessage.error('操作失败: ' + (error.message || '未知错误'));
    }
  };
  </script>
  
  
  <style scoped>
  .wrapper {
    height: 100%;
    padding: 10px;
  }

  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .action-btn {
    margin-left: auto;
  }

  .box1 {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: aliceblue;
    padding: 20px;
  }
  
  h2 {
    top: 0.5vh;
    left: 1vw;
    margin: 0;
    font-size: 1vw;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .detail-table {
    max-height: 60vh;
    overflow-y: auto;
  }
  
  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    padding: 10px;
  }
  
  :deep(.el-table) {
    background-color: transparent;
    color: #333;
  }
  
  :deep(.el-table th) {
    background-color: #0d47a1;
  }
  
  :deep(.el-table tr) {
    background-color: #fff;
  }
  
  :deep(.el-pagination) {
    margin-right: 20px;
  }
  
  :deep(.el-loading-mask) {
    background-color: rgba(255, 255, 255, 0.7);
  }
  
  :deep(.custom-dialog) {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 90vh;
  }
  </style>
   