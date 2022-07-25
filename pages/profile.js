import { Button } from "@mui/material";
import Router from "next/router";
import DOMPurify from "isomorphic-dompurify";

import { useUser } from "../hooks/useAuth";
import Link from "next/link";

// export async function getStaticProps(context) {
//     return {
//         props: {
//             protected: true,
//         },
//     };
// }

const Profile = () => {
    useUser({ redirectTo: "/login" });
    const { user } = useUser();
    console.log(user);
    const clean = DOMPurify.sanitize(user?.bio);
    return (
        <>
            {user && (
                <>
                    <h1>Welcome, {user.name}!</h1>
                    <br />
                    <h4>{user.bio}</h4>
                    <p>Flow Wallet: {user.flowAddress}</p>
                    <p>VV Tokens: 0</p>
                    <p>Role: {user.role}</p>
                    {user.role === "admin" && (
                        <Link href="/editor">
                            <a>
                                <Button variant="contained" disableElevation>
                                    Go to Creator Dashboard
                                </Button>
                            </a>
                        </Link>
                    )}
                    {/* <p>Your session:</p> */}
                    {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
                    {/* <section
                        className="not-found-controller"
                        dangerouslySetInnerHTML={{ __html: clean }}
                    />
                    <pre>{clean}</pre> */}
                </>
            )}
        </>
    );
};

export default Profile;
