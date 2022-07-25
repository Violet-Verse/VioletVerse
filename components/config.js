const dev = process.env.NODE_ENV !== "production" || "preview";

export const server = dev
    ? "https://violet-verse-chi.vercel.app/"
    : "https://violet-verse-chi.vercel.app/";
