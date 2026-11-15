import FacebookIcon from "@mui/icons-material/Facebook";
import LanguageIcon from "@mui/icons-material/Language";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Box, Grid } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { members } from "../components/Placeholder/UserData";

const About = () => {
    const siteTitle = `About The Team | Violet Verse`;
    const metaTitle = `About The Team`;
    const siteDescription = `Learn more about the team building Violet Verse.`;
    const siteImage = "https://i.imgur.com/HOcgWqo.png";

    const team = members.filter((member) => member.teamType === "team");
    const contributor = members.filter(
        (member) => member.teamType === "contributor"
    );
    return (
        <>
            <Head>
                <title>{siteTitle}</title>
                <meta name="og:title" content={metaTitle} />
                <meta name="og:description" content={siteDescription} />
                <meta property="og:image" content={siteImage} />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="800" />
                <meta property="og:image:height" content="420" />
                <meta property="og:type" content="website" />
                <meta name="twitter:site" content="@TheVioletVerse" />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="twitter:description" content={siteDescription} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image:src" content={siteImage} />
            </Head>

            {/* First section — About + Photo */}
            <Box
                sx={{
                    px: {
                        xs: "5%",
                        sm: "5%",
                        md: "10%",
                        lg: "15%",
                        xl: "20%",
                    },
                    py: { xs: 4, sm: 6, md: 8 },
                }}
            >
                <Grid
                    container
                    direction="row"
                    spacing={8}
                    justifyContent="space-around"
                    alignItems="center"
                >
                <Grid
                    item
                    md={12}
                    lg={4}
                    sx={{
                        textAlign: { xs: "center", md: "center", lg: "left" },
                    }}
                >
                    <h1 style={{ whiteSpace: "pre-wrap" }}>
                        {"About\nViolet Verse"}
                    </h1>
                    <Box sx={{ padding: { xs: "0px 5%", md: "0px" }, mt: 2 }}>
                        <p className="secondary">
                            Violet Verse is a creative studio at the intersection
                            of content, AI, and global experiences. We publish,
                            we build, and we take you places — rooted in over a
                            decade of editorial and brand work across media,
                            technology, and culture.
                        </p>
                    </Box>
                </Grid>
                <Grid item md={12} lg={8} align="center">
                    <Image
                        width={1920}
                        height={1080}
                        src="/banners/Photography_2.png"
                        alt="Default Image"
                        className="image"
                        placeholder="blur"
                        blurDataURL="/banners/Photography_2.png"
                    />
                </Grid>
            </Grid>
            </Box>

            {/* Three Ways We Work */}
            <Box
                sx={{
                    backgroundColor: "#0a0908",
                    px: {
                        xs: "5%",
                        sm: "5%",
                        md: "10%",
                        lg: "15%",
                        xl: "20%",
                    },
                    py: { xs: 6, sm: 8, md: 10 },
                }}
            >
                <Grid container direction="column" spacing={5}>
                    <Grid item>
                        <h2 style={{ color: "#f2f4f3", letterSpacing: "-0.02em" }}>
                            Three Ways We Work
                        </h2>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={3}>
                            {[
                                {
                                    label: "PUBLISH",
                                    name: "The Verse",
                                    desc: "Editorial coverage at the intersection of culture, technology, and lifestyle. Stories told by writers, creators, and tastemakers who live it.",
                                    href: "/posts",
                                    cta: "Read the Journal",
                                },
                                {
                                    label: "BUILD",
                                    name: "Violet Verse Experts",
                                    desc: "A 6-week expert data pilot for applied AI teams. We validate human data and RL strategies before you scale.",
                                    href: "/experts",
                                    cta: "Learn More",
                                },
                                {
                                    label: "EXPERIENCE",
                                    name: "Travel",
                                    desc: "Curated travel experiences for culture, crypto, and creative communities — guided by a decade of on-the-ground coverage.",
                                    href: "/travel",
                                    cta: "Plan Your Trip",
                                },
                            ].map((pillar) => (
                                <Grid item xs={12} md={4} key={pillar.label}>
                                    <Box
                                        sx={{
                                            border: "1px solid rgba(169,146,125,0.2)",
                                            borderRadius: "20px",
                                            p: 3,
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 2,
                                        }}
                                    >
                                        <Box>
                                            <p
                                                style={{
                                                    color: "#a9927d",
                                                    fontSize: "12px",
                                                    fontFamily: "Test Calibre",
                                                    letterSpacing: "0.1em",
                                                    textTransform: "uppercase",
                                                    marginBottom: "8px",
                                                }}
                                            >
                                                {pillar.label}
                                            </p>
                                            <h3
                                                style={{
                                                    color: "#f2f4f3",
                                                    fontSize: "20px",
                                                    marginBottom: "8px",
                                                }}
                                            >
                                                {pillar.name}
                                            </h3>
                                            <p
                                                style={{
                                                    color: "rgba(242,244,243,0.7)",
                                                    fontSize: "15px",
                                                    lineHeight: "155%",
                                                    fontFamily: "stratos-lights",
                                                    margin: 0,
                                                }}
                                            >
                                                {pillar.desc}
                                            </p>
                                        </Box>
                                        <Box sx={{ mt: "auto" }}>
                                            <Link
                                                href={pillar.href}
                                                legacyBehavior
                                            >
                                                <a
                                                    style={{
                                                        color: "#a9927d",
                                                        fontFamily: "stratos-lights",
                                                        fontSize: "15px",
                                                        textDecoration: "none",
                                                        borderBottom: "1px solid rgba(169,146,125,0.4)",
                                                        paddingBottom: "2px",
                                                    }}
                                                >
                                                    {pillar.cta} →
                                                </a>
                                            </Link>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            {/* Founder Bio */}
            <Box
                sx={{
                    px: {
                        xs: "5%",
                        sm: "5%",
                        md: "10%",
                        lg: "15%",
                        xl: "20%",
                    },
                    py: { xs: 6, sm: 8, md: 10 },
                }}
            >
                <Grid container spacing={6} alignItems="flex-start">
                    <Grid item xs={12} md={5}>
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
                            Founder
                        </p>
                        <h2 style={{ marginBottom: "6px" }}>Melissa Henderson</h2>
                        <p
                            style={{
                                color: "#5e503f",
                                fontFamily: "Test Calibre",
                                fontSize: "16px",
                                marginBottom: "20px",
                            }}
                        >
                            Founder &amp; CEO, Violet Verse
                        </p>
                        <p className="secondary">
                            14 years building at the intersection of media, marketing, and emerging
                            technology. Melissa has contributed to Elle, Essence, HuffPost, and
                            Women in Clothes (Penguin), spoken at ETHDenver &apos;22 &apos;23 &apos;24
                            and the ISSUU Creator Summit, and worked with Nike, Netflix, Samsung,
                            Cash App, Block, Scale AI, La Prairie, and Delta.
                        </p>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Grid container spacing={2}>
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
                                <Grid item xs={12} sm={6} key={item.label}>
                                    <Box
                                        sx={{
                                            borderLeft: "3px solid #a9927d",
                                            pl: 2,
                                            py: 0.5,
                                        }}
                                    >
                                        <p
                                            style={{
                                                color: "#a9927d",
                                                fontSize: "12px",
                                                fontFamily: "Test Calibre",
                                                letterSpacing: "0.06em",
                                                textTransform: "uppercase",
                                                marginBottom: "4px",
                                            }}
                                        >
                                            {item.label}
                                        </p>
                                        <p
                                            style={{
                                                color: "#0a0908",
                                                fontSize: "15px",
                                                fontFamily: "stratos-lights",
                                                lineHeight: "150%",
                                                margin: 0,
                                            }}
                                        >
                                            {item.value}
                                        </p>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            {/* 2nd Section */}
            {/* Our Team */}

            <Box
                sx={{
                    backgroundColor: "#f2f4f3",
                    py: { xs: 4, sm: 6, md: 8 },
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        px: {
                            xs: "5%",
                            sm: "5%",
                            md: "10%",
                            lg: "15%",
                            xl: "20%",
                        },
                    }}
                >
                    <Grid
                        container
                        spacing={2}
                        align="center"
                        justifyContent="center"
                    >
                <Grid
                    item
                    xs={12}
                    sx={{
                        textAlign: { xs: "center", md: "center", lg: "left" },
                        marginBottom: { xs: "30px", md: "30px", lg: "50px" },
                    }}
                >
                    <h1>Our Team</h1>
                </Grid>
                {team.map((member) => (
                    <Grid item xs={12} sm={6} lg={3} key={member.id}>
                        <Link
                            href={
                                "/team/" +
                                member.name.replace(/\s+/g, "-").toLowerCase()
                            }
                        >
                            <a>
                                <Image
                                    width={1000}
                                    height={1159}
                                    src={member.photo}
                                    alt="Default Image"
                                    className="image"
                                    objectFit={"cover"}
                                    placeholder="blur"
                                    blurDataURL={member.photo}
                                />
                            </a>
                        </Link>
                        <Box
                            sx={{
                                textAlign: {
                                    xs: "center",
                                    sm: "left",
                                    lg: "left",
                                },
                            }}
                        >
                            <Link
                                href={
                                    "/team/" +
                                    member.name
                                        .replace(/\s+/g, "-")
                                        .toLowerCase()
                                }
                            >
                                <a>
                                    <h4
                                        style={{
                                            marginTop: "15px",
                                        }}
                                    >
                                        {member.name}
                                    </h4>
                                </a>
                            </Link>
                            <h3
                                style={{
                                    fontFamily: "Test Calibre",
                                    fontWeight: "400",
                                    fontSize: "18px",
                                }}
                            >
                                {member.title}
                            </h3>
                            <Grid
                                container
                                direction="row"
                                spacing={1}
                                justifyContent={{ xs: "center", sm: "left" }}
                            >
                                {member?.website && (
                                    <Grid item>
                                        <a
                                            href={member.website}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <LanguageIcon
                                                sx={{
                                                    color: "#73839C",
                                                }}
                                            />
                                        </a>
                                    </Grid>
                                )}
                                {member?.twitter && (
                                    <Grid item>
                                        <a
                                            href={
                                                `https://www.twitter.com/` +
                                                member.twitter
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <TwitterIcon
                                                sx={{
                                                    color: "#73839C",
                                                }}
                                            />
                                        </a>
                                    </Grid>
                                )}
                                {member?.linkedIn && (
                                    <Grid item>
                                        <a
                                            href={
                                                `https://www.linkedin.com/in/` +
                                                member.linkedIn
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <LinkedInIcon
                                                sx={{
                                                    color: "#73839C",
                                                }}
                                            />
                                        </a>
                                    </Grid>
                                )}
                                {member?.facebook && (
                                    <Grid item>
                                        <a
                                            href={
                                                `https://www.facebook.com/` +
                                                member.facebook
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <FacebookIcon
                                                sx={{
                                                    color: "#73839C",
                                                }}
                                            />
                                        </a>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </Grid>
                ))}
                    </Grid>
                </Box>
            </Box>
            {/*Our Contributors section*/}

            {/*Spacing between previous containter 'Our Teams'*/}
            <Box
                sx={{
                    px: {
                        xs: "5%",
                        sm: "5%",
                        md: "10%",
                        lg: "15%",
                        xl: "20%",
                    },
                    py: { xs: 4, sm: 6, md: 8 },
                }}
            >
                <Grid
                    container
                    spacing={2}
                    align="center"
                    justifyContent="center"
                >
                <Grid
                    item
                    xs={12}
                    sx={{
                        textAlign: { xs: "center", md: "center", lg: "left" },
                        marginBottom: { xs: "30px", md: "30px", lg: "50px" },
                    }}
                >
                    <h1>Our Contributors</h1>
                </Grid>
                {contributor.map((member) => (
                    <Grid item xs={12} sm={6} lg={3} key={member.id}>
                        <Link
                            href={
                                "/team/" +
                                member.name.replace(/\s+/g, "-").toLowerCase()
                            }
                        >
                            <a>
                                <Image
                                    width={1000}
                                    height={1000}
                                    src={member.photo}
                                    alt="Default Image"
                                    className="image"
                                    objectFit={"cover"}
                                    placeholder="blur"
                                    blurDataURL={member.photo}
                                />
                            </a>
                        </Link>
                        <Box
                            sx={{
                                textAlign: {
                                    xs: "center",
                                    sm: "left",
                                    lg: "left",
                                },
                            }}
                        >
                            {" "}
                            <Link
                                href={
                                    "/team/" +
                                    member.name
                                        .replace(/\s+/g, "-")
                                        .toLowerCase()
                                }
                            >
                                <a>
                                    <h4
                                        style={{
                                            marginTop: "15px",
                                        }}
                                    >
                                        {member.name}
                                    </h4>
                                </a>
                            </Link>
                            <h3
                                style={{
                                    fontFamily: "Test Calibre",
                                    fontWeight: "400",
                                    fontSize: "18px",
                                }}
                            >
                                {member.title}
                            </h3>
                            <Grid
                                container
                                direction="row"
                                spacing={1}
                                justifyContent={{ xs: "center", sm: "left" }}
                            >
                                {member?.website && (
                                    <Grid item>
                                        <a
                                            href={member.website}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <LanguageIcon
                                                sx={{
                                                    color: "#73839C",
                                                }}
                                            />
                                        </a>
                                    </Grid>
                                )}
                                {member?.instagram && (
                                    <Grid item>
                                        <a
                                            href={
                                                `https://www.instagram.com/` +
                                                member.instagram
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <InstagramIcon
                                                sx={{
                                                    color: "#73839C",
                                                }}
                                            />
                                        </a>
                                    </Grid>
                                )}
                                {member?.twitter && (
                                    <Grid item>
                                        <a
                                            href={
                                                `https://www.twitter.com/` +
                                                member.twitter
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <TwitterIcon
                                                sx={{
                                                    color: "#73839C",
                                                }}
                                            />
                                        </a>
                                    </Grid>
                                )}
                                {member?.linkedIn && (
                                    <Grid item>
                                        <a
                                            href={
                                                `https://www.linkedin.com/in/` +
                                                member.linkedIn
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <LinkedInIcon
                                                sx={{
                                                    color: "#73839C",
                                                }}
                                            />
                                        </a>
                                    </Grid>
                                )}
                                {member?.facebook && (
                                    <Grid item>
                                        <a
                                            href={
                                                `https://www.facebook.com/` +
                                                member.facebook
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <FacebookIcon
                                                sx={{
                                                    color: "#73839C",
                                                }}
                                            />
                                        </a>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </Grid>
                ))}
                </Grid>
            </Box>
            {/* We've Worked With */}
            <Box
                sx={{
                    backgroundColor: "#0a0908",
                    px: {
                        xs: "5%",
                        sm: "5%",
                        md: "10%",
                        lg: "15%",
                        xl: "20%",
                    },
                    py: { xs: 6, sm: 8, md: 10 },
                    textAlign: "center",
                }}
            >
                <p
                    style={{
                        color: "#a9927d",
                        fontSize: "13px",
                        fontFamily: "Test Calibre",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: "40px",
                    }}
                >
                    We&apos;ve Worked With
                </p>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: { xs: "12px 20px", md: "16px 32px" },
                        maxWidth: "900px",
                        mx: "auto",
                    }}
                >
                    {[
                        "Nike",
                        "Netflix",
                        "Samsung",
                        "Cash App",
                        "Block",
                        "Scale AI",
                        "La Prairie",
                        "Delta",
                        "eBay",
                        "Miami Swim Week",
                    ].map((brand) => (
                        <span
                            key={brand}
                            style={{
                                color: "rgba(242,244,243,0.55)",
                                fontFamily: "Test Calibre",
                                fontSize: "clamp(14px, 2vw, 18px)",
                                letterSpacing: "0.04em",
                                fontWeight: "500",
                                transition: "color 0.2s ease",
                            }}
                        >
                            {brand}
                        </span>
                    ))}
                </Box>
            </Box>
        </>
    );
};

export default About;
