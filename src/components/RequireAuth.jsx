import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";

const RequireAuth = ({ allowedRoles }) => {

    const { auth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.username === undefined) navigate('/login');
    })

    return (
        (auth.username !== undefined) && (
            allowedRoles.includes(auth?.role) ?
                <>
                    <Header />
                    <main className="main">
                            <Outlet />
                    </main>
                </>
                :
                <>
                    <h1>Not enough privileges</h1>
                    <button className={{}} onClick={e => navigate(-1)}>Go Back</button>
                </>
        )
    )
}

export default RequireAuth;