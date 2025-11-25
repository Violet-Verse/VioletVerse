import { Grid, Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/InfoBlock.module.css";

const InfoBlock = (props) => {
    const newToWeb3Block = [
        {
            name: "Getting Started",
            description:
                "Your go-to guide to getting started in the web3 space.",
            url: "/the-violet-verse-web3-glossary-TLraj5m2VD",
        },
        {
            name: "Resources",
            description:
                "Discover resources on all things crypto, blockchain, NFT, and more.",
            url: "/resources",
        },
        {
            name: "Events/Meetups",
            description: "Explore fun networking events in the web3 space.",
            url: "/resources",
        },
    ];

    return (
        <Box sx={{ mt: props.mt, mb: props.mb, my: props.my }}>
            {!props.disableTitle && (
                <Grid
                    container={true}
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                >
                    <Grid item={true} sx={{ mb: { xs: 4 } }}>
                        <Grid container={true} direction="row">
                            {/* MD Breakpoint */}
                            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
                                <Image
                                    src="/line1.svg"
                                    alt="line"
                                    height={1}
                                    width={100}
                                />
                                <h2 style={{ margin: "0 35px" }}>{props.title}</h2>
                                <Image
                                    src="/line1.svg"
                                    alt="line"
                                    height={1}
                                    width={100}
                                />
                            </Box>
                            {/* XS Breakpoint */}
                            <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
                                <Image
                                    src="/line1.svg"
                                    alt="line"
                                    height={1}
                                    width={40}
                                />
                                <h2 style={{ margin: "0 15px" }}>{props.title}</h2>
                                <Image
                                    src="/line1.svg"
                                    alt="line"
                                    height={1}
                                    width={40}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            )}
            <Grid
                container={true}
                spacing={2}
                align="center"
                justifyContent="center"
                sx={{ mt: 4, px: { xs: 10, sm: 0 } }}
            >
                {newToWeb3Block.map((section) => (
                    <Grid item={true} sm={12} md={4} key={section.name}>
                        <Box
                            sx={{
                                height: "200px",
                                maxWidth: { sm: "80%", md: "304px" },
                                background: "#DFDEEF",
                                borderRadius: "24px",
                            }}
                        >
                            <Grid
                                container={true}
                                direction="column"
                                justifyContent="center"
                                sx={{
                                    height: "200px",
                                    px: 2,
                                }}
                            >
                                <Grid item={true}>
                                    <h3 className={styles.header}>
                                        {section.name}
                                    </h3>
                                </Grid>
                                <Grid item={true}>
                                    <h5 className={styles.body}>
                                        {section.description}
                                    </h5>
                                </Grid>
                                <Grid item={true}>
                                    <Link href={section.url} legacyBehavior={true}>
                                        <a href={section.url}>
                                            <h5 className={styles.link}>
                                                Learn more
                                            </h5>
                                        </a>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default InfoBlock;
