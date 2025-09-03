# 中控看板主题颜色系统

## 概述

本项目使用CSS变量系统来管理主题颜色，便于统一修改和维护。所有颜色都定义在 `src/styles/theme.css` 文件中。

## 颜色变量分类

### 主色调 - 蓝色系
- `--primary-blue`: #00d4ff (主蓝色)
- `--primary-blue-dark`: #0099cc (深蓝色)
- `--primary-blue-light`: #33ddff (浅蓝色)
- `--primary-blue-lighter`: #66e6ff (更浅蓝色)

### 辅助蓝色
- `--secondary-blue`: #0066ff (辅助蓝色)
- `--secondary-blue-dark`: #0044cc (深辅助蓝)
- `--secondary-blue-light`: #3388ff (浅辅助蓝)

### 深蓝色系
- `--deep-blue`: #1e3a8a (深蓝)
- `--deep-blue-dark`: #1e40af (更深蓝)
- `--deep-blue-light`: #3b82f6 (浅深蓝)

### 背景色系
- `--bg-primary`: #0c0c0c (主背景)
- `--bg-secondary`: #1a1a2e (次背景)
- `--bg-tertiary`: #16213e (第三背景)
- `--bg-card`: rgba(255, 255, 255, 0.05) (卡片背景)
- `--bg-card-hover`: rgba(255, 255, 255, 0.1) (卡片悬停背景)

### 边框色系
- `--border-primary`: rgba(0, 212, 255, 0.3) (主边框)
- `--border-secondary`: rgba(255, 255, 255, 0.1) (次边框)
- `--border-hover`: rgba(0, 212, 255, 0.5) (悬停边框)

### 文字色系
- `--text-primary`: #ffffff (主文字)
- `--text-secondary`: rgba(255, 255, 255, 0.8) (次文字)
- `--text-muted`: rgba(255, 255, 255, 0.6) (弱化文字)
- `--text-accent`: #00d4ff (强调文字)

### 渐变色系
- `--gradient-primary`: linear-gradient(135deg, #00d4ff, #0066ff) (主渐变)
- `--gradient-secondary`: linear-gradient(45deg, #00d4ff, #00cc7a) (次渐变)
- `--gradient-bg`: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%) (背景渐变)

### 阴影色系
- `--shadow-primary`: rgba(0, 212, 255, 0.3) (主阴影)
- `--shadow-secondary`: rgba(0, 0, 0, 0.2) (次阴影)
- `--shadow-glow`: rgba(0, 212, 255, 0.5) (发光阴影)

### 状态色系
- `--success`: #00cc7a (成功)
- `--warning`: #ffaa00 (警告)
- `--error`: #ff6b6b (错误)
- `--info`: #00d4ff (信息)

### 图表颜色系
- `--chart-blue`: #0096ff (图表蓝)
- `--chart-orange`: #ff9600 (图表橙)
- `--chart-red`: #ff0066 (图表红)
- `--chart-purple`: #9600ff (图表紫)
- `--chart-green`: #00ff96 (图表绿)

## 使用方法

### 在Vue组件中使用

```vue
<template>
  <div class="my-component">
    <h1 class="title">标题</h1>
    <div class="card">内容</div>
  </div>
</template>

<style scoped>
.my-component {
  background: var(--bg-card);
  border: 1px solid var(--border-secondary);
}

.title {
  color: var(--text-primary);
}

.card {
  background: var(--gradient-primary);
  box-shadow: 0 0 20px var(--shadow-primary);
}
</style>
```

### 在Tailwind CSS中使用

```html
<div class="bg-[var(--bg-card)] border-[var(--border-secondary)] text-[var(--text-primary)]">
  内容
</div>
```

## 修改主题颜色

要修改整个主题的颜色，只需要编辑 `src/styles/theme.css` 文件中的相应变量值即可。

### 示例：修改主色调

```css
:root {
  /* 将主蓝色改为其他颜色 */
  --primary-blue: #your-new-color;
  --primary-blue-dark: #your-new-dark-color;
  --primary-blue-light: #your-new-light-color;
}
```

## 最佳实践

1. **优先使用变量**：不要直接使用颜色值，始终使用CSS变量
2. **语义化命名**：使用有意义的变量名，如 `--text-primary` 而不是 `--blue-1`
3. **保持一致性**：在整个项目中保持颜色使用的一致性
4. **考虑可访问性**：确保颜色对比度符合WCAG标准

## 注意事项

- 所有颜色变量都定义在 `:root` 选择器中，确保全局可用
- 修改颜色变量后，需要重新编译项目才能看到效果
- 建议在修改前备份原始颜色值 