import Head from "next/head";
import Navbar from "./Navigation/Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
    const siteTitle = "Violet Verse | Web3 content outlet powered by Flow";

    return (
        <div>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <title>{siteTitle}</title>
                <meta name="og:title" content={siteTitle} />
                <meta
                    name="og:description"
                    content="Violet Verse is a Web3 Dapp powered by Flow. The best place to get your crypto news!"
                />
                <meta
                    property="og:image"
                    content="https://i.imgur.com/yhNmGo8.png"
                />
                <meta property="og:type" content="website" />
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
