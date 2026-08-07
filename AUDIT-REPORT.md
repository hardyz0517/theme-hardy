# Hardy Halo Theme 接手审计报告

**审计日期：** 2026-08-07  
**项目版本：** 0.1.0  
**审计范围：** 完整代码库、构建流程、Halo 契约、视觉对比

---

## 1. 执行摘要

Hardy Halo Theme 是一个基于 Vite + TypeScript + Thymeleaf 开发的 Halo 博客主题，目标是复刻参考站 https://ryanc.cc/ 的视觉效果和交互逻辑。项目当前版本 `0.1.0`，已实现核心页面和基础功能，但存在多个需要重构和完善的领域。

### 1.1 当前状态

- ✅ 14 个页面模板已生成（9 个核心路由 + 5 个可选插件路由）
- ✅ 构建流程完整，可生成发布包
- ✅ 核心 M1-M6 里程碑已实现，M7-M8 部分完成
- ❌ 存在一个格式检查失败（`.claude/settings.local.json`）
- ⚠️ 项目可运行，但视觉效果和代码质量需要系统性改进

### 1.2 关键发现

#### 阻断问题

1. 格式检查失败阻止 `pnpm check` 通过

#### 严重问题

1. 设计变量与参考站差异大（字体族错误、字号偏小）
2. 缺少完整的视觉验证矩阵
3. 存在遗留样式文件 `legacy.css`

#### 中等问题

1. 可选插件运行时验证不完整
2. 行高系统性偏小
3. 元信息顺序与参考站略有差异

#### 轻微问题

1. 文档中声明的 `>=2.0.0` 兼容性未经实机验证

---

## 2. 当前项目结构

### 2.1 目录布局

```
E:\Dev\Projects\theme-hardy/
├── .agents/              # Agent skills（halo-theme-dev）
├── .claude/              # 本地配置（未提交）
├── docs/                 # 合约和测试文档
│   ├── contracts/        # Halo 和插件契约
│   └── testing/          # 测试检查清单
├── references/           # 参考站截图（7 张 PNG）
├── research/             # 参考站分析（本地研究材料）
│   └── ryanc.cc/
│       ├── ANALYSIS.md   # 分析总结
│       └── raw/          # 公开页面快照（10 个 HTML）
├── scripts/              # 打包脚本
├── src/                  # **人工维护源码**
│   ├── css/              # 样式系统（22 个 CSS 文件）
│   ├── js/               # TypeScript 模块（10 个文件）
│   ├── partials/         # 可复用片段
│   └── *.html            # 14 个页面模板
├── templates/            # **生成产物（不可手工修改）**
├── dist/                 # 发布包
├── package.json
├── theme.yaml
├── settings.yaml
└── README.md
```

### 2.2 核心技术栈

- **模板引擎：** Thymeleaf（Halo 2.x 官方）
- **构建工具：** Vite + `@halo-dev/vite-plugin-halo-theme@1.0.3`
- **前端语言：** TypeScript 5.9.3（严格模式）
- **样式系统：** 原生 CSS（CSS 变量 + 自定义类名）
- **包管理器：** pnpm 10.33.0（强制）

---

## 3. 当前构建和发布流程

### 3.1 命令矩阵

| 命令              | 作用                 | 写操作                            | 验证结果    |
| ----------------- | -------------------- | --------------------------------- | ----------- |
| `pnpm check`      | 格式、Lint、类型检查 | 否                                | ❌ **失败** |
| `pnpm check:fix`  | 自动修复格式和 Lint  | 是                                | 未运行      |
| `pnpm build-only` | tsc + vp build       | 生成 `templates/`                 | 未运行      |
| `pnpm build`      | 完整构建 + 打包      | 生成 `templates/` 和 `dist/*.zip` | 未运行      |
| `pnpm dev`        | 监听模式             | 持续生成 `templates/`             | 未运行      |

### 3.2 构建产物验证

**生成产物（2026-08-07 09:15）：**

- ✅ `templates/` 包含 14 个 HTML 模板
- ✅ `templates/assets/` 包含 2 个打包文件：
  - `main-B8AR9j3W.js` (6.9 KB)
  - `main-CYbnClzO.css` (25 KB)
- ✅ `dist/theme-hardy-0.1.0.zip` (63 KB)
- ✅ 发布包不包含 `src/`, `node_modules/`, `research/`

---

## 4. Git 和工作区状态

### 4.1 分支和提交历史

```
当前分支：main
远程同步：已同步 origin/main
最近提交：
  9d5686a feat: implement hardy blog theme
  747460f Initial commit
```

### 4.2 未跟踪文件

```
references/  # 参考站截图（7 个 PNG 文件）
```

**风险分析：**

- ✅ `references/` 未被 Git 跟踪是正确的（本地研究材料）
- ✅ `research/ryanc.cc/raw/` 已被 `.gitignore` 排除
- ✅ 无临时文件、凭证或意外的构建产物

