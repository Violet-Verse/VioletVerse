import Head from "next/head";
import Navbar from "./Navigation/Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
    const siteTitle = "Violet Verse";

    return (
        <div>
            <Head>
                <title>{siteTitle}</title>
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="description"
                    content="Strong, sweet, cup americano spoon blue mountain black robusta breve."
                />
                <meta
                    property="og:image"
                    content={`https://og-image.vercel.app/${encodeURI(
                        siteTitle
                    )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                />
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <Navbar />
            <div className="content" style={{ marginTop: "50px" }}>
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
