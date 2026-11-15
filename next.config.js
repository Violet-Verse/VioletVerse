/** @type {import('next').NextConfig} */
const nextConfig = {
      reactStrictMode: true,
      swcMinify: true,
      transpilePackages: [
            '@rainbow-me/rainbowkit',
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

        // Ignore optional React Native dependencies from MetaMask SDK
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
