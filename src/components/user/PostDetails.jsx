import React from "react";
import axios from "axios";
import { Global_url_api } from "../../constants/global";
import useAuth from "../../hooks/useAuth";

const PostDetails = ({ followedPosts = [], isLoading = true }) => {

    const { auth } = useAuth();

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
            if(likes.usernameLiked === auth.username){
                currentUserLiked = true;
            }
        })

        if(currentUserLiked){
            return 'likes filled'
        }else{
            return 'likes border'
        }
    }

    return (
        !isLoading
            ? (
                followedPosts.map(post => (
                    <article className="post" key={post.Post._id}>
                        <header className="post__information">
                            <h3>{post.FollowedUser.username}</h3>
                            <div className="post__information--avatar">
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
                                <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                                    <li>
                                        <div id={`logoLikes${post.Post._id}`} className= {ILike(post.AllLikes)}
                                        onClick={e => handleLike(post.Post._id)}></div>
                                        <p id={`numberLikes${post.Post._id}`}>{post.Post.likes}</p>
                                    </li>
                                </ul>
                                <p><strong style={{ color: 'var(--primary-color_dark)' }}>{post.FollowedUser.username}</strong> {post.Post.description}</p>
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
                            {/* <img src={`${Global_url_api}post/image/${post.Post.image}`} /> */}
                        </div>
                        <div className="post__content--details">

                        </div>
                        {/* <p>{post.Post.description}</p> */}
                    </section>
                </article>
            )
    )

}

export default PostDetails;