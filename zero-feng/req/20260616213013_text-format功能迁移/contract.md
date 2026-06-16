# Text-Format 功能迁移 - 需求合同

## 范围

### 包含内容
- 将 `/Users/lif/Documents/code/outweb/common_web/text-format_ori` 的 Text-Format 在线文本处理站迁移到当前 `/Users/lif/Documents/code/outweb/common_web/text-format` 的 TanStack Start / Paraglide / Tailwind 项目框架内。 [confirmed]
- 保留旧站六种语言: `en`、`zh`、`ko`、`ja`、`de`、`ar`。 [confirmed]
- 保留旧站公开 URL 结构: 英文默认无语言前缀, 其他语言使用 `/{locale}` 前缀。 [confirmed]
- 保留旧站五个工具页面: 首页文本清理、`/deleteformat`、`/formathtmlonline`、`/removeduplicates`、`/fontremover`。 [confirmed]
- 保留旧站两个法律页面: `/privacy-policy`、`/terms-of-service`。 [confirmed]
- 保留旧站页面功能、SEO 内容、`title`、`description`、`keywords`、canonical、hreflang、监控、广告、`h1/h2/h3`、正文和 FAQ 内容, 迁移后以旧站 `messages/*.json` 和页面结构为准。 [confirmed]
- 保留旧站 AdSense client、广告 slot、`ads.txt` 和 pageview 监控脚本。 [confirmed]
- 删除当前 ShipAny 模板中对该站无用的登录、注册、认证、后台、支付、订阅、积分、数据库、RBAC、CMS、博客、用户中心、工单、邀请码、API Key、AI、存储和邮件业务能力。 [confirmed]

### 排除内容
- 不保留当前 ShipAny 默认 landing、pricing、blog、admin、settings、auth 相关页面和接口。 [confirmed]
- 不新增登录态、用户数据、支付、订阅、积分或后台配置能力。 [confirmed]
- 不接入数据库持久化, 文本处理结果不保存到服务端。 [confirmed]
- 不改变旧站既有文本处理算法语义, 除非为适配新框架做等价重构。 [confirmed]
- 不重写 SEO 文案为新营销文案, 不压缩或改写旧站关键词密度相关正文。 [confirmed]

## 业务规则
- 所有文本处理操作在浏览器端完成, 输入内容不发送到业务 API 或服务端持久化。 [confirmed]
- 首页文本清理工具必须保留旧站的常用按钮: Remove Extra Spaces、Remove Empty Lines、Remove line breaks、UPPERCASE ALL、lowercase all、Capitalize sentences、Capitalize Words、Remove Duplicate Lines、Copy、Clear。 [confirmed]
- 首页文本清理工具必须保留旧站的设置区: Character Setting、HTML Setting、Multiple Line Setting、Find and Replace Setting。 [confirmed]
- `/deleteformat` 必须保留删除多余空格、删除换行、删除格式字符、删除缩进四类设置。 [confirmed]
- `/formathtmlonline` 必须保留旧站 HTML 格式化行为: 标签间换行、注释换行、两空格缩进、自闭合标签识别、结束标签回退缩进。 [confirmed]
- `/removeduplicates` 必须保留去重行、忽略大小写、升序排序、降序排序, 且升序和降序互斥。 [confirmed]
- `/fontremover` 必须保留旧站 Unicode 装饰字体映射能力, 包括数学字母数字符号、圈字/圈数、带括号字母、罗马数字、全角字符、上下标、部分反转/特殊符号映射, 并保留 `preserve_symbols` 输入。 [confirmed]
- 复制成功沿用旧站视觉反馈: 触发 `canvas-confetti` 动效。 [confirmed]
- 页面导航必须保留旧站顶部菜单项: Text Format、Delete Format、Format HTML、Remove Duplicates、Font Remover, 以及 GitHub 链接 `https://github.com/outwebfeng/text-format`。 [confirmed]
- 页脚必须保留旧站 Legal 链接和站点描述语义。 [confirmed]
- 页面主视觉背景、暗色站点基调、主要文本区域、工具输入区域和说明区的视觉结构应尽量接近旧站, 但允许使用当前框架的构建方式实现。 [confirmed]
- 当前项目构建后不应要求 `.env.development` 中存在 `DATABASE_URL`、`AUTH_SECRET` 或支付/认证相关密钥才能访问公开工具页。 [confirmed]

## 边界与异常场景
- 当输入为空时, 文本处理按钮不得抛出运行时错误; 能按旧站行为返回空内容或保持空内容。 [confirmed]
- 当剪贴板 API 写入失败时, 页面必须给出可观察失败提示或 console/error 记录, 不导致页面崩溃。 [confirmed]
- 当 HTML 输入标签不完全匹配时, `/formathtmlonline` 必须按旧站宽松策略尽量格式化, 不要求严格 HTML parser 抛错。 [confirmed]
- 当 `/removeduplicates` 同时选择升序和降序时, 后选择项必须取消另一项。 [confirmed]
- 当 `/fontremover` 遇到未映射字符时, 必须保留原字符。 [confirmed]
- 当用户访问当前项目原 ShipAny 路由如 `/admin`、`/settings`、`/pricing`、`/blog`、`/sign-in` 时, 不得出现可用的登录、后台、支付或博客业务页面。 [confirmed]
- 当访问 API 路径时, 不应存在可用的 auth/payment/admin/settings 等旧模板业务接口。 [confirmed]

