import { Box, Button, Grid } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Enterprise.module.css";

const CTAButton = () => (
    <a
        href="https://calendly.com/violetverse"
        target="_blank"
        rel="noopener noreferrer"
    >
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
            Book a Discovery Call
        </Button>
    </a>
);

const sectionPx = { xs: "5%", sm: "5%", md: "10%", lg: "10%", xl: "15%" };
const sectionPy = { xs: 8, sm: 10, md: 12 };

const Experts = () => {
    const siteTitle = "Violet Verse Experts | AI Data Consulting";
    const metaDescription =
        "A 6-week expert data pilot for applied AI teams who need signal, not noise.";

    return (
        <Box mb={-7} className="enterprise-test" style={{ backgroundColor: "#0a0908", overflowX: "hidden" }}>
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

            {/* ── 1. HERO ─────────────────────────────────────────────── */}
            <Box
                sx={{
                    backgroundColor: "#49111c",
                    px: sectionPx,
                    py: sectionPy,
                }}
            >
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    textAlign="center"
                    spacing={3}
                >
                    <Grid item>
                        <h1 className={styles.header} style={{ fontSize: "clamp(38px, 5vw, 64px)" }}>
                            Violet Verse Experts
                        </h1>
                    </Grid>
                    <Grid item sx={{ maxWidth: "700px" }}>
                        <p className="color" style={{ fontSize: "clamp(18px, 2vw, 24px)", fontWeight: "400", lineHeight: "140%" }}>
                            Validating human data &amp; RL strategies before you scale.
                        </p>
                    </Grid>
                    <Grid item sx={{ maxWidth: "580px" }}>
                        <p className="color" style={{ opacity: 0.85, lineHeight: "150%" }}>
                            A 6-week expert data pilot for applied AI teams who need signal, not noise.
                        </p>
                    </Grid>
                    <Grid item mt={2}>
                        <CTAButton />
                    </Grid>
                </Grid>
            </Box>

            {/* ── 2. PROBLEM ──────────────────────────────────────────── */}
            <Box
                sx={{
                    backgroundColor: "#0a0908",
                    px: sectionPx,
                    py: sectionPy,
                }}
            >
                <Grid container direction="column" spacing={4} sx={{ maxWidth: "860px", mx: "auto" }}>
                    <Grid item>
                        <h1 className={styles.header}>
                            Scaling models is expensive. Guessing is worse.
                        </h1>
                    </Grid>
                    <Grid item>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {[
                                "Adding more data without clear signal",
                                "Labels that are noisy, unexamined, and non-expert",
                                "RL environments with untested assumptions",
                                "Evaluation that doesn't match real user behavior",
                                "Data labelers who don't understand research product lifecycles",
                            ].map((item) => (
                                <li
                                    key={item}
                                    style={{
                                        color: "#f2f4f3",
                                        fontSize: "18px",
                                        lineHeight: "170%",
                                        paddingLeft: "1.5em",
                                        position: "relative",
                                        marginBottom: "8px",
                                        fontFamily: "stratos-lights",
                                    }}
                                >
                                    <span
                                        style={{
                                            position: "absolute",
                                            left: 0,
                                            color: "#a9927d",
                                        }}
                                    >
                                        →
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Grid>
                    <Grid item>
                        <p
                            style={{
                                color: "#a9927d",
                                fontStyle: "italic",
                                fontSize: "18px",
                                lineHeight: "150%",
                                fontFamily: "stratos-lights",
                                borderLeft: "3px solid #49111c",
                                paddingLeft: "16px",
                            }}
                        >
                            Our belief: You shouldn&apos;t scale until you know what actually works.
                        </p>
                    </Grid>
                </Grid>
            </Box>

            {/* ── 3. WHERE TEAMS GET STUCK ─────────────────────────────── */}
            <Box
                sx={{
                    backgroundColor: "#49111c",
                    px: sectionPx,
                    py: sectionPy,
                }}
            >
                <Grid container direction="column" spacing={4} sx={{ maxWidth: "860px", mx: "auto" }}>
                    <Grid item>
                        <h2 className={styles.header}>Where Teams Get Stuck</h2>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={3}>
                            {[
                                "Treating expert disagreement as error instead of signal",
                                "Measuring \"model quality\" without task-level eval clarity",
                                "Discovering reward hacking only after expensive runs",
                            ].map((item, i) => (
                                <Grid item xs={12} md={4} key={i}>
                                    <Box
                                        sx={{
                                            backgroundColor: "rgba(10,9,8,0.4)",
                                            border: "1px solid rgba(169,146,125,0.2)",
                                            borderRadius: "16px",
                                            p: 3,
                                            height: "100%",
                                        }}
                                    >
                                        <p
                                            style={{
                                                color: "#f2f4f3",
                                                fontSize: "16px",
                                                lineHeight: "160%",
                                                fontFamily: "stratos-lights",
                                                margin: 0,
                                            }}
                                        >
                                            {item}
                                        </p>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item>
                        <p
                            style={{
                                color: "#a9927d",
                                fontSize: "18px",
                                fontFamily: "stratos-lights",
                                fontStyle: "italic",
                            }}
                        >
                            This slows experimentation and increases burn.
                        </p>
                    </Grid>
                </Grid>
            </Box>

            {/* ── 4. OUR ROLE ──────────────────────────────────────────── */}
            <Box
                sx={{
                    backgroundColor: "#0a0908",
                    px: sectionPx,
                    py: sectionPy,
                }}
            >
                <Grid container direction="column" spacing={4} sx={{ maxWidth: "860px", mx: "auto" }}>
                    <Grid item>
                        <h2 className={styles.header}>
                            We sit between product, research, and data ops.
                        </h2>
                    </Grid>
                    <Grid item>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {[
                                "Translate user demand into evaluable tasks",
                                "Design expert-driven RL or BC environments",
                                "Work directly with researchers inside the data",
                                "Help teams make a confident scale / pivot / stop decision",
                            ].map((item) => (
                                <li
                                    key={item}
                                    style={{
                                        color: "#f2f4f3",
                                        fontSize: "18px",
                                        lineHeight: "170%",
                                        paddingLeft: "1.5em",
                                        position: "relative",
                                        marginBottom: "8px",
                                        fontFamily: "stratos-lights",
                                    }}
                                >
                                    <span style={{ position: "absolute", left: 0, color: "#a9927d" }}>
                                        ✓
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Grid>
                    <Grid item>
                        <p
                            style={{
                                color: "#a9927d",
                                fontStyle: "italic",
                                fontSize: "18px",
                                fontFamily: "stratos-lights",
                                borderLeft: "3px solid #49111c",
                                paddingLeft: "16px",
                            }}
                        >
                            We are not a vendor — we are a decision partner.
                        </p>
                    </Grid>
                </Grid>
            </Box>

            {/* ── 5. HOW IT WORKS ──────────────────────────────────────── */}
            <Box
                sx={{
                    backgroundColor: "#49111c",
                    px: sectionPx,
                    py: sectionPy,
                }}
            >
                <Grid container direction="column" spacing={4}>
                    <Grid item>
                        <h2 className={styles.header}>What a Pilot Looks Like</h2>
                        <p className="color" style={{ marginTop: "8px", opacity: 0.75, fontFamily: "stratos-lights" }}>
                            6 weeks. Clear deliverables. No commitment trap.
                        </p>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={3}>
                            {[
                                {
                                    week: "Week 1",
                                    title: "Problem Framing",
                                    desc: "Problem framing & evaluation design",
                                },
                                {
                                    week: "Weeks 2–3",
                                    title: "Environment Setup",
                                    desc: "Task & environment definition. Expert cohort selection.",
                                },
                                {
                                    week: "Weeks 3–5",
                                    title: "Expert Work",
                                    desc: "Expert annotation & interaction. Researcher gut-checks & iteration.",
                                },
                                {
                                    week: "Week 6",
                                    title: "Findings",
                                    desc: "Analysis, findings, and recommendations",
                                },
                            ].map((phase, i) => (
                                <Grid item xs={12} sm={6} md={3} key={i}>
                                    <Box
                                        sx={{
                                            backgroundColor: "rgba(10,9,8,0.45)",
                                            border: "1px solid rgba(169,146,125,0.25)",
                                            borderRadius: "16px",
                                            p: 3,
                                            height: "100%",
                                        }}
                                    >
                                        <p
                                            style={{
                                                color: "#a9927d",
                                                fontSize: "13px",
                                                letterSpacing: "0.08em",
                                                textTransform: "uppercase",
                                                fontFamily: "Test Calibre",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            {phase.week}
                                        </p>
                                        <h3 style={{ color: "#f2f4f3", marginBottom: "10px", fontSize: "18px" }}>
                                            {phase.title}
                                        </h3>
                                        <p
                                            style={{
                                                color: "rgba(242,244,243,0.75)",
                                                fontSize: "15px",
                                                lineHeight: "155%",
                                                fontFamily: "stratos-lights",
                                                margin: 0,
                                            }}
                                        >
                                            {phase.desc}
                                        </p>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            {/* ── 6. METHODOLOGY ───────────────────────────────────────── */}
            <Box
                sx={{
                    backgroundColor: "#0a0908",
                    px: sectionPx,
                    py: sectionPy,
                }}
            >
                <Grid container direction="column" spacing={4}>
                    <Grid item>
                        <h2 className={styles.header}>Expert-Guided Behavioral Evaluation</h2>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={3}>
                            {[
                                {
                                    num: "01",
                                    title: "Task & Eval",
                                    desc: "Identify the real user task. Define success criteria before touching data.",
                                },
                                {
                                    num: "02",
                                    title: "Expert Demos",
                                    desc: "Domain experts respond to natural language prompts. Capture diversity and disagreement intentionally.",
                                },
                                {
                                    num: "03",
                                    title: "Paired Judgments",
                                    desc: "Compare baseline vs updated model outputs. Measure win-rate, agreement, and regressions.",
                                },
                                {
                                    num: "04",
                                    title: "Failure Analysis",
                                    desc: "Experts explain decisions. Identify ambiguity, reward misalignment, or overfitting.",
                                },
                                {
                                    num: "05",
                                    title: "Decision",
                                    desc: "Estimate minimum data needed to scale. Recommend next investment—or stopping entirely.",
                                },
                            ].map((step) => (
                                <Grid item xs={12} sm={6} md={4} key={step.num}>
                                    <Box
                                        sx={{
                                            backgroundColor: "#0a0908",
                                            border: "1px solid rgba(169,146,125,0.2)",
                                            borderRadius: "16px",
                                            p: 3,
                                            height: "100%",
                                            transition: "border-color 0.2s ease",
                                            "&:hover": {
                                                borderColor: "rgba(169,146,125,0.5)",
                                            },
                                        }}
                                    >
                                        <p
                                            style={{
                                                color: "#49111c",
                                                fontSize: "32px",
                                                fontFamily: "Ogg",
                                                fontWeight: "500",
                                                marginBottom: "8px",
                                                lineHeight: "1",
                                            }}
                                        >
                                            {step.num}
                                        </p>
                                        <h3
                                            style={{
                                                color: "#a9927d",
                                                fontSize: "18px",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            {step.title}
                                        </h3>
                                        <p
                                            style={{
                                                color: "rgba(242,244,243,0.8)",
                                                fontSize: "15px",
                                                lineHeight: "155%",
                                                fontFamily: "stratos-lights",
                                                margin: 0,
                                            }}
                                        >
                                            {step.desc}
                                        </p>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            {/* ── 7. WHY EXPERTS MATTER ─────────────────────────────────── */}
            <Box
                sx={{
                    backgroundColor: "#49111c",
                    px: sectionPx,
                    py: sectionPy,
                }}
            >
                <Grid container direction="column" spacing={4} sx={{ maxWidth: "860px", mx: "auto" }}>
                    <Grid item>
                        <h2 className={styles.header}>Why Experts Matter</h2>
                    </Grid>
                    <Grid item>
                        <p className="color" style={{ fontSize: "18px", lineHeight: "155%", fontFamily: "stratos-lights" }}>
                            Violet Verse has nurtured a global community of media, marketing, and crypto
                            tastemakers for over a decade.
                        </p>
                    </Grid>
                    <Grid item>
                        <p
                            style={{
                                color: "#f2f4f3",
                                fontSize: "clamp(20px, 2.5vw, 28px)",
                                fontFamily: "Ogg",
                                fontWeight: "500",
                                lineHeight: "135%",
                                borderLeft: "4px solid #a9927d",
                                paddingLeft: "20px",
                            }}
                        >
                            Human intelligence is the biggest lever to differentiating AI slop.
                        </p>
                    </Grid>
                    <Grid item>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {[
                                "Domain experts surface edge cases models miss",
                                "Disagreement reveals ambiguity in task design",
                                "QC is about reasoning, not just correctness",
                            ].map((item) => (
                                <li
                                    key={item}
                                    style={{
                                        color: "#f2f4f3",
                                        fontSize: "18px",
                                        lineHeight: "170%",
                                        paddingLeft: "1.5em",
                                        position: "relative",
                                        marginBottom: "8px",
                                        fontFamily: "stratos-lights",
                                    }}
                                >
                                    <span style={{ position: "absolute", left: 0, color: "#a9927d" }}>→</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Grid>
                    <Grid item>
                        <p
                            style={{
                                color: "#a9927d",
                                fontStyle: "italic",
                                fontSize: "18px",
                                fontFamily: "stratos-lights",
                            }}
                        >
                            Cheap data is abundant. Good data is not.
                        </p>
                    </Grid>
                </Grid>
            </Box>

            {/* ── 8. WHO WE ARE ────────────────────────────────────────── */}
            <Box
                sx={{
                    backgroundColor: "#0a0908",
                    px: sectionPx,
                    py: sectionPy,
                }}
            >
                <Grid container direction="column" spacing={4}>
                    <Grid item>
                        <h2 className={styles.header}>Who We Are</h2>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={4} alignItems="flex-start">
                            <Grid item xs={12} md={7}>
                                <Box
                                    sx={{
                                        border: "1px solid rgba(169,146,125,0.2)",
                                        borderRadius: "20px",
                                        p: { xs: 3, md: 4 },
                                    }}
                                >
                                    <h3 style={{ color: "#f2f4f3", marginBottom: "4px" }}>
                                        Melissa Henderson
                                    </h3>
                                    <p
                                        style={{
                                            color: "#a9927d",
                                            fontSize: "15px",
                                            fontFamily: "Test Calibre",
                                            marginBottom: "20px",
                                            letterSpacing: "0.04em",
                                        }}
                                    >
                                        Founder, Violet Verse
                                    </p>
                                    <p
                                        style={{
                                            color: "rgba(242,244,243,0.85)",
                                            fontSize: "17px",
                                            lineHeight: "160%",
                                            fontFamily: "stratos-lights",
                                            marginBottom: "24px",
                                        }}
                                    >
                                        14 years building at the intersection of media, marketing, and emerging technology.
                                    </p>
                                    {[
                                        {
                                            label: "Published",
                                            value: "Elle, Essence, HuffPost, Women in Clothes (Penguin)",
                                        },
                                        {
                                            label: "Spoke At",
                                            value: "ETHDenver '22 '23 '24, ISSUU Creator Summit",
                                        },
                                        {
                                            label: "Worked With",
                                            value: "Nike, Netflix, Samsung, Cash App, Block, Scale AI, La Prairie, Delta",
                                        },
                                        {
                                            label: "Recognized",
                                            value: "Fashion Group International Award, Miami Tourism Board Award",
                                        },
                                    ].map((item) => (
                                        <Box key={item.label} sx={{ mb: 1.5 }}>
                                            <span
                                                style={{
                                                    color: "#a9927d",
                                                    fontSize: "13px",
                                                    fontFamily: "Test Calibre",
                                                    letterSpacing: "0.06em",
                                                    textTransform: "uppercase",
                                                    display: "block",
                                                    marginBottom: "2px",
                                                }}
                                            >
                                                {item.label}
                                            </span>
                                            <span
                                                style={{
                                                    color: "rgba(242,244,243,0.8)",
                                                    fontSize: "15px",
                                                    fontFamily: "stratos-lights",
                                                    lineHeight: "150%",
                                                }}
                                            >
                                                {item.value}
                                            </span>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <Box
                                    sx={{
                                        backgroundColor: "#49111c",
                                        borderRadius: "20px",
                                        p: { xs: 3, md: 4 },
                                    }}
                                >
                                    <p
                                        style={{
                                            color: "#a9927d",
                                            fontSize: "13px",
                                            fontFamily: "Test Calibre",
                                            letterSpacing: "0.06em",
                                            textTransform: "uppercase",
                                            marginBottom: "12px",
                                        }}
                                    >
                                        The Network
                                    </p>
                                    <p
                                        style={{
                                            color: "#f2f4f3",
                                            fontSize: "clamp(36px, 5vw, 56px)",
                                            fontFamily: "Ogg",
                                            fontWeight: "500",
                                            lineHeight: "1.1",
                                            marginBottom: "12px",
                                        }}
                                    >
                                        300+
                                    </p>
                                    <p
                                        style={{
                                            color: "rgba(242,244,243,0.8)",
                                            fontSize: "16px",
                                            lineHeight: "155%",
                                            fontFamily: "stratos-lights",
                                            margin: 0,
                                        }}
                                    >
                                        Writers worldwide — media, marketing, and crypto experts built
                                        over a decade of editorial and brand partnerships.
                                    </p>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            {/* ── 9. COMPARISON TABLE ──────────────────────────────────── */}
            <Box
                sx={{
                    backgroundColor: "#49111c",
                    px: sectionPx,
                    py: sectionPy,
                }}
            >
                <Grid container direction="column" spacing={4}>
                    <Grid item>
                        <h2 className={styles.header}>Two Ways to Run AI Experiments</h2>
                    </Grid>
                    <Grid item sx={{ overflowX: "auto" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                color: "#f2f4f3",
                                fontFamily: "stratos-lights",
                                fontSize: "16px",
                                minWidth: "560px",
                            }}
                        >
                            <thead>
                                <tr>
                                    {["", "Black Box Orchestration", "Violet Verse Experts"].map(
                                        (col, i) => (
                                            <th
                                                key={i}
                                                style={{
                                                    padding: "14px 20px",
                                                    textAlign: i === 0 ? "left" : "center",
                                                    backgroundColor:
                                                        i === 2
                                                            ? "rgba(169,146,125,0.15)"
                                                            : "rgba(10,9,8,0.5)",
                                                    borderBottom: "2px solid rgba(169,146,125,0.3)",
                                                    fontFamily: "Test Calibre",
                                                    fontWeight: "600",
                                                    fontSize: "15px",
                                                    letterSpacing: "0.02em",
                                                    color: i === 2 ? "#a9927d" : "rgba(242,244,243,0.6)",
                                                    borderRadius:
                                                        i === 0
                                                            ? "12px 0 0 0"
                                                            : i === 2
                                                            ? "0 12px 0 0"
                                                            : undefined,
                                                }}
                                            >
                                                {col}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    {
                                        dim: "Speed",
                                        black: "Fast setup, slow iteration",
                                        vv: "Deliberate pace, faster learning",
                                    },
                                    {
                                        dim: "Data Security",
                                        black: "Data leaves your org",
                                        vv: "Controlled, scoped access",
                                    },
                                    {
                                        dim: "Cost",
                                        black: "Low per-label, high total waste",
                                        vv: "Higher per-task, lower total spend",
                                    },
                                    {
                                        dim: "Management",
                                        black: "You manage QC and pipeline",
                                        vv: "We own the process end-to-end",
                                    },
                                    {
                                        dim: "Quality",
                                        black: "Volume-optimized, signal-poor",
                                        vv: "Expert-grounded, decision-ready",
                                    },
                                ].map((row, i) => (
                                    <tr key={row.dim}>
                                        <td
                                            style={{
                                                padding: "14px 20px",
                                                borderBottom: "1px solid rgba(169,146,125,0.15)",
                                                backgroundColor:
                                                    i % 2 === 0
                                                        ? "rgba(10,9,8,0.3)"
                                                        : "transparent",
                                                fontFamily: "Test Calibre",
                                                fontWeight: "600",
                                                color: "#a9927d",
                                                fontSize: "15px",
                                            }}
                                        >
                                            {row.dim}
                                        </td>
                                        <td
                                            style={{
                                                padding: "14px 20px",
                                                borderBottom: "1px solid rgba(169,146,125,0.15)",
                                                backgroundColor:
                                                    i % 2 === 0
                                                        ? "rgba(10,9,8,0.3)"
                                                        : "transparent",
                                                textAlign: "center",
                                                color: "rgba(242,244,243,0.6)",
                                            }}
                                        >
                                            {row.black}
                                        </td>
                                        <td
                                            style={{
                                                padding: "14px 20px",
                                                borderBottom: "1px solid rgba(169,146,125,0.15)",
                                                backgroundColor:
                                                    i % 2 === 0
                                                        ? "rgba(169,146,125,0.08)"
                                                        : "rgba(169,146,125,0.04)",
                                                textAlign: "center",
                                                color: "#f2f4f3",
                                            }}
                                        >
                                            {row.vv}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Grid>
                </Grid>
            </Box>

            {/* ── 10. WHAT YOU GET ─────────────────────────────────────── */}
            <Box
                sx={{
                    backgroundColor: "#0a0908",
                    px: sectionPx,
                    py: sectionPy,
                }}
            >
                <Grid container direction="column" spacing={4} sx={{ maxWidth: "860px", mx: "auto" }}>
                    <Grid item>
                        <h2 className={styles.header}>What You Get at the End</h2>
                    </Grid>
                    <Grid item>
                        <p
                            style={{
                                color: "#a9927d",
                                fontSize: "15px",
                                fontFamily: "Test Calibre",
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                marginBottom: "16px",
                            }}
                        >
                            A clear answer to:
                        </p>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {[
                                "Should we scale this approach?",
                                "What data actually moved the model?",
                                "How much data is enough?",
                                "What should we not invest in next?",
                            ].map((q) => (
                                <li
                                    key={q}
                                    style={{
                                        color: "#f2f4f3",
                                        fontSize: "18px",
                                        lineHeight: "170%",
                                        paddingLeft: "1.5em",
                                        position: "relative",
                                        marginBottom: "8px",
                                        fontFamily: "stratos-lights",
                                    }}
                                >
                                    <span style={{ position: "absolute", left: 0, color: "#a9927d" }}>→</span>
                                    {q}
                                </li>
                            ))}
                        </ul>
                    </Grid>
                    <Grid item>
                        <Box
                            sx={{
                                border: "1px solid rgba(169,146,125,0.3)",
                                borderRadius: "12px",
                                p: 3,
                                backgroundColor: "rgba(73,17,28,0.15)",
                            }}
                        >
                            <p
                                style={{
                                    color: "rgba(242,244,243,0.85)",
                                    fontSize: "17px",
                                    fontFamily: "stratos-lights",
                                    fontStyle: "italic",
                                    margin: 0,
                                    lineHeight: "150%",
                                }}
                            >
                                Plus a written memo you can share internally.
                            </p>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* ── 11. WHO THIS IS FOR ──────────────────────────────────── */}
            <Box
                sx={{
                    backgroundColor: "#49111c",
                    px: sectionPx,
                    py: sectionPy,
                }}
            >
                <Grid container direction="column" spacing={4}>
                    <Grid item>
                        <h2 className={styles.header}>Who This Is For</h2>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        backgroundColor: "rgba(10,9,8,0.4)",
                                        border: "1px solid rgba(169,146,125,0.25)",
                                        borderRadius: "16px",
                                        p: 3,
                                        height: "100%",
                                    }}
                                >
                                    <p
                                        style={{
                                            color: "#a9927d",
                                            fontSize: "13px",
                                            fontFamily: "Test Calibre",
                                            letterSpacing: "0.06em",
                                            textTransform: "uppercase",
                                            marginBottom: "16px",
                                        }}
                                    >
                                        Good Fit
                                    </p>
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                        {[
                                            "Applied AI teams already training or fine-tuning models",
                                            "Teams experimenting with agents or tool-use",
                                            "Teams feeling data uncertainty, not model uncertainty",
                                        ].map((item) => (
                                            <li
                                                key={item}
                                                style={{
                                                    color: "#f2f4f3",
                                                    fontSize: "16px",
                                                    lineHeight: "160%",
                                                    paddingLeft: "1.4em",
                                                    position: "relative",
                                                    marginBottom: "10px",
                                                    fontFamily: "stratos-lights",
                                                }}
                                            >
                                                <span style={{ position: "absolute", left: 0, color: "#a9927d" }}>
                                                    ✓
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        backgroundColor: "rgba(10,9,8,0.4)",
                                        border: "1px solid rgba(169,146,125,0.15)",
                                        borderRadius: "16px",
                                        p: 3,
                                        height: "100%",
                                    }}
                                >
                                    <p
                                        style={{
                                            color: "rgba(169,146,125,0.6)",
                                            fontSize: "13px",
                                            fontFamily: "Test Calibre",
                                            letterSpacing: "0.06em",
                                            textTransform: "uppercase",
                                            marginBottom: "16px",
                                        }}
                                    >
                                        Not a Fit
                                    </p>
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                        {[
                                            "This is not a labeling contract",
                                            "This is not a model benchmarking service",
                                            "This is not long-term outsourcing",
                                        ].map((item) => (
                                            <li
                                                key={item}
                                                style={{
                                                    color: "rgba(242,244,243,0.55)",
                                                    fontSize: "16px",
                                                    lineHeight: "160%",
                                                    paddingLeft: "1.4em",
                                                    position: "relative",
                                                    marginBottom: "10px",
                                                    fontFamily: "stratos-lights",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        position: "absolute",
                                                        left: 0,
                                                        color: "rgba(169,146,125,0.5)",
                                                    }}
                                                >
                                                    ✕
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <p
                            style={{
                                color: "#a9927d",
                                fontStyle: "italic",
                                fontSize: "18px",
                                fontFamily: "stratos-lights",
                            }}
                        >
                            This is a high-signal pilot, not a commitment trap.
                        </p>
                    </Grid>
                </Grid>
            </Box>

            {/* ── 12. FINAL CTA ─────────────────────────────────────────── */}
            <Box
                sx={{
                    backgroundColor: "#0a0908",
                    px: sectionPx,
                    py: sectionPy,
                    textAlign: "center",
                }}
            >
                <Grid container direction="column" alignItems="center" spacing={3}>
                    <Grid item>
                        <h1 className={styles.header} style={{ textAlign: "center" }}>
                            Ready to Get Signal?
                        </h1>
                    </Grid>
                    <Grid item sx={{ maxWidth: "560px" }}>
                        <p
                            className="color"
                            style={{
                                opacity: 0.8,
                                fontSize: "17px",
                                lineHeight: "155%",
                                fontFamily: "stratos-lights",
                            }}
                        >
                            Short application &amp; diagnostic call{" "}
                            <span style={{ color: "#a9927d", margin: "0 8px" }}>→</span>
                            Confirm scope and fit{" "}
                            <span style={{ color: "#a9927d", margin: "0 8px" }}>→</span>
                            Kick off pilot
                        </p>
                    </Grid>
                    <Grid item mt={2}>
                        <CTAButton />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Experts;
