import React from "react";

import { Global_url_api } from "../../constants/global";
const PostDetails = ({ followedPosts = [], isLoading = true }) => {

    console.log(followedPosts);

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
                                        <div className="likes"></div>
                                        <p>{post.Post.likes}</p>
                                    </li>
                                </ul>
                                <p>{post.Post.description}</p>
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