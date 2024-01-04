import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Global_url_api } from "../../constants/global";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Messages = ({ socket }) => {

    //INITIALIZE WEB SOCKET, MAKE SURE TO ADD CORS IN THE BACKEND
    const { auth } = useAuth();
    const [userToMessage, setUserToMessage] = useState([]);
    const [chatList, setChatList] = useState([{}])
    const [isLoading, setIsLoading] = useState(true);
    const [chatExists, setChatExists] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    let userExists = false;

    useEffect(() => {
        socket.emit('Get Chats');

        socket.on('Fetched Chats', data => {
            setChatList(data)
            setIsLoading(false);
        });

        socket.on('Chat Created', data => {
            setChatList(prevChatList => [...prevChatList, data])
            console.log(data);
        });

        socket.on('Message Received', data => {
            const time = new Date(data.time);

            const chatHistory = document.querySelector('#message-container');

            const newMessageContainer = document.createElement('LI');
            newMessageContainer.classList.add('message-li');

            const messageDiv = document.createElement('DIV');
            if (data.from === auth.username) {
                messageDiv.classList.add('message-right');
            } else {
                messageDiv.classList.add('message-left');
            };

            const messageContent = document.createElement('P');
            messageContent.classList.add('message');
            messageContent.textContent = data.message;

            const timeMessage = document.createElement('P');
            timeMessage.classList.add('time');
            timeMessage.textContent = time.toTimeString().substring(0,5);

            messageDiv.appendChild(messageContent);
            messageDiv.appendChild(timeMessage);
            newMessageContainer.appendChild(messageDiv);
            chatHistory.appendChild(newMessageContainer);
        })
    }, []);

    const lookForUser = async (e) => {
        e.preventDefault();
        const { userToText } = e.target;

        try {
            if (userToText.value !== auth.username) {

                const response = await axiosPrivate.get(`${Global_url_api}user/`);
                if (response?.status === 200) {
                    response.data.users.forEach(user => {
                        if (user.username === userToText.value) {
                            userExists = true;
                        }
                    })
                }

                if (userExists) {
                    socket.emit('New Chat', {
                        fromUser: auth.username,
                        toUser: userToText.value
                    })
                }
            }
        } catch (error) {
            if(error?.response?.status === 403) {
                navigate('/login', {state: {from: location}, replace: true});
            }
        }

        userToText.value = '';

    }

    const sendMessage = (e, chatId) => {
        e.preventDefault();
        if (e.target.message.value !== '') {
            const message = e.target.message.value;
            socket.emit('Send Message', {
                from: auth.username,
                to: userToMessage[0].username,
                message: message,
                chatId: chatId
            })
        }
        e.target.message.value = '';
    }

    const joinChat = (chatId) => {
        console.log(socket.id);
        socket.emit('Join Chat', {
            chatId: chatId
        });
    }

    return (
        isLoading
            ? ''
            : (
                <section className="main_content chat">
                    <>
                        <div className="chat-list">
                            <h1>Chats</h1>
                            <form onSubmit={lookForUser}>
                                <input type="text" placeholder="Search a user" name="userToText" />
                            </form>
                            <ul className="current-chats">
                                {chatList.length > 0
                                    ? chatList.map(chat => (
                                        auth.username === chat.toUser
                                            ?
                                            <li key={chat._id} onClick={
                                                e => {
                                                    joinChat(chat._id);
                                                    setUserToMessage([{
                                                        chatId: chat._id,
                                                        username: chat.fromUser
                                                    }]);
                                                }
                                            }>
                                                <h3>{chat.fromUser}</h3>
                                            </li>
                                            :
                                            <li key={chat._id} onClick={
                                                e => {
                                                    joinChat(chat._id);
                                                    setUserToMessage([{
                                                        chatId: chat._id,
                                                        username: chat.toUser
                                                    }]);
                                                }
                                            }>
                                                <h3>{chat.toUser}</h3>
                                            </li>
                                    ))
                                    : ''
                                }
                            </ul>
                        </div>
                        {chatList.length === 0
                            ?
                            <div className="chat-content empty">
                                <h1>Start a conversation with anyone!</h1>
                            </div>
                            :
                            userToMessage?.length > 0
                                ? (
                                    <div className="chat-content">
                                        <header style={{ backgroundColor: 'var(--primary-color)', height: '10%', display: 'flex', alignItems: 'center', paddingLeft: '20px', color: 'var(--white)' }}>
                                            <h1>{userToMessage[0].username}</h1>
                                        </header>
                                        <ul className="message-container" id="message-container">
                                            {/* <li className="message-feedback">
                                                <p className="feedback" id="feedback">
                                                    Alvaro is typing a message
                                                </p>
                                            </li> */}
                                        </ul>

                                        <form id="message-form" className="message-form" onSubmit={e => sendMessage(e, userToMessage[0].chatId)}>
                                            <input type="text" name="message" id="message-input" className="message-input" placeholder="Type a message..." />
                                            <div className="v-divider">
                                                <button type="submit" className="send-button">→</button>
                                            </div>
                                        </form>
                                    </div >
                                )
                                : ''
                        }
                    </>
                </section >
            )
    )
}

export default Messages;