import { useEffect } from "react";
import { useRouter } from "next/router";

export default function ConnectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/");
    }, [router]);

    return null;
}

export async function getStaticProps() {
    return { props: {} };
}
