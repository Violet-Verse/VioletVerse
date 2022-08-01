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
    Snackbar,
    Alert,
} from "@mui/material";
import useSWR from "swr";
import Router from "next/router";
import Link from "next/link";
import { useUser } from "../../hooks/useAuth";
import { server } from "../../components/config";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import React, { useState } from "react";
import RichTextEditor from "../../components/Editor";

export async function getServerSideProps(context) {
    const id = context.params.id;
    const res = await fetch(
        `${server}/api/database/getPostsByID?` +
            new URLSearchParams({
                id: id,
            })
    );

    const data = await res.json();

    if (!data) {
        return { notFound: true, props: { posts: {} } };
    }

    return {
        props: {
            posts: data[0],
            protected: true,
            userTypes: ["admin", "collaborator"],
        },
    };
}

const EditArticle = ({ posts }) => {
    const { user } = useUser();
    const fetchWithId = (url, id) =>
        fetch(`${url}?id=${id}`).then((r) => r.json());
    const { data, error } = useSWR(
        ["/api/database/getUserForPost", posts.createdBy],
        fetchWithId
    );
    const author = data?.user;

    const initialValue = posts.body;

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: { body: initialValue },
    });

    const onSubmit = async ({
        title,
        category,
        body,
        tldr,
        noLargeLetter,
        hidden,
    }) => {
        try {
            await fetch("/api/database/updatePost", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: posts.id,
                    issuer: author?.userId,
                    title: title,
                    category: category,
                    body: body,
                    tldr: tldr,
                    noLargeLetter: noLargeLetter,
                    hidden: hidden,
                }),
            })
                .then((response) => response.json())
                .then((newData) => {
                    Router.push(`/posts/${newData.id}`);
                });
        } catch (err) {
            console.log(err);
            handleClick();
        }
    };

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const allowed =
        user?.userId == author?.userId && user?.userId !== undefined;

    // const onSubmit = (data) => console.log({ ...data, id: posts.id }); // Made for testing in console

    return (
        <Box sx={{ px: { xs: "5%", sm: "0px" } }}>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
            >
                <Alert
                    onClose={handleClose}
                    severity="error"
                    sx={{ width: "100%" }}
                >
                    Error: Not Allowed!
                </Alert>
            </Snackbar>
            {/* user?.userId == author?.userId && user?.userId !== undefined ? */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <Link href={`/posts/` + posts.id}>
                    <a>
                        <p>Back to Post</p>
                    </a>
                </Link>
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
                            disabled={!allowed}
                            variant="outlined"
                            label="Title"
                            fullWidth
                            defaultValue={posts?.title}
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
                                    <Select {...field} disabled={!allowed}>
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
                                defaultValue={posts?.category}
                            />
                            <FormHelperText>
                                {errors?.title ? " " : null}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ mb: 4 }}>
                    <TextField
                        disabled={!allowed}
                        variant="outlined"
                        label="Subtitle"
                        fullWidth
                        autoFocus
                        defaultValue={posts?.subtitle}
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
                        disabled={!allowed}
                        variant="outlined"
                        label="TLDR"
                        fullWidth
                        autoFocus
                        defaultValue={posts?.tldr}
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
                        defaultValue={
                            posts?.noLargeLetter == "true" ? true : false
                        }
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled={!allowed}
                                        {...field}
                                        defaultChecked={
                                            posts?.noLargeLetter == "true"
                                                ? true
                                                : false
                                        }
                                    />
                                }
                                label="Disable Drop Cap"
                            />
                        )}
                    />
                    <Controller
                        name="hidden"
                        control={control}
                        defaultValue={posts?.hiden == "true" ? true : false}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled={!allowed}
                                        {...field}
                                        defaultChecked={
                                            posts?.hidden == "true"
                                                ? true
                                                : false
                                        }
                                    />
                                }
                                label="Hide Post"
                            />
                        )}
                    />
                </Grid>
                {allowed && (
                    <Grid item>
                        <Controller
                            control={control}
                            name="body"
                            render={({ field: { onChange, value } }) => (
                                <RichTextEditor
                                    value={value}
                                    onChange={onChange}
                                />
                            )}
                        />
                    </Grid>
                )}
                <Grid item sx={{ mt: 4 }}>
                    <Button
                        disabled={!allowed}
                        type="submit"
                        // disabled
                        variant="contained"
                        disableElevation
                        color="success"
                        sx={{ borderRadius: "4px" }}
                    >
                        Save
                    </Button>
                </Grid>
            </form>
        </Box>
    );
};

export default EditArticle;
