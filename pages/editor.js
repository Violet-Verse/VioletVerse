import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import React from "react";

import RichTextEditor from "../components/Editor";

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
            userTypes: ["admin", "collaborator"],
        },
    };
}

const EditorPage = () => {
    const initialValue =
        "<h1>Into the Violet Verse</h1><p>Posting is currently disabled.</p>";
    const [value, setValue] = React.useState(initialValue);
    const [category, setCategory] = React.useState("");
    const handleChange = (event) => {
        setCategory(event.target.value);
    };

    return (
        <Box sx={{ px: { xs: "5%", sm: "0px" } }}>
            <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent={{ xs: "center", md: "space-between" }}
                spacing={4}
                sx={{ mb: 4 }}
            >
                <Grid item xs={6} md={6}>
                    <TextField
                        variant="outlined"
                        label="Post Title"
                        fullWidth
                        autoFocus
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-helper-label">
                            Category
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            value={category}
                            id="demo-simple-select-helper"
                            label="Age"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={"Tech"}>Tech</MenuItem>
                            <MenuItem value={"Lifestyle"}>Lifestyle</MenuItem>
                            <MenuItem value={"Education"}>Education</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Button
                        disabled
                        variant="contained"
                        disableElevation
                        color="success"
                        sx={{ borderRadius: "4px" }}
                    >
                        Create Post
                    </Button>
                </Grid>
            </Grid>
            <RichTextEditor
                value={value}
                onChange={setValue}
                // controls={[
                //     ["bold", "italic", "underline", "link", "image"],
                //     ["unorderedList", "h1", "h2", "h3"],
                //     ["sup", "sub"],
                // ]}
            />
            {/* {value} */}
        </Box>
    );
};

export default EditorPage;
