import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const Browser = () => {

    const [userToSearch, setUserToSearch] = useState('');
    const navigate = useNavigate();
    const { auth } = useAuth();

    const search = async (e) => {
        e.preventDefault();
        try {
            const userExists = await axios.get(`user/profile/${userToSearch}`, {
                headers: {
                    Authorization: auth.accessToken
                }
            });
            if (userExists?.status === 200) {
                navigate(`/profile/${userToSearch}`)
            }
        } catch (error) {
            if (error?.response?.status === 404) {
                alert('User not found')
            }
        }
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