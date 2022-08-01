import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    FormHelperText,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import Router from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import RichTextEditor from "../../components/Editor";
import useSWR from "swr";

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
            userTypes: ["admin", "collaborator"],
        },
    };
}

const postFetcher = (url) => fetch(url).then((r) => r.json());

const EditorPage = () => {
    const { data, mutate } = useSWR(`/api/database/getUserPosts`, postFetcher);
    const initialValue =
        "<h1>Into the Violet Verse</h1><p>This is a test post.</p>";

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: { body: initialValue },
    });

    // const onSubmit = (data) => console.log(data); // Made for testing in console

    const onSubmit = async ({ title, category, body, tldr, noLargeLetter }) => {
        await fetch("/api/database/createPost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                category: category,
                body: body,
                tldr: tldr,
                noLargeLetter: noLargeLetter,
            }),
        })
            .then((response) => response.json())
            .then((newData) => {
                mutate("/api/database/getUserPosts", [...data, newData]);
                Router.push(`/posts/${newData.id}`);
                // Router.push("/dashboard");
            });
    };

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
                    <Grid item xs={6} md={9}>
                        <TextField
                            variant="outlined"
                            label="Title"
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
                                defaultValue={"Tech"}
                            />
                            <FormHelperText>
                                {errors?.title ? " " : null}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ mb: 4 }}>
                    <TextField
                        variant="outlined"
                        label="Subtitle"
                        fullWidth
                        autoFocus
                        {...register("subtitle", {
                            required: "Required field",
                        })}
                        error={!!errors?.subtitle}
                        helperText={
                            errors?.subtitle ? errors.subtitle.message : null
                        }
                    />
                </Grid>
                <Grid item xs={12} sx={{ mb: 4 }}>
                    <TextField
                        variant="outlined"
                        label="TLDR"
                        fullWidth
                        autoFocus
                        {...register("tldr", {
                            required: "Required field",
                        })}
                        error={!!errors?.subtitle}
                        helperText={errors?.tldr ? errors.tldr.message : null}
                    />
                </Grid>
                <Grid item sx={{ mb: 4 }}>
                    <Controller
                        name="noLargeLetter"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                            <FormControlLabel
                                control={<Checkbox {...field} />}
                                label="Disable Drop Cap"
                            />
                        )}
                    />
                </Grid>
                <Grid item>
                    <Controller
                        control={control}
                        name="body"
                        render={({ field: { onChange, value } }) => (
                            <RichTextEditor value={value} onChange={onChange} />
                        )}
                    />
                </Grid>
                <Grid item sx={{ mt: 4 }}>
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

                {/* Mantine - RTE https://mantine.dev/others/rte/ */}
            </form>
        </Box>
    );
};

export default EditorPage;
