import { useForm } from "react-hook-form";
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    TextField,
    MenuItem,
    Typography,
    Card,
    CardContent,
} from "@mui/material";
import React, { useState } from "react";

const DESTINATIONS = [
    { value: "Sedona AZ", label: "Sedona, Arizona" },
    { value: "DisneyWorld FL", label: "Walt Disney World, Orlando FL" },
];

const DESTINATION_INFO = {
    "Sedona AZ": {
        tagline: "Red rocks, luxury spas & desert magic",
        emoji: "🏜️",
        highlights: ["Red Rock Jeep Tours", "World-class Spas", "Hiking & Vortex Sites", "Fine Dining"],
    },
    "DisneyWorld FL": {
        tagline: "4 parks, endless magic & family memories",
        emoji: "🏰",
        highlights: ["Magic Kingdom", "EPCOT", "Hollywood Studios", "Animal Kingdom"],
    },
};

const TravelPage = () => {
    const [submitted, setSubmitted] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState("");
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    const watchedDestination = watch("destination");

    const onSubmit = async (data) => {
        try {
            const res = await fetch("/api/travel/submit-inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    destination: data.destination,
                    travelDates: data.travelDates,
                    partySize: data.partySize,
                    budget: data.budget,
                    specialRequests: data.specialRequests,
                }),
            });

            const json = await res.json();

            if (res.status === 429) {
                alert(json.error || "An inquiry was already submitted from this email. We'll be in touch soon!");
                return;
            }

            if (!res.ok) {
                alert("Something went wrong. Please try again or email us directly at travel@violetverse.io");
                return;
            }

            setSubmitted(true);
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        }
    };

    if (submitted) {
        return (
            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    textAlign: "center",
                    px: 3,
                }}
            >
                <Typography variant="h2" sx={{ fontSize: "64px", mb: 2 }}>✈️</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, color: "#4c1d95" }}>
                    Your proposal is on its way!
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: 480, color: "#6b7280", lineHeight: 1.8 }}>
                    Check your inbox — a personalized trip proposal with hotel options, itinerary highlights,
                    and a credit card authorization form will arrive shortly. Reply to that email to confirm your booking.
                </Typography>
                <Typography variant="body2" sx={{ mt: 3, color: "#9ca3af" }}>
                    Questions? Email us at{" "}
                    <a href="mailto:travel@violetverse.io" style={{ color: "#7c3aed" }}>
                        travel@violetverse.io
                    </a>
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Hero */}
            <Box
                sx={{
                    background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 60%, #a78bfa 100%)",
                    color: "#fff",
                    py: { xs: 8, md: 12 },
                    px: 3,
                    textAlign: "center",
                }}
            >
                <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2, fontSize: { xs: "2rem", md: "3rem" } }}>
                    Let Me Plan Your Dream Trip ✈️
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: "auto", fontWeight: "normal" }}>
                    Licensed InteliTravel agent offering exclusive hotel rates, personalized itineraries,
                    and white-glove booking service.
                </Typography>
                <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                    {["🏨 Exclusive Hotel Rates", "🛡️ Fully Licensed Agent", "📋 Personalized Proposals", "🤝 Commission-Free Advice"].map((badge) => (
                        <Box
                            key={badge}
                            sx={{
                                background: "rgba(255,255,255,0.15)",
                                borderRadius: "24px",
                                px: 2,
                                py: 0.75,
                                fontSize: "14px",
                                fontWeight: 500,
                            }}
                        >
                            {badge}
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Spring Break Destinations */}
            <Box sx={{ py: 8, px: { xs: 2, md: 6 }, maxWidth: 900, mx: "auto" }}>
                <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", mb: 1, color: "#1f2937" }}>
                    Spring Break 2025 Destinations
                </Typography>
                <Typography variant="body1" sx={{ textAlign: "center", color: "#6b7280", mb: 5 }}>
                    I have warm relationships with top hotels in both destinations and can get you the best rates.
                </Typography>

                <Grid container spacing={3} sx={{ mb: 8 }}>
                    {DESTINATIONS.map(({ value, label }) => {
                        const info = DESTINATION_INFO[value];
                        return (
                            <Grid item xs={12} md={6} key={value}>
                                <Card
                                    sx={{
                                        border: "2px solid",
                                        borderColor: watchedDestination === value ? "#7c3aed" : "#e5e7eb",
                                        borderRadius: 3,
                                        transition: "border-color 0.2s",
                                        cursor: "default",
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h2" sx={{ fontSize: "48px", mb: 1 }}>
                                            {info.emoji}
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1f2937" }}>
                                            {label}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#7c3aed", mb: 2 }}>
                                            {info.tagline}
                                        </Typography>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                            {info.highlights.map((h) => (
                                                <Box
                                                    key={h}
                                                    sx={{
                                                        background: "#f3f4f6",
                                                        borderRadius: "12px",
                                                        px: 1.5,
                                                        py: 0.5,
                                                        fontSize: "12px",
                                                        color: "#374151",
                                                    }}
                                                >
                                                    {h}
                                                </Box>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* Inquiry Form */}
                <Box
                    sx={{
                        background: "#faf5ff",
                        border: "1px solid #e9d5ff",
                        borderRadius: 3,
                        p: { xs: 3, md: 5 },
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1, color: "#4c1d95" }}>
                        Get Your Free Trip Proposal
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6b7280", mb: 4 }}>
                        Fill out the form below and I&apos;ll personally send you a curated proposal with hotel options,
                        a sample itinerary, and pricing — within minutes.
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    label="Full Name"
                                    placeholder="Jane Smith"
                                    fullWidth
                                    required
                                    error={!!errors?.name}
                                    helperText={errors?.name?.message}
                                    {...register("name", {
                                        required: "Name is required.",
                                        maxLength: { value: 80, message: "Name too long." },
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    label="Email Address"
                                    placeholder="jane@email.com"
                                    fullWidth
                                    required
                                    type="email"
                                    error={!!errors?.email}
                                    helperText={errors?.email?.message}
                                    {...register("email", {
                                        required: "Email is required.",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Invalid email address.",
                                        },
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    variant="outlined"
                                    label="Destination"
                                    fullWidth
                                    required
                                    defaultValue=""
                                    error={!!errors?.destination}
                                    helperText={errors?.destination?.message || "Where do you want to go?"}
                                    {...register("destination", { required: "Please select a destination." })}
                                >
                                    {DESTINATIONS.map(({ value, label }) => (
                                        <MenuItem key={value} value={value}>
                                            {DESTINATION_INFO[value].emoji} {label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    label="Travel Dates"
                                    placeholder="e.g. March 22–29, 2025"
                                    fullWidth
                                    required
                                    error={!!errors?.travelDates}
                                    helperText={errors?.travelDates?.message || "Approximate dates are fine"}
                                    {...register("travelDates", { required: "Travel dates are required." })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    label="Party Size"
                                    placeholder="2"
                                    fullWidth
                                    type="number"
                                    inputProps={{ min: 1, max: 20 }}
                                    helperText="Number of travelers"
                                    {...register("partySize", {
                                        min: { value: 1, message: "Minimum 1 traveler." },
                                        max: { value: 20, message: "For groups over 20, please email us." },
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    label="Approximate Budget"
                                    placeholder="3000"
                                    fullWidth
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    helperText="Total budget in USD (optional)"
                                    {...register("budget")}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    label="Special Requests"
                                    placeholder="Celebrating a birthday, need wheelchair access, traveling with kids, prefer adventure activities..."
                                    fullWidth
                                    multiline
                                    rows={3}
                                    {...register("specialRequests", {
                                        maxLength: { value: 500, message: "Max 500 characters." },
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Box sx={{ position: "relative" }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disableElevation
                                            disabled={isSubmitting}
                                            sx={{
                                                background: "#7c3aed",
                                                "&:hover": { background: "#6d28d9" },
                                                borderRadius: "8px",
                                                px: 4,
                                                py: 1.5,
                                                fontSize: "16px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Send Me a Proposal ✈️
                                        </Button>
                                        {isSubmitting && (
                                            <CircularProgress
                                                size={24}
                                                sx={{
                                                    color: "#7c3aed",
                                                    position: "absolute",
                                                    top: "50%",
                                                    left: "50%",
                                                    marginTop: "-12px",
                                                    marginLeft: "-12px",
                                                }}
                                            />
                                        )}
                                    </Box>
                                    <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                                        Free · No obligation · Proposal arrives in your inbox within minutes
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Box>

                {/* Trust signals */}
                <Box sx={{ mt: 6, textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                        Licensed InteliTravel Agent · Protected booking process · Your data is never shared
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default TravelPage;
