# Cloudflare Workers 部署指南

## 前置要求

- Node.js >= 20（项目已包含 .nvmrc 文件）
- npm 或其他包管理工具
- Cloudflare 账号

## 本地开发部署

### 1. 安装依赖

```bash
npm install
```

### 2. 构建项目

```bash
# 先构建 Next.js 应用
npm run build

# 构建 Workers 版本
npm run build:workers
```

### 3. 本地预览

```bash
npm run preview:workers
```

### 4. 部署到 Cloudflare

```bash
# 首次部署需要登录
npx wrangler login

# 部署到生产环境
npm run deploy:workers
```

### 5. 查看实时日志

```bash
npm run tail:workers
```

## 通过 Cloudflare Dashboard 部署

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Workers & Pages
3. 点击 "Create application"
4. 选择 "Pages" 标签，然后 "Connect to Git"
5. 授权并选择你的 GitHub 仓库
6. 配置构建设置：

```
Build command: npx opennextjs-cloudflare build
Deploy command: npx opennextjs-cloudflare deploy  
Version command: npx wrangler versions upload
Root directory: /
Compatibility date: 2024-09-23
Compatibility flags: nodejs_compat
```

7. 添加环境变量（如果需要）：
   - `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`
   - `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID`

## 环境变量配置

### 本地开发

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SITE_URL=http://localhost
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=your_adsense_client_id
```

### 生产环境

在 Cloudflare Dashboard 中设置环境变量，或更新 `wrangler.toml` 文件：

```toml
[vars]
NODE_ENV = "production"
NEXT_PUBLIC_SITE_URL = "https://text-format.com"
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = "your_ga_id"
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID = "your_adsense_client_id"
```

## 常见问题

### 构建失败

如果遇到构建错误，尝试以下步骤：

1. 清理缓存：
```bash
rm -rf .open-next node_modules package-lock.json
npm install
```

2. 确保 Node 版本正确：
```bash
node -v  # 应该是 v20.x.x
```

3. 检查 esbuild 版本：
```bash
npm list esbuild  # 应该是 0.17.19
```

### 静态资源 404

确保 `wrangler.toml` 使用了正确的配置：

```toml
[assets]  # 必须是 [assets] 而不是 [site]
directory = ".open-next/assets"
```

### 部署大小限制

Workers 免费版限制为 3MB，付费版为 10MB。如果超出限制：

1. 检查并优化图片资源
2. 移除不必要的依赖
3. 考虑使用 R2 存储静态资源

## 监控和维护

### 查看应用状态

1. 在 Cloudflare Dashboard 查看：
   - Workers & Pages → 你的项目 → Analytics
   - 实时请求日志
   - 错误率和性能指标

2. 使用命令行：
```bash
# 查看实时日志
npm run tail:workers

# 查看部署状态
npx wrangler deployments list
```

### 回滚版本

如果新版本有问题，可以快速回滚：

```bash
# 列出所有版本
npx wrangler deployments list

# 回滚到指定版本
npx wrangler rollback [deployment-id]
```

## 性能优化建议

1. **使用 R2 存储静态资源**：减少 Worker 包大小
2. **配置 KV 存储缓存**：提高响应速度
3. **启用 Cloudflare CDN**：自动获得全球加速
4. **使用 Durable Objects**：管理状态数据

## 成本估算

- **免费计划**：每天 100,000 请求
- **付费计划**：$5/月起，包含 10M 请求
- 详细定价请参考 [Cloudflare Workers 定价](https://developers.cloudflare.com/workers/platform/pricing)

## 支持资源

- [OpenNext.js Cloudflare 文档](https://opennext.js.org/cloudflare)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [项目问题追踪](https://github.com/your-username/text-format/issues)

---

*最后更新：2025-08-27*