import styles from "../styles/Home.module.css";
import Link from "next/link";
import { Button, Container, Grid, Image } from "@nextui-org/react";
import { Text, Spacer } from "@nextui-org/react";

export default function Home() {
    return (
        <div>
            <Grid.Container gap={2} justify="center">
                <Grid direction="column" xs={4}>
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
                    <Container gap={0} css={{ d: "flex", flexWrap: "nowrap" }}>
                        <Link href="/about">
                            <Button>Read More</Button>
                        </Link>
                        <Spacer x={1} />
                        <Link href="/">
                            <Button color="secondary">Our Community</Button>
                        </Link>
                    </Container>
                </Grid>
                <Grid xs={8}>
                    <Image
                        showSkeleton
                        width={763}
                        height={338}
                        maxDelay={10000}
                        src="/Squared.png"
                        alt="Default Image"
                    />
                </Grid>
            </Grid.Container>
        </div>
    );
}
