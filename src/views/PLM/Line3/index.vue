<template>
  <div class="project-progress h-[50%]">
    <dv-border-box12>
      <div class="header pt-2 pl-4 pr-4 flex">
        <div class="title">项目里程碑节点完成情况看板</div>
        <!-- 添加图例 -->
        <div class="legend">
          <div class="legend-item">
            <div class="legend-color bg-green"></div>
            <span>已完成</span>
          </div>
          <div class="legend-item">
            <div class="legend-color bg-blue"></div>
            <span>进行中</span>
          </div>
          <div class="legend-item">
            <div class="legend-color bg-red"></div>
            <span>逾期</span>
          </div>
          <div class="legend-item">
            <div class="legend-color bg-gray"></div>
            <span>里程碑计划</span>
          </div>
        </div>
        <div class="mode-switch">
          <dv-button :bg="false" @click="toggleDisplayMode">
            {{ isTimeMode ? '切换为均分模式' : '切换为时间模式' }}
          </dv-button>
        </div>
      </div>
      
      <div class="progress-list">
        <!-- pno 层级 -->
        <div v-for="pnoGroup in projectList" :key="pnoGroup.pno" class="pno-group">
          <div class="pno-header">项目号：{{ pnoGroup.pno }}</div>

          <!-- 一级层级 -->
          <div v-for="lvl1 in pnoGroup.level1Groups" :key="lvl1.level1Key" class="level1-group">
            <div class="level1-header">{{ lvl1.level1Key }}</div>

            <!-- 项目列表（按 projname 拆分） -->
            <div v-for="project in lvl1.projects" :key="project.id" class="project-row">
              <!-- 行标题：仅显示项目名称（小标题） -->
              <div class="project-info">
                <div class="project-name">{{ project.projname }}</div>
              </div>

              <!-- 进度阶段展示 -->
              <div class="stages-container">
                <div 
                  v-for="(stage, index) in project.stages" 
                  :key="index"
                  class="stage-block"
                  :class="getStageClass(stage.status)"
                  :style="{ width: getStageWidth(stage, project.stages.length) }"
                  :title="`${stage.name}\n${stage.timeInfo}`"
                >
                  {{ stage.name }}
                </div>
              </div>
              <!-- 已完成率 -->
              <div class="completed-rate" style="width:80px;text-align:right;">
                已完成率：<span style="color:#67C23A">{{ project.completedRate }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dv-border-box12>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDeliveryRateMonthInfo } from '@/api/getPMLinfo'

const projectList = ref([])
const isTimeMode = ref(false)

// 切换显示模式
const toggleDisplayMode = () => {
  isTimeMode.value = !isTimeMode.value
}

// 计算阶段宽度
const getStageWidth = (stage, totalStages) => {
  if (isTimeMode.value) {
    return `${stage.duration}%`
  } else {
    return `${100 / totalStages}%`
  }
}

// 处理状态映射
const STATE_MAP = {
  'C': 'completed',  // 完成
  'E': 'in-progress',    // 进行中（可能会变为逾期）
  'P': 'not-started' // 未下达
}

// 根据时间判断状态
const getStatusByTime = (stime, etime) => {
  const now = new Date()
  const startTime = new Date(stime)
  const endTime = etime ? new Date(etime) : null
  
  // 如果当前时间还没到开始时间，显示为里程碑计划
  if (now < startTime) {
    return 'milestone-plan'
  }
  
  // 如果有结束时间
  if (endTime) {
    // 如果当前时间在时间段内，显示为已完成
    if (now >= startTime && now <= endTime) {
      return 'completed'
    }
    // 如果当前时间超出结束时间，显示为逾期
    if (now > endTime) {
      return 'overdue'
    }
  } else {
    // 如果没有结束时间，且当前时间已过开始时间，显示为已完成
    if (now >= startTime) {
      return 'completed'
    }
  }
  
  return 'milestone-plan'
}

// 处理时间字符串的函数
const parseDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return new Date();
  // 确保时间字符串格式正确
  return new Date(dateTimeStr.replace(' ', 'T'));
}

// 提取“一级”分组字段，做多键名兜底
const getLevel1Key = (item) => {
  return (
    item.level1 || item.firstLevel || item.category1 || item.stageLevel1 ||
    item.group1 || item.pclass || item.ptype || item.ptype1 || item.major ||
    item.deptName || ''
  )
}

