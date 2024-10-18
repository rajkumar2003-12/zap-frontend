import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token === null) {
            navigate("/signin");
        } else {
            navigate("/main");
        }
    }, [navigate]);
};


export function HomeRedirect() {
    useAuthRedirect();

    return(
    <>
    <h1>Loading..</h1>
    </>)
}