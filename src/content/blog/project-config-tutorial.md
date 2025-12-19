---
title: "不仅是好看：揭秘“手机状态同步”与“GitHub 留言板”配置"
description: "还在手动更新博客状态？本文将带你深入了解本站两个核心功能的配置：数字孪生（手机状态同步）组件的原理，以及如何零成本搭建基于 GitHub Issues 的留言板。"
pubDate: 2025-12-18
coverImage: "/blog-screenshot.png"
tags: ["Tutorial", "Astro", "Giscus", "IoT"]
---

很多访客问我：“Suxinnai，你博客首页那个显示手机电量和 Wi-Fi 的卡片是真的吗？”
答案是：**现在是假的，但它可以是真的。**

今天这篇教程就来揭秘本站两个最有趣的功能：**Digital Twin（数字孪生）组件**和**GitHub 留言板**的配置方法。

## 📱 一、Digital Twin 组件配置

在首页右侧，那个科技感十足的浮动卡片就是 `DigitalTwin` 组件。它旨在实时映射我真实设备的运行状态。

### 1. 组件结构
这个组件位于 `src/components/DigitalTwin.astro`。它主要由三个部分组成：
*   **状态指示灯**：头部那个绿色的 `System: ONLINE`。
*   **立绘**：中间的 Live2D 或静态图片 (Mascot)。
*   **数据面板**：右下角的悬浮 Glassmorphism 面板。

### 2. 如何修改数据（基础版）
目前这些数据是硬编码在组件里的。如果你 clone 了我的项目，可以在 `DigitalTwin.astro` 中找到以下代码进行修改：

```javascript
// src/components/DigitalTwin.astro
const status = {
  energy: 85,           // 电量 %
  network: "WiFi • 5G", // 网络状态
  location: "Neo-Tokyo, Sector 7", // 位置
  device: "Neural Link v2.0"       // 设备名称
};
```

### 3. 如何接入真实数据 (PC 端同步)

现在我们不再通过手机，而是直接将你的主力生产力工具——**电脑**的状态同步到博客。

#### 核心架构图

**数据源 (PC)**：通过 Python 脚本获取当前前台窗口标题 + 自定义心情 → 发送 POST 请求到 Vercel。

#### 具体配置流程

##### 第一步：配置同步脚本
项目根目录下已经为你准备好了脚本 `scripts/pc_sync.py`。

1.  **环境**：确保电脑安装了 Python 3。
2.  **依赖**：安装 `requests` 库。
    ```bash
    pip install requests
    ```
3.  **配置**：打开 `scripts/pc_sync.py`，修改 `API_URL` 为你的域名。
4.  **运行**：
    ```bash
    python scripts/pc_sync.py
    ```
    脚本运行后，它会每隔 5 秒将你当前正在使用的窗口标题（如 VS Code）和你设定的 Mood 推送到博客。

##### 第二步：如何修改心情？
直接编辑脚本中的 `CurrentMood` 变量（例如改成 "Gaming" 或 "Sleeping"），脚本会自动读取新值并同步。

---

### 这种方案算“实时”吗？

*   **延迟**：约 5 秒。
*   **隐私**：脚本完全开源且运行在本地，你可以随时修改过滤逻辑，只上传你想展示的应用名称。

---
如果想要真正的毫秒级实时（WebSocket 推送），那是另外一个收费的故事了（Pusher / Supabase）。但对于个人博客，**Vercel KV + 5秒轮询** 是性价比最高、维护成本最低的方案。

---

## 💬 二、GitHub 留言板 (Giscus) 配置

你可能在 [留言板](/guestbook) 页面看到了一个“前往 GitHub”的按钮。其实，我们可以直接在页面内嵌入评论框！
这里推荐使用 **Giscus**。

### 1. 什么是 Giscus？
Giscus 是一个基于 GitHub Discussions 的评论系统。
*   **无数据库**：数据全存在 GitHub 上。
*   **免费**：蹭 GitHub 的服务器。
*   **无广告**：干净清爽。

### 2. 配置步骤

**第一步：准备 GitHub 仓库**
确保你的博客代码仓库是 **Public** 的，并且在仓库设置中开启了 **Discussions** 功能。

**第二步：获取配置**
访问 [giscus.app](https://giscus.app/zh-CN)，按照引导输入你的仓库地址（例如 `Suxinnai/blog`）。
它会自动生成一段 `<script>` 代码，里面包含了关键的 `data-repo-id` 和 `data-category-id`。

**第三步：集成到 Astro**
在 `src/pages/guestbook.astro` 中，你可以直接插入生成的脚本：

```html
<!-- Guestbook.astro -->
<div class="mt-8">
  <script src="https://giscus.app/client.js"
        data-repo="Suxinnai/blog"
        data-repo-id="R_kgDOL..."
        data-category="Announcements"
        data-category-id="DIC_kwDOL..."
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="preferred_color_scheme"
        data-lang="zh-CN"
        crossorigin="anonymous"
        async>
  </script>
</div>
```

### 3. 为什么我现在用的是跳转按钮？
因为直接嵌入脚本需要你的 Repo ID。作为一套开源模板，为了防止大家 fork 后忘记修改导致评论错乱，我默认提供了一个通用的跳转按钮。
**不仅如此**，这种设计也更符合“RPG 酒馆”的设定——你需要领取任务（点击链接）才能去公会大厅（GitHub）发言。

## 结语

无论是模拟的手机状态，还是借力的 Git 评论，核心都是**在有限的静态资源下，创造无限的动态交互感**。
这就是 Astro 的魅力，也是 Web 开发的乐趣。

Ready to update your config?
