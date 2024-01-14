import React, { useEffect, useState, useRef }  from 'react';

const Message = ({message, username, socket}) => {
    const [currUpvotes, setCurrUpvotes] = useState(parseInt(message.upvotes));
    const [currDownvotes, setCurrDownvotes] = useState(parseInt(message.downvotes));

    const formatTime = (time) => {
        let date = time.split(/[T.]+/g);
        date = date.slice(0, -1);
        return date.join(' ');
    }
    
    const handleUpvote = (e) => {
        e.preventDefault();
        // if (message.trim() && localStorage.getItem('userName')) {
        if (message.message_id) {
            socket.emit('message_upvote', {
              message_id: message.message_id,
            });
        }
        setCurrUpvotes(currUpvotes + 1);
    }

    const handleDownvote = (e) => {
        e.preventDefault();
        if (message.message_id) {
            socket.emit('message_downvote', {
                message_id: message.message_id,
            })
        }
        setCurrDownvotes(currDownvotes + 1);
    }

    return (
        message.name === username ? (
            <div className="message__chats" key={message.id}>
                <p className="sender__name">{`You ${formatTime(message.time)}`}</p>
                <div className="message__sender">
                    <p>{message.message}</p>
                    <div className="vote__buttons pointer inline-flex right">
                        <button className="vote__button" onClick={handleUpvote}>Up (<a>{currUpvotes}</a>)</button> 
                        <button className="vote__button" onClick={handleDownvote}>Down (<a>{currDownvotes}</a>)</button>
                    </div>
                </div>
            </div>
            
        ) : (
            <div className="message__chats" key={message.id}>
                <p className="sender__other_name">{`${message.name} ${formatTime(message.time)}`}</p>
                <div className="message__recipient">
                    <p>{message.message}</p>
                    <div className="vote__buttons pointer inline-flex left">
                        <button className="vote__other_button" onClick={handleUpvote}>Up (<a>{currUpvotes}</a>)</button> 
                        <button className="vote__other_button" onClick={handleDownvote}>Down (<a>{currDownvotes}</a>)</button>
                    </div>
                </div>
            </div>
        )
    )
};

export default Message;