---
title: "从零搭建 Next.js 博客技术栈选型"
date: "2025-12-14"
category: "技术分享"
description: "详细介绍了本博客的技术栈选择：Next.js, Tailwind CSS, 和 Markdown。"
---

# 技术栈选型

在搭建“梓安的思维空间”时，我考虑了多种方案。最终选择了 **Next.js** + **Tailwind CSS**。

## 为什么选择 Next.js？

1.  **React 生态**：作为一名前端开发者，React 是我最熟悉的工具。
2.  **App Router**：Next.js 14+ 的 App Router 提供了极佳的开发体验和性能优化。
3.  **SSG/SSR**：支持静态生成，非常适合博客这种内容更新频率适中的场景。

## 样式方案：Tailwind CSS

Tailwind CSS 提供了原子化的 CSS 类，让我能够快速构建出极简且美观的界面。配合 `@tailwindcss/typography` 插件，Markdown 的渲染变得非常简单。

## 内容管理

我选择了直接使用 Markdown 文件作为内容源。配合 `gray-matter` 解析元数据，这是一种轻量且高效的 CMS 替代方案。

```typescript
// 示例代码：读取 Markdown
import fs from 'fs';
import matter from 'gray-matter';

const fileContent = fs.readFileSync('path/to/file.md', 'utf8');
const { data, content } = matter(fileContent);
```