---

## 5. 当前已实现页面与功能

### 5.1 核心路由（9 个）

| 模板              | 路由                | 主要数据源          | 实现状态          |
| ----------------- | ------------------- | ------------------- | ----------------- |
| `index.html`      | `/`                 | `posts`             | ✅ 完整           |
| `archives.html`   | `/archives`         | `archives`          | ✅ 完整           |
| `categories.html` | `/categories`       | `categories`        | ✅ 完整（含嵌套） |
| `category.html`   | `/categories/:slug` | `category`, `posts` | ✅ 完整           |
| `tags.html`       | `/tags`             | `tags`              | ✅ 完整           |
| `tag.html`        | `/tags/:slug`       | `tag`, `posts`      | ✅ 完整           |
| `author.html`     | `/authors/:name`    | `author`, `posts`   | ✅ 完整           |
| `post.html`       | `/archives/:slug`   | `post`              | ✅ 完整           |
| `page.html`       | `/:slug`            | `singlePage`        | ✅ 完整           |

### 5.2 可选插件路由（5 个）

| 模板           | 插件标识        | 路由             | 能力守卫 | 实现状态    |
| -------------- | --------------- | ---------------- | -------- | ----------- |
| `links.html`   | `PluginLinks`   | `/links`         | ✅       | ✅ 源码完整 |
| `moments.html` | `PluginMoments` | `/moments`       | ✅       | ✅ 源码完整 |
| `moment.html`  | `PluginMoments` | `/moments/:name` | ✅       | ✅ 源码完整 |
| `photos.html`  | `PluginPhotos`  | `/photos`        | ✅       | ✅ 源码完整 |
| `photo.html`   | `PluginPhotos`  | `/photos/:name`  | ✅       | ✅ 源码完整 |

### 5.3 全局功能

| 功能           | 实现文件                              | 状态                            |
| -------------- | ------------------------------------- | ------------------------------- |
| 页面外壳       | `partials/layout.html`                | ✅ 完整                         |
| 桌面侧边栏     | `partials/shell/desktop-sidebar.html` | ✅ 完整                         |
| 移动端抽屉导航 | `mobile-menu.ts`                      | ✅ 完整（含焦点陷阱）           |
| 颜色模式切换   | `color-scheme.ts`                     | ✅ 完整（auto/light/dark）      |
| 回到顶部       | `scroll-to-top.ts`                    | ✅ 完整                         |
| 目录 (TOC)     | `toc.ts`                              | ✅ 完整（IntersectionObserver） |
| 分享           | `share.ts`                            | ✅ 完整（Web Share API + 回退） |
| 图片回退       | `media-fallback.ts`                   | ✅ 完整                         |
| 搜索触发器     | `search-widget.ts`                    | ✅ 完整（能力守卫）             |
| 评论           | `<halo:comment>`                      | ✅ 完整（Post 和 SinglePage）   |

---

## 6. 当前视觉效果较差的根本原因

### 6.1 设计变量与参考站差异

**参考站观察值（来自 `research/ryanc.cc/ANALYSIS.md`）：**

| 维度               | 参考站                            | Hardy 当前实现                | 偏差                        |
| ------------------ | --------------------------------- | ----------------------------- | --------------------------- |
| 全局字体           | Droid Serif, PingFang SC, 18/27px | Inter, ui-sans-serif, 16/1.65 | ❌ **字体族错误，字号偏小** |
| 页面最大宽度       | 1400px                            | 1400px                        | ✅                          |
| 桌面侧边栏比例     | 25%                               | 25%                           | ✅                          |
| 移动端头部高度     | 68px                              | 68px                          | ✅                          |
| 桌面侧边栏头像     | 96px，8px 圆角                    | 96px，8px 圆角                | ✅                          |
| 站点标题字号       | 36/40px 超粗                      | 36px / 1.1 超粗               | ⚠️ **行高偏小**             |
| 文章卡片标题       | 20/28px 超粗                      | 20px / 1.4 超粗               | ✅                          |
| 文章卡片摘要       | 18/27px 细体，80% 色值            | 18px / 1.5，68% 色值          | ⚠️ **透明度不一致**         |
| 封面图尺寸（桌面） | 224x160px                         | 224x160px                     | ✅                          |

**结论：**

- ✅ **布局比例和尺寸已精确复刻**
- ❌ **字体族完全错误**（参考站使用衬线字体 Droid Serif，Hardy 使用无衬线字体 Inter）
- ⚠️ **行高系统性偏小**（参考站使用 1.5，Hardy 使用 1.2-1.65）
- ⚠️ **颜色透明度细节有差异**

### 6.2 CSS 架构问题

#### 6.2.1 存在遗留样式文件

`src/css/components/legacy.css` 包含未清理的旧样式（101 行）：

```css
.post-list, .tag-list, .category-list { ... }
.post-item { ... }
.article-content { ... }
```

