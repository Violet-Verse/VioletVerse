/** @type {import('next').NextConfig} */
const nextConfig = {
      reactStrictMode: true,
      swcMinify: true,
      transpilePackages: [
            '@rainbow-me/rainbowkit',
            'wagmi',
            'viem',
            '@wagmi/core',
            '@wagmi/connectors',
            'ox',
            '@exodus/bytes',
      ],
      experimental: {
            esmExternals: 'loose',
      },
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

        config.resolve.fallback = {
          ...config.resolve.fallback,
        };

        config.resolve.alias = {
          ...config.resolve.alias,
        };

        if (isServer) {
          // isomorphic-dompurify pulls in jsdom → html-encoding-sniffer →
          // @exodus/bytes which is ESM-only and breaks require() in serverless.
          // Replace with a pass-through shim on the server; DOMPurify still
          // runs in the browser via the real isomorphic-dompurify.
          const path = require('path');
          config.resolve.alias['isomorphic-dompurify'] =
            path.join(__dirname, 'lib/server-dompurify-noop.js');
        } else {
          config.resolve.alias['@react-native-async-storage/async-storage'] = false;
        }

        return config;
      },
};

module.exports = nextConfig;
