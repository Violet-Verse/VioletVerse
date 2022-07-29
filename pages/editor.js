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
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
// import { table } from "../pages/api/utils/postsTable";
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

    const { register, handleSubmit, control } = useForm({
        defaultValues: { body: initialValue },
        
    });

    const onSubmit = (data) => console.log(data); // Made for testing in console

    // const onSubmit = async ({ title, subtitle, tldr, category, body }) => {
    //     try {
    //         table.create([
    //             {
    //                 fields: {
    //                     title: `${title}`,
    //                     subtitle: `${subtitle}`,
    //                     tldr: `${tldr}`,
    //                     category: `${category}`,
    //                     body: `${body}`,
    //                 },
    //             },
    //         ]);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    return (
        <Box sx={{ px: { xs: "5%", sm: "0px" } }}>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                            {...register("title")}
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-helper-label">
                                Category
                            </InputLabel>
                            <Controller
                                render={({ field }) => (
                                    <Select {...field}>
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={"Tech"}>Tech</MenuItem>
                                        <MenuItem value={"Lifestyle"}>
                                            Lifestyle
                                        </MenuItem>
                                        <MenuItem value={"Education"}>
                                            Education
                                        </MenuItem>
                                    </Select>
                                )}
                                control={control}
                                name="category"
                                defaultValue={""}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <Button
                            type="submit"
                            // disabled
                            variant="contained"
                            disableElevation
                            color="success"
                            sx={{ borderRadius: "4px" }}
                        >
                            Create Post
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{mb:4}}>
                        <TextField
                            variant="outlined"
                            label="Summary"
                            fullWidth
                            autoFocus
                            {...register("tldr")}
                        />
                    </Grid>
                
                <Controller
                    control={control}
                    name="body"
                    render={({ field: { onChange, value } }) => (
                        <RichTextEditor value={value} onChange={onChange} />
                    )}
                />

                {/* Mantine - RTE https://mantine.dev/others/rte/ */}
            </form>
        </Box>
    );
};

export default EditorPage;