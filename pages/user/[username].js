import ProfileLayout from "../../components/Profile/ProfileLayout";
import { getUserByUsername } from "../api/database/getUser";

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
    return <ProfileLayout user={user} />;
};

export default UserProfile;
