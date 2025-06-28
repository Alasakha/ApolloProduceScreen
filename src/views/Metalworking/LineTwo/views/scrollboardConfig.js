import { reactive } from 'vue'

const config = reactive({
  header: [
    '采购员', '仓管员', '检验员', '到货日期', '检验日期', '客户单号',
     '供应商编号', '品号', '品名', '规格', '数量', 
  ],
  dialogheaders: [
    '采购员', '仓管员', '检验员', '到货日期', '检验日期', '客户单号',
     '供应商名称', '品号', '品名', '规格', '数量', 
  ],
  data: [],
  rawData: [], // 保存原始数据
  columnWidth: [50,70,70,70,100,80,120,100,100,200,80],
  dialogcolumnWidth: [120,120,120,130,100,150,250,150,120,220,80],
  index: true,
  align: [],
  rowNum: 6,
  headerHeight: 35,
  headerBGC: '#0d2a4a',
  oddRowBGC: '#2C7CAF',
  evenRowBGC: '#2A71AF',
  waitTime: 5000,
  carousel: 'page',
  showTooltip: true
})

export default config 