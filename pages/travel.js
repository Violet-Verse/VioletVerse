import { Box, Button, Grid } from "@mui/material";
import Head from "next/head";
import { useState } from "react";

const sectionPx = { xs: "5%", sm: "5%", md: "10%", lg: "10%", xl: "15%" };
const sectionPy = { xs: 8, sm: 10, md: 12 };

const Travel = () => {
    const siteTitle = "Travel with Violet Verse";
    const metaDescription =
        "Curated travel experiences for culture, crypto, and creative communities — from Art Basel Miami to dinners in Paris.";

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        destination: "",
        dates: "",
        type: "",
        notes: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Form submission — connect to your preferred service
        alert("Thanks! We'll be in touch soon.");
    };

    const inputStyle = {
        width: "100%",
        padding: "14px 16px",
        backgroundColor: "#f2f4f3",
        border: "1px solid rgba(90, 80, 63, 0.3)",
        borderRadius: "12px",
        fontFamily: "stratos-lights",
        fontSize: "16px",
        color: "#0a0908",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s ease",
    };

    const labelStyle = {
        display: "block",
        marginBottom: "6px",
        fontFamily: "Test Calibre",
        fontSize: "13px",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "#5e503f",
    };

    return (
        <Box>
            <Head>
                <title>{siteTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta name="og:title" content={siteTitle} />
                <meta name="og:description" content={metaDescription} />
                <meta property="og:type" content="website" />
                <meta name="twitter:site" content="@TheVioletVerse" />
                <meta name="twitter:title" content={siteTitle} />
                <meta name="twitter:description" content={metaDescription} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <Box
                sx={{
                    backgroundColor: "#49111c",
                    px: sectionPx,
                    py: { xs: 10, sm: 12, md: 16 },
                    textAlign: "center",
                }}
            >
                <Grid container direction="column" alignItems="center" spacing={3}>
                    <Grid item>
                        <p
                            style={{
                                color: "#a9927d",
                                fontSize: "13px",
                                fontFamily: "Test Calibre",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                marginBottom: "12px",
                            }}
                        >
                            Violet Verse Travel
                        </p>
                        <h1
                            style={{
                                color: "#f2f4f3",
                                fontSize: "clamp(36px, 6vw, 72px)",
                                lineHeight: "1.1",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Travel with Violet Verse
                        </h1>
                    </Grid>
                    <Grid item sx={{ maxWidth: "640px" }}>
                        <p
                            style={{
                                color: "rgba(242,244,243,0.85)",
                                fontSize: "clamp(17px, 2vw, 22px)",
                                lineHeight: "145%",
                                fontFamily: "stratos-lights",
                                fontStyle: "italic",
                            }}
                        >
                            We&apos;ve been there. We&apos;ve written about it. Now let us book it for you.
                        </p>
                    </Grid>
                    <Grid item sx={{ maxWidth: "560px" }}>
                        <p
                            style={{
                                color: "rgba(242,244,243,0.7)",
                                fontSize: "17px",
                                lineHeight: "155%",
                                fontFamily: "stratos-lights",
                            }}
                        >
                            Curated travel experiences for culture, crypto, and creative communities —
                            from Art Basel Miami to dinners in Paris.
                        </p>
                    </Grid>
                    <Grid item mt={2}>
                        <a href="#plan">
                            <Button
                                variant="contained"
                                disableElevation
                                sx={{
                                    py: 1.75,
                                    px: 4,
                                    fontSize: "18px",
                                    fontWeight: "400",
                                }}
                            >
                                Plan Your Trip
                            </Button>
                        </a>
                    </Grid>
                </Grid>
            </Box>

            {/* ── SERVICES ─────────────────────────────────────────────── */}
            <Box sx={{ backgroundColor: "#f2f4f3", px: sectionPx, py: sectionPy }}>
                <Grid container direction="column" spacing={5}>
                    <Grid item>
                        <h2
                            style={{
                                color: "#0a0908",
                                fontSize: "clamp(28px, 3.5vw, 42px)",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            How We Travel Together
                        </h2>
                        <p
                            style={{
                                color: "#5e503f",
                                fontSize: "17px",
                                marginTop: "8px",
                                fontFamily: "stratos-lights",
                            }}
                        >
                            Choose the level of support that fits your adventure.
                        </p>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={3}>
                            {[
                                {
                                    tier: "01",
                                    name: "Guides",
                                    tag: "DIY",
                                    desc: "Our digital guides give you the insider playbook — neighborhoods, restaurants, events, and local contacts curated by Melissa and the VV network.",
                                    cta: "Browse Guides",
                                    href: "#plan",
                                },
                                {
                                    tier: "02",
                                    name: "Itineraries",
                                    tag: "Planned for You",
                                    desc: "Custom day-by-day plans built around your travel style, budget, and interests. We do the research; you show up.",
                                    cta: "Get an Itinerary",
                                    href: "#plan",
                                },
                                {
                                    tier: "03",
                                    name: "Concierge",
                                    tag: "Fully Booked",
                                    desc: "We handle everything — flights, hotels, reservations, tickets, and logistics. You land and it&apos;s already done.",
                                    cta: "Book Concierge",
                                    href: "#plan",
                                },
                                {
                                    tier: "04",
                                    name: "Experiences",
                                    tag: "Travel with Melissa",
                                    desc: "Curated group trips led by Melissa — immersive cultural journeys timed around fashion weeks, crypto events, and art fairs.",
                                    cta: "Join the List",
                                    href: "#plan",
                                },
                            ].map((service) => (
                                <Grid item xs={12} sm={6} lg={3} key={service.tier}>
                                    <Box
                                        sx={{
                                            border: "1px solid rgba(90,80,63,0.2)",
                                            borderRadius: "20px",
                                            p: { xs: 3, md: 4 },
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 2,
                                            backgroundColor: "#fff",
                                            transition: "box-shadow 0.2s ease, transform 0.2s ease",
                                            "&:hover": {
                                                boxShadow: "0 8px 24px rgba(73,17,28,0.1)",
                                                transform: "translateY(-3px)",
                                            },
                                        }}
                                    >
                                        <Box>
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    backgroundColor: "rgba(73,17,28,0.08)",
                                                    color: "#49111c",
                                                    fontFamily: "Test Calibre",
                                                    fontSize: "12px",
                                                    letterSpacing: "0.08em",
                                                    textTransform: "uppercase",
                                                    padding: "4px 10px",
                                                    borderRadius: "100px",
                                                    marginBottom: "12px",
                                                }}
                                            >
                                                {service.tag}
                                            </span>
                                            <h3
                                                style={{
                                                    color: "#0a0908",
                                                    fontSize: "22px",
                                                    marginBottom: "10px",
                                                }}
                                            >
                                                {service.name}
                                            </h3>
                                            <p
                                                style={{
                                                    color: "#5e503f",
                                                    fontSize: "15px",
                                                    lineHeight: "155%",
                                                    fontFamily: "stratos-lights",
                                                    margin: 0,
                                                }}
                                                dangerouslySetInnerHTML={{ __html: service.desc }}
                                            />
                                        </Box>
                                        <Box sx={{ mt: "auto" }}>
                                            <a href={service.href}>
                                                <Button
                                                    variant="outlined"
                                                    disableElevation
                                                    size="small"
                                                    sx={{
                                                        borderColor: "#49111c",
                                                        color: "#49111c",
                                                        fontSize: "14px",
                                                        py: 1,
                                                        px: 2.5,
                                                        "&:hover": {
                                                            backgroundColor: "#49111c",
                                                            color: "#f2f4f3",
                                                        },
                                                    }}
                                                >
                                                    {service.cta}
                                                </Button>
                                            </a>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            {/* ── DESTINATIONS ─────────────────────────────────────────── */}
            <Box
                sx={{
                    backgroundColor: "#0a0908",
                    px: sectionPx,
                    py: sectionPy,
                }}
            >
                <Grid container direction="column" spacing={4}>
                    <Grid item>
                        <h2
                            style={{
                                color: "#f2f4f3",
                                fontSize: "clamp(28px, 3.5vw, 42px)",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Where We Go
                        </h2>
                        <p
                            style={{
                                color: "#a9927d",
                                fontSize: "16px",
                                marginTop: "8px",
                                fontFamily: "stratos-lights",
                            }}
                        >
                            We&apos;ve covered these cities — now we&apos;ll take you there.
                        </p>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={2}>
                            {[
                                {
                                    city: "Miami",
                                    note: "Art Basel, Swim Week, crypto winter & summer",
                                },
                                {
                                    city: "Denver",
                                    note: "ETHDenver, mountain culture, underground dining",
                                },
                                {
                                    city: "Paris",
                                    note: "Fashion Week, galleries, late dinners",
                                },
                                {
                                    city: "Amsterdam",
                                    note: "Design, tech, canal dinners, web3 scenes",
                                },
                                {
                                    city: "Lisbon",
                                    note: "Creative communities, web3 culture, warm light",
                                },
                                {
                                    city: "New York",
                                    note: "Fashion Week, art fairs, the industry",
                                },
                            ].map((dest) => (
                                <Grid item xs={12} sm={6} md={4} key={dest.city}>
                                    <Box
                                        sx={{
                                            backgroundColor: "rgba(73,17,28,0.3)",
                                            border: "1px solid rgba(169,146,125,0.2)",
                                            borderRadius: "16px",
                                            p: 3,
                                            transition: "background-color 0.2s ease",
                                            "&:hover": {
                                                backgroundColor: "rgba(73,17,28,0.5)",
                                            },
                                        }}
                                    >
                                        <h3
                                            style={{
                                                color: "#f2f4f3",
                                                fontSize: "24px",
                                                marginBottom: "6px",
                                            }}
                                        >
                                            {dest.city}
                                        </h3>
                                        <p
                                            style={{
                                                color: "#a9927d",
                                                fontSize: "14px",
                                                fontFamily: "stratos-lights",
                                                margin: 0,
                                                fontStyle: "italic",
                                            }}
                                        >
                                            {dest.note}
                                        </p>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            {/* ── CONTACT FORM ─────────────────────────────────────────── */}
            <Box
                id="plan"
                sx={{
                    backgroundColor: "#f2f4f3",
                    px: sectionPx,
                    py: sectionPy,
                }}
            >
                <Grid container direction="column" spacing={4} sx={{ maxWidth: "720px", mx: "auto" }}>
                    <Grid item>
                        <h2
                            style={{
                                color: "#0a0908",
                                fontSize: "clamp(28px, 3.5vw, 42px)",
                                letterSpacing: "-0.02em",
                                marginBottom: "8px",
                            }}
                        >
                            Plan Your Trip
                        </h2>
                        <p
                            style={{
                                color: "#5e503f",
                                fontSize: "17px",
                                fontFamily: "stratos-lights",
                            }}
                        >
                            Tell us where you want to go. We&apos;ll handle the rest.
                        </p>
                    </Grid>
                    <Grid item>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <label htmlFor="name" style={labelStyle}>
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        style={inputStyle}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <label htmlFor="email" style={labelStyle}>
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        style={inputStyle}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <label htmlFor="destination" style={labelStyle}>
                                        Destination
                                    </label>
                                    <select
                                        id="destination"
                                        name="destination"
                                        value={formData.destination}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, appearance: "none" }}
                                    >
                                        <option value="">Select a destination</option>
                                        {[
                                            "Miami",
                                            "Denver",
                                            "Paris",
                                            "Amsterdam",
                                            "Lisbon",
                                            "New York",
                                            "Other",
                                        ].map((d) => (
                                            <option key={d} value={d}>
                                                {d}
                                            </option>
                                        ))}
                                    </select>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <label htmlFor="dates" style={labelStyle}>
                                        Travel Dates
                                    </label>
                                    <input
                                        id="dates"
                                        name="dates"
                                        type="text"
                                        placeholder="e.g. March 2026"
                                        value={formData.dates}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <label htmlFor="type" style={labelStyle}>
                                        Type of Experience
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, appearance: "none" }}
                                    >
                                        <option value="">Select a service</option>
                                        <option value="guides">Digital Guide (DIY)</option>
                                        <option value="itinerary">Custom Itinerary</option>
                                        <option value="concierge">Full Concierge</option>
                                        <option value="experiences">Group Experience with Melissa</option>
                                    </select>
                                </Grid>
                                <Grid item xs={12}>
                                    <label htmlFor="notes" style={labelStyle}>
                                        Notes
                                    </label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        placeholder="Tell us about your ideal trip — vibe, group size, budget range, any events you want to attend..."
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={5}
                                        style={{
                                            ...inputStyle,
                                            resize: "vertical",
                                            minHeight: "120px",
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disableElevation
                                        sx={{
                                            py: 1.75,
                                            px: 5,
                                            fontSize: "18px",
                                            fontWeight: "400",
                                        }}
                                    >
                                        Send My Request
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Travel;
