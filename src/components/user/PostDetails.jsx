import React from "react";
import axios from "axios";
import { Global_url_api } from "../../constants/global";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const PostDetails = ({ followedPosts = [], isLoading = true }) => {

    const { auth } = useAuth();
    const navigate = useNavigate();
    const currentTime = new Date();

    const handleLike = async (postId) => {

        try {
            const response = await axios.get(`${Global_url_api}like/${postId}`, {
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
            console.error(error);
        }
    }

    const ILike = (post) => {
        let currentUserLiked = false;

        post.forEach(likes => {
            if (likes.usernameLiked === auth.username) {
                currentUserLiked = true;
            }
        })

        if (currentUserLiked) {
            return 'likes filled'
        } else {
            return 'likes border'
        }
    }

    return (
        !isLoading
            ? (
                followedPosts.map(post => (
                    <article className="post" key={post.Post._id}>
                        <header className="post__information">
                            <h3 onClick={e => navigate(`/profile/${post.FollowedUser.username}`)} >{post.FollowedUser.username} - <span style={{color:'var(--dark-gray)', fontWeight: 'normal', fontSize: '18px'}}>{moment(post.Post.date).format("MMM/D h:mm A")}</span></h3>
                            <div className="post__information--avatar" onClick={e => navigate(`/profile/${post.FollowedUser.username}`)}>
                                {post.FollowedUser.image === 'default.png'
                                    ? <img src="/src/assets/img/default.png" className="avatar" />
                                    : <img src={`${Global_url_api}`} className="avatar" />
                                }
                            </div>
                        </header>
                        <section className="post__content">
                            <div className="post__content--image">
                                <img src={`${Global_url_api}post/image/${post.Post.image}`} />
                            </div>
                            <div className="post__content--details">
                                <ul style={{ listStyle: 'none', paddingLeft: '0', display: 'flex', columnGap: '10px' }}>
                                    <li>
                                        <div id={`logoLikes${post.Post._id}`} className={ILike(post.AllLikes)}
                                            onClick={e => handleLike(post.Post._id)}></div>
                                        <p id={`numberLikes${post.Post._id}`}>{post.Post.likes}</p>
                                    </li>
                                    <li>
                                        <div className='comments'></div>
                                        <p>0</p>
                                    </li>
                                </ul>
                                <p><strong onClick={e => navigate(`/profile/${post.FollowedUser.username}`)}>{post.FollowedUser.username}</strong> {post.Post.description}</p>
                            </div>
                        </section>
                        <section className="post__content--comments">
                            <p>See all comments...</p>
                                <div className="post__content--comment_action">
                                    <textarea placeholder="Make a comment..."></textarea>
                                    <div>
                                        <img src="/src/assets/img/send-message.png" />
                                    </div>
                                </div>
                        </section>
                    </article>
                ))
            )
            :
            (
                <article className="post">
                    <header className="post__information">
                        <h3>Username</h3>
                        <div className="post__information--avatar">
                            <img src="/src/assets/img/default.png" />
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