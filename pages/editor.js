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

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: { body: initialValue },
    });
    const onSubmit = (data) => console.log(data);

    // const onSubmit = async ({ title, subtitle, tldr, category, body }) => {
    //     try {
    //         table.create([
    //             {
    //                 fields: {
    //                     title: ``,
    //                     subtitle: ``,
    //                     tldr: ``,
    //                     category: ``,
    //                     body: ``,
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
                            {...register("title", {
                                required: "Required field",
                            })}
                            error={!!errors?.title}
                            helperText={
                                errors?.title ? errors.title.message : null
                            }
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
