import { members } from "../../components/UserData";

export const getStaticProps = async ({ params }) => {
    const member = members.filter((m) => m.id.toString() == params.id);
    return {
        props: {
            member: member[0],
        },
    };
};

export const getStaticPaths = async () => {
    const paths = members.map((member) => ({
        params: { id: member.id.toString() },
    }));
    return { paths, fallback: false };
};

const Team = ({ member }) => {
    return (
        <div>
            <h1>Name: {member.name}</h1>
            <p>{member.title}</p>
        </div>
    );
};

export default Team;
