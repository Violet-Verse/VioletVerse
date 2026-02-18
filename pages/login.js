import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export async function getStaticProps() {
    return {
        props: {
            protected: false,
        },
    };
}

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [adminKey, setAdminKey] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/direct-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, adminKey }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                setLoading(false);
                return;
            }

            router.push("/dashboard");
        } catch (err) {
            setError("Network error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Login | Violet Verse</title>
            </Head>
            <div style={styles.container}>
                <div style={styles.card}>
                    <h2 style={styles.title}>Admin Login</h2>
                    <p style={styles.subtitle}>
                        Sign in to access the dashboard
                    </p>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <label style={styles.label} htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            style={styles.input}
                        />

                        <label style={styles.label} htmlFor="adminKey">
                            Admin Key
                        </label>
                        <input
                            id="adminKey"
                            type="password"
                            required
                            value={adminKey}
                            onChange={(e) => setAdminKey(e.target.value)}
                            placeholder="Enter admin key"
                            style={styles.input}
                        />

                        {error && <p style={styles.error}>{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.button,
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? "not-allowed" : "pointer",
                            }}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        padding: "40px 20px",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "48px 40px",
        maxWidth: "420px",
        width: "100%",
        boxShadow: "0 4px 24px rgba(105, 62, 154, 0.12)",
    },
    title: {
        fontFamily: "Ogg",
        fontWeight: 500,
        fontSize: "32px",
        color: "#0a0510",
        margin: "0 0 8px 0",
        textAlign: "center",
    },
    subtitle: {
        fontFamily: "stratos-lights",
        fontSize: "16px",
        color: "#777",
        margin: "0 0 32px 0",
        textAlign: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        fontFamily: "stratos",
        fontWeight: 500,
        fontSize: "14px",
        color: "#0a0510",
        marginBottom: "6px",
    },
    input: {
        fontFamily: "stratos-lights",
        fontSize: "16px",
        padding: "12px 16px",
        borderRadius: "100px",
        border: "1.5px solid #ddd",
        outline: "none",
        marginBottom: "20px",
    },
    error: {
        fontFamily: "stratos-lights",
        fontSize: "14px",
        color: "#d32f2f",
        margin: "0 0 16px 0",
        textAlign: "center",
    },
    button: {
        fontFamily: "stratos",
        fontWeight: 500,
        fontSize: "18px",
        color: "#43226D",
        backgroundColor: "#DED1F7",
        border: "none",
        borderRadius: "100px",
        padding: "14px",
        marginTop: "8px",
    },
};

export default Login;
