import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import ProgressSpinner from "../components/ProgressSpinner";

const ProtectedRoute = () => {

    const {loading, isAuthenticated} = useAuth();

    if (loading)
        return (<ProgressSpinner value={{prog: "Loading..."}}/>);

    if (!isAuthenticated()) 
        return (<Navigate to="/login" replace />);

    return <Outlet />;
};

export default ProtectedRoute;