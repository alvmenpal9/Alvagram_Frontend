import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { Global_url_api } from "../../constants/global";
import { useNavigate, useParams } from "react-router-dom";
const url = '/user';
const Profile = () => {

    const [profile, setProfile] = useState({});
    const [posts, setPosts] = useState([]);
    const [numberOfPosts, setNumberOfPosts] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { auth } = useAuth();
    const { username } = useParams();
    const navigate = useNavigate();

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get(`${url}/profile/${username}`, {
                    headers: {
                        Authorization: auth.accessToken
                    },
                    withCredentials: true,
                })
                if (response?.status === 200) {
                    setProfile(response?.data?.profile?.User);
                    setPosts(response?.data?.profile?.Posts);
                    setNumberOfPosts(response?.data?.profile?.Posts.length);
                    setIsLoading(false);
                }
            }catch(error){
                if(error?.response?.status === 404){
                    navigate(-1);
                    alert('User not found')
                }
            }
        };

        fetchData();

    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`${url}/profile/${username}`, {
                headers: {
                    Authorization: auth.accessToken
                },
                withCredentials: true,
            })
            if (response?.status === 200) {
                setProfile(response?.data?.profile?.User);
                setPosts(response?.data?.profile?.Posts);
                setNumberOfPosts(response?.data?.profile?.Posts.length);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [username])

    return (
        <section className="main_content">
            {isLoading
                ? (
                    <>
                        <section className="profile_info">
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '40px' }}>
                                <div>
                                    <h1>User</h1>
                                    <h2>Username</h2>
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    <h3>Posts <span style={{ fontWeight: 'lighter', color: 'var(--primary-color)' }}>0</span></h3>
                                </div>
                            </div>
                            <div className="profile_pic">
                                <img src="/src/assets/img/default.png" alt="Profile picture" className="avatar" />
                            </div>
                        </section>
                        <section className="posts_profile">

                        </section>
                    </>
                )
                : (
                    <>
                        <section className="profile_info">
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '40px' }}>
                                <div>
                                    <h1>{profile.name} {profile.surname}</h1>
                                    <h2>{profile.username}</h2>
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    <h3>Posts <span style={{ fontWeight: 'lighter', color: 'var(--primary-color)' }}>{numberOfPosts}</span></h3>
                                </div>
                                {profile.username !== auth.username
                                    ? <h1>FOLLOW</h1>
                                    : ''
                                }
                            </div>
                            <div className="profile_pic">
                                {profile.image === 'default.png'
                                    ? <img src="/src/assets/img/default.png" alt="Profile picture" className="avatar" />
                                    : 'CHAO'
                                }
                            </div>
                        </section>
                        <section className="posts_profile">
                            {posts.map(post => (
                                <div key={post._id} className="post_profile">
                                    <img src={`${Global_url_api}post/image/${[post.image]}`} />
                                </div>
                            ))}
                        </section>
                    </>
                )
            }
        </section>

    )
}

export default Profile;