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
} from "@mui/material";
import Router from "next/router";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import RichTextEditor from "../../components/Editor";
import useSWR from "swr";
import Image from "next/image";
import React, { useState, useEffect } from "react";

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
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: { body: initialValue },
    });

    const [bannerType, setBannerType] = useState("image");

    const handleBannerTypeChange = (event, newType) => {
        setBannerType(newType);
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
        const banner = await handlePictureSubmit();
        console.log(banner);

        await fetch("/api/database/createPost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                category: category,
                subtitle: subtitle,
                body: body,
                tldr: tldr,
                largeLetter: largeLetter,
                hidden: hidden,
                banner: banner,
                video: video,
            }),
        })
            .then((response) => response.json())
            .then((newData) => {
                mutate("/api/database/getUserPosts", [...data, newData]);
                Router.push(`/posts/${newData.id}`);
            });
    };

    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (selectedImage) {
            setImageUrl(URL.createObjectURL(selectedImage));
        }
    }, [selectedImage]);

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
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-helper-label">
                                Category
                            </InputLabel>
                            <Controller
                                render={({ field }) => (
                                    <Select {...field} defaultValue={"Tech"}>
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
                            />
                            <FormHelperText>
                                {errors?.title ? " " : null}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item sx={{ mb: 2 }}>
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
                {bannerType == "image" ? (
                    <Grid item>
                        <input
                            accept="image/*"
                            type="file"
                            onChange={(e) =>
                                setSelectedImage(e.target.files[0])
                            }
                            id="select-image"
                            style={{ display: "none" }}
                        />
                        <label htmlFor="select-image">
                            <Button
                                variant="contained"
                                color="primary"
                                component="span"
                                sx={{ borderRadius: "4px", mb: 4 }}
                            >
                                Select Banner{" "}
                                {imageUrl && selectedImage && (
                                    <Box sx={{ ml: 2 }}>
                                        <Image
                                            alt={
                                                selectedImage?.name ||
                                                "current banner"
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
                    </Grid>
                ) : (
                    <Grid item xs={12} sx={{ mb: 4 }}>
                        <Controller
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="YouTube URL"
                                    fullWidth
                                    autoFocus
                                    error={!!errors?.video}
                                    helperText={
                                        errors?.video
                                            ? errors.video.message
                                            : null
                                    }
                                    {...field}
                                />
                            )}
                            control={control}
                            name="video"
                            rules={{
                                pattern: {
                                    value: /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/gm,
                                    message: "Invalid YouTube URL",
                                },
                            }}
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
                                autoFocus
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
                                    autoFocus
                                    multiline
                                    {...field}
                                />
                            )}
                            control={control}
                            name="tldr"
                        />
                    </Grid>
                )}
                <Grid item sx={{ mb: 4 }}>
                    <Controller
                        name="largeLetter"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={<Checkbox {...field} />}
                                label="Drop Cap"
                            />
                        )}
                    />
                    <Controller
                        name="hidden"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={<Checkbox {...field} />}
                                label="Hide Post to Public"
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
                        variant="contained"
                        disableElevation
                        color="success"
                        sx={{ borderRadius: "4px" }}
                    >
                        Create
                    </Button>
                </Grid>
            </form>
        </Box>
    );
};

export default EditorPage;
