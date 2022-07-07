import styles from "../styles/Home.module.css";
import Link from "next/link";
import { Grid } from "@mui/material";
import { Button, Container, Image, Spacer, Text } from "@nextui-org/react";
import { MultiSelectUnstyled } from "@mui/base";

export default function Home() {
    return (
        <div>
            {/* First row of the homepage*/}
            <Grid container direction="row" justify="center">
                <Grid item justify="center" xs={3}>
                    {/* Here is the color for the welcome part*/}
                    <Text
                        h1k
                        font-family="Work Sans"
                        size={43}
                        color="#293854"
                        weight="bold"
                    >
                        Welcome to the Violet Verse
                    </Text>
                    <p className={styles.text}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                    </p>

                    <Grid wrap="wrap">
                        <Link href="/about">
                            <Button>Read More</Button>
                        </Link>
                        <Spacer x={1} />
                        <Link href="/">
                            <Button color="secondary">Our Community</Button>
                        </Link>
                    </Grid>
                    <Grid item xs={9}>
                        <Image
                            width={763}
                            height={338}
                            src="/Squared.png"
                            alt="Default Image"
                        />
                    </Grid>
                    {/* Here is where the next section starts */}

                    <Grid container spacing={4}></Grid>
                    <Grid justify="space-between" xs={6}>
                        {" "}
                    </Grid>
                </Grid>
                <Text
                    h1k
                    font-family="Work Sans"
                    size={43}
                    color="#f293854"
                    weight="bold"
                >
                    Curated Content Marketplace
                </Text>
            </Grid>
        </div>
    );
}
