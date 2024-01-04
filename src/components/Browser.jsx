import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Browser = () => {

    const [userToSearch, setUserToSearch] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const { auth } = useAuth();

    const search = async (e) => {
        e.preventDefault();
        try {
            const userExists = await axiosPrivate.get(`user/profile/${userToSearch}`, {
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
            if(error?.response?.status === 403) {
                navigate('/login', {state: {from: location}, replace: true});
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