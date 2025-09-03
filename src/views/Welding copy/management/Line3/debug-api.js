// API调试脚本 - 用于排查500错误
// 在浏览器控制台中运行此脚本来测试API

// 测试数据
const testData = {
  "code": "HJ1",
  "hourList": [
    {
      "hour": 1,
      "cj": 2,
      "hch": 0,
      "wj": 0
    },
    {
      "hour": 2,
      "cj": 2,
      "hch": 0,
      "wj": 0
    }
  ]
};

// 方法1: 使用fetch直接调用API
async function testAPIWithFetch() {
  try {
    console.log('开始测试API...');
    console.log('请求数据:', testData);
    
    const response = await fetch('http://192.168.1.197:10999/apollo/stampingWelding/automaticWeldingFillin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('响应状态:', response.status);
    console.log('响应头:', response.headers);
    
    if (response.ok) {
      const result = await response.json();
      console.log('成功响应:', result);
    } else {
      const errorText = await response.text();
      console.error('错误响应:', errorText);
      
      // 尝试解析错误信息
      try {
        const errorJson = JSON.parse(errorText);
        console.error('错误详情:', errorJson);
      } catch (e) {
        console.error('无法解析错误信息为JSON');
      }
    }
  } catch (error) {
    console.error('网络错误:', error);
  }
}

// 方法2: 使用XMLHttpRequest
function testAPIWithXHR() {
  const xhr = new XMLHttpRequest();
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      console.log('XHR状态:', xhr.status);
      console.log('XHR响应头:', xhr.getAllResponseHeaders());
      
      if (xhr.status === 200) {
        console.log('XHR成功响应:', xhr.responseText);
      } else {
        console.error('XHR错误响应:', xhr.responseText);
        console.error('状态文本:', xhr.statusText);
      }
    }
  };
  
  xhr.onerror = function() {
    console.error('XHR网络错误');
  };
  
  xhr.open('POST', 'http://192.168.1.197:10999/apollo/stampingWelding/automaticWeldingFillin');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('accept', '*/*');
  
  console.log('发送XHR请求...');
  xhr.send(JSON.stringify(testData));
}

// 方法3: 检查请求配置
function checkRequestConfig() {
  console.log('=== 请求配置检查 ===');
  console.log('URL:', 'http://192.168.1.197:10999/apollo/stampingWelding/automaticWeldingFillin');
  console.log('方法:', 'POST');
  console.log('数据:', testData);
  console.log('数据大小:', JSON.stringify(testData).length, '字节');
  
  // 检查数据格式
  const isValid = testData.code && Array.isArray(testData.hourList) && testData.hourList.length > 0;
  console.log('数据格式验证:', isValid ? '通过' : '失败');
  
  if (testData.hourList.length > 0) {
    const firstHour = testData.hourList[0];
    console.log('第一个小时数据:', firstHour);
    console.log('数据类型检查:', {
      hour: typeof firstHour.hour,
      cj: typeof firstHour.cj,
      hch: typeof firstHour.hch,
      wj: typeof firstHour.wj
    });
  }
}

// 方法4: 模拟Vue组件中的调用
async function testVueComponentCall() {
  try {
    console.log('模拟Vue组件调用...');
    
    // 模拟组件中的数据结构
    const hourData = Array.from({ length: 24 }, (_, i) => ({
      hour: i + 1,
      cj: Math.floor(Math.random() * 10),
      hch: Math.floor(Math.random() * 10),
      wj: Math.floor(Math.random() * 10)
    }));
    
    const data = {
      code: 'HJ1',
      hourList: hourData
    };
    
    console.log('完整24小时数据:', data);
    console.log('数据大小:', JSON.stringify(data).length, '字节');
    
    // 这里应该调用你的API函数
    // const result = await automaticWeldingFillin(data);
    // console.log('API调用结果:', result);
    
  } catch (error) {
    console.error('Vue组件调用错误:', error);
  }
}

// 运行所有测试
console.log('=== API调试脚本已加载 ===');
console.log('可用的测试方法:');
console.log('1. testAPIWithFetch() - 使用fetch测试');
console.log('2. testAPIWithXHR() - 使用XMLHttpRequest测试');
console.log('3. checkRequestConfig() - 检查请求配置');
console.log('4. testVueComponentCall() - 模拟Vue组件调用');

// 自动运行配置检查
checkRequestConfig(); 