这些类名与当前组件系统不一致（当前使用 `.hardy-*` 前缀）。

**影响：** 如果模板错误引用旧类名，会应用不一致的样式；如果不引用，这些样式是无效代码。

---

## 7. 与参考站逐页视觉差异

### 7.1 首页文章列表（有封面）

**截图：** `references/首页文章列表-有封面.png`

| 项目               | 参考站                       | Hardy 实现                   | 差异等级        |
| ------------------ | ---------------------------- | ---------------------------- | --------------- |
| 全局字体           | Droid Serif 衬线             | Inter 无衬线                 | ❌ **结构错误** |
| 卡片标题字号       | 20/28px                      | 20/1.4px (≈28px)             | ✅ 参数准确     |
| 摘要字号行高       | 18/27px                      | 18/1.5px (=27px)             | ✅ 参数准确     |
| 封面图比例（桌面） | 224x160px，8px 圆角          | 224x160px，8px 圆角          | ✅ 参数准确     |
| 卡片间距           | 48px bottom                  | 48px bottom                  | ✅ 参数准确     |
| 元信息布局         | 分类、浏览、评论、点赞、日期 | 日期、分类、浏览、评论、点赞 | ⚠️ **顺序不同** |

**修复方案：**

1. 修改 `tokens.css` 中 `--hardy-font-sans` 为参考站字体
2. 修改 `base.css` 中 `body` 的 `font-size` 为 `18px`，`line-height` 为 `1.5`

### 7.2 文章详情（代码文章）

**截图：** `references/文章详情-代码文章.png`

| 项目       | 参考站      | Hardy 实现                     | 差异等级                  |
| ---------- | ----------- | ------------------------------ | ------------------------- |
| 标题字号   | 30/36px     | 30px / 1.2 (移动), 36px (桌面) | ⚠️ **移动端行高偏小**     |
| 正文字号   | 18/27px     | 16px / 1.9                     | ❌ **字号偏小，行高偏大** |
| 目录位置   | 右侧 sticky | 右侧 sticky                    | ✅ 参数准确               |
| 上下篇导航 | 底部两列    | 底部两列，`max-width: 340px`   | ✅ 参数准确               |

**修复方案：**

1. 修改 `.hardy-prose` 为 `font-size: 18px; line-height: 1.5;`
2. 修改 `.hardy-detail__title` 移动端行高为 `1.25`

### 7.3 其他页面

- **归档页：** 结构和尺寸已正确，无需修改
- **瞬间列表页：** 需验证媒体内容（图片、视频）渲染
- **友链列表页：** 布局正确，需验证运行时状态
- **关于页面：** 与文章详情页共用结构，修复方案相同

---

## 8. Halo 2.25.4 和插件契约风险

### 8.1 核心契约覆盖率

根据 `docs/contracts/halo-core.md`（2026-08-06）：

| 契约项                                      | 文档状态  | 模板使用情况              | 风险等级  |
| ------------------------------------------- | --------- | ------------------------- | --------- |
| `site.title`, `site.subtitle`, `site.logo`  | ✅ 已记录 | ✅ 全局使用               | ✅ 低风险 |
| `menuFinder.getPrimary()`                   | ✅ 已记录 | ✅ 侧边栏和移动菜单       | ✅ 低风险 |
| `pluginFinder.available()`                  | ✅ 已记录 | ✅ 5 个可选路由           | ✅ 低风险 |
| `posts: UrlContextListResult<ListedPostVo>` | ✅ 已记录 | ✅ 首页、分类、标签、作者 | ✅ 低风险 |
| `post.content.content`                      | ✅ 已记录 | ✅ 文章详情               | ✅ 低风险 |
| `postFinder.cursor()`                       | ✅ 已记录 | ✅ 上下篇导航             | ✅ 低风险 |
| `haloCommentEnabled`, `<halo:comment>`      | ✅ 已记录 | ✅ Post 和 SinglePage     | ✅ 低风险 |

**结论：** 所有核心契约已正确使用，风险低。

### 8.2 可选插件契约

根据 `docs/contracts/optional-content-plugins.md`（2026-08-06）：

| 插件               | 版本         | 契约状态  | 模板实现  | 运行时验证 | 风险等级  |
| ------------------ | ------------ | --------- | --------- | ---------- | --------- |
| PluginLinks        | 2.3.0-beta.4 | ✅ 已记录 | ✅ 完整   | ⚠️ 部分    | ⚠️ 中等   |
| PluginMoments      | 1.16.1       | ✅ 已记录 | ✅ 完整   | ⚠️ 部分    | ⚠️ 中等   |
| PluginPhotos       | 2.1.2        | ✅ 已记录 | ✅ 完整   | ⚠️ 部分    | ⚠️ 中等   |
| PluginSearchWidget | 1.7.1        | ✅ 已记录 | ✅ 触发器 | ⚠️ 部分    | ✅ 低风险 |
| Comment Widget     | 3.1.2        | ✅ 已记录 | ✅ 完整   | ⚠️ 部分    | ✅ 低风险 |

