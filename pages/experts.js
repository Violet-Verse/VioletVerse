import { Box, Button, Grid } from "@mui/material";
import Head from "next/head";

const bg = "#0a0908";
const wine = "#49111c";
const cream = "#f2f4f3";
const gold = "#a9927d";
const sectionPx = { xs: "6%", sm: "8%", md: "12%", lg: "16%" };

const ArrowItem = ({ children }) => (
    <li
        style={{
            color: cream,
            fontSize: "18px",
            lineHeight: "170%",
            paddingLeft: "1.6em",
            position: "relative",
            marginBottom: "10px",
            fontFamily: "stratos-lights",
        }}
    >
        <span style={{ position: "absolute", left: 0, color: gold }}>→</span>
        {children}
    </li>
);

export default function Experts() {
    return (
        <Box sx={{ backgroundColor: bg, mb: -7, overflowX: "hidden" }}>
            <Head>
                <title>Verso Network | Ethical AI Data & Expert Matching</title>
                <meta
                    name="description"
                    content="A matchmaking service for AI trainers and project leads. Ethical data that treats humans with kindness."
                />
            </Head>

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <Box sx={{ backgroundColor: wine, px: sectionPx, py: { xs: 10, md: 16 }, textAlign: "center" }}>
                <p
                    style={{
                        color: gold,
                        fontSize: "12px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        fontFamily: "Test Calibre",
                        marginBottom: "20px",
                    }}
                >
                    A Violet Verse Initiative
                </p>
                <h1
                    style={{
                        color: cream,
                        fontFamily: "Ogg",
                        fontSize: "clamp(44px, 7vw, 88px)",
                        fontWeight: 400,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.05,
                        marginBottom: "24px",
                    }}
                >
                    Verso Network
                </h1>
                <p
                    style={{
                        color: "rgba(242,244,243,0.8)",
                        fontFamily: "stratos-lights",
                        fontSize: "clamp(17px, 2vw, 22px)",
                        lineHeight: 1.6,
                        maxWidth: "580px",
                        margin: "0 auto 40px",
                    }}
                >
                    A matchmaking service for AI trainers and project leads — connecting researchers with the right experts to build better data.
                </p>
                <a
                    href="https://experts-network.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button
                        disableElevation
                        sx={{
                            backgroundColor: cream,
                            color: bg,
                            fontFamily: "stratos-lights",
                            fontSize: "16px",
                            fontWeight: 400,
                            py: 1.75,
                            px: 4.5,
                            borderRadius: 100,
                            textTransform: "none",
                            "&:hover": { backgroundColor: "rgba(242,244,243,0.88)" },
                        }}
                    >
                        Join the Network
                    </Button>
                </a>
            </Box>

            {/* ── What We Are ──────────────────────────────────────────── */}
            <Box sx={{ px: sectionPx, py: { xs: 8, md: 12 } }}>
                <Grid container spacing={{ xs: 6, md: 10 }} alignItems="flex-start">
                    <Grid item xs={12} md={6}>
                        <p
                            style={{
                                color: gold,
                                fontSize: "12px",
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                fontFamily: "Test Calibre",
                                marginBottom: "16px",
                            }}
                        >
                            What is Verso?
                        </p>
                        <h2
                            style={{
                                color: cream,
                                fontFamily: "Ogg",
                                fontSize: "clamp(28px, 3.5vw, 42px)",
                                fontWeight: 400,
                                lineHeight: 1.2,
                                marginBottom: "20px",
                            }}
                        >
                            A place where ethical data can thrive.
                        </h2>
                        <p
                            style={{
                                color: "rgba(242,244,243,0.75)",
                                fontFamily: "stratos-lights",
                                fontSize: "17px",
                                lineHeight: 1.75,
                                marginBottom: "16px",
                            }}
                        >
                            We are not a factory of human data. We have rules, job practices, and hours of operation — because the people doing this work deserve to be treated like people.
                        </p>
                        <p
                            style={{
                                color: "rgba(242,244,243,0.75)",
                                fontFamily: "stratos-lights",
                                fontSize: "17px",
                                lineHeight: 1.75,
                            }}
                        >
                            Intellectual capital is more important than ever when it comes to AI. Verso exists to protect and leverage it properly.
                        </p>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                backgroundColor: wine,
                                borderRadius: "20px",
                                p: { xs: 3, md: 4 },
                            }}
                        >
                            <p
                                style={{
                                    color: gold,
                                    fontSize: "12px",
                                    letterSpacing: "0.18em",
                                    textTransform: "uppercase",
                                    fontFamily: "Test Calibre",
                                    marginBottom: "20px",
                                }}
                            >
                                Our Mission
                            </p>
                            <p
                                style={{
                                    color: cream,
                                    fontFamily: "stratos-lights",
                                    fontSize: "17px",
                                    lineHeight: 1.75,
                                    marginBottom: "16px",
                                }}
                            >
                                To empower researchers and frontier labs by treating humans with kindness — paying them on time and handsomely.
                            </p>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {[
                                    "No overworking people who are building better AI",
                                    "Diverse and carefully selected trainer sets",
                                    "Hand-picked, high-caliber expert groups",
                                    "Specialized in targeted batches",
                                ].map((item) => (
                                    <ArrowItem key={item}>{item}</ArrowItem>
                                ))}
                            </ul>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* ── How We Work ──────────────────────────────────────────── */}
            <Box sx={{ backgroundColor: wine, px: sectionPx, py: { xs: 8, md: 12 } }}>
                <p
                    style={{
                        color: gold,
                        fontSize: "12px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        fontFamily: "Test Calibre",
                        marginBottom: "16px",
                    }}
                >
                    How We Work
                </p>
                <h2
                    style={{
                        color: cream,
                        fontFamily: "Ogg",
                        fontSize: "clamp(28px, 3.5vw, 42px)",
                        fontWeight: 400,
                        lineHeight: 1.2,
                        marginBottom: "40px",
                        maxWidth: "600px",
                    }}
                >
                    Thought partners, not task runners.
                </h2>
                <Grid container spacing={3}>
                    {[
                        {
                            title: "Scorecards",
                            desc: "Proprietary evaluation frameworks tailored to your task — not generic rubrics borrowed from another use case.",
                        },
                        {
                            title: "Rubrics & Scenarios",
                            desc: "We design the scenarios that stress-test your model's real failure modes, not the obvious ones.",
                        },
                        {
                            title: "Feedback Loops",
                            desc: "Experts don't just label — they explain. That reasoning is the data that actually moves your model.",
                        },
                        {
                            title: "Targeted Batches",
                            desc: "Smaller, focused cohorts matched to your domain. No generic crowds, no noisy signal.",
                        },
                    ].map((item) => (
                        <Grid item xs={12} sm={6} key={item.title}>
                            <Box
                                sx={{
                                    border: "1px solid rgba(169,146,125,0.25)",
                                    borderRadius: "16px",
                                    p: 3,
                                    height: "100%",
                                    backgroundColor: "rgba(10,9,8,0.35)",
                                }}
                            >
                                <h3
                                    style={{
                                        color: gold,
                                        fontFamily: "Test Calibre",
                                        fontSize: "16px",
                                        letterSpacing: "0.04em",
                                        marginBottom: "10px",
                                    }}
                                >
                                    {item.title}
                                </h3>
                                <p
                                    style={{
                                        color: "rgba(242,244,243,0.75)",
                                        fontFamily: "stratos-lights",
                                        fontSize: "16px",
                                        lineHeight: 1.65,
                                        margin: 0,
                                    }}
                                >
                                    {item.desc}
                                </p>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* ── Why It Matters ───────────────────────────────────────── */}
            <Box sx={{ px: sectionPx, py: { xs: 8, md: 12 }, maxWidth: "760px", mx: "auto" }}>
                <p
                    style={{
                        color: gold,
                        fontSize: "12px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        fontFamily: "Test Calibre",
                        marginBottom: "16px",
                    }}
                >
                    Why It Matters
                </p>
                <h2
                    style={{
                        color: cream,
                        fontFamily: "Ogg",
                        fontSize: "clamp(28px, 3.5vw, 42px)",
                        fontWeight: 400,
                        lineHeight: 1.2,
                        marginBottom: "32px",
                    }}
                >
                    Good data requires good judgment.
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px" }}>
                    <ArrowItem>Domain experts surface edge cases models miss</ArrowItem>
                    <ArrowItem>Disagreement reveals ambiguity in task design</ArrowItem>
                    <ArrowItem>QC is about reasoning, not just correctness</ArrowItem>
                </ul>
                <p
                    style={{
                        color: gold,
                        fontFamily: "Ogg",
                        fontSize: "clamp(22px, 2.8vw, 32px)",
                        fontWeight: 400,
                        fontStyle: "italic",
                        lineHeight: 1.4,
                        borderLeft: `3px solid ${wine}`,
                        paddingLeft: "20px",
                    }}
                >
                    Cheap data is abundant. Good data is not.
                </p>
            </Box>

            {/* ── CTA ──────────────────────────────────────────────────── */}
            <Box
                sx={{
                    backgroundColor: wine,
                    px: sectionPx,
                    py: { xs: 10, md: 14 },
                    textAlign: "center",
                }}
            >
                <h2
                    style={{
                        color: cream,
                        fontFamily: "Ogg",
                        fontSize: "clamp(32px, 4vw, 52px)",
                        fontWeight: 400,
                        lineHeight: 1.15,
                        marginBottom: "20px",
                    }}
                >
                    Ready to join the network?
                </h2>
                <p
                    style={{
                        color: "rgba(242,244,243,0.7)",
                        fontFamily: "stratos-lights",
                        fontSize: "17px",
                        lineHeight: 1.6,
                        maxWidth: "480px",
                        margin: "0 auto 36px",
                    }}
                >
                    Whether you&apos;re a researcher looking for expert talent or an expert ready to do meaningful work — this is your place.
                </p>
                <a
                    href="https://experts-network.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button
                        disableElevation
                        sx={{
                            backgroundColor: cream,
                            color: bg,
                            fontFamily: "stratos-lights",
                            fontSize: "16px",
                            fontWeight: 400,
                            py: 1.75,
                            px: 4.5,
                            borderRadius: 100,
                            textTransform: "none",
                            "&:hover": { backgroundColor: "rgba(242,244,243,0.88)" },
                        }}
                    >
                        Sign Up for Verso Network
                    </Button>
                </a>
            </Box>
        </Box>
    );
}

export async function getStaticProps() {
    return { props: {} };
}