## 验收标准

### 正常路径

**AC-001**: 六语言首页可访问并渲染旧站文本清理工具 [confirmed]
- Given: 构建后的新项目运行中
- When: 打开 `/`、`/zh`、`/ko`、`/ja`、`/de`、`/ar`
- Then: 页面显示对应语言的旧站首页 `title/description/h1/h1_desc`、文本输入框、常用按钮、四个设置区、说明正文和 FAQ 内容
- Verify-By: ui-test - 用浏览器逐语言打开页面, 断言 H1、textarea、常用按钮、`Character/HTML/Multiple Line/Find and Replace` 设置区或对应本地化文案存在

**AC-002**: 首页常用文本操作保持旧站行为 [confirmed]
- Given: 首页文本框输入包含多空格、空行、换行、大小写混合和重复行的文本
- When: 依次点击 Remove Extra Spaces、Remove Empty Lines、Remove line breaks、UPPERCASE ALL、lowercase all、Capitalize sentences、Capitalize Words、Remove Duplicate Lines、Clear
- Then: textarea 内容按旧站 `PageComponent.tsx` 对应函数处理, Clear 后为空
- Verify-By: ui-test - 输入样例文本后点击每个按钮, 断言 textarea 值与旧站函数期望输出一致

**AC-003**: 首页高级设置处理保持旧站行为 [confirmed]
- Given: 首页文本框输入包含标点、emoji、非 ASCII、邮箱、HTML 标签、id/class、HTML entity、URL 编码、多行文本、空格和 tab
- When: 勾选对应 Character/HTML/Multiple Line/Find and Replace 设置并点击 Clean Text
- Then: textarea 内容按旧站 `applySettings` 逻辑删除、解码、逐行增删、查找替换、空格/tab 转换
- Verify-By: ui-test - 针对每类设置执行最小样例, 断言输出与旧站逻辑一致

**AC-004**: `/deleteformat` 保持旧站删除格式能力 [confirmed]
- Given: `/deleteformat` 页面输入含多空格、换行、tab/form feed/vertical tab、行首缩进的文本
- When: 勾选四个设置并点击 Apply Changes
- Then: textarea 内容按旧站 `DeleteFormatComponent.tsx` 逻辑处理
- Verify-By: ui-test - 打开 `/deleteformat`, 输入样例并断言处理结果

**AC-005**: `/formathtmlonline` 保持旧站 HTML 格式化能力 [confirmed]
- Given: `/formathtmlonline` 页面输入单行或紧凑 HTML
- When: 点击 Format HTML
- Then: 输出按旧站算法在标签间换行并使用两空格缩进, 保留可识别自闭合标签和注释处理
- Verify-By: ui-test - 输入 `<div><p>Hello</p><br/></div>`, 断言输出包含分行和缩进

**AC-006**: `/removeduplicates` 保持旧站去重和排序能力 [confirmed]
- Given: `/removeduplicates` 页面输入含重复行和大小写差异的文本
- When: 分别测试默认去重、Ignore Case、Sort Ascending、Sort Descending
- Then: 输出按旧站 `RemoveDuplicatesComponent.tsx` 逻辑去重和排序, 升序/降序互斥
- Verify-By: ui-test - 输入样例并断言输出行顺序与去重结果

**AC-007**: `/fontremover` 保持旧站字体样式移除能力 [confirmed]
- Given: `/fontremover` 页面输入花体/粗体数学字母、全角字符、圈字、罗马数字、上下标和未映射字符
- When: 点击 Apply
- Then: 已映射字符转换为普通字符, 未映射字符保留; `preserve_symbols` 中字符不转换
- Verify-By: ui-test - 输入 `𝐀ｂ①Ⅰ²` 等样例, 断言输出包含对应普通字符

**AC-008**: 法律页面内容保持旧站语义 [confirmed]
- Given: 新项目运行中
- When: 打开 `/privacy-policy`、`/terms-of-service` 及其六语言版本
- Then: 页面显示旧站对应语言的标题、更新时间、段落和 `support@text-format.com`
- Verify-By: ui-test - 打开英文和至少一个非英文法律页, 断言 H1、日期、联系邮箱存在

### SEO / 外部可见标准

**AC-009**: 每个页面的 title/description/keywords 保持旧站文案 [confirmed]
- Given: 任一公开页面及任一支持语言
- When: 查看页面 `<head>`
- Then: `title`、`meta[name="description"]`、`meta[name="keywords"]` 使用 `text-format_ori/messages/{locale}.json` 对应节点文案
- Verify-By: integration-test - 抓取渲染 HTML 或 head 数据, 对比旧站 messages JSON 中对应值