**运行时验证缺口：**

- ❌ Links/Moments/Photos 的禁用/缺失态未经浏览器测试
- ❌ 媒体内容（照片、视频）的完整矩阵未验证
- ⚠️ 所有插件的深色模式渲染未经系统验证

---

## 9. settings.yaml 与 theme.config 对照

### 9.1 配置项使用情况

| 配置项                    | 定义类型 | 默认值 | 模板引用                                             | 使用文件               | 兜底处理               |
| ------------------------- | -------- | ------ | ---------------------------------------------------- | ---------------------- | ---------------------- |
| `basic.custom_footer`     | `text`   | `""`   | `${theme.config.basic?.custom_footer ?: site.title}` | `footer.html`          | ✅ 回退到 `site.title` |
| `basic.social_github`     | `url`    | `""`   | `${!#strings.isEmpty(...)}`                          | `desktop-sidebar.html` | ✅ 空值隐藏链接        |
| `basic.social_email`      | `email`  | `""`   | `${!#strings.isEmpty(...)}`                          | `desktop-sidebar.html` | ✅ 空值隐藏链接        |
| `basic.social_website`    | `url`    | `""`   | `${!#strings.isEmpty(...)}`                          | `desktop-sidebar.html` | ✅ 空值隐藏链接        |
| `appearance.color_scheme` | `radio`  | `auto` | `data-color-scheme`                                  | `layout.html`          | ✅ 回退到 `auto`       |

### 9.2 一致性检查结果

- ✅ 所有 `settings.yaml` 中的字段都被模板使用
- ✅ 所有模板引用的配置字段都在 `settings.yaml` 中定义
- ✅ 所有配置访问都使用安全导航 `?.` 和 Elvis 回退 `?:`
- ✅ 无固定写死的应由配置提供的内容

---

## 10. 构建、检查和发布包结果

### 10.1 静态检查

```bash
pnpm check
```

**结果：** ❌ **失败**

```
error: Formatting issues found
.claude/settings.local.json (3ms)
```

**根因：** `.claude/settings.local.json` 格式不符合 Prettier 配置

**修复：** 运行 `pnpm check:fix`

### 10.2 发布包验证

根据 `docs/testing/m8-hardening-audit.md`：

| 文件                                 | 大小   | 状态 |
| ------------------------------------ | ------ | ---- |
| `templates/assets/main-B8AR9j3W.js`  | 6.9 KB | ✅   |
| `templates/assets/main-CYbnClzO.css` | 25 KB  | ✅   |
| `dist/theme-hardy-0.1.0.zip`         | 63 KB  | ✅   |

- ✅ ZIP 内容正确
- ✅ 无开发文件泄漏
- ⚠️ 从清洁安装重新构建未验证

---

## 11. 品牌、资产、固定文案和无效链接检查

### 11.1 知识产权内容搜索

| 内容类型        | 搜索结果                       | 位置               | 风险等级 |
| --------------- | ------------------------------ | ------------------ | -------- |
| "Walker"        | ✅ 未找到                      | -                  | ✅ 安全  |
| "ryanc"         | ✅ 仅在 `research/` 和 `docs/` | 研究材料和文档引用 | ✅ 安全  |
| 参考站域名      | ✅ 仅在 `research/` 和 `docs/` | 作为引用和分析来源 | ✅ 安全  |
| 参考站图片/Logo | ✅ 未找到                      | -                  | ✅ 安全  |
| 参考站品牌文字  | ✅ 未找到                      | -                  | ✅ 安全  |

### 11.2 固定文案检查

| 文案类别     | 位置                   | 当前值               | 评估            |
| ------------ | ---------------------- | -------------------- | --------------- |
| 页脚默认文本 | `footer.html`          | `${site.title}` 回退 | ✅ 动态         |
| 空状态文案   | 各页面模板             | "暂无内容" 等中文    | ✅ 合理         |
| 按钮标签     | 各页面模板             | "上一页"、"下一页"   | ✅ 合理         |
| 社交链接图标 | `desktop-sidebar.html` | "码"、"邮"、"站"     | ✅ 中文占位符   |
| Logo 回退    | 多处                   | "H"                  | ✅ Hardy 首字母 |

### 11.3 无效链接检查

```
href="#"                    ✅ 未找到
href="javascript:void(0)"   ✅ 未找到
href=""                     ✅ 未找到
```

**结论：** 所有链接都是 Halo 数据驱动或配置驱动，无硬编码无效链接。

### 11.4 研究目录隔离

- ✅ 无模板引用 `research/` 目录
- ✅ `research/` 内容正确隔离，不会进入构建产物

---

## 12. 发现的问题清单

### 12.1 阻断问题

