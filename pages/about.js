import styles from "../styles/Home.module.css";
import Image from "next/image";
import { Grid, Button, ButtonGroup } from "@mui/material";
import { Text } from "@nextui-org/react";

const About = () => {
    return (
        <div>
            {/* First section */}
            <Grid
                container
                direction="row"
                spacing={6}
                justifyContent="space-around"
                alignItems="center"
            ></Grid>
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
                    justifyContent="space-evenly"
                    alignItems="center"
                    marginTop="80px"
                >
                    <Image
                        width={270}
                        height={313}
                        src="/Squared.png"
                        alt="Default Image"
                    />
                    <Image
                        width={270}
                        height={313}
                        src="/Squared.png"
                        alt="Default Image"
                    />
                    <Image
                        width={270}
                        height={313}
                        src="/Squared.png"
                        alt="Default Image"
                    />
                    <Image
                        width={270}
                        height={313}
                        src="/Squared.png"
                        alt="Default Image"
                    />
                </Grid>
                <Grid item></Grid>
            </Grid>
        </div>
    );
};

export default About;
