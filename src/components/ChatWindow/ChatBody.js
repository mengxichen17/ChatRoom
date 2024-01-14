import React, { useEffect, useState, useRef }  from 'react';
import Message from './Message';
// import { useNavigate } from 'react-router-dom';

const ChatBody = ({ messages, lastMessageRef, onRouteChange, username, socket }) => {
//   const navigate = useNavigate();
    const [currUpvotes, setCurrUpvotes] = useState(0);
    const [activeMessageUpButton, setActiveMessageUpButton] = React.useState("");

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

    // const formatTime = (time) => {
    //     let date = time.split(/[T.]+/g);
    //     date = date.slice(0, -1);
    //     return date.join(' ');
    // }
    
    // const handleUpvote = (e, message_id) => {
    //     e.preventDefault();
    //     // if (message.trim() && localStorage.getItem('userName')) {
    //     if (message_id) {
    //         socket.emit('message_upvote', {
    //           message_id: message_id,
    //         });
    //     }
    //     setActiveMessageUpButton(message_id);
    //     setCurrUpvotes(currUpvotes+1);
    // }

    // const handleDownvote = (e, message_id) => {
    //     e.preventDefault();
    //     if (message_id) {
    //         socket.emit('message_downvote', {
    //             message_id: message_id,
    //         })
    //     }
    // }

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
            {messages.map((messageItem) =>
            <Message message={messageItem} username={username} socket={socket}/>
            // message.name === username ? (
            //     <div className="message__chats" key={message.id}>
            //         <p className="sender__name">{`You ${formatTime(message.time)}`}</p>
            //         <div className="message__sender">
            //             <p>{message.message}</p>
            //             <div className="vote__buttons pointer inline-flex right">
            //                 <button className="vote__button" onClick={(e) => handleUpvote(e, message.message_id)}>Up</button> 
            //                 <button className="vote__button" onClick={(e) => handleDownvote(e, message.message_id)}>Down</button>
            //             </div>
            //         </div>
            //     </div>
                
            // ) : (
            //     <div className="message__chats" key={message.id}>
            //         <p className="sender__other_name">{`${message.name} ${formatTime(message.time)}`}</p>
            //         <div className="message__recipient">
            //             <p>{message.message}</p>
            //             <div className="vote__buttons pointer inline-flex left">
            //                 <button className="vote__other_button" onClick={(e) => handleUpvote(e, message.message_id)}>Up</button> 
            //                 <button className="vote__other_button" onClick={(e) => handleDownvote(e, message.message_id)}>Down</button>
            //             </div>
            //         </div>
            //     </div>
            // )
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