/** @type {import('next').NextConfig} */
import nextI18NextConfig from './next-i18next.config.mjs';

const nextConfig = {
  images: {
    domains: ['krokplus.com', 'plus.unsplash.com', 'images.unsplash.com'],
  },
  reactStrictMode: true,
  swcMinify: true,  // Use SWC for minification instead of Terser
  ...nextI18NextConfig,  // Spread the i18n configuration into the Next.js config
  webpack: (config, { isServer, dev }) => {
    if (!dev) {
      config.watchOptions = {
        ignored: '**/*', // Ignore all files for HMR in production
      };
    }
    return config;
  },
};

export default nextConfig;
