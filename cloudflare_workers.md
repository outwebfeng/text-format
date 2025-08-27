# Cloudflare Workers 部署 Next.js 完整指南

## 📚 学习总结：从错误到成功的完整路径

### 🎯 最终成功的配置

#### 1. 核心依赖（有效）
```json
{
  "dependencies": {
    "@opennextjs/cloudflare": "^1.6.5"  // ✅ Workers 部署的正确选择
  },
  "devDependencies": {
    "esbuild": "0.17.19",  // ✅ 解决版本兼容性的关键
    "wrangler": "^4.32.0"
    // ❌ 不要安装 @cloudflare/next-on-pages（会造成冲突）
  }
}
```

#### 2. wrangler.toml 配置（✅ 最终验证有效）
```toml
name = "royaledle-pro"
main = ".open-next/worker.js"
compatibility_date = "2024-09-23"  # 重要：必须是这个日期或更新
compatibility_flags = ["nodejs_compat"]  # 关键：启用 Node.js 兼容性

# 静态资源配置 - 关键修复！
[assets]  # ✅ 使用 [assets] 而不是 [site]
directory = ".open-next/assets"

[vars]
NODE_ENV = "production"
NEXT_PUBLIC_WEB_URL = "https://royaledle.pro"
NEXT_PUBLIC_PROJECT_NAME = "Royaledle"
```

#### 3. Cloudflare Dashboard 配置（有效）
```
Build command: npx opennextjs-cloudflare build
Deploy command: npx opennextjs-cloudflare deploy
Version command: npx wrangler versions upload
Root directory: /
Compatibility date: 2024-09-23
Compatibility flags: nodejs_compat
```

#### 4. 必要的配置文件

**open-next.config.ts**
```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // 基本配置即可，大多数选项都是可选的
});
```

**.nvmrc**（确保 Node 版本）
```
20
```

## 🚨 遇到的问题和解决方案

### 问题 1：部署命令错误
**错误**：`Missing entry-point to Worker script`
**原因**：直接使用 `npx wrangler deploy` 而没有先构建
**解决**：先运行 `npx opennextjs-cloudflare build`

### 问题 2：esbuild 版本冲突
**错误**：
```
✘ [ERROR] Invalid alias name: "next/dist/compiled/node-fetch"
✘ [ERROR] Invalid alias name: "next/dist/compiled/ws"
```
**原因**：esbuild 版本不兼容
**解决**：添加 `"esbuild": "0.17.19"` 到 devDependencies

### 问题 3：依赖冲突
**错误**：构建停止或各种奇怪的错误
**原因**：同时安装了 `@cloudflare/next-on-pages` 和 `@opennextjs/cloudflare`
**解决**：删除 `@cloudflare/next-on-pages`，只使用 `@opennextjs/cloudflare`

### 问题 4：pnpm-lock.yaml 过期
**错误**：`Cannot install with "frozen-lockfile"`
**原因**：修改 package.json 后没有更新 lock 文件
**解决**：本地运行 `pnpm install` 更新 lock 文件后提交

### 问题 5：静态资源 404（关键问题）
**错误**：部署成功但访问时 CSS/JS 文件返回 404
**原因**：wrangler.toml 中使用了错误的静态资源配置
**解决**：
- ❌ 错误：使用 `[site]` 配置节
- ✅ 正确：使用 `[assets]` 配置节
```toml
[assets]
directory = ".open-next/assets"
```

### 问题 6：open-next.config.ts 类型错误
**错误**：`'staticAssets' does not exist in type 'CloudflareOverrides'`
**原因**：@opennextjs/cloudflare 不支持 staticAssets 和 env 属性
**解决**：保持配置最简化，只使用 defineCloudflareConfig 的基本配置

## 📖 重要概念理解

### Cloudflare Workers vs Pages

| 特性 | Workers | Pages |
|------|---------|-------|
| 目标用途 | API、动态内容、边缘计算 | 静态网站、JAMstack |
| Node.js 支持 | ✅ 完整支持（带 nodejs_compat） | ❌ 仅 Edge Runtime |
| 部署包 | @opennextjs/cloudflare | @cloudflare/next-on-pages |
| 文件大小限制 | 免费 3MB / 付费 10MB | 25MB per file |
| 适合的项目 | 复杂的 Next.js 应用 | 简单的静态站点 |

