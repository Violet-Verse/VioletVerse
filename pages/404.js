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
        <>
            <h1>Ooops...</h1>
            <h2>That page cannot be found.</h2>
            <Box sx={{ margin: "25px 0px" }}>
                <Image
                    width={1920}
                    height={1080}
                    src="/banners/Photography_1.png"
                    alt="Default Image"
                    className="image"
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
        </>
    );
};

export default NotFound;
