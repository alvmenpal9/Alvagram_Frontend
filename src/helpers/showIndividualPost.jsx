import moment from "moment";
import { Global_url_api } from "../constants/global";
import { cleanDialog } from "../components/user/IndividualFloatingPost";

export const ILike = (post, auth) => {
    let currentUserLiked = false;

    post.forEach(likes => {
        if (likes.usernameLiked === auth?.username) {
            currentUserLiked = true;
        }
    })

    if (currentUserLiked) {
        return 'likes filled'
    } else {
        return 'likes border'
    }
}

export const showLists = (typeList = '', list, navigate) => {
    const listDialog = document.querySelector('#list-dialog');
    document.querySelector('#list-title').textContent = typeList;

    if (typeList.toLowerCase() === 'likes') {
        for (let i = 0; i < list.length; i++) {
            const listItem = document.createElement('LI');
            const listText = document.createElement('P');

            listText.textContent = list[i]?.usernameLiked;
            listText.addEventListener('click', e => {
                document.querySelector('#list-title').textContent = '';
                document.querySelector('#list-ul').innerHTML = '';

                if((document.querySelector('#individual_post_information').open)){
                    cleanDialog();
                }

                document.querySelector('#list-dialog').close();
                navigate(`/profile/${list[i]?.usernameLiked}`)
            })

            listItem.appendChild(listText);
            document.querySelector('#list-ul').appendChild(listItem);
        }
    }

    if (typeList.toLowerCase() === 'followers' || typeList.toLowerCase() === 'following') {
        for (let i = 0; i < list.length; i++) {
            const listItem = document.createElement('LI');
            const listText = document.createElement('P');
            listText.addEventListener('click', e => {
                document.querySelector('#list-title').textContent = '';
                document.querySelector('#list-ul').innerHTML = '';

                if((document.querySelector('#individual_post_information').open)){
                    cleanDialog();
                }

                document.querySelector('#list-dialog').close();
                navigate(`/profile/${list[i]?.username}`)
            })

            listText.textContent = list[i]?.username;

            listItem.appendChild(listText);
            document.querySelector('#list-ul').appendChild(listItem);
        }
    }

    listDialog.showModal();
}

const showIndividualPostContent = (post, auth, navigate) => {
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

    username.textContent = `${post?.UserWhoPosted?.username}`;
    date.textContent = `${moment(post?.Post?.date).format("MMM/D h:mm A")}`

    if (post?.FollowedUser?.image === 'default.png') {
        userImage.src = `/src/assets/img/default.png`;
    } else {
        userImage.src = `${Global_url_api}user/image/download/${post?.UserWhoPosted?.image}`;
    }

    postImage.src = `${Global_url_api}post/image/${post?.Post?.image}`;
    userBottom.textContent = `${post?.UserWhoPosted?.username}`;
    description.textContent = `${post?.Post?.description}`;
    numberOfComments.textContent = `${post?.Comments?.length}`;
    numberOfLikes.textContent = `${post?.AllLikes?.length}`;

    const icons = ILike(post.AllLikes, auth).split(' ');
    likesIcon.classList.add(icons[0], icons[1]);

    username.addEventListener('click', e => {
        navigate(`/profile/${post?.UserWhoPosted?.username}`)
    })

    userImage.addEventListener('click', e => {
        navigate(`/profile/${post?.UserWhoPosted?.username}`)
    })

    userBottom.addEventListener('click', e => {
        navigate(`/profile/${post?.UserWhoPosted?.username}`)
    })

    likesIcon.addEventListener('click', e => {
        showLists('Likes', post.AllLikes, navigate);
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

export default showIndividualPostContent;