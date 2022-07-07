import styles from "../styles/Home.module.css";
import Link from "next/link";
import {
    Button,
    Container,
    Grid,
    Image,
    Spacer,
    Text,
    Row,
} from "@nextui-org/react";

export default function Home() {
    return (
        <div>
            <Grid.Container gap={2} justify="space-between">
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
                    </Row>
                </Grid>
                <Grid xs={9}>
                    <Image
                        width={763}
                        height={338}
                        src="/Squared.png"
                        alt="Default Image"
                    />
                </Grid>
            </Grid.Container>
            <Grid.Container gap={2} justify="space-between">
                <Grid>
                    <Text h1 size={40} weight="bold">
                        Curated Content Marketplace
                    </Text>
                </Grid>
                <Grid xs={0} sm={0} md={4}>
                    <Button.Group color="gradient" ghost>
                        <Button>Tech</Button>
                        <Button>Lifestyle</Button>
                        <Button>Education</Button>
                    </Button.Group>
                </Grid>
                <Grid alignContent="center">
                    <Button flat size="sm" color="primary">
					See All
                    </Button>
                </Grid>
            </Grid.Container>
        </div>
    );
}
