import DOMPurify from "isomorphic-dompurify";

const purifyHTML = (html) => {
    if (html) {
        return DOMPurify.sanitize(html, {
            ADD_TAGS: ["iframe"],
            ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
        });
    }
};

export default purifyHTML;
