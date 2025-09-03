# Focus Flow - 智能学习计时器

<div align="center">
  <img src="assets/gitpic/logo.png" alt="Focus Flow Logo" width="200"/>
  <h3>基于神经科学原理的智能学习计时器</h3>
</div>

## 🌟 预览

<div align="center">
  <img src="assets/gitpic/gitpic2.png" alt="应用预览" width="80%"/>
</div>

## ✨ 特点

Focus Flow 是一款基于神经科学原理设计的学习计时器，通过随机提醒和智能休息间隔来优化记忆形成和知识巩固。

### 核心功能

- **基于神经科学的时间管理** - 优化学习效果与记忆形成
- **随机提醒机制** - 在学习过程中随机触发短暂回顾，增强记忆巩固
- **多阶段计时系统** - 包含专注学习、短暂休息和阶段性休息
- **自定义预设** - 内置番茄工作法、深度工作和考试复习等多种预设模式
- **进度可视化** - 直观显示总体和当前阶段的学习进度
- **PWA 支持** - 可安装为桌面应用，支持离线使用
- **Electron 桌面版** - 跨平台桌面应用支持 (Windows, macOS, Linux)

<div align="center">
  <img src="assets/gitpic/gitpic1.png" alt="功能展示" width="80%"/>
</div>

## 🌍 多语言支持

Focus Flow 提供多语言支持，目前已实现：

- 简体中文
- English (英语)
- Deutsch (德语)

<div align="center">
  <img src="assets/gitpic/gitpic5.png" alt="多语言支持" width="80%"/>
</div>

## 🎵 动态音频生成系统

应用内置了基于 Web Audio API 的实时音频生成系统，无需外部音频文件：

- **三种音效主题**:
  - 电子音效 - 现代合成器音效，适合科技风格的学习环境
  - 钢琴音效 - 柔和的钢琴和弦与琶音，营造平静的学习氛围
  - 自然音效 - 自然环境音效，包括鸟鸣、流水和风铃声

- **四种提示音**:
  - 开始提醒音 - 学习阶段开始时播放
  - 随机提醒音 - 随机回顾提示时播放
  - 阶段休息音 - 阶段结束进入休息时播放
  - 结束提醒音 - 整个学习周期结束时播放

<div align="center">
  <img src="assets/gitpic/gitpic3.png" alt="音频设置" width="60%"/>
</div>

## 🛠️ 技术栈

- **前端**: React, JavaScript, HTML5, CSS3
- **状态管理**: React Hooks
- **音频**: Web Audio API
- **国际化**: i18next
- **PWA**: Service Workers, Manifest
- **桌面应用**: Electron
- **构建工具**: Vite

## 📥 安装和使用

### Web 版本

访问在线版本: [https://zhiqianyu.github.io/focus-flow](https://zhiqianyu.github.io/focus-flow)

或者本地运行:

```bash
# 克隆仓库
git clone https://github.com/zhiqianyu/focus-flow.git

# 进入项目目录
cd focus-flow

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 桌面版本

下载对应平台的安装包: [Releases](https://github.com/zhiqianyu/focus-flow/releases)

或者从源码构建:

```bash
# 构建 Windows 版本
npm run build-win

# 构建 macOS 版本
npm run build-mac

# 构建 Linux 版本
npm run build-linux
```

## 👨‍💻 开发指南

```bash
# Web 版开发
npm run dev

# Electron 版开发
npm run electron:dev

# 构建 Web 版
npm run build

# 构建 Electron 桌面版
npm run build-win    # Windows
npm run build-mac    # macOS
npm run build-linux  # Linux
```

## 📝 许可证

本项目使用 [MIT 许可证](LICENSE) 进行授权。

## ✍️ 作者

- **姓名** - [你的名字](https://github.com/zhiqianyu)
- **联系方式** - [your-email@example.com](mailto:yu-zhiqian@outlook.com)

## 🙏 致谢

- 感谢所有贡献者和支持者
- 如果你喜欢这个项目，请考虑 [给项目点星](https://github.com/zhiqianyu/focus-flow)