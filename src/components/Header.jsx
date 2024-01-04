import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Browser from "./Browser";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import useLogout from "../hooks/useLogout";

const Header = () => {

    const navigate = useNavigate();
    const { auth } = useAuth();
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

    return (
        <header className="header">
            <div className="logo" onClick={e => navigate('/home')}>
                <img src="/src/assets/img/logo_no_text.png" />
            </div>
            <Browser />
            <nav className="navbar">
                <ul className="navbar_list">
                    <li>
                        <a onClick={showFloatingModal}>
                            <img src="/src/assets/img/add.png" alt="Create post" />
                        </a>
                    </li>
                    <li>
                        <NavLink to={'/home'}>
                            <img src="/src/assets/img/home.png" alt="Home" />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/messages'}>
                            <img src="/src/assets/img/chat.png" alt="Direct Messages" />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/notifications'}>
                            <img src="/src/assets/img/notifications.png" alt="Notifications" />
                        </NavLink>
                    </li>
                    <li onMouseEnter={showLogout}>
                        <NavLink to={`/profile/${auth.username}`}>
                            <img className="avatar" src="/src/assets/img/default.png" alt="Profile" />
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div className="logout" onMouseLeave={hideLogout} onClick={handleLogout}>
                <h2>Logout</h2>
            </div>
        </header>
    )
}

export default Header;