| ID   | 问题         | 位置                          | 影响                   | 修复方案              |
| ---- | ------------ | ----------------------------- | ---------------------- | --------------------- |
| B-01 | 格式检查失败 | `.claude/settings.local.json` | 阻止 `pnpm check` 通过 | 运行 `pnpm check:fix` |

### 12.2 严重问题

| ID   | 问题                 | 位置                            | 影响                 | 修复方案                                  |
| ---- | -------------------- | ------------------------------- | -------------------- | ----------------------------------------- |
| S-01 | 字体族错误           | `src/css/foundation/tokens.css` | 整体视觉风格不符     | 修改 `--hardy-font-sans`                  |
| S-02 | 基础字号偏小         | `src/css/foundation/base.css`   | 正文密度过高         | 改为 `font-size: 18px; line-height: 1.5;` |
| S-03 | 遗留样式文件         | `src/css/components/legacy.css` | 样式冲突风险         | 删除或标记待清理                          |
| S-04 | 缺少完整视觉验证矩阵 | 项目整体                        | 无法确认所有渲染正确 | 执行 M8 视觉矩阵测试                      |

### 12.3 中等问题

| ID   | 问题                 | 位置                 | 影响           | 修复方案                |
| ---- | -------------------- | -------------------- | -------------- | ----------------------- |
| M-01 | 插件运行时验证不完整 | Links/Moments/Photos | 缺失态行为未知 | 完成 M7 插件审计        |
| M-02 | 元信息顺序差异       | `post-meta.html`     | 细节不一致     | 调整字段顺序            |
| M-03 | 行高系统性偏小       | 多个 CSS 文件        | 排版偏紧凑     | 逐文件调整行高          |
| M-04 | 摘要透明度差异       | `post-card.css`      | 对比度略有差异 | 调整 `color-mix` 到 80% |

### 12.4 轻微问题

| ID   | 问题                   | 位置         | 影响               | 修复方案              |
| ---- | ---------------------- | ------------ | ------------------ | --------------------- |
| L-01 | `>=2.0.0` 兼容性未验证 | `theme.yaml` | 声明与实际可能不符 | 测试或改为 `>=2.25.0` |
| L-02 | 无障碍检查不完整       | 项目整体     | 键盘导航问题风险   | 执行 M8 无障碍检查    |

---

## 13. 可以直接保留的代码

### 13.1 架构和基础设施

- ✅ **构建流程**：Vite + TypeScript + 官方插件，无需调整
- ✅ **目录结构**：`src/` 源码，`templates/` 生成，`dist/` 发布，边界清晰
- ✅ **打包脚本**：`scripts/package-theme.mjs` 正确排除开发文件
- ✅ **类型配置**：`tsconfig.json` 严格模式，覆盖充分

### 13.2 全局外壳

- ✅ `partials/layout.html`：职责清晰，单一 JS 入口，颜色模式前置脚本避免闪烁
- ✅ `partials/shell/desktop-sidebar.html`：比例正确，菜单契约正确
- ✅ `partials/shell/mobile-menu.html`：dialog 语义、noscript 回退完整
- ✅ `partials/shell/footer.html`：配置驱动，`<halo:footer />` 位置正确

### 13.3 组件系统

- ✅ `post-card.html`：响应式正确，封面缺失变体处理完善
- ✅ `pagination.html`：使用 `hasPrevious()`/`hasNext()` 和服务端 URL，契约正确
- ✅ `empty-state.html`、`page-heading.html`：参数化可复用
- ✅ `link-card.html`：Logo 兜底三态处理完整

### 13.4 TypeScript 功能

全部 7 个特性模块均可保留：

- ✅ `core/dom.ts`：`runFeatures` 隔离失败，设计正确
- ✅ `mobile-menu.ts`：焦点陷阱、`inert`、Escape、断点响应完整
- ✅ `color-scheme.ts`：持久化优先级正确，系统偏好仅在 auto 模式生效
- ✅ `toc.ts`：保留 Halo 原始 heading ID，避免二次编码
- ✅ `share.ts`：Web Share API + 剪贴板回退 + 失败提示
- ✅ `scroll-to-top.ts`：passive 监听，减少动画适配
- ✅ `media-fallback.ts`：错误处理与 `complete` 检查兼顾
- ✅ `search-widget.ts`：能力守卫 + 可选链调用

---

## 14. 应当重构的代码

### 14.1 设计变量重构（核心）

**文件：** `src/css/foundation/tokens.css`

**保留：** 变量命名规范、断点值、间距系统、颜色层级结构

**重构：**

```css
--hardy-font-sans:
  "Droid Serif", "PingFang SC", "Hiragino Sans GB", "Droid Sans Fallback", "Microsoft YaHei",
  sans-serif;
```

**文件：** `src/css/foundation/base.css`

```css
body {
  font-size: 18px; /* 从默认 16px */
  line-height: 1.5; /* 从 1.65 */
}
```

### 14.2 内容样式微调

