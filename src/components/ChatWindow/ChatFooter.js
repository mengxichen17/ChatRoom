import React, { useState } from 'react';

const ChatFooter = ({ socket, username }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    // if (message.trim() && localStorage.getItem('userName')) {
    if (message.trim()) {
        socket.emit('message', {
          name: username,
          message: message,
          upvotes: 0,
          downvotes: 0,
          time: new Date(),
          message_id: `${socket.id}${Math.random()}`,
          upvotes: 0,
          downvotes: 0
        //   socketID: socket.id,
        });
    }
    setMessage('');
  };
  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type message here"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;