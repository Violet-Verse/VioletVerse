import styles from "../styles/Home.module.css";
import Image from "next/image";
import { Grid, Button, ButtonGroup } from "@mui/material";
import { Text } from "@nextui-org/react";

const Resources = () => {
    /*First Section*/

    return (
        <div>
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
                        New to web3?
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
            </Grid>
            <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                marginTop="100px"
            ></Grid>
            <Grid item md={5} lg={4}>
                <ButtonGroup
                    container
                    aria-label="outlined primary button group"
                    size="large"
                    alignItems="center"
                >
                    <Button>Events</Button>
                    <Button>Resources</Button>
                    <Button>Getting Started</Button>
                </ButtonGroup>
            </Grid>
        </div>
    );
};

export default Resources;
