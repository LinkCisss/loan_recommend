# React Native 流式AI聊天项目

## 项目简介

本项目是一个基于 React Native（支持 Android/iOS/Web）的流式AI聊天应用，前端采用 Expo + React Native，后端需提供兼容 SSE（Server-Sent Events）流式消息的 AI 服务接口。项目已适配安卓/iOS原生，支持灵动岛、流式消息体验优化，Web端与移动端体验一致。

## 主要特性

- 支持流式AI聊天（SSE流式消息）
- 安卓/iOS/Web 多端适配
- 聊天页面自动滚动、分离思考内容、输入体验优化
- 网络诊断与错误提示
- 支持多API地址配置，便于局域网/公网切换

## 环境要求

- Node.js >= 16.x
- npm >= 8.x 或 yarn
- Expo CLI（推荐全局安装）
- Android Studio（安卓原生调试）
- Xcode（Mac/iOS开发）
- 后端需提供 SSE 流式接口（如 `/easy/stream3`，GET方式，参数用URL拼接）

## 安装与运行

### 1. 克隆项目

```bash
git clone <你的仓库地址>
cd loan_recommend
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
```

### 3. 启动开发服务器

```bash
npx expo start
```

- 推荐使用 Expo Go App 扫码预览（仅限开发阶段，流式SSE需真机/模拟器原生环境）。
- 如需原生调试（流式SSE/安卓/iOS），请先裸出：

```bash
npx expo prebuild
```

### 4. 安卓/iOS 原生运行

#### 安卓

- 打开 Android Studio，选择 `loan_recommend/android` 目录，点击运行。
- 或命令行运行：

```bash
npx react-native run-android
```

#### iOS

- Mac 下用 Xcode 打开 `loan_recommend/ios`，选择模拟器或真机运行。
- 或命令行运行：

```bash
npx react-native run-ios
```

### 5. 配置后端API

- 默认API地址在 `src/screens/ChatScreen.tsx` 的 `API_CONFIGS` 数组中配置。
- 请确保手机/模拟器与后端服务器在同一局域网，且服务器监听 `0.0.0.0`，防火墙已放行端口。

## 常见问题排查

- **AI服务不可用/流式消息无响应**
  - 检查后端SSE接口是否正常，响应头需包含 `Content-Type: text/event-stream`
  - 安卓9+需配置明文流量允许（已裸出时在 `android/app/src/main/res/xml/network_security_config.xml` 配置）
  - 确认API地址为局域网IP，手机/模拟器能访问
  - 发送“测试”或“test”可触发内置网络诊断

- **安卓/iOS原生流式不工作**
  - 请确保已裸出（eject/prebuild），并用原生方式运行
  - Web端流式用fetch，原生端用 `react-native-event-source`

- **端口占用/环境变量报错**
  - 检查 `JAVA_HOME`、`ANDROID_HOME`、`local.properties` 配置
  - 端口冲突可更换端口或重启服务

## 目录结构

```
loan_recommend/
├── src/
│   └── screens/
│       └── ChatScreen.tsx   # 核心聊天页面
├── android/                 # 安卓原生工程
├── ios/                     # iOS原生工程
├── App.js / App.tsx         # 入口
├── package.json
└── ...
```

## 参考/致谢

- [react-native-event-source](https://github.com/Akylas/react-native-event-source)
- [Expo 官方文档](https://docs.expo.dev/)
- [React Native 官方文档](https://reactnative.dev/) 