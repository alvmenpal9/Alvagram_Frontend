import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import PostDetails from "./PostDetails";

const url = 'post/followed'
const Home = () => {

    const { auth } = useAuth();
    const [followedPosts, setFollowedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const getData = async () => {
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: auth.accessToken
                    }
                })
                if (response?.status === 200) {
                    setFollowedPosts(response.data.postsUsers);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error(error);
            }
        }

        getData();

    }, [])

    return (
        isLoading 
            ? <PostDetails />
            : <PostDetails followedPosts={followedPosts} isLoading={false} />
    )
}

export default Home;