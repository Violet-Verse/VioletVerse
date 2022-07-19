import Head from "next/head";
import Navbar from "./Navigation/Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
    const siteTitle = "Violet Verse";

    return (
        <div>
            <Head>
                <title>{siteTitle}: Testing12312312</title>
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="description"
                    content="Strong, sweet, cup americano spoon blue mountain black robusta breve."
                />
                <meta
                    property="og:image"
                    content="https://i.imgur.com/HZmoUvQ.png"
                />
                <meta
                    name="og:title"
                    content={`${siteTitle} Testing Header | Place for News`}
                />
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