| 文件                       | 重构项         | 当前值     | 目标值        |
| -------------------------- | -------------- | ---------- | ------------- |
| `content/prose.css`        | 正文字号/行高  | 16px / 1.9 | 18px / 1.5    |
| `content/detail.css`       | 移动端标题行高 | 1.2        | 1.25          |
| `components/post-card.css` | 摘要透明度     | 68%        | 80%           |
| `layout/sidebar.css`       | 标题行高       | 1.1        | 1.11（40/36） |

### 14.3 已知缺陷修复

**文件：** `src/css/layout/mobile-menu.css` 第 49 行

```css
.hardy-noscript-nav {
  background: var(--hardy-color-page); /* ❌ 该变量未定义 */
}
```

`--hardy-color-page` 在 `tokens.css` 中不存在，应为 `--hardy-color-bg` 或 `--hardy-color-surface`。这会导致 noscript 导航背景透明。

---

## 15. 建议彻底重写的代码

### 15.1 遗留样式清理

**文件：** `src/css/components/legacy.css`（101 行）

**判断依据：**

- 定义 `.post-list`、`.post-item`、`.article-content` 等旧类名
- 与当前 `.hardy-*` 命名体系完全不一致
- 未在 `src/css/main.css` 的 `@import` 列表中（已确认 main.css 无此导入）

**处理方案：**

1. 全局搜索确认无模板引用旧类名
2. 直接删除该文件

**注意：** `main.css` 当前并未导入 `legacy.css`，因此它已是无效文件，删除风险极低。

### 15.2 不需要重写的部分

经审计，**除 `legacy.css` 外，所有其他代码都不需要推倒重写**。

当前问题主要是：

- **参数级错误**（字体、字号、行高）→ 调整设计变量即可
- **细节不准**（透明度、微调）→ 局部 CSS 调整
- **验证不足**（视觉矩阵、插件状态）→ 补充测试

**不存在需要重写模板结构或重构组件架构的问题。** Codex 留下的架构边界（Thymeleaf 渲染 / Vite 组合 / TS 增强）是正确的，应当保留。

---

## 16. 推荐的设计系统

### 16.1 核心设计变量

| 变量                           | 推荐值                              | 依据                         |
| ------------------------------ | ----------------------------------- | ---------------------------- |
| `--hardy-font-sans`            | `"Droid Serif", "PingFang SC", ...` | 参考站计算样式               |
| 基础字号                       | `18px`                              | 参考站观察                   |
| 基础行高                       | `1.5`                               | 参考站观察（18/27px）        |
| `--hardy-shell-max`            | `1400px`                            | 参考站观察 ✅ 已正确         |
| `--hardy-shell-breakpoint`     | `1024px`                            | 参考站观察 ✅ 已正确         |
| `--hardy-list-breakpoint`      | `768px`                             | 参考站观察 ✅ 已正确         |
| `--hardy-sidebar-width`        | `25%`                               | 参考站观察 ✅ 已正确         |
| `--hardy-content-width`        | `75%`                               | 参考站观察 ✅ 已正确         |
| `--hardy-mobile-header-height` | `68px`                              | 参考站观察 ✅ 已正确         |
| `--hardy-mobile-drawer-width`  | `min(320px, 86vw)`                  | 参考站观察 ✅ 已正确         |
| `--hardy-duration-base`        | `220ms` → 可能应为 `300ms`          | 参考站观察约 300ms，**推断** |

### 16.2 字体层级

| 用途                 | 字号 | 行高 | 字重 | 依据                    |
| -------------------- | ---- | ---- | ---- | ----------------------- |
| 侧边栏站点标题       | 36px | 1.11 | 800  | 参考站观察（36/40）     |
| 侧边栏副标题         | 18px | 1.5  | 300  | 参考站观察（18/27）     |
| 文章卡片标题         | 20px | 1.4  | 800  | 参考站观察（20/28）     |
| 文章卡片摘要         | 18px | 1.5  | 300  | 参考站观察（18/27）     |
| 文章详情标题（桌面） | 30px | 1.2  | 800  | 参考站观察（30/36）     |
| 正文                 | 18px | 1.5  | 400  | 参考站观察              |
| 元信息               | 14px | 1.5  | 400  | **当前代码 + 合理推断** |
| 页面标题             | 18px | 1.55 | 600  | 参考站观察（18/28）     |

### 16.3 间距、圆角、动画

保持当前值（4px 倍数体系、4/8/999px 圆角、160/220ms 动画）。这些值来自当前代码且与参考站观察不冲突，无需改动。

### 16.4 颜色系统

**当前色值来源不明**，命名层级（bg/surface/text/muted/subtle/border/accent）合理，但具体色值**未经与参考站像素级对比**。

参考站观察值：

- 浅色背景：白色，文字约 `oklch(27.8% 0.0296 256.848)`
- 深色背景：约 `oklch(28.8% 0.0221 277.509)`，接近白色文字

