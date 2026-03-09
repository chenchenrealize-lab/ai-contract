# 闭坑宝AI - 架构文档

## 项目概览

闭坑宝AI 是一个**租房合同风险分析工具**。租客拍照上传合同，AI 自动识别文字、匹配法律法规、分析风险条款，最后给出风险评分和谈判建议。就像找了一个律师朋友帮你看合同，但更快、更便宜。

## 技术选型

| 技术 | 选择 | 为什么 | 备选方案 |
|------|------|--------|----------|
| 前端框架 | Next.js (App Router) | 前后端一体，部署简单，SEO友好 | React + Express（多一个服务要维护） |
| 语言 | TypeScript | 类型安全，减少bug | JavaScript（容易写错但上手更快） |
| 样式 | Tailwind CSS | 移动端适配方便，开发快 | CSS Modules（更传统但写得慢） |
| AI模型 | DeepSeek Chat | 中文能力强，价格便宜，API兼容OpenAI格式 | GPT-4（贵10倍）、通义千问（也可以） |
| OCR | Tesseract.js | 免费，纯JS，无需额外API | DeepSeek-VL（更准但需要额外费用） |
| 知识库 | JSON文件 + 关键词匹配 | 知识库小（~3万字），够用 | 向量数据库（数据量大时才需要） |
| 部署 | Zeabur | 自动识别Next.js，国内可访问 | Vercel（国内访问慢） |

## 数据流架构

```
┌─────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  用户    │     │   前端页面    │     │  API路由      │     │  OCR识别     │     │  DeepSeek    │
│  拍照    │────▶│  上传图片     │────▶│ /api/analyze  │────▶│ Tesseract.js │     │    API       │
│         │     │  base64编码   │     │  接收处理     │     │  图片→文字    │     │             │
└─────────┘     └──────────────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
                                            │                     │                    │
                                            │◀────────────────────┘                    │
                                            │  合同文字                                 │
                                            │                                          │
                                     ┌──────▼───────┐                                  │
                                     │  RAG匹配     │                                  │
                                     │  关键词→知识库│                                  │
                                     └──────┬───────┘                                  │
                                            │                                          │
                                            │  知识库+合同 → Prompt                     │
                                            │─────────────────────────────────────────▶│
                                            │                                          │
                                            │◀─────────────────────────────────────────│
                                            │  JSON格式的风险分析结果                    │
                                     ┌──────▼───────┐
                                     │  解析结果     │
                                     │  返回前端     │
                                     └──────┬───────┘
                                            │
                                     ┌──────▼───────┐
                                     │  前端展示     │
                                     │  风险报告     │
                                     └──────────────┘
```

## 文件结构说明

```
contract-ai/
├── src/
│   ├── app/                    # Next.js 页面和API（App Router模式）
│   │   ├── layout.tsx          # 全局布局（导航栏、页脚）
│   │   ├── page.tsx            # 首页（上传+示例+结果展示）
│   │   ├── globals.css         # 全局样式
│   │   └── api/
│   │       ├── analyze/route.ts  # 核心分析接口
│   │       └── health/route.ts   # 健康检查（部署验证用）
│   │
│   ├── components/             # UI组件
│   │   ├── PhotoUploader.tsx   # 拍照/上传组件
│   │   ├── SampleContracts.tsx # 示例合同卡片
│   │   ├── AnalysisProgress.tsx# 分析进度条
│   │   ├── RiskReport.tsx      # 风险报告容器
│   │   ├── RiskItem.tsx        # 单个风险条款卡片
│   │   └── RiskSummary.tsx     # 评分环+总结
│   │
│   ├── lib/                    # 核心逻辑库
│   │   ├── types.ts            # TypeScript类型定义
│   │   ├── ocr/
│   │   │   ├── adapter.ts      # OCR接口（方便以后换实现）
│   │   │   └── tesseract.ts    # Tesseract.js OCR实现
│   │   ├── ai/
│   │   │   ├── deepseek.ts     # DeepSeek API调用
│   │   │   ├── prompts.ts      # AI提示词模板
│   │   │   └── parser.ts       # AI响应JSON解析器
│   │   └── rag/
│   │       ├── knowledge.ts    # 知识库加载+上下文构建
│   │       └── matcher.ts      # 关键词匹配引擎
│   │
│   ├── knowledge/              # 法律知识库（JSON数据）
│   │   ├── index.ts            # 统一导出
│   │   ├── civil-code.json     # 民法典租赁条款
│   │   ├── rental-regulations.json # 房屋租赁管理办法
│   │   ├── common-pitfalls.json    # 25+常见租房坑
│   │   ├── contract-checklist.json # 合同必备条款清单
│   │   └── case-studies.json       # 15个典型纠纷判例
│   │
│   └── hooks/
│       └── useAnalysis.ts      # 分析流程React Hook
│
└── public/
    └── samples/                # 示例合同文本
        ├── sample-good.txt     # 规范合同（低风险）
        ├── sample-risky.txt    # 问题合同（高风险）
        └── sample-missing.txt  # 缺失合同（中风险）
```

## 关键设计决策

### 1. 为什么不用向量数据库？
知识库只有~3万字（约15K tokens），可以直接全量注入到AI的prompt里。向量数据库适合几十万字以上的知识库。就像你只有一本薄薄的小册子，直接翻就行了，不需要建索引。

### 2. 为什么不存储用户合同？
保护隐私。合同包含个人信息，我们只在内存中处理，分析完就丢弃。就像一个律师在咖啡厅帮你看完合同就还给你，不留复印件。

### 3. 为什么用DeepSeek而不是GPT-4？
- 中文能力接近GPT-4
- 价格便宜约10倍
- API格式兼容OpenAI SDK，切换成本低
- 国内访问更稳定
