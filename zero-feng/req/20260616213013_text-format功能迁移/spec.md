# Text-Format 功能迁移 - 技术规格 [locked - feng-dev must follow]

## 改动范围
- 涉及模块:
  - `project.inlang/settings.json`、`messages/*.json`: 扩展 Paraglide locale 到 `en/zh/ko/ja/de/ar`, 迁移旧站文案。
  - `src/router.tsx`、`vite.config.ts`: 调整 Paraglide URL pattern, 实现英文无前缀、其他语言有前缀的路由。
  - `src/routes/index.tsx`: 改为 Text-Format 首页文本清理工具。
  - `src/routes/deleteformat.tsx`、`src/routes/formathtmlonline.tsx`、`src/routes/removeduplicates.tsx`、`src/routes/fontremover.tsx`: 新增四个工具页面。
  - `src/routes/(pages)/privacy-policy.tsx`、`src/routes/(pages)/terms-of-service.tsx` 或等价公开路由: 用旧站文案重建法律页面。
  - `src/routes/__root.tsx`: 移除模板认证/DB 配置依赖, 注入旧站监控/广告所需全局 head/script 语义。
  - `src/routes/robots[.]txt.ts`、`src/routes/sitemap[.]xml.ts`, 新增 `src/routes/ads[.]txt.ts`: 按旧站输出 SEO 文件。
  - `src/components/text-format/*`: 新增 Text-Format 专用 header、footer、SEO head helper、广告组件、工具表单组件。
  - `src/lib/text-format/*`: 新增纯文本处理函数, 从旧站组件逻辑等价抽取。
  - `package.json`、`pnpm-lock.yaml`: 移除无用 SaaS 依赖与脚本, 保留构建必需依赖; 如继续使用 `canvas-confetti`, 保留依赖。
  - `src/routes/api/**`、`src/routes/admin/**`、`src/routes/settings/**`、`src/routes/(auth)/**`、`src/routes/blog/**`、`src/routes/pricing.tsx`、`src/modules/**`、无用 `src/core/**`: 删除或断开无用 ShipAny 业务。
- 不动:
  - 不手改 `src/routeTree.gen.ts`; 让 TanStack Start 构建/生成流程更新。
  - 不引入数据库 schema/migration。
  - 不保留 ShipAny 默认 blocks 内容。
  - 不改旧站 SEO 文案含义和关键词密度。

## 切入顺序
1. 先收敛路由与国际化底座
   - 做法: 将 `project.inlang/settings.json` locales 扩展为 `["en","zh","ko","ja","de","ar"]`; 将 `text-format_ori/messages/{locale}.json` 的内容迁移到当前 `messages/{locale}.json`。旧站是嵌套 JSON, Paraglide 当前项目用 flat dot-keyed JSON; 需要转换为 `IndexPage.title`、`textClean.h1` 这类 dot key, 或实现一个本地 typed message map, 但页面使用时必须仍来自当前项目的消息源。
   - 做法: 在 `vite.config.ts` 的 `paraglideVitePlugin.urlPatterns` 中增加 6 语言映射; 英文使用无前缀 `/`, 其他语言分别 `/zh`、`/ko`、`/ja`、`/de`、`/ar`; API/SEO 文件不加语言前缀。
   - 验证: `pnpm build` 至少能生成/编译 Paraglide 消息; 若此步还未删完旧模块, 可先用 `pnpm build` 看 i18n 配置错误。
2. 再抽取旧站文本处理逻辑
   - 做法: 从 `text-format_ori/src/app/[locale]/PageComponent.tsx` 抽取首页常用按钮和 `applySettings` 逻辑到 `src/lib/text-format/text-clean.ts`。
   - 做法: 从 `DeleteFormatComponent.tsx`、`FormatHtmlComponent.tsx`、`RemoveDuplicatesComponent.tsx`、`FontRemoverComponent.tsx` 抽取 `deleteFormat`、`formatHtml`、`removeDuplicateLines`、`removeFonts` 等纯函数到 `src/lib/text-format/*`。
   - 做法: UI 组件调用纯函数, 不把复杂处理逻辑散落在 JSX 内。
   - 验证: 可用 `pnpm exec tsc --noEmit` 或 `pnpm build` 做类型检查; 若项目无测试框架, 后续用 Playwright/浏览器手动验证 AC。
