import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import { Grid, Button, ButtonGroup } from "@mui/material";
import { Text } from "@nextui-org/react";

export default function Home() {
    return (
        <div>
            {/* First Section */}
            <Grid
                container
                direction="row"
                spacing={6}
                justifyContent="space-around"
                alignItems="center"
            >
                <Grid item xs={6}>
                    <Text h1 size={43} color="#f293854" weight="bold">
                        Welcome to the Violet Verse
                    </Text>
                    <p className={styles.text}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Strong, sweet, cup americano spoon blue
                        mountain black robusta breve. Skinny variety to go white
                        rich, redeye crema breve whipped. Strong, sweet, cup
                        americano spoon blue mountain black robusta breve.
                        Skinny variety to go white rich, redeye crema breve
                        whipped.
                    </p>
                    <Grid container direction="row" spacing={2}>
                        <Grid item>
                            <Link href="/">
                                <Button variant="contained">Read More</Button>
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/about">
                                <Button variant="outlined" color="secondary">
                                    Our Community
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
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
            <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                marginTop="100px"
            >
                <Grid item md={12} lg={6}>
                    <Text h1 size={43} color="#f293854" weight="bold">
                        Curated Content Marketplace
                    </Text>
                </Grid>
                <Grid item md={6} lg={4}>
                    <ButtonGroup
                        variant="outlined"
                        aria-label="outlined primary button group"
                        size="medium"
                        fullWidth="true"
                    >
                        <Button>Tech</Button>
                        <Button>Lifestyle</Button>
                        <Button>Education</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item>
                    <Button>[+] See All</Button>
                </Grid>
            </Grid>
            <Grid container spacing={2} align="left" marginTop="25px">
                <Grid item xs={12} sm={6} md={4}>
                    <Image
                        src="/Rectangle.png"
                        alt="Placeholder Image"
                        width={370}
                        height={158}
                    />
                    <Text h3 color="#f293854" weight="bold">
                        Article Title
                    </Text>
                    <Text color="#4D20A3" weight="semibold">
                        Content Creator | Tech
                    </Text>
                    <Text
                        color="#A4B0C0"
                        weight="medium"
                        css={{ maxWidth: "370px" }}
                    >
                        Strong, sweet, cup americano spoon blue mountain black
                        robusta breve. Skinny variety to go white rich, redeye
                        crema breve whipped.
                    </Text>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Image
                        src="/Rectangle.png"
                        alt="Placeholder Image"
                        width={370}
                        height={158}
                    />
                    <Text h3 color="#f293854" weight="bold">
                        Article Title
                    </Text>
                    <Text color="#4D20A3" weight="semibold">
                        Content Creator | Tech
                    </Text>
                    <Text
                        color="#A4B0C0"
                        weight="medium"
                        css={{ maxWidth: "370px" }}
                    >
                        Strong, sweet, cup americano spoon blue mountain black
                        robusta breve. Skinny variety to go white rich, redeye
                        crema breve whipped.
                    </Text>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Image
                        src="/Rectangle.png"
                        alt="Placeholder Image"
                        width={370}
                        height={158}
                    />
                    <Text h3 color="#f293854" weight="bold">
                        Article Title
                    </Text>
                    <Text color="#4D20A3" weight="semibold">
                        Content Creator | Tech
                    </Text>
                    <Text
                        color="#A4B0C0"
                        weight="medium"
                        css={{ maxWidth: "370px" }}
                    >
                        Strong, sweet, cup americano spoon blue mountain black
                        robusta breve. Skinny variety to go white rich, redeye
                        crema breve whipped.
                    </Text>
                </Grid>
            </Grid>
        </div>
    );
}
