import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { Global_url_api } from "../../constants/global";
import { useParams } from "react-router-dom";
const url = '/user';
const Profile = () => {

    const [profile, setProfile] = useState({});
    const [posts, setPosts] = useState([]);
    const [numberOfPosts, setNumberOfPosts] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { auth } = useAuth();
    const { username } = useParams();

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
        isLoading ? <h1>Loading...</h1>
            : (
                <section className="main_content">
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
                    <section className="posts">
                        {posts.map(post => (
                            <div key={post._id} className="post">
                                <img src={`${Global_url_api}post/image/${[post.image]}`} />
                            </div>
                        ))}
                    </section>
                </section>
            )
    )
}

export default Profile;