import { Button, TextField, Container, Box } from "@mui/material";
import { useForm } from "react-hook-form";

const Dashboard = () => {
    return (
        <div>
            <Container maxWidth="xs">
                <h1>Dashboard</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box mb={2}>
                        <TextField
                            variant="outlined"
                            multiline
                            rows={2}
                            maxRows={4}
                            label="body"
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
};

export default Dashboard;
