import React from "react";

const Messages = () => {
    return (
        <section className="main_content chat">
            <div className="chat-list">
                <h1>Chats</h1>
            </div>
            <div className="chat-content">
                <ul className="message-container" id="message-container">
                    <li className="message-left">
                        <p className="message">
                            Message Left
                            <span>12:10PM</span>
                        </p>
                    </li>
                    <li className="message-right">
                        <p className="message">
                            Message Right
                            <span>12:11PM</span>
                        </p>
                    </li>
                    <li className="message-feedback">
                        <p className="feedback" id="feedback">
                            Alvaro is typing a message
                        </p>
                    </li>
                </ul>

                <form id="message-form" className="message-form">
                    <input type="text" name="message" id="message-input" className="message-input" />
                    <div className="v-divider">
                        <button type="submit" className="send-button">Send</button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default Messages;