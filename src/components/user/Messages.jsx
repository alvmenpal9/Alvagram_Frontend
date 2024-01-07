import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Global_url_api } from "../../constants/global";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useRenderChat from "../../helpers/renderChats";

const Messages = ({ socket }) => {

    //INITIALIZE WEB SOCKET, MAKE SURE TO ADD CORS IN THE BACKEND
    const { auth } = useAuth();
    const [userToMessage, setUserToMessage] = useState([]);
    const [chatList, setChatList] = useState([{}])
    const [isLoading, setIsLoading] = useState(true);
    const [chatExists, setChatExists] = useState(false);
    const [isMobile, setIsMobile] = useState();
    const axiosPrivate = useAxiosPrivate();
    const renderFunction = useRenderChat();
    let userExists = false;

    useEffect(() => {

        const userAgent = navigator.userAgent;
        const mobile = /Mobi|Android/i.test(userAgent);

        setIsMobile(mobile);

        socket.connect();

        socket.emit('Get Chats');

        socket.on('Fetched Chats', data => {
            setChatList(data)
            setIsLoading(false);
        });

        socket.on('Chat Created', data => {
            setChatList(prevChatList => [...prevChatList, data])
        });

        socket.on('Message Received', data => {
            const chatHistory = document.querySelector('#message-container');
            renderFunction(data, chatHistory);
        })

        socket.on('Retrieve Chat', data => {
            const chatHistory = document.querySelector('#message-container');
            data.forEach(message => {
                renderFunction(message, chatHistory);
            })
        })

        setIsLoading(false);

        return () => {
            socket.disconnect();
            socket.off('Fetched Chats')
            socket.off('Chat Created')
            socket.off('Message Received')
            socket.off('Retrieve Chat')
            setIsLoading(true);
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            if (isMobile) {
                document.querySelector('.chat-list').style.display = 'none';
            }
            document.querySelector('.chat-content').style.display = 'block';
            document.querySelector('#message-container').innerHTML = '';
            joinChat(userToMessage[0]?.chatId);
        }
    }, [userToMessage])

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
            if (error?.response?.status === 403) {
                navigate('/login', { state: { from: location }, replace: true });
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
                                <input type="text" placeholder="Chat..." name="userToText" />
                            </form>
                            {chatList.length > 0
                                ? (
                                    <ul className="current-chats">
                                        {chatList.map(chat => (
                                            auth.username === chat.toUser
                                                ?
                                                <li key={chat._id} onClick={
                                                    e => {
                                                        setUserToMessage([{
                                                            chatId: chat?._id,
                                                            username: chat?.fromUser
                                                        }]);
                                                    }
                                                }>
                                                    <h3>{chat.fromUser}</h3>
                                                </li>
                                                :
                                                <li key={chat._id} onClick={
                                                    e => {
                                                        setUserToMessage([{
                                                            chatId: chat._id,
                                                            username: chat.toUser
                                                        }]);
                                                    }
                                                }>
                                                    <h3>{chat.toUser}</h3>
                                                </li>
                                        ))}
                                    </ul>
                                )
                                : ''
                            }
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
                                        </ul>

                                        <form id="message-form" className="message-form" onSubmit={e => sendMessage(e, userToMessage[0].chatId)}>
                                            <input type="text" name="message" id="message-input" className="message-input" placeholder="Type a message..." autoFocus />
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