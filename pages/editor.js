import { Button, Grid, TextField } from "@mui/material";
import React from "react";
import Editor from "../components/Editor";

const EditorPage = () => {
    const initialValue =
        "<h1>Into the Violet Verse</h1><p>Start writing your post here.</p>";
    const [value, setValue] = React.useState(initialValue);

    return (
        <>
            <Grid
                container
                direction="row"
                alignContent="center"
                justifyContent="center"
                sx={{ mb: 4 }}
            >
                <Grid item sx={{ display: "flex", flexGrow: 1 }}>
                    <TextField
                        variant="outlined"
                        label="Post Title"
                        fullWidth
                        autoFocus
                    />
                </Grid>
                <Grid item sx={{ display: "flex", flexGrow: 0, ml: 4 }}>
                    <Button
                        variant="contained"
                        disableElevation
                        color="success"
                        sx={{ borderRadius: "4px" }}
                    >
                        Create Post
                    </Button>
                </Grid>
            </Grid>
            <Editor
                value={value}
                onChange={setValue}
                controls={[
                    ["bold", "italic", "underline", "link", "image"],
                    ["unorderedList", "h1", "h2", "h3"],
                    ["sup", "sub"],
                ]}
            />
            {value}
        </>
    );
};

export default EditorPage;
