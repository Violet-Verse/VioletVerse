import Head from "next/head";

export async function getStaticProps(context) {
    return {
        props: { vrSite: true },
    };
}

const VRSite = () => {
    const siteTitle = `Violet Verse | VR`;
    const metaTitle = `Violet Verse | VR`;
    const siteDescription =
        "Violet Verse is a crypto-friendly publication combining the latest trends in tech, documenting the narratives of Web3 builders and providing educational resources to the socially-aware.";
    const siteImage = "https://i.imgur.com/28rAdvO.png";
    return (
        <>
            <Head>
                <title>{siteTitle}</title>
                <meta name="og:title" content={metaTitle} />
                <meta name="og:site_name" content="Violet Verse" />
                <meta name="og:description" content={siteDescription} />
                <meta property="og:image" content={siteImage} />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="800" />
                <meta property="og:image:height" content="420" />
                <meta property="og:type" content="website" />
                <meta name="twitter:site" content="@TheVioletVerse" />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="twitter:description" content={siteDescription} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image:src" content={siteImage} />
            </Head>

            <iframe
                src="https://www.muse.place/violet-verse"
                title="Violet Summer VR"
                height="100%"
                width="100%"
                className="vrSite"
            ></iframe>
        </>
    );
};

export default VRSite;