3. 重建公开站点组件
   - 做法: 新建 `src/components/text-format/site-header.tsx`, 复刻旧站菜单、GitHub 链接、语言切换逻辑; 使用当前 `@/core/i18n/navigation` 的 `Link` 或普通链接, 保证 locale-aware URL 正确。
   - 做法: 新建 `site-footer.tsx`, 保留旧站 Legal 链接和描述。
   - 做法: 新建 `seo.tsx` 或路由 `head` helper, 统一生成 `title`、`description`、`keywords`、canonical、hreflang、pageview script。
   - 做法: 新建 `google-ad.tsx`、`google-ad-fixed.tsx`, 等价迁移旧站 AdSense client/slot 和初始化逻辑。
   - 验证: 启动 dev server 后打开首页, 检查 header/footer/语言切换/广告容器。
4. 重建五个工具页面
   - 做法: 将 `src/routes/index.tsx` 改为首页文本清理工具, 组合专用 header、SEO、工具表单、说明正文、广告、footer。
   - 做法: 新增 `deleteformat.tsx`、`formathtmlonline.tsx`、`removeduplicates.tsx`、`fontremover.tsx`, 分别复刻旧站页面结构、H1、说明、功能、FAQ、使用说明和使用场景。
   - 做法: 所有 H1/H2/H3/正文从迁移后的消息源读取, 不硬编码散落在组件内。
   - 验证: 用浏览器打开 `/`, `/deleteformat`, `/formathtmlonline`, `/removeduplicates`, `/fontremover`, 每页跑一个最小功能样例。
5. 重建法律页面和 SEO 文件
   - 做法: 法律页用旧站 `privacyPolicy`、`termsOfService` 文案渲染, 保留 `support@text-format.com`。
   - 做法: `/sitemap.xml` 固定输出旧站 30 个工具 URL, `changefreq=weekly`, `priority=0.8`; 不再输出 ShipAny pricing/blog/legal sitemap 条目, 除非旧站 sitemap 本身包含。
   - 做法: `/robots.txt` 保留旧站 Allow/Disallow/Sitemap 语义; `/ads.txt` 输出旧站广告行。
   - 验证: `curl http://localhost:3000/sitemap.xml`, `curl http://localhost:3000/robots.txt`, `curl http://localhost:3000/ads.txt`。
6. 删除 ShipAny 无用业务
   - 做法: 删除无用路由、API、modules、core provider、admin/settings/auth/blog/pricing blocks/components; 移除 `better-auth`、Drizzle、数据库驱动、Stripe/PayPal/Creem、Resend、Replicate、storage、react-email 等无用依赖和脚本。
   - 做法: 简化 `.env.example`: 保留 `VITE_APP_URL=https://text-format.com`、`VITE_APP_NAME=Text-Format`、可选 GA/AdSense 配置说明; 不再要求 `DATABASE_PROVIDER`、`DATABASE_URL`、`AUTH_SECRET`。
   - 做法: 简化 `wrangler.example.jsonc` 或部署文档, 去掉 D1/Hyperdrive 绑定要求。
   - 验证: `rg "better-auth|drizzle|stripe|paypal|creem|DATABASE_URL|AUTH_SECRET|admin|settings|pricing|blog" src package.json .env.example` 不应出现可用业务引用; 允许 README/历史说明在最终同步时清理。
7. 最后做端到端验证
   - 做法: 执行 `pnpm build`。
   - 做法: 启动本地服务, 用浏览器检查桌面和移动视口下五个工具页面、法律页、语言切换、SEO head、广告和监控。
   - 验证: AC-001 到 AC-016 全部按 contract 验证。

## 数据流
公开路由接收请求 -> Paraglide 根据 URL/cookie/baseLocale 解析 locale -> 路由 loader/head 读取对应消息函数 -> SSR 输出 head/正文骨架 -> 浏览器加载工具组件 -> 用户输入文本 -> `src/lib/text-format/*` 纯函数处理 -> 组件更新 textarea -> 用户复制/清空。

SEO 文件流: `/robots.txt`、`/sitemap.xml`、`/ads.txt` 请求 -> TanStack server route 返回固定文本/XML -> 不依赖数据库或运行时后台配置。

