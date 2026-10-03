const path = require("path");

module.exports = {
    reactStrictMode: true,
    staticPageGenerationTimeout: 120,
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
    webpack: (config, { webpack }) => {
        // Redirect @swc/helpers/_/* imports (0.5.x format) to the root-installed
        // v0.5.18 ESM files. This avoids breaking Next.js 12's own imports which
        // use @swc/helpers/lib/* (0.4.x format from its bundled copy).
        const swcHelpersDir = path.dirname(
            require.resolve("@swc/helpers/package.json")
        );
        config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(
                /^@swc\/helpers\/_\/(.+)$/,
                (resource) => {
                    const match = resource.request.match(
                        /^@swc\/helpers\/_\/(.+)$/
                    );
                    if (match) {
                        resource.request = path.join(
                            swcHelpersDir,
                            "esm",
                            match[1] + ".js"
                        );
                    }
                }
            )
        );
        return config;
    },
};
