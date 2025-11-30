# Global Air & Water Observatory

一个纯英文展示站点，集中呈现全球空气质量与饮用水安全的公开数据。所有页面均基于 Next.js App Router 构建，并通过开放接口实时获取信息。

## ✨ Features
- **Air Quality Dashboard** – OpenAQ PM2.5 数据、世界地图、最佳/最差 15 名排名，以及指标说明。
- **Water Quality Dashboard** – World Bank 安全饮水覆盖率、世界地图、最佳/差距最大 15 名排名。
- **Auto-generated Blog** – 自动生成 5 篇空气水文环保文章，引用实时数据并附带配图。
- **Privacy & About** – 透明披露数据来源、隐私策略与团队介绍。
- **Responsive Navigation** – 同一导航栏在移动端和桌面端都可自适应。

## 🔌 Data Sources
- [OpenAQ v2 `latest` endpoint](https://api.openaq.org/) – 获取全球 PM2.5 监测点。
- [World Bank Indicator `SH.H2O.SMDW.ZS`](https://data.worldbank.org/indicator/SH.H2O.SMDW.ZS) – 安全饮水覆盖率。
- [Rest Countries API](https://restcountries.com/) – 国家经纬度与 ISO 代码，用于地图匹配。

> 所有请求都使用 HTTPS，并通过 Next.js 的服务器组件按需刷新（空气 30 分钟、水 12 小时、国家基础数据每日）。

## 🗂️ Pages
| Route | Description |
| --- | --- |
| `/` | 首页：介绍项目、即时信号卡片、导航入口。 |
| `/air-quality` | 空气质量详情：全球地图、统计概览、最佳与最差排名、方法说明。 |
| `/water-quality` | 水质详情：安全饮水地图、统计卡片、排名与解读。 |
| `/blog` | 自动化博客：五篇围绕空气与水文的最新洞察。 |
| `/privacy` | Privacy & About：隐私政策与团队联系方式。 |

## 🚀 Local Development
1. 安装依赖：`npm install`
2. 启动开发环境：`./start.sh`（脚本会调用 `npm run dev`）
3. 在浏览器访问 [http://localhost:3000](http://localhost:3000)

## 🧪 Testing
- 运行 `npm run lint` 可执行 ESLint 校验，确保组件、API 调用与 TypeScript 规范一致。
- 地图依赖 `public/world-110m.json`，若更新拓扑文件，可手动替换后重新运行 `npm run dev` 检查。

## 📌 Notes
- 所有页面都使用浅色背景并保持内容居中，满足设计要求。
- 如果需要离线演示，可将 OpenAQ 与 World Bank 的响应结果缓存为 JSON，再将 `fetch` 改为读取本地文件。
- 博客内容直接由实时数据自动生成，不需要手动输入。

欢迎根据需要继续扩展新的数据源或多语言界面。Have fun exploring cleaner air and safer water!
