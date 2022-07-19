import Link from "next/link";
import Image from "next/image";
import { Grid, Box } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";
import { members } from "../components/UserData";

const About = () => {
    return (
        <>
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
                    <h1>About the Violet Verse</h1>
                    <p>
                        <br />
                        Strong, sweet, cup americano spoon blue mountain <br />
                        black robusta breve. Skinny variety to go white rich,
                        redeye crema breve whipped. <br />
                    </p>
                    <Grid container direction="row" spacing={2}></Grid>
                    <Grid container spacing={2}></Grid>
                </Grid>
                <Grid item md={12} lg={8} align="center">
                    <Image
                        width={1920}
                        height={1080}
                        src="/Photography_2.png"
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
                sx={{ marginTop: "40px" }}
                justifyContent="center"
            >
                <Grid
                    item
                    xs={12}
                    sx={{
                        textAlign: { xs: "center", md: "center", lg: "left" },
                    }}
                >
                    <h1>Our Team</h1>
                </Grid>
                {members.map((member) => (
                    <Grid item xs={12} sm={6} lg={3} key={member.id}>
                        <Image
                            width={1000}
                            height={1159}
                            src={member.photo}
                            alt="Default Image"
                            className="imageSm"
                        />
                        <Link href={"/team/" + member.id}>
                            <a>
                                <h2
                                    style={{
                                        textAlign: "left",
                                        fontFamily: "Test Calibre",
                                        fontWeight: "700",
                                        fontSize: "22px",
                                        marginTop: "15px",
                                    }}
                                >
                                    {member.name}
                                </h2>
                            </a>
                        </Link>
                        <h3
                            style={{
                                marginTop: "15px",
                                textAlign: "left",
                                fontFamily: "Test Calibre",
                                fontWeight: "400",
                                fontSize: "18px",
                            }}
                        >
                            {member.title}
                        </h3>
                        <Box
                            sx={{
                                marginTop: "15px",
                                textAlign: "left",
                            }}
                        >
                            {member?.website && (
                                <a
                                    href={member.facebook}
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
                                    href={
                                        `https://www.twitter.com/` +
                                        member.twitter
                                    }
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
                                        `https://www.linkedin.com/in/` +
                                        member.linkedIn
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
                                    href={
                                        `https://www.facebook.com/` +
                                        member.facebook
                                    }
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
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default About;
