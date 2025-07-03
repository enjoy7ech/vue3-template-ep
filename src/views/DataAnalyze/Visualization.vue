<template>
  <div class="visualization-container">
    <h1>数据可视化</h1>
    <div ref="chart" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'

defineOptions({
  meta: {
    name: '可视化诊断分析',
  },
})

let chartInstance = null
const chart = ref()

const initChart = () => {
  chartInstance = echarts.init(chart.value)
  const option = {
    title: {
      text: '示例图表',
    },
    tooltip: {},
    xAxis: {
      data: ['分类1', '分类2', '分类3', '分类4', '分类5'],
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10],
      },
    ],
  }
  chartInstance.setOption(option)
}

onMounted(() => {
  initChart()
})
</script>

<style scoped>
.visualization-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
