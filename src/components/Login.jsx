import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const Login = () => {

    const { auth, setAuth, setPersist, persist } = useAuth();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || '/home';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState(false);

    const handleLogin = async e => {
        e.preventDefault();

        const body = {
            username,
            password
        }

        try {
            const response = await axios.post('login', body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response?.status === 200) {
                setAuth({
                    username: response.data.username,
                    role: response.data.role,
                    accessToken: response.data.accessToken
                });
                navigate(from, { replace: true });
            }
        } catch (error) {
            if (error?.response?.status === 404) setIncorrect(true);
        }

    }

    useEffect(() => {
        localStorage.setItem('persist', persist);
    }, [persist])

    const togglePersist = e => {
        setPersist(prev => !prev);
    }

    return (
        <>
            <section className="login_sidebar">
                <h2>Sign In</h2>
                <form className="form_template" onSubmit={handleLogin}>
                    {incorrect ?
                        <div className="instructions">
                            <p>Incorrect Username or Password</p>
                        </div>
                        : ''}
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" onChange={e => setUsername(e.target.value)} required minLength={3} />
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" onChange={e => setPassword(e.target.value)} required minLength={5} />
                    <button>Sign In!</button>
                    <div>
                        <input type="checkbox" name="persist" onChange={togglePersist} checked={persist} />
                        <label htmlFor="persist">Trust this device</label>
                    </div>
                    <p>Not registered yet?</p>
                    <NavLink to='/register'>Sign Up</NavLink>
                </form>
            </section>
        </>
    )
}

export default Login;