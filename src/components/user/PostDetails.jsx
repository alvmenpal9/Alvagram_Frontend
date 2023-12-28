import React from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import { Global_url_api } from "../../constants/global";
import { useNavigate } from "react-router-dom";
import IndividualFloatingPost from "./IndividualFloatingPost";

const PostDetails = ({ followedPosts = [], isLoading = true, setRefresh }) => {

    const currentTime = new Date();
    const navigate = useNavigate();
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

    const handleComment = async (postId) => {
        const comment = document.querySelector(`#textarea${postId}`).value;
        try {
            const response = await axios.post(`${Global_url_api}comment/${postId}`, { comment: comment }, {
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
            console.error(error);
        }
    }

    const showIndividualPostContent = (post) => {
        const postWindow = document.querySelector('#individual_post_information');
        const username = document.querySelector('#ind-user');
        const date = document.querySelector('#ind-date');
        const userImage = document.querySelector('#ind-user-image');
        const postImage = document.querySelector('#ind-post-image');
        const userBottom = document.querySelector('#ind-user-bottom');
        const description = document.querySelector('#ind-post-description');
        const commentList = document.querySelector('#list-comments');
        const numberOfComments = document.querySelector('#ind-number-comments');
        const numberOfLikes = document.querySelector('#ind-number-likes');
        const likesIcon = document.querySelector('#ind-likes-icon');

        username.textContent = `${post?.FollowedUser?.username}`;
        date.textContent = `${moment(post?.Post?.date).format("MMM/D h:mm A")}`

        if (post?.FollowedUser?.image === 'default.png') {
            userImage.src = `/src/assets/img/default.png`;
        } else {
            userImage.src = `${Global_url_api}user/image/download/${post?.FollowedUser?.image}`;
        }

        postImage.src = `${Global_url_api}post/image/${post?.Post?.image}`;
        userBottom.textContent = `${post?.FollowedUser?.username}`;
        description.textContent = `${post?.Post?.description}`;
        numberOfComments.textContent = `${post?.Comments?.length}`;
        numberOfLikes.textContent = `${post?.AllLikes?.length}`;

        const icons = ILike(post.AllLikes).split(' ');
        likesIcon.classList.add(icons[0], icons[1]);

        username.addEventListener('click', e => {
            navigate(`/profile/${post?.FollowedUser?.username}`)
        })

        userImage.addEventListener('click', e => {
            navigate(`/profile/${post?.FollowedUser?.username}`)
        })

        userBottom.addEventListener('click', e => {
            navigate(`/profile/${post?.FollowedUser?.username}`)
        })

        for (let i = 0; i < post.Comments.length; i++) {
            const commentItem = document.createElement('LI');
            const commentUser = document.createElement('h4');
            const commentText = document.createElement('P');
            const commentDate = document.createElement('h5');

            commentUser.textContent = post?.Comments[i]?.user;
            commentText.textContent = post?.Comments[i]?.comments;
            commentDate.textContent = `${moment(post?.Comments[i]?.date).format("MMM/D h:mm A")}`;

            commentItem.appendChild(commentUser);
            commentItem.appendChild(commentText);
            commentItem.appendChild(commentDate);

            commentList.appendChild(commentItem);
        }

        postWindow.showModal();
    }

    return (
        !isLoading
            ? (
                <>
                    {followedPosts.map(post => (
                        <article className="post" key={post.Post._id}>
                            <header className="post__information">
                                <h3 onClick={e => navigate(`/profile/${post.FollowedUser.username}`)} >{post.FollowedUser.username} - <span style={{ color: 'var(--dark-gray)', fontWeight: 'normal', fontSize: '18px' }}>{moment(post.Post.date).format("MMM/D h:mm A")}</span></h3>
                                <div className="post__information--avatar" onClick={e => navigate(`/profile/${post.FollowedUser.username}`)}>
                                    {post.FollowedUser.image === 'default.png'
                                        ? <img src="/src/assets/img/default.png" />
                                        : <img src={`${Global_url_api}user/image/download/${post.FollowedUser.image}`} className="avatar" />
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
                                            <p id={`numberComments${post.Post._id}`} >{post.Comments.length}</p>
                                        </li>
                                    </ul>
                                    <p><strong onClick={e => navigate(`/profile/${post.FollowedUser.username}`)}>{post.FollowedUser.username}</strong> {post.Post.description}</p>
                                </div>
                            </section>
                            <section className="post__content--comments">
                                <p onClick={e => showIndividualPostContent(post)}>See all comments...</p>
                                <div className="post__content--comment_action">
                                    <textarea id={`textarea${post.Post._id}`} placeholder="Make a comment..."></textarea>
                                    <div onClick={e => handleComment(post.Post._id)}>
                                        <img src="/src/assets/img/send-message.png" />
                                    </div>
                                </div>
                            </section>
                        </article>
                    ))}

                    <IndividualFloatingPost />
                </>
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