## 关键设计决策
- 使用当前 TanStack Start 文件路由承载旧站页面, 不嵌入 Next.js App Router 代码; 原因是当前项目框架已确定为 TanStack Start。
- 文本处理逻辑必须先抽成纯函数再接 UI; 原因是旧站逻辑集中在大客户端组件中, 直接迁移会让验证和后续维护困难。
- SEO 文案以旧站 messages 为源; 原因是用户明确要求 SEO 内容、H1/H2/H3 和关键词密度保持不变。
- 删除而不是隐藏 ShipAny 无用业务; 原因是用户确认删除登录/支付等能力, 且保留会引入数据库/认证密钥依赖和无关可访问面。
- AdSense 和 pageview 使用旧站固定配置; 原因是用户确认继续使用旧站集成。
- 不用数据库配置化广告/SEO; 原因是目标站是公开静态工具站, 且用户要求删除数据库/后台相关能力。

## 复用清单
- `text-format_ori/messages/{en,zh,ko,ja,de,ar}.json`: 文案和 SEO truth source。
- `text-format_ori/src/app/[locale]/PageComponent.tsx`: 首页 UI 结构、常用按钮、设置区、说明正文、主广告位置。
- `text-format_ori/src/app/[locale]/deleteformat/DeleteFormatComponent.tsx`: 删除格式逻辑和页面内容结构。
- `text-format_ori/src/app/[locale]/formathtmlonline/FormatHtmlComponent.tsx`: HTML 格式化逻辑。
- `text-format_ori/src/app/[locale]/removeduplicates/RemoveDuplicatesComponent.tsx`: 去重与排序逻辑。
- `text-format_ori/src/app/[locale]/fontremover/FontRemoverComponent.tsx`: Unicode 映射表和 preserve 逻辑。
- `text-format_ori/src/components/Header.tsx`、`Footer.tsx`、`HeadInfo.tsx`、`GoogleAd.tsx`、`GoogleAdFixed.tsx`: 站点 chrome、SEO head、广告/监控语义。
- `text-format_ori/public/robots.txt`、`sitemap.xml`、`ads.txt`: SEO 文件输出参考。
- 当前项目 `src/core/i18n/navigation.tsx`: locale-aware Link/router。
- 当前项目 `src/lib/utils.ts`: `cn` 等基础工具。
- 当前项目 shadcn/ui 基础组件可按需保留, 但工具页不应被重做成 ShipAny SaaS 风格。
- 测试先例: 当前项目没有测试框架, 以 `pnpm build`、curl 和浏览器 UI 验证作为回归验证主线。

## 新增依赖 / 新抽象
- 新抽象:
  - `src/lib/text-format/text-clean.ts`
  - `src/lib/text-format/delete-format.ts`
  - `src/lib/text-format/format-html.ts`
  - `src/lib/text-format/remove-duplicates.ts`
  - `src/lib/text-format/font-remover.ts`
  - `src/components/text-format/*`
- 新增依赖:
  - 无强制新增依赖。当前项目已有 `lucide-react` 和 Tailwind; 若 `canvas-confetti` 不在当前项目依赖中, 需要添加或用等价无依赖动画实现, 但 contract 要求复制成功视觉反馈, 优先添加 `canvas-confetti` 以贴近旧站。

## 风险与兜底
- Paraglide flat message 与旧站 nested JSON 结构不一致: 如果直接迁移 nested JSON 不被编译, 先写转换脚本或手动转为 dot-key; 不允许改写文案。
- URL pattern 扩到六语言后可能影响 route rewrite: 如果构建或运行出现 locale 前缀错误, 优先修 `vite.config.ts` 的 `urlPatterns` 和 `localeNames`, 不改 URL 契约。
- 删除依赖可能误删构建所需包: 每删一批跑 `pnpm build`; 构建缺包时只恢复框架/页面实际需要的依赖。
- 旧站广告脚本在本地可能被拦截或不展示真实广告: 验证以脚本标签、client/slot 属性和容器初始化为准, 不要求本地实际填充广告内容。
- SEO 内容“保持不变”与新框架 SSR 输出存在差异: 若 head helper 与 route head 重复或覆盖, 以最终 HTML 中可被爬虫读取的 title/meta/canonical/hreflang 为准修正。
- 当前工作树已有用户修改 `AGENTS.md`: 实施时不得回退用户已有修改, 只处理需求范围内文件。
