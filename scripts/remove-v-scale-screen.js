#!/usr/bin/env node

/**
 * 删除 v-scale-screen 插件的脚本
 * 使用方法: node scripts/remove-v-scale-screen.js
 */

const fs = require('fs');
const path = require('path');

console.log('🗑️  开始删除 v-scale-screen 插件...\n');

// 需要修改的文件列表
const filesToModify = [
  {
    path: 'src/main.ts',
    description: '移除插件导入和注册',
    changes: [
      {
        from: "import VScaleScreen from 'v-scale-screen'",
        to: ''
      },
      {
        from: "  .use(VScaleScreen)",
        to: ''
      }
    ]
  },
  {
    path: 'src/App.vue',
    description: '移除 v-scale-screen 组件包装',
    changes: [
      {
        from: "import { screenConfig, getCurrentScreenSize, calculateScale } from '@/config/screenConfig'",
        to: ''
      },
      {
        from: "// 动态屏幕配置",
        to: ''
      },
      {
        from: "const currentScreenConfig = ref({",
        to: ''
      },
      {
        from: "  ...screenConfig,",
        to: ''
      },
      {
        from: "  width: screenConfig.designWidth,",
        to: ''
      },
      {
        from: "  height: screenConfig.designHeight",
        to: ''
      },
      {
        from: "})",
        to: ''
      },
      {
        from: "// 更新屏幕配置",
        to: ''
      },
      {
        from: "const updateScreenConfig = () => {",
        to: ''
      },
      {
        from: "  const scale = calculateScale()",
        to: ''
      },
      {
        from: "  ",
        to: ''
      },
      {
        from: "  currentScreenConfig.value = {",
        to: ''
      },
      {
        from: "    ...screenConfig,",
        to: ''
      },
      {
        from: "    width: screenConfig.designWidth,",
        to: ''
      },
      {
        from: "    height: screenConfig.designHeight,",
        to: ''
      },
      {
        from: "    boxStyle: {",
        to: ''
      },
      {
        from: "      ...screenConfig.boxStyle,",
        to: ''
      },
      {
        from: "      transform: `scale(${scale})`,",
        to: ''
      },
      {
        from: "      transformOrigin: 'center center'",
        to: ''
      },
      {
        from: "    } as any",
        to: ''
      },
      {
        from: "  }",
        to: ''
      },
      {
        from: "}",
        to: ''
      },
      {
        from: "  // 初始化屏幕配置",
        to: ''
      },
      {
        from: "  updateScreenConfig()",
        to: ''
      },
      {
        from: "  ",
        to: ''
      },
      {
        from: "  // 监听窗口大小变化",
        to: ''
      },
      {
        from: "  window.addEventListener('resize', updateScreenConfig)",
        to: ''
      },
      {
        from: "    // 移除事件监听器",
        to: ''
      },
      {
        from: "    window.removeEventListener('resize', updateScreenConfig)",
        to: ''
      },
      {
        from: "  <v-scale-screen",
        to: ''
      },
      {
        from: "    :width=\"currentScreenConfig.width\"",
        to: ''
      },
      {
        from: "    :height=\"currentScreenConfig.height\"",
        to: ''
      },
      {
        from: "    :autoScale=\"currentScreenConfig.autoScale\"",
        to: ''
      },
      {
        from: "    :fullScreen=\"currentScreenConfig.fullScreen\"",
        to: ''
      },
      {
        from: "    :boxStyle=\"currentScreenConfig.boxStyle\"",
        to: ''
      },
      {
        from: "    :scaleMode=\"currentScreenConfig.scaleMode\"",
        to: ''
      },
      {
        from: "    :keepRatio=\"currentScreenConfig.keepRatio\"",
        to: ''
      },
      {
        from: "    :minScale=\"currentScreenConfig.minScale\"",
        to: ''
      },
      {
        from: "    :maxScale=\"currentScreenConfig.maxScale\"",
        to: ''
      },
      {
        from: "  >",
        to: ''
      },
      {
        from: "  </v-scale-screen>",
        to: ''
      }
    ]
  }
];

// 需要删除的文件列表
const filesToDelete = [
  'src/config/screenConfig.ts',
  'src/views/TestScreenScale.vue',
  'docs/V_SCALE_SCREEN_README.md'
];

// 执行文件修改
filesToModify.forEach(file => {
  const filePath = path.join(process.cwd(), file.path);
  
  if (fs.existsSync(filePath)) {
    console.log(`📝 修改文件: ${file.path}`);
    console.log(`   描述: ${file.description}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    file.changes.forEach(change => {
      if (content.includes(change.from)) {
        content = content.replace(change.from, change.to);
        console.log(`   ✅ 替换: ${change.from.substring(0, 50)}...`);
      }
    });
    
    // 清理多余的空行
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    fs.writeFileSync(filePath, content);
    console.log(`   ✅ 文件修改完成\n`);
  } else {
    console.log(`❌ 文件不存在: ${file.path}\n`);
  }
});

// 删除不需要的文件
filesToDelete.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`🗑️  删除文件: ${file}`);
    } catch (error) {
      console.log(`❌ 删除失败: ${file} - ${error.message}`);
    }
  } else {
    console.log(`⚠️  文件不存在: ${file}`);
  }
});

console.log('\n📋 接下来需要手动执行的步骤:');
console.log('1. 运行 npm uninstall v-scale-screen 删除插件包');
console.log('2. 检查并清理 package.json 中的依赖');
console.log('3. 删除 node_modules 文件夹并重新安装依赖');
console.log('4. 测试应用是否正常运行');

console.log('\n🎉 v-scale-screen 插件删除完成！');
console.log('💡 如果遇到问题，可以查看 git 历史记录恢复文件'); 