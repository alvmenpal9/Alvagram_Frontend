import React from "react";
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import IndividualFloatingPost from "./IndividualFloatingPost";
import showIndividualPostContent, { ILike } from "../../helpers/showIndividualPost";
import List from "../List";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const PostDetails = ({ followedPosts = [], isLoading = true, setRefresh }) => {

    const currentTime = new Date();
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const showIndividualPost = showIndividualPostContent;
    const ILikeFunction = ILike;
    
    const handleLike = async (postId) => {

        try {
            const response = await axiosPrivate.get(`${process.env.REACT_APP_GLOBAL_URL_API}like/${postId}`, {
                headers: {
                    Authorization: auth.accessToken
                }
            })

            if (response?.status === 200) {
                const numberLikes = document.querySelector(`#numberLikes${postId}`);
                const divLikes = document.querySelector(`#logoLikes${postId}`);
                if (response?.data?.message === 'Liked') {
                    divLikes.classList.remove('border');
                    divLikes.classList.add('filled');
                    numberLikes.textContent = parseInt(numberLikes.textContent) + 1
                }
                if (response?.data?.message === 'Disliked') {
                    divLikes.classList.remove('filled');
                    divLikes.classList.add('border');
                    numberLikes.textContent = parseInt(numberLikes.textContent) - 1
                }
            }
        } catch (error) {
            if(error?.response?.status === 403) {
                navigate('/login', {state: {from: location}, replace: true});
            }
        }
    }

    const handleComment = async (postId) => {
        const comment = document.querySelector(`#textarea${postId}`).value;
        try {
            const response = await axiosPrivate.post(`${process.env.REACT_APP_GLOBAL_URL_API}comment/${postId}`, { comment: comment }, {
                headers: {
                    Authorization: auth.accessToken
                },
                timeout: 5000
            })
            if (response?.status === 200) {
                const numberComments = document.querySelector(`#numberComments${postId}`);
                numberComments.textContent = parseInt(numberComments.textContent) + 1;
                document.querySelector(`#textarea${postId}`).value = '';
                setRefresh(true);
            }
        } catch (error) {
            if(error?.response?.status === 403) {
                navigate('/login', {state: {from: location}, replace: true});
            }
        }
    }

    return (
        !isLoading
            ? (
                <>
                    {followedPosts.map(post => (
                        <article className="post" key={post.Post._id}>
                            <header className="post__information">
                                <h3 onClick={e => navigate(`/profile/${post.UserWhoPosted.username}`)} >{post.UserWhoPosted.username} - <span style={{ color: 'var(--dark-gray)', fontWeight: 'normal', fontSize: '18px' }}>{moment(post.Post.date).format("MMM/D h:mm A")}</span></h3>
                                <div className="post__information--avatar" onClick={e => navigate(`/profile/${post.UserWhoPosted.username}`)}>
                                    {post.UserWhoPosted.image === 'default.png'
                                        ? <img src="/assets/img/default.png" />
                                        : <img src={`${process.env.REACT_APP_GLOBAL_URL_API}user/image/download/${post.UserWhoPosted.image}`} className="avatar" />
                                    }
                                </div>
                            </header>
                            <section className="post__content">
                                <div className="post__content--image">
                                    <img src={`${process.env.REACT_APP_GLOBAL_URL_API}post/image/${post.Post.image}`} />
                                </div>
                                <div className="post__content--details">
                                    <ul style={{ listStyle: 'none', paddingLeft: '0', display: 'flex', columnGap: '10px' }}>
                                        <li>
                                            <div id={`logoLikes${post.Post._id}`} className={ILikeFunction(post.AllLikes, auth)}
                                                onClick={e => handleLike(post.Post._id)}></div>
                                            <p id={`numberLikes${post.Post._id}`}>{post.Post.likes}</p>
                                        </li>
                                        <li>
                                            <div className='comments'></div>
                                            <p id={`numberComments${post.Post._id}`} >{post.Comments.length}</p>
                                        </li>
                                    </ul>
                                    <p><strong onClick={e => navigate(`/profile/${post.UserWhoPosted.username}`)}>{post.UserWhoPosted.username}</strong> {post.Post.description}</p>
                                </div>
                            </section>
                            <section className="post__content--comments">
                                <p onClick={e => showIndividualPost(post, auth, navigate)}>See all comments...</p>
                                <div className="post__content--comment_action">
                                    <textarea id={`textarea${post.Post._id}`} placeholder="Make a comment..."></textarea>
                                    <div onClick={e => handleComment(post.Post._id)}>
                                        <img src="/assets/img/send-message.png" />
                                    </div>
                                </div>
                            </section>
                        </article>
                    ))}

                    <IndividualFloatingPost />
                    <List />
                </>
            )
            :
            (
                <article className="post">
                    <header className="post__information">
                        <h3>Username</h3>
                        <div className="post__information--avatar">
                            <img src="/assets/img/default.png" />
                        </div>
                    </header>
                    <section className="post__content">
                        <div className="post__content--image">
                        </div>
                        <div className="post__content--details">

                        </div>
                    </section>
                </article>
            )
    )

}

export default PostDetails;