import { Button, Grid } from "@mui/material";
import Link from "next/link";

const Dashboard = () => {
    return (
        <div>
            <Grid
                container
                direction="column"
                alignContent="center"
                justifyContent="center"
                align="center"
                spacing={4}
            >
                <Grid item>
                    <h1>Contributor Dashboard</h1>
                </Grid>
                <Grid item>
                    <Link href="/editor">
                        <a>
                            <Button variant="contained">Create Post</Button>
                        </a>
                    </Link>
                </Grid>
                <Grid item>
                    <h2>Your Posts:</h2>
                </Grid>
            </Grid>
        </div>
    );
};

export default Dashboard;
