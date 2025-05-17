// export function export3DChart(dataList: any[]) {
//   const heightProportion = 0.3; // 柱状扇形的高度比例

//   function getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, height) {
//     let midRatio = (startRatio + endRatio) / 2; // 修正为中点平均数
//     let startRadian = startRatio * Math.PI * 2;
//     let endRadian = endRatio * Math.PI * 2;
//     let midRadian = midRatio * Math.PI * 2;

//     if (startRatio === 0 && endRatio === 1) {
//       isSelected = false;
//     }
//     k = typeof k !== 'undefined' ? k : 1 / 3;

//     let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
//     let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;

//     let hoverRate = isHovered ? 1.1 : 1;

//     return {
//       u: { min: -Math.PI, max: Math.PI * 3, step: Math.PI / 32 },
//       v: { min: 0, max: Math.PI * 2, step: Math.PI / 20 },
//       x: function (u, v) {
//         if (u < startRadian) return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
//         if (u > endRadian) return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
//         return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
//       },
//       y: function (u, v) {
//         if (u < startRadian) return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
//         if (u > endRadian) return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
//         return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
//       },
//       z: function (u, v) {
//         if (u < -Math.PI * 0.5) return Math.sin(u);
//         if (u > Math.PI * 2.5) return Math.sin(u);
//         return Math.sin(v) > 0 ? heightProportion * height : -1;
//       }
//     };
//   }

//   function getPie3D(pieData, internalDiameterRatio) {
//     let series = [];
//     let sumValue = 0;
//     let startValue = 0;
//     let endValue = 0;
//     let legendData = [];
//     let linesSeries = [];
//     let k = typeof internalDiameterRatio !== 'undefined' ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio) : 1 / 3;

//     // 先计算总值
//     for (let i = 0; i < pieData.length; i++) {
//       sumValue += pieData[i].value;
//     }

//     for (let i = 0; i < pieData.length; i++) {
//       let seriesItem = {
//         name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
//         type: 'surface',
//         parametric: true,
//         wireframe: { show: false },
//         pieData: pieData[i],
//         pieStatus: { selected: false, hovered: false, k: k }
//       };

//       if (typeof pieData[i].itemStyle !== 'undefined') {
//         let itemStyle = {};
//         if (typeof pieData[i].itemStyle.color !== 'undefined') itemStyle.color = pieData[i].itemStyle.color;
//         if (typeof pieData[i].itemStyle.opacity !== 'undefined') itemStyle.opacity = pieData[i].itemStyle.opacity;
//         seriesItem.itemStyle = itemStyle;
//       }
//       series.push(seriesItem);
//     }

//     // 计算每个扇形的 startRatio 和 endRatio，生成 parametricEquation
//     for (let i = 0; i < series.length; i++) {
//       endValue = startValue + series[i].pieData.value;
//       series[i].pieData.startRatio = startValue / sumValue;
//       series[i].pieData.endRatio = endValue / sumValue;
//       series[i].parametricEquation = getParametricEquation(
//         series[i].pieData.startRatio,
//         series[i].pieData.endRatio,
//         series[i].pieStatus.selected,
//         series[i].pieStatus.hovered,
//         k,
//         series[i].pieData.value
//       );
//       startValue = endValue;

//       // label 指示线计算
//       const midRadian = (series[i].pieData.startRatio + series[i].pieData.endRatio) * Math.PI;
//       const radius = 1 + k;
//       const posX = Math.cos(midRadian) * radius;
//       const posY = Math.sin(midRadian) * radius;
//       const posZ = heightProportion * series[i].pieData.value;
//       let flag = (midRadian >= 0 && midRadian <= Math.PI / 2) || (midRadian >= 3 * Math.PI / 2 && midRadian <= Math.PI * 2) ? 1 : -1;
//       let color = pieData[i].itemStyle.color;
//       let turningPosArr = [
//         posX * 1.1 + i * 0.1 * flag + (flag < 0 ? -0.2 : 0),
//         posY * 1.1 + i * 0.1 * flag + (flag < 0 ? -0.2 : 0),
//         posZ
//       ];
//       let endPosArr = [
//         posX * 1.2 + i * 0.1 * flag + (flag < 0 ? -0.2 : 0),
//         posY * 1.2 + i * 0.1 * flag + (flag < 0 ? -0.2 : 0),
//         posZ * 3
//       ];

//       linesSeries.push({
//           type: 'line3D',
//           lineStyle: { color: color },
//           data: [[posX, posY, posZ], turningPosArr, endPosArr]
//         },
//         {
//           type: 'scatter3D',
//           label: {
//             show: true,
//             distance: 0,
//             position: 'center',
//             textStyle: {
//               color: '#fff',
//               backgroundColor: color,
//               borderWidth: 2,
//               fontSize: 14,
//               padding: 10,
//               borderRadius: 4,
//             },
//             formatter: '{b}'
//           },
//           symbolSize: 10,
//           data: [{ name: series[i].name + '\n' + series[i].pieData.value, value: endPosArr }]
//         }
//       );

//       legendData.push(series[i].name);
//     }

//     series = series.concat(linesSeries);

//     // 底座
//     const baseScale = 2;
//     const scaleForBase = baseScale * (1 + k);
//     series.push({
//       name: 'mouseoutSeries',
//       type: 'surface',
//       parametric: true,
//       wireframe: { show: false },
//       itemStyle: { opacity: 0.75, color: 'rgba(51, 135, 146, 0.75)' },
//       parametricEquation: {
//         u: { min: 0, max: Math.PI * 2, step: Math.PI / 20 },
//         v: { min: 0, max: Math.PI, step: Math.PI / 20 },
//         x: (u, v) => ((Math.sin(v) * Math.sin(u) + Math.sin(u)) / Math.PI) * scaleForBase,
//         y: (u, v) => ((Math.sin(v) * Math.cos(u) + Math.cos(u)) / Math.PI) * scaleForBase,
//         z: (u, v) => (Math.cos(v) > 0 ? -0 : -3.5),
//       },
//     });

//     return { series, legendData };
//   }

//   // 计算总值，转化百分比
//   let total = 0;
//   dataList.forEach(item => {
//     total += item.val;
//   });

//   const { series, legendData } = getPie3D(
//     dataList.map(item => {
//       return {
//         ...item,
//         value: Number(((item.val / total) * 100).toFixed(2))
//       };
//     }),
//     0
//   );

//   // 返回option
//   return {
//     xAxis3D: { min: -1.5, max: 1.5 },
//     yAxis3D: { min: -1.5, max: 1.5 },
//     zAxis3D: { min: -1, max: 1 },
//     grid3D: {
//       show: false,
//       boxHeight: 4,
//       bottom: '50%',
//       viewControl: {
//         distance: 380,
//         alpha: 25,
//         beta: 60,
//         autoRotate: true,
//       },
//     },
//     tooltip: {
//       show: true,
//       formatter: function (params) {
//         if (params.seriesType === 'scatter3D') {
//           const nameLines = params.name.split('\n');
//           const name = nameLines[0];
//           const val = nameLines[1];
//           return `
//             <div style="padding: 4px 8px">
//               <strong>${name}</strong><br/>
//               占比：${val}%
//             </div>
//           `;
//         }
//         return '';
//       },
//       backgroundColor: 'rgba(50,50,50,0.9)',
//       textStyle: { color: '#fff', fontSize: 13 },
//       extraCssText: 'box-shadow: 0 0 4px rgba(0,0,0,0.3);'
//     },
//     legend: {
//       data: legendData
//     },
//     series: series
//   };
// }
