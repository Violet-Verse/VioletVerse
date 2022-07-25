const dev = process.env.NODE_ENV !== "production" || "preview";

export const server = dev
    ? "https://violet-verse-git-xavier-editor-dropparty.vercel.app"
    : "https://violet-verse-git-xavier-editor-dropparty.vercel.app";
