import { useUser } from "../../hooks/useAuth";
import ProfileLayout from "../../components/Profile/ProfileLayout";

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
            userTypes: ["admin", "collaborator", "user"],
        },
    };
}

const Profile = () => {
    const { user } = useUser();
    return <>{user && <ProfileLayout user={user} />}</>;
};

export default Profile;
