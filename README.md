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

主题当前以 `0.1.0` 作为个人测试版。已在 Halo `2.25.4` 测试站验证核心列表、文章、独立页面、作者和已启用的 Moments、Links、Photos 路由；`theme.yaml` 中的 `>=2.0.0` 下限尚未在 Halo `2.0.0` 实例上实机验证，不应视为已完成的兼容性证明。

已验证的可选插件包括 Search Widget、Comment Widget、Moments、Links 和 Photos。Shiki 代码块与 KaTeX MathML fixture 已在前台观察到；hyperlink-card 和插件缺失态仍在持续验证。插件未安装时，主题会隐藏依赖其能力的入口或保留核心内容布局。

## 设置

控制台中的 `Basic` 组提供自定义页脚文本，`Appearance` 组提供 `auto`、`light`、`dark` 三种默认颜色模式。访客在浏览器中做出的颜色模式选择优先于主题默认值；设置名称和 ConfigMap 分别为 `theme-hardy-setting` 与 `theme-hardy-configMap`。

## 已知限制

- 发布脚本会在临时 staging 目录中调用官方打包 CLI，发布 ZIP 不包含开发用的 `pnpm-workspace.yaml`。
- 完整的多视口浅色/深色视觉矩阵、无障碍人工审查、Halo `2.0.0` 兼容性和可选插件缺失/禁用态尚未全部完成。
- 参考站点快照仅保存在本地 `research/`，不会被主题运行时或发布包使用。

## 命令

| 命令                 | 作用                                         |
| -------------------- | -------------------------------------------- |
| `pnpm dev`           | 监听源码并持续生成 `templates/`              |
| `pnpm check`         | 只读执行格式、Lint 和类型检查                |
| `pnpm check:fix`     | 自动修复格式和 Lint 问题                     |
| `pnpm build-only`    | 类型检查并生成 `templates/`                  |
| `pnpm build`         | 构建主题并在 `dist/` 生成发布 ZIP            |
| `pnpm package`       | 从现有 `templates/` 生成不含开发元数据的 ZIP |
| `pnpm prepare`       | 配置 Vite Plus Git hooks 与 Agent 集成       |
| `pnpm skills:update` | 更新仓库内的 Agent Skills                    |

官方文档：<https://docs.halo.run/developer-guide/theme/prepare>

实现文档：

- [Implementation specification](docs/implementation-spec.md)
- [Detailed implementation plan](docs/implementation-plan.md)

## License

[GPL-3.0](LICENSE)
