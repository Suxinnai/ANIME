# 🌌 Suxinnai's Digital World

![Project Banner](public/blog-screenshot.png)

> **🚀 本项目由 Google DeepMind 的 [Antigravity](https://deepmind.google/technologies/antigravity/) 全程辅助开发 (Advanced Agentic Coding)。**

> “喜欢把日常写成微光，把思绪折成风。”

欢迎来到 **Suxinnai** 的个人博客源码仓库！这是一个基于 **Astro** 构建的、充满 **RPG 游戏元素** 与 **赛博朋克** 风格的数字空间。

这里不仅是记录代码与生活的地方，更是一个连接物理世界与数字世界的实验场。

## ✨ 特性 (Features)

*   **🎮 RPG 沉浸式体验**：
    *   **角色状态面板 (Status)**：首页与关于页的 RPG 风格仪表盘，展示等级、属性雷达图、HP/MP 条。
    *   **任务系统 (Quest)**：以“当前任务”展示正在进行的项目进度。
    *   **装备栏 (Inventory)**：酷炫的网格展示常用设备（包含那只卡皮巴拉！）。
*   **🔌 数字孪生 (Digital Twin)**：
    *   **实时同步**：集成 Vercel KV + **AutoX.js**，将现实世界手机的电量、应用状态实时映射到网页上。
    *   **动态交互**：React 组件驱动，支持实时轮询更新。
*   **🎨 极致 UI/UX**：
    *   **暗黑模式 (Dark Mode)**：全站完美适配深色主题，深夜阅读护眼又酷炫。
    *   **流畅动画**：微交互、粒子效果、以及丝滑的页面过渡。
*   **📝 内容管理**：
    *   **MDX 支持**：使用 Markdown 撰写文章，支持嵌入自定义组件。
    *   **自动目录**：文章详情页自动生成“任务简报”风格的目录 (TOC)。
    *   **阅读时长**：自动估算文章阅读时间。
*   **💬 交互系统**：
    *   **留言板 (Guestbook)**：冒险者酒馆风格的留言墙，集成 Giscus (GitHub Discussions)。

## 🛠️ 技术栈 (Tech Stack)

*   **框架**: [Astro 5.0](https://astro.build/)
*   **UI 库**: React (用于动态组件)
*   **样式**: [Tailwind CSS](https://tailwindcss.com/)
*   **图标**: Lucide React
*   **数据库**: Vercel KV (Redis)
*   **部署**: Vercel

## 🚀 快速开始 (Quick Start)

### 1. 克隆项目
```bash
git clone https://github.com/Suxinnai/my-astro-blog.git
cd my-astro-blog
```

### 2. 安装依赖
```bash
npm install
```

### 3. 本地运行
```bash
npm run dev
```
访问 `http://localhost:4321` 即可开启冒险！

## ☁️ 部署指南 (Deployment)

推荐使用 **Vercel** 进行托管，它也是本项目的原生开发平台。

1.  **准备工作**：确保你的代码已经提交到 GitHub。
2.  **创建项目**：
    *   登录 [Vercel](https://vercel.com/)，点击 "Add New..." -> "Project"。
    *   选择导入刚才的 GitHub 仓库 (`anime`)。
3.  **构建配置**：
    *   **Framework Preset**: 选择 `Astro` (通常会自动识别)。
    *   **Environment Variables**: 暂时留空，点击 **Deploy**。

## 🔌 手机状态同步 (Digital Twin Setup)

要让首页右下角的“胶囊”展示你真实的赛博生命体态，本项目采用了 **双路融合方案**。

### 1. 硬件状态 (OwnTracks)
利用系统级后台 App 稳定提交电池、充电及位置状态。
1.  手机安装 **OwnTracks**。
2.  设置 **Mode** 为 `HTTP`。
3.  **Host** 填入：`https://你的域名/api/status/owntracks`。

### 2. 软件生活 (Lanyard + Discord)
实时展示你正在听的歌、写的代码或玩的游戏。
1.  开启 Discord 的 `Activity Status`。
2.  加入 [Lanyard Discord 服务器](https://discord.gg/lanyard)（为了让后端能读取你的实时数据）。
3.  在 `src/components/DigitalTwinReact.jsx` 中将 `DISCORD_ID` 修改为你的 Discord 用户 ID。

### 3. 手动控制 (Web Sync)
如果你不方便安装 App，也可以直接在浏览器访问 `/sync` 页面，点击按钮开启手动实时同步。

---


## 🤝 贡献 (Contributing)

如果你有任何有趣的想法，欢迎提交 Issue 或 Pull Request！让我们一起把这个异世界建设得更完美。

## 📄 License

MIT © [Suxinnai](https://github.com/Suxinnai)
