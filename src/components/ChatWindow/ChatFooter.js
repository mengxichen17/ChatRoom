import React, { useState } from 'react';

const ChatFooter = ({ socket, username }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    // if (message.trim() && localStorage.getItem('userName')) {
    if (message.trim()) {
        socket.emit('message', {
          message: message,
          name: username,
        //   id: `${socket.id}${Math.random()}`,
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