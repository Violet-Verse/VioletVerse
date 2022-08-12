import ProfileLayout from "../../components/Profile/ProfileLayout";
import { getUserByUsername } from "../api/database/getUser";
import Head from "next/head";

export async function getServerSideProps(context) {
    const username = context.params.username;
    const data = await getUserByUsername(username);

    if (!data) {
        return { notFound: true, props: { user: {} } };
    }

    return {
        props: {
            user: data,
        },
    };
}

const UserProfile = ({ user }) => {
    const siteTitle = `${user?.name} - Profile | Violet Verse`;
    const metaTitle = `${user?.name} - Profile | Violet Verse`;
    const siteImage = user?.picture;
    const siteDescription = user?.bio;
    return (
        <>
            <Head>
                <title>{siteTitle}</title>
                <meta name="og:title" content={metaTitle} />
                <meta name="og:description" content={siteDescription} />
                <meta property="og:image" content={siteImage} />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="400" />
                <meta property="og:image:height" content="400" />
                <meta property="og:type" content="website" />
                <meta name="twitter:site" content="@TheVioletVerse" />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="twitter:description" content={siteDescription} />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:image:src" content={siteImage} />
            </Head>
            <ProfileLayout user={user} />;
        </>
    );
};

export default UserProfile;
