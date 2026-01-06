/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  webpack: (config, { isServer }) => {
    // Exclude Flow FCL from server-side bundle
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('@onflow/fcl', '@onflow/types');
    }

    // Handle newer JavaScript syntax for Privy dependencies
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
};

module.exports = nextConfig;