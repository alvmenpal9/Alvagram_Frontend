import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import PostDetails from "./PostDetails";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const url = 'post/followed'
const Home = () => {

    const { auth } = useAuth();
    const [followedPosts, setFollowedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {

        const getData = async () => {
            try {
                const response = await axiosPrivate.get(url, {
                    headers: {
                        Authorization: auth.accessToken
                    }
                })
                if (response?.status === 200) {
                    setFollowedPosts(response.data.postsUsers);
                    setIsLoading(false);
                }
            } catch (error) {
                if(error?.response?.status === 403) {
                    navigate('/login', {state: {from: location}, replace: true});
                }
            }
        }

        getData();

    }, [])

    useEffect(() => {
        if (refresh) {
            const getData = async () => {
                try {
                    const response = await axiosPrivate.get(url, {
                        headers: {
                            Authorization: auth.accessToken
                        }
                    })
                    if (response?.status === 200) {
                        setFollowedPosts(response.data.postsUsers);
                        setIsLoading(false);
                    }
                } catch (error) {
                    if(error?.response?.status === 403) {
                        navigate('/login', {state: {from: location}, replace: true});
                    }
                }
            }

            getData();
            setRefresh(false);
        }
    }, [refresh])

    return (
        isLoading
            ? <PostDetails />
            : <PostDetails followedPosts={followedPosts} isLoading={false} setRefresh={setRefresh} />
    )
}

export default Home;