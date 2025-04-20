import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 添加压缩
  compress: true,
  // 启用SWC最小化
  swcMinify: true,
  // 添加资源优化
  poweredByHeader: false, // 移除X-Powered-By头
  reactStrictMode: true, // 启用严格模式
  // 增加图像优化配置
  images: {
    domains: ['images.text-format.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60,
  },
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
      // 增加代码分割优化
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000
      };
    }

    return config;
  },
  // 添加性能优化的实验性功能
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', '@headlessui/react'],
    scrollRestoration: true, // 启用滚动恢复
    craCompat: false, // 禁用CRA兼容性以获得更好的性能
  },
  // 添加HTTP头以提高性能和安全性
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/(.*).(jpe?g|png|svg|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
