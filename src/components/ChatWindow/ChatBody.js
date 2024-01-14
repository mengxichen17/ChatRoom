import React, { useEffect, useState, useRef }  from 'react';
// import { useNavigate } from 'react-router-dom';

const ChatBody = ({ messages, lastMessageRef, onRouteChange, username, socket }) => {
//   const navigate = useNavigate();
    // const [chatHistory, setChatHistory] = useState([]);

    // useEffect(() => {
    //     socket.on('initialization', (data) => setChatHistory([...chatHistory, data[0]]));
    // }, [socket, chatHistory]);

    // console.log("FROM chatbody", chatHistory);

    const handleLeaveChat = () => {
        // localStorage.removeItem('userName');
        // navigate('/');
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

        {/*This shows messages sent from you*/}
        <div className="message__container">
            {messages.map((message) =>
            message.name === username ? (
                <div className="message__chats" key={message.id}>
                    <p className="sender__name">You</p>
                    <div className="message__sender">
                        <p>{message.message}</p>
                        </div>
                </div>
            ) : (
                <div className="message__chats" key={message.id}>
                    <p className="sender__other_name">{message.name}</p>
                    <div className="message__recipient">
                        <p>{message.message}</p>
                    </div>
                </div>
            )
            )}

            {/*This is triggered when a user is typing*/}
            {/* <div className="message__status">
            <p>Someone is typing...</p>
            </div> */}

            <div ref={lastMessageRef} />
        </div>
        </>
    );
};

export default ChatBody;