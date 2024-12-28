import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
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

    return config;
  },
};

export default withNextIntl(nextConfig);
