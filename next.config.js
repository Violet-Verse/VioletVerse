const path = require('path');

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

      webpack: (config, { isServer }) => {
              // Handle newer JavaScript syntax for dependencies
        config.module.rules.push({
                  test: /\.m?js$/,
                  type: 'javascript/auto',
                  resolve: {
                              fullySpecified: false,
                  },
        });

        // Force legacyBehavior on all next/link imports to prevent SSR errors
        config.resolve.alias = {
          ...config.resolve.alias,
          'next/link': path.resolve(__dirname, 'lib/LegacyLink.js'),
        };

        // Ignore optional React Native dependencies from MetaMask SDK
        config.resolve.fallback = {
          ...config.resolve.fallback,
        };

        if (!isServer) {
          config.resolve.alias = {
            ...config.resolve.alias,
            'next/link': path.resolve(__dirname, 'lib/LegacyLink.js'),
            '@react-native-async-storage/async-storage': false,
          };
        }

        return config;
      },
};

module.exports = nextConfig;
