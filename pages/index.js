import { Button, Grid, Box, Stack } from "@mui/material";
import Link from "next/link";
import React, { useEffect } from "react";
import Image from "next/image";
import ArticleGrid from "../components/article/ArticleGrid";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import Head from "next/head";
import styles from "../styles/Home.module.css";
import InfoBlock from "../components/homepage/InfoBlock";
import { getUsersByRole } from "./api/database/getUserByEmail";
import connectDatabase from "../lib/mongoClient";

export async function getServerSideProps() {
    const db = await connectDatabase();
    const collection = db.collection("posts");
    const data = await collection.find({ hidden: false }).toArray();

    const authors = await getUsersByRole("admin");
    const contributors = await getUsersByRole("contributor");

    return {
        props: {
            posts: JSON.parse(JSON.stringify(data)),
            authors: authors,
            contributors: contributors,
        },
    };
}

const Home = ({ posts, authors, contributors }) => {
    const spotlightPost = {
        title: " ",
        subtitle: "",
        url: "/eth-denver-tVvOGAqXKR",
    };

    return (
        <Box sx={{ mt: -4 }}>
            <Head>
                <meta
                    property="og:image"
                    content="https://i.imgur.com/yhNmGo8.png"
                />
                <meta
                    name="twitter:image:src"
                    content="https://i.imgur.com/yhNmGo8.png"
                />
                <link rel="canonical" href="/" />
            </Head>

            {/* Video with Text Overlay | XS to MD */}
            <Link href={spotlightPost.url}>
                <a>
                    <Box
                        className={styles.content}
                        sx={{ display: { xs: "none", md: "flex" } }}
                    >
                        <Grid
                            className={styles.overlay}
                            container
                            direction="column"
                            spacing={2}
                            sx={{
                                px: {
                                    xs: "0",
                                    sm: "5%",
                                    md: "10%",
                                    lg: "10%",
                                    xl: "10%",
                                },
                                mt: 8,
                                maxWidth: "1040px",
                            }}
                        >
                            <Grid item>
                                <p
                                    style={{
                                        fontFamily: "stratos-lights",
                                        color: "black",
                                        fontStyle: "italic",
                                        fontWeight: "200",
                                        fontSize: "36px",
                                        lineHeight: "130%",
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    {spotlightPost.subtitle}
                                </p>
                            </Grid>

                            <Grid item>
                                <Button
                                    size="large"
                                    variant="contained"
                                    disableElevation
                                    sx={{
                                        fontSize: "16px",
                                        padding: "12px 28px",
                                    }}
                                >
                                    Check out the latest Fashion and Tech Stories
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <ReactPlayer
                        className={styles.video}
                        url="https://www.youtube.com/watch?v=N-ZMbCeswoM&t=4s"
                        config={{ youtube: {playerVars: { showinfo: 1 } }}}
                        width="100%"
                        height="100%"
                        muted={true}
                        playing
                        playsinline
                        loop
                    />
                </a>
            </Link>

            <Box sx={{ display: { xs: "flex", md: "none" }, mt: 6, mb: 6 }}>
                <Link href={spotlightPost.url}>
                    <a>
                        <Grid
                            container
                            direction="column"
                            spacing={2}
                            sx={{
                                textAlign: {
                                    xs: "center",
                                },
                            }}
                        >
                            {/* <Grid item sx={{ mt: "30px" }}>
                                    <h1>{spotlightPost.title}</h1>
                                </Grid> */}
                            {/* <Grid item>
                                    <Image
                                        src="/line1.svg"
                                        alt="line"
                                        height={1}
                                        width={100}
                                    />
                                </Grid> */}
                            <Grid item>
                                <p
                                    style={{
                                        fontFamily: "stratos-lights",
                                        fontStyle: "italic",
                                        fontWeight: "200",
                                        fontSize: "36px",
                                        lineHeight: "130%",
                                        letterSpacing: "-0.01em",
                                        color: "black",
                                    }}
                                >
                                    {spotlightPost.subtitle}
                                </p>
                            </Grid>
                            <Grid item>
                                <Button
                                    size="large"
                                    variant="contained"
                                    disableElevation
                                >
                                    Watch Now
                                </Button>
                            </Grid>
                        </Grid>
                    </a>
                </Link>
            </Box>

            {/* Art Basel Post */}
            <Box
                sx={{
                    borderTop: 50,
                    borderBottom: 50,
                    borderColor: "#ECE6F9",
                    backgroundColor: "#ECE6F9",
                    textAlign: {
                        xs: "center",
                    },
                    px: {
                        xs: "5%",
                        sm: "5%",
                        md: "10%",
                        lg: "10%",
                        xl: "10%",
                    },
                }}
            >
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item>
                        <Image
                            src="third_spaces.svg"
                            alt="third spaces"
                            width={450}
                            height={300}
                        />
                    </Grid>
                    <Grid item sx={{ mt: 1 }}>
                        <h2 style={{ fontSize: "28px" }}>
                            Art Basel 2025 Ultimate Guide 
                        </h2>
                    </Grid>
                    <Grid item>
                        <p style={{ maxWidth: "555px" }}>
                            Ultimate Guide to Art, Fashion, Music & Tech in Miami
                        </p>
                    </Grid>
                    <Grid item>
                        <Link href="/art-basel-2025-ultimate-guide-to-art-tech-fashion-and-parties-1hZxmVcDMF">
                            <Button
                                variant="contained"
                                disableElevation
                                sx={{ mt: 3 }}
                            >
                                Download Now
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Box>

            {/* Claim Poap */}
            {/* <Box
                sx={{
                    borderTop: 100,
                    borderBottom: 100,
                    borderColor: "#0A0510",
                    backgroundColor: "#0A0510",
                    textAlign: {
                        xs: "center",
                    },
                }}
            >
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={4}
                >
                    <Grid item>
                        <h2 style={{ color: "white", fontSize: "28px" }}>
                            Frens at Art Basel, claim your free VV POAP!
                        </h2>
                    </Grid>
                    <Grid item>
                        <Image
                            src="/vvCircleLogo.svg"
                            alt="vv logo"
                            height={80}
                            width={80}
                        />
                    </Grid>
                </Grid>
                <Link href="https://kiosk.poap.xyz/#/event/hog54Jm3tROGR2jbwb9A">
                    <Button variant="contained" disableElevation sx={{ mt: 3 }}>
                        Claim Violet Verse POAP
                    </Button>
                </Link>
            </Box> */}

            {/* Main Content */}
            <Box
                sx={{
                    px: {
                        xs: "0",
                        sm: "5%",
                        md: "10%",
                        lg: "15%",
                        xl: "20%",
                    },
                }}
            >
                {/* Curated Content Marketplace */}
<Box
  sx={{
    borderTop: 50,
    borderBottom: 50,
    borderColor: "#F9F4FE",
    backgroundColor: "#F9F4FE",
    px: {
      xs: "5%",
      sm: "5%",
      md: "10%",
      lg: "10%",
      xl: "10%",
    },
    py: 8,
    textAlign: "center",
  }}
>
  <Grid container direction="column" alignItems="center">
    <Grid item>
      <h2 style={{ fontSize: "28px", fontFamily: "serif", marginBottom: "1rem" }}>
        ✨ Dispatches from the Future
      </h2>
      <p style={{ maxWidth: "600px", margin: "0 auto", fontSize: "16px" }}>
        Subscribe to the <strong>Future by Melissa</strong> Substack to get fresh takes on AI, digital assets & lifestyle — every week.
      </p>
    </Grid>

    <Grid item sx={{ mt: 3 }}>
      <iframe
        src="https://futurebymelissa.substack.com/embed"
        width="100%"
        height="320"
        style={{
          maxWidth: "600px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          background: "#fff",
        }}
        frameBorder="0"
        scrolling="no"
        title="Future by Melissa Substack"
      ></iframe>
    </Grid>
  </Grid>
</Box>

                <ArticleGrid
                    title="Layers of the Verse"
                    posts={posts}
                    maximum={3}
                    seeAll={true}
                    mt={15}
                    authors={authors}
                    contributors={contributors}
                />

                {/* New to Web3? */}

                <InfoBlock title="New to Web3?" my={15} />
            </Box>
        </Box>
    );
};

export default Home;
