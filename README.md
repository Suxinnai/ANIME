# 🌌 Suxinnai's Digital World

![Project Banner](public/blog-screenshot.png)

> **🚀 本项目由 Google DeepMind 的 [Antigravity](https://deepmind.google/technologies/antigravity/) 全程辅助开发 (Advanced Agentic Coding)。**

> “喜欢把日常写成微光，把思绪折成风。”

欢迎来到 **Suxinnai** 的个人博客源码仓库！这是一个基于 **Astro** 构建的、充满 **RPG 游戏元素** 与 **赛博朋克** 风格的数字空间。

## ✨ 特性 (Features)

*   **🎮 RPG 沉浸式体验**：
    *   **角色状态面板 (Status)**：首页与关于页的 RPG 风格仪表盘，展示级别、属性雷达图、HP/MP 条。
    *   **任务系统 (Quest)**：展示当前正在进行的项目标题。
*   **🔌 数字孪生 (Digital Twin)**：
    *   **PC 状态同步**：通过本地 Python 脚本，将电脑活动（窗口、剪贴板、音乐播放等）实时同步至网页。
    *   **AI 吐槽系统**：应用分类 + AI 语境分析，自动产生带有个性的吐槽语。
    *   **后台音乐检测**：支持 Windows Media 接口，实时抓取后台播放的歌曲信息。
*   **🎨 极致 UI/UX**：
    *   **暗黑模式 (Dark Mode)**：深色主题适配，完美支持玻璃拟态 (Glassmorphism)。
    *   **动画效果**：基于 Tailwind CSS 的流畅过渡与微交互。
*   **💬 交互系统**：
    *   **留言板 (Guestbook)**：RPG 酒馆风格设计，集成 Giscus。

## 🛠️ 技术栈 (Tech Stack)

*   **框架**: [Astro 5.0](https://astro.build/)
*   **UI 库**: React (用于数字孪生组件)
*   **样式**: [Tailwind CSS](https://tailwindcss.com/)
*   **核心引擎**: Google DeepMind **Antigravity** (代码生成与逻辑优化)
*   **数据库**: Vercel KV (Redis)
*   **脚本**: Python (用于状态同步)

## 🚀 电脑状态同步 (PC Status Sync)
 
 1. 确保安装 Python 3。
 2. 运行 `pip install requests psutil openai winrt-runtime`。
 3. 修改 `scripts/pc_sync.py` 中的 `API_URL` 和 `SECRET`。
 4. 运行 `python scripts/pc_sync.py` 开启异世界链接。

---

## 🤝 声明

本仓库所有代码、样式及核心逻辑均由 **Antigravity** 助手协助完成。

MIT © [Suxinnai](https://github.com/Suxinnai)
