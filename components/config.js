const dev = process.env.NODE_ENV !== "production" || "preview";

export const server = dev
    ? "https://localhost:3000"
    : "https://violet-verse-git-xavier-editor-dropparty.vercel.app";
