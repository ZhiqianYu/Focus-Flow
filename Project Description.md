#项目架构
.
├── public/
│   ├── index.html              # React 挂载点
│   └── manifest.json           # PWA 配置
├── src/
│   ├── main/                   # Electron 主进程
│   │   └── main.js
│   ├── renderer/               # React 前端代码
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── service-worker.js
│   │   └── components/
│   └── assets/                 # 图标、音频等
├── vite.config.js              # Vite 配置 + PWA 插件
├── package.json
├── README.md
└── ...

