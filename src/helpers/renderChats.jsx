import useAuth from "../hooks/useAuth";

const useRenderChat = (data, container) => {

    const { auth } = useAuth();

    const renderFunction = (data, container) => {
        const time = new Date(data.time);

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
        timeMessage.textContent = time.toTimeString().substring(0, 5);

        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(timeMessage);
        newMessageContainer.appendChild(messageDiv);
        container.appendChild(newMessageContainer);
        container.scrollTop = newMessageContainer.offsetHeight + newMessageContainer.offsetTop;
    }

    return renderFunction;

}

export default useRenderChat;