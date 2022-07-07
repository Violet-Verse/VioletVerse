import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import { Grid, Button } from "@mui/material";
import { Text } from "@nextui-org/react";

export default function Home() {
    return (
        <div>
            {/* First Section */}
            <Grid container direction="row" spacing={6} justifyContent="center">
                <Grid item xs={3}>
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
                    <Grid container direction="row" spacing={2}>
                        <Grid item>
                            <Link href="/about">
                                <Button variant="contained">Read More</Button>
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/">
                                <Button variant="outlined" color="secondary">
                                    Our Community
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                    <Grid container spacing={4}></Grid>
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
            {/* Second Section */}
            <Grid container>
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
