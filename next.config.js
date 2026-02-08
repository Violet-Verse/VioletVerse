/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    '@privy-io/react-auth',
  ],
  images: {
    domains: [
      "i.imgur.com",
      "i.ibb.co",
      "img.youtube.com",
      "cdn.discordapp.com",
      "www.stardust.gg",
      "pbs.twimg.com",
    ],
  },
  // Force fresh build ID to bust stale cache
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  webpack: (config, { isServer }) => {
    // Disable persistent filesystem cache to force recompilation from source
    config.cache = false;

    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
    };

    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@react-native-async-storage/async-storage': false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
