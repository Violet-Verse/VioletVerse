/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
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
        // Completely exclude Flow FCL from server bundle
        if (isServer) {
            config.externals = config.externals || [];
            config.externals.push({
                '@onflow/fcl': 'commonjs @onflow/fcl',
                '@onflow/types': 'commonjs @onflow/types'
            });
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