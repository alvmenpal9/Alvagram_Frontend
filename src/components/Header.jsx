import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Browser from "./Browser";
import useAuth from "../hooks/useAuth";

const Header = () => {

    const navigate = useNavigate();
    const { auth } = useAuth();

    return (
        <header className="header">
            <div className="logo" onClick={e => navigate('/home')}>
                <img src="/src/assets/img/logo_no_text.png" />
            </div>
            <Browser />
            <nav className="navbar">
                <ul className="navbar_list">
                    <li>
                        <NavLink to={'/createpost'}>
                            <img src="/src/assets/img/add.png" alt="Create post" />
                        </NavLink>
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
                    <li>
                        <NavLink to={`/profile/${auth.username}`}>
                            <img className="avatar" src="/src/assets/img/default.png" alt="Profile" />
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;