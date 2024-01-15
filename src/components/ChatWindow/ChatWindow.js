import React, { useEffect, useState, useRef } from 'react';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

const ChatWidow = ({ socket, onRouteChange, username, chatHistory }) => {
    const [messages, setMessages] = useState(chatHistory);  
    const lastMessageRef = useRef(null); 

    useEffect(() => {
        socket.on('messageResponse', (data) => setMessages([...messages, data]));
      }, [socket, messages]);

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