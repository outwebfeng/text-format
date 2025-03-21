import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 添加压缩
  compress: true,
  // 启用SWC最小化
  swcMinify: true,
  // 添加资源优化
  poweredByHeader: false, // 移除X-Powered-By头
  reactStrictMode: true, // 启用严格模式
  // 原有的webpack配置
  webpack: (config, { isServer }) => {
    // 添加 worker-loader 配置
    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: 'worker-loader',
      options: {
        filename: 'static/[hash].worker.js',
        publicPath: '/_next/',
      },
    });

    // 避免 worker 相关的 SSR 错误
    if (isServer) {
      config.output.globalObject = 'self';
    }

    // 优化客户端构建
    if (!isServer) {
      // 启用模块连接
      config.optimization.concatenateModules = true;
    }

    return config;
  },
  // 添加性能优化的实验性功能
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', '@headlessui/react'],
    scrollRestoration: true, // 启用滚动恢复
  },
};

export default withNextIntl(nextConfig);
