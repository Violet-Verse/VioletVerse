import useAuth from "../hooks/useAuth";

const Dashboard = () => {
    const { user, loading } = useAuth();

    return (
        <>
            <h1>Dashboard</h1>
            {loading ? "Loading..." : user.issuer}
        </>
    );
};

export default Dashboard;
