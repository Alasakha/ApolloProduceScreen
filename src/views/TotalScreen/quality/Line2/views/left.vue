
    <template>
        <dv-border-box10>
        <GlobalTitle title="来料检验及时率"/>
        
            <!-- 图表容器 -->
            <div class="chartsbox w-full h-[90%]">
                <div ref="chartRef" class="w-full h-[100%]"></div>
            </div>
            
        </dv-border-box10>
        </template>
        
        
        <script setup lang="ts">
        import GlobalTitle from '@/components/title.vue'
        import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
        import { getIncomingInspection } from '@/api/getQuiltyinfo'
        import { useRoute } from 'vue-router'
        import { eventBus } from '@/utils/eventbus'
        import { formatPieChartData } from '@/utils/map'
        import { createChartOption } from './charts'
        import { useEcharts } from '@/utils/useEcharts'
        
        const chartRef = ref(null)
        const route = useRoute()
        const prodLine = route.query.prodLine as string || ''
        const isLoading = ref(true)
        const isDataEmpty = ref(false)
        const rawData = ref([])
        
        const { initChart, setOption, resizeChart } = useEcharts(chartRef)
        
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
        
        onBeforeUnmount(() => {
        eventBus.off('refreshData', fetchData)
        })
        </script>
        
        
        
        
        <style scoped>
        
        </style>