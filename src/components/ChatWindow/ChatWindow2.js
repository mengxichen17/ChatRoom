import React, { useEffect, useState, useRef } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

const ChatPage = ({ socket, onRouteChange, username, chatHistory }) => {
    const [messages, setMessages] = useState(chatHistory);  
    const [typingStatus, setTypingStatus] = useState('');
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

export default ChatPage;