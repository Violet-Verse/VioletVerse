import styles from "../styles/Home.module.css";
import Link from "next/link";
import { Button, Container, Grid, Image, Spacer, Text, Row } from "@nextui-org/react";

export default function Home() {
    return (
        <div>
            <Grid.Container gap={2} justify="center">
                <Grid direction="column" justify="center" xs={3}>

                    <Text
                        h1
                        size={40}
                        css={{
                            textGradient:
                                "45deg, $yellow600 -20%, $red600 100%",
                        }}
                        weight="bold"
                    >
                        Welcome to the Violet Verse
                    </Text>
                    <p className={styles.text}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                    </p>


                    <Row wrap="wrap">
                        <Link href="/about">
                            <Button>Read More</Button>
                        </Link>
                        <Spacer x={1} />
                        <Link href="/">
                            <Button color="secondary">Our Community</Button>
                        </Link>
                        {/* Here is where the next section starts */}
                        <Row>
                        <Grid justify="space-between" xs={5}> </Grid>
                        </Row>
                        <Text
                        h1k
                        font-family= "Work Sans"
                        size={43}
                        color= "#f293854"
                        weight="bold"
                    >
                        Curated Content Marketplace
                    </Text>
                    </Row>
                </Grid>
                <Grid xs={9}>
                    <Image
                        width={763
						}
                        height={338}
                        src="/Squared.png"
                        alt="Default Image"
                    />
                </Grid>
            </Grid.Container>
        </div>
    );
}
