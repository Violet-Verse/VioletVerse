const dev = process.env.NODE_ENV !== "production" || "preview";

export const server = dev
    ? "http://localhost:3000/"
    : "https://violet-verse-chi.vercel.app/";
