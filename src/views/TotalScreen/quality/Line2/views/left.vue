
        <template>
        <dv-border-box10>
        <GlobalTitle title="来料检验及时率"/>
        
            <!-- 图表容器 -->
            <div class="chartsbox w-full h-[90%]">
                <div ref="chartRef" class="w-full h-[100%]"></div>
            </div>
            
            <!-- 功能按钮 -->
            <div class="absolute top-2 right-2 flex gap-2">
                <el-button @click="exportToExcel" size="small" type="success" :icon="Download">
                    导出Excel
                </el-button>
                <!-- <el-button @click="testDialog" size="small" type="primary">测试弹窗</el-button> -->
            </div>
            
        </dv-border-box10>
        
        <!-- 详情弹窗 -->
        <el-dialog
            v-model="dialogVisible"
            :title="`${selectedUserName} - 来料检验详情`"
            width="80%"
            top="10vh"
            :before-close="handleClose"
            class="custom-dialog"
        >
            <div class="dialog-content">
                <!-- 筛选和导出区域 -->
                <div class="dialog-toolbar mb-4 flex justify-between items-center">
                    <div class="filter-area flex gap-4 items-center">
                        <el-select
                            v-model="filterForm.inspector"
                            placeholder="选择检验员"
                            clearable
                            style="width: 150px"
                            @change="handleFilter"
                        >
                            <el-option
                                v-for="option in inspectorOptions"
                                :key="option.value"
                                :label="option.label"
                                :value="option.value"
                            />
                        </el-select>
                        <el-date-picker
                            v-model="filterForm.arrivalDateRange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD"
                            style="width: 240px"
                            @change="handleFilter"
                        />
                        <el-select
                            v-model="filterForm.supplier"
                            placeholder="选择供应商"
                            clearable
                            style="width: 200px"
                            @change="handleFilter"
                        >
                            <el-option
                                v-for="option in supplierOptions"
                                :key="option.value"
                                :label="option.label"
                                :value="option.value"
                            />
                        </el-select>
                        <el-button @click="resetFilter" size="small" type="info" plain>
                            重置
                        </el-button>
                    </div>
                    <div class="export-area">
                        <el-button @click="exportDialogToExcel" size="small" type="success" :icon="Download">
                            导出Excel
                        </el-button>
                    </div>
                </div>
                
                <el-table
                    :data="paginatedData"
                    style="width: 100%"
                    :loading="detailLoading"
                    stripe
                    border
                    height="400"
                    :row-key="(_, index) => index"
                >
                    <el-table-column type="index" label="序号" width="80" />
                    <el-table-column prop="doc_no" label="到货单号" />
                    <el-table-column prop="supplier_full_name" label="供应商" />
                    <el-table-column prop="itemDescription" label="品名" />
                    <el-table-column prop="item_code" label="品号" />
                    <el-table-column prop="arriveNum" label="到货数" />
                    <el-table-column prop="arrivalTime" label="到货单审核时间" />
                    <el-table-column prop="checkTime" label="检验完成时间" />
                    <el-table-column prop="user_name" label="检验员" />        
                </el-table>
                
                <!-- 分页组件 -->
                <div class="pagination-container mt-4 flex justify-center">
                    <el-pagination
                        v-model:current-page="currentPage"
                        v-model:page-size="pageSize"
                        :page-sizes="[10, 20, 50, 100]"
                        :total="totalCount"
                        layout="total, sizes, prev, pager, next, jumper"
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    />
                </div>
            </div>
        </el-dialog>
        </template>
        
        
        <script setup lang="ts">
        import GlobalTitle from '@/components/title.vue'
        import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
        import { getIncomingInspection, getIncomingInspectionDetail } from '@/api/getQuiltyinfo'
        import { useRoute } from 'vue-router'
        import { eventBus } from '@/utils/eventbus'
        import { formatPieChartData } from '@/utils/map'
        import { createChartOption } from './charts'
        import { useEcharts } from '@/utils/useEcharts'
        import * as XLSX from 'xlsx'
        import { ElMessage } from 'element-plus'
        import { Download } from '@element-plus/icons-vue'
        
        const chartRef = ref(null)
        const route = useRoute()
        const prodLine = route.query.prodLine as string || ''
        const isLoading = ref(true)
        const isDataEmpty = ref(false)
        const rawData = ref([])
        
        // 弹窗相关状态
        const dialogVisible = ref(false)
        const selectedUserName = ref('')
        const detailData = ref([])
        const filteredDetailData = ref([])
        const detailLoading = ref(false)
        
        // 分页相关状态
        const currentPage = ref(1)
        const pageSize = ref(20)
        const totalCount = ref(0)
        const paginatedData = ref([])
        
        // 筛选表单
        const filterForm = ref({
            inspector: '', // 检验员
            arrivalDateRange: [], // 到货日期范围
            supplier: '' // 供应商
        })
        
        // 检验员选项
        const inspectorOptions = ref([])
        
        // 供应商选项
        const supplierOptions = ref([])
        
        const { initChart, setOption, resizeChart, onClick, offClick } = useEcharts(chartRef)
        
        const processData = (data: any[]) => {
        const formattedData = formatPieChartData(data, 'user_name', 'rate')
        console.log(formattedData)
        rawData.value = formattedData
        isDataEmpty.value = formattedData.length === 0
        }
        
        watch(rawData, () => {
            nextTick(() => {
                initChart()
                const option = createChartOption(rawData.value)
                setOption(option)
                resizeChart() // 关键点：初始化后立即触发一次 resize
                
                // 添加图表点击事件
                offClick(handleChartClick) // 先移除之前的监听器
                onClick(handleChartClick)  // 添加新的监听器
            })
        }, { deep: true, immediate: true })

            
        const fetchData = () => {
        getIncomingInspection(prodLine)
            .then(res => {
            isLoading.value = false
            processData(res.data)
            })
            .catch(() => {
            isLoading.value = false
            isDataEmpty.value = true
            })
        }
        
        onMounted(() => {
        fetchData()
        eventBus.on('refreshData', fetchData)
        })
        
        // 图表点击事件处理
        const handleChartClick = (params: any) => {
            console.log('点击的柱状图数据:', params)
            console.log('弹窗状态:', dialogVisible.value)
            if (params && params.name) {
                selectedUserName.value = params.name
                dialogVisible.value = true
                console.log('设置弹窗可见，用户名:', params.name)
                fetchDetailData(params.name)
            } else {
                console.warn('点击事件参数无效:', params)
            }
        }
        
        // 获取详情数据
        const fetchDetailData = (userName: string) => {
            detailLoading.value = true
            getIncomingInspectionDetail(userName)
                .then(res => {
                    detailData.value = res.data || []
                    filteredDetailData.value = res.data || []
                    
                    // 生成检验员选项
                    const inspectors = [...new Set(detailData.value.map(item => item.user_name).filter(Boolean))]
                    inspectorOptions.value = inspectors.map(name => ({
                        label: name,
                        value: name
                    }))
                    
                    // 生成供应商选项
                    const suppliers = [...new Set(detailData.value.map(item => item.supplier_full_name).filter(Boolean))]
                    supplierOptions.value = suppliers.map(name => ({
                        label: name,
                        value: name
                    }))
                    
                    // 初始化分页
                    currentPage.value = 1
                    updatePagination()
                    
                    detailLoading.value = false
                })
                .catch(() => {
                    detailData.value = []
                    filteredDetailData.value = []
                    inspectorOptions.value = []
                    supplierOptions.value = []
                    // 重置分页
                    currentPage.value = 1
                    updatePagination()
                    detailLoading.value = false
                })
        }
        
        // 关闭弹窗
        const handleClose = () => {
            dialogVisible.value = false
            selectedUserName.value = ''
            detailData.value = []
            filteredDetailData.value = []
            filterForm.value.inspector = ''
            filterForm.value.arrivalDateRange = []
            filterForm.value.supplier = ''
            inspectorOptions.value = []
            supplierOptions.value = []
            // 重置分页状态
            currentPage.value = 1
            pageSize.value = 20
            totalCount.value = 0
            paginatedData.value = []
        }
        
        // 测试弹窗功能
        const testDialog = () => {
            console.log('测试弹窗按钮被点击')
            selectedUserName.value = '测试用户'
            dialogVisible.value = true
            const testData = [
                {
                    user_name: '测试用户',
                    jsNum: 10,
                    bjsNum: 2,
                    rate: 83.33,
                    itemDescription: '测试物料',
                    item_specification: '规格A',
                    arriveNum: 100,
                    checkTime: '2024-01-01 10:00:00',
                    arrivalTime: '2024-01-01 09:00:00',
                    doc_no: 'DOC001',
                    item_code: 'ITEM001',
                    supplier_full_name: '测试供应商'
                }
            ]
            detailData.value = testData
            filteredDetailData.value = testData
            
            // 生成测试选项数据
            inspectorOptions.value = [
                { label: '测试用户', value: '测试用户' }
            ]
            supplierOptions.value = [
                { label: '测试供应商', value: '测试供应商' }
            ]
        }
        
        // 筛选功能
        const handleFilter = () => {
            if (!filterForm.value.inspector && !filterForm.value.arrivalDateRange?.length && !filterForm.value.supplier) {
                filteredDetailData.value = detailData.value
            } else {
                filteredDetailData.value = detailData.value.filter(item => {
                    // 检验员筛选
                    const inspectorMatch = !filterForm.value.inspector || 
                        (item.user_name && item.user_name === filterForm.value.inspector)
                    
                    // 到货日期筛选
                    let arrivalDateMatch = true
                    if (filterForm.value.arrivalDateRange?.length === 2) {
                        const [startDate, endDate] = filterForm.value.arrivalDateRange
                        if (item.arrivalTime) {
                            const itemDate = item.arrivalTime.split(' ')[0] // 提取日期部分
                            arrivalDateMatch = itemDate >= startDate && itemDate <= endDate
                        } else {
                            arrivalDateMatch = false
                        }
                    }
                    
                    // 供应商筛选
                    const supplierMatch = !filterForm.value.supplier || 
                        (item.supplier_full_name && item.supplier_full_name === filterForm.value.supplier)
                    
                    return inspectorMatch && arrivalDateMatch && supplierMatch
                })
            }
            
            // 重置到第一页并更新分页
            currentPage.value = 1
            updatePagination()
        }
        
        // 重置筛选
        const resetFilter = () => {
            filterForm.value.inspector = ''
            filterForm.value.arrivalDateRange = []
            filterForm.value.supplier = ''
            filteredDetailData.value = detailData.value
            updatePagination()
        }
        
        // 分页处理函数
        const updatePagination = () => {
            totalCount.value = filteredDetailData.value.length
            const start = (currentPage.value - 1) * pageSize.value
            const end = start + pageSize.value
            paginatedData.value = filteredDetailData.value.slice(start, end)
        }
        
        // 分页大小改变
        const handleSizeChange = (val: number) => {
            pageSize.value = val
            currentPage.value = 1
            updatePagination()
        }
        
        // 当前页改变
        const handleCurrentChange = (val: number) => {
            currentPage.value = val
            updatePagination()
        }
        
        // 弹窗Excel导出功能
        const exportDialogToExcel = () => {
            try {
                if (filteredDetailData.value.length === 0) {
                    ElMessage.warning('暂无数据可导出')
                    return
                }
                
                // 准备Excel数据
                const excelData = filteredDetailData.value.map((item, index) => ({
                    '序号': index + 1,
                    '到货单号': item.doc_no || '',
                    '供应商': item.supplier_full_name || '',
                    '品名': item.itemDescription || '',
                    '品号': item.item_code || '',
                    '到货数': item.arriveNum || 0,
                    '到货单审核时间': item.arrivalTime || '',
                    '检验完成时间': item.checkTime || '',
                    '检验员': item.user_name || '',
                    '及时数': item.jsNum || 0,
                    '不及时数': item.bjsNum || 0,
                    '及时率(%)': item.rate || 0
                }))
                
                // 创建工作簿
                const wb = XLSX.utils.book_new()
                const ws = XLSX.utils.json_to_sheet(excelData)
                
                // 设置列宽
                const colWidths = [
                    { wch: 8 },   // 序号
                    { wch: 15 },  // 到货单号
                    { wch: 20 },  // 供应商
                    { wch: 15 },  // 品名
                    { wch: 15 },  // 品号
                    { wch: 10 },  // 到货数
                    { wch: 20 },  // 到货单审核时间
                    { wch: 20 },  // 检验完成时间
                    { wch: 12 },  // 检验员
                    { wch: 10 },  // 及时数
                    { wch: 12 },  // 不及时数
                    { wch: 12 }   // 及时率
                ]
                ws['!cols'] = colWidths
                
                // 添加工作表到工作簿
                const sheetName = filterForm.value.inspector || filterForm.value.arrivalDateRange?.length || filterForm.value.supplier 
                    ? `${selectedUserName.value}_筛选结果` 
                    : `${selectedUserName.value}_详情`
                XLSX.utils.book_append_sheet(wb, ws, sheetName)
                
                // 生成文件名
                const now = new Date()
                const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
                const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '')
                const fileName = `${selectedUserName.value}_来料检验详情_${dateStr}_${timeStr}.xlsx`
                
                // 导出文件
                XLSX.writeFile(wb, fileName)
                
                ElMessage.success(`Excel文件已导出: ${fileName}`)
                
            } catch (error) {
                console.error('导出Excel失败:', error)
                ElMessage.error('导出Excel失败，请重试')
            }
        }
        
        // 导出Excel功能
        const exportToExcel = async () => {
            try {
                // 获取所有用户的详情数据
                const allDetailData = []
                
                // 遍历所有用户数据，获取每个用户的详情
                for (const userData of rawData.value) {
                    try {
                        const res = await getIncomingInspectionDetail(userData.name)
                        if (res.data && res.data.length > 0) {
                            allDetailData.push(...res.data)
                        }
                    } catch (error) {
                        console.warn(`获取用户 ${userData.name} 的详情数据失败:`, error)
                    }
                }
                
                if (allDetailData.length === 0) {
                    ElMessage.warning('暂无数据可导出')
                    return
                }
                
                // 准备Excel数据
                const excelData = allDetailData.map((item, index) => ({
                    '序号': index + 1,
                    '到货单号': item.doc_no || '',
                    '供应商': item.supplier_full_name || '',
                    '品名': item.itemDescription || '',
                    '品号': item.item_code || '',
                    '到货数': item.arriveNum || 0,
                    '到货单审核时间': item.arrivalTime || '',
                    '检验完成时间': item.checkTime || '',
                    '检验员': item.user_name || '',
                    '及时数': item.jsNum || 0,
                    '不及时数': item.bjsNum || 0,
                    '及时率(%)': item.rate || 0
                }))
                
                // 创建工作簿
                const wb = XLSX.utils.book_new()
                const ws = XLSX.utils.json_to_sheet(excelData)
                
                // 设置列宽
                const colWidths = [
                    { wch: 8 },   // 序号
                    { wch: 15 },  // 到货单号
                    { wch: 20 },  // 供应商
                    { wch: 15 },  // 品名
                    { wch: 15 },  // 品号
                    { wch: 10 },  // 到货数
                    { wch: 20 },  // 到货单审核时间
                    { wch: 20 },  // 检验完成时间
                    { wch: 12 },  // 检验员
                    { wch: 10 },  // 及时数
                    { wch: 12 },  // 不及时数
                    { wch: 12 }   // 及时率
                ]
                ws['!cols'] = colWidths
                
                // 添加工作表到工作簿
                XLSX.utils.book_append_sheet(wb, ws, '来料检验详情')
                
                // 生成文件名
                const now = new Date()
                const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
                const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '')
                const fileName = `来料检验详情_${dateStr}_${timeStr}.xlsx`
                
                // 导出文件
                XLSX.writeFile(wb, fileName)
                
                ElMessage.success(`Excel文件已导出: ${fileName}`)
                
            } catch (error) {
                console.error('导出Excel失败:', error)
                ElMessage.error('导出Excel失败，请重试')
            }
        }
        
        onBeforeUnmount(() => {
        eventBus.off('refreshData', fetchData)
        })
        </script>
        
        
        
        
        <style scoped>
        .custom-dialog {
            :deep(.el-dialog) {
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                border: 1px solid #4a90e2;
                border-radius: 8px;
            }
            
            :deep(.el-dialog__header) {
                background: rgba(74, 144, 226, 0.1);
                border-bottom: 1px solid #4a90e2;
                padding: 15px 20px;
            }
            
            :deep(.el-dialog__title) {
                color: #fff;
                font-size: 16px;
                font-weight: 600;
            }
            
            :deep(.el-dialog__body) {
                padding: 20px;
                background: rgba(0, 0, 0, 0.2);
            }
        }
        
        .dialog-content {
            :deep(.el-table) {
                background: transparent;
                color: #fff;
            }
            
            :deep(.el-table__header) {
                background: rgba(74, 144, 226, 0.2);
            }
            
            :deep(.el-table th) {
                background: rgba(74, 144, 226, 0.3);
                color: #fff;
                border-color: #4a90e2;
                font-weight: 600;
            }
            
            :deep(.el-table td) {
                background: rgba(255, 255, 255, 0.05);
                color: #fff;
                border-color: #4a90e2;
            }
            
            :deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
                background: rgba(74, 144, 226, 0.1);
            }
            
            :deep(.el-table__body tr:hover > td) {
                background: rgba(74, 144, 226, 0.2) !important;
            }
            
            :deep(.el-table__empty-block) {
                background: transparent;
                color: #fff;
            }
        }
        
        .pagination-container {
            :deep(.el-pagination) {
                color: #fff;
            }
            
            :deep(.el-pagination__total) {
                color: #fff;
            }
            
            :deep(.el-pagination__sizes) {
                color: #fff;
            }
            
            :deep(.el-pagination__jump) {
                color: #fff;
            }
            
            :deep(.el-pagination__total) {
                color: #fff;
            }
            
            :deep(.el-pagination .btn-prev),
            :deep(.el-pagination .btn-next) {
                background: rgba(74, 144, 226, 0.3);
                color: #fff;
                border-color: #4a90e2;
            }
            
            :deep(.el-pagination .btn-prev:hover),
            :deep(.el-pagination .btn-next:hover) {
                background: rgba(74, 144, 226, 0.5);
            }
            
            :deep(.el-pager li) {
                background: rgba(74, 144, 226, 0.3);
                color: #fff;
                border-color: #4a90e2;
            }
            
            :deep(.el-pager li:hover) {
                background: rgba(74, 144, 226, 0.5);
            }
            
            :deep(.el-pager li.is-active) {
                background: #4a90e2;
                color: #fff;
            }
            
            :deep(.el-select .el-input__inner) {
                background: rgba(74, 144, 226, 0.3);
                color: #fff;
                border-color: #4a90e2;
            }
            
            :deep(.el-input__inner) {
                background: rgba(74, 144, 226, 0.3);
                color: #fff;
                border-color: #4a90e2;
            }
        }
        </style>