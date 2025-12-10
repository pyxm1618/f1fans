# SEO标准化工作流SOP

> 适用于百度SEO与谷歌SEO的通用工作流程规范

---

## 目录

1. [工作流概览](#工作流概览)
2. [Agent角色定义](#agent角色定义)
3. [阶段一：信息收集](#阶段一信息收集)
4. [阶段二：项目分析](#阶段二项目分析)
5. [阶段三：SEO方案制定](#阶段三seo方案制定)
6. [阶段四：方案审核](#阶段四方案审核)
7. [阶段五：开发实施](#阶段五开发实施)
8. [阶段六：验证与监控](#阶段六验证与监控)
9. [检查清单](#检查清单)
10. [附录：百度与谷歌差异对照](#附录百度与谷歌差异对照)

---

## 工作流概览

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  信息收集   │ -> │  项目分析   │ -> │  方案制定   │
│ (Collector) │    │ (Analyzer)  │    │ (Planner)   │
└─────────────┘    └─────────────┘    └─────────────┘
                                             │
                                             ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  验证监控   │ <- │  开发实施   │ <- │  方案审核   │
│  (Monitor)  │    │(Developer+QA)│   │ (Reviewer)  │
└─────────────┘    └─────────────┘    └─────────────┘
```

---

## Agent角色定义

| Agent | 职责 | 输入 | 输出 |
|-------|------|------|------|
| **Collector** | 信息收集 | 项目URL/代码库 | 信息报告 |
| **Analyzer** | 项目分析 | 信息报告+代码 | 问题清单 |
| **Planner** | 方案制定 | 问题清单 | SEO方案 |
| **Reviewer** | 方案审核 | SEO方案 | 审核意见 |
| **Developer** | 开发实施 | 审核通过方案 | 代码变更 |
| **QA** | 质量审核 | 代码变更 | 通过/修改意见 |
| **Monitor** | 监控优化 | 上线项目 | 监控报告 |

---

## 阶段一：信息收集

**负责Agent**: Collector

### 1.1 基础信息采集

#### 域名信息
- [ ] 主域名
- [ ] 子域名列表
- [ ] 域名注册时间与历史
- [ ] 备案状态（中国大陆网站必需）
- [ ] SSL证书状态

#### 部署信息
- [ ] 部署平台（Vercel/Netlify/AWS/自托管）
- [ ] CDN配置
- [ ] 服务器地理位置
- [ ] 响应时间基准

#### 技术栈
- [ ] 前端框架（React/Vue/Angular/其他）
- [ ] 渲染方式（CSR/SSR/SSG/ISR）
- [ ] 构建工具（Vite/Webpack/其他）
- [ ] 后端技术（如有）

### 1.2 现状诊断

#### SEO配置现状
- [ ] robots.txt 存在性与内容
- [ ] sitemap.xml 存在性与有效性
- [ ] Meta标签配置情况
- [ ] 结构化数据使用情况

#### 搜索引擎收录
- [ ] 百度收录量（site:domain.com）
- [ ] 谷歌收录量（site:domain.com）
- [ ] 核心页面收录状态
- [ ] 索引问题诊断

#### 性能指标
- [ ] Largest Contentful Paint (LCP)
- [ ] First Input Delay (FID)
- [ ] Cumulative Layout Shift (CLS)
- [ ] Time to First Byte (TTFB)

### 1.3 竞品分析

- [ ] 识别3-5个主要竞品
- [ ] 竞品关键词分析
- [ ] 竞品技术实现方式
- [ ] 竞品SEO优势与不足

### 输出物
```
📄 信息收集报告.md
├── 基础信息汇总
├── 现状诊断结果
├── 性能基准数据
└── 竞品分析结论
```

---

## 阶段二：项目分析

**负责Agent**: Analyzer

### 2.1 代码结构分析

#### 路由与URL
- [ ] 路由结构梳理
- [ ] URL命名规范检查
- [ ] 动态路由处理方式
- [ ] URL参数使用情况

#### 渲染分析
- [ ] 页面渲染方式确认
- [ ] JavaScript依赖程度
- [ ] 首屏内容可抓取性
- [ ] 预渲染可行性评估

#### 现有SEO代码
- [ ] Head管理方式
- [ ] Meta标签实现
- [ ] 结构化数据实现
- [ ] 现有SEO组件/工具

### 2.2 页面分析

#### 页面结构
- [ ] 页面层级深度
- [ ] 页面分类体系
- [ ] 核心页面识别
- [ ] 页面权重分布

#### 内链结构
- [ ] 导航结构
- [ ] 面包屑实现
- [ ] 内链分布情况
- [ ] 孤岛页面识别

### 2.3 问题清单输出

按优先级分类：

| 优先级 | 问题类型 | 描述 | 影响范围 |
|--------|----------|------|----------|
| P0 | 致命问题 | 阻止收录的问题 | 全站 |
| P1 | 严重问题 | 严重影响排名 | 多页面 |
| P2 | 一般问题 | 影响用户体验 | 部分页面 |
| P3 | 优化建议 | 锦上添花 | 可选 |

### 输出物
```
📄 项目分析报告.md
├── 代码结构分析
├── 页面结构分析
├── 问题清单（按优先级排序）
└── 技术约束说明
```

---

## 阶段三：SEO方案制定

**负责Agent**: Planner

### 3.1 通用SEO方案

#### Meta标签优化
```html
<!-- 基础Meta -->
<title>{页面标题} | {网站名称}</title>
<meta name="description" content="{150字以内描述}">
<meta name="keywords" content="{关键词1,关键词2,关键词3}">

<!-- Open Graph -->
<meta property="og:title" content="{标题}">
<meta property="og:description" content="{描述}">
<meta property="og:image" content="{图片URL}">
<meta property="og:url" content="{页面URL}">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{标题}">
<meta name="twitter:description" content="{描述}">
<meta name="twitter:image" content="{图片URL}">
```

#### 语义化HTML结构
- 每页唯一H1标签
- H1-H6层级正确嵌套
- 使用语义化标签（header, nav, main, article, section, footer）
- 图片alt属性完整

#### 结构化数据
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "网站名称",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://example.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

#### URL规范化
- [ ] Canonical标签实现
- [ ] 301重定向策略
- [ ] 尾部斜杠统一
- [ ] www与非www统一

#### Sitemap策略
- [ ] XML Sitemap生成
- [ ] Sitemap自动更新机制
- [ ] 大型站点分片策略
- [ ] 图片/视频Sitemap（如需要）

#### Robots.txt配置
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /*.json$

Sitemap: https://example.com/sitemap.xml
```

### 3.2 百度SEO专项

#### 百度站长平台
- [ ] 站点验证（HTML标签/文件/CNAME）
- [ ] 站点属性设置
- [ ] 抓取频次调整

#### 百度推送
```javascript
// 主动推送API
POST https://data.zz.baidu.com/urls?site=xxx&token=xxx

// 自动推送JS
<script>
(function(){
    var bp = document.createElement('script');
    bp.src = '//push.zhanzhang.baidu.com/push.js';
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();
</script>
```

#### 百度特殊优化
- [ ] 百度验证meta标签
- [ ] 备案号展示（页脚）
- [ ] 中文关键词优化
- [ ] 百度移动适配声明

### 3.3 谷歌SEO专项

#### Google Search Console
- [ ] 站点验证
- [ ] 站点地图提交
- [ ] 覆盖率监控
- [ ] 核心网页指标

#### Google Analytics
- [ ] GA4集成
- [ ] 转化目标设置
- [ ] 流量来源追踪

#### 谷歌特殊优化
- [ ] hreflang多语言标签
- [ ] Core Web Vitals优化
- [ ] 移动端优先适配
- [ ] 结构化数据丰富摘要

### 输出物
```
📄 SEO优化方案.md
├── 通用优化方案
├── 百度专项方案
├── 谷歌专项方案
├── 实施优先级排序
└── 预期效果评估
```

---

## 阶段四：方案审核

**负责Agent**: Reviewer

### 4.1 技术可行性审核

| 检查项 | 通过标准 | 状态 |
|--------|----------|------|
| 架构兼容性 | 方案与现有架构无冲突 | □ |
| 实施难度 | 预估工时合理 | □ |
| 性能影响 | 不影响页面性能 | □ |
| 依赖评估 | 所需依赖稳定可靠 | □ |

### 4.2 SEO合规性审核

| 检查项 | 通过标准 | 状态 |
|--------|----------|------|
| 百度指南 | 符合百度搜索优化指南 | □ |
| 谷歌指南 | 符合Google SEO指南 | □ |
| 白帽SEO | 无黑帽SEO手段 | □ |
| 用户体验 | 不损害用户体验 | □ |

### 4.3 风险评估

| 风险类型 | 风险描述 | 影响程度 | 缓解措施 |
|----------|----------|----------|----------|
| 技术风险 | | 高/中/低 | |
| SEO风险 | | 高/中/低 | |
| 时间风险 | | 高/中/低 | |

### 输出物
```
📄 方案审核报告.md
├── 技术审核结果
├── SEO合规审核结果
├── 风险评估报告
├── 修改建议（如有）
└── 最终审核结论：通过/需修改
```

---

## 阶段五：开发实施

**负责Agent**: Developer + QA

### 5.1 分阶段实施

#### Phase 1: 基础配置（1-2天）
- [ ] robots.txt配置
- [ ] sitemap.xml生成
- [ ] 搜索引擎验证码部署
- [ ] 基础Meta标签

#### Phase 2: Meta与结构化数据（2-3天）
- [ ] 页面级Meta标签组件
- [ ] Open Graph标签
- [ ] Twitter Card标签
- [ ] JSON-LD结构化数据

#### Phase 3: 技术优化（3-5天）
- [ ] 预渲染/SSR实现
- [ ] 性能优化
- [ ] URL规范化
- [ ] 内链优化

#### Phase 4: 内容优化（2-3天）
- [ ] 关键词部署
- [ ] 标题优化
- [ ] 内容结构优化
- [ ] 图片优化

#### Phase 5: 提交与推送（1天）
- [ ] 百度站长平台提交
- [ ] Google Search Console提交
- [ ] 主动推送配置
- [ ] 监控配置

### 5.2 开发-审核循环

```
┌─────────────────────────────────────────────────────────┐
│                    开发-审核循环                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Developer Agent                                       │
│        │                                                │
│        ▼                                                │
│   ┌─────────┐                                          │
│   │ 开发功能 │                                          │
│   └────┬────┘                                          │
│        │                                                │
│        ▼                                                │
│   ┌─────────┐     ┌─────────┐                          │
│   │ 提交审核 │ --> │ QA Agent │                          │
│   └─────────┘     └────┬────┘                          │
│                        │                                │
│                        ▼                                │
│                   ┌─────────┐                          │
│                   │ 审核结果 │                          │
│                   └────┬────┘                          │
│                        │                                │
│              ┌─────────┴─────────┐                     │
│              │                   │                     │
│              ▼                   ▼                     │
│         ┌────────┐         ┌────────┐                  │
│         │ 通过   │         │ 不通过  │                  │
│         └───┬────┘         └────┬───┘                  │
│             │                   │                      │
│             ▼                   ▼                      │
│        下一阶段            返回修改                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.3 QA审核标准

#### 代码质量
- [ ] 代码符合项目规范
- [ ] 无TypeScript/ESLint错误
- [ ] 组件可复用性良好
- [ ] 无硬编码问题

#### SEO效果
- [ ] Meta标签正确渲染
- [ ] 结构化数据有效（Schema验证）
- [ ] 页面可被正确抓取
- [ ] 无SEO负面影响

#### 性能检查
- [ ] 无性能退化
- [ ] 资源加载合理
- [ ] 构建产物正常

### 输出物
```
📁 代码变更
├── 功能代码
├── 配置文件
├── 测试用例
└── 部署脚本
```

---

## 阶段六：验证与监控

**负责Agent**: Monitor

### 6.1 上线验证

#### 搜索引擎抓取测试
- [ ] 百度抓取诊断工具测试
- [ ] Google URL检查工具测试
- [ ] 移动端友好性测试
- [ ] 结构化数据测试

#### 功能验证
- [ ] 所有页面Meta标签正确
- [ ] Sitemap可访问且有效
- [ ] Robots.txt配置正确
- [ ] 重定向正常工作

### 6.2 监控指标

#### 收录监控（每周）
| 指标 | 百度 | 谷歌 | 目标 |
|------|------|------|------|
| 收录量 | | | |
| 收录率 | | | >80% |
| 索引覆盖 | | | |

#### 排名监控（每周）
| 关键词 | 百度排名 | 谷歌排名 | 变化 |
|--------|----------|----------|------|
| 关键词1 | | | |
| 关键词2 | | | |

#### 流量监控（每日）
- 自然搜索流量
- 着陆页分布
- 跳出率
- 平均停留时间

#### 性能监控（每日）
- Core Web Vitals
- 页面加载速度
- 服务器响应时间

### 6.3 迭代优化

#### 月度SEO审计
- [ ] 收录情况复查
- [ ] 排名变化分析
- [ ] 新问题识别
- [ ] 优化策略调整

#### 内容更新SEO
- [ ] 新内容SEO检查
- [ ] 旧内容更新优化
- [ ] 内链调整
- [ ] 关键词扩展

### 输出物
```
📄 SEO监控报告.md
├── 收录数据
├── 排名数据
├── 流量分析
├── 性能指标
└── 优化建议
```

---

## 检查清单

### 上线前SEO检查清单

#### 基础配置
- [ ] robots.txt 配置正确
- [ ] sitemap.xml 生成并可访问
- [ ] 搜索引擎验证码已部署
- [ ] SSL证书有效

#### Meta标签
- [ ] 每页有唯一title
- [ ] 每页有description
- [ ] Open Graph标签完整
- [ ] Twitter Card标签完整
- [ ] Canonical标签正确

#### 技术SEO
- [ ] 页面可被爬虫抓取
- [ ] JavaScript内容可渲染
- [ ] 移动端适配良好
- [ ] 页面加载速度达标
- [ ] 无404错误页面
- [ ] 重定向配置正确

#### 结构化数据
- [ ] JSON-LD语法正确
- [ ] Schema类型适当
- [ ] 必填字段完整
- [ ] 通过Google验证工具

#### 内容SEO
- [ ] H1标签使用正确
- [ ] 图片有alt属性
- [ ] 内链结构合理
- [ ] 无重复内容

---

## 附录：百度与谷歌差异对照

| 维度 | 百度 | 谷歌 |
|------|------|------|
| **收录速度** | 较慢，需主动推送 | 较快，自动发现 |
| **JS渲染** | 支持有限 | 支持较好 |
| **移动适配** | 支持响应式/独立站 | 移动优先索引 |
| **HTTPS** | 非强制 | 强烈推荐 |
| **结构化数据** | 支持有限 | 丰富摘要展示 |
| **站长工具** | 百度站长平台 | Google Search Console |
| **分析工具** | 百度统计 | Google Analytics |
| **推送方式** | 主动推送/自动推送 | Sitemap/URL检查 |
| **备案要求** | 中国大陆必需 | 不需要 |
| **语言偏好** | 中文优先 | 多语言支持好 |

### 百度特有配置
```html
<!-- 百度站点验证 -->
<meta name="baidu-site-verification" content="code-xxxxx">

<!-- 百度转码声明 -->
<meta http-equiv="Cache-Control" content="no-transform">
<meta http-equiv="Cache-Control" content="no-siteapp">

<!-- 百度移动适配 -->
<meta name="applicable-device" content="pc,mobile">
<meta name="mobile-agent" content="format=html5;url=https://m.example.com/">
```

### 谷歌特有配置
```html
<!-- Google站点验证 -->
<meta name="google-site-verification" content="xxxxx">

<!-- hreflang多语言 -->
<link rel="alternate" hreflang="zh-CN" href="https://example.com/zh/">
<link rel="alternate" hreflang="en" href="https://example.com/en/">
<link rel="alternate" hreflang="x-default" href="https://example.com/">
```

---

## 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0 | 2024-12-08 | 初始版本 |

---

*本SOP适用于Web项目的SEO优化工作流程，根据具体项目特点可适当调整。*