**建议：** 保留当前结构，在阶段 3 用取色工具核对后再调整。**不要把当前色值当作已验证的正确值。**

### 16.5 响应式布局原则

| 视口           | 布局                                               |
| -------------- | -------------------------------------------------- |
| < 768px        | 单栏堆叠，封面全宽 224px 高，移动头部固定 68px     |
| 768px - 1023px | 卡片横向（224x160 封面 + 32px 间距），仍为移动外壳 |
| ≥ 1024px       | 侧边栏 25% sticky + 内容 75%，目录显示，抽屉禁用   |
| ≥ 1400px       | 外壳达到最大宽度并居中                             |

---

## 17. 推荐的页面结构

**当前结构无需调整。** 理由：

1. 布局正确（25% + 75%，1024px 断点）
2. 组件充分复用（post-card 被 4 个路由共用）
3. 模板职责清晰（layout → shell → components）
4. Thymeleaf 无重复逻辑，无路由条件分支污染组件
5. 能力守卫正确（所有可选插件路由）

保持现有结构：

```
src/
├── partials/
│   ├── layout.html          # 全局 shell
│   ├── shell/               # 4 个外壳片段
│   └── components/          # 6 个可复用组件
└── *.html                   # 14 个页面模板
```

---

## 18. 分阶段实施计划

### 阶段 1：修复阻断问题和设计变量【紧急】

**目标：** 通过 `pnpm check`，修正字体和字号

**涉及文件：**

- `.claude/settings.local.json`
- `src/css/foundation/tokens.css`
- `src/css/foundation/base.css`
- `src/css/content/prose.css`
- `src/css/layout/mobile-menu.css`（修复未定义变量）

**应保留：** 所有变量命名、断点、间距系统

**应重构：** 字体族、基础字号、正文字号行高、`--hardy-color-page` 笔误

**Halo 契约风险：** 无（纯样式改动）

**视觉验收：** 正文字号目测接近参考站，中文渲染正常

**功能验收：** 所有页面正常渲染，无布局破坏

**命令：**

```bash
pnpm check:fix
pnpm check
pnpm build
```

**剩余风险：** 衬线字体在部分 Windows 环境可能回退，需验证 CJK 字形

**需要确认：** 是（字体族变更影响整体风格）

---

### 阶段 2：清理遗留代码【高】

**目标：** 删除 `legacy.css`

**涉及文件：** `src/css/components/legacy.css`

**应保留：** 无

**应重写：** 删除整个文件

**Halo 契约风险：** 无

**验收：** `grep -r "\.post-item\|\.article-content" src/` 返回空

**命令：**

```bash
grep -rn "post-item\|article-content\|\.post-list" src/
pnpm build
```

**需要确认：** 否（该文件未被 main.css 导入，已是死代码）

---

### 阶段 3：视觉细节微调【中】

**目标：** 修正行高、透明度、颜色

**涉及文件：** `content/detail.css`、`components/post-card.css`、`layout/sidebar.css`

**Halo 契约风险：** 无

**视觉验收：** 逐页对比 `references/` 截图，DevTools 测量关键尺寸

**需要确认：** 否

---

### 阶段 4：完成 M7 插件运行时验证【中】

**目标：** 验证 Links/Moments/Photos 的安装、禁用、缺失、空、填充态

**涉及文件：** 无（测试为主）

**Halo 契约风险：** 高——可能发现契约错误需回到模板修改

**功能验收：** 插件缺失时路由不崩溃；媒体内容正确渲染

**需要确认：** 是（需要在你的 Halo 实例上启停插件）

---

### 阶段 5：M8 视觉矩阵测试【中】

**目标：** 390/768/1024/1280/1920px × light/dark/auto

**验收：** 无横向溢出、颜色模式正确继承、断点切换正常

**需要确认：** 是（需要测试环境和时间投入）

---

### 阶段 6：无障碍检查【低】

**目标：** 键盘导航、焦点可见、ARIA、对比度

**验收：** 所有交互元素可键盘访问，抽屉焦点陷阱正确

---

### 阶段 7：兼容性声明修正【低】

**目标：** `theme.yaml` 的 `requires` 与实际测试一致

**涉及文件：** `theme.yaml`、`README.md`

**需要确认：** 是（是否接受降级为 `>=2.25.0`）

---

## 19. 每个阶段的验收方式

| 阶段 | 验收命令                    | 通过标准                |
| ---- | --------------------------- | ----------------------- |
| 1    | `pnpm check && pnpm build`  | 均退出码 0              |
| 2    | `grep -rn "post-item" src/` | 空结果                  |
| 3    | 浏览器 DevTools 测量        | 关键尺寸与截图一致      |
| 4    | 插件启停 + 页面访问         | 无 500 错误、无 JS 异常 |
| 5    | 多视口截图                  | 无横向滚动条            |
| 6    | 键盘 Tab 遍历               | 焦点顺序合理且可见      |
| 7    | 文档核对                    | 声明与证据一致          |

