import styles from "../styles/Home.module.css";
import Image from "next/image";
import { Grid, Button, ButtonGroup } from "@mui/material";
import { Text } from "@nextui-org/react";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const About = () => {
    const members = [
        {
            name: "Mel",
            id: 1,
            title: "CEO",
            facebook: "BMW",
            twitter: "onDropParty",
            linkedIn: "melissa-a-henderson-",
        },
        {
            name: "Dani",
            id: 2,
            title: "COO",
            facebook: "porsche",
            twitter: "xavitime",
            linkedIn: "melissa-a-henderson-",
        },
        {
            name: "Ryan",
            id: 3,
            title: "CTO",
            facebook: "Crunchyroll",
            twitter: "ryanjsteffens",
            linkedIn: "melissa-a-henderson-",
        },
        {
            name: "Sina",
            id: 4,
            title: "CFO",
            facebook: "appletv",
            twitter: "TheVioletVerse",
            linkedIn: "melissa-a-henderson-",
        },
    ];
    return (
        <div>
            {/* First section */}
            <Grid
                container
                direction="row"
                spacing={6}
                justifyContent="space-around"
                alignItems="center"
            >
                <Grid item xs={6}>
                    <Text
                        h1
                        font-family="Work Sans"
                        size={43}
                        color="#293854"
                        weight="bold"
                    >
                        About the Violet Verse
                    </Text>
                    <p className={styles.text}>
                        <br />
                        Strong, sweet, cup americano spoon blue mountain <br />
                        black robusta breve. Skinny variety to go white rich,
                        redeye crema breve whipped. <br />
                    </p>
                    <Grid container direction="row" spacing={2}></Grid>
                    <Grid container spacing={2}></Grid>
                </Grid>
                <Grid item>
                    <Image
                        width={763}
                        height={338}
                        src="/Squared.png"
                        alt="Default Image"
                    />
                </Grid>
            </Grid>
            {/* 2nd Section */}
            <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                marginTop="50px"
            >
                <Grid item>
                    <Text
                        h1k
                        font-family="Work Sans"
                        size={43}
                        color="#f293854"
                        weight="bold"
                    >
                        Our Team
                    </Text>
                </Grid>
            </Grid>

            {/*Image configuration*/}

            <Grid
                item
                container
                direction="row"
                spacing={6}
                justifyContent="space-around"
                alignItems="center"
            >
                <Grid
                    container
                    spacing
                    direction="row"
                    columnSpacing={3}
                    justifyContent="space-evenly"
                    alignItems="center"
                    marginTop="80px"
                >
                    {members.map((member) => (
                        <Grid item key={member.id}>
                            <Image
                                width={270}
                                height={313}
                                src="/Squared.png"
                                alt="Default Image"
                                style={{ marginBottom: "35px" }}
                            />
                            <Text
                                font-family="Work Sans"
                                size={20}
                                color="#f293854"
                                weight="bold"
                            >
                                {member.name}
                            </Text>
                            <Text>{member.title}</Text>
                            <a
                                href={
                                    `https://www.twitter.com/` + member.twitter
                                }
                                target="_blank"
                                rel="noreferrer"
                            >
                                <TwitterIcon />
                            </a>

                            <a
                                href={
                                    `https://www.facebook.com/` +
                                    member.facebook
                                }
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FacebookIcon />
                            </a>
                            <a
                                href={
                                    `https://www.linkedin.com/in/` +
                                    member.linkedIn
                                }
                                target="_blank"
                                rel="noreferrer"
                            >
                                <LinkedInIcon />
                            </a>
                        </Grid>
                    ))}
                </Grid>
                <Grid item></Grid>
            </Grid>
        </div>
    );
};

export default About;
