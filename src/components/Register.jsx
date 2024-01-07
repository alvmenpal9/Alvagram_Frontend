import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "../api/axios";

const Register = () => {

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState(true);

    const [surname, setSurname] = useState('');
    const [surnameError, setSurnameError] = useState(true);

    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');
    const [matchPwd, setMatchPwd] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const [userExists, setUserExists] = useState(false);
    const [userSuccess, setUserSuccess] = useState(false);

    const stringRegex = /^[a-zA-Z'-]{3,15}$/;

    useEffect(() => {
        const validString = stringRegex.test(name);
        if (validString) {
            setNameError(false)
        } else {
            setNameError(true);
        }
    }, [name])

    useEffect(() => {
        const validString = stringRegex.test(surname);
        if (validString) {
            setSurnameError(false)
        } else {
            setSurnameError(true);
        }
    }, [surname])

    useEffect(() => {
        if (password === matchPwd) {
            setPasswordsMatch(true);
        } else {
            setPasswordsMatch(false);
        }
    }, [password, matchPwd])

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!nameError && !surnameError && passwordsMatch) {
            const body = {
                name,
                surname,
                username,
                password
            }

            try {
                const response = await axios.post('user', body, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response?.status === 200) {
                    setUserSuccess(true);
                    e.target.name.value = '';
                    e.target.surname.value = '';
                    e.target.username.value = '';
                    e.target.password.value = '';
                    e.target.match_password.value = '';
                }

            } catch (err) {
                err?.response?.status === 403 ? setUserExists(true) : setUserExists(false)
            }
        }
    }

    return (
        <>
            <section className="login_sidebar">
                <h2>Sign Up</h2>
                <form className="form_template" onSubmit={handleRegister}>
                    {(nameError || surnameError || !passwordsMatch) && (
                        <div className="instructions">
                            {nameError ? <p>* Name must be from 3 - 10 characters</p>
                                : ''}
                            {surnameError ? <p>* Surname must be from 3 - 10 characters </p> : ''}
                            {!passwordsMatch ? <p>* Passwords do not match</p> : ''}
                        </div>
                    )}
                    {userExists || userSuccess ?
                        <div className="instructions">
                            {userExists ? <p>User already exists</p> : ''}
                            {userSuccess ? <p>Account created successfully</p> : ''}
                        </div>
                        : ''
                    }
                    {userSuccess ?
                        <>
                            <br />
                            <p>Congratulations!  You are registered to Alvagram</p>
                            <NavLink to='/login' style={{marginTop: '20px'}}>Sign In</NavLink>
                        </>
                        :
                        <>
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" required minLength={3} onChange={e => setName(e.target.value)} autoFocus />
                            <label htmlFor="surname">Surname</label>
                            <input type="text" name="surname" required minLength={3} onChange={e => setSurname(e.target.value)} />
                            <label htmlFor="username">Username</label>
                            <input type="text" name="username" required minLength={3} onChange={e => setUsername(e.target.value)} />
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" required minLength={5} onChange={e => setPassword(e.target.value)} />
                            <label htmlFor="match_password">Confirm Password</label>
                            <input type="password" name="match_password" required minLength={5} onChange={e => { setMatchPwd(e.target.value) }} />
                            <button>Register</button>
                            <p>Already have an account?</p>
                            <NavLink to='/login'>Sign In</NavLink>
                        </>}
                </form>
            </section>
        </>
    )
}

export default Register;