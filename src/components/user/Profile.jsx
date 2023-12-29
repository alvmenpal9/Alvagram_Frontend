import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { Global_url_api } from "../../constants/global";
import { useNavigate, useParams } from "react-router-dom";
import ChangeProfileInfo from "./ChangeProfileInfo";
import IndividualFloatingPost from "./IndividualFloatingPost";
import showIndividualPostContent, { ILike, showLists } from "../../helpers/showIndividualPost";
import List from "../List";
const url = '/user';

const Profile = () => {

    const [profile, setProfile] = useState({});
    const [profilePic, setProfilePic] = useState('default.png');
    const [posts, setPosts] = useState([]);
    const [iFollow, setIFollow] = useState(false);
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [numberOfPosts, setNumberOfPosts] = useState(0);
    const [numberOfFollowers, setNumberOfFollowers] = useState(0);
    const [numberOfFollowing, setNumberOfFollowing] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { auth } = useAuth();
    const { username } = useParams();
    const navigate = useNavigate();
    const showIndividualPost = showIndividualPostContent;
    const ILikeFunction = ILike;
    const showListFunction = showLists;

    useEffect(() => {

        setIFollow(false);
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
                    setProfilePic(response?.data?.profile?.User?.image);
                    response?.data?.profile?.FollowersInfo.forEach(userFollower => {
                        if (userFollower?.username?.includes(`${auth.username}`)) {
                            setIFollow(true);
                        }

                    })
                    setPosts(response?.data?.profile?.Posts);
                    setFollowing(response?.data?.profile?.FollowingInfo);
                    setFollowers(response?.data?.profile?.FollowersInfo);
                    setNumberOfPosts(response?.data?.profile?.Posts.length);
                    setNumberOfFollowers(response?.data?.profile?.FollowersInfo.length);
                    setNumberOfFollowing(response?.data?.profile?.FollowingInfo.length);
                    setIsLoading(false);
                }
            } catch (error) {
                if (error?.response?.status === 404) {
                    navigate(-1);
                    alert('User not found')
                }
            }
        };

        fetchData();

    }, []);

    useEffect(() => {

        setIFollow(false);
        const fetchData = async () => {
            const response = await axios.get(`${url}/profile/${username}`, {
                headers: {
                    Authorization: auth.accessToken
                },
                withCredentials: true,
            })

            if (response?.status === 200) {
                setProfile(response?.data?.profile?.User);
                setProfilePic(response?.data?.profile?.User?.image);

                response?.data?.profile?.FollowersInfo.forEach(userFollower => {
                    if (userFollower?.username?.includes(`${auth.username}`)) {
                        setIFollow(true);
                    }

                })

                setPosts(response?.data?.profile?.Posts);
                setFollowing(response?.data?.profile?.FollowingInfo);
                setFollowers(response?.data?.profile?.FollowersInfo);
                setNumberOfPosts(response?.data?.profile?.Posts.length);
                setNumberOfFollowers(response?.data?.profile?.FollowersInfo.length);
                setNumberOfFollowing(response?.data?.profile?.FollowingInfo.length);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [username])

    const handleFollowAction = async (iFollow) => {
        let response;

        try {
            if (iFollow) {
                response = await axios.get(`/follow/unfollow/${profile.id}`, {
                    headers: {
                        Authorization: auth.accessToken
                    }
                });
                if (response?.status === 200) {
                    setNumberOfFollowers(numberOfFollowers - 1);
                    setIFollow(false);
                }

            } else {
                response = await axios.post(`/follow`, {
                    username: username
                }, {
                    headers: {
                        Authorization: auth.accessToken
                    }
                })

                if (response?.status === 200) {
                    setNumberOfFollowers(numberOfFollowers + 1);
                    setIFollow(true);
                }
            }

        } catch (error) {
            console.error(error);
        }
    }

    const getPost = async (postId) => {
        try {
            const response = await axios.get(`/post/${postId}`, {
                headers: {
                    Authorization: auth.accessToken
                }
            });
            if (response?.status === 200) {
                showIndividualPost(response?.data?.post, auth, navigate);
            }

        } catch (error) {
            console.error(error);
        }
    }

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
                                    <h3>Followers <span style={{ fontWeight: 'lighter', color: 'var(--primary-color)' }}>0</span></h3>
                                    <h3>Following <span style={{ fontWeight: 'lighter', color: 'var(--primary-color)' }}>0</span></h3>
                                </div>
                            </div>
                            <div className="profile_pic">
                                <img src={`/src/assets/img/${profilePic}`} alt="Profile picture" className="avatar" />
                            </div>
                        </section>
                        <section className="posts_profile">

                        </section>
                    </>
                )
                : (
                    <>
                        <section className="profile_info">
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '40px', minWidth: '300px' }}>
                                <div>
                                    <h1>{profile.name} {profile.surname}</h1>
                                    <h2>{profile.username}</h2>
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    <h3>Posts <span style={{ color: 'var(--primary-color)' }}>{numberOfPosts}</span></h3>
                                    <h3>Followers <span style={{ color: 'var(--primary-color)', cursor: 'pointer' }} onClick={e => showListFunction('Followers', followers, navigate)}>{numberOfFollowers}</span></h3>
                                    <h3>Following <span style={{ color: 'var(--primary-color)', cursor: 'pointer' }} onClick={e => showListFunction('Following', following, navigate)}>{numberOfFollowing}</span></h3>
                                    {profile.username === auth.username
                                        ? <h4 style={{ color: 'var(--primary-color)', cursor: 'pointer', display: 'inline-block' }} onClick={e => document.querySelector('#user_profile_information').showModal()}>Edit Profile</h4>
                                        : ''
                                    }
                                </div>
                                {profile.username !== auth.username
                                    ? <button id="followbtn" className={iFollow ? 'unfollow' : 'follow'} onClick={e => handleFollowAction(iFollow)}>{iFollow ? 'Unfollow' : 'Follow'}</button>
                                    : ''
                                }
                            </div>
                            <div className="profile_pic">
                                {profile.image === 'default.png'
                                    ? <img src={`/src/assets/img/${profilePic}`} alt="Profile picture" className="avatar" />
                                    : <img src={`${Global_url_api}user/image/download/${profilePic}`} />
                                }
                            </div>
                        </section>
                        <section className="posts_profile">
                            {posts.toReversed().map(post => (
                                <div key={post._id} className="post_profile" onClick={e => getPost(post._id)}>
                                    <img src={`${Global_url_api}post/image/${[post.image]}`} />
                                </div>
                            ))}
                        </section>
                        <ChangeProfileInfo profile={profile} profilePic={profilePic} setProfilePic={setProfilePic} />
                        <IndividualFloatingPost />
                        <List />
                    </>
                )
            }
        </section>

    )
}

export default Profile;