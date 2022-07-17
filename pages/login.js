import React from "react";
import { Button, TextField, Container, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { Magic } from "magic-sdk";
import Router from "next/router";

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async ({ email }) => {
        const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISH_KEY);
        const didToken = await magic.auth.loginWithMagicLink({ email });
        const authRequest = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + didToken,
            },
            body: JSON.stringify({ email }),
        });
        if (authRequest.ok) {
            // We successfully logged in, our API
            // set authorization cookies and now we
            // can redirect to the dashboard!
            Router.push("/dashboard");
        } else {
            /* handle errors */
        }
    };

    return (
        <div>
            <Container maxWidth="xs">
                <h1>Magic Login</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box mb={2}>
                        <TextField
                            variant="outlined"
                            label="email"
                            fullWidth
                            autoComplete="email"
                            autoFocus
                            {...register("email", {
                                required: "Required field",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address",
                                },
                            })}
                            error={!!errors?.email}
                            helperText={
                                errors?.email ? errors.email.message : null
                            }
                        />
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Login / Sign Up
                    </Button>
                </form>
            </Container>
        </div>
    );
}
