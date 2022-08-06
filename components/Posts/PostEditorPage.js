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
    ToggleButtonGroup,
    ToggleButton,
    CircularProgress,
    Alert,
    AlertTitle,
} from "@mui/material";
import useSWR from "swr";
import Image from "next/image";
import Router from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import React, { useState, useEffect } from "react";
import RichTextEditor from "./Editor";

const postFetcher = (url) => fetch(url).then((r) => r.json());

const PostEditorPage = (props) => {
    const posts = props?.data;
    const editorMode = props?.editorMode;
    const author = props?.author;

    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState();

    const { data, mutate } = useSWR(`/api/database/getUserPosts`, postFetcher);

    const initialValue = editorMode
        ? posts?.body
        : "<h1>Into the Violet Verse</h1><p>This is a test post.</p>";

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: { body: initialValue },
    });

    const [bannerType, setBannerType] = useState(
        posts?.video ? "video" : "image"
    );

    const handleBannerTypeChange = (event, newType) => {
        if (newType !== null) {
            setBannerType(newType);
        }
    };

    const handlePictureSubmit = async () => {
        if (imageUrl && selectedImage) {
            const formData = new FormData();
            formData.append("image", selectedImage);

            return fetch(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
                {
                    method: "POST",
                    body: formData,
                }
            )
                .then((response) => response.json())
                .then((result) => {
                    return result.data.url;
                })
                .catch((err) => {
                    console.error(err);
                    setErrorMessage(err);
                    return null;
                });
        } else {
            return null;
        }
    };

    const onSubmit = async ({
        title,
        category,
        body,
        tldr,
        largeLetter,
        hidden,
        subtitle,
        video,
    }) => {
        if (loading) {
            return;
        }
        setLoading(true);
        const banner = await handlePictureSubmit();

        await fetch(
            editorMode
                ? "/api/database/updatePost"
                : "/api/database/createPost",
            {
                method: editorMode ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: editorMode ? posts.id : "",
                    issuer: editorMode ? author?.userId : "",
                    title: title,
                    category: category,
                    body: body,
                    tldr: tldr,
                    subtitle: subtitle,
                    largeLetter: largeLetter,
                    hidden: hidden,
                    banner: banner,
                    video: video,
                }),
            }
        )
            .then((response) => response.json())
            .then((newData) => {
                setLoading(false);
                mutate("/api/database/getUserPosts", [...data, newData]);
                Router.push(`/posts/${newData.id}`);
            })
            .catch((err) => {
                setLoading(false);
                setErrorMessage(err);
                console.log(err);
            });
    };

    const deletePost = async () => {
        if (!editorMode) {
            return;
        }
        setDeleting(true);
        setLoading(true);
        try {
            await fetch("/api/database/deletePost", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: posts.id,
                    issuer: author?.userId,
                }),
            });
            setDeleting(false);
            setLoading(false);
            Router.push("/posts");
        } catch (err) {
            setDeleting(false);
            setLoading(false);
            setErrorMessage(err);
            console.log(err);
        }
    };

    const clearPicture = () => {
        setImageUrl(posts?.banner || "");
    };

    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(posts?.banner || null);

    useEffect(() => {
        if (selectedImage) {
            setImageUrl(URL.createObjectURL(selectedImage));
        }
    }, [selectedImage]);

    return (
        <Box
            sx={{
                px: {
                    xs: "0",
                    sm: "5%",
                    md: "10%",
                    lg: "15%",
                    xl: "20%",
                },
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                {editorMode && (
                    <Link href={`/posts/` + posts.id}>
                        <a>
                            <p>Back to Post</p>
                        </a>
                    </Link>
                )}
                <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent={{ xs: "center", md: "space-between" }}
                    spacing={4}
                    sx={{ mb: 4 }}
                >
                    <Grid item xs={6} md={9}>
                        <Controller
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="Title"
                                    fullWidth
                                    autoFocus
                                    error={!!errors?.title}
                                    helperText={
                                        errors?.title
                                            ? errors.title.message
                                            : null
                                    }
                                    {...field}
                                />
                            )}
                            control={control}
                            name="title"
                            rules={{ required: "Required field" }}
                            defaultValue={posts?.title}
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
                                defaultValue={posts?.category}
                            />
                            <FormHelperText>
                                {errors?.title ? " " : null}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item sx={{ mb: 4 }}>
                    <ToggleButtonGroup
                        color="secondary"
                        value={bannerType}
                        exclusive
                        onChange={handleBannerTypeChange}
                    >
                        <ToggleButton value="image">Image</ToggleButton>
                        <ToggleButton value="video">Video</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>

                <Grid item sx={{ mb: 4 }}>
                    <input
                        accept="image/*"
                        type="file"
                        onChange={(e) => setSelectedImage(e.target.files[0])}
                        id="select-image"
                        style={{ display: "none" }}
                    />
                    <label htmlFor="select-image">
                        <Button
                            variant="contained"
                            color="primary"
                            component="span"
                            sx={{ borderRadius: "4px" }}
                        >
                            {bannerType == "video"
                                ? "Article Page Icon (Override Thumbnail)"
                                : "Select Banner"}{" "}
                            {imageUrl && selectedImage && (
                                <Box sx={{ ml: 2 }}>
                                    <Image
                                        alt={
                                            selectedImage?.name ||
                                            "current banner"
                                        }
                                        width={
                                            bannerType !== "video" ? 1920 : 400
                                        }
                                        height={
                                            bannerType !== "video" ? 1080 : 400
                                        }
                                        objectFit={"cover"}
                                        src={imageUrl}
                                    />
                                </Box>
                            )}
                            {posts?.banner && !selectedImage && (
                                <Box sx={{ ml: 2 }}>
                                    <Image
                                        alt={
                                            selectedImage?.name ||
                                            "current post banner"
                                        }
                                        width={1920}
                                        height={1080}
                                        objectFit={"cover"}
                                        src={imageUrl}
                                    />
                                </Box>
                            )}
                        </Button>
                    </label>
                    {posts?.banner && (
                        <Button onClick={() => clearPicture()}>
                            Reset Picture
                        </Button>
                    )}
                </Grid>

                {bannerType == "video" && (
                    <Grid item xs={12} sx={{ mb: 4 }}>
                        <Controller
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="YouTube URL"
                                    fullWidth
                                    {...field}
                                />
                            )}
                            control={control}
                            defaultValue={posts?.video}
                            name="video"
                        />
                    </Grid>
                )}

                <Grid item xs={12} sx={{ mb: 4 }}>
                    <Controller
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Subtitle"
                                fullWidth
                                multiline
                                error={!!errors?.subtitle}
                                helperText={
                                    errors?.subtitle
                                        ? errors.subtitle.message
                                        : null
                                }
                                {...field}
                            />
                        )}
                        control={control}
                        rules={{ required: "Required field" }}
                        name="subtitle"
                        defaultValue={posts?.subtitle}
                    />
                </Grid>
                {bannerType == "image" && (
                    <Grid item xs={12} sx={{ mb: 4 }}>
                        <Controller
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="TLDR"
                                    fullWidth
                                    multiline
                                    {...field}
                                />
                            )}
                            control={control}
                            name="tldr"
                            defaultValue={posts?.tldr}
                        />
                    </Grid>
                )}
                <Grid item sx={{ mb: 4 }}>
                    <Controller
                        name="largeLetter"
                        control={control}
                        defaultValue={
                            posts?.largeLetter == "true" ? true : false
                        }
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        {...field}
                                        defaultChecked={
                                            posts?.largeLetter == "true"
                                                ? true
                                                : false
                                        }
                                    />
                                }
                                label="Drop Cap"
                            />
                        )}
                    />
                    <Controller
                        name="hidden"
                        control={control}
                        defaultValue={posts?.hidden == "true" ? true : false}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
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
                    {/* <Button
                        type="submit"
                        variant="contained"
                        disableElevation
                        color="success"
                        sx={{ borderRadius: "4px", mb: 4 }}
                    >
                        {editorMode ? "Save" : "Create"}
                    </Button> */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ position: "relative" }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disableElevation
                                color="success"
                                sx={{ borderRadius: "4px", mb: 4 }}
                                disabled={loading}
                            >
                                {editorMode ? "Save" : "Create"}
                            </Button>
                            {editorMode && (
                                <Button
                                    sx={{ borderRadius: "4px", mb: 4, ml: 2 }}
                                    variant="contained"
                                    color="error"
                                    onClick={() => deletePost()}
                                    disabled={loading}
                                >
                                    Delete Post
                                </Button>
                            )}
                            {loading && !deleting && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        color: "green",
                                        position: "absolute",
                                        top: "30%",
                                        left: editorMode ? "16%" : "47%",
                                        marginTop: "-12px",
                                        marginLeft: "-12px",
                                    }}
                                />
                            )}
                            {loading && deleting && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        color: "red",
                                        position: "absolute",
                                        top: "30%",
                                        left: "70%",
                                        marginTop: "-12px",
                                        marginLeft: "-12px",
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                </Grid>
                {errorMessage && (
                    <Grid item>
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>
                    </Grid>
                )}
            </form>
        </Box>
    );
};

export default PostEditorPage;
