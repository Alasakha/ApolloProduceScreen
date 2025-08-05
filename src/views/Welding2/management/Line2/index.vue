<template>
    <div class="line2-container h-[60%]">
      <div class="w-full grid grid-cols-3 gap-4">
       <div class="flex flex-col">
        <div class="text-white border-[#2575fc] border-2 border-double flex justify-center items-center 
        w-full h-[50px] mb-1 rounded-xl">
  焊接A线(松下自动焊)
</div>  
        <div class="col-box h-full flex flex-col gap-3">
          <DataCard
          v-for="(device) in devices1"
          :key="device.frame"
          :production="device.production"
          :customer-no="device.customerNo"
          :model-spec="device.modelSpec"
          :plan-count="device.planCount"
          :auto-weld-progress="device.autoWeldProgress"
          :manual-weld-count="device.manualWeldCount"
          :machineName="device.machineName"
          :liu="device.liu"
          :ya="device.ya"
          :jp="device.jp"
          deviceCategory="weldingA"
        />
        </div>

      </div>
      <div class="flex flex-col">
        <div class="text-white border-[#2575fc] border-2 border-double flex justify-center items-center 
        w-full h-[50px] mb-1 rounded-xl">焊接B线(安川自动焊)</div>
        <div class="col-box h-full flex flex-col gap-3">
        <DataCard
          v-for="(device) in devices2"
          :key="device.frame"
          :frame="device.frame"
          :customer-no="device.customerNo"
          :model-spec="device.modelSpec"
          :plan-count="device.planCount"
          :auto-weld-progress="device.autoWeldProgress"
          :manual-weld-count="device.manualWeldCount"
          :catogory="device.catogory"
          :machineName="device.machineName"
          deviceCategory="weldingB"
        />
      </div>
    </div>
      <div class="flex flex-col">
        <div class="text-white border-[#2575fc] border-2 border-double flex justify-center items-center 
        w-full h-[50px] mb-1 rounded-xl">焊接C线(手工焊)</div>
        <div class="col-box h-full flex flex-col gap-3">
        <DataCard
          v-for="(device) in devices3"
          :key="device.frame"
          :frame="device.frame"
          :customer-no="device.customerNo"
          :model-spec="device.modelSpec"
          :plan-count="device.planCount"
          :auto-weld-progress="device.autoWeldProgress"
          :manual-weld-count="device.manualWeldCount"
          deviceCategory="weldingC"
        />
      </div>
    </div>
       </div>

    </div>
  </template>   
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import DataCard from '@/components/Stamp/DataCard.vue'
  import { getStampingMachineData } from '@/api/getStampWeldinfo'
 import { useRoute } from 'vue-router'
 
 const prodLine = useRoute().query.prodLine
  const devices2 = ref([])
  const devices1 = ref([])

  const fetchData = async () => {
    const type = 2
    const res = await getStampingMachineData(prodLine,type)
    devices2.value = res.data.map(item => ({
      catogory: item.processName,
      frame: item.workNo,
      customerNo: item.item_specification,
      modelSpec: toFixed(item.plan_qty, 0),
      planCount: Number(item.plan_qty || 0),
      machineName: item.item_name,
    }))
  }

  const fetchData1 = async () => {
    const type = 1
    const res = await getStampingMachineData(prodLine,type)
    devices1.value = res.data.map(item => ({
        production:item.production? item.production : '暂无',
        liu:item.liu? item.liu : '暂无',
        ya:item.ya? item.ya : '暂无',
        jp:item.jp? item.jp : '暂无',
        machineName: item.machineName,
    }))
  }

  fetchData()
  fetchData1()

  // const devices1 = ref([
  //   {
  //     catogory: '车架',
  //     frame: '1号站节拍测量',
  //     customerNo: 'CUS20240301-001',
  //     modelSpec: 'A型/标准',
  //     planCount: 100,
  //     autoWeldProgress: 80,
  //     manualWeldCount: 5
  //   },
  //   {
  //     catogory: '车架',
  //     frame: '2号站节拍测量',
  //     customerNo: 'CUS20240301-002',
  //     modelSpec: 'B型/加长',
  //     planCount: 120,
  //     autoWeldProgress: 95,
  //     manualWeldCount: 3
  //   },
  //     {
  //       catogory: '车架',
  //       frame: '3号站节拍测量',
  //       customerNo: 'CUS20240301-003',
  //       modelSpec: 'A型/特制',
  //       planCount: 80,
  //       autoWeldProgress: 75,
  //       manualWeldCount: 2
  //     },
  // ])

  // const devices2 = ref([
  //   {
  //     catogory: '车架',
  //     frame: '1号站节拍测量',
  //     customerNo: 'CUS20240301-001',
  //     modelSpec: 'A型/标准',
  //     planCount: 100,
  //     autoWeldProgress: 80,
  //     manualWeldCount: 5
  //   },
  //   {
  //     catogory: '车架',
  //     frame: '2号站节拍测量',
  //     customerNo: 'CUS20240301-002',
  //     modelSpec: 'B型/加长',
  //     planCount: 120,
  //     autoWeldProgress: 95,
  //     manualWeldCount: 3
  //   },
  //     {
  //       catogory: '车架',
  //       frame: '3号站节拍测量',
  //       customerNo: 'CUS20240301-003',
  //       modelSpec: 'A型/特制',
  //       planCount: 80,
  //       autoWeldProgress: 75,
  //       manualWeldCount: 2
  //     },
  // ])

//字符串转换为数值保留 x位小数 方法
const toFixed = (str, x) => {
  return Number(str).toFixed(x)
}

  const devices3 = ref([
    {
      catogory: '车架',
      frame: '1号站节拍测量',
      customerNo: 'CUS20240301-001',
      modelSpec: 'A型/标准',
      planCount: 100,
      autoWeldProgress: 80,
      manualWeldCount: 5
    },
    {
      catogory: '车架',
      frame: '2号站节拍测量',
      customerNo: 'CUS20240301-002',
      modelSpec: 'B型/加长',
      planCount: 120,
      autoWeldProgress: 95,
      manualWeldCount: 3
    },
      {
        catogory: '车架',
        frame: '3号站节拍测量',
        customerNo: 'CUS20240301-003',
        modelSpec: 'A型/特制',
        planCount: 80,
        autoWeldProgress: 75,
        manualWeldCount: 2
      },
      {
        catogory: '车架',
        frame: '3号站节拍测量',
        customerNo: 'CUS20240301-003',
        modelSpec: 'A型/特制',
        planCount: 80,
        autoWeldProgress: 75,
        manualWeldCount: 2
      },
  ])




  </script>
  
  <style scoped>
  .line2-container {
    padding: 0.5rem 0.5rem 0 0;
    width: 100%;
    height: 100%;
  }

  .col-box {
    overflow-y: auto;
    padding-right: 0.5rem; /* 为滚动条预留空间 */
  }

  /* 美化滚动条样式 */
  .col-box::-webkit-scrollbar {
    width: 6px;
  }

  .col-box::-webkit-scrollbar-thumb {
    background-color: rgba(37, 117, 252, 0.3);
    border-radius: 3px;
  }

  .col-box::-webkit-scrollbar-track {
    background: transparent;
  }
  </style> 