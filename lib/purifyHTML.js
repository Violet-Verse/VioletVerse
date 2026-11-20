const purifyHTML = (html) => {
    if (!html) return '';

    if (typeof window === 'undefined') {
        return html;
    }

    const DOMPurify = require('dompurify');
    return DOMPurify.sanitize(html, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
    });
};

export default purifyHTML;
