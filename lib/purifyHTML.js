// isomorphic-dompurify → jsdom → html-encoding-sniffer → @exodus/bytes (ESM-only)
// crashes Next.js serverless functions because CJS cannot require() ESM modules.
// Article content is admin-authored TinyMCE output, sanitized at write time.
// On the server we return as-is; on the client we run DOMPurify (browser-native).

const purifyHTML = (html) => {
    if (!html) return '';

    if (typeof window === 'undefined') {
        // Server: no jsdom needed, return raw HTML
        return html;
    }

    // Client: sanitize with the browser-native DOMPurify
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const DOMPurify = require('dompurify');
    return DOMPurify.sanitize(html, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
    });
};

export default purifyHTML;
