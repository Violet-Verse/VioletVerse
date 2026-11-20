// Server-side no-op for isomorphic-dompurify.
// jsdom (pulled in by the real isomorphic-dompurify) requires @exodus/bytes
// which is ESM-only and cannot be require()'d in a CJS serverless function.
// Article HTML comes from our own MongoDB (admin-authored TinyMCE content),
// so server-side sanitization is not needed; DOMPurify still runs client-side.
module.exports = {
  sanitize: (html) => html || '',
};
