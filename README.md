# Hardy

Hardy 是一套供个人长期使用的 Halo 博客主题，采用 Thymeleaf、Vite、TypeScript 和 CSS 开发。

项目以简洁、内容优先的博客体验为目标。公开站点仅用于研究布局、响应式行为和交互逻辑；主题使用独立实现，不包含参考站点的品牌、文案、图标或资源。

## 开发环境

- Halo `>=2.0.0`
- Node.js 24（与发布工作流一致）
- pnpm 10.33.0

```bash
git clone git@github.com:hardyz0517/theme-hardy.git
cd theme-hardy
pnpm install
pnpm dev
```

`pnpm dev` 以监听模式构建主题。开发 Halo 实例应关闭 Thymeleaf 缓存，并将本目录放置或链接到 Halo 的 `themes/theme-hardy/`。

## 目录

- `src/`：人工维护的页面模板、partials、CSS 和 TypeScript。
- `templates/`：Vite 生成、Halo 实际读取的模板和静态资源；不要手工修改。
- `theme.yaml`：主题元数据。
- `settings.yaml`：Halo 控制台中的主题设置表单。
- `research/`：参考站点分析；`raw/` 快照仅供本地研究且不提交。

`@halo-dev/vite-plugin-halo-theme` 会把 `src/partials/` 中的 `<include>` / `<slot>` 在构建期展开。Thymeleaf 表达式仍由 Halo 在请求时渲染。

## 当前状态

主题当前版本为 `0.1.13`。已在 Halo `2.25.4` 测试站验证核心列表、文章、独立页面、作者和已启用的 Moments、Links、Photos 路由；`theme.yaml` 中的 `>=2.0.0` 下限尚未在 Halo `2.0.0` 实例上实机验证，不应视为已完成的兼容性证明。核心和插件路由已完成 390/768/1024/1280/1920px 的结构响应式检查。

已验证的可选插件包括 Search Widget、Comment Widget、Moments、Links 和 Photos。Shiki 代码块与 KaTeX MathML fixture 已在前台观察到；hyperlink-card 和插件缺失态仍在持续验证。插件未安装时，主题会隐藏依赖其能力的入口或保留核心内容布局。

## 设置

控制台中的 `基础设置` 提供自定义页脚和社交链接开关；`个人信息` 可设置侧栏头像、显示名称和一句话简介；`社交链接` 可配置 GitHub、邮箱、Twitter / X、Bilibili、微博、知乎、微信二维码、YouTube、小红书和个人网站。空值不会在前台显示，个人信息会回退到站点 Logo、标题和副标题。`外观` 组提供 `auto`、`light`、`dark` 三种默认颜色模式。访客在浏览器中做出的颜色模式选择优先于主题默认值；设置名称和 ConfigMap 分别为 `theme-hardy-setting` 与 `theme-hardy-configMap`。

## 支持范围

| 项目           | 当前证据                                                     |
| -------------- | ------------------------------------------------------------ |
| Halo           | 已在 `2.25.4` 安装并验证；`>=2.0.0` 的下限尚未经过实机验证。 |
| Search Widget  | 已验证 `1.7.1` 的触发、对话框和颜色模式继承。                |
| Comment Widget | 已验证 `3.1.2` 的 Post / SinglePage host 与可逆禁用回退。    |
| Moments        | 已验证 `1.16.1` 的已启用路由和一个公开详情 fixture。         |
| Links          | 已验证 `2.3.0-beta.4` 的已启用分组列表与移动端布局。         |
| Photos         | 已验证 `2.1.2` 的已启用列表、详情和相邻导航。                |

完整版本、契约和限制记录见
[`docs/contracts/compatibility-matrix.md`](docs/contracts/compatibility-matrix.md) 与
[`docs/contracts/plugin-support.md`](docs/contracts/plugin-support.md)。

## 升级

运行 `pnpm build` 后，在 Halo Console 的“主题管理 → 上传安装 / 升级”上传
`dist/theme-hardy-0.1.13.zip` 并确认升级。该版本没有 settings 或 annotation 字段迁移；已有
`theme-hardy-setting` 与 `theme-hardy-configMap` 配置可直接保留。旧版的 `basic.social_github`、`basic.social_email`、`basic.social_website` 仍会在未填写新版社交链接时作为兼容回退；后续可在“社交链接”页签中重新保存。升级后运行：

```bash
HALO_TEST_BASE_URL=https://your-halo.example pnpm test:smoke
```

超级管理员可从 `/archives` 右上角进入新建文章链接，也可从每篇文章标题右侧的铅笔图标进入编辑。两者共用主题“基础设置”的 `new_post_url`；编辑入口会自动追加 `?name=<文章 metadata.name>`。留空时回退到 Halo Console 的 `/console/posts/editor`，主题不提供单独的文章工作台。

## 视觉样本

本地视觉对比样本位于 `references/`，覆盖首页、归档、详情、关于、瞬间和友链。它们仅用于
开发验收，不会进入主题 ZIP；逐项检查方法见
[`docs/testing/PHASE-2-MANUAL-TEST-GUIDE.md`](docs/testing/PHASE-2-MANUAL-TEST-GUIDE.md)。

## 已知限制

- 发布脚本会在临时 staging 目录中调用官方打包 CLI，发布 ZIP 不包含开发用的 `pnpm-workspace.yaml`。
- 完整的逐页像素视觉矩阵、无障碍人工键盘/对比度审查、Halo `2.0.0` 兼容性和可选插件缺失/禁用态尚未全部完成。
- 参考站点快照仅保存在本地 `research/`，不会被主题运行时或发布包使用。

## 命令

| 命令                 | 作用                                             |
| -------------------- | ------------------------------------------------ |
| `pnpm dev`           | 监听源码并持续生成 `templates/`                  |
| `pnpm check`         | 只读执行格式、Lint 和类型检查                    |
| `pnpm check:fix`     | 自动修复格式和 Lint 问题                         |
| `pnpm build-only`    | 类型检查并生成 `templates/`                      |
| `pnpm build`         | 构建主题并在 `dist/` 生成发布 ZIP                |
| `pnpm test:smoke`    | 使用 `HALO_TEST_BASE_URL` 独立检查路由和主题资源 |
| `pnpm package`       | 从现有 `templates/` 生成不含开发元数据的 ZIP     |
| `pnpm prepare`       | 配置 Vite Plus Git hooks 与 Agent 集成           |
| `pnpm skills:update` | 更新仓库内的 Agent Skills                        |

官方文档：<https://docs.halo.run/developer-guide/theme/prepare>

实现文档：

- [Implementation specification](docs/implementation-spec.md)
- [Detailed implementation plan](docs/implementation-plan.md)

## License

[GPL-3.0](LICENSE)
