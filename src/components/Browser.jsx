import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const url = 'user/search'
const Browser = () => {

    const [userToSearch, setUserToSearch] = useState('');
    const navigate = useNavigate();

    const search = async (e) => {
        e.preventDefault();
        navigate(`/profile/${userToSearch}`)
        e.target.username.value = '';
    }

    return (
        <div className="browser">
            <form onSubmit={search}>
                <input type="text" placeholder="Search for users" min={1} style={{ width: '100%' }} onChange={e => setUserToSearch(e.target.value)} name="username" />
            </form>
        </div>
    )
}

export default Browser;