import React  from 'react';
import Message from './Message';

const ChatBody = ({ messages, lastMessageRef, onRouteChange, username, socket }) => {

    const handleLeaveChat = () => {
        onRouteChange('signin');
        window.location.reload();
    };

    return (
        <>
        <header className="chat__mainHeader">
            <p>Public Room</p>
            <button className="leaveChat__btn" onClick={handleLeaveChat}>
            LEAVE CHAT
            </button>
        </header>

        {/*This shows messages*/}
        <div className="message__container">
            {messages.map((messageItem) =>
                <Message message={messageItem} username={username} socket={socket}/>
            )}

            <div ref={lastMessageRef} />
        </div>
        </>
    );
};

export default ChatBody;