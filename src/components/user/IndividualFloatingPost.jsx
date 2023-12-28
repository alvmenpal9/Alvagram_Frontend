import React from "react";

const IndividualFloatingPost = () => {

    const cleanDialog = (e) => {
        document.querySelector('#ind-user').textContent = '';
        document.querySelector('#ind-date').textContent = '';
        document.querySelector('#ind-user-image').textContent = '';
        document.querySelector('#ind-post-image').src = '';
        document.querySelector('#ind-user-bottom').textContent = '';
        document.querySelector('#ind-post-description').textContent = '';
        document.querySelector('#ind-number-comments').textContent = '';
        document.querySelector('#ind-number-likes').textContent = '';
        document.querySelector('#ind-likes-icon').className = '';
        const list = document.querySelector('#list-comments');
        list.innerHTML = '';

        document.querySelector('#individual_post_information').close();
    }

    return(
        <dialog id="individual_post_information" className="individual_post">
                        <button className="close-dialog" onClick={cleanDialog}>X</button>

                        <header className="post__information">
                            <h2 style={{ color: 'var(--primary-color_dark)', cursor: 'pointer' }} id="ind-user">Username</h2>
                            <div className="post__information--avatar">
                                <img id="ind-user-image" alt="profile picture" />
                            </div>
                        </header>
                        <section className="individual__post__content">
                            <div className="individual__post__content--image">
                                <img id="ind-post-image" alt="post picture" />
                            </div>
                            <div className="individual__post__content--details">
                                <div style={{ textAlign: 'left', paddingLeft: '15px' }}>
                                    <h3 id="ind-user-bottom" style={{ color: 'var(--primary-color_dark)', cursor: 'pointer' }}></h3>
                                    <p id="ind-post-description"></p>
                                    <h4 style={{ textAlign: 'right', color: 'var(--dark-gray)' }} id="ind-date"></h4>
                                </div>
                                <ul style={{ listStyle: 'none', paddingLeft: '0', display: 'flex', columnGap: '10px', marginTop: '7px', justifyContent: 'center' }}>
                                    <li style={{ display: 'flex' }}>
                                        <p id="ind-number-likes" style={{ marginRight: '5px' }}></p>
                                        <div id="ind-likes-icon" style={{ width: '25px' }}></div>
                                    </li>
                                    <li style={{ display: 'flex' }}>
                                        <p id='ind-number-comments' style={{ marginRight: '3px' }}>0</p>
                                        <div className='comments' style={{ width: '25px' }}></div>
                                    </li>
                                </ul>
                                <ul id="list-comments" style={{ paddingLeft: '15px' }}>

                                </ul>
                                <textarea placeholder="Make a comment" style={{resize:'none'}}>

                                </textarea>
                            </div>
                        </section>
                    </dialog>
    )
}

export default IndividualFloatingPost;