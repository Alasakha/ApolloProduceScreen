// src/utils/use3DPieChart.ts
import * as echarts from 'echarts';

// 自定义注册 Pie3D
export function registerPie3D() {
    const PieSlice3D = echarts.graphic.extendShape({
      shape: {
        cx: 0,
        cy: 0,
        r0: 0,
        r: 0,
        startAngle: 0,
        endAngle: 0,
        depth: 30
      },
      buildPath: function (ctx, shape) {
        const { cx, cy, r0, r, startAngle, endAngle, depth } = shape;
        const sinStart = Math.sin(startAngle);
        const cosStart = Math.cos(startAngle);
        const sinEnd = Math.sin(endAngle);
        const cosEnd = Math.cos(endAngle);
  
        ctx.moveTo(cx + r0 * cosStart, cy + r0 * sinStart);
        ctx.lineTo(cx + r * cosStart, cy + r * sinStart);
        ctx.arc(cx, cy, r, startAngle, endAngle, false);
        ctx.lineTo(cx + r0 * cosEnd, cy + r0 * sinEnd);
        ctx.arc(cx, cy, r0, endAngle, startAngle, true);
  
        ctx.moveTo(cx + r * cosEnd, cy + r * sinEnd);
        ctx.lineTo(cx + r * cosEnd, cy + r * sinEnd + depth);
        ctx.arc(cx, cy + depth, r, endAngle, startAngle, true);
        ctx.lineTo(cx + r * cosStart, cy + r * sinStart + depth);
      }
    });
  
    echarts.graphic.registerShape('PieSlice3D', PieSlice3D);
  
    echarts.registerChartView('Pie3DView', echarts.extendComponentView({
      render(seriesModel, ecModel, api) {
        const group = this.group;
        group.removeAll();
        const data = seriesModel.getData();
        data.each(function (idx) {
          const shape = data.getItemLayout(idx);
          const color = data.getItemVisual(idx, 'style').fill;
          group.add(new echarts.graphic.Shape({
            shape,
            style: { fill: color }
          }));
        });
      }
    }));
  
    echarts.registerSeriesModel(echarts.extendSeriesModel({
      type: 'series.pie3D',
      defaultOption: {},
    }));
  }

export function get3DPieOption(data: { name: string; value: number }[]) {
  const sum = data.reduce((a, b) => a + b.value, 0);
  let startValue = 0;

  const pieData = data.map((item) => {
    const percent = item.value / sum;
    const endValue = startValue + percent;
    const slice = {
      name: item.name,
      value: item.value,
      shape: {
        cx: 0,
        cy: 0,
        r0: 50,
        r: 100,
        startAngle: startValue * Math.PI * 2,
        endAngle: endValue * Math.PI * 2,
        depth: 30
      },
      itemStyle: {
        color: getRandomColor()
      }
    };
    startValue = endValue;
    return slice;
  });

  return {
    backgroundColor: 'transparent',
    series: [{
      type: 'pie3D',
      data: pieData
    }]
  };
}

// 生成随机渐变色
function getRandomColor() {
  const colors = [
    '#ff7c7c', '#ffc46c', '#6ccfff', '#6cffd9', '#d06cff', '#ff6ce2'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