**AC-010**: canonical 与 hreflang 保持旧站语义 [confirmed]
- Given: 任一公开页面及任一支持语言
- When: 查看页面 `<head>`
- Then: 存在 canonical 指向当前语言 URL; 存在六语言 alternate hreflang, 英文提供 `x-default`
- Verify-By: integration-test - 对 `/`, `/zh`, `/de/formathtmlonline` 等样例断言 canonical 和 alternate 链接

**AC-011**: sitemap 保持旧站公开工具 URL 集合 [confirmed]
- Given: 新项目运行中
- When: 请求 `/sitemap.xml`
- Then: XML 包含旧站 sitemap 中 30 个工具 URL: 5 个工具页面乘 6 种语言, `changefreq=weekly`, `priority=0.8`
- Verify-By: integration-test - 请求 `/sitemap.xml`, 断言 URL 数量和关键 URL 如 `https://text-format.com/fontremover`、`https://text-format.com/de/removeduplicates`

**AC-012**: robots 与 ads.txt 保持旧站语义 [confirmed]
- Given: 新项目运行中
- When: 请求 `/robots.txt` 和 `/ads.txt`
- Then: `/robots.txt` 保留旧站 Allow/Disallow 和 Sitemap 语义; `/ads.txt` 返回 `google.com, pub-7741547389250990, DIRECT, f08c47fec0942fa0`
- Verify-By: integration-test - 请求两个路径并断言关键行

**AC-013**: 广告和监控保持旧站集成 [confirmed]
- Given: 公开页面渲染
- When: 查看 HTML 和浏览器运行时
- Then: pageview 脚本 `https://app.pageview.app/js/script.js` 存在; AdSense 使用 `ca-pub-7741547389250990`, 首页保留 slot `7321261240`, 固定广告保留 slot `9909889778`
- Verify-By: ui-test - 打开首页和子工具页, 断言脚本和广告 `<ins class="adsbygoogle">` 的 client/slot 属性

### 删除范围

**AC-014**: 无用 SaaS 页面和业务接口被移除或不可用 [confirmed]
- Given: 新项目构建后运行
- When: 访问 `/admin`、`/settings`、`/pricing`、`/blog`、`/sign-in`、`/sign-up`、`/api/auth/*`、`/api/payment/*`、`/api/admin/*`
- Then: 不存在可用的登录、后台、支付、博客、用户中心或相关业务 API
- Verify-By: integration-test - 请求这些路径, 断言 404/重定向到公开站点/无业务表单或接口能力

**AC-015**: 构建不依赖数据库、认证或支付密钥 [confirmed]
- Given: 仅提供公开站点必要环境变量 `VITE_APP_URL=https://text-format.com`、`VITE_APP_NAME=Text-Format`
- When: 执行 `pnpm build`
- Then: 构建通过, 不要求 `DATABASE_URL`、`AUTH_SECRET`、支付、OAuth、邮件、存储或 AI 相关密钥
- Verify-By: build-check - 清理本地仅业务密钥后执行 `pnpm build`

### 非功能性标准

**AC-016**: 迁移后首屏和 SEO 内容可被服务端渲染发现 [confirmed]
- Given: 新项目生产构建运行
- When: 请求公开页面 HTML
- Then: 关键 `title`、`description`、canonical、hreflang、H1、H2/H3 说明内容在 HTML 或 TanStack SSR 输出中可被爬虫读取, 不依赖用户交互后才出现
- Verify-By: integration-test - 使用 `curl` 或 Playwright `page.content()` 检查关键 head 与正文文本

## API 合约
- 不新增公开业务 API; 文本处理在客户端完成。 [confirmed]
- 删除或停用当前模板的 auth、payment、admin、settings、user、credits、tickets、storage、invite-code、apikey 等业务 API。 [confirmed]
- 保留 SEO 文件路由 `/robots.txt`、`/sitemap.xml`、`/ads.txt` 的公开 GET 输出。 [confirmed]

## 状态与权限语义
- 全站公开页面无需登录即可访问。 [confirmed]
- 迁移后不存在用户登录态、管理员权限、角色权限、支付状态、积分状态、订阅状态或工单状态。 [confirmed]

## 外部集成合约
- AdSense client 固定为 `ca-pub-7741547389250990`; 首页自适应广告 slot 固定为 `7321261240`; 固定横幅广告 slot 固定为 `9909889778`。 [confirmed]
- Pageview 监控脚本固定为 `<script defer data-domain="text-format.com" src="https://app.pageview.app/js/script.js"></script>`。 [confirmed]
- `ads.txt` 固定为 `google.com, pub-7741547389250990, DIRECT, f08c47fec0942fa0`。 [confirmed]
- 站点正式 URL 固定按 `https://text-format.com` 生成 canonical、alternate 和 sitemap。 [confirmed]

## 关键流程
- 用户打开公开工具页 -> 页面按 locale 读取旧站文案 -> SSR/head 输出 SEO 标签 -> 浏览器加载工具组件 -> 用户输入文本 -> 客户端函数处理文本 -> textarea 原位展示结果 -> 用户可复制或清空。 [confirmed]
- 用户切换语言 -> 跳转到对应 `/{locale}` 前缀页面或英文无前缀页面 -> 保持当前工具路径语义。 [confirmed]
