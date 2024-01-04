import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ChangeProfileInfo = ({ profile, setProfilePic }) => {

    const [newProfilePic, setNewProfilePic] = useState();
    const { auth } = useAuth();
    const [oldPwd, setOldPwd] = useState();
    const [newPwd, setNewPwd] = useState();
    const [matchNewPwd, setMatchNewPwd] = useState();
    const [passwordMatches, setPasswordMatches] = useState(false);
    const [oldPwdIncorrect, setOldPwdIncorrect] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (newPwd === matchNewPwd) {
            setPasswordMatches(true);
        } else {
            setPasswordMatches(false);
        }
    }, [newPwd, matchNewPwd])

    const changeProfilePicture = async (e) => {
        const formData = new FormData();
        formData.append('file0', newProfilePic);

        try {
            const response = await axiosPrivate.post('/user/image/upload', formData, {
                headers: {
                    Authorization: auth.accessToken
                },
            });
            if (response?.status === 200) {
                document.querySelector('#user_profile_information').close();
                setProfilePic(response?.data?.image);
            }
        } catch (error) {
            if(error?.response?.status === 403) {
                navigate('/login', {state: {from: location}, replace: true});
            }
        }
    }

    const changePassword = async (e) => {

        if (passwordMatches && newPwd.length > 2 && matchNewPwd.length > 2) {
            try {
                const response = await axiosPrivate.post(`/user/changepwd/${profile.id}`, {
                    oldPassword: oldPwd,
                    newPassword: newPwd,
                    confirmNewPassword: matchNewPwd
                }, {
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: auth.accessToken
                    }
                });
                if (response?.status === 200) {
                    setPasswordChanged(true);
                }
            } catch (error) {
                if (error?.response?.status === 404) {
                    setOldPwdIncorrect(true);
                }
                if(error?.response?.status === 403) {
                    navigate('/login', {state: {from: location}, replace: true});
                }
            }
            document.querySelector('#oldpwd').value = '';
            document.querySelector('#newpwd').value = '';
            document.querySelector('#matchnewpwd').value = '';
        }

    }

    return (
        <>
            <dialog id="user_profile_information" style={{ width: "20%" }}>
                {passwordChanged ?
                    <div className="instructions">
                        <p>Password changed successfully</p>
                    </div>
                    : ''
                }
                {oldPwdIncorrect ?
                    <div className="instructions">
                        <p>Could not change password, Old password incorrect</p>
                    </div>
                    : ''
                }
                <form method="dialog" style={{ marginTop: '10px' }}>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" defaultValue={profile.name} style={{ textAlign: 'center' }} />
                    <label htmlFor="surname">Surname</label>
                    <input type="text" name="surname" defaultValue={profile.surname} style={{ textAlign: 'center' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <p style={{ color: 'var(--primary-color)', cursor: 'pointer' }} onClick={e => { document.querySelector('#user_profile_picture').showModal() }}>Change profile picture</p>
                        <p style={{ color: 'var(--primary-color)', cursor: 'pointer' }} onClick={e => { document.querySelector('#user_password').showModal() }}>Change Password</p>
                    </div>
                    <input type="submit" value="Edit" style={{ marginBottom: '5px' }} />
                </form>
                <button onClick={e => {
                    document.querySelector('#user_profile_information').close()
                    setPasswordChanged(false);
                    setOldPwdIncorrect(false);
                }} style={{ margin: '0' }} >Cancel</button>
            </dialog>


            <dialog id="user_profile_picture" style={{ width: "30%" }}>
                <form method="dialog" encType="multipart/form-data" onSubmit={changeProfilePicture} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label htmlFor="file0" style={{ marginBottom: '10px' }}>Profile Picture </label>
                    <input type="file" name="file0" onChange={e => setNewProfilePic(e.target.files[0])} required />
                    <input type="submit" value="Edit" style={{ marginBottom: '5px', width: '200px', cursor: 'pointer' }} />
                </form>
                <button onClick={e => document.querySelector('#user_profile_picture').close()} style={{ margin: '0', width: '200px' }} >Cancel</button>
            </dialog>

            <dialog id="user_password" style={{ width: "20%" }}>
                {!passwordMatches
                    ? <div className="instructions">
                        <p>New password do not match</p>
                    </div>
                    : ''
                }
                <form method="dialog" onSubmit={changePassword} style={{ marginTop: '10px' }}>
                    <label htmlFor='oldpwd' style={{ display: 'block' }}>Old Password</label>
                    <input id="oldpwd" type="password" name="oldpwd" onChange={e => setOldPwd(e.target.value)} style={{ textAlign: 'center' }} required />
                    <label htmlFor='newpwd' style={{ display: 'block' }}>New password</label>
                    <input id="newpwd" type="password" name="newpwd" onChange={e => setNewPwd(e.target.value)} style={{ textAlign: 'center' }} required />
                    <label htmlFor='matchnewpwd' style={{ display: 'block' }}>Confirm new password</label>
                    <input id="matchnewpwd" type="password" name="matchnewpwd" onChange={e => setMatchNewPwd(e.target.value)} style={{ textAlign: 'center' }} required />
                    <input type="submit" value="Change Password" style={{ marginBottom: '5px', width: '200px', cursor: 'pointer' }} />
                </form>
                <button onClick={e => {
                    document.querySelector('#user_password').close();
                    document.querySelector('#oldpwd').value = '';
                    document.querySelector('#newpwd').value = '';
                    document.querySelector('#matchnewpwd').value = '';
                }} style={{ margin: '0', width: '200px' }} >Cancel</button>
            </dialog>
        </>
    )
}

export default ChangeProfileInfo;