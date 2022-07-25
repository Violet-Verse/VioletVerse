import FacebookIcon from "@mui/icons-material/Facebook";
import LanguageIcon from "@mui/icons-material/Language";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Box, Grid } from "@mui/material";
import Head from "next/head";
import Image from "next/image";

import { members } from "../../components/Placeholder/UserData";

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
    const siteTitle = `${member.name} | Violet Verse Team`;
    const siteDescription = `${member.bio}`;
    const siteImage = `${member.photo}`;
    return (
        <>
            <Head>
                <meta name="og:title" content={siteTitle} />
                <meta name="og:description" content={siteDescription} />
                <meta property="og:image" content={siteImage} />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:type" content="website" />
                <meta name="twitter:site" content="@TheVioletVerse" />
                <meta name="twitter:title" content={siteTitle} />
                <meta name="twitter:description" content={siteDescription} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image:src" content={siteImage} />
            </Head>
            <Grid
                container
                direction="column"
                align="center"
                alignContent="center"
            >
                <h1>{member.name}</h1>
                <h4>{member.title}</h4>
                <Grid
                    container
                    direction="row"
                    align="center"
                    justifyContent="center"
                >
                    {member?.website && (
                        <a
                            href={member.website}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <LanguageIcon
                                sx={{
                                    margin: "0px 3px",
                                    color: "#73839C",
                                }}
                            />
                        </a>
                    )}
                    {member?.twitter && (
                        <a
                            href={`https://www.twitter.com/` + member.twitter}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <TwitterIcon
                                sx={{
                                    margin: "0px 3px",
                                    color: "#73839C",
                                }}
                            />
                        </a>
                    )}
                    {member?.linkedIn && (
                        <a
                            href={
                                `https://www.linkedin.com/in/` + member.linkedIn
                            }
                            target="_blank"
                            rel="noreferrer"
                        >
                            <LinkedInIcon
                                sx={{
                                    margin: "0px 3px",
                                    color: "#73839C",
                                }}
                            />
                        </a>
                    )}
                    {member?.facebook && (
                        <a
                            href={`https://www.facebook.com/` + member.facebook}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FacebookIcon
                                sx={{
                                    margin: "0px 3px",
                                    color: "#73839C",
                                }}
                            />
                        </a>
                    )}
                </Grid>
                <Image
                    width={345.13}
                    height={400}
                    src="https://i.imgur.com/q0CQ63l.png"
                    alt="Default Image"
                    className="imageSm"
                    objectFit={"contain"}
                />
                <Box sx={{ padding: "0px 15%" }}>
                    <p>{member.bio}</p>
                </Box>
            </Grid>
        </>
    );
};

export default Team;
