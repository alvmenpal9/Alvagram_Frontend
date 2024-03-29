import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Browser from "./Browser";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import useLogout from "../hooks/useLogout";

const Header = () => {

    const navigate = useNavigate();
    const { auth } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState();
    const logout = useLogout();

    const showFloatingModal = (e) => {
        const modal = document.querySelector('#floating-file');
        modal.showModal();
    }

    const showLogout = (e) => {
        document.querySelector('.logout').style.display = "block";
    }

    const hideLogout = (e) => {
        document.querySelector('.logout').style.display = "none";
    }

    const handleLogout = async (e) => {
        await logout();
        navigate('/login');
    }

    useEffect(() => {
        const userAgent = navigator.userAgent;
        const mobile = /Mobi|Android/i.test(userAgent);

        setIsMobile(mobile);
        setIsLoading(false);
        return () => {
            setIsLoading(true);
        }
    }, [])

    return (
        !isLoading
            ? (
                <>
                    {isMobile && <Browser isMobile={isMobile} />}
                    <header className={!isMobile ? 'header' : 'header-mobile'}>
                        {!isMobile
                            ?
                            <div className="logo" onClick={e => navigate('/home')}>
                                <img src="/assets/img/logo_no_text.png" />
                            </div>
                            : ''
                        }
                        {!isMobile && <Browser />}
                        <nav className="navbar">
                            <ul className="navbar_list">
                                <li>
                                    <a onClick={showFloatingModal}>
                                        <img src="/assets/img/add.png" alt="Create post" />
                                    </a>
                                </li>
                                <li>
                                    <NavLink to={'/home'}>
                                        <img src="/assets/img/home.png" alt="Home" />
                                    </NavLink>
                                </li>
                                <li onClick={e => {
                                    if(isMobile){
                                        document.querySelector('.chat-content').style.display = 'none';
                                        document.querySelector('.chat-list').style.display = 'block';
                                    }
                                }}>
                                    <NavLink to={'/messages'}>
                                        <img src="/assets/img/chat.png" alt="Direct Messages" />
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/notifications'}>
                                        <img src="/assets/img/notifications.png" alt="Notifications" />
                                    </NavLink>
                                </li>
                                <li onMouseEnter={showLogout}>
                                    <NavLink to={`/profile/${auth.username}`}>
                                        <img className="avatar" src="/assets/img/default.png" alt="Profile" />
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                        <div className="logout" onMouseLeave={hideLogout} onClick={handleLogout}>
                            <h2>Logout</h2>
                        </div>
                    </header>
                </>
            )
            : ''
    )
}

export default Header;