---

## 20. 可能破坏 Halo 功能的风险

### 20.1 已规避的风险

- ✅ 评论资源标识正确（Post / SinglePage / Moment / Photo / Plugin）
- ✅ 插件能力守卫覆盖所有可选路由
- ✅ URL 全部使用 `@{...}`，无硬编码前缀
- ✅ 分页使用服务端提供的 `prevUrl`/`nextUrl`
- ✅ `<halo:footer />` 位置正确
- ✅ 仅 `content.content` 使用 `th:utext`

### 20.2 需要注意的风险

| 风险点                      | 状态          | 缓解措施                    |
| --------------------------- | ------------- | --------------------------- |
| 修改字体后 CJK 渲染         | ⚠️ 未测试     | 阶段 1 后测试中日韩字符     |
| 插件 UI 继承颜色模式        | ⚠️ 部分验证   | 阶段 5 测试所有插件深色模式 |
| `--hardy-color-page` 未定义 | ❌ 已确认缺陷 | 阶段 1 修复                 |
| Thymeleaf 缓存              | ⚠️ 开发需禁用 | 文档已说明                  |

---

## 21. 需要我确认的决策

### 决策 1：字体族修改

参考站使用 `Droid Serif` 衬线字体，Hardy 当前使用 `Inter`。修改后整体风格明显变化。

- **A.** 完全复刻参考站字体（推荐）
- **B.** 保持 Inter 但调整字号行高
- **C.** 提供配置项让用户选择

### 决策 2：`legacy.css` 处理

- **A.** 直接删除（推荐——该文件未被 `main.css` 导入，已是死代码）
- **B.** 保留但标记 deprecated

### 决策 3：Halo 2.0.0 兼容性声明

- **A.** 寻找 2.0.0 实例测试
- **B.** 改为 `>=2.25.0`（推荐——务实且诚实）
- **C.** 文档标注"理论兼容，未实机验证"

### 决策 4：执行顺序

- **A.** 先修复视觉（阶段 1-3），再测试（推荐——快速看到效果）
- **B.** 同步进行
- **C.** 先测试再统一修复

---

## 22. 推荐立即开始的第一阶段

**阶段 1：修复阻断问题和设计变量**

### 执行步骤

```bash
# 1. 修复格式
pnpm check:fix
pnpm check
```

### 编辑清单

**`src/css/foundation/tokens.css`** 第 13-14 行：

```css
--hardy-font-sans:
  "Droid Serif", "PingFang SC", "Hiragino Sans GB", "Droid Sans Fallback", "Microsoft YaHei",
  sans-serif;
```

**`src/css/foundation/base.css`** body 规则：

```css
body {
  font-family: var(--hardy-font-sans);
  font-size: 18px;
  line-height: 1.5;
  color: var(--hardy-color-text);
  background: var(--hardy-color-bg);
  letter-spacing: 0;
}
```

**`src/css/content/prose.css`** 第 1-6 行：

```css
.hardy-prose {
  color: var(--hardy-color-text);
  font-size: 18px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
```

**`src/css/layout/mobile-menu.css`** 第 49 行（修复未定义变量）：

```css
background: var(--hardy-color-bg);
```

### 验收

```bash
pnpm check   # 必须通过
pnpm build   # 必须成功
```

然后在浏览器对比首页和文章页的字体、字号、行高。

---

## 附录 A：审计限制说明

1. **未运行 `pnpm build`**：本轮为只读审计，构建产物数据来自 2026-08-07 09:15 的既有输出和 `docs/testing/m8-hardening-audit.md`。
2. **未启动开发服务器**：未对当前实现做实机截图，视觉差异分析基于源码尺寸值与 `research/ryanc.cc/ANALYSIS.md` 的对比。
3. **未访问参考站**：参考站结构信息全部来自仓库内已有的 `research/` 分析文档，非本轮实时抓取。
4. **截图为二进制**：`references/` 中 7 张 PNG 未做像素级解析，页面特征描述来自文件名语义与 `ANALYSIS.md` 的交叉印证。
5. **颜色值未验证**：`tokens.css` 中的具体色值来源不明，未与参考站做取色对比。

以上限制意味着：**布局尺寸类结论证据充分；颜色和字体渲染类结论需在阶段 1 后实机复核。**

## 附录 B：文件统计

| 类别            | 数量 |
| --------------- | ---- |
| HTML 页面模板   | 14   |
| Thymeleaf 片段  | 10   |
| CSS 文件        | 22   |
| TypeScript 文件 | 10   |

| 构建产物                | 大小   |
| ----------------------- | ------ |
| `main-B8AR9j3W.js`      | 6.9 KB |
| `main-CYbnClzO.css`     | 25 KB  |
| `theme-hardy-0.1.0.zip` | 63 KB  |

---

**审计完成：** 2026-08-07  
**下一步：** 等待确认后执行阶段 1
