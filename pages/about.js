import FacebookIcon from "@mui/icons-material/Facebook";
import LanguageIcon from "@mui/icons-material/Language";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Box, Grid } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { members } from "../components/Placeholder/UserData";

const About = () => {
    const siteTitle = `About The Team | Violet Verse`;
    const siteDescription = `Learn more about the team building Violet Verse.`;
    return (
        <>
            <Head>
                <title>{siteTitle}</title>
                <meta name="og:title" content={siteTitle} />
                <meta name="og:description" content={siteDescription} />
                <meta
                    property="og:image"
                    content="https://i.imgur.com/HOcgWqo.png"
                />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="800" />
                <meta property="og:image:height" content="420" />
                <meta property="og:type" content="website" />
                <meta name="twitter:site" content="@TheVioletVerse" />
                <meta name="twitter:title" content={siteTitle} />
                <meta name="twitter:description" content={siteDescription} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:image:src"
                    content="https://i.imgur.com/HOcgWqo.png"
                />
            </Head>
            {/* First section */}
            {/* About the Violet Verse */}

            <Grid
                container
                direction="row"
                spacing={8}
                justifyContent="space-around"
                alignItems="center"
            >
                <Grid
                    item
                    md={12}
                    lg={4}
                    sx={{
                        textAlign: { xs: "center", md: "center", lg: "left" },
                    }}
                >
                    <h1 style={{ whiteSpace: "pre-wrap" }}>
                        {"About the \nViolet Verse"}
                    </h1>
                    <Box sx={{ padding: { xs: "0px 5%", md: "0px" } }}>
                        <p>
                            Strong, sweet, cup americano spoon blue mountain{" "}
                            <br />
                            black robusta breve. Skinny variety to go white
                            rich, redeye crema breve whipped. <br />
                        </p>
                    </Box>
                    <Grid container direction="row" spacing={2}></Grid>
                    <Grid container spacing={2}></Grid>
                </Grid>
                <Grid item md={12} lg={8} align="center">
                    <Image
                        width={1920}
                        height={1080}
                        src="/banners/Photography_2.png"
                        alt="Default Image"
                        className="image"
                    />
                </Grid>
            </Grid>

            {/* 2nd Section */}
            {/* Our Team */}

            <Grid
                container
                spacing={2}
                align="center"
                sx={{ marginTop: { xs: "30px", md: "30px", lg: "40px" } }}
                justifyContent="center"
            >
                <Grid
                    item
                    xs={12}
                    sx={{
                        textAlign: { xs: "center", md: "center", lg: "left" },
                        marginBottom: { xs: "30px", md: "30px", lg: "50px" },
                    }}
                >
                    <h1>Our Team</h1>
                </Grid>
                {members.map((member) => (
                    <Grid item xs={12} sm={6} lg={3} key={member.id}>
                        <Link href={"/team/" + member.id}>
                            <a>
                                <Image
                                    width={1000}
                                    height={1159}
                                    src={member.photo}
                                    alt="Default Image"
                                    className="image"
                                    objectFit={"cover"}
                                />
                            </a>
                        </Link>
                        <Box
                            sx={{
                                textAlign: {
                                    xs: "center",
                                    sm: "left",
                                    lg: "left",
                                },
                            }}
                        >
                            <Link href={"/team/" + member.id}>
                                <a>
                                    <h4
                                        style={{
                                            marginTop: "15px",
                                        }}
                                    >
                                        {member.name}
                                    </h4>
                                </a>
                            </Link>
                            <h3
                                style={{
                                    fontFamily: "Test Calibre",
                                    fontWeight: "400",
                                    fontSize: "18px",
                                }}
                            >
                                {member.title}
                            </h3>
                            <Grid
                                container
                                direction="row"
                                spacing={1}
                                justifyContent={{ xs: "center", sm: "left" }}
                            >
                                {member?.website && (
                                    <Grid item>
                                        <a
                                            href={member.website}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <LanguageIcon
                                                sx={{
                                                    color: "#73839C",
                                                }}
                                            />
                                        </a>
                                    </Grid>
                                )}
                                {member?.twitter && (
                                    <Grid item>
                                        <a
                                            href={
                                                `https://www.twitter.com/` +
                                                member.twitter
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <TwitterIcon
                                                sx={{
                                                    color: "#73839C",
                                                }}
                                            />
                                        </a>
                                    </Grid>
                                )}
                                {member?.linkedIn && (
                                    <Grid item>
                                        <a
                                            href={
                                                `https://www.linkedin.com/in/` +
                                                member.linkedIn
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <LinkedInIcon
                                                sx={{
                                                    color: "#73839C",
                                                }}
                                            />
                                        </a>
                                    </Grid>
                                )}
                                {member?.facebook && (
                                    <Grid item>
                                        <a
                                            href={
                                                `https://www.facebook.com/` +
                                                member.facebook
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <FacebookIcon
                                                sx={{
                                                    color: "#73839C",
                                                }}
                                            />
                                        </a>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default About;