### 为什么选择 Workers？
1. **完整的 Node.js API 支持**
2. **更好的 Next.js 15 兼容性**
3. **支持所有 Next.js 功能**（SSR、API Routes、Middleware）
4. **更灵活的部署选项**

## 🛠️ 完整部署流程（验证有效）

### 本地开发到部署

```bash
# 1. 安装依赖
pnpm add @opennextjs/cloudflare
pnpm add -D esbuild@0.17.19 wrangler

# 2. 创建配置文件
# - wrangler.toml
# - open-next.config.ts
# - .nvmrc

# 3. 本地测试构建
pnpm build  # Next.js 构建
npx opennextjs-cloudflare build  # Workers 构建

# 4. 本地预览
npx opennextjs-cloudflare preview

# 5. 部署到 Cloudflare
npx wrangler login  # 首次需要登录
npx wrangler deploy
```

### 通过 Dashboard Git 集成部署

1. 推送代码到 GitHub
2. 在 Cloudflare Dashboard：
   - Workers & Pages → Create application
   - 连接 Git 仓库
   - 使用上述配置
3. 每次推送自动部署

## ⚠️ 常见陷阱和注意事项

### 不要做的事情
1. ❌ 不要混用 Pages 和 Workers 的部署包
2. ❌ 不要使用 `export const runtime = "edge"`
3. ❌ 不要忘记设置 `nodejs_compat` 标志
4. ❌ 不要使用错误的兼容性日期（必须 >= 2024-09-23）
5. ❌ 不要在构建命令中使用 Turbopack（`next build --turbo`）
6. ❌ 不要在 wrangler.toml 使用 `[site]` 配置（应使用 `[assets]`）
7. ❌ 不要在 open-next.config.ts 添加不支持的属性（如 staticAssets、env）

### 必须做的事情
1. ✅ 确保 Node 版本 >= 18
2. ✅ 使用正确的 esbuild 版本（0.17.19）
3. ✅ 设置正确的兼容性标志
4. ✅ 更新 pnpm-lock.yaml 并提交
5. ✅ 清理 .gitignore（添加 `.open-next`）

## 🚀 优化建议

### 减小 Worker 大小
```javascript
// next.config.mjs
export default {
  experimental: {
    optimizeCss: true,  // 压缩 CSS
  },
  compress: true,  // 启用压缩
  images: {
    unoptimized: true,  // Workers 不支持图片优化
  },
}
```

### 环境变量管理
- Dashboard 设置的变量会覆盖 wrangler.toml
- 使用 `NEXT_PUBLIC_` 前缀的变量会暴露给客户端
- 敏感信息使用 Cloudflare Secrets

### 性能优化
1. 使用 R2 存储静态资源
2. 配置 KV 存储缓存
3. 使用 Durable Objects 进行状态管理

## 📊 监控和调试

### 查看日志
```bash
# 实时日志
npx wrangler tail

# Dashboard 查看
Workers & Pages → 你的项目 → Logs
```

### 性能监控
- Cloudflare Analytics 自动提供
- 可以集成 Sentry 进行错误追踪

## 🎓 关键学习点

1. **理解平台差异**：Workers 和 Pages 是不同的产品，有不同的限制和能力
2. **依赖管理**：正确的依赖版本至关重要
3. **配置优先级**：Dashboard 配置 > wrangler.toml > 默认值
4. **兼容性设置**：`nodejs_compat` 是使用 Node.js API 的关键
5. **构建流程**：Next.js 构建 → OpenNext 转换 → Workers 部署

## 📚 参考资源

- [OpenNext.js Cloudflare 文档](https://opennext.js.org/cloudflare)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/workers/frameworks/framework-guides/nextjs/)

## 💡 最佳实践总结

1. **始终使用 @opennextjs/cloudflare** 进行 Workers 部署
2. **锁定 esbuild 版本** 避免兼容性问题
3. **本地测试** 在部署前先本地构建测试
4. **版本控制** 提交所有配置文件和 lock 文件
5. **监控部署** 使用 Dashboard 查看部署日志

---

*最后更新：2025-08-23*
*部署状态：✅ 成功（包括静态资源正常加载）*
*验证环境：Cloudflare Workers with Next.js 15.2.3*

## 🔑 最重要的修复

**静态资源 404 问题的最终解决方案**：
- 在 `wrangler.toml` 中必须使用 `[assets]` 而不是 `[site]`
- `open-next.config.ts` 保持最简配置，不要添加额外属性
- 这两个改动解决了 CSS/JS 文件 404 的问题