export function createOption(
    dataLine = [40, 56, 23, 15, 15],
    labels = ['CCA', 'CHH', 'ABC', 'CBC', 'SCH'],
    barImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAoCAYAAAAhf6DEAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAA6SURBVEhLY2x8/vY/A4mg3zwcTDOBSTLBqGYSwahmEsGoZhLBqGYSwahmEsGoZhLBqGYSwZDUzMAAAJldBMF2UASmAAAAAElFTkSuQmCC'
  ) {
    // ========= 常量区域 =========
    const MY_COLOR = ['#2be4fa'];
    const BAR_WIDTH = 30;
    const OUTLINE_WIDTH = 59;
    const BACKGROUND_COLOR = 'transparent';
    const POSITION_LEFT = 13;
    const MAX_VALUE = 100 + POSITION_LEFT;
  
    const TEXT_STYLE_LEFT = {
      color: '#4bb3fc',
      fontSize: 16,
    };
  
    const TEXT_STYLE_RIGHT = {
      color: '#ffffff',
      fontSize: 16,
    };
  
    const barImage = new Image();
    barImage.src = barImageBase64;
  
    // ========= 返回配置项 =========
    return {
      backgroundColor: BACKGROUND_COLOR,
      grid: [
        {
          left: '8%',
          top: '12%',
          right: '5%',
          bottom: '8%',
          containLabel: true,
        },
        {
          left: '10%',
          top: '12%',
          right: '5%',
          bottom: '8%',
          containLabel: true,
        },
      ],
      xAxis: [{ show: false }],
      yAxis: [
        {
          axisTick: 'none',
          axisLine: 'none',
          axisLabel: {
            inside: true,
            align: 'left',
            ...TEXT_STYLE_LEFT,
          },
          z: 10,
          data: labels,
        },
        {
          axisTick: 'none',
          axisLine: 'none',
          show: true,
          axisLabel: {
            inside: true,
            align: 'right',
            ...TEXT_STYLE_RIGHT,
          },
          z: 10,
          data: dataLine,
        },
        {
          axisLine: {
            lineStyle: { color: '#4bb3fc' },
          },
          data: [],
        },
      ],
      series: [
        {
          type: 'bar',
          barWidth: BAR_WIDTH,
          stack: 'b',
          legendHoverLink: false,
          itemStyle: {
            color: 'rgba(0,0,0,0)',
          },
          z: 3,
          data: new Array(dataLine.length).fill(POSITION_LEFT),
        },
        {
          name: '条',
          type: 'bar',
          stack: 'b',
          yAxisIndex: 0,
          data: dataLine,
          label: {
            show: false,
            position: 'right',
            distance: 10,
            formatter: (param) => `${param.value}%`,
            ...TEXT_STYLE_RIGHT,
          },
          barWidth: BAR_WIDTH,
          itemStyle: {
            color: {
              image: barImage,
              repeat: 'repeat',
            },
          },
          z: 2,
        },
        {
          name: '白框',
          type: 'bar',
          yAxisIndex: 1,
          barGap: '-100%',
          data: new Array(dataLine.length).fill(99.9),
          barWidth: OUTLINE_WIDTH - 2,
          itemStyle: {
            color: '#0e2147',
            barBorderRadius: 2,
          },
          z: 1,
        },
        {
          name: '外框',
          type: 'bar',
          yAxisIndex: 2,
          barGap: '-100%',
          data: new Array(dataLine.length).fill(100),
          barWidth: OUTLINE_WIDTH,
          label: {
            show: false,
            position: 'right',
            distance: 10,
            formatter: ({ dataIndex }) => `${dataLine[dataIndex]}%`,
            ...TEXT_STYLE_RIGHT,
          },
          itemStyle: {
            color: (params) => MY_COLOR[params.dataIndex % MY_COLOR.length],
            barBorderRadius: [0, 7, 0, 7],
          },
          z: 0,
        },
      ],
    };
  }
  