import { Button, ButtonGroup, Grid } from "@mui/material";
import React, { useState } from "react";

import styles from "../styles/Home.module.css";

const Resources = () => {
    const [category, setCategory] = useState(0);
    const handleCategory = (newCategory) => {
        if (newCategory == category) {
            setCategory(0);
        } else {
            setCategory(newCategory);
        }
    };

    return (
        <>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                spacing={2}
            >
                <Grid item>
                    <h1>New to web3?</h1>
                </Grid>
                <Grid item>
                    <p>
                        Strong, sweet, cup americano spoon blue mountain <br />
                        black robusta breve. Skinny variety to go white rich,
                        redeye crema breve whipped. <br />
                    </p>
                </Grid>
                <Grid item>
                    <ButtonGroup size="large" color="secondary">
                        <Button
                            onClick={() => handleCategory(1)}
                            variant={category == 1 ? "contained" : "outlined"}
                        >
                            Events
                        </Button>
                        <Button
                            onClick={() => handleCategory(2)}
                            variant={category == 2 ? "contained" : "outlined"}
                        >
                            Resources
                        </Button>
                        <Button
                            onClick={() => handleCategory(3)}
                            variant={category == 3 ? "contained" : "outlined"}
                        >
                            Getting Started
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </>
    );
};

export default Resources;
