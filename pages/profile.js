import { Button } from "@mui/material";
import Router from "next/router";

import { useUser } from "../hooks/useAuth";

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

    const handleLogout = async () => {
        const logoutRequest = await fetch("/api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        });
        if (logoutRequest.ok) {
            // We successfully logged out, our API
            // remove authorization cookies and now we
            // can redirect to the homepage!
            Router.push("/");
        } else {
            /* handle errors */
        }
    };

    return (
        <>
            {user && (
                <>
                    <h1>Profile</h1>
                    <p>Your session:</p>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                    <Button onClick={() => handleLogout()}>Logout</Button>
                </>
            )}
        </>
    );
};

export default Profile;
