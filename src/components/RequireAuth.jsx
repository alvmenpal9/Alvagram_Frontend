import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import CreatePost from "./user/CreatePost";

const RequireAuth = ({ allowedRoles }) => {

    const { auth } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState();

    useEffect(() => {
        if (auth.username === undefined) navigate('/login');
    }, [])

    useEffect(() => {
        const userAgent = navigator.userAgent;
        const mobile = /Mobi|Android/i.test(userAgent);
        setIsMobile(mobile);

        if(isMobile){
            document.querySelector('#root').classList.add('mobile-layout')
        }
        setIsLoading(false);
        return () => {
            setIsLoading(true);
            document.querySelector('#root').classList.remove('mobile-layout')
        }
    }, [])

    return (
        !isLoading
            ? (auth.username !== undefined) && (
                allowedRoles.includes(auth?.role) ?
                    <>
                        <Header />
                        <main className="main">
                            <CreatePost />
                            <Outlet />
                        </main>
                    </>
                    :
                    <>
                        <h1>Not enough privileges</h1>
                        <button className={{}} onClick={e => navigate(-1)}>Go Back</button>
                    </>
            )
            : 'Loading...'
    )
}

export default RequireAuth;