// 处理接口数据：按 pno → 一级 → projname 分组
const processData = (data) => {
  const pnoMap = new Map()

  data.forEach(item => {
    const pno = item.pno
    const level1Key = getLevel1Key(item)
    const projname = item.projname || ''

    if (!pnoMap.has(pno)) {
      pnoMap.set(pno, new Map())
    }
    const level1Map = pnoMap.get(pno)

    if (!level1Map.has(level1Key)) {
      level1Map.set(level1Key, new Map())
    }
    const projMap = level1Map.get(level1Key)

    const projKey = `${pno}__${level1Key}__${projname}`
    if (!projMap.has(projKey)) {
      projMap.set(projKey, {
        id: projKey,
        pno,
        level1Key,
        projname,
        stages: []
      })
    }

    const project = projMap.get(projKey)

    let status
    if (item.tstate === 'C') {
      status = 'completed'
    } else {
      status = getStatusByTime(item.stime, item.etime)
    }

    project.stages.push({
      name: item.pname,
      status,
      startTime: new Date(item.stime),
      endTime: item.etime ? new Date(item.etime) : null,
      duration: 0
    })
  })

  // 计算每个项目的阶段属性与完成率
  const pnoGroups = []
  pnoMap.forEach((level1Map, pno) => {
    const level1Groups = []
    level1Map.forEach((projMap, level1Key) => {
      const projects = []
      projMap.forEach(project => {
        const startTimes = project.stages.map(s => s.startTime.getTime())
        const endTimes = project.stages.filter(s => s.endTime).map(s => s.endTime.getTime())
        const projectStart = Math.min(...startTimes)
        const projectEnd = endTimes.length > 0 ? Math.max(...endTimes) : Date.now()
        const totalDuration = Math.max(projectEnd - projectStart, 1)

        project.stages.forEach(stage => {
          if (stage.endTime) {
            const stageDuration = stage.endTime.getTime() - stage.startTime.getTime()
            stage.duration = (stageDuration / totalDuration) * 100
            stage.timeInfo = `${stage.startTime.toLocaleDateString()} - ${stage.endTime.toLocaleDateString()}`
          } else {
            stage.duration = ((Date.now() - stage.startTime.getTime()) / totalDuration) * 100
            stage.timeInfo = `${stage.startTime.toLocaleDateString()} - 进行中`
          }
        })

        project.stages.sort((a, b) => a.startTime - b.startTime)
        const completedCount = project.stages.filter(s => s.status === 'completed').length
        project.completedRate = project.stages.length > 0 ? Math.round(completedCount / project.stages.length * 100) : 0
        projects.push(project)
      })

      level1Groups.push({ level1Key, projects })
    })

    pnoGroups.push({ pno, level1Groups })
  })

  return pnoGroups
}

// 获取数据
const fetchData = async () => {
  try {
    const res = await getDeliveryRateMonthInfo()
    if (res.code === 200 && Array.isArray(res.data)) {
      projectList.value = processData(res.data)
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

onMounted(fetchData)

// 根据状态返回对应的样式类名
const getStageClass = (status) => {
  switch (status) {
    case 'completed':
      return 'stage-completed'
    case 'in-progress':
      return 'stage-in-progress'
    case 'not-started':
      return 'stage-not-started'
    case 'overdue':
      return 'stage-overdue'
    case 'milestone-plan':
      return 'stage-milestone-plan'
    default:
      return 'stage-milestone-plan'
  }
}
</script>

<style scoped>
.project-progress {
  width: 100%;
  color: #fff;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;   
  align-items: center;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.6rem;
  color: #00eaff;
  text-align: center;
}

/* 图例样式 */
.legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 10px 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

.bg-green {
  background-color: #67C23A;
}

.bg-blue {
  background-color: #008cff;
}

.bg-red {
  background-color: #e7141b;
}

.bg-gray {
  background-color: #444040;
}

.mode-switch {
  margin-top: 10px;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
}

.pno-header {
  margin: 6px 0 4px 0;
  color: #00eaff;
  font-weight: 600;
}

.level1-header {
  margin: 4px 0;
  color: rgba(255,255,255,0.85);
}

.project-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 2.5rem;
}

.project-info {
  width: 200px;
  flex-shrink: 0;
}

.project-no {
  font-size: 0.9rem;
  color: #00eaff;
}

.project-name {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stages-container {
  flex: 1;
  display: flex;
  height: 2rem;
  background: rgba(0, 32, 64, 0.6);
  border-radius: 4px;
  overflow: hidden;
  padding: 2px;
  gap: 5px;
}

.stage-block {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.3rem;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s;
  border-radius: 2px;
  cursor: pointer;
  min-width: 0;
}

/* 状态样式 */
.stage-completed {
  background: #5abd29;  /* 正常完成-绿色 */
}

.stage-overdue {
  background: #e7141b;  /* 逾期-红色 */
}

.stage-in-progress {
  background: #2e90d1;  /* 里程碑计划-灰色 */
}
.stage-not-started {
  background: #444040;  /* 未开始-灰色 */
}

.stage-milestone-plan {
  background: #444040;  /* 里程碑计划-灰色 */
}
/* 鼠标悬停效果 */
.stage-block:hover {
  filter: brightness(1.2);
}

/* 滚动条样式 */
.project-progress::-webkit-scrollbar {
  width: 6px;
}

.project-progress::-webkit-scrollbar-track {
  background: rgba(0, 32, 64, 0.3);
}

.project-progress::-webkit-scrollbar-thumb {
  background: #00eaff;
  border-radius: 3px;
}

/* 按钮样式 */
:deep(.dv-button) {
  padding: 0.3rem 0.8rem;
  font-size: 0.8rem;
  color: #00eaff;
  border: 1px solid #00eaff;
  border-radius: 4px;
  background: transparent;
  transition: all 0.3s;
}

:deep(.dv-button:hover) {
  background: rgba(0, 234, 255, 0.1);
  box-shadow: 0 0 10px rgba(0, 234, 255, 0.3);
}

@media (max-width: 1280px) {
  .stage-block {
    font-size: 0.7rem;
  }
}
</style>
