import React, { useEffect, useState, useRef } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

const ChatWidow = ({ socket, onRouteChange, username, chatHistory }) => {
    const [messages, setMessages] = useState(chatHistory);  
    const [typingStatus, setTypingStatus] = useState('');
    const lastMessageRef = useRef(null); 

    useEffect(() => {
        socket.on('messageResponse', (data) => setMessages([...messages, data]));
      }, [socket, messages]);

    // useEffect(() => {
    //     socket.on('message_upvote_updated', (data) => {
    //         console.log("received signal that one message upvoted: ", data);
    //         console.log("voted by: ", data.sender, " username: ", username);
    //         if (data.sender != username) {
    //             // only need to update when it's voted by other senders
    //             messages.forEach(message => {
    //             if (message.message_id === data.message_id) {
    //                 message.upvotes = parseInt(message.upvotes) + 1;
    //             }
    //             // console.log("after message_upvote_updated: ", messages)
    //             setMessages([...messages]);
    //             });
    //         }
    //         console.log("after message_upvote_updated: ", messages)
    //     });
    // }, [socket, messages]);
    // console.log("messages: ", messages);

    useEffect(() => {
    // scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chat">
        {/* <ChatBar socket={socket} /> */}
        <div className="chat__main">
            <ChatBody messages={messages} lastMessageRef={lastMessageRef} onRouteChange={onRouteChange} username={username} socket={socket}/>
            <ChatFooter socket={socket} username={username}/>
        </div>
        </div>
    );
};

export default ChatWidow;