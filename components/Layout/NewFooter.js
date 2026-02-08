import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
    Box,
    Container,
    Group,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useMemo } from "react";
import Image from "next/image";
import Router from "next/router";
import styles from "../../styles/Footer.module.css";

const NavLink = ({ href, className, children, external }) => {
    if (external) {
        return (
            <a href={href} target="_blank" rel="noreferrer" className={className}>
                {children}
            </a>
        );
    }
    return (
        <span
            className={className}
            style={{ cursor: "pointer" }}
            onClick={() => Router.push(href)}
        >
            {children}
        </span>
    );
};

const Footer = () => {
    const marketLinks = useMemo(
        () => [
            { href: "/posts?category=Tech", label: "See tech content" },
            { href: "/posts?category=Lifestyle", label: "See lifestyle content" },
            { href: "/posts?category=Education", label: "See educational content" },
        ],
        []
    );

    const resourcesLinks = useMemo(
        () => [
            { href: "/resources", label: "Getting Started" },
            { href: "/resources", label: "Fashion Tech Resources" },
            { href: "/resources", label: "Events and Meetups" },
        ],
        []
    );

    const communityLinks = useMemo(
        () => [
            { href: "/how-to-earn-vv-tokens-PS1xU3BF4B", label: "Learn about VV Rewards" },
            { href: "/become-a-contributor-l91YAc3Lmr", label: "Become a contributor" },
            { href: "https://app.console.xyz/c/violetverse", label: "Join IRL Chat", external: true },
        ],
        []
    );

    const aboutLinks = useMemo(
        () => [
            { href: "/about", label: "Team" },
            { href: "https://buy.stripe.com/9AQeYAapJg343tu7sy", label: "1:1 Consultations", external: true },
            { href: "/contact", label: "Contact us" },
        ],
        []
    );

    return (
        <footer className={styles.footer}>
            <Container size="100rem" px={{ base: 16, sm: 20, md: 32 }}>
                <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 5 }}
                    spacing="xl"
                    className={styles.mainGrid}
                >
                    <Box className={styles.section}>
                        <Group align="center" spacing={8} mb="md">
                            <Image src="/WhiteLogo.svg" alt="logo light" width={143} height={80} />
                        </Group>
                        <Group spacing="md" className={styles.socialIconsDesktop}>
                            <a href="https://instagram.com/violetverse.io" target="_blank" rel="noreferrer" className={styles.socialLink}>
                                <InstagramIcon className={styles.socialIcon} />
                            </a>
                            <a href="https://twitter.com/TheVioletVerse" target="_blank" rel="noreferrer" className={styles.socialLink}>
                                <TwitterIcon className={styles.socialIcon} />
                            </a>
                            <a href="https://app.console.xyz/c/violetverse" target="_blank" rel="noreferrer" className={styles.socialLink}>
                                <Image src="/Discord.svg" alt="Discord icon" width={24} height={24} priority className={styles.discordIcon} />
                            </a>
                        </Group>
                    </Box>

                    <Box className={styles.section}>
                        <Title order={4} className={styles.sectionTitle} mb="md">
                            <NavLink href="/posts" className={styles.sectionTitleLink}>Market</NavLink>
                        </Title>
                        <Stack spacing="xs">
                            {marketLinks.map((link) => (
                                <NavLink key={link.label} href={link.href} className={styles.link}>
                                    {link.label}
                                </NavLink>
                            ))}
                        </Stack>
                    </Box>

                    <Box className={styles.section}>
                        <Title order={4} className={styles.sectionTitle} mb="md">
                            <NavLink href="/resources" className={styles.sectionTitleLink}>Resources</NavLink>
                        </Title>
                        <Stack spacing="xs">
                            {resourcesLinks.map((link) => (
                                <NavLink key={link.label} href={link.href} className={styles.link}>
                                    {link.label}
                                </NavLink>
                            ))}
                        </Stack>
                    </Box>

                    <Box className={styles.section}>
                        <Title order={4} className={styles.sectionTitle} mb="md">
                            <NavLink href="/about" className={styles.sectionTitleLink}>Community</NavLink>
                        </Title>
                        <Stack spacing="xs">
                            {communityLinks.map((link) => (
                                <NavLink key={link.label} href={link.href} className={styles.link} external={link.external}>
                                    {link.label}
                                </NavLink>
                            ))}
                        </Stack>
                    </Box>

                    <Box className={styles.section}>
                        <Title order={4} className={styles.sectionTitle} mb="md">
                            <NavLink href="/about" className={styles.sectionTitleLink}>About</NavLink>
                        </Title>
                        <Stack spacing="xs">
                            {aboutLinks.map((link) => (
                                <NavLink key={link.label} href={link.href} className={styles.link} external={link.external}>
                                    {link.label}
                                </NavLink>
                            ))}
                        </Stack>
                    </Box>
                </SimpleGrid>
            </Container>

            <Box className={styles.bottom}>
                <Container size="100rem" px={{ base: 16, sm: 20, md: 32 }}>
                    <Box className={styles.bottomContainer}>
                        <Group spacing="md" className={styles.socialIconsMobile}>
                            <a href="https://instagram.com/violetverse.io" target="_blank" rel="noreferrer" className={styles.socialLink}>
                                <InstagramIcon className={styles.socialIcon} />
                            </a>
                            <a href="https://twitter.com/TheVioletVerse" target="_blank" rel="noreferrer" className={styles.socialLink}>
                                <TwitterIcon className={styles.socialIcon} />
                            </a>
                            <a href="https://app.console.xyz/c/violetverse" target="_blank" rel="noreferrer" className={styles.socialLink}>
                                <Image src="/Discord.svg" alt="Discord icon" width={24} height={24} priority className={styles.discordIcon} />
                            </a>
                        </Group>
                        <Text className={styles.copyright}>
                            {"\u00A9"} {new Date().getFullYear()} Violet Verse. All rights reserved.
                        </Text>
                    </Box>
                </Container>
            </Box>
        </footer>
    );
};

export default Footer;
