import { Box, Grid } from "@mui/material";
import Image from "next/image";
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
        <Grid container direction="column" align="center" alignContent="center">
            <h1>{member.name}</h1>
            <h4>{member.title}</h4>
            <Image
                width={345.13}
                height={400}
                src={member.photo}
                alt="Default Image"
                className="imageSm"
                objectFit={"contain"}
            />
            <Box sx={{ padding: "0px 15%" }}>
                <p>{member.bio}</p>
            </Box>
        </Grid>
    );
};

export default Team;
