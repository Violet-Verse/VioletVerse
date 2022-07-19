import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Box } from "@mui/material";

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
            className="not-found"
            sx={{
                padding: {
                    xs: "0px 0px",
                    sm: "0px 10%",
                    lg: "0px 20%",
                    xl: "0px 20%",
                },
            }}
        >
            <h1>Ooops...</h1>
            <h2>That page cannot be found.</h2>
            <Box sx={{ margin: "25px 0px" }}>
                <Image
                    width={1920}
                    height={1080}
                    src="/Photography_Banner.png"
                    alt="Default Image"
                    // layout="responsive"
                />
            </Box>
            <p>
                Going back to the{" "}
                <Link href="/">
                    <a>homepage</a>
                </Link>{" "}
                in {seconds}...
            </p>
        </Box>
    );
};

export default NotFound;
