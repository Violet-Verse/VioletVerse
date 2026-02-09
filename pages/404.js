import { Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const NotFound = () => {
    const router = useRouter();
    const [seconds, setSeconds] = useState(5);

    useEffect(() => {
        if (seconds !== 0) {
            setTimeout(() => {
                setSeconds(seconds - 1);
            }, 1000);
        } else {
            router.push("/");
        }
    });

    return (
        <Box
            sx={{
                px: {
                    xs: "0",
                    sm: "5%",
                    md: "10%",
                    lg: "15%",
                    xl: "20%",
                },
            }}
        >
            <h1>Ooops...</h1>
            <h2>That page cannot be found.</h2>
            <Box sx={{ mt: 3 }}>
                <Image
                    width={1920}
                    height={1080}
                    src="/banners/Photography_1.png"
                    alt="Default Image"
                    className="image"
                    placeholder="blur"
                    blurDataURL="/banners/Photography_1.png"
                />
            </Box>
            <p>
                Going back to the{" "}
                <Link href="/" legacyBehavior>
                    <a>homepage</a>
                </Link>{" "}
                in {seconds}...
            </p>
        </Box>
    );
};

export default NotFound;
